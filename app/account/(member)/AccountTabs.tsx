'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/account', label: 'Profile' },
  { href: '/account/saved', label: 'Saved' },
  { href: '/account/history', label: 'History' },
  { href: '/account/settings', label: 'Settings' },
]

export function AccountTabs() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1 border-b border-sand-300 dark:border-sand-800">
      {TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? 'text-sand-900 dark:text-sand-50'
                : 'text-sand-500 hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-50'
            }`}
          >
            {tab.label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-olive-500" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
