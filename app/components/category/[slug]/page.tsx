import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HomeClient } from '../../HomeClient'
import { COMPONENTS, toMeta } from '../../../lib/component-registry'
import { CATEGORIES, getCategoryBySlug } from '../../../lib/categories'
import { SITE_URL } from '../../../lib/config'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}

  const url = `${SITE_URL}/components/category/${category.slug}`

  return {
    title: { absolute: category.title },
    description: category.description,
    alternates: { canonical: url },
    openGraph: {
      title: category.title,
      description: category.description,
      url,
      type: 'website',
      images: [
        {
          url: '/AIcanvas-OG.png',
          width: 1200,
          height: 630,
          alt: `AI Canvas: ${category.h1}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: category.title,
      description: category.description,
      images: ['/AIcanvas-OG.png'],
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const filtered = COMPONENTS.filter((c) =>
    c.tags.some((t) => t.accent && t.label === category.label),
  )

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
        name: category.label,
        item: `${SITE_URL}/components/category/${category.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HomeClient components={filtered.map(toMeta)} categoryLabel={category.label} />
    </>
  )
}
