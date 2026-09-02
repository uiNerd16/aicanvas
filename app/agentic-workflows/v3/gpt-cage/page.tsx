import type { Metadata } from 'next'
import { SiteFooter } from '../../../components/SiteFooter'
import { GITHUB_URL, SITE_URL } from '../../../lib/config'
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
import { CageAnatomy } from '../diagrams/CageAnatomy'
import { DiagramPanel } from '../diagrams/parts'

export const metadata: Metadata = {
  title: 'The GPT Cage: A Second AI Builder, Locked Down',
  description:
    'Claude-to-GPT delegation packaged as a Claude Code plugin: a skill that sets the policy and an MCP server whose sandbox flags live in code. A read lane, a write lane with no network and no git, and a diff you approve.',
  alternates: { canonical: `${SITE_URL}/agentic-workflows/v3/gpt-cage` },
  // Design variant page, kept out of the index while directions are compared.
  robots: { index: false, follow: true },
  openGraph: {
    title: 'A second builder, and the cage that makes it safe',
    description:
      'Two tools, one sandbox, no git and no network. Every delegation ends in a diff you read before it counts.',
    url: `${SITE_URL}/agentic-workflows/v3/gpt-cage`,
  },
}

export default function GptCageV3Page() {
  return (
    <>
      <V3Header />

      <main className="relative mx-auto w-full max-w-5xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <V3Crumb />

        {/* ── Hero ── */}
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-sand-500 dark:text-sand-400">
              The GPT cage
            </span>
            <Badge tone="soon">Shipping soon</Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
            <span className="block font-normal text-sand-600 dark:text-sand-300">
              A second model doubles what you get built.
            </span>
            <span className="block text-olive-500">
              A cage is what makes that a good idea.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-600 dark:text-sand-300">
            Claude writes the brief, a second builder does the work inside one
            folder with the network off, and what comes back is a diff. The
            limits are set in the code that runs the tools, not asked for
            politely in a prompt.
          </p>
        </section>

        {/* ── Anatomy ── */}
        <section className="mt-16 sm:mt-20">
          <SectionHead title="The anatomy">
            <p>
              One plugin holds both halves: a skill that decides the lane, the
              checkpoints, and when to escalate, and an MCP server that is the
              cage itself. Your agent only ever sees two tools.
            </p>
          </SectionHead>
          <div className="mt-8">
            <DiagramPanel caption="gpt_ask can only read, so it is safe to allow outright. gpt_run writes inside the sandbox and its output waits for you.">
              <CageAnatomy />
            </DiagramPanel>
          </div>
        </section>

        {/* ── Guarantees ── */}
        <section className="mt-16 sm:mt-20">
          <SectionHead title="What it guarantees">
            <p>
              A guarantee that lives in a prompt is a request. These are marked
              by where they are actually held.
            </p>
          </SectionHead>
          <ul className="mt-8">
            <Guarantee
              enforced="code"
              claim="The sandbox flags live in the server"
              how="They are set where the tool runs, never taken from arguments, so nothing passed in from a prompt can widen the lane."
            />
            <Guarantee
              enforced="code"
              claim="Reading and writing are two tools"
              how="gpt_ask is read only. gpt_run writes inside one folder, sandboxed, with the network off. You can allow the first and keep approving the second."
            />
            <Guarantee
              enforced="code"
              claim="No git access, ever"
              how="The second builder never commits, pushes, or checks out. Your agent takes a checkpoint before it starts, so any slip is one command to undo."
            />
            <Guarantee
              enforced="code"
              claim="Refused paths are a list in the code"
              how="Env files, credential files, and private folders are refused before a read happens, rather than trusted to an instruction."
            />
            <Guarantee
              enforced="code"
              claim="Every run leaves a trail"
              how="Each delegation writes a full log and a metadata snapshot, and reports the model and effort actually used, so a drifting default is visible."
            />
            <Guarantee
              enforced="policy"
              claim="Briefs carry names, never values"
              how="The skill passes variable names into the brief and keeps the values on your side of the wall."
            />
          </ul>
        </section>

        {/* ── Availability ── */}
        <section className="mt-16 sm:mt-20">
          <SectionHead title="Getting it">
            <p>
              There is no install command yet. The cage runs in production at AI
              Canvas today and is being hardened for a public release, which is
              the honest state of it.
            </p>
          </SectionHead>
          <div className="mt-8 rounded-xl border border-sand-300 bg-sand-100 p-6 dark:border-sand-800 dark:bg-sand-900">
            <h3 className="text-base font-bold text-sand-900 dark:text-sand-50">
              When it ships, it ships as a plugin
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sand-600 dark:text-sand-400">
              One install, the skill and the MCP server together, the same way{' '}
              memoryHD installs today. Until then, watch{' '}
              <ExternalLink href={GITHUB_URL}>the AI Canvas GitHub</ExternalLink>{' '}
              for the release.
            </p>
          </div>
        </section>

        {/* ── Closing ── */}
        <section className="mt-16 sm:mt-20">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            The other half of the workflow
          </h2>
          <div className="mt-6">
            <ProductRow
              href="/agentic-workflows/v3/memoryhd"
              name="memoryHD"
              line="Persistent memory for Claude Code, in plain markdown files you own."
              badge={<Badge tone="free">Free · Apache-2.0</Badge>}
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
