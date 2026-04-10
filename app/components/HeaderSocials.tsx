'use client'

import Link from 'next/link'
import { GithubLogo, Info, XLogo } from '@phosphor-icons/react'
import { GITHUB_URL, X_URL } from '../lib/config'

// ─── HeaderSocials ────────────────────────────────────────────────────────────
// Icon-only links (About + GitHub + X) intended for the right side of any
// sticky page header. Borderless ghost buttons with a soft sand-tinted hover.

export function HeaderSocials({ compact }: { compact?: boolean } = {}) {
  const iconClass = "flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"

  // Compact mode: only show the About icon (used in mobile top bar)
  if (compact) {
    return (
      <Link href="/about" aria-label="About" className={iconClass}>
        <Info weight="regular" size={20} />
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Link href="/about" aria-label="About" className={iconClass}>
        <Info weight="regular" size={20} />
      </Link>

      <div className="mx-1 h-4 w-px bg-sand-300 dark:bg-sand-700" />

      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
        className={iconClass}
      >
        <GithubLogo weight="regular" size={20} />
      </a>

      <a
        href={X_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X profile"
        className={iconClass}
      >
        <XLogo weight="regular" size={20} />
      </a>
    </div>
  )
}
