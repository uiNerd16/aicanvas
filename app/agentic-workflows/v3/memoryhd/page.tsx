import type { Metadata } from 'next'
import { MemoryInstall } from '../../MemoryInstall'
import { SiteFooter } from '../../../components/SiteFooter'
import { SITE_URL } from '../../../lib/config'
import {
  Badge,
  ExternalLink,
  Guarantee,
  ProductRow,
  SectionHead,
  TextLink,
  V3Crumb,
  V3Header,
} from '../chrome'
import { MemoryRing } from '../diagrams/MemoryRing'
import { DiagramPanel } from '../diagrams/parts'

const REPO = 'https://github.com/uiNerd16/memoryHD'

export const metadata: Metadata = {
  title: 'memoryHD: Persistent Memory for Claude Code',
  description:
    'memoryHD writes notes as you work and recalls the right one on every prompt, with its age attached. Plain markdown files you own, a librarian that only proposes cleanup, and a write gate that keeps keys out. Free and Apache-2.0.',
  alternates: { canonical: `${SITE_URL}/agentic-workflows/v3/memoryhd` },
  // Design variant page, kept out of the index while directions are compared.
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Decide it once, and your agent keeps it',
    description:
      'A memory for Claude Code that recalls mechanically on every prompt, ages its own pointers, and never lets a key land in a note.',
    url: `${SITE_URL}/agentic-workflows/v3/memoryhd`,
  },
}

export default function MemoryHdV3Page() {
  return (
    <>
      <V3Header />

      <main className="relative mx-auto w-full max-w-5xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <V3Crumb />

        {/* ── Hero ── */}
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-sand-500 dark:text-sand-400">
              memoryHD
            </span>
            <Badge tone="free">Free · Apache-2.0</Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
            <span className="block font-normal text-sand-600 dark:text-sand-300">
              Decide it once.
            </span>
            <span className="block text-olive-500">
              Your agent keeps it from then on.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-600 dark:text-sand-300">
            A Claude Code plugin that turns remembering into plumbing. Notes get
            written while you work, the right ones come back on the next prompt,
            and every one of them is a markdown file sitting in your own folder.
          </p>
        </section>

        {/* ── Anatomy ── */}
        <section className="mt-16 sm:mt-20">
          <SectionHead title="The anatomy">
            <p>
              A closed loop and one branch off it. The loop runs on every
              prompt without being asked. The branch is the librarian, and it
              can only hand you a list.
            </p>
          </SectionHead>
          <div className="mt-8">
            <DiagramPanel caption="Recall matches your words against a one-line index and injects pointers to the notes that matter right now, each stamped with its age.">
              <MemoryRing />
            </DiagramPanel>
          </div>
        </section>

        {/* ── Guarantees ── */}
        <section className="mt-16 sm:mt-20">
          <SectionHead title="What it guarantees">
            <p>
              Some of these are held by the code, and some are held by the way
              the plugin is written. The difference is marked, because it
              matters.
            </p>
          </SectionHead>
          <ul className="mt-8">
            <Guarantee
              enforced="code"
              claim="Recall is mechanical, not optional"
              how="A hook runs on every prompt and injects up to three pointers from a keyword index, so recall never depends on the model deciding to look."
            />
            <Guarantee
              enforced="code"
              claim="Every pointer carries its age"
              how="Recall stamps how old a note is, so a stale note announces itself instead of being trusted blindly. The repository always outranks the note."
            />
            <Guarantee
              enforced="code"
              claim="Keys cannot land in a note"
              how="A write gate refuses key-shaped strings before they reach disk: API tokens, private key blocks, connection URLs with an inline password."
            />
            <Guarantee
              enforced="code"
              claim="The librarian can only propose"
              how="It reads your notes and checks them against the real repository, then hands you the fixes one item at a time. Applying them is your call."
            />
            <Guarantee
              enforced="policy"
              claim="Retired notes go to trash, never to deletion"
              how="Cleanup moves a note out of the way instead of destroying it, so a wrong call is something you can walk back."
            />
            <Guarantee
              enforced="policy"
              claim="Plain files you own"
              how="Markdown in a folder, in the format Claude Code already uses. No service, no API key, no telemetry, and zero dependencies."
            />
          </ul>
        </section>

        {/* ── Install ── */}
        <section className="mt-16 sm:mt-20">
          <SectionHead title="Install it">
            <p>
              Two ways in: install the plugin and keep it, or clone the
              repository and try it for one session.
            </p>
          </SectionHead>
          <div className="mt-8">
            <MemoryInstall />
          </div>
          <p className="mt-5 max-w-2xl text-sm text-sand-500 dark:text-sand-400">
            Needs Node 18 or newer, nothing else. Tested on Linux, macOS, and
            Windows. The full source, the test suites, and the recall benchmark
            are in{' '}
            <ExternalLink href={REPO}>the repository</ExternalLink>.
          </p>
        </section>

        {/* ── Closing ── */}
        <section className="mt-16 sm:mt-20">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            The other half of the workflow
          </h2>
          <div className="mt-6">
            <ProductRow
              href="/agentic-workflows/v3/gpt-cage"
              name="The GPT cage"
              line="A second builder in a sandbox that cannot reach git, the network, or your secrets."
              badge={<Badge tone="soon">Shipping soon</Badge>}
            />
          </div>
          <TextLink href="/agentic-workflows/v3">
            Back to the whole workflow
          </TextLink>
        </section>

        <SiteFooter />
      </main>
    </>
  )
}
