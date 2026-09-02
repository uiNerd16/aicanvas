'use client'

import Link from 'next/link'
import { LockSimple } from '@phosphor-icons/react'
import { useAuthModal } from '../auth/AuthModalProvider'
import { useSession } from '../auth/SessionProvider'
import type { PaywallReason } from './PaywallModalProvider'

export type { PaywallReason }

// Decorative, blurred faux-source — for PREMIUM content the REAL bytes are
// withheld server-side (the source gate serves a placeholder item; the prompt
// gate never renders block 3 onward), so there is nothing real to blur. Free
// source and free prompts stay public to read.
const FAUX_SOURCE = `import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'

export function Component({ value, onChange }: Props) {
  const [active, setActive] = useState(false)
  const handle = useCallback(() => setActive((a) => !a), [])

  return (
    <motion.button onClick={handle} animate={{ scale: active ? 1.02 : 1 }}>
      {value}
    </motion.button>
  )
}`

// Default sub-copy. True for standalones and blocks, where the source AND the
// build blocks of the prompt are both withheld. Surfaces that gate only one of
// the two (Andromeda components carry no remix prompt at all) pass their own.
const DEFAULT_SUBTITLE = 'The full source and the remix prompt ship with Premium.'

/**
 * Inline locked state rendered where withheld content would be — the Code tab,
 * and the withheld blocks of a premium prompt. Shows a blurred teaser over two
 * CTAs: buy, and (signed out only) log in, since a subscriber who lands here
 * logged out has no other way in from this panel. Props are kept for the call
 * sites even though the lock no longer varies by reason. `teaser` overrides the
 * blurred decoration so it matches whatever was withheld; `name` titles the
 * lock with the thing being unlocked.
 */
export function Paywall({
  teaser = FAUX_SOURCE,
  name,
  subtitle = DEFAULT_SUBTITLE,
}: {
  reason: PaywallReason
  limit?: number
  teaser?: string
  name?: string
  subtitle?: string
}) {
  const { open } = useAuthModal()
  const { user } = useSession()
  // Metering is gone — the inline lock only ever covers premium content now.
  // Named when the caller knows what it is gating; the fallback carries no type
  // noun, because this lock also covers blocks and templates.
  const title = name ? `Unlock ${name}` : 'Premium content'

  return (
    // Scoped dark with its own ground: the lock replaces a code slab, and code
    // slabs render dark in both site themes; without the pinned background the
    // black fade would sit on a light card in light mode.
    <div className="dark relative min-h-[360px] w-full overflow-hidden bg-sand-950">
      <pre
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none overflow-hidden whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed text-sand-600 opacity-30 blur-[3px]"
      >
        {teaser}
      </pre>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-sand-950/0 via-sand-950/85 to-sand-950 px-4 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sand-800 bg-sand-900">
          <LockSimple weight="regular" size={20} className="text-olive-400" />
        </div>
        <h3 className="text-base font-bold text-sand-50">{title}</h3>
        <p className="max-w-xs text-sm leading-relaxed text-sand-400">{subtitle}</p>
        {/* Fixed dark skin, not buttonClasses: this panel is bg-sand-950 in both
            site themes, so the outline variant's light-mode default would put
            sand-700 text on black. */}
        <div className="mt-1 flex items-center gap-2">
          <Link
            href="/pricing"
            className="rounded-lg bg-olive-500 px-4 py-2 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
          >
            Get Premium
          </Link>
          {!user && (
            <button
              type="button"
              onClick={() => open()}
              className="rounded-lg border border-sand-700 px-4 py-2 text-sm font-semibold text-sand-200 transition-colors hover:border-sand-600 hover:text-sand-50"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
