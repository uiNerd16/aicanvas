'use client'

import { premiumEnabled } from '../../../lib/flags'
import { setDevTier, useDevTierState, type DevTierState } from './useEntitlement'

const OPTIONS: { state: DevTierState; label: string }[] = [
  { state: 'anonymous', label: 'Anon' },
  { state: 'free-under', label: 'Free 3/10' },
  { state: 'free-at-limit', label: 'Free 10/10' },
  { state: 'premium', label: 'Premium' },
]

/**
 * Dev-only control to flip the stubbed entitlement tier by hand so every
 * premium UI state can be reviewed without a backend. Never renders in
 * production builds, and never when the premium flag is off.
 */
export function DevTierSwitcher() {
  const current = useDevTierState()

  if (!premiumEnabled() || process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-xl border border-sand-700 bg-sand-900/95 p-1 shadow-xl backdrop-blur">
      <span className="px-1.5 text-[10px] font-semibold uppercase tracking-wide text-sand-500">
        Tier
      </span>
      {OPTIONS.map(({ state, label }) => (
        <button
          key={state}
          type="button"
          onClick={() => setDevTier(state)}
          className={`rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
            current === state
              ? 'bg-olive-500 text-sand-950'
              : 'text-sand-400 hover:bg-sand-800 hover:text-sand-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
