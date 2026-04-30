import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, GithubLogo, XLogo } from '@phosphor-icons/react/dist/ssr'
import { InstallCards } from './InstallCards'
import { GITHUB_URL, SITE_URL, X_URL } from '../lib/config'

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
      <header className="sticky top-0 z-50 hidden h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950 md:grid">
        <div />
        <Link
          href="/mcp"
          className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
        >
          /MCP
        </Link>
        <div className="flex items-center justify-end gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
          >
            <GithubLogo weight="regular" size={20} />
          </a>
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
          >
            <XLogo weight="regular" size={20} />
          </a>
          <Link
            href="/mcp"
            className="inline-flex items-center gap-1.5 rounded-lg bg-olive-500 px-3 py-2 text-xs font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-[0.97]"
          >
            <img src="/ai-canvas-icon-mono.svg" alt="" width={16} height={14} className="shrink-0" />
            Get MCP
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-12">
        {/* Mobile breadcrumb */}
        <p className="mb-6 text-sm font-semibold md:hidden">
          <span className="text-olive-500">/MCP</span>
        </p>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <header className="mb-10 sm:mb-14">
          <h1 className="max-w-xl text-3xl font-extrabold leading-[1.1] tracking-tight text-sand-900 dark:text-sand-50 sm:text-4xl">
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
              title: 'Search by description',
              body: '“Find me an animated card stack” → ranked matches with screenshots.',
            },
            {
              title: 'Install with one command',
              body: 'AI calls the MCP, picks the component, runs the shadcn CLI for you.',
            },
            {
              title: 'Always fresh',
              body: 'New components on aicanvas.me are live in your AI within ~5 minutes. No package update needed.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900"
            >
              <h3 className="text-base font-bold text-sand-900 dark:text-sand-50">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-sand-600 dark:text-sand-400">
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
            'I’m building a glass-style modal. What’s available in AI Canvas? Pick the best one and show me the source.',
            'I need typography that does a wave or ripple effect. Find one, give me the install command, and explain how it works.',
          ].map((prompt) => (
            <li
              key={prompt}
              className="rounded-lg border border-sand-300 bg-sand-100 px-4 py-3 text-sm text-sand-700 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-300"
            >
              <span className="mr-2 font-mono text-xs text-sand-400 dark:text-sand-500">
                ›
              </span>
              {prompt}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Footer link ──────────────────────────────────────────────────── */}
      <div className="mt-14 flex items-center justify-between border-t border-sand-300 pt-6 dark:border-sand-800">
        <Link
          href="/components"
          className="flex items-center gap-1 text-sm font-semibold text-sand-700 transition-colors hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-100"
        >
          Browse all components on the site
          <ArrowRight weight="regular" size={14} />
        </Link>
        <a
          href="https://www.npmjs.com/package/@aicanvas/mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-sand-500 transition-colors hover:text-sand-700 dark:text-sand-400 dark:hover:text-sand-200"
        >
          @aicanvas/mcp on npm ↗
        </a>
      </div>
      </main>
    </>
  )
}
