// Shared JSON-LD builders for the listing pages (category + collection).
// Both pages render the same grid of components, so they describe themselves
// the same way; keeping one builder stops the two copies drifting apart.

import { SITE_URL } from './config'

/**
 * ItemList for a page that lists components and links out to their own pages.
 * This is Google's "summary page" form: each ListItem carries `position` and
 * `url`. (BreadcrumbList uses `item` instead — different type, different
 * documented convention. Both are correct.)
 *
 * `description` must be the text a visitor actually SEES on the page (the
 * intro under the H1), not the `<meta name="description">` string. Structured
 * data is supposed to describe visible content.
 */
export function buildItemListJsonLd({
  name,
  description,
  items,
}: {
  name: string
  description: string
  items: readonly { name: string; slug: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/components/${c.slug}`,
    })),
  }
}
