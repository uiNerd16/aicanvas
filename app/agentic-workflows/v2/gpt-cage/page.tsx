import type { Metadata } from 'next'
import { GithubLogo, ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import { CageDiagram } from '../CageDiagram'
import { CapabilityTable, type Capability } from '../CapabilityTable'
import {
  CatalogHeader,
  MEMORY_HREF,
  MobileTrail,
  OLIVE_BUTTON,
  Related,
} from '../Chrome'
import { SiteFooter } from '../../../components/SiteFooter'
import { GITHUB_URL, SITE_URL } from '../../../lib/config'

export const metadata: Metadata = {
  title: 'The GPT Cage: Sandboxed Delegation for Claude Code',
  description:
    'A Claude Code plugin that lets your agent hand work to a second model inside a sandbox. Two tools, one read-only and one write, with no git access, refused secret paths, and a diff you review.',
  alternates: { canonical: `${SITE_URL}/agentic-workflows/v2/gpt-cage` },
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

export default function GptCagePage() {
  return (
    <>
      <CatalogHeader trail="The GPT cage" />

      <main className="relative mx-auto w-full max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <MobileTrail trail="The GPT cage" />

        {/* ── Hero ── */}
        <header className="mb-10 sm:mb-14">
          <ShieldCheck weight="regular" className="size-8 text-olive-500" />
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl">
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

        {/* ── Manifest ── */}
        <section>
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

        {/* ── Mechanism ── */}
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

        {/* ── Availability ── */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            When you can install it
          </h2>
          <div className="mt-5 rounded-xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900">
            <p className="max-w-2xl text-base text-sand-600 dark:text-sand-300">
              There is no install command yet. The cage runs in production at AI
              Canvas today and is being hardened for a public release, so the
              honest answer is soon rather than a date. The release lands on{' '}
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
