'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { IdeationTopBar } from '../../_components/IdeationTopBar'
import { tokens } from '../../../design-systems/andromeda/tokens'

// Template leaf routes own the full viewport (sidebar + topbar are suppressed)
// and provide their own internal scroll. The layout's column would otherwise
// reserve a vertical scrollbar gutter via `scrollbar-gutter: stable`, leaving
// a thin empty strip on the right. This wrapper drops both `overflow-y-auto`
// and the gutter for those routes so the template fills the column edge-to-edge.
const TEMPLATE_LEAF_RE = /^\/design-systems\/[^/]+\/templates\/[^/]+/
// The Andromeda overview (the system root /design-systems/andromeda) is AI
// Canvas chrome (sand/olive), so its scroll column takes the AI Canvas page
// surface, not the Andromeda void. The background must live on the scroll
// container (not a min-h-full child) so it always covers the full scrollable
// height — a child can two-tone when content overflows.
const OVERVIEW_RE = /^\/design-systems\/andromeda\/?$/

export function AndromedaContentColumn({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? ''
  const isTemplate = TEMPLATE_LEAF_RE.test(pathname)
  const isOverview = OVERVIEW_RE.test(pathname)

  const className = isTemplate
    ? 'flex flex-1 flex-col overflow-hidden'
    : isOverview
      ? 'flex flex-1 scroll-smooth flex-col overflow-y-auto bg-sand-200 dark:bg-sand-950'
      : 'flex flex-1 scroll-smooth flex-col overflow-y-auto'

  const style = isTemplate
    ? { backgroundColor: tokens.color.surface.base }
    : isOverview
      ? { scrollbarGutter: 'stable' }
      : { backgroundColor: tokens.color.surface.base, scrollbarGutter: 'stable' }

  return (
    <div className={className} style={style}>
      <IdeationTopBar />
      {children}
    </div>
  )
}
