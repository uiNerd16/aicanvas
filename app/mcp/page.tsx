import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkle } from '@phosphor-icons/react/dist/ssr'
import { InstallCards } from './InstallCards'
import { SiteFooter } from '../components/SiteFooter'
import { HeaderSocials } from '../components/HeaderSocials'
import { SITE_URL } from '../lib/config'

export const metadata: Metadata = {
  title: 'Connect to AI — Install AI Canvas in your editor',
  description:
    'Add the AI Canvas MCP server to Claude Desktop, Claude Code, Cursor, or Codex in seconds. One click for Cursor, copy-paste for the rest. Search, inspect, and install React components from your AI editor.',
  alternates: { canonical: `${SITE_URL}/mcp` },
  openGraph: {
    title: 'Connect AI Canvas to your AI editor',
    description:
      'Pick your AI editor. Click install. Start asking the AI to find and install components from AI Canvas.',
    url: `${SITE_URL}/mcp`,
  },
}

export default function McpPage() {
  return (
    <>
      {/* ── Sticky top bar — h-14 (56px) matches the sidebar logo block ── */}
      <header className="sticky top-0 z-10 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950 md:grid">
        <div />
        <Link
          href="/mcp"
          className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
        >
          /MCP
        </Link>
        <div className="flex items-center justify-end">
          <HeaderSocials />
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        {/* Mobile breadcrumb */}
        <p className="mb-6 text-sm font-semibold md:hidden">
          <span className="text-olive-500">/MCP</span>
        </p>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <header className="mb-10 sm:mb-14">
          <h1 className="max-w-xl text-3xl font-extrabold leading-[1.2] tracking-tight text-sand-900 dark:text-sand-50 sm:text-4xl">
            Every AI Canvas component, inside{' '}
            <span className="text-olive-500">Claude Code.</span>
          </h1>
          <p className="mt-5 max-w-xl text-xl text-sand-800 dark:text-sand-100">
            One command to install the MCP. Then forget it exists.
          </p>
          <p className="mt-3 max-w-xl text-base text-sand-600 dark:text-sand-400">
            Every new component on AI Canvas appears automatically. No updates,
            no reinstalls.
          </p>
        </header>

      {/* ── Install cards ────────────────────────────────────────────────── */}
      <InstallCards />

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="mt-14 sm:mt-20">
        <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
          What you get
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Just ask',
              body: 'Describe what you want, like “an animated card stack,” and pick from ranked results.',
            },
            {
              title: 'No copy-paste',
              body: 'Your AI picks the right component and runs the install for you.',
            },
            {
              title: 'Always current',
              body: 'New components appear in your AI ~5 minutes after they ship. No package bumps, ever.',
            },
          ].map((card, i) => (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900"
            >
              {i === 1 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-olive-500/25 blur-3xl"
                />
              )}
              <h3 className="relative text-base font-bold text-sand-900 dark:text-sand-50">
                {card.title}
              </h3>
              <p className="relative mt-2 text-sm text-sand-600 dark:text-sand-400">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Try it prompts ───────────────────────────────────────────────── */}
      <section className="mt-14 sm:mt-20">
        <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">
          Try these prompts after installing
        </h2>
        <ul className="mt-5 space-y-2.5">
          {[
            'Use AI Canvas to show me what categories of components are available.',
            'Find me an animated card stack and tell me how to install it.',
            'I’m building a website and need a top bar navigation. What’s available in AI Canvas? Pick the best one.',
            'I need an animated background for my landing page. Find me a good one in AI Canvas.',
          ].map((prompt) => (
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
      </section>

      <SiteFooter />
      </main>
    </>
  )
}
