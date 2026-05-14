// LAB layout — custom top bar only. No left rail, no search, no global
// component nav. The site's global Sidebar + MobileNav are early-return'd on
// `/lab/*` (see app/components/{Sidebar,MobileNav}.tsx), so this layout owns
// the whole chrome for LAB routes.

import Link from 'next/link'
import { TopAuthPill } from '../components/auth/TopAuthPill'
import { LabLogo } from './_components/LabLogo'

export default function LabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-full w-full flex-col bg-sand-200 dark:bg-sand-950">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-sand-300 bg-sand-200/90 px-4 backdrop-blur dark:border-sand-800 dark:bg-sand-950/90 sm:px-6">
        {/* Left: icon + "AI Canvas" (links home, lighter) + divider + "LAB" badge (darker) */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            aria-label="AI Canvas — home"
            className="flex items-center gap-2 text-sm font-bold text-sand-500 transition-colors hover:text-sand-700 dark:text-sand-400 dark:hover:text-sand-200"
          >
            <img
              src="/ai-canvas-icon.svg"
              alt=""
              aria-hidden="true"
              width={22}
              height={19}
              className="shrink-0"
            />
            <span>AI Canvas</span>
          </Link>
          <span
            aria-hidden="true"
            className="h-4 w-px bg-sand-300 dark:bg-sand-700"
          />
          <span className="inline-flex items-center" aria-label="LAB">
            <LabLogo
              variant="compact"
              pixel={1.5}
              gap={1}
              letterGap={0.8}
              bubbles={false}
              assemblyDuration={1.2}
              idleAnimation
            />
          </span>
        </div>

        {/* Right: Sign in (matches site chrome) */}
        <TopAuthPill />
      </header>

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>

      {/* Bottom-left floating Ko-fi — icon-only, tooltip on hover. Fixed so it
          stays in viewport over the canvas. */}
      <div className="group fixed bottom-4 left-4 z-30">
        <a
          href="https://ko-fi.com/aicanvasme"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Send a Coffee — support AI Canvas on Ko-fi"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-sand-300 bg-sand-100/90 backdrop-blur transition-colors hover:border-sand-400 dark:border-sand-700 dark:bg-sand-900/90 dark:hover:border-sand-600"
        >
          <img
            src="/kofi.svg"
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
            className="shrink-0"
          />
        </a>
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-md border border-sand-300 bg-sand-100 px-2.5 py-1.5 text-xs font-semibold text-sand-700 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 dark:border-sand-700 dark:bg-sand-900 dark:text-sand-200"
        >
          Send a Coffee
        </span>
      </div>
    </div>
  )
}
