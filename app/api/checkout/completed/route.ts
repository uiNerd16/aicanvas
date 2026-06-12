import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { createAdminClient } from '@/app/lib/supabase/admin'

export const runtime = 'nodejs'

const PADDLE_API = process.env.PADDLE_ENV === 'sandbox'
  ? 'https://sandbox-api.paddle.com'
  : 'https://api.paddle.com'

/**
 * Verified-optimistic activation. The overlay's checkout.completed callback
 * passes the transaction id; we confirm it against the Paddle API (status +
 * the custom_data.user_id we set at checkout open) BEFORE writing anything.
 *
 * A session alone must never grant durable premium: the endpoint is
 * discoverable in the public repo, and a forged call would never be reconciled
 * by a webhook (no checkout = no Paddle event). The webhook remains the durable
 * source of truth; this only fast-paths what Paddle will confirm anyway.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'not configured' }, { status: 503 })

  const { transactionId } = await req.json().catch(() => ({}))
  if (typeof transactionId !== 'string' || !transactionId.startsWith('txn_')) {
    return NextResponse.json({ error: 'missing transactionId' }, { status: 400 })
  }

  // Server-to-server: fetch the transaction and verify it is real, paid, ours.
  const res = await fetch(`${PADDLE_API}/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) return NextResponse.json({ error: 'unknown transaction' }, { status: 403 })
  const { data: txn } = await res.json()

  const paidStatuses = new Set(['completed', 'paid'])
  if (!paidStatuses.has(txn?.status)) {
    return NextResponse.json({ error: 'transaction not paid' }, { status: 403 })
  }
  if (txn?.custom_data?.user_id !== user.id) {
    return NextResponse.json({ error: 'transaction user mismatch' }, { status: 403 })
  }

  const interval = txn?.items?.[0]?.price?.billing_cycle?.interval
  const admin = createAdminClient()
  await admin.from('user_subscriptions').upsert({
    user_id: user.id,
    status: 'active',
    plan: interval === 'year' ? 'annual' : 'monthly',
    paddle_customer_id: txn?.customer_id ?? null,
    paddle_subscription_id: txn?.subscription_id ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })

  return NextResponse.json({ ok: true })
}
