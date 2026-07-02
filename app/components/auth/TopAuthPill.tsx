'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CaretDown, ClockClockwise, Flask, Gear, Heart, Lightning, SignIn, SignOut, User } from '@phosphor-icons/react'
import { useSession } from './SessionProvider'
import { useAuthModal } from './AuthModalProvider'
import { createClient } from '../../lib/supabase/client'
import { Button } from '../Button'
import { EmailAvatar } from './EmailAvatar'
import { usePaywallModal } from '../billing/PaywallModalProvider'
import { usePremiumStatus } from '../billing/usePremiumStatus'

/**
 * Compact auth control for chrome that doesn't include the global sidebar
 * (e.g. design-system topbar). Replaces UserMenu in cramped spaces.
 */
export function TopAuthPill({ showStatusPill = true }: { showStatusPill?: boolean } = {}) {
  const { user } = useSession()
  const router = useRouter()
  const { open: openAuthModal } = useAuthModal()
  const { open: openPaywall } = usePaywallModal()
  const status = usePremiumStatus()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  // Standalone status pill — a Lightning bolt sitting to the LEFT of the auth
  // control in every top bar (HeaderSocials feeds all sticky headers, plus the
  // Lab layout). Always present: logged-out, free, and premium alike. Mirrors
  // the premium-component card badge: a dark chrome pill (kept dark in BOTH
  // themes so the olive-500 bolt clears contrast on a light bar) with an olive
  // ring, that fills olive on hover and slides its label open via the
  // grid-cols-[0fr]->[1fr] width trick.
  //
  // Tri-state from usePremiumStatus(): 'unknown' while the entitlement fetch is
  // in flight. We collapse it to NEITHER CTA (no label, neutral aria, account
  // href) so a paying customer is never flashed an upgrade pitch mid-load — the
  // whole reason the hook reports 'unknown'. Signed-out derives to 'not-premium'
  // synchronously, so it never sits in 'unknown'. Premium → "Hero Mode" linking
  // to subscription management; free → "Upgrade to Premium" linking to /pricing.
  const isPremium = status === 'premium'
  const isFree = status === 'not-premium'
  const pillLabel = isPremium ? 'Hero Mode' : isFree ? 'Upgrade to Premium' : ''
  const pillHref = isPremium ? '/account/settings' : isFree ? '/pricing' : '/account'
  const pillAria = isPremium ? 'Hero Mode, manage your subscription' : isFree ? 'Upgrade to Premium' : 'Premium'
  const statusPill = (
    <Link
      href={pillHref}
      aria-label={pillAria}
      className="group/upgrade flex h-7 items-center rounded-lg border border-olive-500/40 bg-sand-950/85 px-[7px] text-olive-500 backdrop-blur-sm transition-colors duration-200 hover:border-olive-500 hover:bg-olive-500 hover:text-sand-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-500/40"
    >
      <Lightning size={15} weight="fill" className="shrink-0" />
      {pillLabel && (
        <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-out group-hover/upgrade:grid-cols-[1fr]">
          <span className="overflow-hidden">
            <span className="block whitespace-nowrap pl-1.5 pr-0.5 text-xs font-semibold">
              {pillLabel}
            </span>
          </span>
        </span>
      )}
    </Link>
  )

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {showStatusPill && statusPill}
        <Button variant="outline" size="xs" onClick={() => openAuthModal()}>
          <SignIn size={13} weight="regular" />
          Sign in
        </Button>
      </div>
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
    <div className="flex items-center gap-2">
      {showStatusPill && statusPill}
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
            {status === 'not-premium' && (
              <button
                type="button"
                onClick={() => { setOpen(false); openPaywall({ reason: 'upgrade' }) }}
                className="flex w-full items-center gap-2 border-b border-sand-300 px-3 py-2 text-sm font-semibold text-olive-500 transition-colors hover:bg-sand-200 dark:border-sand-700 dark:hover:bg-sand-800"
              >
                <Lightning size={14} weight="regular" />
                Upgrade to Premium
              </button>
            )}
            {/* Mirrors the account tabs (Saved · Made in Lab · Activity ·
                Settings · Profile) so the dropdown is a quick teleport into
                any account view. */}
            <Link
              href="/account/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-sand-700 transition-colors hover:bg-sand-200 dark:text-sand-300 dark:hover:bg-sand-800"
            >
              <Heart size={14} weight="regular" />
              Saved
            </Link>
            <Link
              href="/account/lab"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-sand-700 transition-colors hover:bg-sand-200 dark:text-sand-300 dark:hover:bg-sand-800"
            >
              <Flask size={14} weight="regular" />
              Made in Lab
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
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-sand-700 transition-colors hover:bg-sand-200 dark:text-sand-300 dark:hover:bg-sand-800"
            >
              <User size={14} weight="regular" />
              Profile
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
    </div>
  )
}
