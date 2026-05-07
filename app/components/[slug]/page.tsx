import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { COMPONENTS, type ComponentEntry, type ComponentMeta } from '../../lib/component-registry'
import ComponentPageView from './ComponentPageView'
import { HighlightedCode } from '../../components/HighlightedCode'
import { GITHUB_URL, SITE_URL } from '../../lib/config'

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }))
}

const DESCRIPTOR_PREFIXES: Record<string, string> = {
  Backgrounds: 'Animated Background',
  Glass: 'Glassmorphism',
  Cards: 'Animated Card',
  Buttons: 'Animated Button',
  Navigation: 'Animated Navigation',
  Inputs: 'Animated Input',
  Toggles: 'Animated Toggle',
  Text: 'Animated Text',
  Overlays: 'Animated Overlay',
  Lists: 'Animated List',
}

function firstSentenceOf(description: string): string {
  const match = description.match(/^(.+?[.!?])\s|$/)
  const first = (match && match[1]) || description
  return first.trim()
}

function computeTitle(entry: ComponentEntry): string {
  const accentTag = entry.tags.find((t) => t.accent)
  const category = accentTag?.label ?? ''
  const descriptor = DESCRIPTOR_PREFIXES[category] ?? 'Animated'
  return `${entry.name} — ${descriptor} React Component`
}

function computeMetaDescription(entry: ComponentEntry): string {
  const max = 150
  const base = entry.description.length > max
    ? entry.description.slice(0, max).replace(/\s+\S*$/, '').trim() + '…'
    : entry.description
  return `${base} | Install via shadcn CLI. Free and open source.`
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
  const title = computeTitle(entry)
  const description = computeMetaDescription(entry)
  const url = `${SITE_URL}/components/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      `${entry.name.toLowerCase()} react`,
      `${entry.name.toLowerCase()} framer motion`,
      `${entry.name.toLowerCase()} component`,
      `${category.toLowerCase()} react component`,
      'animated react component',
      'react component AI prompt',
      'shadcn registry',
      'copy paste react component',
      'framer motion tailwind',
    ],
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      ...(entry.image
        ? {
            images: [
              {
                url: entry.image,
                alt: `${entry.name} — ${firstSentenceOf(entry.description)}`,
              },
            ],
          }
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

  const url = `${SITE_URL}/components/${slug}`
  const firstSentence = firstSentenceOf(entry.description)
  const headingSubtitle = firstSentence

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: entry.name,
    description: entry.description,
    codeRepository: GITHUB_URL,
    programmingLanguage: 'TypeScript',
    runtimePlatform: 'React',
    license: 'https://opensource.org/licenses/MIT',
    url,
    ...(entry.image ? { image: entry.image } : {}),
    author: {
      '@type': 'Organization',
      name: 'AI Canvas',
      url: SITE_URL,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Components', item: `${SITE_URL}/components` },
      { '@type': 'ListItem', position: 3, name: entry.name, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ComponentPageView
        slug={slug}
        name={entry.name}
        description={entry.description}
        headingSubtitle={headingSubtitle}
        tags={entry.tags}
        code={entry.code}
        prompts={entry.prompts}
        dualTheme={entry.dualTheme ?? false}
        designSystem={entry.designSystem}
        related={related}
        highlightedCode={<HighlightedCode code={entry.code} />}
      >
        <PreviewComponent />
      </ComponentPageView>
    </>
  )
}
