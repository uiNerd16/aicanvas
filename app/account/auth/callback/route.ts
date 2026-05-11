import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { safeNext } from '../../../lib/safe-next'

// OAuth + email-confirmation callback. Exchanges the recovery / OAuth code
// for a session, then redirects to `next` (guarded against open-redirect
// abuse by `safeNext`). Any failure path surfaces a code via `?error=…` on
// the sign-in page so the form can show what went wrong instead of leaving
// the user staring at an unchanged screen.

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

  return NextResponse.redirect(`${origin}${next}`)
}
