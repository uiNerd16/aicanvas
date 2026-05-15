'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClockClockwise, Flask, Gear, Heart, User } from '@phosphor-icons/react'
import type { ComponentType } from 'react'

// Tabs mirror the dropdown menu entries (TopAuthPill + UserMenu) — same
// order, same icons — so the surfaces feel like a single navigation system
// just rendered two ways.
type IconComponent = ComponentType<{ size?: number; weight?: 'regular' | 'bold' | 'fill' }>

const TABS: { href: string; label: string; Icon: IconComponent }[] = [
  { href: '/account', label: 'Profile', Icon: User },
  { href: '/account/saved', label: 'Saved', Icon: Heart },
  { href: '/account/lab', label: 'Made in Lab', Icon: Flask },
  { href: '/account/history', label: 'Activity', Icon: ClockClockwise },
  { href: '/account/settings', label: 'Settings', Icon: Gear },
]

export function AccountTabs() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1 border-b border-sand-300 dark:border-sand-800">
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? 'text-sand-900 dark:text-sand-50'
                : 'text-sand-500 hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-50'
            }`}
          >
            <Icon size={16} weight="regular" />
            {label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-olive-500" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
