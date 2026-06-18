import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ANDROMEDA_COMPONENTS,
  getAndromedaComponent,
} from '../../../_lib/andromeda/andromeda-registry'
import { AndromedaComponentView } from './AndromedaComponentView'

export function generateStaticParams() {
  return ANDROMEDA_COMPONENTS.map((c) => ({ component: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ component: string }>
}): Promise<Metadata> {
  const { component } = await params
  const entry = getAndromedaComponent(component)
  if (!entry) return {}
  return {
    title: `${entry.name} · Andromeda Design System`,
    description: entry.description,
    alternates: { canonical: `/design-systems/andromeda/${entry.slug}` },
  }
}

export default async function AndromedaComponentPage({
  params,
}: {
  params: Promise<{ component: string }>
}) {
  const { component } = await params
  const entry = getAndromedaComponent(component)
  if (!entry) notFound()

  const related = ANDROMEDA_COMPONENTS.filter((c) => c.slug !== entry.slug).map(
    (c) => ({ slug: c.slug, name: c.name, image: c.image }),
  )

  // Source is NOT shipped in this page's HTML — the Code tab fetches it on
  // demand from the gated /api/component-code endpoint, so access is decided
  // (and metered) per user, never by a build-time flag.
  return (
    <AndromedaComponentView
      slug={entry.slug}
      name={entry.name}
      description={entry.description}
      related={related}
    />
  )
}
