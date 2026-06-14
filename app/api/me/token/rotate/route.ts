import { NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import { createClient } from '@/app/lib/supabase/server'
import { createAdminClient } from '@/app/lib/supabase/admin'

export const runtime = 'nodejs'

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000

/**
 * Rotate the signed-in user's API token: issue a fresh value, reset the 90-day
 * expiry, clear last_used_at, keep revoked=false. The OLD token immediately
 * resolves to anonymous via getEntitlement. The settings UI (Plan 4) calls
 * this; it is the one-click fix for a leaked token.
 */
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const token = 'aic_' + randomBytes(24).toString('hex')
  const admin = createAdminClient()
  const { error } = await admin
    .from('user_api_keys')
    .update({
      token,
      expires_at: new Date(Date.now() + NINETY_DAYS_MS).toISOString(),
      last_used_at: null,
      revoked: false,
    })
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: 'rotation failed' }, { status: 500 })
  return NextResponse.json({ token })
}
