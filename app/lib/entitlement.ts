import 'server-only'
import { extractToken } from '@/lib/identity/token'
import { deriveTier, type SubStatus } from '@/lib/identity/tier'
import type { Tier } from '@/lib/registry/entitlement'
import { createAdminClient } from '@/app/lib/supabase/admin'
import { createClient } from '@/app/lib/supabase/server'

export interface Entitlement {
  tier: Tier
  userId: string | null
}

type AdminClient = ReturnType<typeof createAdminClient>

/**
 * Resolve a request to a tier + user. The single entry point Plan 3's gate
 * calls. Token path first (CLI/MCP), then the website session (cookies).
 */
export async function getEntitlement(req: Request): Promise<Entitlement> {
  const token = extractToken(req)

  if (token) {
    const admin = createAdminClient()
    const { data: key } = await admin
      .from('user_api_keys')
      .select('user_id, expires_at')
      .eq('token', token)
      .eq('revoked', false)
      .maybeSingle()
    if (!key) return { tier: 'anonymous', userId: null } // bad/revoked token
    if (key.expires_at && new Date(key.expires_at) < new Date()) {
      return { tier: 'anonymous', userId: null } // expired — rotate in settings
    }
    // Fire-and-forget usage stamp so leaked-token anomalies are detectable.
    void admin
      .from('user_api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('user_id', key.user_id)
      .then(() => {})
    const status = await fetchStatus(admin, key.user_id)
    return { tier: deriveTier({ hasUser: true, status }), userId: key.user_id }
  }

  // No token: fall back to the website session (cookies).
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { tier: 'anonymous', userId: null }
  const admin = createAdminClient()
  const status = await fetchStatus(admin, user.id)
  return { tier: deriveTier({ hasUser: true, status }), userId: user.id }
}

async function fetchStatus(admin: AdminClient, userId: string): Promise<SubStatus> {
  const { data } = await admin
    .from('user_subscriptions')
    .select('status')
    .eq('user_id', userId)
    .maybeSingle()
  return (data?.status as SubStatus) ?? 'none'
}
