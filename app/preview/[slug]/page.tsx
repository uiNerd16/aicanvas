'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react'
import { COMPONENTS } from '../../lib/component-registry'

export default function FullScreenPreview({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const entry = COMPONENTS.find((c) => c.slug === slug)
  if (!entry) notFound()

  const { PreviewComponent } = entry

  return (
    <div
      data-card-theme="dark"
      className="dark fixed inset-0 z-50 bg-sand-950"
      style={{ contain: 'strict' }}
    >
      <PreviewComponent />

      {/* Back button — always above component content regardless of stacking contexts */}
      <Link
        href={`/components/${slug}`}
        className="absolute top-4 left-4 z-[100] flex items-center gap-1.5 rounded-lg border border-sand-700 bg-sand-900/80 px-3 py-1.5 text-xs font-semibold text-sand-400 backdrop-blur-sm transition-colors hover:border-sand-600 hover:text-sand-200"
      >
        <ArrowLeft weight="regular" size={13} />
        Back
      </Link>
    </div>
  )
}
