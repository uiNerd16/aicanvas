'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { Button } from '../../components/Button'

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
    <Button variant="outline" size="md" onClick={handleSignOut} disabled={signingOut}>
      {signingOut ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}
