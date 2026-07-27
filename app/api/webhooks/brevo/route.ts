import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/app/lib/supabase/admin'

export const runtime = 'nodejs'

/**
 * Brevo marketing webhook — the unsubscribe safety net.
 * When a recipient unsubscribes (or hard-bounces / marks spam), Brevo already
 * suppresses them on its side; this endpoint writes the same fact back into
 * newsletter_subscribers so OUR source of truth never disagrees. Admin client:
 * webhook calls carry no user session, so RLS must be bypassed.
 *
 * Auth: shared secret in the query string (?token=), compared to
 * BREVO_WEBHOOK_SECRET. Configured in Brevo under Contacts > Settings >
 * Webhooks pointing at /api/webhooks/brevo?token=<secret>.
 */

// Any of these means: never mail this address again.
const SUPPRESS_EVENTS = new Set([
  'unsubscribed', 'unsubscribe', 'list_addition_forbidden',
  'hard_bounce', 'hardbounce', 'blocked', 'invalid_email', 'spam', 'complaint',
])

export async function POST(request: NextRequest) {
  const secret = process.env.BREVO_WEBHOOK_SECRET
  if (!secret || request.nextUrl.searchParams.get('token') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const event = String(body?.event ?? '').toLowerCase()
  const email = typeof body?.email === 'string' ? body.email.toLowerCase() : null

  if (!email || !SUPPRESS_EVENTS.has(event)) {
    // Unknown/irrelevant events are acknowledged so Brevo doesn't retry them.
    return NextResponse.json({ ok: true, ignored: true })
  }

  const admin = createAdminClient()
  const now = new Date().toISOString()
  const { error } = await admin
    .from('newsletter_subscribers')
    .upsert(
      {
        email,
        status: 'unsubscribed',
        source: `brevo_${event}`,
        unsubscribed_at: now,
        updated_at: now,
      },
      { onConflict: 'email' },
    )

  if (error) {
    console.error('[brevo webhook]', event, error)
    // 500 so Brevo re-delivers; a transient DB blip must not lose an opt-out.
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
