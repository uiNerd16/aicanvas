import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ImageSquare } from '@phosphor-icons/react/dist/ssr'
import { SiteFooter } from '../components/SiteFooter'
import { IconCluster } from './_components/IconCluster'

export const metadata: Metadata = {
  title: 'LAB — AI Canvas',
  description:
    'A workshop of small generators. Bring your own mark, leave with an interactive, exportable component.',
  alternates: { canonical: 'https://aicanvas.me/lab' },
}

type Status = 'in progress' | 'planned' | 'live'

const TOOLS: Array<{
  slug: string
  name: string
  description: string
  status: Status
}> = [
  {
    slug: '60k-particles',
    name: '60K Particles',
    description:
      'Drop in a logo or icon. Get an interactive cloud of up to 60,000 particles you can hover, tune the density, colours and motion of, and export as ready-to-paste code.',
    status: 'in progress',
  },
  {
    slug: 'mesh-gradient',
    name: 'Mesh Gradient',
    description:
      'Sample dominant colours from any image and turn them into a soft, animated mesh-gradient background.',
    status: 'planned',
  },
  {
    slug: 'noise-field',
    name: 'Noise Field',
    description:
      'Procedural animated noise patterns in your own palette. Tuned for backgrounds, hero sections, and loading states.',
    status: 'planned',
  },
  {
    slug: 'glow-aura',
    name: 'Glow / Aura',
    description:
      'Wrap a logo or icon in a soft pulsing glow. Useful for hero marks, AI assistant avatars, status indicators.',
    status: 'planned',
  },
]

const STATUS_STYLES: Record<Status, string> = {
  'in progress':
    'border-olive-500/30 bg-olive-500/10 text-olive-600 dark:text-olive-400',
  planned:
    'border-sand-300 bg-sand-200/60 text-sand-600 dark:border-sand-700 dark:bg-sand-800/60 dark:text-sand-400',
  live:
    'border-olive-500/30 bg-olive-500/15 text-olive-700 dark:text-olive-300',
}

export default function LabPage() {
  const activeCount = TOOLS.filter((t) => t.status !== 'planned').length

  return (
    <main className="bg-sand-200 dark:bg-sand-950">
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-12 sm:px-6 sm:pt-16">
        {/* ── Hero — icon cluster on the left, description on the right ──
            `isolate` creates a fresh stacking context for the header so the
            cluster's z-30 layer can sit above the description without leaking
            stacking changes to anything outside the hero. */}
        <header className="relative isolate mb-16 grid items-center gap-8 sm:mb-20 sm:grid-cols-2 sm:gap-12">
          <h1 className="relative z-30 mx-auto aspect-square w-full max-w-[240px] sm:max-w-[420px]">
            <span className="sr-only">LAB</span>
            {/* The cluster is absolutely positioned inside the h1 so its
                pointer-handler covers the square but flying icons can spill
                outside the h1's bounds (overflow defaults to visible). */}
            <div className="absolute inset-0">
              <IconCluster />
            </div>
          </h1>
          <p className="relative z-10 text-lg leading-relaxed text-sand-700 dark:text-sand-300">
            Bring a mark. Pull a slider. Walk out with code.{' '}
            <span className="text-sand-500 dark:text-sand-500">
              LAB is a workshop of small generators for the experiments that
              don&rsquo;t fit a design system.
            </span>
          </p>
        </header>

        {/* ── Tools — 2×2 grid of horizontal row cards ── */}
        <section>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-700 dark:text-sand-300">
              Tools
            </h2>
            <span className="text-xs text-sand-500">
              {activeCount} active · {TOOLS.length} total
            </span>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {TOOLS.map((tool) => {
              const isPlanned = tool.status === 'planned'
              const card = (
                <article className="group flex h-full items-stretch overflow-hidden rounded-2xl border border-sand-300 bg-sand-100 transition-all duration-200 hover:border-sand-400 hover:shadow-md dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700 dark:hover:shadow-black/30">
                  {/* Left thumbnail strip */}
                  <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-sand-950 sm:w-28">
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                      }}
                    >
                      <ImageSquare
                        weight="regular"
                        size={22}
                        className="text-sand-700"
                      />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-1.5 px-4 py-3.5 sm:px-5 sm:py-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-sand-900 dark:text-sand-50 sm:text-lg">
                        {tool.name}
                      </h3>
                      <span
                        className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[tool.status]}`}
                      >
                        {tool.status}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-sand-600 dark:text-sand-400">
                      {tool.description}
                    </p>
                    <div className="mt-auto pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sand-500 transition-colors group-hover:text-sand-900 dark:group-hover:text-sand-100">
                        {isPlanned ? 'Coming soon' : 'Open tool'}
                        {!isPlanned && (
                          <ArrowRight
                            weight="regular"
                            size={13}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              )
              return (
                <li key={tool.slug}>
                  {isPlanned ? (
                    card
                  ) : (
                    <Link
                      href={`/lab/${tool.slug}`}
                      className="block h-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 focus:ring-offset-sand-200 dark:focus:ring-offset-sand-950"
                    >
                      {card}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <SiteFooter />
      </div>
    </main>
  )
}
