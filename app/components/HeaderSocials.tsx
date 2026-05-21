'use client'

import Link from 'next/link'
import { Flask } from '@phosphor-icons/react'
import { buttonClasses } from './Button'
import { TopAuthPill } from './auth/TopAuthPill'

// ─── HeaderSocials ────────────────────────────────────────────────────────────
// Right side of any sticky page header. The olive "Lab" CTA comes first,
// then the auth pill (compact letter-avatar + dropdown when signed in,
// "Sign in" button that opens the auth modal when signed out).
//
// Get MCP moved into the sidebar nav (icon + label) alongside Pricing/About.
// GitHub + X icons live in the sidebar above the "Send a Coffee" card.

export function HeaderSocials() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/lab"
        className={buttonClasses({ variant: 'primary', size: 'xs' })}
      >
        <Flask weight="regular" size={16} className="shrink-0" />
        Lab
      </Link>
      <TopAuthPill />
    </div>
  )
}
