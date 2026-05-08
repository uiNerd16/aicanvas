'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  List,
  X,
  Info,
  EnvelopeSimple,
  GithubLogo,
  XLogo,
  ArrowElbowDownRight,
  CaretDown,
  Cube,
  DiamondsFour,
  MagnifyingGlass,
  PenNib,
} from '@phosphor-icons/react'
import { GITHUB_URL, X_URL, CONTACT_EMAIL } from '../lib/config'
import type { ReactNode } from 'react'
import { COMPONENTS } from '../lib/component-registry'
import { SignedIn } from './auth/SignedIn'
import { SignedOut } from './auth/SignedOut'
import { UserMenu } from './auth/UserMenu'
import { SignInCta } from './auth/SignInCta'

// ── Tier structure (mirrors Sidebar) ──────────────────────────────────────
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

// ─── MobileNav ────────────────────────────────────────────────────────────────

export function MobileNav() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isHome = pathname === '/components'
  const activeCategory = isHome ? (searchParams.get('category') ?? 'All Components') : null

  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (title: string) =>
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))

  // Close drawer on real route change (pathname only — NOT searchParams,
  // since typing in search updates ?q= and would otherwise close the drawer
  // on every keystroke).
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  // ── Search ──────────────────────────────────────────────────────────────
  // Local state drives the input; URL is written via a debounced effect so
  // fast keystrokes don't fight themselves. lastPushed distinguishes our
  // own pushes from external URL changes (back/forward, category click).
  const urlQuery = searchParams.get('q') ?? ''
  const [searchValue, setSearchValue] = useState(urlQuery)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()

  const lastPushed = useRef(urlQuery)

  useEffect(() => {
    // While the input is focused, local state is sacred — fast typing can put
    // two debounced pushes in flight, and an older Transition committing
    // after lastPushed has advanced would otherwise clobber the input.
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

  const clearSearch = () => {
    setSearchValue('')
    searchInputRef.current?.focus()
  }

  // Hide on design-system preview routes and on the /ideation/* subtree —
  // that subtree ships its own duplicated mobile/desktop chrome.
  const hideMobileNav =
    pathname?.startsWith('/design-systems/') ||
    pathname?.startsWith('/ideation')
  if (hideMobileNav) return null

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-sand-300 bg-sand-200 px-4 dark:border-sand-800 dark:bg-sand-950 md:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold text-sand-900 dark:text-sand-50">
          <img src="/ai-canvas-icon.svg" alt="" width={18} height={15} className="shrink-0" />
          AI Canvas
          <span className="ml-0.5 rounded-md border border-sand-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sand-500 dark:border-sand-700 dark:text-sand-400">
            Beta
          </span>
        </Link>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-600 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
        >
          <List weight="regular" size={20} />
        </button>
      </div>

      {/* ── Slide-in drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="mobile-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sand-200 shadow-2xl dark:bg-sand-950 md:hidden"
            >
              {/* Drawer header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-sand-300 px-4 dark:border-sand-800">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-sand-900 dark:text-sand-50"
                  onClick={() => setOpen(false)}
                >
                  <img src="/ai-canvas-icon.svg" alt="" width={18} height={15} className="shrink-0" />
                  AI Canvas
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                >
                  <X weight="regular" size={18} />
                </button>
              </div>

              {/* Search */}
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
                    placeholder="Search..."
                    // 16px font-size prevents iOS Safari from auto-zooming on focus.
                    style={{ fontSize: 16 }}
                    className="w-full rounded-lg border border-sand-300 bg-sand-100 py-1.5 pl-8 pr-8 text-sand-900 outline-none transition-colors placeholder:text-sand-400 hover:border-sand-400 focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20 dark:border-sand-700 dark:bg-sand-900 dark:text-sand-50 dark:placeholder:text-sand-500 dark:hover:border-sand-600 dark:focus:border-olive-500 dark:focus:ring-olive-500/20"
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

              {/* Navigation */}
              <nav
                className="flex-1 overflow-y-auto px-3 pt-2 pb-2"
                style={{
                  maskImage:
                    'linear-gradient(to bottom, transparent 0, #000 8px, #000 calc(100% - 16px), transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, transparent 0, #000 8px, #000 calc(100% - 16px), transparent 100%)',
                }}
              >
                {SECTIONS.map((section) => {
                  const isCollapsed = collapsed[section.title] ?? false
                  const isDisabled = section.disabled === true

                  return (
                    <div key={section.title} className="mb-3">
                      {section.title === 'Components' ? (
                        <Link
                          href="/components"
                          onClick={() => setOpen(false)}
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
                                  onClick={() => setOpen(false)}
                                  className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                                    isActive
                                      ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                                      : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                                  }`}
                                >
                                  <ArrowElbowDownRight weight="regular" size={12} className="shrink-0 text-sand-300 dark:text-sand-700" />
                                  <span className="flex-1">{label}</span>
                                  <span className={`tabular-nums text-xs ${isActive ? 'text-sand-600 dark:text-sand-400' : 'text-sand-400 dark:text-sand-600'}`}>
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

                {/* About — follows same pattern as section headers */}
                <div className="mb-3 h-px bg-sand-300 dark:bg-sand-800" />
                <div className="mb-3">
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className={`mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
                      pathname === '/about'
                        ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                        : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                    }`}
                  >
                    <span><Info weight="regular" size={16} /></span>
                    <span className="flex-1">About</span>
                  </Link>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-sand-700 transition-colors hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100"
                  >
                    <span><EnvelopeSimple weight="regular" size={16} /></span>
                    <span className="flex-1">Contact</span>
                  </a>
                </div>
              </nav>

              {/* Social links */}
              <div className="shrink-0 flex items-center gap-1 px-3 pb-2">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                >
                  <GithubLogo weight="regular" size={20} />
                </a>
                <a
                  href={X_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X profile"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                >
                  <XLogo weight="regular" size={20} />
                </a>
                <Link
                  href="/mcp"
                  onClick={() => setOpen(false)}
                  className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-olive-500 px-3 py-2 text-xs font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-[0.97]"
                >
                  <img src="/ai-canvas-icon-mono.svg" alt="" width={16} height={14} className="shrink-0" />
                  Get MCP
                </Link>
              </div>

              {/* Auth row */}
              <div className="shrink-0 border-t border-sand-300 px-3 py-3 dark:border-sand-800">
                <SignedIn>
                  <UserMenu />
                </SignedIn>
                <SignedOut>
                  <SignInCta />
                </SignedOut>
              </div>

              {/* Bottom card */}
              {pathname !== '/support' && (
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
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
