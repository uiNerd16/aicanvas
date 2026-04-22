'use client'

import dynamic from 'next/dynamic'

const CrumpleToss = dynamic(
  () => import('../../../components-workspace/crumple-toss'),
  { ssr: false }
)

export default function PreviewCrumpleTossPage() {
  return (
    <div className="h-screen w-full">
      <CrumpleToss />
    </div>
  )
}
