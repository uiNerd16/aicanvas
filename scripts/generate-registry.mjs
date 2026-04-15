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

    const nameMatch = block.match(/name:\s*'([^']+)'/)
    const descMatch = block.match(/description:\s*'([^']*(?:\\'[^']*)*)'/)

    metadata[folder] = {
      slug,
      name: nameMatch ? nameMatch[1] : folder.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: descMatch ? descMatch[1].replace(/\\'/g, "'") : '',
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
    .filter(d => statSync(join(wsDir, d)).isDirectory() && d !== '_template')
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
  return statSync(p).isDirectory() && d !== '_template'
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
