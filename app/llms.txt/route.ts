import { COMPONENTS } from '../lib/component-registry'
import { SITE_URL } from '../lib/config'

export const dynamic = 'force-static'

function categoryOf(tags: { label: string; accent?: boolean }[]): string {
  return tags.find((t) => t.accent)?.label ?? 'Other'
}

export function GET() {
  const total = COMPONENTS.length

  const intro = `# AI Canvas

> AI Canvas is an open-source, shadcn-compatible registry of ${total} animated React components built with Tailwind CSS and Framer Motion. Each component ships with reproduction prompts for Claude Code, Lovable, and v0 — so developers can install the code directly or recreate it in any AI builder.

## Overview
- [Homepage](${SITE_URL}): Browse all components.
- [All components](${SITE_URL}/components): Full component list.
- [About](${SITE_URL}/about): About AI Canvas.
- [Registry index](${SITE_URL}/r/registry.json): Machine-readable registry index.

## Install
Install any component with: \`npx shadcn@latest add ${SITE_URL}/r/<component-name>.json\`
`

  const grouped = new Map<string, typeof COMPONENTS>()
  for (const c of COMPONENTS) {
    const cat = categoryOf(c.tags)
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(c)
  }

  const sections: string[] = []
  for (const [category, items] of grouped) {
    const lines = items.map(
      (c) =>
        `- [${c.name}](${SITE_URL}/components/${c.slug}): ${c.description} Install: \`npx shadcn@latest add ${SITE_URL}/r/${c.slug}.json\`. Registry: ${SITE_URL}/r/${c.slug}.json`,
    )
    sections.push(`## ${category}\n${lines.join('\n')}`)
  }

  const body = `${intro}\n## Components\n\n${sections.join('\n\n')}\n`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
