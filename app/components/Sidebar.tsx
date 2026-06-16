'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowElbowDownRight, CaretDown, DiamondsFour, EnvelopeSimple, Flask, GithubLogo, Info, MagnifyingGlass, PiggyBank, Plug, X, XLogo } from '@phosphor-icons/react'
import { GITHUB_URL, X_URL } from '../lib/config'
import type { ReactNode } from 'react'
import { COMPONENTS } from '../lib/component-registry'
import { CATEGORIES, getCategoryByLabel } from '../lib/categories'
import { buttonClasses } from './Button'
import { DesignSystemsPole, TEMPLATE_LEAF_RE } from '../_components/DesignSystemsPole'

// ── Tier structure ────────────────────────────────────────────────────────
// Ordering comes from the shared categories config so the sidebar, the
// /components/category/[slug] route, and the sitemap stay in lockstep.
const COMPONENTS_LABELS = CATEGORIES.map((c) => c.label)

type Section = {
  title: string
  icon: ReactNode
  labels: readonly string[]
  disabled?: boolean
}

// The Design Systems pole is rendered separately (shared DesignSystemsPole) so
// it never drifts. This is the single Sidebar used everywhere: the root layout
// renders it plain (it hides itself on /design-systems, /ideation, /lab), and
// the design-systems / ideation layouts render it with `embedded` so it shows
// on those routes too. Only the Components pole stays in SECTIONS.
const SECTIONS: Section[] = [
  { title: 'Components', icon: <DiamondsFour weight="regular" size={16} />, labels: COMPONENTS_LABELS },
  // { title: 'SVGs', icon: <PenNib weight="regular" size={16} />, labels: [], disabled: true },
]

function countByLabel(label: string) {
  return COMPONENTS.filter((c) =>
    c.tags.some((t) => t.accent && t.label === label)
  ).length
}

export function Sidebar({ embedded = false }: { embedded?: boolean } = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isHome = pathname === '/components'
  // Active category resolves from the path first (canonical
  // /components/category/<slug>), then falls back to the legacy ?category=
  // query param so old bookmarks still highlight correctly.
  const categoryFromPath = pathname?.startsWith('/components/category/')
    ? pathname.replace('/components/category/', '')
    : null
  const activeCategory = categoryFromPath
    ? CATEGORIES.find((c) => c.slug === categoryFromPath)?.label ?? null
    : isHome
      ? (searchParams.get('category') ?? 'All Components')
      : null

  // Hide the global sidebar on design-system preview routes so the design
  // system gets the full viewport. Also hidden on /ideation/* — that subtree
  // renders this same Sidebar with `embedded` from its own layout (so the root
  // copy must stand down to avoid a duplicate). And on /lab/* — LAB has its own
  // custom top bar (logo + auth pill), no left rail, no search.
  //
  // When `embedded`, the sidebar is rendered explicitly by a design-system /
  // ideation layout, so it must bypass this hide check and actually render.
  const hideSidebar =
    !embedded &&
    (pathname?.startsWith('/design-systems/') ||
      pathname?.startsWith('/ideation') ||
      pathname?.startsWith('/lab'))
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (title: string) =>
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))

  // ── Pole collapse state ───────────────────────────────────────────────────
  // Are we inside a design-system path? Per-component pages live at
  // `/design-systems/<slug>/<component>`; the showcase + examples wrapper still
  // lives under /ideation/. Either path counts as being inside the DS pole.
  const onDesignSystems =
    pathname?.startsWith('/ideation/design-systems') ||
    pathname?.startsWith('/design-systems') ||
    false
  // The DS pole opens by default everywhere, so Andromeda + Meridian are
  // visible without a click (it was already open on design-system paths; this
  // also opens it on the home / components pages). The user can still collapse
  // it, and the mutual-exclusion toggles below still apply on interaction.
  const [collapsedDS, setCollapsedDS] = useState(false)

  // ── Embedded (design-systems / ideation) mutual-exclusion ─────────────────
  // In embedded mode the Components pole is a collapsible button (mirrors the
  // retired IdeationSidebar). On component routes it's expanded and the DS pole
  // collapsed; on design-system routes the reverse. Opening one pole auto-closes
  // the other; closing a pole leaves the other alone (you can have neither open).
  const onComponents = !onDesignSystems
  const [collapsedComponents, setCollapsedComponents] = useState(!onComponents)

  const toggleDS = () => {
    if (!embedded) {
      setCollapsedDS((prev) => !prev)
      return
    }
    setCollapsedDS((prev) => {
      if (prev) {
        setCollapsedComponents(true)
        return false
      }
      return true
    })
  }
  const toggleComponents = () => {
    setCollapsedComponents((prev) => {
      if (prev) {
        setCollapsedDS(true)
        return false
      }
      return true
    })
  }

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

  // Template / example leaves open distraction-free — no sidebar, no topbar.
  // (Only reachable in embedded mode, since template routes live under
  // /design-systems/* which the non-embedded copy already hides.)
  if (embedded && TEMPLATE_LEAF_RE.test(pathname ?? '')) return null

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
          const isComponents = section.title === 'Components'
          // In embedded (design-systems / ideation) mode the Components pole is a
          // collapsible button driven by the mutual-exclusion state, with an
          // extra "All Components" leaf — mirrors the retired IdeationSidebar so
          // navigating between the two URL spaces feels identical. On the home
          // page the header stays a direct link to /components (no leaf).
          const isCollapsed = isComponents
            ? embedded
              ? collapsedComponents
              : false
            : (collapsed[section.title] ?? false)
          const isDisabled = section.disabled === true

          return (
            <div key={section.title} className="mb-3">
              {isComponents && embedded ? (
                <button
                  type="button"
                  onClick={toggleComponents}
                  className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100"
                >
                  <span>{section.icon}</span>
                  <span className="flex-1 text-left">{section.title}</span>
                  <span className="tabular-nums text-xs text-sand-400 dark:text-sand-600">{COMPONENTS.length}</span>
                  <CaretDown size={12} weight="regular" className={`shrink-0 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                </button>
              ) : isComponents ? (
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
                  {/* Embedded mode shows an explicit "All Components" leaf since
                      the header is a collapse toggle, not a link to /components. */}
                  {isComponents && embedded && (
                    <li>
                      <Link
                        href="/components"
                        className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                          activeCategory === 'All Components'
                            ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                            : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                        }`}
                      >
                        <ArrowElbowDownRight weight="regular" size={12} className="shrink-0 text-sand-300 dark:text-sand-700" />
                        <span className="flex-1 truncate">All Components</span>
                      </Link>
                    </li>
                  )}
                  {section.labels.map((label) => {
                    const isActive = label === activeCategory
                    const cat = getCategoryByLabel(label)
                    const href = cat
                      ? `/components/category/${cat.slug}`
                      : `/components?category=${encodeURIComponent(label)}`
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

        {/* ── Design Systems pole (shared, identical on every page) ── */}
        <DesignSystemsPole collapsed={collapsedDS} onToggle={toggleDS} />

        {/* ── Divider ── */}
        <div className="my-2 border-t border-sand-300 dark:border-sand-800" />

        {/* ── Lab, Get MCP, Pricing, About & Contact ── */}
        <div className="space-y-0.5">
          <Link
            href="/lab"
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
              pathname?.startsWith('/lab')
                ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
            }`}
          >
            <Flask weight="regular" size={16} />
            <span>Lab</span>
          </Link>
          <Link
            href="/mcp"
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
              pathname === '/mcp'
                ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
            }`}
          >
            <Plug weight="regular" size={16} />
            <span>Get MCP</span>
          </Link>
          <Link
            href="/pricing"
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
              pathname === '/pricing'
                ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
            }`}
          >
            <PiggyBank weight="regular" size={16} />
            <span>Pricing</span>
          </Link>
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
          <Link
            href="/contact"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-sand-700 transition-colors hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100"
          >
            <EnvelopeSimple weight="regular" size={16} />
            <span>Contact</span>
          </Link>
        </div>
      </nav>

      {/* ── Social icons ── */}
      {/* GitHub + X moved here from the page header so the top-right can
          carry the auth pill + Get MCP CTA. No top border — the icons
          float quietly at the bottom of the rail. */}
      <div className="shrink-0 px-3 pt-2 pb-1">
        <div className="flex items-center gap-1">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className={buttonClasses({ variant: 'icon', size: 'md' })}
          >
            <GithubLogo weight="regular" size={18} />
          </a>
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X profile"
            className={buttonClasses({ variant: 'icon', size: 'md' })}
          >
            <XLogo weight="regular" size={18} />
          </a>
        </div>
      </div>

    </aside>
  )
}
