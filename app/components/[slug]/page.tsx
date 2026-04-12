import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { COMPONENTS, type ComponentMeta } from '../../lib/component-registry'
import ComponentPageView from './ComponentPageView'
import { HighlightedCode } from '../../components/HighlightedCode'

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = COMPONENTS.find((c) => c.slug === slug)
  if (!entry) return {}

  const accentTag = entry.tags.find((t) => t.accent)
  const category = accentTag?.label ?? 'Component'
  const title = `${entry.name} — Animated React Component`
  const description = `${entry.description} Free copy-paste React code with AI prompts for Claude, GPT, V0, and Gemini.`

  return {
    title,
    description,
    keywords: [
      `${entry.name.toLowerCase()} react`,
      `${entry.name.toLowerCase()} framer motion`,
      `${entry.name.toLowerCase()} component`,
      `${category.toLowerCase()} react component`,
      'animated react component',
      'react component AI prompt',
      'copy paste react component',
      'framer motion tailwind',
    ],
    openGraph: {
      title,
      description,
      url: `https://aicanvas.me/components/${slug}`,
      type: 'website',
      ...(entry.image
        ? { images: [{ url: entry.image, alt: entry.name }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(entry.image ? { images: [entry.image] } : {}),
    },
  }
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
      highlightedCode={<HighlightedCode code={entry.code} />}
    >
      <PreviewComponent />
    </ComponentPageView>
  )
}
