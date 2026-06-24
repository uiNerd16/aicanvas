import { NextRequest, NextResponse } from 'next/server'
import { verifyPaddleSignature } from '@/lib/identity/paddle-signature'
import { createAdminClient } from '@/app/lib/supabase/admin'
import { mapSubscriptionFields } from '@/lib/identity/sub-mapping'

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

  // 400 (not 500) on malformed JSON so Paddle stops retrying a permanently
  // broken payload.
  let evt: { event_type?: string; occurred_at?: string; data?: Record<string, unknown> }
  try {
    evt = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
  if (!evt.event_type || !SUBSCRIPTION_EVENTS.has(evt.event_type)) {
    return NextResponse.json({ ok: true, ignored: evt.event_type ?? 'unknown' })
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const data: any = evt.data ?? {}
  const fields = mapSubscriptionFields(data)
  if (!fields.status) return NextResponse.json({ ok: true, ignored_status: data.status })

  const admin = createAdminClient()

  // Attribute the event to a user: custom_data.user_id (set at checkout) is
  // primary; fall back to an existing row's paddle_customer_id so renewals /
  // portal-driven changes without custom_data still land. Unmatched events are
  // logged loudly (silent drops orphan paying customers).
  let userId: string | undefined = data.custom_data?.user_id
  if (!userId && data.customer_id) {
    const { data: byCustomer } = await admin
      .from('user_subscriptions')
      .select('user_id')
      .eq('paddle_customer_id', data.customer_id)
      .maybeSingle()
    userId = byCustomer?.user_id
  }
  if (!userId) {
    console.error('[paddle webhook] unmatched event — no user_id and unknown customer:', evt.event_type, data.customer_id)
    return NextResponse.json({ ok: true, unmatched: true })
  }

  const occurredAt: string | null = evt.occurred_at ?? null

  // Idempotency / ordering guard: Paddle retries re-sign with a fresh
  // timestamp, so the signature window does not stop replays or late
  // out-of-order events. Compare as INSTANTS (stored value is a Postgres
  // timestamptz whose text form differs from Paddle's ISO string — a string
  // compare would misorder them). Discard anything not newer than stored.
  if (occurredAt) {
    const { data: existing } = await admin
      .from('user_subscriptions')
      .select('last_event_at')
      .eq('user_id', userId)
      .maybeSingle()
    if (
      existing?.last_event_at &&
      new Date(existing.last_event_at).getTime() >= new Date(occurredAt).getTime()
    ) {
      return NextResponse.json({ ok: true, stale: true })
    }
  }

  // Conditional patch: spread only the fields the event carries (via the shared
  // mapper — same mapping the daily reconcile uses, so the two can't drift) so a
  // partial payload can never null out ids / period end.
  const patch: Record<string, unknown> = {
    user_id: userId,
    last_event_at: occurredAt,
    updated_at: new Date().toISOString(),
    ...fields,
  }

  const { error } = await admin
    .from('user_subscriptions')
    .upsert(patch, { onConflict: 'user_id' })

  // A failed write must NOT 200 — Paddle's retry schedule is the recovery
  // mechanism for transient DB errors.
  if (error) {
    console.error('[paddle webhook] upsert failed:', error)
    return NextResponse.json({ error: 'write failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
