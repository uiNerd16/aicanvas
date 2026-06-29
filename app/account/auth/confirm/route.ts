import { NextResponse, type NextRequest } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '../../../lib/supabase/server'
import { safeNext } from '../../../lib/safe-next'

// ─── /account/auth/confirm ──────────────────────────────────────────────────
// Server-side magic-link confirmation for the anonymous-checkout claim flow.
// The Paddle webhook provisions a buyer's account and emails a link here
// carrying a `token_hash` (from admin.generateLink). verifyOtp() exchanges it
// for a session cookie, then we redirect into the app.
//
// Separate from the OAuth/email callback next door (which uses
// exchangeCodeForSession, the PKCE code flow): admin-generated links can't
// carry a client code_verifier, so they use the token_hash verification flow.
// verifyOtp is flow-agnostic and works regardless of the project's PKCE setting.

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const tokenHash = searchParams.get('token_hash')
  const type = (searchParams.get('type') ?? 'magiclink') as EmailOtpType
  const next = safeNext(searchParams.get('next'))

  if (!tokenHash) {
    return NextResponse.redirect(`${origin}/account/sign-in?error=missing_token`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
  if (error) {
    const reason = encodeURIComponent(error.message ?? 'confirm_failed')
    return NextResponse.redirect(`${origin}/account/sign-in?error=confirm_failed&reason=${reason}`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
