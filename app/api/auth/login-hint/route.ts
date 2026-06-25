import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/app/lib/supabase/admin'
import { ipFromHeaders } from '@/app/lib/quota'

export const runtime = 'nodejs'

// ─── /api/auth/login-hint ─────────────────────────────────────────────────────
// After a failed password sign-in, the form asks here whether the email is a
// Google-OAuth-only account. If so it shows "use Sign in with Google" instead of
// a dead-end "wrong password" message. The endpoint returns ONLY 'google' | null
// (provider info, no account details), via a service-role-only RPC.
//
// This intentionally reveals provider info, which is a mild account-enumeration
// signal, so it's throttled. Best-effort per-instance limit (mirrors /api/contact);
// add Cloudflare Turnstile here if/when we want a hard wall (verifyTurnstile already
// exists in the codebase). On throttle we just return null → the form falls back to
// the generic error, so an abuser learns nothing.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 20
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

export async function POST(req: NextRequest) {
  const ip = ipFromHeaders(req.headers) ?? 'unknown'
  if (rateLimited(ip)) return NextResponse.json({ provider: null })

  const body = await req.json().catch(() => null)
  const email = body && typeof body.email === 'string' ? body.email.trim() : ''
  if (!EMAIL_RE.test(email) || email.length > 200) return NextResponse.json({ provider: null })

  try {
    const admin = createAdminClient()
    const { data, error } = await admin.rpc('account_login_hint', { p_email: email })
    if (error) return NextResponse.json({ provider: null })
    return NextResponse.json({ provider: data === 'google' ? 'google' : null })
  } catch {
    return NextResponse.json({ provider: null })
  }
}
