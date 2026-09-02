import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Brain,
  Broom,
  ClockCountdown,
  FileText,
  GitBranch,
  Lightning,
  LockKey,
  Notebook,
  ShieldCheck,
  Sparkle,
  TerminalWindow,
} from '@phosphor-icons/react/dist/ssr'
import { MemoryInstall } from './MemoryInstall'
import { Step } from '../components/Step'
import { SiteFooter } from '../components/SiteFooter'
import { HeaderSocials } from '../components/HeaderSocials'
import { SITE_URL } from '../lib/config'

export const metadata: Metadata = {
  title: 'Agentic Workflows: Memory and a Second Builder for Claude Code',
  description:
    'memoryHD gives Claude Code a memory that recalls the right note on every prompt. The GPT cage adds a second AI builder in a locked sandbox. The workflow AI Canvas runs on, packaged for yours.',
  alternates: { canonical: `${SITE_URL}/agentic-workflows` },
  openGraph: {
    title: 'Give your coding agent a memory and a second pair of hands',
    description:
      'memoryHD recalls your decisions on every prompt. The GPT cage lets a second model build inside a sandbox that cannot touch git, the network, or your secrets.',
    url: `${SITE_URL}/agentic-workflows`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'memoryHD',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Cross-platform',
  description:
    'A complete plaintext memory system for Claude Code. Claude writes the notes as you work, a hook recalls the relevant ones on every prompt with a freshness stamp, and a propose-only librarian keeps the corpus clean.',
  url: `${SITE_URL}/agentic-workflows`,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'AI Canvas', url: SITE_URL },
}

const MEMORY_FEATURES = [
  {
    icon: Notebook,
    title: 'Writes notes as you work',
    body: 'A decision, a correction, a convention: saved the moment it appears, and you are told in one line. You never have to remember to remember.',
  },
  {
    icon: Lightning,
    title: 'Recall on every prompt',
    body: 'A hook matches your words against a one-line index and injects up to three pointers to the notes that matter right now. Mechanical, not model-willed.',
  },
  {
    icon: ClockCountdown,
    title: 'Age on every pointer',
    body: 'Every recall says how old the note is, so a stale note announces itself instead of being trusted blindly. The repo always outranks the note.',
  },
  {
    icon: LockKey,
    title: 'Keys cannot land in notes',
    body: 'A write gate refuses API keys, tokens, and database passwords before they reach disk. Notes are plaintext, so secrets never become notes.',
  },
  {
    icon: Broom,
    title: 'Cleanup you approve',
    body: 'A read-only librarian checks every note against the real repo and proposes fixes item by item. Retired notes go to trash, never straight to deletion.',
  },
  {
    icon: FileText,
    title: 'Plain files you own',
    body: 'Markdown in a folder, same format Claude Code already uses. No service, no API key, no telemetry, zero dependencies. Apache-2.0.',
  },
]

const CAGE_FEATURES = [
  {
    icon: TerminalWindow,
    title: 'A read lane and a write lane',
    body: 'gpt_ask can only read. gpt_run writes inside one folder, in a sandbox, with the network off. Two separate tools, so you can allow one and keep approving the other.',
  },
  {
    icon: GitBranch,
    title: 'No git, ever',
    body: 'The second builder never commits, pushes, or checks out. Your agent makes a checkpoint first, so any slip is a one-command restore.',
  },
  {
    icon: ShieldCheck,
    title: 'Secrets stay home',
    body: 'Env files, credential files, and private folders are refused paths, enforced in code rather than trusted to a prompt. Briefs carry variable names, never values.',
  },
  {
    icon: Brain,
    title: 'Every run leaves a trail',
    body: 'Each delegation writes a full log and a metadata snapshot, and reports the model and effort actually used, so a drifting default is visible.',
  },
]

const TRY_PROMPTS = [
  'remember that we deploy from the release branch, never from main',
  'didn’t we decide how to handle rate limits? check your memory',
  'run /memoryhd:memory-status and tell me if memory is healthy',
  'run /memoryhd:librarian and walk me through the cleanup proposals',
]

export default function AgenticWorkflowsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Sticky top bar, matches /mcp ── */}
      <header className="sticky top-0 z-10 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950 md:grid">
        <div />
        <Link
          href="/agentic-workflows"
          className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
        >
          /Agentic workflows
        </Link>
        <div className="flex items-center justify-end">
          <HeaderSocials />
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <p className="mb-6 text-sm font-semibold md:hidden">
          <span className="text-olive-500">/Agentic workflows</span>
        </p>

        {/* ── Hero ── */}
        <header className="mb-10 sm:mb-14">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl">
            <span className="block font-normal text-sand-600 dark:text-sand-300">
              Your agent starts every session from zero.
            </span>
            <span className="block text-olive-500">
              Give it a memory, and a second pair of hands.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-sand-600 dark:text-sand-300">
            These are the tools AI Canvas runs its own studio on, packaged for
            yours. A memory plugin that recalls the right note on every prompt,
            and a supervised lane where a second AI builds while your agent
            keeps the judgment.
          </p>
        </header>

        {/* ── The loop ── */}
        <section>
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            The whole workflow
          </h2>
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
                The hook matches your words against the index and injects the
                notes that matter, stamped with their age.
              </p>
            </Step>
            <Step number={3}>
              <p className="pt-0.5 text-sm text-sand-600 dark:text-sand-400">
                <span className="font-semibold text-sand-900 dark:text-sand-50">
                  Big builds go to a second model in a locked sandbox.
                </span>{' '}
                It writes code. It cannot touch git, the network, or your
                secrets, because the cage enforces that in code.
              </p>
            </Step>
            <Step number={4} isLast>
              <p className="pt-0.5 text-sm text-sand-600 dark:text-sand-400">
                <span className="font-semibold text-sand-900 dark:text-sand-50">
                  Your agent reviews, you approve.
                </span>{' '}
                And everything you settled along the way is already saved for
                the next session.
              </p>
            </Step>
          </div>
        </section>

        {/* ── memoryHD ── */}
        <section className="mt-14 sm:mt-20">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
              memoryHD
            </h2>
            <span className="rounded-full bg-olive-500/15 px-2.5 py-0.5 text-xs font-semibold text-olive-600 dark:text-olive-400">
              Free, Apache-2.0
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-300">
            Claude Code remembers things when the model thinks to look, and
            under pressure it usually does not. memoryHD makes remembering
            mechanical. It sits on top of the memory Claude Code already has,
            same folder, same format, so nothing you have breaks.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MEMORY_FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="relative overflow-hidden rounded-xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900"
              >
                {i === 1 && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-olive-500/25 blur-3xl"
                  />
                )}
                <f.icon
                  weight="regular"
                  className="relative size-5 text-olive-500"
                />
                <h3 className="relative mt-3 text-base font-bold text-sand-900 dark:text-sand-50">
                  {f.title}
                </h3>
                <p className="relative mt-2 text-sm text-sand-600 dark:text-sand-400">
                  {f.body}
                </p>
              </div>
            ))}
          </div>

          {/* Side-by-side with native memory */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-sand-300 dark:border-sand-800">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
                  <th className="px-4 py-3 font-semibold text-sand-500 dark:text-sand-500" />
                  <th className="px-4 py-3 font-bold text-sand-900 dark:text-sand-50">
                    With memoryHD
                  </th>
                  <th className="px-4 py-3 font-semibold text-sand-600 dark:text-sand-400">
                    Memory on its own
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-300 bg-sand-50 dark:divide-sand-800 dark:bg-sand-950/40">
                <tr>
                  <td className="px-4 py-3 font-semibold text-sand-700 dark:text-sand-300">
                    Recall
                  </td>
                  <td className="px-4 py-3 text-sand-700 dark:text-sand-300">
                    Fires on every prompt, from a keyword index
                  </td>
                  <td className="px-4 py-3 text-sand-500 dark:text-sand-500">
                    When the model thinks to look
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-sand-700 dark:text-sand-300">
                    Freshness
                  </td>
                  <td className="px-4 py-3 text-sand-700 dark:text-sand-300">
                    Age stamped on every pointer, stale flagged
                  </td>
                  <td className="px-4 py-3 text-sand-500 dark:text-sand-500">
                    Visible only if the note is opened
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-sand-700 dark:text-sand-300">
                    Cleanup
                  </td>
                  <td className="px-4 py-3 text-sand-700 dark:text-sand-300">
                    Audited against the repo, you approve each fix
                  </td>
                  <td className="px-4 py-3 text-sand-500 dark:text-sand-500">
                    Best effort while writing
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mt-10 mb-3 text-lg font-bold text-sand-900 dark:text-sand-50">
            Install memoryHD
          </h3>
          <MemoryInstall />

          <h3 className="mt-10 text-lg font-bold text-sand-900 dark:text-sand-50">
            Try these after installing
          </h3>
          <ul className="mt-4 space-y-2.5">
            {TRY_PROMPTS.map((prompt) => (
              <li
                key={prompt}
                className="flex items-start gap-2.5 rounded-lg border border-sand-300 bg-sand-100 px-4 py-3 text-sm text-sand-700 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-300"
              >
                <Sparkle
                  weight="regular"
                  size={14}
                  className="mt-0.5 shrink-0 text-olive-500"
                />
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-sand-500 dark:text-sand-400">
            Tested on Linux, macOS, and Windows. The full source, the test
            suites, and the recall benchmark are in the repository.
          </p>
        </section>

        {/* ── The GPT cage ── */}
        <section className="mt-14 sm:mt-20">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
              The GPT cage
            </h2>
            <span className="rounded-full bg-sand-300/60 px-2.5 py-0.5 text-xs font-semibold text-sand-700 dark:bg-sand-800 dark:text-sand-300">
              Shipping soon
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-300">
            Two models are better than one, until the second one runs git or
            reads your env file. The cage packages Claude-to-GPT delegation as
            a Claude Code plugin: your agent briefs a second builder, and
            everything dangerous is locked in code instead of trusted to a
            prompt.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CAGE_FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900"
              >
                <f.icon weight="regular" className="size-5 text-olive-500" />
                <h3 className="mt-3 text-base font-bold text-sand-900 dark:text-sand-50">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-sand-600 dark:text-sand-400">
                  {f.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-sand-500 dark:text-sand-400">
            The cage is running in production at AI Canvas today and is being
            hardened for a public release. Watch the{' '}
            <a
              href="https://github.com/uiNerd16"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sand-700 underline underline-offset-2 hover:text-sand-900 dark:text-sand-300 dark:hover:text-sand-50"
            >
              AI Canvas GitHub
            </a>{' '}
            for the release.
          </p>
        </section>

        {/* ── Cross-link ── */}
        <section className="mt-14 sm:mt-20">
          <div className="rounded-xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900">
            <h2 className="text-base font-bold text-sand-900 dark:text-sand-50">
              The third piece is the components
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-sand-600 dark:text-sand-400">
              Workflows keep your agent sharp; the{' '}
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
