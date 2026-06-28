import { notFound } from 'next/navigation'
import { COMPONENTS } from '../../lib/component-registry'
import { BackButton } from './BackButton'

// SERVER component (deliberately no 'use client'). COMPONENTS carries every
// entry's raw `code` string — including the closed-source premium ones — so it
// must stay on the server. As a client component this route bundled the entire
// registry (source and all) into a browser-downloadable JS chunk. The live
// <PreviewComponent /> is itself a client component and still hydrates fine;
// only the source strings now stay server-side. The back button lives in its
// own client child (BackButton) so its Phosphor icon — which calls
// React.createContext at module load — never evaluates in this server module.
export default async function FullScreenPreview({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
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
      <BackButton slug={slug} />
    </div>
  )
}
