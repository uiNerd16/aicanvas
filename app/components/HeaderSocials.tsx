'use client'

import Link from 'next/link'
import { buttonClasses } from './Button'
import { TopAuthPill } from './auth/TopAuthPill'

// ─── HeaderSocials ────────────────────────────────────────────────────────────
// Right side of any sticky page header. The auth pill comes first (compact
// letter-avatar + dropdown when signed in, "Sign in" button that opens the
// auth modal when signed out), then the olive "Get MCP" CTA.
//
// GitHub + X icons moved to the sidebar (above the "Love what you see" card)
// — see Sidebar.tsx.

export function HeaderSocials() {
  return (
    <div className="flex items-center gap-2">
      <TopAuthPill />
      <Link
        href="/mcp"
        className={buttonClasses({ variant: 'primary', size: 'xs' })}
      >
        <img src="/ai-canvas-icon-mono.svg" alt="" width={16} height={14} className="shrink-0" />
        Get MCP
      </Link>
    </div>
  )
}
