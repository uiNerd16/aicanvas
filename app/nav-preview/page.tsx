import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Sidebar } from '../components/Sidebar'
import { CATEGORY_COUNTS, TOTAL_COMPONENTS } from '../lib/component-nav.generated'

// Throwaway test route for the "promote the design system" sidebar. It renders
// the real Sidebar with `promoteDS` (the exact component that would ship), with
// `preview` to force it to render here even though the global copy hides itself
// on this route. Applying site-wide = pass promoteDS in app/layout.tsx +
// MobileNav, then delete this route. Kept out of search indexes.
export const metadata: Metadata = {
  title: 'Sidebar preview',
  robots: { index: false, follow: false },
}

export default function NavPreviewPage() {
  return (
    <div className="flex h-full">
      <Suspense fallback={null}>
        <Sidebar preview promoteDS counts={CATEGORY_COUNTS} total={TOTAL_COMPONENTS} />
      </Suspense>
      <div className="flex-1 overflow-y-auto p-10">
        <div className="mx-auto max-w-xl space-y-4">
          <span className="inline-block rounded-md border border-olive-500/30 bg-olive-500/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-olive-600 dark:text-olive-400">
            Preview only
          </span>
          <h1 className="text-2xl font-extrabold text-sand-900 dark:text-sand-50">
            Sidebar — promoted design system
          </h1>
          <p className="text-sand-600 dark:text-sand-400">
            The left rail is the live Sidebar with the new landing behavior. Same
            order as today: Components stays first, capped to its first 3
            categories with a Show more toggle, so the Design Systems pole rises
            into view with Andromeda&apos;s System, Brain and Templates expanded.
          </p>
          <p className="text-sand-600 dark:text-sand-400">
            Nothing else on the site changes yet. Once this looks right, the same
            behavior gets flipped on everywhere.
          </p>
        </div>
      </div>
    </div>
  )
}
