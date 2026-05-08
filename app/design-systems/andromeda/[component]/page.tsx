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

export default async function AndromedaComponentPage({
  params,
}: {
  params: Promise<{ component: string }>
}) {
  const { component } = await params
  const entry = getAndromedaComponent(component)
  if (!entry) notFound()

  const related = ANDROMEDA_COMPONENTS.filter((c) => c.slug !== entry.slug).map(
    (c) => ({ slug: c.slug, name: c.name }),
  )

  return (
    <AndromedaComponentView
      slug={entry.slug}
      name={entry.name}
      description={entry.description}
      rawCode={entry.code}
      highlightedCode={<HighlightedCode code={entry.code} />}
      related={related}
    />
  )
}
