import { notFound } from 'next/navigation'
import { COMPONENTS, type ComponentMeta } from '../../lib/component-registry'
import ComponentPageView from './ComponentPageView'

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }))
}

// Strip a full ComponentEntry down to a serializable ComponentMeta so it
// can be passed across the server → client boundary (PreviewComponent and
// code/prompts are not serializable).
function toMeta(c: (typeof COMPONENTS)[number]): ComponentMeta {
  return {
    slug: c.slug,
    name: c.name,
    description: c.description,
    tags: c.tags,
    image: c.image,
  }
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

  // ── Related ──────────────────────────────────────────────────────────────
  // Pass the full pool of accent-tag siblings; the client paginates 3 at a
  // time via the inline arrow controls.
  const accentLabels = entry.tags
    .filter((t) => t.accent)
    .map((t) => t.label)
  const related = COMPONENTS.filter(
    (c) =>
      c.slug !== slug &&
      c.tags.some((t) => t.accent && accentLabels.includes(t.label)),
  ).map(toMeta)

  return (
    <ComponentPageView
      slug={slug}
      name={entry.name}
      description={entry.description}
      tags={entry.tags}
      code={entry.code}
      prompts={entry.prompts}
      dualTheme={entry.dualTheme ?? false}
      related={related}
    >
      <PreviewComponent />
    </ComponentPageView>
  )
}
