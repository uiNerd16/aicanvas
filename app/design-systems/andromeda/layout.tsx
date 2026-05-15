import { Suspense, type ReactNode } from 'react'
import { JetBrains_Mono } from 'next/font/google'
import { IdeationSidebar } from '../../_components/IdeationSidebar'
import { AndromedaContentColumn } from './AndromedaContentColumn'

// JetBrains Mono is the only font in the Andromeda design system.
// Loading it at the layout level makes --font-jetbrains-mono available
// to every Andromeda route (overview, showcase, per-component pages),
// which the tokens reference via fontMono / fontSans.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// Mirrors `app/ideation/layout.tsx` so every Andromeda route gets the
// same sidebar + topbar chrome as the ideation playground. The content
// column is forced to the Andromeda void background so it doesn't
// bleed sand-950 when content is shorter than the viewport.
export default function AndromedaLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex h-full w-full flex-1 flex-col overflow-hidden md:flex-row ${jetbrainsMono.variable}`}
    >
      <Suspense fallback={null}>
        <IdeationSidebar />
      </Suspense>
      <AndromedaContentColumn>{children}</AndromedaContentColumn>
    </div>
  )
}
