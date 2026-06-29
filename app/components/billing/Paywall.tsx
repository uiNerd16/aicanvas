'use client'

import { LockSimple } from '@phosphor-icons/react'
import { usePaywallModal, type PaywallReason } from './PaywallModalProvider'

export type { PaywallReason }

// Decorative, blurred faux-source — for PREMIUM content the REAL source is
// withheld server-side (the gate 402s before any bytes ship), so there is
// nothing real to blur. Free component source stays public to read.
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
 * Inline locked state rendered in the Code tab when source is withheld. Shows
 * a blurred teaser; clicking "See plans" opens the global full-screen upgrade
 * modal (the actual pricing cards). The modal lives in PaywallModalProvider so
 * it overlays the whole viewport.
 */
export function Paywall({ reason, limit }: { reason: PaywallReason; limit?: number }) {
  const { open } = usePaywallModal()

  // Metering is gone — the inline lock only ever covers premium content now.
  const title = 'Premium component'

  return (
    <div className="relative min-h-[360px] w-full overflow-hidden">
      <pre
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none overflow-hidden whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed text-sand-600 opacity-30 blur-[3px]"
      >
        {FAUX_SOURCE}
      </pre>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-sand-950/70 px-4 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sand-800 bg-sand-900">
          <LockSimple weight="regular" size={20} className="text-olive-400" />
        </div>
        <h3 className="text-base font-bold text-sand-50">{title}</h3>
        <button
          type="button"
          onClick={() => open({ reason, limit })}
          className="rounded-lg bg-olive-500 px-4 py-2 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
        >
          See plans
        </button>
      </div>
    </div>
  )
}
