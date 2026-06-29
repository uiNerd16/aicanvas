'use client'

import { Lightning } from '@phosphor-icons/react'
import { premiumEnabled } from '../../../lib/flags'

/**
 * Small olive "Premium" pill for design systems and templates.
 * Olive backgrounds pair with text-sand-950, never white (token rule).
 * Renders nothing while the premium flag is off.
 */
export function PremiumBadge({ className = '', label = 'Premium' }: { className?: string; label?: string }) {
  if (!premiumEnabled()) return null

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-olive-500 px-2 py-0.5 text-[11px] font-semibold text-sand-950 ${className}`}
    >
      <Lightning weight="regular" size={11} />
      {label}
    </span>
  )
}
