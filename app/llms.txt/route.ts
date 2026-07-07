import { COMPONENTS } from '../lib/component-registry'
import { COLLECTIONS } from '../lib/collections'
import { SITE_URL } from '../lib/config'
import { DESIGN_SYSTEMS } from '../../scripts/lib/design-systems.config.mjs'

export const dynamic = 'force-static'

function categoryOf(tags: { label: string; accent?: boolean }[]): string {
  return tags.find((t) => t.accent)?.label ?? 'Other'
}

export function GET() {
  const total = COMPONENTS.length

  const intro = `# AI Canvas

> AI Canvas is an open-core, shadcn-compatible registry of ${total} animated React components, design systems, and templates built with Tailwind CSS and Motion. The free library is MIT, and Premium components, design systems, and templates are proprietary. Many components ship with reproduction prompts for Claude Code, Lovable, and v0, so developers can install the code directly or recreate it in any AI builder.

## Overview
- [Homepage](${SITE_URL}): Browse all components.
- [All components](${SITE_URL}/components): Full component list.
- [About](${SITE_URL}/about): About AI Canvas.
- [Registry index](${SITE_URL}/r/registry.json): Machine-readable registry index.

## Install
Install any component with: \`npx shadcn@latest add ${SITE_URL}/r/<component-name>.json\`

## MCP server
AI agents can browse and install AI Canvas components through the official MCP server, [@aicanvas/mcp on npm](https://www.npmjs.com/package/@aicanvas/mcp). Run it with \`npx -y @aicanvas/mcp\` (stdio transport). It exposes read-only tools: list_categories, list_components, search_components, get_component, get_install_command, list_systems, get_system, get_template. Setup guide: ${SITE_URL}/mcp
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

  // Design systems + their templates (slug prefix stripped for page URLs,
  // mirroring sitemap.ts).
  const systems = DESIGN_SYSTEMS.map(
    (s: {
      slug: string
      name: string
      templates?: { slug: string; name: string; domain?: string }[]
    }) => {
      const templates = (s.templates ?? []).map((t) => {
        const pageSlug = t.slug.replace(new RegExp(`^${s.slug}-`), '')
        return `  - [${t.name}](${SITE_URL}/design-systems/${s.slug}/templates/${pageSlug}): ${t.domain ?? 'Template'} template built entirely from ${s.name} components. Install: \`npx shadcn@latest add ${SITE_URL}/r/${t.slug}.json\``
      })
      return [
        `- [${s.name}](${SITE_URL}/design-systems/${s.slug}): Complete design system (tokens + components). Showcase: ${SITE_URL}/design-systems/${s.slug}/showcase. Install: \`npx shadcn@latest add ${SITE_URL}/r/${s.slug}.json\``,
        ...templates,
      ].join('\n')
    },
  ).join('\n')

  const collections = COLLECTIONS.map(
    (c) =>
      `- [${c.h1}](${SITE_URL}/components/collection/${c.slug}): ${c.description}`,
  ).join('\n')

  const body = `${intro}\n## Design systems and templates\n${systems}\n\n## Collections\n${collections}\n\n## Components\n\n${sections.join('\n\n')}\n`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
