'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactElement } from 'react'
import { ArrowElbowDownRight, Cube, Hexagon, Lightning } from '@phosphor-icons/react'
import { ANDROMEDA_COMPONENT_META } from '../_lib/andromeda/andromeda-meta'
import { AndromedaIcon } from '../../design-systems/andromeda/AndromedaIcon'

// ── Shared "Design Systems" sidebar pole ────────────────────────────────────
// SINGLE SOURCE OF TRUTH for the Design Systems pole. Rendered by the one
// `app/components/Sidebar.tsx` — plain in the root layout, and with `embedded`
// in the design-systems / ideation layouts — so the pole is identical on every
// page. The sidebar owns the collapse state + toggle (mutual-exclusion with the
// Components pole) and passes it in here; the data (systems → templates →
// components) and the full pole JSX live here.

// System → leading-icon mapping. Each system gets its own brand mark in the
// sidebar nav; rendered in mono mode so the icon inherits the row's text color.
const SYSTEM_ICONS: Record<string, (props: { size?: number }) => ReactElement> = {
  andromeda: ({ size = 14 }) => <AndromedaIcon size={size} mono />,
  meridian: ({ size = 14 }) => <Hexagon weight="fill" size={size} />,
}

// Disabled / placeholder systems — shown with a "Soon" chip, not yet linkable.
// Promoted into SYSTEMS once they have at least one component.
const PLACEHOLDER_SYSTEMS = [{ slug: 'meridian', name: 'Meridian' }] as const

// Design systems shown under the Design Systems pole. Add Meridian here once it
// gets the same per-component treatment.
const SYSTEMS = [
  {
    slug: 'andromeda',
    name: 'Andromeda',
    // Has a premium Brain page at /design-systems/<slug>/brain (rules +
    // foundations + per-component intelligence).
    brain: true,
    components: ANDROMEDA_COMPONENT_META.map((c) => ({ slug: c.slug, name: c.name })),
    templates: [
      { slug: 'mission-control', name: 'Mission Control', domain: 'Sci-Fi' },
      { slug: 'service-order', name: 'Service Order', domain: 'Telecom' },
      // exchange-terminal — hidden, source preserved (see design-systems.config.mjs)
      { slug: 'resource-planning', name: 'Resource Planning', domain: 'Operations' },
      { slug: 'signal-room', name: 'Signal Room', domain: 'Audio' },
    ],
  },
] as const

// Template routes are full-screen — chrome is suppressed to let the composition
// fill the viewport. Exported so the sidebars can suppress themselves on them.
export const TEMPLATE_LEAF_RE = /^\/design-systems\/[^/]+\/templates\/[^/]+/

export function DesignSystemsPole({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean
  onToggle: () => void
  // Fired when any leaf link is tapped. The mobile drawer passes setOpen(false)
  // so it closes immediately on tap. Templates now navigate in the SAME tab
  // (the TemplatePreviewShell top bar carries you back), so a route change also
  // fires — but closing on tap avoids any flash. The desktop rail omits it —
  // there's no drawer to close.
  onNavigate?: () => void
}) {
  const pathname = usePathname() ?? ''

  // Active leaves inside the Design Systems pole: the overview, showcase,
  // examples, and per-component pages all live under /design-systems/<slug>.
  const activeSystem = SYSTEMS.find((s) => pathname.startsWith(`/design-systems/${s.slug}`))
  const activeAndromedaComponent = activeSystem
    ? ANDROMEDA_COMPONENT_META.find(
        (c) => pathname === `/design-systems/${activeSystem.slug}/${c.slug}`,
      )
    : null
  const onTemplates =
    activeSystem &&
    pathname.startsWith(`/design-systems/${activeSystem.slug}/templates`)
  const activeTemplate = onTemplates
    ? activeSystem.templates.find(
        (t) => pathname === `/design-systems/${activeSystem.slug}/templates/${t.slug}`,
      )
    : null

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={onToggle}
        className={`mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100`}
      >
        <Cube weight="regular" size={16} />
        <span className="flex-1 text-left">Design Systems</span>
        <span className="rounded-md border border-olive-500/30 bg-olive-500/10 px-1.5 py-0.5 text-xxs font-semibold uppercase tracking-wider text-olive-600 dark:text-olive-400">
          New
        </span>
      </button>
      {!collapsed && (
        <ul className="space-y-0.5">
          {SYSTEMS.map((system) => {
            // "System root" URLs — the showcase and the bare overview both
            // highlight the system row as active.
            const systemActive =
              pathname === `/design-systems/${system.slug}/showcase` ||
              pathname === `/design-systems/${system.slug}`
            const systemSelected = activeSystem?.slug === system.slug
            return (
              <li key={system.slug}>
                <Link
                  href={`/design-systems/${system.slug}`}
                  onClick={onNavigate}
                  className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                    systemActive
                      ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                      : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                  }`}
                >
                  {/* Arrow at px-2 lines up exactly with the parent Design
                      Systems pole's Cube icon above (both start 8px from the
                      left edge), so the row reads as a sibling of the pole
                      header rather than a deeply-nested item. */}
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
                    {/* ── Brain (premium judgment layer) ─────────── */}
                    {system.brain && (
                      <li className="mt-1">
                        <Link
                          href={`/design-systems/${system.slug}/brain`}
                          onClick={onNavigate}
                          className={`flex items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-[13px] font-medium transition-colors ${
                            pathname === `/design-systems/${system.slug}/brain`
                              ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                              : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                          }`}
                        >
                          <span className="flex-1 truncate">Brain</span>
                          {/* Lightning marks premium, same affordance as the
                              template rows below. */}
                          <Lightning
                            weight="regular"
                            size={13}
                            aria-hidden
                            className="ml-auto shrink-0 text-sand-500 dark:text-sand-500"
                          />
                          <span className="sr-only">Premium</span>
                        </Link>
                      </li>
                    )}

                    {/* ── Templates (label + flat list) ──────────── */}
                    <li className="mt-1">
                      <div className="pt-1.5 pb-0.5 pl-8 pr-2 text-xxs uppercase tracking-wider text-sand-500">
                        Templates
                      </div>
                      <ul className="space-y-0.5">
                        {system.templates.map((t) => {
                          const isActive = activeTemplate?.slug === t.slug
                          return (
                            <li key={t.slug}>
                              <Link
                                href={`/design-systems/${system.slug}/templates/${t.slug}`}
                                onClick={onNavigate}
                                className={`flex items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-[13px] font-medium transition-colors ${
                                  isActive
                                    ? 'bg-sand-300/60 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                                    : 'text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100'
                                }`}
                              >
                                <span className="flex-1 truncate">{t.name}</span>
                                {/* Lightning marks the template as Premium (replaces
                                    the old domain tag). The bolt is decorative; the
                                    sr-only word folds "Premium" into the link's
                                    accessible name (Phosphor renders a bare <svg>, so
                                    an aria-label on it is unreliably announced). */}
                                <Lightning
                                  weight="regular"
                                  size={13}
                                  aria-hidden
                                  className="ml-auto shrink-0 text-sand-500 dark:text-sand-500"
                                />
                                <span className="sr-only">Premium</span>
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
                          const isActive = activeAndromedaComponent?.slug === c.slug
                          return (
                            <li key={c.slug}>
                              <Link
                                href={`/design-systems/${system.slug}/${c.slug}`}
                                onClick={onNavigate}
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
  )
}
