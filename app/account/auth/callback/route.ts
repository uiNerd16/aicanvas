import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { safeNext } from '../../../lib/safe-next'

// OAuth + email-confirmation callback. Exchanges the recovery / OAuth code
// for a session, then redirects to `next` (guarded against open-redirect
// abuse by `safeNext`). Any failure path surfaces a code via `?error=…` on
// the sign-in page so the form can show what went wrong instead of leaving
// the user staring at an unchanged screen.
//
// Recovery flow marker: when the requested `next` is the reset-password
// page, we set a short-lived HTTP-only cookie so the reset page knows the
// session came from a recovery email — without needing to inspect the JWT
// (Supabase doesn't reliably stamp `amr: recovery` in every project setup).
// The cookie is scoped to `/account/reset-password` and expires in 10
// minutes so a stale signed-in user who navigates directly to the reset URL
// is correctly denied (the original P0 we shipped).

const RECOVERY_COOKIE = 'ac_recovery_session'
const RECOVERY_COOKIE_MAX_AGE = 600 // 10 minutes

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  if (!code) {
    return NextResponse.redirect(`${origin}/account/sign-in?error=missing_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    const reason = encodeURIComponent(error.message ?? 'callback_failed')
    return NextResponse.redirect(`${origin}/account/sign-in?error=callback_failed&reason=${reason}`)
  }

  const response = NextResponse.redirect(`${origin}${next}`)

  // If the caller is heading to /account/reset-password, this was a recovery
  // flow — drop a one-shot marker the reset page can trust. The cookie path
  // pins it to the reset page so it never bleeds elsewhere.
  if (next.startsWith('/account/reset-password')) {
    response.cookies.set(RECOVERY_COOKIE, '1', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: RECOVERY_COOKIE_MAX_AGE,
      path: '/account/reset-password',
    })
  }

  return response
}
