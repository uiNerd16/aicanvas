'use client'

import Link from 'next/link'
import { GithubLogo, XLogo } from '@phosphor-icons/react'
import { GITHUB_URL, X_URL } from '../lib/config'

// ─── HeaderSocials ────────────────────────────────────────────────────────────
// Right side of any sticky page header — Get MCP CTA + icon-only links
// (GitHub + X) as borderless ghost buttons with a soft sand-tinted hover.

export function HeaderSocials() {
  const iconClass = "flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/mcp"
        className="mr-1 inline-flex items-center gap-1.5 rounded-lg bg-olive-500 px-3 py-2 text-xs font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-[0.97]"
      >
        <img src="/ai-canvas-icon-mono.svg" alt="" width={16} height={14} className="shrink-0" />
        Get MCP
      </Link>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
        className={iconClass}
      >
        <GithubLogo weight="regular" size={20} />
      </a>
      <div className="mx-1 h-4 w-px bg-sand-300 dark:bg-sand-700" />
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
