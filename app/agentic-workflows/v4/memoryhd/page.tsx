import type { Metadata } from 'next'
import {
  ArrowRight,
  Brain,
  GithubLogo,
  Sparkle,
} from '@phosphor-icons/react/dist/ssr'
import { MemoryInstall } from '../../MemoryInstall'
import { CapabilityTable, type Capability } from '../../v2/CapabilityTable'
import { MemoryLoopDiagram } from '../../v2/MemoryLoopDiagram'
import {
  CAGE_HREF,
  CatalogHeader,
  MobileTrail,
  OLIVE_BUTTON,
  QUIET_BUTTON,
  Related,
} from '../Chrome'
import { Step } from '../../../components/Step'
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

const COMPARISON = [
  {
    row: 'Recall',
    withPlugin: 'Fires on every prompt, from a keyword index',
    without: 'When the model thinks to look',
  },
  {
    row: 'Freshness',
    withPlugin: 'Age stamped on every pointer, stale flagged',
    without: 'Visible only if the note is opened',
  },
  {
    row: 'Cleanup',
    withPlugin: 'Audited against the repo, you approve each fix',
    without: 'Best effort while writing',
  },
]

const TRY_PROMPTS = [
  'remember that we deploy from the release branch, never from main',
  'didn’t we decide how to handle rate limits? check your memory',
  'run /memoryhd:memory-status and tell me if memory is healthy',
  'run /memoryhd:librarian and walk me through the cleanup proposals',
]

export default function MemoryHdPage() {
  return (
    <>
      <CatalogHeader trail="memoryHD" />

      <main className="relative mx-auto w-full max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <MobileTrail trail="memoryHD" />

        {/* Hero */}
        <header className="mb-10 sm:mb-14">
          <Brain weight="regular" className="size-8 text-olive-500" />
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.2] tracking-tight text-sand-900 dark:text-sand-50 sm:text-4xl">
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

        {/* The loop */}
        <section>
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            The whole workflow
          </h2>
          <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-300">
            Claude Code remembers things when the model thinks to look, and
            under pressure it usually does not. memoryHD makes remembering
            mechanical. It sits on top of the memory Claude Code already has,
            same folder, same format, so nothing you have breaks.
          </p>
          <div className="mt-5 space-y-6 rounded-xl border border-sand-300 bg-sand-100 px-5 py-6 dark:border-sand-800 dark:bg-sand-900">
            <Step number={1}>
              <p className="pt-0.5 text-sm text-sand-600 dark:text-sand-400">
                <span className="font-semibold text-sand-900 dark:text-sand-50">
                  You decide once.
                </span>{' '}
                memoryHD writes it down as you work, without being asked, and
                tells you in one line.
              </p>
            </Step>
            <Step number={2}>
              <p className="pt-0.5 text-sm text-sand-600 dark:text-sand-400">
                <span className="font-semibold text-sand-900 dark:text-sand-50">
                  Every prompt after, it comes back on its own.
                </span>{' '}
                The hook matches your words against the index and injects
                pointers to the notes that matter, stamped with their age.
              </p>
            </Step>
            <Step number={3}>
              <p className="pt-0.5 text-sm text-sand-600 dark:text-sand-400">
                <span className="font-semibold text-sand-900 dark:text-sand-50">
                  A stale note announces itself.
                </span>{' '}
                Every pointer carries how old it is, so nothing gets trusted
                blindly. The repository always outranks the note.
              </p>
            </Step>
            <Step number={4} isLast>
              <p className="pt-0.5 text-sm text-sand-600 dark:text-sand-400">
                <span className="font-semibold text-sand-900 dark:text-sand-50">
                  The librarian proposes, you approve.
                </span>{' '}
                A read-only pass checks every note against the real repo and
                hands you the fixes item by item. Retired notes go to trash,
                never straight to deletion.
              </p>
            </Step>
          </div>
        </section>

        {/* Manifest */}
        <section className="mt-14 sm:mt-20">
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

        {/* Mechanism */}
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

        {/* Side by side with native memory */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            Next to the memory you already have
          </h2>
          <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-300">
            Same folder, same markdown. The difference is what happens without
            you asking for it.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-sand-300 dark:border-sand-800">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Capability</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-bold text-sand-900 dark:text-sand-50"
                  >
                    With memoryHD
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-semibold text-sand-600 dark:text-sand-400"
                  >
                    Memory on its own
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-300 bg-sand-50 dark:divide-sand-800 dark:bg-sand-950/40">
                {COMPARISON.map((line) => (
                  <tr key={line.row}>
                    <th
                      scope="row"
                      className="px-4 py-3 text-left font-semibold text-sand-700 dark:text-sand-300"
                    >
                      {line.row}
                    </th>
                    <td className="px-4 py-3 text-sand-700 dark:text-sand-300">
                      {line.withPlugin}
                    </td>
                    <td className="px-4 py-3 text-sand-600 dark:text-sand-500">
                      {line.without}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Install */}
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

        {/* First prompts */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            Try these after installing
          </h2>
          <ul className="mt-5 space-y-2.5">
            {TRY_PROMPTS.map((prompt) => (
              <li
                key={prompt}
                className="flex items-start gap-2.5 rounded-lg border border-sand-300 bg-sand-100 px-4 py-3 text-sm text-sand-700 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-300"
              >
                <Sparkle
                  weight="regular"
                  className="mt-0.5 size-3.5 shrink-0 text-olive-500"
                />
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
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
