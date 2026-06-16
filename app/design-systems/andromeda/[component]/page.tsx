import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  ANDROMEDA_COMPONENTS,
  getAndromedaComponent,
} from '../../../_lib/andromeda/andromeda-registry'
import { HighlightedCode } from '../../../components/HighlightedCode'
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

  // Design-system source is premium: when the registry gate is enforcing,
  // never ship it in this page's HTML (same rule as the standalone pages).
  // Note env vars take effect on deploy — pages re-prerender then.
  const enforcing =
    process.env.REGISTRY_ENFORCEMENT === 'enforce' &&
    process.env.NEXT_PUBLIC_PREMIUM_ENABLED === 'true'

  return (
    <AndromedaComponentView
      slug={entry.slug}
      name={entry.name}
      description={entry.description}
      rawCode={enforcing ? undefined : entry.code}
      highlightedCode={enforcing ? undefined : <HighlightedCode code={entry.code} />}
      related={related}
    />
  )
}
