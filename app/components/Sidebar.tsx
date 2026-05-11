'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowElbowDownRight, CaretDown, Cube, DiamondsFour, EnvelopeSimple, GithubLogo, Info, MagnifyingGlass, PenNib, X, XLogo } from '@phosphor-icons/react'
import { CONTACT_EMAIL, GITHUB_URL, X_URL } from '../lib/config'
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
  { title: 'SVGs', icon: <PenNib weight="regular" size={16} />, labels: [], disabled: true },
  { title: 'Design Systems', icon: <Cube weight="regular" size={16} />, labels: DESIGN_SYSTEM_LABELS, disabled: true },
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
  const isHome = pathname === '/components'
  const activeCategory = isHome ? (searchParams.get('category') ?? 'All Components') : null

  // Hide the global sidebar on design-system preview routes so the design
  // system gets the full viewport. Also hidden on /ideation/* — that subtree
  // ships its own duplicated sidebar/topbar for the new design-systems flow.
  const hideSidebar =
    pathname?.startsWith('/design-systems/') || pathname?.startsWith('/ideation')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (title: string) =>
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))

  // ── Search ──────────────────────────────────────────────────────────────
  // Local state is the source of truth while typing; URL is written via a
  // debounced effect so fast keystrokes can't fight themselves.
  const urlQuery = searchParams.get('q') ?? ''
  const [searchValue, setSearchValue] = useState(urlQuery)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()

  // Tracks the last value we pushed into the URL. When urlQuery matches, the
  // change came from us — don't overwrite local state. When it doesn't match,
  // it's an external change (back/forward, category click) — sync.
  const lastPushed = useRef(urlQuery)

  useEffect(() => {
    // Never overwrite while the user is actively editing. Fast typing can put
    // two debounced pushes in flight; if the older Transition commits after
    // lastPushed advances to the newer value, a naive check would misread it
    // as external and clobber the input ("last letter disappears, then
    // reappears"). While focused, the input is the source of truth — any URL
    // change is either our own push landing or will be reconciled on blur.
    if (document.activeElement === searchInputRef.current) return
    if (urlQuery === lastPushed.current) return
    setSearchValue(urlQuery)
    lastPushed.current = urlQuery
  }, [urlQuery])

  // Debounced write: local searchValue → URL.
  useEffect(() => {
    if (searchValue === urlQuery) return
    const timer = setTimeout(() => {
      lastPushed.current = searchValue
      const params = new URLSearchParams(searchParams.toString())
      if (searchValue) params.set('q', searchValue)
      else params.delete('q')
      const qs = params.toString()
      startTransition(() => {
        router.replace(qs ? `/components?${qs}` : '/components', { scroll: false })
      })
    }, 150)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

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

  const clearSearch = () => {
    setSearchValue('')
    searchInputRef.current?.focus()
  }

  if (hideSidebar) return null

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-sand-300 bg-sand-200 dark:border-sand-800 dark:bg-sand-950">

      {/* ── Logo ── */}
      <div className="flex h-14 shrink-0 items-center border-b border-sand-300 px-4 dark:border-sand-800">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-sand-900 dark:text-sand-50"
        >
          <img src="/ai-canvas-icon.svg" alt="" width={20} height={17} className="shrink-0" />
          AI Canvas
          <span className="ml-0.5 rounded-md border border-sand-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sand-500 dark:border-sand-700 dark:text-sand-400">
            Beta
          </span>
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
            onChange={(e) => setSearchValue(e.target.value)}
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
                  href="/components"
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
                    const href = `/components?category=${encodeURIComponent(label)}`
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

        {/* ── Divider ── */}
        <div className="my-2 border-t border-sand-300 dark:border-sand-800" />

        {/* ── About & Contact ── */}
        <div className="space-y-0.5">
          <Link
            href="/about"
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
              pathname === '/about'
                ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
            }`}
          >
            <Info weight="regular" size={16} />
            <span>About</span>
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-sand-700 transition-colors hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100"
          >
            <EnvelopeSimple weight="regular" size={16} />
            <span>Contact</span>
          </a>
        </div>
      </nav>

      {/* ── Social icons ── */}
      {/* GitHub + X moved here from the page header so the top-right can
          carry the auth pill + Get MCP CTA. Sits above the "Send a Coffee"
          card. No top border — the icons float quietly above the card. */}
      <div className="shrink-0 px-3 pt-2 pb-1">
        <div className="flex items-center gap-1">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
          >
            <GithubLogo weight="regular" size={18} />
          </a>
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X profile"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
          >
            <XLogo weight="regular" size={18} />
          </a>
        </div>
      </div>

      {/* ── Bottom card ── */}
      {pathname !== '/support' && <div className="shrink-0 px-3 pb-3 pt-0">
        {/* Progressive disclosure — collapsed by default to just the CTA;
            hovering reveals the "Hi, I'm Alex" intro. Container chrome
            (border, surface, padding) stays constant so the widget never
            jumps in width — only the height grows. */}
        <div className="group overflow-hidden rounded-xl border border-sand-300 bg-sand-100 p-4 dark:border-sand-800 dark:bg-sand-900">

          {/* Collapsible intro. The grid 0fr → 1fr trick animates height
              smoothly without having to measure content in JS. */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="text-xs leading-relaxed text-sand-500 dark:text-sand-400">
                Hi, I&apos;m Alex. I build this in my evenings and weekends.
              </p>
              {/* Gap between intro and CTA — sits inside the collapsing
                  region so it disappears along with the text. */}
              <div className="h-3" />
            </div>
          </div>

          {/* CTA — always visible. */}
          <a
            href="https://ko-fi.com/aicanvasme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-sand-300 bg-transparent px-3 py-2 text-xs font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100"
          >
            <img src="/kofi.svg" alt="" aria-hidden="true" className="h-4 w-4 shrink-0" />
            Send a Coffee
          </a>
        </div>
      </div>}

    </aside>
  )
}
