import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import { ResetPasswordForm } from './ResetPasswordForm'

// ─── /account/reset-password ─────────────────────────────────────────────────
// Step 2 of recovery: arrived here from the recovery email's link, which
// already passed through /account/auth/callback so a session exists. If
// somebody hits this URL without a session, bounce them to the
// forgot-password entry to start over.
//
// SECURITY GATE: the page also requires the `ac_recovery_session` cookie set
// by the callback when it processed a recovery code. Without it, we treat
// the visit as a regular signed-in user trying to bypass the
// current-password check and show the "use a fresh recovery link" panel.
// The cookie is HTTP-only + path-scoped + 10-minute TTL, so it can't be
// spoofed from JavaScript and doesn't bleed beyond this page.

const RECOVERY_COOKIE = 'ac_recovery_session'

export default async function ResetPasswordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/forgot-password')

  const cookieStore = await cookies()
  const hasRecoveryMarker = Boolean(cookieStore.get(RECOVERY_COOKIE))

  return <ResetPasswordForm hasRecoveryMarker={hasRecoveryMarker} />
}
