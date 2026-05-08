'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CaretDown, SignIn, SignOut, User } from '@phosphor-icons/react'
import { useSession } from './SessionProvider'
import { createClient } from '../../lib/supabase/client'

/**
 * Compact auth control for chrome that doesn't include the global sidebar
 * (e.g. design-system topbar). Replaces UserMenu in cramped spaces.
 */
export function TopAuthPill() {
  const { user } = useSession()
  const router = useRouter()
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
      <Link
        href="/account/sign-in"
        className="inline-flex items-center gap-1.5 rounded-lg border border-sand-300 bg-sand-100 px-3 py-1.5 text-xs font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:bg-sand-900 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100"
      >
        <SignIn size={13} weight="regular" />
        Sign in
      </Link>
    )
  }

  const email = user.email ?? 'Account'
  const initial = email.charAt(0).toUpperCase()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-sand-300 bg-sand-100 px-2 py-1 text-xs font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:bg-sand-900 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100"
        aria-label={`Account menu for ${email}`}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-olive-500 text-[10px] font-bold text-sand-950">
          {initial}
        </span>
        <CaretDown size={10} weight="regular" className={`transition-transform ${open ? '-rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-lg border border-sand-300 bg-sand-50 shadow-lg dark:border-sand-700 dark:bg-sand-900">
          <div className="border-b border-sand-300 px-3 py-2 text-xs text-sand-500 dark:border-sand-800 dark:text-sand-400">
            <span className="block truncate">{email}</span>
          </div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-sand-700 transition-colors hover:bg-sand-200 dark:text-sand-300 dark:hover:bg-sand-800"
          >
            <User size={14} weight="regular" />
            Account
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
