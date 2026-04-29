/**
 * Generate shadcn-compatible registry JSON files from component source files.
 * Outputs to public/r/ — each component gets its own JSON file.
 *
 * Usage: node scripts/generate-registry.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'

const wsDir = 'components-workspace'
const outDir = 'public/r'
const SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json'
const REGISTRY_SCHEMA = 'https://ui.shadcn.com/schema/registry.json'

// Folders to skip when building the public registry. `_template` is the
// scaffold copy-source; `crumple-toss` is parked at /preview/crumple-toss
// and is intentionally not publicly installable.
const SKIP_FOLDERS = new Set(['_template', 'crumple-toss'])

// ── Extract metadata from the component registry ──────────────────────────────

function parseRegistryMetadata() {
  const content = readFileSync('app/lib/component-registry.tsx', 'utf-8')
  const metadata = {}

  // Match each entry block in COMPONENTS_RAW
  const entryRegex = /\{\s*slug:\s*'([^']+)',[\s\S]*?code:\s*componentCodes\['([^']+)'\]/g
  let match
  while ((match = entryRegex.exec(content)) !== null) {
    const slug = match[1]
    const folder = match[2]
    const block = match[0]

    const nameMatch = block.match(/name:\s*(['"])((?:(?!\1).)*)\1/)
    const descMatch = block.match(/description:\s*(['"])((?:(?!\1).)*)\1/)
    const imageMatch = block.match(/image:\s*(['"])((?:(?!\1).)*)\1/)
    const badgeMatch = block.match(/badge:\s*(['"])((?:(?!\1).)*)\1/)
    const dualThemeMatch = block.match(/dualTheme:\s*true/)

    // Tags are a JSX-ish array of objects: tags: [ { label: 'X', accent: true }, ... ]
    // Capture every {...} entry inside the array.
    const tags = []
    const tagsBlockMatch = block.match(/tags:\s*\[([\s\S]*?)\]/)
    if (tagsBlockMatch) {
      const tagEntryRegex = /\{[^}]*label:\s*(['"])((?:(?!\1).)*)\1[^}]*\}/g
      let tm
      while ((tm = tagEntryRegex.exec(tagsBlockMatch[1])) !== null) {
        const label = tm[2]
        const accent = /accent:\s*true/.test(tm[0])
        tags.push({ label, accent })
      }
    }

    metadata[folder] = {
      slug,
      name: nameMatch ? nameMatch[2] : folder.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: descMatch ? descMatch[2].replace(/\\'/g, "'") : '',
      image: imageMatch ? imageMatch[2] : '',
      badge: badgeMatch ? badgeMatch[2] : undefined,
      dualTheme: !!dualThemeMatch,
      tags,
    }
  }

  return metadata
}

// ── Extract dependencies from source file ─────────────────────────────────────

function getDeps(content) {
  const match = content.match(/^\/\/ npm install (.+)$/m)
  if (!match) return []
  return match[1].split(' ').filter(Boolean)
}

// ── Convert folder name to readable title ─────────────────────────────────────

function toTitle(folder) {
  return folder
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ── Main ──────────────────────────────────────────────────────────────────────

mkdirSync(outDir, { recursive: true })

const metadata = parseRegistryMetadata()

// Build the set of expected output filenames (slug-based) so we can
// delete any stale folder-named files left over from previous runs.
const expectedNames = new Set(
  readdirSync(wsDir)
    .filter(d => statSync(join(wsDir, d)).isDirectory() && !SKIP_FOLDERS.has(d))
    .map(d => (metadata[d]?.slug ?? d))
)
expectedNames.add('registry') // keep the root index
for (const existing of readdirSync(outDir).filter(f => f.endsWith('.json'))) {
  const stem = existing.replace(/\.json$/, '')
  if (!expectedNames.has(stem)) {
    unlinkSync(join(outDir, existing))
  }
}

const dirs = readdirSync(wsDir).filter(d => {
  const p = join(wsDir, d)
  return statSync(p).isDirectory() && !SKIP_FOLDERS.has(d)
}).sort()

const registryItems = []
let count = 0

for (const dir of dirs) {
  const file = join(wsDir, dir, 'index.tsx')
  let content
  try { content = readFileSync(file, 'utf-8') } catch { continue }

  const meta = metadata[dir] || {}
  // Use the registry slug as the output name — if slug differs from folder (e.g.
  // traveldeck → floating-cards) the JSON file must be named after the slug so the
  // CLI URL on the component page resolves correctly.
  const name = meta.slug || dir
  const title = meta.name || toTitle(dir)
  const description = meta.description || ''
  const deps = getDeps(content)

  // Make copy-paste ready: h-full → min-h-screen so it fills the viewport standalone
  const copyPasteReady = content.replace(/\bh-full\b/g, 'min-h-screen')

  // Build the registry item JSON
  const item = {
    $schema: SCHEMA,
    name,
    type: 'registry:ui',
    title,
    description,
    author: 'aicanvas <https://aicanvas.me>',
    dependencies: deps,
    files: [
      {
        path: `components/aicanvas/${name}.tsx`,
        content: copyPasteReady,
        type: 'registry:ui',
        target: `components/aicanvas/${name}.tsx`,
      },
    ],
  }

  // Write individual item JSON
  writeFileSync(join(outDir, `${name}.json`), JSON.stringify(item, null, 2) + '\n')

  // Add to index (without content for smaller file)
  registryItems.push({
    name,
    type: 'registry:ui',
    title,
    description,
    dependencies: deps,
    files: [
      {
        path: `components/aicanvas/${name}.tsx`,
        type: 'registry:ui',
        target: `components/aicanvas/${name}.tsx`,
      },
    ],
  })

  count++
}

// Write the root registry index
const registry = {
  $schema: REGISTRY_SCHEMA,
  name: 'aicanvas',
  homepage: 'https://aicanvas.me',
  items: registryItems,
}

writeFileSync(join(outDir, 'registry.json'), JSON.stringify(registry, null, 2) + '\n')

console.log(`Generated ${count} registry items in ${outDir}/`)

// ── AI Canvas MCP metadata ────────────────────────────────────────────────
// A separate JSON the MCP server fetches at runtime. Carries fields the
// shadcn registry schema doesn't (image, categories, dualTheme, badge,
// homepage URL, install command). Keeps the shadcn registry strict-clean.

const mcpComponents = []
const categoryCounts = {}

for (const dir of dirs) {
  const meta = metadata[dir]
  if (!meta) continue
  const slug = meta.slug
  const deps = (() => {
    try {
      const src = readFileSync(join(wsDir, dir, 'index.tsx'), 'utf-8')
      return getDeps(src)
    } catch { return [] }
  })()

  // Convention: tags with `accent: true` are the canonical category.
  const categories = meta.tags.filter(t => t.accent).map(t => t.label)
  const subTags = meta.tags.filter(t => !t.accent).map(t => t.label)
  for (const c of categories) categoryCounts[c] = (categoryCounts[c] ?? 0) + 1

  mcpComponents.push({
    slug,
    name: meta.name,
    description: meta.description,
    categories,
    tags: subTags,
    image: meta.image || undefined,
    badge: meta.badge,
    dualTheme: meta.dualTheme,
    dependencies: deps,
    homepageUrl: `https://aicanvas.me/components/${slug}`,
    sourceUrl: `https://aicanvas.me/r/${slug}.json`,
    installCommand: `npx shadcn@latest add @aicanvas/${slug}`,
  })
}

const mcpMeta = {
  $schema: 'https://aicanvas.me/r/aicanvas-mcp.schema.json',
  name: 'aicanvas',
  homepage: 'https://aicanvas.me',
  generatedAt: new Date().toISOString(),
  componentCount: mcpComponents.length,
  categories: Object.entries(categoryCounts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count),
  components: mcpComponents,
}

writeFileSync(join(outDir, 'aicanvas-mcp.json'), JSON.stringify(mcpMeta, null, 2) + '\n')
console.log(`Generated MCP metadata: ${mcpComponents.length} components, ${Object.keys(categoryCounts).length} categories`)
