import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'

// ─── SiteFooter ───────────────────────────────────────────────────────────────
// Shared page footer used at the bottom of /, /mcp, /about, and any other
// long-form page. The icon links home, the centre is the tagline, and the
// right side is a permanent pointer to the @aicanvas/mcp npm package.

export function SiteFooter() {
  return (
    <footer className="mt-20">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="AI Canvas home"
          className="transition-opacity hover:opacity-70"
        >
          <img src="/icon.svg" alt="AI Canvas" className="h-5 w-5" />
        </Link>
        <p className="text-xs text-sand-500">
          AI native components. Free and open source.
        </p>
        <a
          href="https://www.npmjs.com/package/@aicanvas/mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1 text-xs text-sand-500 transition-colors hover:text-sand-700 dark:hover:text-sand-200 sm:inline-flex"
        >
          @aicanvas/mcp on npm
          <ArrowUpRight weight="regular" size={12} />
        </a>
      </div>
    </footer>
  )
}
