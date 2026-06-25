import { NextRequest, NextResponse } from 'next/server'
import { paddleApiBase } from '@/app/lib/paddle/server'
import { verifyCancelToken, type CancelClaims } from '@/app/lib/billing/cancel-token'
import { CONTACT_FROM, CONTACT_INBOX } from '@/app/lib/config'
import { cancellationConfirmedEmail } from '@/app/lib/email/messages'

export const runtime = 'nodejs'

// Extraordinary cancellations (for cause) need a human: the period-end cancel
// below is the guaranteed floor, but assessing the cause and any pro-rata refund
// is not something to auto-execute. Notify support with the stated reason.
async function notifySupportIfExtraordinary(claims: CancelClaims): Promise<void> {
  if (claims.kind !== 'ausserordentlich') return
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  const text = `Außerordentliche Kündigung bestätigt (Eigentum per E-Mail-Link verifiziert).

Subscriptions: ${claims.sids.join(', ')}
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

  // Cancel EVERY active subscription the token covers (one email can rarely have
  // more than one). Per sub: skip any already canceled / already scheduled to
  // cancel (Paddle rejects re-cancelling those; a period-end cancel stays status
  // 'active' with scheduled_change.action === 'cancel' until it lands), and cancel
  // the rest at period end. Idempotent — a retry re-skips the ones already done.
  let anyError = false
  let anyConfirmed = false
  let allAlready = true
  let endsAt: string | null = null
  for (const sid of claims.sids) {
    const cur = await fetch(`${paddleApiBase()}/subscriptions/${sid}`, { headers: auth })
    if (cur.ok) {
      const sub = ((await cur.json().catch(() => null)) as
        | {
            data?: {
              status?: string
              scheduled_change?: { action?: string } | null
              current_billing_period?: { ends_at?: string | null }
            }
          }
        | null)?.data
      if (sub?.status === 'canceled' || sub?.scheduled_change?.action === 'cancel') {
        continue // already canceled / scheduled — nothing to do for this one
      }
      // Track the LATEST period-end across the subs we cancel, so a multi-sub
      // account is never told access ends sooner than it does. (ISO-8601 UTC
      // strings sort chronologically, so a string compare is enough.)
      const e = sub?.current_billing_period?.ends_at
      if (e && (!endsAt || e > endsAt)) endsAt = e
    }
    allAlready = false
    const res = await fetch(`${paddleApiBase()}/subscriptions/${sid}/cancel`, {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ effective_from: 'next_billing_period' }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[cancel-confirm] Paddle cancel failed:', sid, res.status, detail)
      anyError = true
    } else {
      anyConfirmed = true
    }
  }
  if (anyError) return back('error')
  if (allAlready && !anyConfirmed) return back('already')

  await notifySupportIfExtraordinary(claims)

  // Courtesy confirmation to the customer — only when a real cancel was executed
  // this request (anyConfirmed). A replayed link finds the sub already scheduled
  // to cancel, takes the `continue` path, and never reaches here, so this can't
  // double-send.
  if (anyConfirmed) {
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        const mail = cancellationConfirmedEmail({ endsAt: endsAt ? new Date(endsAt) : null })
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: CONTACT_FROM, to: [claims.email], subject: mail.subject, html: mail.html }),
        })
      } catch (e) {
        console.error('[cancel-confirm] confirmation email failed (non-fatal):', e)
      }
    }
  }

  return back('confirmed')
}
