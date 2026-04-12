'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowElbowDownRight, CaretDown, Cube, DiamondsFour, MagnifyingGlass, SquareHalf, X } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { COMPONENTS } from '../lib/component-registry'

// ── Tier structure ────────────────────────────────────────────────────────
// Hardcoded so the ordering is predictable. Every label here must correspond
// to an `accent: true` tag on at least one component in the registry.
const COMPONENTS_LABELS = [
  'Backgrounds',
  'Buttons & Toggles',
  'Navigation',
  'Widgets',
  'Cards & Modals',
  'Inputs & Controls',
  'Notifications',
  'Typography',
] as const

const DESIGN_SYSTEM_LABELS = ['Glass'] as const

type Section = {
  title: string
  icon: ReactNode
  labels: readonly string[]
  disabled?: boolean
}

const SECTIONS: Section[] = [
  { title: 'Components', icon: <DiamondsFour weight="regular" size={16} />, labels: COMPONENTS_LABELS },
  { title: 'Design Systems', icon: <Cube weight="regular" size={16} />, labels: DESIGN_SYSTEM_LABELS, disabled: true },
  { title: 'Hero Sections', icon: <SquareHalf weight="regular" size={16} />, labels: [], disabled: true },
]

function countByLabel(label: string) {
  return COMPONENTS.filter((c) =>
    c.tags.some((t) => t.accent && t.label === label)
  ).length
}

export function Sidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const activeCategory = isHome ? (searchParams.get('category') ?? 'All Components') : null

  // Hide the global sidebar on design-system preview routes so the design
  // system gets the full viewport.
  const hideSidebar = pathname?.startsWith('/design-systems/')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (title: string) =>
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))

  // ── Search ──────────────────────────────────────────────────────────────
  // Local state keeps the input snappy; URL is the source of truth so the
  // home page (HomeClient) can read `?q=` and filter the grid.
  const urlQuery = searchParams.get('q') ?? ''
  const [searchValue, setSearchValue] = useState(urlQuery)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()

  // Sync local state when the URL changes from outside (back/forward, clear button).
  useEffect(() => {
    setSearchValue(urlQuery)
  }, [urlQuery])

  // ⌘K / Ctrl+K focuses the search input.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const updateQuery = (next: string) => {
    setSearchValue(next)
    const params = new URLSearchParams(searchParams.toString())
    if (next) params.set('q', next)
    else params.delete('q')
    const qs = params.toString()
    startTransition(() => {
      router.replace(qs ? `/?${qs}` : '/', { scroll: false })
    })
  }

  const clearSearch = () => {
    updateQuery('')
    searchInputRef.current?.focus()
  }

  if (hideSidebar) return null

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-sand-300 bg-sand-200 dark:border-sand-800 dark:bg-sand-950">

      {/* ── Logo ── */}
      <div className="flex h-14 shrink-0 items-center border-b border-sand-300 px-4 dark:border-sand-800">
        <Link
          href="/home"
          className="flex items-center gap-2 font-bold text-sand-900 dark:text-sand-50"
        >
          <img src="/aicanvas.svg" alt="" width={20} height={17} className="shrink-0" />
          AI Canvas
        </Link>
      </div>

      {/* ── Search ── */}
      <div className="shrink-0 px-3 py-3">
        <div className="relative">
          <MagnifyingGlass
            weight="regular"
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sand-400 dark:text-sand-500"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-lg border border-sand-300 bg-sand-100 py-1.5 pl-8 pr-8 text-sm text-sand-900 outline-none transition-colors placeholder:text-sand-400 hover:border-sand-400 focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20 dark:border-sand-700 dark:bg-sand-900 dark:text-sand-50 dark:placeholder:text-sand-500 dark:hover:border-sand-600 dark:focus:border-olive-500 dark:focus:ring-olive-500/20"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-sand-400 transition-colors hover:text-sand-700 dark:text-sand-500 dark:hover:text-sand-300"
            >
              <X weight="regular" size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav
        className="flex-1 overflow-y-auto px-3 pt-2 pb-2"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0, #000 8px, #000 calc(100% - 16px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0, #000 8px, #000 calc(100% - 16px), transparent 100%)',
        }}
      >
        {/* Tiered sections */}
        {SECTIONS.map((section) => {
          const isCollapsed = collapsed[section.title] ?? false
          const isDisabled = section.disabled === true

          return (
            <div key={section.title} className="mb-3">
              {section.title === 'Components' ? (
                <Link
                  href="/"
                  className={`mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
                    activeCategory === 'All Components'
                      ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                      : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span className="flex-1">{section.title}</span>
                  <span className="tabular-nums text-xs text-sand-400 dark:text-sand-600">{COMPONENTS.length}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => !isDisabled && toggle(section.title)}
                  disabled={isDisabled}
                  className={`mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
                    isDisabled
                      ? 'cursor-not-allowed text-sand-400/60 dark:text-sand-600/60'
                      : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                  }`}
                >
                  <span className={isDisabled ? 'opacity-40' : ''}>{section.icon}</span>
                  <span className="flex-1 text-left">
                    {section.title}
                    {isDisabled && <span className="ml-1 text-xs font-normal text-sand-400 dark:text-sand-700">· soon</span>}
                  </span>
                  {!isDisabled && <CaretDown size={12} weight="regular" className={`shrink-0 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />}
                </button>
              )}

              {!isCollapsed && !isDisabled && (
                <ul className="space-y-0.5">
                  {section.labels.map((label) => {
                    const isActive = label === activeCategory
                    const href = `/?category=${encodeURIComponent(label)}`
                    const count = countByLabel(label)
                    return (
                      <li key={label}>
                        <Link
                          href={href}
                          className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                              : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                          }`}
                        >
                          <ArrowElbowDownRight weight="regular" size={12} className="shrink-0 text-sand-300 dark:text-sand-700" />
                          <span className="flex-1">{label}</span>
                          <span
                            className={`tabular-nums text-xs ${
                              isActive
                                ? 'text-sand-600 dark:text-sand-400'
                                : 'text-sand-400 dark:text-sand-600'
                            }`}
                          >
                            {count}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </nav>

      {/* ── Bottom card ── */}
      <div className="shrink-0 p-3">
        <div className="overflow-hidden rounded-xl border border-olive-500/20 bg-gradient-to-b from-olive-500/10 to-transparent p-4 ring-1 ring-inset ring-olive-500/10 dark:from-olive-500/8 dark:to-transparent">

          {/* Icon badge */}
          {/* Copy */}
          <p className="text-sm font-bold leading-snug text-sand-900 dark:text-sand-100">
            Love what you see?
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-sand-500 dark:text-sand-400">
            Every coffee keeps this project alive and growing.
          </p>

          {/* CTA */}
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center rounded-lg bg-olive-500 px-3 py-2 text-xs font-semibold text-sand-950 transition-colors hover:bg-olive-400"
          >
            Buy me a coffee
          </a>
        </div>
      </div>

    </aside>
  )
}
