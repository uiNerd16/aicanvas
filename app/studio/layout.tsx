// Studio layout — custom top bar only. No left rail, no search, no global
// component nav. The icon-only Ko-fi link reveals its label on hover.
//
// The site's global Sidebar + MobileNav are early-return'd on `/studio/*`
// (see app/components/{Sidebar,MobileNav}.tsx), so this layout owns the whole
// chrome for Studio routes.

import Link from 'next/link'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full w-full flex-col bg-sand-200 dark:bg-sand-950">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-sand-300 bg-sand-200/90 px-4 backdrop-blur dark:border-sand-800 dark:bg-sand-950/90 sm:px-6">
        {/* Left: logo + Studio wordmark */}
        <Link
          href="/studio"
          className="flex items-center gap-2 font-bold text-sand-900 transition-colors hover:text-sand-700 dark:text-sand-50 dark:hover:text-sand-200"
        >
          <img
            src="/ai-canvas-icon.svg"
            alt=""
            aria-hidden="true"
            width={22}
            height={19}
            className="shrink-0"
          />
          <span className="text-sm">AI Canvas</span>
          <span className="ml-0.5 rounded-md border border-sand-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sand-500 dark:border-sand-700 dark:text-sand-400">
            Studio
          </span>
        </Link>

        {/* Right: Ko-fi icon, text appears on hover */}
        <div className="group relative">
          <a
            href="https://ko-fi.com/aicanvasme"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Send a Coffee — support AI Canvas on Ko-fi"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-sand-300 transition-colors hover:border-sand-400 dark:border-sand-700 dark:hover:border-sand-600"
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
          {/* Tooltip — same message as the original sidebar CTA */}
          <span
            role="tooltip"
            className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md border border-sand-300 bg-sand-100 px-2.5 py-1.5 text-xs font-semibold text-sand-700 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 dark:border-sand-700 dark:bg-sand-900 dark:text-sand-200"
          >
            Send a Coffee
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
