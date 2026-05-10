import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '../../lib/supabase/server'
import { SignInForm } from './SignInForm'

// ─── /account/sign-in ────────────────────────────────────────────────────────
// Server entry: if the user already has a valid session, skip the form and
// drop them straight into /account. The next= search param is honoured by
// the client form for post-sign-in redirects.

export default async function SignInPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/account')

  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}
