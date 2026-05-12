'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={signingOut}
      className="rounded-lg border border-sand-300 bg-sand-50 px-4 py-2 text-sm font-semibold text-sand-700 transition-colors hover:bg-sand-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sand-700 dark:bg-sand-950 dark:text-sand-300 dark:hover:bg-sand-800"
    >
      {signingOut ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
