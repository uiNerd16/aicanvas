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
    const sub = await fetchSubscription(admin, key.user_id)
    return {
      tier: deriveTier({ hasUser: true, status: sub.status, currentPeriodEnd: sub.currentPeriodEnd }),
      userId: key.user_id,
    }
  }

  // No token: fall back to the website session (cookies).
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { tier: 'anonymous', userId: null }
  const admin = createAdminClient()
  const sub = await fetchSubscription(admin, user.id)
  return {
    tier: deriveTier({ hasUser: true, status: sub.status, currentPeriodEnd: sub.currentPeriodEnd }),
    userId: user.id,
  }
}

async function fetchSubscription(
  admin: AdminClient,
  userId: string,
): Promise<{ status: SubStatus; currentPeriodEnd: string | null }> {
  const { data } = await admin
    .from('user_subscriptions')
    .select('status, current_period_end')
    .eq('user_id', userId)
    .maybeSingle()
  return {
    status: (data?.status as SubStatus) ?? 'none',
    currentPeriodEnd: data?.current_period_end ?? null,
  }
}
