import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteFooter } from '../../components/SiteFooter'
import { SITE_URL } from '../../lib/config'
import {
  Badge,
  ProductRow,
  SectionHead,
  TextLink,
  V3Crumb,
  V3Header,
} from './chrome'
import { ApprovalGate } from './diagrams/ApprovalGate'
import { CageAnatomy } from './diagrams/CageAnatomy'
import { HeroFlow } from './diagrams/HeroFlow'
import { MemoryRing } from './diagrams/MemoryRing'
import { DiagramLegend, DiagramPanel } from './diagrams/parts'

export const metadata: Metadata = {
  title: 'Agentic Workflows: Memory, Delegation, and the Gate in the Middle',
  description:
    'One person, a team of agents, and the guardrails that make that safe. memoryHD gives Claude Code a memory it cannot skip. The GPT cage gives it a second builder that cannot reach git, the network, or your secrets.',
  alternates: { canonical: `${SITE_URL}/agentic-workflows` },
  // Design variant of /agentic-workflows. Kept out of the index while both
  // directions are side by side; drop this line when one of them wins.
  robots: { index: false, follow: false },
  openGraph: {
    title: 'One person, a team of agents, and the guardrails in between',
    description:
      'A memory your agent cannot forget to use, a second builder locked in a sandbox, and one approval gate where you decide what becomes real.',
    url: `${SITE_URL}/agentic-workflows/v3`,
  },
}

export default function AgenticWorkflowsV3Page() {
  return (
    <>
      <V3Header />

      <main className="relative mx-auto w-full max-w-5xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <V3Crumb />

        {/* ── Hero ── */}
        <section>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
            <span className="block font-normal text-sand-600 dark:text-sand-300">
              You are one person running a team of agents.
            </span>
            <span className="block text-olive-500">
              This is the wiring that keeps them honest.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-600 dark:text-sand-300">
            A memory your agent cannot forget to use, a locked lane where a
            second model does the heavy building, and one gate in the middle
            where you decide what becomes real. It is the setup AI Canvas is
            built with every day.
          </p>

          <div className="mt-10">
            <DiagramPanel caption="Two lanes leave your agent and both come back to the same card. Nothing crosses that card without you.">
              <HeroFlow />
            </DiagramPanel>
            <DiagramLegend />
          </div>
        </section>

        {/* ── Act 1 ── */}
        <section className="mt-20 sm:mt-28">
          <SectionHead eyebrow="01" title="It remembers">
            <p>
              Your agent forgets the moment the session ends, so you explain the
              same decision every week and correct the same mistake twice.
              memoryHD writes the decision down the moment it is made and puts
              it back in front of the agent on the next prompt, with its age
              attached so a stale note announces itself.
            </p>
            <p>
              Same folder, same markdown Claude Code already uses. Nothing you
              have breaks, and you can read every note in a text editor.
            </p>
          </SectionHead>

          <div className="mt-8">
            <DiagramPanel caption="Recall runs on every prompt from a keyword index, so it does not depend on the model choosing to look. The cleanup branch is read only until you approve it.">
              <MemoryRing />
            </DiagramPanel>
          </div>

          <TextLink href="/agentic-workflows/v3/memoryhd">
            How memoryHD works
          </TextLink>
        </section>

        {/* ── Act 2 ── */}
        <section className="mt-20 sm:mt-28">
          <SectionHead eyebrow="02" title="It delegates safely">
            <p>
              A second model doubles what you get through in a day, right up to
              the moment it runs git or opens your env file. The cage packages
              the delegation as a plugin: a skill that picks the lane and holds
              the checkpoints, and an MCP server whose sandbox flags are fixed
              in the code instead of passed in as arguments.
            </p>
            <p>
              Reading and writing are two separate tools, so you can allow the
              read lane outright and keep approving the write lane by hand.
            </p>
          </SectionHead>

          <div className="mt-8">
            <DiagramPanel caption="The write lane never leaves the sandbox on its own. What comes out is a diff, and a diff is something you can read before it counts.">
              <CageAnatomy />
            </DiagramPanel>
          </div>

          <TextLink href="/agentic-workflows/v3/gpt-cage">
            Inside the cage
          </TextLink>
        </section>

        {/* ── Act 3 ── */}
        <section className="mt-20 sm:mt-28">
          <SectionHead eyebrow="03" title="You stay the gate">
            <p>
              Both tools end in the same place, on purpose. The librarian
              proposes cleanup and never deletes. The second builder writes into
              a sandbox and its work reaches your repository only after you say
              yes.
            </p>
            <p>
              An agent that can act without asking is fast until the first bad
              day. One gate in the middle keeps the speed and takes the bad day
              off the table.
            </p>
          </SectionHead>

          <div className="mt-8">
            <DiagramPanel caption="Two exits, and only one of them moves forward. The same shape appears in both products, so the habit transfers.">
              <ApprovalGate />
            </DiagramPanel>
          </div>

          <TextLink href="/agentic-workflows/v3/gpt-cage">
            See the gate inside the cage
          </TextLink>
        </section>

        {/* ── Closing strip ── */}
        <section className="mt-20 sm:mt-28">
          <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
            The two pieces
          </h2>
          <div className="mt-6">
            <ProductRow
              href="/agentic-workflows/v3/memoryhd"
              name="memoryHD"
              line="Persistent memory for Claude Code, in plain markdown files you own."
              badge={<Badge tone="free">Free · Apache-2.0</Badge>}
            />
            <ProductRow
              href="/agentic-workflows/v3/gpt-cage"
              name="The GPT cage"
              line="A second builder in a sandbox that cannot reach git, the network, or your secrets."
              badge={<Badge tone="soon">Shipping soon</Badge>}
            />
          </div>

          <div className="mt-10 rounded-xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900">
            <h3 className="text-base font-bold text-sand-900 dark:text-sand-50">
              The third piece is the components
            </h3>
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
