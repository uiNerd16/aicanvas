import { NextRequest, NextResponse } from 'next/server'
import { CONTACT_EMAIL, CONTACT_FROM } from '@/app/lib/config'

export const runtime = 'nodejs'

// ─── /api/contact ─────────────────────────────────────────────────────────────
// The contact form's backend. Takes a {name, email, message} payload, validates
// it, then sends a branded email to CONTACT_EMAIL via Resend's REST API. The
// aicanvas.me domain is already verified in Resend (DKIM/SPF/DMARC live), so the
// message authenticates cleanly into the Gmail inbox.
//
// reply_to is set to the visitor, so hitting "Reply" in Gmail answers *them*,
// not yourself. That single header is what makes Gmail behave like a help desk.
//
// Abuse posture: a public endpoint that sends email can burn the Resend daily
// quota (shared with the auth emails) if hammered. Defenses here are a honeypot
// + a best-effort per-instance throttle + strict validation. They stop casual
// abuse but are NOT a hard guarantee on serverless (instances are ephemeral and
// not shared). Add Cloudflare Turnstile or a shared KV store before treating
// this as fully hardened.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best-effort, per-instance rate limit. Soft speed-bump, not a real guarantee.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 4
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  // Opportunistic cleanup so the Map doesn't grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
    }
  }
  return recent.length > MAX_PER_WINDOW
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const FONT = "'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

function emailHtml({ name, email, message }: { name: string; email: string; message: string }): string {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message)
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#1A1A19;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1A1A19;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#21211F;border:1px solid #383836;border-radius:16px;">
          <tr><td style="padding:28px 32px 0 32px;">
            <p style="margin:0;font-family:${FONT};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#A8B94D;font-weight:700;">AI Canvas &middot; Contact</p>
            <h1 style="margin:8px 0 0 0;font-family:${FONT};font-size:20px;line-height:1.3;color:#FAFAF0;font-weight:800;">New message from ${safeName}</h1>
          </td></tr>
          <tr><td style="padding:20px 32px;">
            <p style="margin:0 0 4px 0;font-family:${FONT};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9E9E98;font-weight:700;">From</p>
            <p style="margin:0 0 18px 0;font-family:${FONT};font-size:15px;color:#E8E8DF;">${safeName} &lt;<a href="mailto:${safeEmail}" style="color:#A8B94D;text-decoration:none;">${safeEmail}</a>&gt;</p>
            <p style="margin:0 0 4px 0;font-family:${FONT};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9E9E98;font-weight:700;">Message</p>
            <div style="font-family:${FONT};font-size:15px;line-height:1.6;color:#FAFAF0;white-space:pre-wrap;word-break:break-word;">${safeMessage}</div>
          </td></tr>
          <tr><td style="padding:0 32px 28px 32px;border-top:1px solid #383836;padding-top:18px;">
            <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.5;color:#7D7D78;">Reply straight to this email to answer ${safeName}.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Key not wired yet (paste it into .env.local / Vercel). Fail loud, not silent.
    return NextResponse.json({ error: 'Contact form is not configured yet.' }, { status: 503 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many messages from here. Please try again in a few minutes.' },
      { status: 429 },
    )
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  // Honeypot: humans never see or fill the hidden "website" field; bots fill
  // everything. Return a fake success so the bot can't tell it was filtered.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (name.length < 1 || name.length > 100) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (message.length < 1 || message.length > 5000) {
    return NextResponse.json({ error: 'Please enter a message (up to 5000 characters).' }, { status: 400 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_EMAIL],
      reply_to: `${name} <${email}>`,
      subject: `New contact message from ${name}`,
      html: emailHtml({ name, email, message }),
      text: `New contact message from ${name} <${email}>\n\n${message}\n\n— Reply to this email to answer ${name}.`,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('[api/contact] Resend send failed:', res.status, detail)
    return NextResponse.json(
      { error: 'Could not send your message right now. Please try again shortly.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
