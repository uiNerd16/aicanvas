import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Brain,
  DotsThreeOutline,
  ShieldCheck,
} from '@phosphor-icons/react/dist/ssr'
import { BundleStrip } from './BundleStrip'
import { CAGE_HREF, CatalogHeader, MEMORY_HREF, MobileTrail } from './Chrome'
import { SiteFooter } from '../../components/SiteFooter'
import { SITE_URL } from '../../lib/config'

export const metadata: Metadata = {
  title: 'Claude Code Plugins for Memory and Delegation',
  description:
    'A small catalog of Claude Code plugins: memoryHD gives your agent a memory that recalls the right note on every prompt, and the GPT cage puts a second builder in a sandbox that cannot reach git, the network, or your secrets.',
  alternates: { canonical: `${SITE_URL}/agentic-workflows/v2` },
  robots: { index: false, follow: false },
}

type Plugin = {
  icon: typeof Brain
  name: string
  line: string
  badge: string
  badgeTone: 'olive' | 'quiet'
  stats: string[]
  href: string
  cta: string
}

const PLUGINS: Plugin[] = [
  {
    icon: Brain,
    name: 'memoryHD',
    line: 'A memory for Claude Code that writes down what you settle and hands it back on the next prompt, without being asked.',
    badge: 'Free, Apache-2.0',
    badgeTone: 'olive',
    stats: ['2 commands', '1 agent', '0 dependencies'],
    href: MEMORY_HREF,
    cta: 'Install memoryHD',
  },
  {
    icon: ShieldCheck,
    name: 'The GPT cage',
    line: 'Hand a build to a second model in a sandbox that cannot reach git, the network, or your secrets, and get back a diff you review.',
    badge: 'Shipping soon',
    badgeTone: 'quiet',
    stats: ['2 tools', '1 skill', 'No git access'],
    href: CAGE_HREF,
    cta: 'See how it works',
  },
]

export default function AgenticWorkflowsCatalogPage() {
  return (
    <>
      <CatalogHeader />

      <main className="relative mx-auto w-full max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <MobileTrail />

        {/* ── Hero ── */}
        <header className="mb-10 sm:mb-14">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl">
            <span className="block font-normal text-sand-600 dark:text-sand-300">
              Install a memory. Add a second builder.
            </span>
            <span className="block text-olive-500">Keep the judgment.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-sand-600 dark:text-sand-300">
            These are the Claude Code plugins AI Canvas runs its own studio on,
            packaged for yours. Pick one, install it in about a minute, and keep
            working the way you already do.
          </p>
        </header>

        {/* ── Catalog grid ── */}
        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
              The plugins
            </h2>
            <p className="text-sm text-sand-500 dark:text-sand-400">
              Two today, built for the way one person ships a lot of software.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLUGINS.map((plugin) => (
              <Link
                key={plugin.name}
                href={plugin.href}
                className="group flex flex-col rounded-xl border border-sand-300 bg-sand-100 p-5 transition-colors hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
              >
                <plugin.icon weight="regular" className="size-6 text-olive-500" />
                <h3 className="mt-4 text-base font-bold text-sand-900 dark:text-sand-50">
                  {plugin.name}
                </h3>
                <span
                  className={`mt-2 w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    plugin.badgeTone === 'olive'
                      ? 'bg-olive-500/15 text-olive-600 dark:text-olive-400'
                      : 'bg-sand-300/60 text-sand-700 dark:bg-sand-800 dark:text-sand-300'
                  }`}
                >
                  {plugin.badge}
                </span>
                <p className="mt-3 text-sm text-sand-600 dark:text-sand-400">
                  {plugin.line}
                </p>

                <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-sand-300 pt-4 text-xs font-semibold text-sand-500 dark:border-sand-800 dark:text-sand-400">
                  {plugin.stats.map((stat) => (
                    <div key={stat}>
                      <dt className="sr-only">Detail</dt>
                      <dd>{stat}</dd>
                    </div>
                  ))}
                </dl>

                <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-olive-600 dark:text-olive-400">
                  {plugin.cta}
                  <ArrowRight
                    weight="regular"
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}

            {/* Placeholder: the catalog is still filling up. */}
            <div className="flex flex-col rounded-xl border border-dashed border-sand-300 p-5 dark:border-sand-800">
              <DotsThreeOutline
                weight="regular"
                className="size-6 text-sand-400 dark:text-sand-600"
              />
              <h3 className="mt-4 text-base font-bold text-sand-500 dark:text-sand-500">
                More coming
              </h3>
              <p className="mt-3 text-sm text-sand-500 dark:text-sand-500">
                The rest of the workflow behind this studio gets packaged the
                same way, one plugin at a time.
              </p>
            </div>
          </div>
        </section>

        {/* ── What a plugin actually is ── */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            How a plugin is put together
          </h2>
          <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-300">
            A Claude Code plugin is a bundle. A skill carries the policy, an MCP
            server holds the tools, hooks fire on their own, and commands wait
            for you to run them. Each plugin here uses the parts it needs, and
            one install hands them all over at once.
          </p>
          <div className="mt-5">
            <BundleStrip />
          </div>
        </section>

        {/* ── Cross-link ── */}
        <section className="mt-14 sm:mt-20">
          <div className="rounded-xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900">
            <h2 className="text-base font-bold text-sand-900 dark:text-sand-50">
              The third piece is the components
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-sand-600 dark:text-sand-400">
              Plugins keep your agent sharp; the{' '}
              <Link
                href="/mcp"
                className="font-medium text-olive-600 underline underline-offset-2 hover:text-olive-500 dark:text-olive-400"
              >
                AI Canvas MCP
              </Link>{' '}
              keeps it supplied. One command connects every component on this
              site, with the design spec and motion included.
            </p>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  )
}
