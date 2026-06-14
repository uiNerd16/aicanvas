import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { isPremiumNow, type SubStatus } from '@/lib/identity/tier'

export const runtime = 'nodejs'

/**
 * Returns the SIGNED-IN caller's real tier for client UI (pricing page,
 * badges). Session-only on purpose: this is a "who am I" endpoint, so it must
 * not honor ?token=/Bearer — that would turn any leaked token into an
 * unauthenticated premium-status oracle. Errors are 503 (distinct from
 * anonymous) so the UI can show an unknown state instead of mislabeling a
 * premium user as free.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ tier: 'anonymous' })

    // RLS restricts the select to the caller's own row.
    const { data: sub, error } = await supabase
      .from('user_subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .maybeSingle()
    if (error) return NextResponse.json({ tier: null }, { status: 503 })

    const premium = sub
      ? isPremiumNow(sub.status as SubStatus, sub.current_period_end ?? null)
      : false
    return NextResponse.json({ tier: premium ? 'premium' : 'free' })
  } catch {
    return NextResponse.json({ tier: null }, { status: 503 })
  }
}
