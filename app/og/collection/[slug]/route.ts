// Dynamic social card for /components/collection/<slug> pages (collections
// have no single screenshot, so every collection uses the generated card).

import { COMPONENT_META } from '../../../lib/component-meta.generated'
import {
  collectionMembers,
  getCollectionBySlug,
} from '../../../lib/collections'
import { ogCard } from '../../_lib/card'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const collection = getCollectionBySlug(slug)
  if (!collection) return new Response('Not found', { status: 404 })

  const count = collectionMembers(collection, COMPONENT_META).length

  return ogCard({
    kicker: 'Collection',
    title: collection.h1,
    meta: `${count} components  ·  React  ·  Tailwind CSS`,
    badge: 'Free',
  })
}
