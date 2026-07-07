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
  const title = `${entry.name} · Andromeda Design System`
  return {
    title,
    description: entry.description,
    alternates: { canonical: `/design-systems/andromeda/${entry.slug}` },
    // Per-component screenshot as the social image (previously these pages
    // inherited the generic site-wide OG image).
    ...(entry.image
      ? {
          openGraph: {
            title,
            description: entry.description,
            images: [
              {
                url: entry.image,
                alt: `${entry.name} — Andromeda design system component`,
              },
            ],
          },
          twitter: {
            card: 'summary_large_image' as const,
            title,
            description: entry.description,
            images: [entry.image],
          },
        }
      : {}),
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

  // Account-gated install: when on, a signed-out visitor of this FREE
  // design-system component sees a "create a free account to install" CTA
  // instead of the runnable command. Reading the source (Code tab) stays
  // public either way. Threaded to the client so the install CTAs swap.
  const freeAccountGate = process.env.FREE_ACCOUNT_GATE === 'on'

  // Source is NOT shipped in this page's HTML — the Code tab fetches it on
  // demand from the gated /api/component-code endpoint, so access is decided
  // per user, never by a build-time flag.
  return (
    <AndromedaComponentView
      slug={entry.slug}
      name={entry.name}
      description={entry.description}
      related={related}
      freeAccountGate={freeAccountGate}
    />
  )
}
