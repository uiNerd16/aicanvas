'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { COMPONENTS } from '../lib/component-registry'

// Derive categories from accent tags — runs once at module level
const accentLabels = [...new Set(
  COMPONENTS.flatMap(c => c.tags.filter(t => t.accent).map(t => t.label))
)]

const CATEGORIES = [
  { label: 'All Components', count: COMPONENTS.length },
  ...accentLabels.map(label => ({
    label,
    count: COMPONENTS.filter(c => c.tags.some(t => t.accent && t.label === label)).length,
  })),
]

export function Sidebar() {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') ?? 'All Components'

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-sand-300 bg-sand-200 dark:border-sand-800 dark:bg-sand-950">

      {/* ── Logo ── */}
      <div className="flex h-14 shrink-0 items-center border-b border-sand-300 px-4 dark:border-sand-800">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-sand-900 dark:text-sand-50"
        >
          <span className="text-olive-500">◈</span>
          AI Canvas
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-2">
        <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-sand-400 dark:text-sand-600">
          Explore
        </p>
        <ul className="space-y-0.5">
          {CATEGORIES.map(({ label, count }) => {
            const isActive = label === activeCategory
            const href = label === 'All Components' ? '/' : `/?category=${encodeURIComponent(label)}`
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`group flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                      : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`tabular-nums text-xs ${isActive ? 'text-sand-600 dark:text-sand-400' : 'text-sand-400 dark:text-sand-600'}`}>
                    {count}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ── Bottom card ── */}
      <div className="shrink-0 p-3">
        <div className="overflow-hidden rounded-xl border border-olive-500/20 bg-gradient-to-b from-olive-500/10 to-transparent p-4 ring-1 ring-inset ring-olive-500/10 dark:from-olive-500/8 dark:to-transparent">

          {/* Icon badge */}
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-olive-500/15 dark:bg-olive-500/10">
            <span className="text-sm leading-none text-olive-600 dark:text-olive-400">✦</span>
          </div>

          {/* Copy */}
          <p className="text-sm font-bold leading-snug text-sand-900 dark:text-sand-100">
            Built with love
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-sand-500 dark:text-sand-400">
            for today's workflow
          </p>

          {/* CTA */}
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-sand-900 px-3 py-2 text-xs font-semibold text-sand-50 transition-colors hover:bg-sand-800 dark:bg-sand-100 dark:text-sand-900 dark:hover:bg-sand-200"
          >
            ☕ Buy me a coffee
          </a>
        </div>
      </div>

    </aside>
  )
}
