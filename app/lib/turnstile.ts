import 'server-only'

// ─── Cloudflare Turnstile (server verify) ─────────────────────────────────────
// Graceful by design: when TURNSTILE_SECRET_KEY is unset (local dev, or before
// keys are wired) verification is SKIPPED so the form still works — but it logs
// loudly so a misconfigured production can be spotted. Turnstile is invisible
// and GDPR-clean (no Google data transfer), which suits a German operator.
//
// Turn it on by setting TURNSTILE_SECRET_KEY (server) and
// NEXT_PUBLIC_TURNSTILE_SITE_KEY (client widget).

export async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY not set — skipping bot check')
    return true
  }
  if (!token) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const json = (await res.json().catch(() => null)) as { success?: boolean } | null
    return json?.success === true
  } catch {
    return false
  }
}
