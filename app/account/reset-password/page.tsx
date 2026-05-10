import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import { ResetPasswordForm } from './ResetPasswordForm'

// ─── /account/reset-password ─────────────────────────────────────────────────
// Step 2 of recovery: arrived here from the recovery email's link, which
// already passed through /account/auth/callback so a session exists. If
// somebody hits this URL without a session (manually-typed URL, expired
// link, etc.), bounce them to the forgot-password entry to start over.

export default async function ResetPasswordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/forgot-password')

  return <ResetPasswordForm />
}
