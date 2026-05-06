'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  ArrowElbowDownRight,
  CaretDown,
  Cube,
  DiamondsFour,
  EnvelopeSimple,
  Hexagon,
  Info,
  MagnifyingGlass,
  X,
} from '@phosphor-icons/react'
import { CONTACT_EMAIL } from '../lib/config'
import { COMPONENTS } from '../lib/component-registry'
import { ANDROMEDA_COMPONENT_META } from '../_lib/andromeda/andromeda-meta'
import { AndromedaIcon } from '../../design-systems/andromeda/AndromedaIcon'

// System → leading-icon mapping. Each system gets its own brand mark
// in the sidebar nav; rendered in mono mode so the icon inherits the
// row's text color and reads alongside DiamondsFour / Cube / etc.
const SYSTEM_ICONS: Record<string, (props: { size?: number }) => React.ReactElement> = {
  andromeda: ({ size = 14 }) => <AndromedaIcon size={size} mono />,
  meridian: ({ size = 14 }) => <Hexagon weight="fill" size={size} />,
}

// Disabled / placeholder systems — shown under the Design Systems pole
// with a "Soon" chip, not yet linkable. Promoted into SYSTEMS once they
// have at least one component.
const PLACEHOLDER_SYSTEMS = [
  { slug: 'meridian', name: 'Meridian' },
] as const

// Mirrors production Sidebar.tsx for spacing/styling parity. The only
// material difference is the Design Systems pole: instead of production's
// disabled "Glass · soon" placeholder, this version expands Andromeda
// into its own component tree + Examples folder. Components/SVGs/About/
// Contact/Buy-me-a-coffee blocks are copied verbatim so the user can
// visually verify chrome consistency.

// ── Production component categories (must match COMPONENTS_LABELS in
// app/components/Sidebar.tsx so counts add up).
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

// Design systems shown under the Design Systems pole. Add Meridian here
// once it gets the same per-component treatment.
const SYSTEMS = [
  {
    slug: 'andromeda',
    name: 'Andromeda',
    components: ANDROMEDA_COMPONENT_META.map((c) => ({ slug: c.slug, name: c.name })),
    blocks: [
      { slug: 'mission-control', name: 'Mission Control', domain: 'Sci-Fi' },
      { slug: 'service-order', name: 'Service Order', domain: 'Telecom' },
      { slug: 'exchange-terminal', name: 'Exchange Terminal', domain: 'Finance' },
      { slug: 'resource-planning', name: 'Resource Planning', domain: 'Operations' },
    ],
  },
] as const

// Block routes are full-screen — chrome is suppressed to let the
// composition fill the viewport, same way examples used to behave.
const BLOCK_LEAF_RE = /^\/design-systems\/[^/]+\/blocks\/[^/]+/

function countByLabel(label: string) {
  return COMPONENTS.filter((c) =>
    c.tags.some((t) => t.accent && t.label === label)
  ).length
}

// ── Reusable row primitive — keeps padding/sizing consistent inside
// nested lists without repeating className soup at every callsite.
function NestedRow({
  href,
  active,
  depth = 1,
  leading,
  children,
}: {
  href?: string
  active?: boolean
  depth?: number
  leading?: ReactNode
  children: ReactNode
}) {
  const cls = `group flex items-center gap-2 rounded-md py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
      : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
  }`
  // depth 1 mirrors production's category indent (px-2 + ArrowElbowDownRight).
  const padLeft = depth === 1 ? 'pl-2' : depth === 2 ? 'pl-7' : 'pl-10'
  const inner = (
    <>
      {leading}
      <span className="flex-1 truncate">{children}</span>
    </>
  )
  if (href) {
    return (
      <Link href={href} className={`${cls} ${padLeft} pr-2`}>
        {inner}
      </Link>
    )
  }
  return <div className={`${cls} ${padLeft} pr-2`}>{inner}</div>
}

export function IdeationSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname() ?? ''

  // Examples open distraction-free — no sidebar, no topbar.
  if (BLOCK_LEAF_RE.test(pathname)) return null

  // ── Mutual-exclusion of the two poles (Components / Design Systems) ──
  // Per-component pages live at `/design-systems/<slug>/<component>` (clean
  // URLs); the showcase + examples wrapper still lives under /ideation/.
  // Either path counts as being inside the Design Systems pole.
  const onDesignSystems =
    pathname.startsWith('/ideation/design-systems') ||
    pathname.startsWith('/design-systems')
  const onComponents = !onDesignSystems

  const [collapsedDS, setCollapsedDS] = useState(!onDesignSystems)
  const [collapsedComponents, setCollapsedComponents] = useState(!onComponents)

  // Click toggles the pole. Mutual exclusion only kicks in when *opening*
  // — opening one auto-closes the other; closing a pole leaves the other
  // alone, so you can have neither pole expanded.
  function toggleComponents() {
    setCollapsedComponents((prev) => {
      if (prev) {
        // was collapsed → expand and close the other pole
        setCollapsedDS(true)
        return false
      }
      // was expanded → just collapse
      return true
    })
  }
  function toggleDS() {
    setCollapsedDS((prev) => {
      if (prev) {
        setCollapsedComponents(true)
        return false
      }
      return true
    })
  }

  // Active leaves inside the Design Systems pole. Match either URL space:
  // ideation playground (overview/showcase/examples) or clean live paths
  // (per-component pages).
  const activeSystem = SYSTEMS.find(
    (s) =>
      pathname.startsWith(`/ideation/design-systems/${s.slug}`) ||
      pathname.startsWith(`/design-systems/${s.slug}`),
  )
  const activeAndromedaComponent = activeSystem
    ? ANDROMEDA_COMPONENT_META.find(
        (c) => pathname === `/design-systems/${activeSystem.slug}/${c.slug}`,
      )
    : null
  const onBlocks =
    activeSystem &&
    pathname.startsWith(`/design-systems/${activeSystem.slug}/blocks`)
  const activeBlock = onBlocks
    ? activeSystem.blocks.find(
        (b) => pathname === `/design-systems/${activeSystem.slug}/blocks/${b.slug}`,
      )
    : null

  // Active component category (mirrors production behaviour exactly).
  const activeCategory = pathname === '/components'
    ? (searchParams.get('category') ?? 'All Components')
    : null

  // ── Search ──────────────────────────────────────────────────────────────
  // Same debounced-URL pattern as production Sidebar. Search routes to
  // /components (production) so this input behaves identically when used.
  const urlQuery = searchParams.get('q') ?? ''
  const [searchValue, setSearchValue] = useState(urlQuery)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()
  const lastPushed = useRef(urlQuery)

  useEffect(() => {
    if (document.activeElement === searchInputRef.current) return
    if (urlQuery === lastPushed.current) return
    setSearchValue(urlQuery)
    lastPushed.current = urlQuery
  }, [urlQuery])

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

  // ⌘K / Ctrl+K focus
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

  function clearSearch() {
    setSearchValue('')
    searchInputRef.current?.focus()
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-sand-300 bg-sand-200 dark:border-sand-800 dark:bg-sand-950">
      {/* ── Logo + Ideation badge ───────────────────────────────────────── */}
      <div className="flex h-14 shrink-0 items-center border-b border-sand-300 px-4 dark:border-sand-800">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-sand-900 dark:text-sand-50"
        >
          <img src="/ai-canvas-icon.svg" alt="" width={20} height={17} className="shrink-0" />
          AI Canvas
          <span className="ml-0.5 rounded-md border border-olive-500/30 bg-olive-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-olive-600 dark:text-olive-400">
            Ideation
          </span>
        </Link>
      </div>

      {/* ── Search (same shape as production) ──────────────────────────── */}
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

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto px-3 pt-2 pb-2"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0, #000 8px, #000 calc(100% - 16px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0, #000 8px, #000 calc(100% - 16px), transparent 100%)',
        }}
      >
        {/* ── Components pole ───────────────────────────────────────────── */}
        <div className="mb-3">
          <button
            type="button"
            onClick={toggleComponents}
            className={`mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100`}
          >
            <DiamondsFour weight="regular" size={16} />
            <span className="flex-1 text-left">Components</span>
            <span className="tabular-nums text-xs text-sand-400 dark:text-sand-600">
              {COMPONENTS.length}
            </span>
            <CaretDown
              size={12}
              weight="regular"
              className={`shrink-0 transition-transform ${
                collapsedComponents ? '-rotate-90' : ''
              }`}
            />
          </button>
          {!collapsedComponents && (
            <ul className="space-y-0.5">
              <li>
                <NestedRow
                  href="/components"
                  active={activeCategory === 'All Components'}
                  leading={
                    <ArrowElbowDownRight
                      weight="regular"
                      size={12}
                      className="shrink-0 text-sand-300 dark:text-sand-700"
                    />
                  }
                >
                  All Components
                </NestedRow>
              </li>
              {COMPONENTS_LABELS.map((label) => {
                const isActive = label === activeCategory
                const count = countByLabel(label)
                const href = `/components?category=${encodeURIComponent(label)}`
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
                      <ArrowElbowDownRight
                        weight="regular"
                        size={12}
                        className="shrink-0 text-sand-300 dark:text-sand-700"
                      />
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

        {/* ── Design Systems pole ──────────────────────────────────────── */}
        <div className="mb-3">
          <button
            type="button"
            onClick={toggleDS}
            className={`mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100`}
          >
            <Cube weight="regular" size={16} />
            <span className="flex-1 text-left">Design Systems</span>
            <span className="rounded-md border border-olive-500/30 bg-olive-500/10 px-1.5 py-0.5 text-xxs font-semibold uppercase tracking-wider text-olive-600 dark:text-olive-400">
              New
            </span>
          </button>
          {!collapsedDS && (
            <ul className="space-y-0.5">
              {SYSTEMS.map((system) => {
                // "System root" URLs — the showcase (clean), the bare
                // overview (clean), and the legacy ideation wrapper. All
                // three highlight the system row as active.
                const systemActive =
                  pathname === `/design-systems/${system.slug}/showcase` ||
                  pathname === `/design-systems/${system.slug}` ||
                  pathname === `/ideation/design-systems/${system.slug}`
                const systemSelected = activeSystem?.slug === system.slug
                return (
                  <li key={system.slug}>
                    <Link
                      href={`/design-systems/${system.slug}/showcase`}
                      className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                        systemActive
                          ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                          : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                      }`}
                    >
                      {/* Arrow at px-2 lines up exactly with the parent
                          Design Systems pole's Cube icon above (both
                          start 8px from the left edge), so the row reads
                          as a sibling of the pole header rather than a
                          deeply-nested item. */}
                      <ArrowElbowDownRight
                        weight="regular"
                        size={12}
                        className="shrink-0 text-sand-300 dark:text-sand-700"
                      />
                      {SYSTEM_ICONS[system.slug] && (
                        <span className="shrink-0">
                          {SYSTEM_ICONS[system.slug]({ size: 14 })}
                        </span>
                      )}
                      <span className="flex-1 font-semibold">{system.name}</span>
                    </Link>
                    {systemSelected && (
                      <ul className="mt-0.5 space-y-0.5">
                        {/* ── Blocks (label + flat list) ──────────── */}
                        <li className="mt-1">
                          <div className="pt-1.5 pb-0.5 pl-8 pr-2 text-xxs uppercase tracking-wider text-sand-500">
                            Blocks
                          </div>
                          <ul className="space-y-0.5">
                            {system.blocks.map((b) => {
                              const isActive = activeBlock?.slug === b.slug
                              return (
                                <li key={b.slug}>
                                  <Link
                                    href={`/design-systems/${system.slug}/blocks/${b.slug}`}
                                    target="_blank"
                                    className={`flex items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-[13px] font-medium transition-colors ${
                                      isActive
                                        ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                                        : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                                    }`}
                                  >
                                    <span className="flex-1 truncate">{b.name}</span>
                                    <span className="ml-auto text-xxs uppercase tracking-wider text-sand-500 dark:text-sand-500">
                                      {b.domain}
                                    </span>
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </li>

                        {/* ── Components (label + flat list) ──────── */}
                        <li className="mt-1">
                          <div className="pt-1.5 pb-0.5 pl-8 pr-2 text-xxs uppercase tracking-wider text-sand-500">
                            Components
                          </div>
                          <ul className="space-y-0.5">
                            {system.components.map((c) => {
                              const isActive =
                                activeAndromedaComponent?.slug === c.slug
                              return (
                                <li key={c.slug}>
                                  <Link
                                    href={`/design-systems/${system.slug}/${c.slug}`}
                                    className={`flex items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-[13px] font-medium transition-colors ${
                                      isActive
                                        ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                                        : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                                    }`}
                                  >
                                    {c.name}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </li>
                      </ul>
                    )}
                  </li>
                )
              })}
              {PLACEHOLDER_SYSTEMS.map((system) => (
                <li key={system.slug}>
                  <div
                    aria-disabled="true"
                    className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium cursor-not-allowed text-sand-400/60 dark:text-sand-600/60"
                  >
                    <ArrowElbowDownRight
                      weight="regular"
                      size={12}
                      className="shrink-0 text-sand-300 dark:text-sand-700"
                    />
                    {SYSTEM_ICONS[system.slug] && (
                      <span className="shrink-0 opacity-60">
                        {SYSTEM_ICONS[system.slug]({ size: 14 })}
                      </span>
                    )}
                    <span className="flex-1 font-semibold">{system.name}</span>
                    <span className="rounded-md border border-sand-300/40 bg-sand-300/10 px-1.5 py-0.5 text-xxs font-semibold uppercase tracking-wider text-sand-400 dark:border-sand-700/40 dark:bg-sand-800/40 dark:text-sand-500">
                      Soon
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="my-2 border-t border-sand-300 dark:border-sand-800" />

        {/* ── About + Contact (production verbatim) ────────────────────── */}
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

      {/* ── Buy me a coffee (production verbatim) ───────────────────────── */}
      <div className="shrink-0 p-3">
        <div className="overflow-hidden rounded-xl border border-olive-500/20 bg-gradient-to-b from-olive-500/10 to-transparent p-4 ring-1 ring-inset ring-olive-500/10 dark:from-olive-500/8 dark:to-transparent">
          <p className="text-sm font-bold leading-snug text-sand-900 dark:text-sand-100">
            Love what you see?
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-sand-500 dark:text-sand-400">
            Every coffee keeps this project alive and growing.
          </p>
          <a
            href="https://ko-fi.com/aicanvasme"
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
