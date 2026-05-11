import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import { ForgotPasswordForm } from './ForgotPasswordForm'

// ─── /account/forgot-password ────────────────────────────────────────────────
// Server entry: if the user is already signed in there's nothing to recover,
// so bounce them to /account directly. Otherwise render the client form.

export default async function ForgotPasswordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/account')

  return <ForgotPasswordForm />
}
