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

export function AndromedaContentColumn({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? ''
  const isTemplate = TEMPLATE_LEAF_RE.test(pathname)

  return (
    <div
      className={
        isTemplate
          ? 'flex flex-1 flex-col overflow-hidden'
          : 'flex flex-1 scroll-smooth flex-col overflow-y-auto'
      }
      style={
        isTemplate
          ? { backgroundColor: tokens.color.surface.base }
          : { backgroundColor: tokens.color.surface.base, scrollbarGutter: 'stable' }
      }
    >
      <IdeationTopBar />
      {children}
    </div>
  )
}
