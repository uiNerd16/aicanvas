'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, CaretRight } from '@phosphor-icons/react'
import { HeaderSocials } from '../components/HeaderSocials'
import { ANDROMEDA_COMPONENT_META } from '../_lib/andromeda/andromeda-meta'

// Three layouts driven by the current pathname:
//
// 1. Distraction-free example leaf  → return null (no chrome at all).
// 2. Andromeda Overview (showcase)  → "Design Systems" / "Andromeda" /
//    socials. Mirrors the production component-page header pattern so
//    the design system page reads like the rest of the site.
// 3. Andromeda component page       → "Back" link to the Overview /
//    component name in olive / socials.
// 4. Anything else                  → breadcrumb fallback (used by
//    /ideation/components etc.).

const SEGMENT_NAMES: Record<string, string> = {
  ideation: 'Ideation',
  components: 'Components',
  'design-systems': 'Design Systems',
  andromeda: 'Andromeda',
  examples: 'See It in Action',
  dashboard: 'Dashboard',
  'operator-console': 'Operator Console',
}

// Block routes are full-screen — chrome is suppressed to let the
// composition fill the viewport.
const BLOCK_LEAF_RE = /^\/design-systems\/[^/]+\/blocks\/[^/]+/
// Back-button target on per-component pages — the canonical Andromeda
// component browser lives at /design-systems/andromeda/showcase.
const ANDROMEDA_OVERVIEW = '/design-systems/andromeda/showcase'
// Per-component pages live at /design-systems/andromeda/<slug>; the
// `showcase`, `blocks`, and `examples` segments must be excluded so
// they fall through to the overview branch / breadcrumb fallback.
const ANDROMEDA_COMPONENT_RE =
  /^\/design-systems\/andromeda\/(?!examples|showcase|blocks)([^/]+)\/?$/
// All paths that should render the "Design Systems / Andromeda" header
// — the new clean overview + showcase, plus the legacy ideation wrapper.
const ANDROMEDA_OVERVIEW_PATHS = new Set([
  '/design-systems/andromeda',
  '/design-systems/andromeda/showcase',
  '/ideation/design-systems/andromeda',
])

function prettify(seg: string): string {
  if (SEGMENT_NAMES[seg]) return SEGMENT_NAMES[seg]
  return seg
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

const headerClass =
  'sticky top-0 z-10 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950 md:grid'

export function IdeationTopBar() {
  const pathname = usePathname() ?? '/ideation'

  // Distraction-free example pages provide their own chrome (a floating
  // exit button), so the topbar disappears there.
  if (BLOCK_LEAF_RE.test(pathname)) return null

  // ── Andromeda component leaf — Back / name / socials ────────────────
  const componentMatch = pathname.match(ANDROMEDA_COMPONENT_RE)
  if (componentMatch) {
    const slug = componentMatch[1]
    const meta = ANDROMEDA_COMPONENT_META.find((c) => c.slug === slug)
    const name = meta?.name ?? prettify(slug)
    return (
      <div className={headerClass}>
        <Link
          href={ANDROMEDA_OVERVIEW}
          className="flex items-center gap-2 text-sm font-semibold text-sand-700 transition-colors hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-200"
        >
          <ArrowLeft weight="regular" size={15} />
          Back
        </Link>
        <span className="text-sm font-semibold">
          <span className="text-sand-600 dark:text-sand-400">Andromeda</span>
          <span className="mx-1 text-sand-400 dark:text-sand-600">/</span>
          <span className="text-olive-500">{name}</span>
        </span>
        <div className="flex justify-end">
          <HeaderSocials />
        </div>
      </div>
    )
  }

  // ── Andromeda Overview (showcase) — section / system / socials ──────
  if (ANDROMEDA_OVERVIEW_PATHS.has(pathname)) {
    return (
      <div className={headerClass}>
        <span className="text-sm font-semibold text-sand-700 dark:text-sand-300">
          Design Systems
        </span>
        <span className="text-sm font-semibold text-olive-500">/Andromeda</span>
        <div className="flex justify-end">
          <HeaderSocials />
        </div>
      </div>
    )
  }

  // ── Fallback breadcrumb for any other ideation route ────────────────
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = segments.map((seg, i) => ({
    name: prettify(seg),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))
  return (
    <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1">
            {i > 0 && (
              <CaretRight
                size={12}
                weight="regular"
                className="text-sand-400 dark:text-sand-600"
              />
            )}
            {c.isLast ? (
              <span className="font-semibold text-sand-900 dark:text-sand-50">
                {c.name}
              </span>
            ) : (
              <Link
                href={c.href}
                className="font-medium text-sand-600 transition-colors hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-100"
              >
                {c.name}
              </Link>
            )}
          </span>
        ))}
      </nav>
      <div className="ml-auto">
        <HeaderSocials />
      </div>
    </div>
  )
}
