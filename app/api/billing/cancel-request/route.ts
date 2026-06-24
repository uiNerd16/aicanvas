import { NextRequest, NextResponse } from 'next/server'
import { paddleApiBase } from '@/app/lib/paddle/server'
import { ipFromHeaders } from '@/app/lib/quota'
import { verifyTurnstile } from '@/app/lib/turnstile'
import { signCancelToken } from '@/app/lib/billing/cancel-token'
import { cancellationReceiptEmail } from '@/app/lib/billing/cancellation-email'
import { CONTACT_FROM } from '@/app/lib/config'

export const runtime = 'nodejs'

// ─── /api/billing/cancel-request ──────────────────────────────────────────────
// §312k cancellation intake. NO login. Always returns the SAME neutral response
// (no account enumeration). On a matching active subscription it emails the
// §312k Eingangsbestätigung, which carries the ownership-confirm link that
// actually executes the cancel (see /api/billing/cancel-confirm). No email is
// sent for a non-match, so the endpoint can't be used to spam arbitrary inboxes.
//
// Abuse posture: Cloudflare Turnstile + a best-effort per-instance rate limit +
// a honeypot. The actual cancellation can never fire without the emailed link,
// so a bot that gets through still can't cancel anyone's subscription.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best-effort, per-instance rate limit (mirrors app/api/contact). A soft
// speed-bump, not a hard guarantee on serverless; Turnstile is the real wall.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
    }
  }
  return recent.length > MAX_PER_WINDOW
}

type FoundSub = { id: string; endsAt: string | null; plan: string }

/** Look up ALL of the caller's active Paddle subscriptions by email — a single
 *  email can map to more than one customer record and/or more than one active
 *  subscription, and the cancel must cover every one. Source of truth is Paddle,
 *  so the no-login flow needs no email→user-id mapping. Returns every active sub
 *  id plus a primary one for the receipt display. */
async function findActiveSubscriptions(
  email: string,
): Promise<{ sids: string[]; primary: FoundSub } | null> {
  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) return null
  const headers = { Authorization: `Bearer ${apiKey}` }

  const cRes = await fetch(`${paddleApiBase()}/customers?email=${encodeURIComponent(email)}`, { headers })
  if (!cRes.ok) return null
  const cJson = (await cRes.json().catch(() => null)) as { data?: Array<{ id?: string }> } | null
  const customerIds = (cJson?.data ?? [])
    .map((c) => c.id)
    .filter((id): id is string => typeof id === 'string')
  if (customerIds.length === 0) return null

  const found: FoundSub[] = []
  for (const customerId of customerIds) {
    const sRes = await fetch(
      `${paddleApiBase()}/subscriptions?customer_id=${customerId}&status=active`,
      { headers },
    )
    if (!sRes.ok) continue
    const sJson = (await sRes.json().catch(() => null)) as {
      data?: Array<{
        id?: string
        current_billing_period?: { ends_at?: string | null }
        billing_cycle?: { interval?: string }
      }>
    } | null
    for (const sub of sJson?.data ?? []) {
      if (!sub?.id) continue
      const interval = sub.billing_cycle?.interval
      const plan =
        interval === 'year'
          ? 'AI Canvas Premium (Yearly)'
          : interval === 'month'
            ? 'AI Canvas Premium (Monthly)'
            : 'AI Canvas Premium'
      found.push({ id: sub.id, endsAt: sub.current_billing_period?.ends_at ?? null, plan })
    }
  }
  if (found.length === 0) return null
  return { sids: found.map((f) => f.id), primary: found[0] }
}

async function sendReceipt(
  apiKey: string,
  to: string,
  mail: { subject: string; html: string; text: string },
): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: CONTACT_FROM, to: [to], subject: mail.subject, html: mail.html, text: mail.text }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('[cancel-request] Resend send failed:', res.status, detail)
  }
}

export async function POST(req: NextRequest) {
  const ip = ipFromHeaders(req.headers) ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte in ein paar Minuten erneut versuchen. / Too many requests, try again shortly.' },
      { status: 429 },
    )
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  // Honeypot: humans never fill the hidden "website" field. Fake-success on fill.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json(
      { error: 'Bitte gib eine gültige E-Mail-Adresse ein. / Please enter a valid email address.' },
      { status: 400 },
    )
  }

  // §312k Abs. 2 Nr. 1: ordinary vs extraordinary (+ reason for extraordinary).
  const kind: 'ordentlich' | 'ausserordentlich' =
    body.kind === 'ausserordentlich' ? 'ausserordentlich' : 'ordentlich'
  const reason =
    kind === 'ausserordentlich' && typeof body.reason === 'string'
      ? body.reason.trim().slice(0, 1000)
      : ''

  const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken : null
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json(
      { error: 'Bot-Prüfung fehlgeschlagen. Bitte erneut versuchen. / Bot check failed, please retry.' },
      { status: 403 },
    )
  }

  // Always neutral from here: we never reveal whether the email matched.
  const resendKey = process.env.RESEND_API_KEY
  try {
    const result = await findActiveSubscriptions(email)
    if (result && resendKey) {
      if (result.sids.length > 1) {
        console.warn(`[cancel-request] ${result.sids.length} active subscriptions for one email — cancelling all`)
      }
      const exp = Math.floor(Date.now() / 1000) + 24 * 3600
      const token = signCancelToken({ sids: result.sids, email, kind, reason: reason || undefined, exp })
      const confirmUrl = `${req.nextUrl.origin}/api/billing/cancel-confirm?token=${encodeURIComponent(token)}`
      const mail = cancellationReceiptEmail({
        plan: result.primary.plan,
        receivedAt: new Date(),
        endsAt: result.primary.endsAt ? new Date(result.primary.endsAt) : null,
        confirmUrl,
        extraordinary: kind === 'ausserordentlich',
      })
      await sendReceipt(resendKey, email, mail)
    }
  } catch (e) {
    // Never leak internals; stay neutral. Log for ops.
    console.error('[cancel-request] error:', e)
  }

  return NextResponse.json({ ok: true })
}
