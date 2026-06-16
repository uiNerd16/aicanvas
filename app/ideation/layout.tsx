import { Suspense, type ReactNode } from 'react'
import { JetBrains_Mono } from 'next/font/google'
import { Sidebar } from '../components/Sidebar'
import { IdeationTopBar } from '../_components/IdeationTopBar'
// Registry-free nav counts (generated) so the client Sidebar never pulls the
// heavy registry (keeps three.js etc. out of the bundle).
import { CATEGORY_COUNTS, TOTAL_COMPONENTS } from '../lib/component-nav.generated'

// Make JetBrains Mono available throughout the ideation subtree so any
// Andromeda preview that references the --font-jetbrains-mono variable
// resolves correctly without each page re-declaring the font loader.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// The /ideation subtree is the internal dev playground — keep every route
// under it out of search indexes (it mirrors shipped pages). Pairs with the
// Disallow: /ideation/ in app/robots.ts.
export const metadata = {
  robots: { index: false, follow: false },
}

export default function IdeationLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex h-full w-full flex-1 flex-col overflow-hidden md:flex-row ${jetbrainsMono.variable}`}
    >
      <Suspense fallback={null}>
        <Sidebar embedded counts={CATEGORY_COUNTS} total={TOTAL_COMPONENTS} />
      </Suspense>
      <div className="flex flex-1 scroll-smooth flex-col overflow-y-auto bg-sand-200 dark:bg-sand-950">
        <IdeationTopBar />
        {children}
      </div>
    </div>
  )
}
