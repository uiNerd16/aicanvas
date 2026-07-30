import { COMPONENTS } from '../lib/component-registry'
import { SITE_URL } from '../lib/config'

export const dynamic = 'force-static'

function categoryOf(tags: { label: string; accent?: boolean }[]): string {
  return tags.find((t) => t.accent)?.label ?? 'Other'
}

export function GET() {
  const total = COMPONENTS.length

  const intro = `# AI Canvas

> AI Canvas is an open-core, shadcn-compatible registry of ${total} animated React components, design systems, and templates built with Tailwind CSS and Motion. The free library is MIT, and Premium components, design systems, and templates are proprietary. Many components ship with a comprehensive AI remix prompt, so developers can install the code directly or recreate their own variation in any AI builder. On free components that prompt is public in full; on premium components and blocks only part of it is public (the setup and the constants), and the rest of the build spec requires a Premium subscription.

## Overview
- [Homepage](${SITE_URL}): Browse all components.
- [All components](${SITE_URL}/components): Full component list.
- [About](${SITE_URL}/about): About AI Canvas.
- [Registry index](${SITE_URL}/r/registry.json): Machine-readable registry index.

## Install
Install command: \`npx shadcn@latest add @aicanvas/<component-name>\`. One-command installs require a free AI Canvas account: signed out, the command exits 0 but writes a placeholder file titled "(free account required)" instead of the real component. To authenticate, sign in and copy your token from ${SITE_URL}/account/settings, set AICANVAS_TOKEN in .env.local, and add \`{ "registries": { "@aicanvas": { "url": "${SITE_URL}/r/{name}.json", "params": { "token": "\${AICANVAS_TOKEN}" } } } }\` to components.json. Full setup notes: ${SITE_URL}/llms.txt

No account needed to read: every free component's complete source is inlined below and can be copied into a project directly.
`

  const parts: string[] = [intro, '## Components']

  for (const c of COMPONENTS) {
    const category = categoryOf(c.tags)
    const installLabel =
      c.badge === 'Premium'
        ? 'Install (Premium, requires an AI Canvas token):'
        : 'Install (free account):'
    const head = `---\n\n## ${c.name}\n\nCategory: ${category}\nSlug: \`${c.slug}\`\nURL: ${SITE_URL}/components/${c.slug}\n\n${c.description}\n\n${installLabel}\n\n\`\`\`bash\nnpx shadcn@latest add @aicanvas/${c.slug}\n\`\`\``
    // Premium (closed-source) components carry badge:'Premium' (set by the inject
    // shim). This route is PUBLIC + un-authenticated, so it must NEVER emit their
    // source — list them for discovery, but withhold the bytes (the /r gate is the
    // only place premium source is served, and only to a premium token). Free
    // components keep their full source here, unchanged.
    parts.push(
      c.badge === 'Premium'
        ? `${head}\n\n_Premium component — source is gated. Preview, details, and install at ${SITE_URL}/components/${c.slug}._`
        : `${head}\n\n\`\`\`tsx\n${c.code}\n\`\`\``,
    )
  }

  const body = parts.join('\n\n') + '\n'

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
