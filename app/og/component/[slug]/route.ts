// Dynamic social card for component pages that have no screenshot yet.
// Components WITH a screenshot keep it as their OG image (a real preview
// beats a generated card); generateMetadata in /components/[slug] points
// here only when `entry.image` is absent.

import { COMPONENT_META } from '../../../lib/component-meta.generated'
import { ogCard } from '../../_lib/card'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const entry = COMPONENT_META.find((c) => c.slug === slug)
  if (!entry) return new Response('Not found', { status: 404 })

  const category = entry.tags.find((t) => t.accent)?.label ?? 'Component'
  const stacks = entry.tags.filter((t) => !t.accent).map((t) => t.label)

  return ogCard({
    kicker: category,
    title: entry.name,
    meta: ['React', 'TypeScript', ...stacks].join('  ·  '),
    badge: entry.badge === 'Premium' ? 'Premium' : 'Free',
  })
}
