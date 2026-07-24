// Server component: renders the static homepage HTML (which ships and hydrates
// no JS) and mounts the interactive client islands from ./islands. Kept as its
// own file so app/page.tsx stays focused on metadata + data prep.

import Link from 'next/link'
// Server component -> import the hook-free SSR icons. The main entry is the CSR
// version (createContext/useContext) and crashes in a server component. Client
// islands (./islands) keep the main import.
import {
  ArrowRight,
  MagnifyingGlass,
  RocketLaunch,
  Code,
  Palette,
  Terminal,
  Sparkle,
  Fire,
  CaretRight,
} from '@phosphor-icons/react/dist/ssr'
import { buttonClasses } from '../components/buttonClasses'
import { HeaderSocials } from '../components/HeaderSocials'
import { SiteFooter } from '../components/SiteFooter'
import { FoundationLoop } from '../_components/FoundationLoop'
import { Reveal } from './Reveal'
import { StackedCards, AnimatedCount, WireIcons, FeaturedCarousel, FaqAccordion } from './islands'
import type { ComponentMeta } from '../lib/component-registry'
import { GITHUB_URL } from '../lib/config'
import { ANDROMEDA_COMPONENT_META } from '../_lib/andromeda/andromeda-meta'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  total: number
  carouselItems: ComponentMeta[]
}

// ─── HomePageClient ────────────────────────────────────────────────────────────

export function HomePageClient({ total, carouselItems }: Props) {
  // Hero stat: standalone components + the Andromeda design-system components
  // (those live in their own registry, so they aren't part of `total`).
  const componentTotal = total + ANDROMEDA_COMPONENT_META.length
  return (
    <div className="flex min-h-full flex-col overflow-x-hidden bg-sand-950">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 hidden h-14 shrink-0 items-center justify-between border-b border-sand-800 bg-sand-950 px-6 md:flex">
        <span className="text-sm font-semibold text-sand-50">Overview</span>
        <HeaderSocials />
      </div>

      <main className="relative mx-auto w-full min-w-0 max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center">
          <StackedCards />

          <span
            className="aic-hero-rise mb-5 inline-flex items-center rounded-full border border-sand-700 bg-sand-900 px-3 py-1 text-xs font-semibold text-sand-300"
            style={{ animationDelay: '0.1s' }}
          >
            One command, zero tokens
          </span>

          <h1
            className="aic-hero-slide text-balance text-2xl font-extrabold tracking-tight text-sand-50 sm:text-4xl"
            style={{ animationDelay: '0.18s' }}
          >
            AI
            {' '}
            <img
              src="/ai-canvas-icon.svg"
              alt=""
              aria-hidden
              className="inline-block h-[0.6em] w-auto align-[0.02em]"
            />
            {' '}Native Components and Blocks,
            <br />
            <span className="mt-2 inline-block text-olive-500">Design Systems and Templates</span>
          </h1>

          <p
            className="aic-hero-rise mt-4 max-w-2xl text-base leading-relaxed text-sand-400"
            style={{ animationDelay: '0.26s' }}
          >
            Copy one shadcn CLI command and a finished component, block, or complete
            design system lands in your project in seconds. No tokens spent asking an
            AI to generate it from scratch, just real, editable React you own.
          </p>

          <div
            className="aic-hero-rise mt-7 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '0.34s' }}
          >
            <Link
              href="/components"
              className={buttonClasses({ variant: 'primary', size: 'lg' })}
            >
              Browse Components
              <ArrowRight weight="regular" size={14} />
            </Link>
            <Link
              href="/mcp"
              className="flex items-center gap-1.5 rounded-xl border border-sand-700 px-5 py-2.5 text-sm font-semibold text-sand-300 transition-colors hover:border-sand-600 hover:text-sand-100"
            >
              Get MCP
            </Link>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="mt-16 sm:mt-24">
          {/* Mobile: 2×2 grid with a vertical divider between each row's two items
              and no divider between rows. Desktop: single flex row with three
              dividers — the row-wrappers use `sm:contents` so they disappear from
              layout and the inner stats become direct children of the flex row. */}
          <div className="flex flex-col items-center gap-y-8 sm:flex-row sm:justify-center sm:gap-y-0">
            {(
              [
                [
                  { value: componentTotal, suffix: '+', label: 'Components' },
                  { value: 3,     suffix: '',  label: 'AI platforms' },
                ],
                [
                  { text: 'MIT',  suffix: '',  label: 'Open source', minWidth: '6rem' },
                  { text: 'MCP',  suffix: '',  label: 'Ready' },
                ],
              ] as {
                value?: number
                suffix: string
                label: string
                prefix?: string
                minWidth?: string
                text?: string
              }[][]
            ).map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center sm:contents">
                {rowIdx > 0 && (
                  <div className="hidden h-10 w-px bg-sand-800 mx-6 sm:block" aria-hidden />
                )}
                {row.map(({ value, suffix, prefix = '', label, minWidth, text }, colIdx) => {
                  const i = rowIdx * 2 + colIdx
                  return (
                    <div key={label} className="flex items-center sm:contents">
                      {colIdx > 0 && (
                        <div className="h-10 w-px bg-sand-800 mx-6" aria-hidden />
                      )}
                      <Reveal delay={i * 0.06} className="flex flex-col items-center text-center">
                        <span className="text-4xl font-bold tabular-nums text-sand-50" style={minWidth ? { minWidth } : undefined}>
                          {text ? text : <>{prefix}<AnimatedCount to={value ?? 0} suffix={suffix} /></>}
                        </span>
                        <span className="mt-1 text-xs font-medium text-sand-500">{label}</span>
                      </Reveal>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </section>

        {/* ── Wire icon divider ── */}
        <WireIcons />

        {/* ── Andromeda spotlight (foundation loop) — same bordered-card treatment
             as the Overview page's System card, with the homepage's own copy/CTA ── */}
        <section className="mt-16 sm:mt-24">
          <Reveal>
            <Link
              href="/design-systems/andromeda"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand-800 bg-sand-900 transition-all duration-200 hover:border-sand-700 sm:flex-row"
            >
              <span
                aria-hidden
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/40 bg-sand-950/85 text-red-500 backdrop-blur-sm"
              >
                <Fire weight="fill" size={15} />
              </span>
              <div className="flex flex-col justify-center gap-3 p-6 sm:w-1/2 sm:p-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-olive-400">Featured</span>
                <h2 className="text-2xl font-bold tracking-tight text-sand-50">Andromeda • Design System</h2>
                <p className="text-sm leading-relaxed text-sand-400">
                  A complete design system for dashboards, control panels, and data-dense
                  interfaces. Components, templates, and the rules that keep them all speaking the
                  same visual language.
                </p>
                <div className="mt-1">
                  <span className={`${buttonClasses({ variant: 'primary', size: 'md' })} group-hover:bg-olive-400`}>
                    Discover more
                    <ArrowRight weight="regular" size={14} />
                  </span>
                </div>
              </div>
              <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] sm:w-1/2">
                <FoundationLoop />
              </div>
            </Link>
          </Reveal>
        </section>

        {/* ── Featured carousel ── */}
        <FeaturedCarousel items={carouselItems} />



        {/* ── Who it's for ── */}
        <section id="audience" className="mt-16 sm:mt-24 scroll-mt-24">
          <Reveal className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">Built for everyone</p>
            <h2 className="mt-1 text-xl font-bold text-sand-50">
              For developers. For designers. For makers. For your AI agent.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-sand-400">
              Most component libraries serve one kind of person. AI Canvas installs the same finished code for everyone who builds, and every install costs zero AI tokens instead of burning them on a from-scratch generation. Drop a component in with the shadcn CLI, reshape it with an AI agent, or let an agent browse and install it for you.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-4">
            {[
              {
                icon: <Code weight="regular" size={18} />,
                audience: 'Developers',
                description: 'Drop finished, typed components into your project with one command. No boilerplate, no screenshot to rebuild, and no tokens spent generating what already works.',
                badges: ['TypeScript', 'Motion', 'Tailwind CSS'],
                badgeStyle: 'text-sand-500 ring-sand-800',
              },
              {
                icon: <Palette weight="regular" size={18} />,
                audience: 'Designers',
                description: 'Start from something already crafted, then reshape it in your AI agent, Cursor, Claude Code, or Codex, whichever you use: the colors, the layout, the motion, fast, without rebuilding it from scratch.',
                badges: ['Cursor', 'Claude Code', 'Codex'],
                badgeStyle: 'text-olive-500 ring-olive-500/30 bg-olive-500/5',
              },
              {
                icon: <RocketLaunch weight="regular" size={18} />,
                audience: 'Makers & Founders',
                description: 'Building with AI in Lovable, V0, Cursor, or any AI agent? Hand it real, polished components to install so your product ships fast and does not look generated, with no tokens spent regenerating UI from scratch.',
                badges: ['No-code', 'AI-built', 'Real code'],
                badgeStyle: 'text-sand-400 ring-sand-700',
              },
              {
                icon: <Sparkle weight="regular" size={18} />,
                audience: 'AI agents',
                description: 'Point your agent at the AI Canvas MCP and it browses, inspects, and installs finished components for you: fewer tokens, no writing UI from scratch, and you keep control. Works with any MCP client, Claude Code, Cursor, Codex, Copilot, Gemini, and more.',
                badges: ['MCP', 'Agent-ready', 'No copy-paste'],
                badgeStyle: 'text-sand-400 ring-sand-700',
              },
            ].map(({ icon, audience, description, badges, badgeStyle }, i) => (
              <Reveal
                key={audience}
                y={14}
                delay={i * 0.08}
                className="flex flex-col rounded-xl border border-sand-800 bg-sand-900 p-5"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand-800 text-sand-300">
                    {icon}
                  </div>
                  <span className="text-sm font-bold text-sand-50">{audience}</span>
                </div>
                <p className="flex-1 text-base leading-relaxed text-sand-400">{description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {badges.map((badge) => (
                    <span
                      key={badge}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${badgeStyle}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── How it works — vertical timeline ── */}
        <section id="how-remix" className="mt-16 sm:mt-24">
          <Reveal className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">How it works</p>
            <h2 className="mt-1 text-xl font-bold text-sand-50">Three steps. Your way.</h2>
          </Reveal>

          <div className="relative flex flex-col gap-0">
            {/* Connecting dotted line */}
            <div
              className="dot-flow absolute left-[19px] top-6 bottom-16 w-px overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(79,79,76,0.5) 1px, transparent 1px)',
                backgroundSize: '1px 8px',
                animation: 'dotFlow 1.5s linear infinite',
              }}
            />
            <style>{`@keyframes dotFlow { from { background-position-y: 0; } to { background-position-y: 8px; } } @media (prefers-reduced-motion: reduce) { .dot-flow { animation: none !important; } }`}</style>

            {[
              {
                num: '01',
                icon: <MagnifyingGlass weight="regular" size={16} />,
                title: 'Browse',
                desc: 'Search components, blocks, and design systems, and preview each one live before you choose.',
              },
              {
                num: '02',
                icon: <Terminal weight="regular" size={16} />,
                title: 'Install',
                desc: 'Run the one shadcn CLI command, or point your AI agent at the MCP. The finished, typed source lands in your project, no tokens spent generating it.',
              },
              {
                num: '03',
                icon: <RocketLaunch weight="regular" size={16} />,
                title: 'Ship',
                desc: 'It arrives as real code you own. Ship it as is, or reshape it with an AI agent in seconds. It is yours.',
              },
            ].map((step, i) => (
              <Reveal
                key={step.num}
                x={-20}
                y={0}
                delay={i * 0.12}
                className="flex items-start gap-5 py-5"
              >
                {/* Node on the timeline */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sand-700 bg-sand-900 text-sand-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  {step.icon}
                </div>
                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold tabular-nums text-olive-500">{step.num}</span>
                    <h3 className="text-base font-bold text-sand-50">{step.title}</h3>
                  </div>
                  <p className="mt-1.5 text-base leading-relaxed text-sand-500">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>


        {/* ── FAQ ── */}
        <section className="mt-16 sm:mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-[2fr_3fr] sm:gap-12">
            {/* Intro rail, sticky on desktop */}
            <Reveal className="self-start sm:sticky sm:top-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">FAQ</p>
              <h2 className="mt-1 text-xl font-bold text-sand-50">Questions, answered.</h2>
              <p className="mt-3 text-base leading-relaxed text-sand-400">
                The short version of everything people ask before shipping their
                first component.
              </p>
              <Link
                href="/faq"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
              >
                See all FAQs
                <CaretRight weight="regular" size={14} />
              </Link>
            </Reveal>

            {/* Accordion cards (client island — only the open/close state) */}
            <FaqAccordion />
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="mt-16 sm:mt-24">
          <Reveal
            y={12}
            className="relative overflow-hidden rounded-2xl border border-olive-500/20 bg-gradient-to-br from-olive-500/8 via-transparent to-transparent p-8 text-center ring-1 ring-inset ring-olive-500/10"
          >
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-40 w-64 rounded-full bg-olive-500/10 blur-3xl" />
            </div>
            <p className="relative text-xs font-semibold uppercase tracking-wider text-sand-600">
              Ready to build?
            </p>
            <h2 className="relative mt-2 text-xl font-bold text-sand-50">
              One command from your next screen.
            </h2>
            <p className="relative mt-2 text-base text-sand-500">
              {componentTotal}+ components and design systems, each one command away. Copy it
              yourself, or tell your agent to install it. No tokens spent generating what
              already works.
            </p>
            <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/components"
                className={buttonClasses({ variant: 'primary', size: 'lg' })}
              >
                Browse Components
                <ArrowRight weight="regular" size={14} />
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: 'outline', size: 'lg' })}
              >
                View on GitHub
              </a>
            </div>
          </Reveal>
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
