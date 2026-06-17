'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { IdeationTopBar } from '../../_components/IdeationTopBar'
import { tokens } from '../../../design-systems/andromeda/tokens'

// Template leaf routes own the full viewport (sidebar + topbar are suppressed).
// On DESKTOP (md+) the template pins itself to 100vh and manages its own
// internal scroll, so the column stays `overflow-y: hidden` (no scrollbar
// gutter — the template fills the column edge-to-edge and the bento seams
// align). On MOBILE (below md) the template stacks into one tall column that
// exceeds the viewport; its in-shell scroll can't engage (the shell grows to
// content height), so the COLUMN becomes the scroller (`overflow-y: auto` +
// `min-h-0` so the flex child can shrink below content and actually scroll).
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
    ? 'flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto pb-28 md:overflow-y-hidden md:pb-0'
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
