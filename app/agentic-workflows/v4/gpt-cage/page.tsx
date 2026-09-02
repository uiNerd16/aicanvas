import type { Metadata } from 'next'
import { GithubLogo, ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import { CageDiagram } from '../../v2/CageDiagram'
import { CapabilityTable, type Capability } from '../../v2/CapabilityTable'
import {
  CatalogHeader,
  MEMORY_HREF,
  MobileTrail,
  OLIVE_BUTTON,
  Related,
} from '../Chrome'
import { Step } from '../../../components/Step'
import { SiteFooter } from '../../../components/SiteFooter'
import { GITHUB_URL, SITE_URL } from '../../../lib/config'

export const metadata: Metadata = {
  title: 'The GPT Cage: Sandboxed Delegation for Claude Code',
  description:
    'A Claude Code plugin that lets your agent hand work to a second model inside a sandbox. Two tools, one read-only and one write, with no git access, refused secret paths, and a diff you review.',
  alternates: { canonical: `${SITE_URL}/agentic-workflows` },
  robots: { index: false, follow: false },
}

const CAPABILITIES: Capability[] = [
  {
    kind: 'Tool',
    name: 'gpt_ask',
    what: 'The read lane. The second builder can read and answer, and cannot write anything.',
    enforced: 'code',
    mono: true,
  },
  {
    kind: 'Tool',
    name: 'gpt_run',
    what: 'The write lane. It works inside one folder, in a sandbox, with the network off. Separate from the read lane, so you can allow one and keep approving the other.',
    enforced: 'code',
    mono: true,
  },
  {
    kind: 'Boundary',
    name: 'Sandbox flags',
    what: 'Set in the server code, never taken from arguments a caller could change.',
    enforced: 'code',
  },
  {
    kind: 'Boundary',
    name: 'No git access',
    what: 'The second builder never commits, pushes, or checks out. Your agent makes a checkpoint first, so any slip is a one-command restore.',
    enforced: 'code',
  },
  {
    kind: 'Boundary',
    name: 'Refused paths',
    what: 'Env files, credential files, and private folders are refused rather than trusted to a prompt. Briefs carry variable names, never values.',
    enforced: 'code',
  },
  {
    kind: 'Skill',
    name: 'Delegation policy',
    what: 'Which lane to use, when to checkpoint, what the diff has to show, and when to hand the question back to you.',
    enforced: 'guidance',
  },
  {
    kind: 'Log',
    name: 'Run trail',
    what: 'Each delegation writes a full log and a metadata snapshot, and reports the model and effort actually used, so a drifting default is visible.',
    enforced: 'code',
  },
]

const COMPARISON = [
  {
    row: 'Git access',
    inCage: 'Never handed over, the tools do not expose it',
    inPrompt: 'An instruction the model can miss',
  },
  {
    row: 'Network',
    inCage: 'Off where the write tool runs',
    inPrompt: 'Trusted to stay unused',
  },
  {
    row: 'Secret files',
    inCage: 'Refused paths, checked before a read happens',
    inPrompt: 'Trusted to be avoided',
  },
  {
    row: 'What comes back',
    inCage: 'A diff, waiting for your review',
    inPrompt: 'Edits, already made',
  },
  {
    row: 'Audit trail',
    inCage: 'A full log and a metadata snapshot per run',
    inPrompt: 'Whatever is left in the transcript',
  },
]

export default function GptCagePage() {
  return (
    <>
      <CatalogHeader trail="The GPT cage" />

      <main className="relative mx-auto w-full max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <MobileTrail trail="The GPT cage" />

        {/* Hero */}
        <header className="mb-10 sm:mb-14">
          <ShieldCheck weight="regular" className="size-8 text-olive-500" />
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.2] tracking-tight text-sand-900 dark:text-sand-50 sm:text-4xl">
            The GPT cage
          </h1>
          <p className="mt-3">
            <span className="rounded-full bg-sand-300/60 px-2.5 py-0.5 text-xs font-semibold text-sand-700 dark:bg-sand-800 dark:text-sand-300">
              Shipping soon
            </span>
          </p>
          <p className="mt-5 max-w-xl text-lg text-sand-600 dark:text-sand-300">
            Hand a build to a second model in a sandbox that cannot reach git,
            the network, or your secrets, and get back a diff you review.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={OLIVE_BUTTON}
            >
              <GithubLogo weight="regular" className="size-4" />
              Watch the repository
            </a>
          </div>
        </header>

        {/* The loop */}
        <section>
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            The whole workflow
          </h2>
          <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-300">
            Two models are better than one, until the second one runs git or
            reads your env file. The cage packages the delegation as a Claude
            Code plugin: your agent briefs a second builder, and everything
            dangerous is locked in code instead of trusted to a prompt.
          </p>
          <div className="mt-5 space-y-6 rounded-xl border border-sand-300 bg-sand-100 px-5 py-6 dark:border-sand-800 dark:bg-sand-900">
            <Step number={1}>
              <p className="pt-0.5 text-sm text-sand-600 dark:text-sand-400">
                <span className="font-semibold text-sand-900 dark:text-sand-50">
                  Your agent writes the brief.
                </span>{' '}
                It carries variable names, never values, so your secrets stay on
                your side of the wall.
              </p>
            </Step>
            <Step number={2}>
              <p className="pt-0.5 text-sm text-sand-600 dark:text-sand-400">
                <span className="font-semibold text-sand-900 dark:text-sand-50">
                  It picks a lane.
                </span>{' '}
                <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">
                  gpt_ask
                </code>{' '}
                reads and answers.{' '}
                <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">
                  gpt_run
                </code>{' '}
                writes. Two separate tools, so you can allow one and keep
                approving the other.
              </p>
            </Step>
            <Step number={3}>
              <p className="pt-0.5 text-sm text-sand-600 dark:text-sand-400">
                <span className="font-semibold text-sand-900 dark:text-sand-50">
                  The write lane runs in the sandbox.
                </span>{' '}
                One folder, the network off, no git at all. Your agent takes a
                checkpoint first, so any slip is a one-command restore.
              </p>
            </Step>
            <Step number={4} isLast>
              <p className="pt-0.5 text-sm text-sand-600 dark:text-sand-400">
                <span className="font-semibold text-sand-900 dark:text-sand-50">
                  You review the diff.
                </span>{' '}
                Nothing counts as done until you approve it, and the run leaves
                a full log behind either way.
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
            the code or is direction the model follows. The dangerous parts are
            all in the first column.
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
            Your agent picks a lane, the cage runs the second builder with the
            limits locked in code, and the work comes back as a diff you approve
            before it counts as done.
          </p>
          <div className="mt-5">
            <CageDiagram />
          </div>
        </section>

        {/* Held in code, not asked for */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            Held in code, not asked for politely
          </h2>
          <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-300">
            The same limits can be written into a prompt. The difference is what
            happens on the day the model does not follow it.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-sand-300 dark:border-sand-800">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Limit</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-bold text-sand-900 dark:text-sand-50"
                  >
                    In the cage
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-semibold text-sand-600 dark:text-sand-400"
                  >
                    Asked for in a prompt
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
                      {line.inCage}
                    </td>
                    <td className="px-4 py-3 text-sand-600 dark:text-sand-500">
                      {line.inPrompt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Availability */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            When you can install it
          </h2>
          <div className="mt-5 rounded-xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900">
            <p className="max-w-2xl text-base text-sand-600 dark:text-sand-300">
              There is no install command yet. The cage runs in production at AI
              Canvas today and is being hardened for a public release, so the
              honest answer is soon rather than a date. When it ships it ships
              as one plugin, the skill and the MCP server together, the same way
              memoryHD installs today. The release lands on{' '}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sand-700 underline underline-offset-2 hover:text-sand-900 dark:text-sand-300 dark:hover:text-sand-50"
              >
                the AI Canvas GitHub
              </a>
              , and this page gets the commands the day it does.
            </p>
          </div>
        </section>

        <Related
          otherHref={MEMORY_HREF}
          otherName="memoryHD"
          otherLine="A memory for Claude Code that writes down what you settle and hands it back on the next prompt. Free, and installable today."
        />

        <SiteFooter />
      </main>
    </>
  )
}
