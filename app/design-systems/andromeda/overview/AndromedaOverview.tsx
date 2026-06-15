// @ts-nocheck — consumes the JSDoc-typed Andromeda config/meta (no TS prop types).
//
// Andromeda OVERVIEW — the product landing for the system: hero → featured
// component showcase → templates grid → components grid. TEST surface at
// /design-systems/andromeda/overview. If it lands, page.tsx (the system root)
// renders this instead of <AndromedaShowcase>, and the raw component grid keeps
// living at /design-systems/andromeda/showcase.
//
// IDENTITY: pure AI Canvas — sand/olive tokens (Tailwind), Manrope (the site
// --font-sans default), and the site's button system (buttonClasses). It
// deliberately does NOT use Andromeda's tokens/mono/turquoise; the page is AI
// Canvas chrome that *presents* Andromeda. The scroll column (AndromedaContentColumn)
// repaints the Andromeda void back to the AI Canvas page surface for this route.
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Robot, Wrench, CaretDown } from '@phosphor-icons/react'
import { Button, buttonClasses } from '../../../components/Button'
import { optimizeImageKitUrl } from '../../../lib/imagekit'
import { ANDROMEDA_META, ANDROMEDA_COMPONENT_META } from '../../../_lib/andromeda/andromeda-meta'
import { DESIGN_SYSTEMS } from '../../../../scripts/lib/design-systems.config.mjs'

// Short blurbs for the four shipped templates — keyed by registry slug.
const TEMPLATE_BLURBS = {
  'andromeda-mission-control':
    'Spacecraft telemetry — live altitude, vehicle roster, comms log, and a system-status readout in one mission view.',
  'andromeda-service-order':
    'A field-service work order: SLA gauge, line items, order metadata, and a customer summary panel.',
  'andromeda-resource-planning':
    'Capacity, allocation trend, and request triage across teams on one planning board.',
  'andromeda-signal-room':
    'A broadcast control room: now-transmitting, channel levels, mixes, and a transport bar.',
}

const andromeda = DESIGN_SYSTEMS.find((s) => s.slug === 'andromeda')
const TEMPLATES = (andromeda?.templates ?? []).map((t) => ({
  slug: t.slug,
  name: t.name,
  domain: t.domain,
  folder: t.slug.replace(/^andromeda-/, ''),
  blurb: TEMPLATE_BLURBS[t.slug] ?? '',
}))

// AI Canvas component-preview fill — dark sand-900 surface with the site's
// dot-grid motif and a centered Manrope label. Screenshot-ready (drop an <img>
// over it later). Rendered as absolute children of a `relative` image box.
function PreviewFill({ label }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
        <span className="text-sm font-medium text-sand-500">{label}</span>
      </div>
    </>
  )
}

// One value prop: a pill framed by a soft, marching dashed border (animated SVG
// stroke). Icon + label + chevron cluster on the LEFT; clicking toggles the
// description and the dashed frame extends with it (the SVG tracks the container
// height via calc(100%)). Click-toggled so touch works; honors reduced-motion.
function ValueItem({ icon: Icon, heading, children, delay = 0 }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="vp-item relative rounded-2xl p-5" style={{ animationDelay: `${delay}ms` }}>
      <svg className="vp-border pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <rect className="vp-rect" />
      </svg>
      <h3 className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="group flex w-full cursor-pointer items-center gap-4 text-left"
        >
          {/* Icon chip — same aesthetic as the home-page steps: neutral surface,
              1px border, soft drop shadow. Dark mode matches that section exactly;
              light mode gets the neutral equivalent. */}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sand-300 bg-sand-100 text-sand-600 shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:border-sand-700 dark:bg-sand-900 dark:text-sand-300 dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <Icon weight="regular" size={16} />
          </span>
          <span className="text-base font-bold text-sand-900 dark:text-sand-50">{heading}</span>
          <CaretDown
            weight="bold"
            size={15}
            className={`ml-auto shrink-0 text-sand-500 transition-transform duration-200 group-hover:text-sand-700 dark:group-hover:text-sand-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div className={`relative grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="pt-2.5 text-base leading-relaxed text-sand-600 dark:text-sand-400">{children}</p>
        </div>
      </div>
    </div>
  )
}

const COMPONENTS_PER_PAGE = 3

export function AndromedaOverview() {
  // Components carousel — a 3-up window paginated by the arrows, mirroring the
  // related ("More like this") section on the component pages: slide by one,
  // same popLayout motion. We surface a few at a time instead of the full grid.
  const [compStart, setCompStart] = useState(0)
  const [compDir, setCompDir] = useState(1)
  const visibleComponents = ANDROMEDA_COMPONENT_META.slice(
    compStart,
    compStart + COMPONENTS_PER_PAGE,
  )
  const compCanPaginate = ANDROMEDA_COMPONENT_META.length > COMPONENTS_PER_PAGE
  const compCanGoPrev = compStart > 0
  const compCanGoNext =
    compStart < ANDROMEDA_COMPONENT_META.length - COMPONENTS_PER_PAGE

  function pageComponents(dir) {
    setCompDir(dir)
    setCompStart((s) =>
      dir === 1
        ? Math.min(ANDROMEDA_COMPONENT_META.length - COMPONENTS_PER_PAGE, s + 1)
        : Math.max(0, s - 1),
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-olive-600 dark:text-olive-400">
          Design system
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-sand-900 dark:text-sand-50 sm:text-5xl">
          {ANDROMEDA_META.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-sand-600 dark:text-sand-300 sm:text-lg">
          A complete design system for dashboards, control panels, data-dense tools, and anything
          else you can picture. Every component is driven by tokens, so you ship a coherent,
          technical interface fast.
        </p>
      </header>

      {/* ── Value props — two cards below the title + description; click to expand.
            They sit below the header, so opening a card never moves the header. ── */}
      <section className="mt-10">
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
          <ValueItem icon={Robot} heading="Build with an agent" delay={0}>
            Your AI agent installs Andromeda and builds on its real tokens and components. What it
            generates carries the same surfaces, framing, and spacing as everything else you ship, so
            new screens land already matching the system.
          </ValueItem>
          <ValueItem icon={Wrench} heading="Build by hand" delay={120}>
            Compose it yourself from a foundation that holds its line. Around 32 components and 4
            dashboard templates all read from one token set, so change a token and the whole system
            follows as your product grows.
          </ValueItem>
        </div>
      </section>
      <style>{`
        @keyframes vp-emerge { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes vp-march { to { stroke-dashoffset: -20; } }
        .vp-item { opacity: 0; animation: vp-emerge 500ms cubic-bezier(0, 0, 0.2, 1) forwards; }
        .vp-rect {
          x: 1px; y: 1px; width: calc(100% - 2px); height: calc(100% - 2px);
          rx: 16px; ry: 16px; fill: none;
          stroke: var(--color-sand-300, #BABAB4); stroke-width: 0.5;
          stroke-linecap: round; stroke-dasharray: 4 6;
          animation: vp-march 1.4s linear infinite;
        }
        /* Neutral + subtle: the darkest neutral that still reads on the dark
           page (sand-800/900/950 vanish into the bg). */
        .dark .vp-rect { stroke: var(--color-sand-700, #4F4F4C); }
        @media (prefers-reduced-motion: reduce) {
          .vp-item { opacity: 1; animation: none; }
          .vp-rect { animation: none; }
        }
      `}</style>

      {/* ── Featured: component showcase ────────────────────────────────── */}
      <section className="mt-14">
        <Link
          href="/design-systems/andromeda/showcase"
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand-300 bg-sand-100 shadow-sm transition-all duration-200 hover:border-sand-400 hover:shadow-xl dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700 sm:flex-row"
        >
          <div className="flex flex-col justify-center gap-3 p-6 sm:w-1/2 sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-olive-600 dark:text-olive-400">
              Featured
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-sand-900 dark:text-sand-50">
              Component showcase
            </h2>
            <p className="text-sm leading-relaxed text-sand-600 dark:text-sand-400">
              Every Andromeda primitive on one page — buttons, charts, tables, overlays, and more,
              live and interactive.
            </p>
            <div className="mt-1">
              <span className={`${buttonClasses({ variant: 'primary', size: 'md' })} group-hover:bg-olive-400`}>
                Open showcase
                <ArrowUpRight weight="bold" size={15} />
              </span>
            </div>
          </div>
          <div className="relative min-h-[180px] overflow-hidden bg-sand-900 sm:min-h-0 sm:w-1/2">
            <PreviewFill label={`${ANDROMEDA_COMPONENT_META.length} components`} />
          </div>
        </Link>
      </section>

      {/* ── Templates ───────────────────────────────────────────────────── */}
      <section id="templates" className="mt-20 scroll-mt-24">
        <div className="mb-5">
          <h2 className="text-2xl font-bold tracking-tight text-sand-900 dark:text-sand-50">Templates</h2>
          <p className="mt-1 text-sm text-sand-600 dark:text-sand-400">
            Full dashboards composed from the system — pick a domain to explore.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <Link
              key={t.slug}
              href={`/design-systems/andromeda/templates/${t.folder}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand-300 bg-sand-950 shadow-sm transition-all duration-200 hover:border-sand-400 hover:shadow-xl hover:shadow-sand-300/60 dark:border-sand-800 dark:bg-sand-950 dark:hover:border-sand-700 dark:hover:shadow-2xl dark:hover:shadow-black/50"
            >
              <div className="relative aspect-video overflow-hidden bg-sand-900">
                <span className="absolute right-3 top-3 z-10 rounded-full border border-olive-500 px-2.5 py-0.5 text-[11px] font-semibold text-olive-400">
                  {t.domain}
                </span>
                <PreviewFill label={t.name} />
              </div>
              <div className="relative -mt-4 flex flex-1 flex-col gap-3 rounded-t-2xl bg-sand-100 p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.10)] dark:bg-sand-900 dark:shadow-[0_-8px_24px_rgba(0,0,0,0.25)]">
                <div>
                  <h3 className="font-bold text-sand-900 dark:text-sand-50">{t.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm font-normal text-sand-600 dark:text-sand-400">{t.blurb}</p>
                </div>
                <div className="mt-auto pt-1">
                  <span className={`${buttonClasses({ variant: 'outline', size: 'md', fullWidth: true })} text-xs group-hover:border-sand-400 group-hover:text-sand-900 dark:group-hover:border-sand-600 dark:group-hover:text-sand-100`}>
                    View template
                    <ArrowRight weight="regular" size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Components — 3-up carousel paginated by the arrows. Same compact
            card + slide motion as the "More like this" section on the component
            pages; we surface a few at a time instead of the whole grid. ── */}
      <section id="components" className="mt-20 scroll-mt-24">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-sand-900 dark:text-sand-50">Components</h2>
            <p className="mt-1 text-sm text-sand-600 dark:text-sand-400">
              {ANDROMEDA_COMPONENT_META.length} primitives — every one live and installable.
            </p>
          </div>
          {compCanPaginate && (
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                iconOnly
                onClick={() => pageComponents(-1)}
                disabled={!compCanGoPrev}
                aria-label="Previous components"
              >
                <ArrowLeft weight="regular" size={15} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconOnly
                onClick={() => pageComponents(1)}
                disabled={!compCanGoNext}
                aria-label="Next components"
              >
                <ArrowRight weight="regular" size={15} />
              </Button>
            </div>
          )}
        </div>
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" custom={compDir} initial={false}>
              {visibleComponents.map((c) => (
                <motion.div
                  key={c.slug}
                  layout
                  custom={compDir}
                  variants={{
                    enter: (dir) => ({
                      x: dir > 0 ? '110%' : '-110%',
                      opacity: 0,
                      zIndex: 10,
                    }),
                    center: { x: 0, opacity: 1, zIndex: 10 },
                    exit: { x: 0, opacity: 0, zIndex: -1 },
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                    layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  }}
                  className="relative"
                >
                  <Link
                    href={`/design-systems/andromeda/${c.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-sand-100 transition-colors duration-200 hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
                  >
                    <div className="relative aspect-video overflow-hidden bg-sand-950">
                      {c.image ? (
                        <img
                          src={optimizeImageKitUrl(c.image, 'card')}
                          alt={c.name}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
                        />
                      )}
                    </div>
                    <div className="px-3 py-2.5">
                      <h3 className="truncate text-sm font-semibold text-sand-900 dark:text-sand-50">
                        {c.name}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  )
}
