'use client'

import Link from 'next/link'
import { LockSimple } from '@phosphor-icons/react'
import type { PaywallReason } from './PaywallModalProvider'

export type { PaywallReason }

// Decorative, blurred faux-source — for PREMIUM content the REAL bytes are
// withheld server-side (the source gate serves a placeholder item; the prompt
// gate never renders blocks 2-4), so there is nothing real to blur. Free
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

/**
 * Inline locked state rendered where withheld content would be — the Code tab,
 * and the withheld blocks of a premium prompt. Shows a blurred teaser; "See
 * plans" goes to the pricing page. Props are kept for the call sites even
 * though the lock no longer varies by reason. `teaser` overrides the blurred
 * decoration so it matches whatever was withheld.
 */
export function Paywall({ teaser = FAUX_SOURCE }: { reason: PaywallReason; limit?: number; teaser?: string }) {
  // Metering is gone — the inline lock only ever covers premium content now.
  // No type noun: this lock also covers blocks and templates, and neither this
  // component nor the modal has the entry (or isBlock) in scope.
  const title = 'Premium content'

  return (
    <div className="relative min-h-[360px] w-full overflow-hidden">
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
        <Link
          href="/pricing"
          className="rounded-lg bg-olive-500 px-4 py-2 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
        >
          See plans
        </Link>
      </div>
    </div>
  )
}
