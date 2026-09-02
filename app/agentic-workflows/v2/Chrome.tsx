import Link from 'next/link'
import { ArrowRight, ArrowUpLeft } from '@phosphor-icons/react/dist/ssr'
import { HeaderSocials } from '../../components/HeaderSocials'

export const CATALOG_HREF = '/agentic-workflows/v2'
export const MEMORY_HREF = '/agentic-workflows/v2/memoryhd'
export const CAGE_HREF = '/agentic-workflows/v2/gpt-cage'

const CATALOG_LABEL = '/Agentic workflows'

// Sticky bar shared by the catalog and both product pages. The label always
// leads back to the catalog, so a product page is never a dead end.
export function CatalogHeader({ trail }: { trail?: string }) {
  return (
    <>
      <header className="sticky top-0 z-10 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950 md:grid">
        <div />
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <Link
            href={CATALOG_HREF}
            className="text-olive-500 transition-colors hover:text-olive-400"
          >
            {CATALOG_LABEL}
          </Link>
          {trail ? (
            <>
              <span className="text-sand-400 dark:text-sand-600">/</span>
              <span className="text-sand-700 dark:text-sand-300">{trail}</span>
            </>
          ) : null}
        </p>
        <div className="flex items-center justify-end">
          <HeaderSocials />
        </div>
      </header>
    </>
  )
}

// Same trail on small screens, rendered inside the page body.
export function MobileTrail({ trail }: { trail?: string }) {
  return (
    <p className="mb-6 flex items-center gap-1.5 text-sm font-semibold md:hidden">
      <Link href={CATALOG_HREF} className="text-olive-500">
        {CATALOG_LABEL}
      </Link>
      {trail ? (
        <>
          <span className="text-sand-400 dark:text-sand-600">/</span>
          <span className="text-sand-700 dark:text-sand-300">{trail}</span>
        </>
      ) : null}
    </p>
  )
}

export const OLIVE_BUTTON =
  'inline-flex min-h-11 items-center gap-2 rounded-lg bg-olive-500 px-4 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400'

export const QUIET_BUTTON =
  'inline-flex min-h-11 items-center gap-2 rounded-lg border border-sand-300 bg-sand-100 px-4 text-sm font-semibold text-sand-700 transition-colors hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-200 dark:hover:border-sand-700'

// Closing block on every product page: the other product, and the way back.
export function Related({
  otherHref,
  otherName,
  otherLine,
}: {
  otherHref: string
  otherName: string
  otherLine: string
}) {
  return (
    <section className="mt-14 sm:mt-20">
      <h2 className="text-xl font-bold text-sand-900 dark:text-sand-50">Related</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Link
          href={otherHref}
          className="group rounded-xl border border-sand-300 bg-sand-100 p-5 transition-colors hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
        >
          <h3 className="flex items-center gap-2 text-base font-bold text-sand-900 dark:text-sand-50">
            {otherName}
            <ArrowRight
              weight="regular"
              className="size-4 text-olive-500 transition-transform group-hover:translate-x-0.5"
            />
          </h3>
          <p className="mt-2 text-sm text-sand-600 dark:text-sand-400">{otherLine}</p>
        </Link>
        <Link
          href={CATALOG_HREF}
          className="group rounded-xl border border-sand-300 bg-sand-100 p-5 transition-colors hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
        >
          <h3 className="flex items-center gap-2 text-base font-bold text-sand-900 dark:text-sand-50">
            <ArrowUpLeft
              weight="regular"
              className="size-4 text-olive-500 transition-transform group-hover:-translate-x-0.5"
            />
            All plugins
          </h3>
          <p className="mt-2 text-sm text-sand-600 dark:text-sand-400">
            Back to the catalog, and to what is being packaged next.
          </p>
        </Link>
      </div>
    </section>
  )
}
