'use client'

import Link from 'next/link'
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
        className="inline-flex items-center gap-1.5 rounded-lg bg-olive-500 px-3 py-2 text-xs font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-[0.97]"
      >
        <img src="/ai-canvas-icon-mono.svg" alt="" width={16} height={14} className="shrink-0" />
        Get MCP
      </Link>
    </div>
  )
}
