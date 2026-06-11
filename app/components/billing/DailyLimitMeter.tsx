'use client'

import { Gauge } from '@phosphor-icons/react'
import { premiumEnabled } from '../../../lib/flags'
import { useEntitlement } from './useEntitlement'

/**
 * Compact daily-allowance indicator shown near the Code / Copy CLI actions.
 * Free: "N of 10 today". Anonymous: nudges toward the free account rung.
 * Premium: "Unlimited". Renders nothing while the premium flag is off.
 */
export function DailyLimitMeter({ className = '' }: { className?: string }) {
  const { tier, usedToday, limit } = useEntitlement()

  if (!premiumEnabled()) return null

  const atLimit = tier !== 'premium' && usedToday >= limit

  const label =
    tier === 'premium'
      ? 'Unlimited'
      : tier === 'free'
        ? `${usedToday} of ${limit} today`
        : 'Sign in for 10/day'

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        atLimit
          ? 'text-olive-600 dark:text-olive-400'
          : 'text-sand-500 dark:text-sand-400'
      } ${className}`}
    >
      <Gauge weight="regular" size={14} />
      {label}
    </span>
  )
}
