import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { COMPONENTS, type ComponentEntry, type ComponentMeta } from '../../lib/component-registry'
import ComponentPageView from './ComponentPageView'
import { HighlightedCode } from '../../components/HighlightedCode'
import { GITHUB_URL, SITE_URL } from '../../lib/config'
import { classifyContent } from '@/lib/registry/content-type'
import { loadContentLookup } from '@/lib/registry/lookup'

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

function computeMetaDescription(entry: ComponentEntry, isPremium: boolean): string {
  const max = 150
  const base = entry.description.length > max
    ? entry.description.slice(0, max).replace(/\s+\S*$/, '').trim() + '…'
    : entry.description
  // Free content keeps the open-source tail; premium content must never claim
  // MIT / open source, so it gets a premium-accurate tail instead.
  const tail = isPremium
    ? 'Install via shadcn CLI. Premium AI Canvas component.'
    : 'Install via shadcn CLI. Free and open source.'
  return `${base} | ${tail}`
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
  // Mirror the page-level isPremium classification so the meta never claims
  // "Free and open source" on premium (closed-source) content. A degraded
  // lookup fails closed (treated as premium) so we never overclaim.
  const lookup = loadContentLookup()
  const contentType = classifyContent(slug, lookup)
  const isPremium =
    lookup.degraded === true ||
    contentType === 'premium-standalone' ||
    contentType === 'design-system' ||
    contentType === 'template'
  const title = computeTitle(entry)
  const description = computeMetaDescription(entry, isPremium)
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

  // When the registry gate is enforcing (launch), source must NOT ship in the
  // page HTML — otherwise anyone reads it without a metered pull. The Code tab
  // then fetches it on demand from the gated endpoint. Until enforcement flips
  // on, source stays server-rendered (preserves SEO / GEO indexing).
  const enforcing = process.env.REGISTRY_ENFORCEMENT === 'enforce'

  // Account-gated install: when on, anonymous installs of FREE components are
  // walled behind a free account (the /r route returns a "create a free
  // account" placeholder). Reading the source stays public — only the
  // one-command install needs an account. Threaded to the client so the
  // install CTAs swap to a "create a free account" prompt for signed-out
  // visitors of free components.
  const freeAccountGate = process.env.FREE_ACCOUNT_GATE === 'on'

  // Premium content (closed source) must NEVER appear in the server-rendered
  // page payload — not the source, not the highlighted HTML, not the prompts —
  // REGARDLESS of REGISTRY_ENFORCEMENT (the default is permissive). Classify
  // server-side and withhold for premium; free content keeps today's behaviour
  // (source ships in permissive mode for SEO). A degraded lookup (missing
  // manifest) withholds for everything, to fail closed rather than risk a leak.
  const lookup = loadContentLookup()
  const contentType = classifyContent(slug, lookup)
  const isPremium =
    lookup.degraded === true ||
    contentType === 'premium-standalone' ||
    contentType === 'design-system' ||
    contentType === 'template'
  const withholdSource = isPremium || enforcing

  // Extract only the install-directive comment lines so the deps/font install
  // UI works even when the full source is withheld in enforcing mode.
  const codeDirectives = [
    entry.code.match(/^\/\/ font: .+$/m)?.[0],
    entry.code.match(/^\/\/ font-pkg: .+$/m)?.[0],
    entry.code.match(/^\/\/ npm install .+$/m)?.[0],
  ].filter(Boolean).join('\n')

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
    // Premium components are NOT MIT and NOT in the public repo — never claim so.
    ...(isPremium ? {} : { codeRepository: GITHUB_URL }),
    programmingLanguage: 'TypeScript',
    runtimePlatform: 'React',
    ...(isPremium ? {} : { license: 'https://opensource.org/licenses/MIT' }),
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
        code={withholdSource ? undefined : entry.code}
        // Prompts (Remix with AI) ship for ALL components — Remix is free, only the
        // exact source (Code tab / CLI / MCP) is gated. A premium component enables
        // its Remix drawer simply by having a prompts.ts in the private vault.
        prompts={entry.prompts}
        dualTheme={entry.dualTheme ?? false}
        designSystem={entry.designSystem}
        premium={contentType === 'premium-standalone'}
        related={related}
        highlightedCode={withholdSource ? undefined : <HighlightedCode code={entry.code} />}
        enforcing={enforcing || isPremium}
        freeAccountGate={freeAccountGate}
        codeDirectives={codeDirectives}
        useCases={entry.useCases}
        about={entry.about}
      >
        <PreviewComponent />
      </ComponentPageView>
    </>
  )
}
