import type { Metadata } from 'next'
import Link from 'next/link'
import { CAGE_HREF, CatalogHeader, MEMORY_HREF, MobileTrail } from './Chrome'
import { CageMock, MemoryMock, PlaceholderCard, PluginCard } from './PluginCard'
import { SiteFooter } from '../../components/SiteFooter'
import { SITE_URL } from '../../lib/config'

export const metadata: Metadata = {
  title: 'Agentic Workflows: Claude Code Plugins for Memory and Delegation',
  description:
    'The Claude Code plugins AI Canvas runs its own studio on. memoryHD gives your agent a memory that recalls the right note on every prompt, and the GPT cage puts a second builder in a sandbox that cannot reach git, the network, or your secrets.',
  alternates: { canonical: `${SITE_URL}/agentic-workflows` },
  robots: { index: false, follow: false },
}

export default function AgenticWorkflowsHubPage() {
  return (
    <>
      <CatalogHeader />

      <main className="relative mx-auto w-full max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <MobileTrail />

        <header className="mb-10 sm:mb-14">
          <h1 className="text-3xl font-extrabold leading-[1.2] tracking-tight text-sand-900 dark:text-sand-50 sm:text-4xl">
            Agentic workflows
          </h1>
          <p className="mt-5 max-w-xl text-lg text-sand-600 dark:text-sand-300">
            The Claude Code plugins AI Canvas runs its own studio on, packaged
            for yours. Pick one, install it in about a minute, and keep working
            the way you already do.
          </p>
        </header>

        <section>
          <div className="grid gap-5 sm:grid-cols-2">
            <PluginCard
              href={MEMORY_HREF}
              name="memoryHD"
              line="A memory for Claude Code that writes down what you settle and hands it back on the next prompt, without being asked."
              badge="Free, Apache-2.0"
              badgeTone="olive"
              preview={<MemoryMock />}
            />
            <PluginCard
              href={CAGE_HREF}
              name="The GPT cage"
              line="Hand a build to a second model in a sandbox that cannot reach git, the network, or your secrets, and get back a diff you review."
              badge="Shipping soon"
              badgeTone="quiet"
              preview={<CageMock />}
            />
            <PlaceholderCard
              title="More coming"
              line="The rest of the workflow behind this studio gets packaged the same way, one plugin at a time."
            />
          </div>
        </section>

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
