import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '../../lib/supabase/server'
import { SignUpForm } from './SignUpForm'

// ─── /account/sign-up ────────────────────────────────────────────────────────
// Server entry: bounce already-signed-in visitors to /account so the form
// never flashes for someone who doesn't need it.

export default async function SignUpPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/account')

  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
