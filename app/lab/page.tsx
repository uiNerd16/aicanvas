import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ImageSquare } from '@phosphor-icons/react/dist/ssr'
import { SiteFooter } from '../components/SiteFooter'
import { buttonClasses } from '../components/buttonClasses'
import { LabLogo } from './_components/LabLogo'

export const metadata: Metadata = {
  title: 'LAB — AI Canvas',
  description:
    'A workshop of small generators. Bring your own mark — leave with an interactive, exportable component.',
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
        {/* ── Hero — logo on the left, description on the right ── */}
        <header className="mb-16 grid items-center gap-8 sm:mb-20 sm:grid-cols-2 sm:gap-12">
          <h1>
            <LabLogo
              variant="compact"
              pixel={10}
              gap={3}
              letterGap={1}
              bubbleHeadRoom={44}
              idleAnimation
            />
            <span className="sr-only">LAB</span>
          </h1>
          <p className="text-lg leading-relaxed text-sand-700 dark:text-sand-300">
            Bring a mark. Pull a slider. Walk out with code.{' '}
            <span className="text-sand-500 dark:text-sand-500">
              LAB is a workshop of small generators for the experiments that
              don&rsquo;t fit a design system.
            </span>
          </p>
        </header>

        {/* ── Tools ── */}
        <section>
          <div className="mb-6 flex items-baseline justify-between border-b border-sand-300 pb-3 dark:border-sand-800">
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
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sand-300 bg-sand-950 shadow-sm transition-all duration-200 hover:border-sand-400 hover:shadow-xl hover:shadow-sand-300/60 dark:border-sand-800 dark:bg-sand-950 dark:hover:border-sand-700 dark:hover:shadow-2xl dark:hover:shadow-black/50">
                  {/* Placeholder image */}
                  <div className="relative aspect-video overflow-hidden bg-sand-900">
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                      }}
                    >
                      <ImageSquare weight="regular" size={28} className="text-sand-700" />
                    </div>
                  </div>

                  {/* Card body — floats over image with rounded top corners */}
                  <div className="relative -mt-4 flex flex-1 flex-col gap-3 rounded-t-2xl bg-sand-100 p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.10)] dark:bg-sand-900 dark:shadow-[0_-8px_24px_rgba(0,0,0,0.25)]">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-sand-900 dark:text-sand-50">
                          {tool.name}
                        </h3>
                        <span
                          className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[tool.status]}`}
                        >
                          {tool.status}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm font-normal text-sand-600 dark:text-sand-400">
                        {tool.description}
                      </p>
                    </div>

                    {/* CTA — mirrors ComponentCard's outline button */}
                    <div className="mt-auto pt-1">
                      <span
                        className={`${buttonClasses({ variant: 'outline', size: 'md', fullWidth: true })} text-xs ${
                          isPlanned
                            ? 'opacity-60'
                            : 'group-hover:border-sand-400 group-hover:text-sand-900 dark:group-hover:border-sand-600 dark:group-hover:text-sand-100'
                        }`}
                      >
                        {isPlanned ? 'Coming soon' : 'Open tool'}
                        {!isPlanned && (
                          <ArrowRight
                            weight="regular"
                            size={14}
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
