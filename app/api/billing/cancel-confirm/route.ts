import { NextRequest, NextResponse } from 'next/server'
import { paddleApiBase } from '@/app/lib/paddle/server'
import { verifyCancelToken, type CancelClaims } from '@/app/lib/billing/cancel-token'
import { CONTACT_FROM, CONTACT_INBOX } from '@/app/lib/config'

export const runtime = 'nodejs'

// Extraordinary cancellations (for cause) need a human: the period-end cancel
// below is the guaranteed floor, but assessing the cause and any pro-rata refund
// is not something to auto-execute. Notify support with the stated reason.
async function notifySupportIfExtraordinary(claims: CancelClaims): Promise<void> {
  if (claims.kind !== 'ausserordentlich') return
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  const text = `Außerordentliche Kündigung bestätigt (Eigentum per E-Mail-Link verifiziert).

Subscription: ${claims.sid}
E-Mail: ${claims.email}
Grund / reason: ${claims.reason || '(kein Grund angegeben)'}

Das Abo ist bereits zum Ende des Abrechnungszeitraums gekündigt. Bitte den Grund prüfen und ggf. sofort beenden + anteilig erstatten.`
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_INBOX],
        reply_to: claims.email,
        subject: `Außerordentliche Kündigung: ${claims.email}`,
        text,
      }),
    })
  } catch (e) {
    console.error('[cancel-confirm] support notify failed:', e)
  }
}

// ─── /api/billing/cancel-confirm ──────────────────────────────────────────────
// The ownership-confirm step. Clicking the link in the §312k Eingangsbestätigung
// proves the recipient controls the account email, so here we execute the cancel
// in Paddle — effective at the END of the current billing period (the consumer
// keeps access until then; matches /refund § 3). Then we bounce back to
// /kuendigen with a status the page renders. The webhook (subscription.canceled)
// reconciles entitlement.

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin
  const back = (state: string) => NextResponse.redirect(`${origin}/kuendigen?state=${state}`)

  const token = req.nextUrl.searchParams.get('token')
  const claims = token ? verifyCancelToken(token) : null
  if (!claims) return back('invalid')

  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) return back('error')
  const auth = { Authorization: `Bearer ${apiKey}` }

  // Already canceled, or already scheduled to cancel at period end? Tell the
  // user that — don't surface a generic error. Paddle rejects re-cancelling a
  // sub that already has a scheduled cancellation, and a period-end cancel keeps
  // status 'active' with scheduled_change.action === 'cancel' until it lands.
  const cur = await fetch(`${paddleApiBase()}/subscriptions/${claims.sid}`, { headers: auth })
  if (cur.ok) {
    const sub = ((await cur.json().catch(() => null)) as
      | { data?: { status?: string; scheduled_change?: { action?: string } | null } }
      | null)?.data
    if (sub?.status === 'canceled' || sub?.scheduled_change?.action === 'cancel') {
      return back('already')
    }
  }

  const res = await fetch(`${paddleApiBase()}/subscriptions/${claims.sid}/cancel`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ effective_from: 'next_billing_period' }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('[cancel-confirm] Paddle cancel failed:', res.status, detail)
    return back('error')
  }

  await notifySupportIfExtraordinary(claims)
  return back('confirmed')
}
