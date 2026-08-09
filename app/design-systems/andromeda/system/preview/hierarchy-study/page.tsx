// Button / Tag / Badge hierarchy study. INTERNAL, dev-only, decision aid — the
// three are rendered as-is with className overrides, and no component source is
// touched by anything on this page.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HierarchyStudy } from './HierarchyStudy'

const DEV_ONLY = process.env.NODE_ENV !== 'production'

export const metadata: Metadata = {
  title: 'Hierarchy study (internal)',
  robots: { index: false, follow: false },
}

export default function HierarchyStudyPage() {
  if (!DEV_ONLY) notFound()
  return <HierarchyStudy />
}
