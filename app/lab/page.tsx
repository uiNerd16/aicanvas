import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteFooter } from '../components/SiteFooter'
import { LabLogo } from './_components/LabLogo'

export const metadata: Metadata = {
  title: 'LAB — AI Canvas',
  description:
    'Upload an asset. Tune it. Export the code. LAB turns your own marks into interactive components — no design system required.',
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
      'Upload a logo or icon. Get an interactive cloud of up to 60,000 particles you can hover, tune the density / colours / motion, and export as ready-to-paste code.',
    status: 'in progress',
  },
  {
    slug: 'mesh-gradient',
    name: 'Mesh Gradient',
    description:
      'Extract dominant colours from any image and turn them into a soft animated mesh-gradient background.',
    status: 'planned',
  },
  {
    slug: 'noise-field',
    name: 'Noise Field',
    description:
      'Procedural animated noise patterns with your colour palette, tuned for backgrounds, hero sections and loading states.',
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
  return (
    <main className="bg-sand-200 dark:bg-sand-950">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <header className="mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-olive-500">
            New
          </p>
          <h1 className="mb-5">
            <LabLogo />
            <span className="sr-only">LAB</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-sand-600 dark:text-sand-400">
            Upload an asset. Tune it. Export the code. LAB is a small set of
            generators that turn your own marks into interactive components —
            no design system, no boilerplate.
          </p>
        </header>

        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-500">
              Tools
            </h2>
            <span className="text-xs text-sand-500 dark:text-sand-500">
              {TOOLS.filter((t) => t.status !== 'planned').length} active ·{' '}
              {TOOLS.length} total
            </span>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {TOOLS.map((tool) => {
              const isPlanned = tool.status === 'planned'
              const card = (
                <article className="flex h-full flex-col rounded-2xl border border-sand-300 bg-sand-100 p-6 transition-colors hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-sand-900 dark:text-sand-50">
                      {tool.name}
                    </h3>
                    <span
                      className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[tool.status]}`}
                    >
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-sand-600 dark:text-sand-400">
                    {tool.description}
                  </p>
                </article>
              )
              return (
                <li key={tool.slug} className={isPlanned ? 'opacity-60' : ''}>
                  {isPlanned ? (
                    card
                  ) : (
                    <Link
                      href={`/lab/${tool.slug}`}
                      className="block h-full focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 focus:ring-offset-sand-200 dark:focus:ring-offset-sand-950"
                    >
                      {card}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <section className="mt-16 rounded-2xl border border-dashed border-sand-300 bg-sand-100/40 p-6 dark:border-sand-800 dark:bg-sand-900/40">
          <h2 className="mb-2 text-sm font-semibold text-sand-900 dark:text-sand-50">
            How it works
          </h2>
          <ol className="grid gap-2 text-sm text-sand-600 dark:text-sand-400 sm:grid-cols-3 sm:gap-6">
            <li>
              <span className="block font-semibold text-sand-700 dark:text-sand-300">
                1. Upload
              </span>
              SVG or PNG. LAB reads the shape and the colours.
            </li>
            <li>
              <span className="block font-semibold text-sand-700 dark:text-sand-300">
                2. Tune
              </span>
              Sliders for density, motion, size, hover behaviour and colour.
            </li>
            <li>
              <span className="block font-semibold text-sand-700 dark:text-sand-300">
                3. Export
              </span>
              Copy-paste code, self-contained HTML, static SVG, GIF/WebM loop.
            </li>
          </ol>
        </section>
      </div>
      <SiteFooter />
    </main>
  )
}
