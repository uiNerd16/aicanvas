import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HomeClient } from '../../HomeClient'
// Registry-free metadata so collection pages never bundle the heavy registry.
import { COMPONENT_META } from '../../../lib/component-meta.generated'
import {
  COLLECTIONS,
  collectionMembers,
  getCollectionBySlug,
} from '../../../lib/collections'
import { SITE_URL } from '../../../lib/config'

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const collection = getCollectionBySlug(slug)
  if (!collection) return {}

  const url = `${SITE_URL}/components/collection/${collection.slug}`
  const ogImage = `${SITE_URL}/og/collection/${collection.slug}`

  return {
    title: { absolute: collection.title },
    description: collection.description,
    alternates: { canonical: url },
    openGraph: {
      title: collection.title,
      description: collection.description,
      url,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `AI Canvas: ${collection.h1}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: collection.title,
      description: collection.description,
      images: [ogImage],
    },
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const collection = getCollectionBySlug(slug)
  if (!collection) notFound()

  const members = collectionMembers(collection, COMPONENT_META)
  // A collection below 3 members would ship a skeleton page; 404 instead.
  if (members.length < 3) notFound()

  const url = `${SITE_URL}/components/collection/${collection.slug}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Components',
        item: `${SITE_URL}/components`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: collection.h1,
        item: url,
      },
    ],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: collection.h1,
    description: collection.description,
    numberOfItems: members.length,
    itemListElement: members.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.name,
      url: `${SITE_URL}/components/${m.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <HomeClient
        components={members}
        categoryLabel={collection.h1}
        heading={{ h1: collection.h1, intro: collection.intro }}
      />
    </>
  )
}
