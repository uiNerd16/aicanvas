import { NextRequest, NextResponse } from 'next/server'
import { verifyPaddleSignature } from '@/lib/identity/paddle-signature'
import { createAdminClient } from '@/app/lib/supabase/admin'
import type { SubStatus } from '@/lib/identity/tier'

export const runtime = 'nodejs'

// Only react to subscription lifecycle events; the STATUS comes from the
// payload's data.status, NEVER from the event name. (An event-name map is a
// resurrection bug: `subscription.updated` fires for incidental changes on
// past_due/canceled subscriptions too, and mapping it to 'active' would
// silently re-grant premium to lapsed accounts.)
const SUBSCRIPTION_EVENTS = new Set([
  'subscription.activated',
  'subscription.created',
  'subscription.updated',
  'subscription.trialing',
  'subscription.past_due',
  'subscription.paused',
  'subscription.resumed',
  'subscription.canceled',
])

// Paddle data.status values -> our SubStatus. Unknown statuses are ignored.
const PADDLE_STATUS: Record<string, SubStatus> = {
  active: 'active',
  trialing: 'trialing',
  past_due: 'past_due',
  paused: 'paused',
  canceled: 'canceled',
}

export async function POST(req: NextRequest) {
  // Fail CLOSED on misconfiguration: HMAC with an empty key is publicly
  // computable, so an unset secret must never fall back to ''.
  const secret = process.env.PADDLE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'webhook not configured' }, { status: 503 })

  const raw = await req.text() // RAW body — required for the signature.
  const ok = verifyPaddleSignature(
    raw,
    req.headers.get('paddle-signature'),
    secret,
    Math.floor(Date.now() / 1000),
  )
  if (!ok) return NextResponse.json({ error: 'bad signature' }, { status: 401 })

  const evt = JSON.parse(raw)
  if (!SUBSCRIPTION_EVENTS.has(evt.event_type)) {
    return NextResponse.json({ ok: true, ignored: evt.event_type })
  }

  const data = evt.data ?? {}
  const status = PADDLE_STATUS[data.status]
  if (!status) return NextResponse.json({ ok: true, ignored_status: data.status })

  const userId: string | undefined = data.custom_data?.user_id
  if (!userId) return NextResponse.json({ ok: true, note: 'no user_id' })

  const occurredAt: string | null = evt.occurred_at ?? null
  const plan =
    data.items?.[0]?.price?.billing_cycle?.interval === 'year' ? 'annual' : 'monthly'

  const admin = createAdminClient()

  // Idempotency / ordering guard: Paddle retries re-sign with a fresh
  // timestamp, so the signature window does not stop replays or late
  // out-of-order events. Discard anything not newer than the stored state.
  if (occurredAt) {
    const { data: existing } = await admin
      .from('user_subscriptions')
      .select('last_event_at')
      .eq('user_id', userId)
      .maybeSingle()
    if (existing?.last_event_at && existing.last_event_at >= occurredAt) {
      return NextResponse.json({ ok: true, stale: true })
    }
  }

  await admin.from('user_subscriptions').upsert({
    user_id: userId,
    paddle_customer_id: data.customer_id ?? null,
    paddle_subscription_id: data.id ?? null,
    status,
    plan,
    current_period_end: data.current_billing_period?.ends_at ?? null,
    last_event_at: occurredAt,
    updated_at: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}
