import type { Metadata } from 'next'
import { ArrowRight, Brain, GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { MemoryInstall } from '../../MemoryInstall'
import { CapabilityTable, type Capability } from '../CapabilityTable'
import {
  CAGE_HREF,
  CatalogHeader,
  MobileTrail,
  OLIVE_BUTTON,
  QUIET_BUTTON,
  Related,
} from '../Chrome'
import { MemoryLoopDiagram } from '../MemoryLoopDiagram'
import { SiteFooter } from '../../../components/SiteFooter'
import { SITE_URL } from '../../../lib/config'

const REPO_URL = 'https://github.com/uiNerd16/memoryHD'

export const metadata: Metadata = {
  title: 'memoryHD: Persistent Memory for Claude Code',
  description:
    'memoryHD is a free Apache-2.0 Claude Code plugin. It writes notes as you work, recalls the right one on every prompt, keeps keys out of the notes, and proposes cleanup you approve.',
  alternates: { canonical: `${SITE_URL}/agentic-workflows` },
  robots: { index: false, follow: false },
}

const CAPABILITIES: Capability[] = [
  {
    kind: 'Behaviour',
    name: 'Notes written as you work',
    what: 'A decision, a correction, a convention: saved the moment it appears, and you are told in one line.',
    enforced: 'guidance',
  },
  {
    kind: 'Hook',
    name: 'Recall on every prompt',
    what: 'Matches your words against a one-line index and injects up to three pointers to the notes that matter, each stamped with its age.',
    enforced: 'code',
  },
  {
    kind: 'Gate',
    name: 'Secret write gate',
    what: 'Refuses key-shaped strings before they reach disk: API tokens, private key blocks, connection URLs with an inline password.',
    enforced: 'code',
  },
  {
    kind: 'Command',
    name: '/memoryhd:memory-status',
    what: 'Reports the state of the corpus: what is indexed, what is ageing, whether recall is healthy.',
    enforced: 'code',
    mono: true,
  },
  {
    kind: 'Command',
    name: '/memoryhd:librarian',
    what: 'Starts the cleanup pass and walks you through the proposals item by item.',
    enforced: 'code',
    mono: true,
  },
  {
    kind: 'Agent',
    name: 'Librarian',
    what: 'Read-only reviewer behind that command. It checks every note against the real repo and proposes fixes. Retired notes go to trash, never straight to deletion.',
    enforced: 'code',
  },
  {
    kind: 'Format',
    name: 'Plain markdown notes',
    what: 'Markdown in a folder, the same format Claude Code already uses. No service, no API key, no telemetry.',
    enforced: 'code',
  },
]

export default function MemoryHdPage() {
  return (
    <>
      <CatalogHeader trail="memoryHD" />

      <main className="relative mx-auto w-full max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <MobileTrail trail="memoryHD" />

        {/* ── Hero ── */}
        <header className="mb-10 sm:mb-14">
          <Brain weight="regular" className="size-8 text-olive-500" />
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl">
            memoryHD
          </h1>
          <p className="mt-3">
            <span className="rounded-full bg-olive-500/15 px-2.5 py-0.5 text-xs font-semibold text-olive-600 dark:text-olive-400">
              Free, Apache-2.0
            </span>
          </p>
          <p className="mt-5 max-w-xl text-lg text-sand-600 dark:text-sand-300">
            A memory for Claude Code that writes down what you settle and hands
            it back on the next prompt, without being asked.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#install" className={OLIVE_BUTTON}>
              Install memoryHD
              <ArrowRight weight="regular" className="size-4" />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={QUIET_BUTTON}
            >
              <GithubLogo weight="regular" className="size-4" />
              Read the source
            </a>
          </div>
        </header>

        {/* ── Manifest ── */}
        <section>
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            What it installs
          </h2>
          <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-300">
            Every part of the plugin, and whether the behaviour is enforced by
            the code or is direction the model follows.
          </p>
          <div className="mt-5">
            <CapabilityTable rows={CAPABILITIES} />
          </div>
        </section>

        {/* ── Mechanism ── */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            How it works
          </h2>
          <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-300">
            Notes get written while you work, and the next prompt pulls the
            right ones back in on its own; the only step you trigger is the
            librarian, and it proposes rather than applies.
          </p>
          <div className="mt-5">
            <MemoryLoopDiagram />
          </div>
        </section>

        {/* ── Install ── */}
        <section id="install" className="mt-14 scroll-mt-20 sm:mt-20">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            Install it
          </h2>
          <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-300">
            Two ways in: install the plugin and keep it, or clone the repository
            and try it for one session.
          </p>
          <div className="mt-5">
            <MemoryInstall />
          </div>
          <p className="mt-4 text-sm text-sand-500 dark:text-sand-400">
            Needs Node 18 or newer, nothing else. Tested on Linux, macOS, and
            Windows. The full source, the test suites, and the recall benchmark
            are in{' '}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sand-700 underline underline-offset-2 hover:text-sand-900 dark:text-sand-300 dark:hover:text-sand-50"
            >
              the repository
            </a>
            .
          </p>
        </section>

        <Related
          otherHref={CAGE_HREF}
          otherName="The GPT cage"
          otherLine="Hand a build to a second model in a sandbox that cannot reach git, the network, or your secrets."
        />

        <SiteFooter />
      </main>
    </>
  )
}
