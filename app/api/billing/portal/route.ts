import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export const runtime = 'nodejs'

const PADDLE_API = process.env.PADDLE_ENV === 'sandbox'
  ? 'https://sandbox-api.paddle.com'
  : 'https://api.paddle.com'

/** Returns a Paddle customer-portal URL for the signed-in user, or null. */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ url: null }, { status: 401 })

  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) return NextResponse.json({ url: null })

  // RLS owner-read; resilient if the table doesn't exist yet.
  const { data: sub, error } = await supabase
    .from('user_subscriptions')
    .select('paddle_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error || !sub?.paddle_customer_id) return NextResponse.json({ url: null })

  const res = await fetch(
    `${PADDLE_API}/customers/${sub.paddle_customer_id}/portal-sessions`,
    { method: 'POST', headers: { Authorization: `Bearer ${apiKey}` } },
  )
  if (!res.ok) return NextResponse.json({ url: null })
  const j = await res.json()
  return NextResponse.json({ url: j?.data?.urls?.general?.overview ?? null })
}
