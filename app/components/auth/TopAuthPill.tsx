'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CaretDown, ClockClockwise, Gear, Heart, SignIn, SignOut, User } from '@phosphor-icons/react'
import { useSession } from './SessionProvider'
import { useAuthModal } from './AuthModalProvider'
import { createClient } from '../../lib/supabase/client'
import { Button } from '../Button'
import { EmailAvatar } from './EmailAvatar'

/**
 * Compact auth control for chrome that doesn't include the global sidebar
 * (e.g. design-system topbar). Replaces UserMenu in cramped spaces.
 */
export function TopAuthPill() {
  const { user } = useSession()
  const router = useRouter()
  const { open: openAuthModal } = useAuthModal()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  if (!user) {
    return (
      <Button variant="outline" size="xs" onClick={() => openAuthModal()}>
        <SignIn size={13} weight="regular" />
        Sign in
      </Button>
    )
  }

  const email = user.email ?? 'Account'

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="xs"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Account menu for ${email}`}
      >
        <EmailAvatar email={email} className="h-4 w-4" />
        <CaretDown size={10} weight="regular" className={`transition-transform ${open ? '-rotate-180' : ''}`} />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-lg border border-sand-300 bg-sand-50 shadow-lg dark:border-sand-700 dark:bg-sand-900">
          <div className="border-b border-sand-300 px-3 py-2 text-xs text-sand-500 dark:border-sand-800 dark:text-sand-400">
            <span className="block truncate">{email}</span>
          </div>
          {/* Mirrors the account tabs (Profile · Saved · Activity · Settings)
              so the dropdown is a quick teleport into any account view. */}
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-sand-700 transition-colors hover:bg-sand-200 dark:text-sand-300 dark:hover:bg-sand-800"
          >
            <User size={14} weight="regular" />
            Profile
          </Link>
          <Link
            href="/account/saved"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-sand-700 transition-colors hover:bg-sand-200 dark:text-sand-300 dark:hover:bg-sand-800"
          >
            <Heart size={14} weight="regular" />
            Saved
          </Link>
          <Link
            href="/account/history"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-sand-700 transition-colors hover:bg-sand-200 dark:text-sand-300 dark:hover:bg-sand-800"
          >
            <ClockClockwise size={14} weight="regular" />
            Activity
          </Link>
          <Link
            href="/account/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-sand-700 transition-colors hover:bg-sand-200 dark:text-sand-300 dark:hover:bg-sand-800"
          >
            <Gear size={14} weight="regular" />
            Settings
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 border-t border-sand-300 px-3 py-2 text-sm text-sand-700 transition-colors hover:bg-sand-200 dark:border-sand-700 dark:text-sand-300 dark:hover:bg-sand-800"
          >
            <SignOut size={14} weight="regular" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
