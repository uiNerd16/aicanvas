'use client'

import Link from 'next/link'
import { LockSimple, Sparkle } from '@phosphor-icons/react'
import { buttonClasses } from '../buttonClasses'
import { useSession } from '../auth/SessionProvider'
import { useEntitlement } from './useEntitlement'

export type PaywallReason = 'premium-only' | 'quota-exceeded'

/**
 * Ladder-aware locked panel rendered in place of gated content (Code tab).
 * Anonymous users are sold the FREE account first (sign up, 10/day); only
 * signed-in free users get the direct premium pitch. Presentation only in
 * Plan 0: CTAs navigate to real routes, the overlay checkout arrives in
 * Plan 4. Designed for the dark code surface (bg-sand-950).
 */
export function Paywall({ reason, limit: realLimit }: { reason: PaywallReason; limit?: number }) {
  const { user } = useSession()
  const { tier, limit: stubLimit } = useEntitlement()
  // When the real gate provides a limit (enforcing path), trust it; otherwise
  // fall back to the stub (Plan 0 dev preview).
  const limit = realLimit ?? stubLimit
  // The session is the real rung when available; the stub covers review mode.
  const isAnonymous = !user && tier === 'anonymous'

  const title = reason === 'premium-only' ? 'Premium component' : 'Daily limit reached'

  const body =
    reason === 'premium-only'
      ? 'This is part of a design system. Premium unlocks every design system, template, and unlimited installs.'
      : isAnonymous
        ? `You've used your ${limit} free installs for today. A free account gets you 10 a day, and Premium lifts the limit entirely.`
        : `You've used your ${limit} installs for today. Premium lifts the daily limit entirely.`

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-sand-800 bg-sand-900">
        <LockSimple weight="regular" size={20} className="text-olive-400" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-sand-50">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-sand-400">{body}</p>
      </div>

      <div className="flex flex-col items-center gap-2 sm:flex-row">
        {isAnonymous ? (
          <>
            <Link
              href="/account/sign-up"
              className={buttonClasses({ variant: 'primary', size: 'sm' })}
            >
              Sign up free, 10/day
            </Link>
            <Link
              href="/pricing"
              className={buttonClasses({ variant: 'outline', size: 'sm' })}
            >
              or go Premium
            </Link>
          </>
        ) : (
          <Link
            href="/pricing"
            className={buttonClasses({ variant: 'primary', size: 'sm' })}
          >
            Go Premium
          </Link>
        )}
      </div>

      <p className="inline-flex items-center gap-1.5 text-xs text-sand-500">
        <Sparkle weight="regular" size={12} className="text-olive-400" />
        Remix with AI stays free for everyone.
      </p>
    </div>
  )
}
