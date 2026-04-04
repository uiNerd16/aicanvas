import { notFound } from 'next/navigation'
import { COMPONENTS } from '../../lib/component-registry'
import ComponentPageView from './ComponentPageView'

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = COMPONENTS.find((c) => c.slug === slug)
  if (!entry) notFound()

  const { PreviewComponent } = entry

  return (
    <ComponentPageView
      slug={slug}
      name={entry.name}
      description={entry.description}
      tags={entry.tags}
      code={entry.code}
      prompts={entry.prompts}
      dualTheme={entry.dualTheme ?? false}
    >
      <PreviewComponent />
    </ComponentPageView>
  )
}
