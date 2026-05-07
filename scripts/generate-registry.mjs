/**
 * Generate shadcn-compatible registry JSON files from component source files.
 * Outputs to public/r/ — each component gets its own JSON file.
 *
 * Usage: node scripts/generate-registry.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, unlinkSync, existsSync } from 'fs'
import { join, dirname, resolve, relative, sep, posix } from 'path'
import { execSync } from 'child_process'
import { transformRootHeightClass } from './lib/copy-paste-transform.mjs'
import { DESIGN_SYSTEMS } from './lib/design-systems.config.mjs'

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

// ── Design-system dependency walker ───────────────────────────────────────────
// Used by `block` and `system` registry items to bundle every relative-imported
// file inside the system's `rootDir`. External imports (npm packages) become
// the item's `dependencies[]`.

const RESOLVE_EXTENSIONS = ['.ts', '.tsx', '.js', '.mjs', '.json']

// Built into any React/Next user project — never listed as installable deps.
function isProjectBuiltin(pkg) {
  if (pkg === 'react' || pkg === 'react-dom') return true
  if (pkg === 'next' || pkg.startsWith('next/')) return true
  return false
}

function toPackageName(spec) {
  // '@scope/pkg/sub' → '@scope/pkg'; 'pkg/sub' → 'pkg'
  if (spec.startsWith('@')) {
    const parts = spec.split('/')
    return parts.slice(0, 2).join('/')
  }
  return spec.split('/')[0]
}

// Match every quoted specifier reachable via `from '...'` (covers all variants
// of `import` / `import type` / `export ... from`) plus bare side-effect
// `import '...'` lines. The `from` keyword is unambiguous in JS/TS source so
// false positives in code strings are extremely rare.
function extractImportSpecifiers(content) {
  const specs = []
  const fromRe = /\bfrom\s+['"]([^'"]+)['"]/g
  let m
  while ((m = fromRe.exec(content)) !== null) specs.push(m[1])
  const sideRe = /^\s*import\s+['"]([^'"]+)['"]/gm
  while ((m = sideRe.exec(content)) !== null) specs.push(m[1])
  return specs
}

function resolveImport(fromFile, spec) {
  const baseDir = dirname(fromFile)
  const candidate = resolve(baseDir, spec)
  const tryPaths = [
    candidate,
    ...RESOLVE_EXTENSIONS.map((ext) => candidate + ext),
    ...RESOLVE_EXTENSIONS.map((ext) => join(candidate, 'index' + ext)),
  ]
  for (const p of tryPaths) {
    try { if (statSync(p).isFile()) return p } catch {}
  }
  return null
}

/**
 * Walk transitive relative imports starting from `entries`. Returns the closed
 * set of files this item ships, plus the set of external npm packages.
 *
 * `excludedFiles` lists absolute paths of files that another registry item
 * already ships (declared via `registryDependencies`). The walker treats them
 * as boundaries — it sees the import edge but does not ship the file or
 * recurse into it. Use this to keep tokens out of the system bundle, or
 * components out of block bundles.
 *
 * @param {string[]} entries        Absolute paths to entry files
 * @param {string}   rootDirAbs     Absolute path to the system's root directory
 * @param {Set<string>} [excludedFiles=new Set()]  Files already shipped by deps
 * @returns {{ files: string[], npmDeps: string[] }}
 */
function walkDependencies(entries, rootDirAbs, excludedFiles = new Set()) {
  const shipped = new Set()
  const queue = entries.filter((f) => !excludedFiles.has(f))
  const npmDeps = new Set()

  while (queue.length > 0) {
    const file = queue.shift()
    if (shipped.has(file)) continue
    shipped.add(file)

    let content
    try { content = readFileSync(file, 'utf-8') } catch {
      throw new Error(`walkDependencies: cannot read ${file}`)
    }

    for (const spec of extractImportSpecifiers(content)) {
      if (spec.startsWith('.') || spec.startsWith('/')) {
        const resolved = resolveImport(file, spec)
        if (!resolved) continue   // missing relative target — likely an asset/types path; skip silently
        const rel = relative(rootDirAbs, resolved)
        if (rel.startsWith('..') || rel === '' || rel.startsWith(sep)) {
          throw new Error(
            `walkDependencies: import escapes system root\n` +
            `  ${file}\n  imports "${spec}"\n  → ${resolved}\n  rootDir: ${rootDirAbs}\n` +
            `Design-system items must be self-contained.`,
          )
        }
        // Boundary: file is provided by a registry dep — record the edge and stop.
        if (excludedFiles.has(resolved)) continue
        queue.push(resolved)
      } else {
        const pkg = toPackageName(spec)
        if (!isProjectBuiltin(pkg)) npmDeps.add(pkg)
      }
    }
  }

  return {
    files: [...shipped].sort(),
    npmDeps: [...npmDeps].sort(),
  }
}

// Convert an absolute file path inside the system's rootDir into the registry
// `path` / `target` (POSIX, forward slashes). Layout under rootDir is preserved
// verbatim so internal relative imports continue to resolve in the user's project.
function targetPathFor(fileAbs, rootDirAbs, systemSlug) {
  const rel = relative(rootDirAbs, fileAbs).split(sep).join(posix.sep)
  return `components/aicanvas/${systemSlug}/${rel}`
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
expectedNames.add('aicanvas-mcp') // MCP metadata file
// Reserve filenames for design systems (tokens + system + blocks) so they
// survive the stale-file cleanup pass.
for (const ds of DESIGN_SYSTEMS) {
  expectedNames.add(`${ds.slug}-tokens`)
  expectedNames.add(ds.slug)
  for (const block of ds.blocks) expectedNames.add(block.slug)
}
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

  // Make copy-paste ready: h-full → min-h-screen on the ROOT element only
  // (see scripts/lib/copy-paste-transform.mjs for why root-only)
  const copyPasteReady = transformRootHeightClass(content)

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

// ── Design systems & blocks ───────────────────────────────────────────────────
// Three-layer registry items connected by `registryDependencies` so files are
// installed exactly once regardless of which entry the user picks:
//
//   <slug>-tokens   (registry:lib)    — tokens.ts + utils + system icons
//   <slug>          (registry:style)  — every component file; deps on tokens
//   <slug>-<block>  (registry:block)  — only the example folder; deps on system
//
// Internal relative imports stay intact because every layer writes into the
// same `components/aicanvas/<slug>/` tree, preserving the source layout.

let dsCount = 0

function makeFile(fileAbs, rootDirAbs, slug) {
  return {
    path: targetPathFor(fileAbs, rootDirAbs, slug),
    content: readFileSync(fileAbs, 'utf-8'),
    type: 'registry:lib',
    target: targetPathFor(fileAbs, rootDirAbs, slug),
  }
}

function indexEntry(item, files) {
  return {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files: files.map(({ path, type, target }) => ({ path, type, target })),
  }
}

for (const ds of DESIGN_SYSTEMS) {
  const rootDirAbs = resolve(ds.rootDir)
  const tokenEntriesAbs = (ds.tokenEntries ?? []).map((p) => resolve(rootDirAbs, p))
  const systemEntriesAbs = ds.systemEntries.map((p) => resolve(rootDirAbs, p))

  // ── 1. Tokens ────────────────────────────────────────────────────────────────
  const tokensSlug = `${ds.slug}-tokens`
  const tokensWalk = walkDependencies(tokenEntriesAbs, rootDirAbs)
  const tokensFiles = tokensWalk.files.map((f) => makeFile(f, rootDirAbs, ds.slug))
  const tokensItem = {
    $schema: SCHEMA,
    name: tokensSlug,
    type: 'registry:lib',
    title: `${ds.name} tokens`,
    description: `Foundation files for the ${ds.name} design system — tokens, shared utilities, and the system mark. Required by every ${ds.name} component and block.`,
    author: 'aicanvas <https://aicanvas.me>',
    dependencies: tokensWalk.npmDeps,
    files: tokensFiles,
  }
  writeFileSync(join(outDir, `${tokensSlug}.json`), JSON.stringify(tokensItem, null, 2) + '\n')
  registryItems.push(indexEntry(tokensItem, tokensFiles))
  dsCount++

  const tokensFileSet = new Set(tokensWalk.files)

  // ── 2. System (components) ───────────────────────────────────────────────────
  // Excludes anything shipped by the tokens item; depends on it via registry deps.
  const systemWalk = walkDependencies(systemEntriesAbs, rootDirAbs, tokensFileSet)
  const systemFiles = systemWalk.files.map((f) => makeFile(f, rootDirAbs, ds.slug))
  const systemItem = {
    $schema: SCHEMA,
    name: ds.slug,
    type: 'registry:style',
    title: `${ds.name} design system`,
    description: `Every ${ds.name} component (${systemFiles.length} files). Installs the foundation tokens automatically.`,
    author: 'aicanvas <https://aicanvas.me>',
    registryDependencies: [tokensSlug],
    dependencies: systemWalk.npmDeps,
    files: systemFiles,
  }
  writeFileSync(join(outDir, `${ds.slug}.json`), JSON.stringify(systemItem, null, 2) + '\n')
  registryItems.push(indexEntry(systemItem, systemFiles))
  dsCount++

  const systemFileSet = new Set(systemWalk.files)
  const dsBoundary = new Set([...tokensFileSet, ...systemFileSet])

  // ── 3. Blocks (compositions) ─────────────────────────────────────────────────
  // Each block ships only its example folder. Components and tokens come from
  // the system + tokens registry items via `registryDependencies`.
  for (const block of ds.blocks) {
    const blockEntryAbs = resolve(rootDirAbs, block.entryPath)
    const blockWalk = walkDependencies([blockEntryAbs], rootDirAbs, dsBoundary)
    const blockFiles = blockWalk.files.map((f) => makeFile(f, rootDirAbs, ds.slug))
    const blockItem = {
      $schema: SCHEMA,
      name: block.slug,
      type: 'registry:block',
      title: `${block.name} (${ds.name})`,
      description: `${block.name} composition from ${ds.name}${block.domain ? ` — ${block.domain.toLowerCase()} dashboard` : ''}. Pulls in the full ${ds.name} system on first install; subsequent block installs reuse it.`,
      author: 'aicanvas <https://aicanvas.me>',
      registryDependencies: [ds.slug],
      dependencies: blockWalk.npmDeps,
      files: blockFiles,
    }
    writeFileSync(join(outDir, `${block.slug}.json`), JSON.stringify(blockItem, null, 2) + '\n')
    registryItems.push(indexEntry(blockItem, blockFiles))
    dsCount++
  }
}

// Write the root registry index
const registry = {
  $schema: REGISTRY_SCHEMA,
  name: 'aicanvas',
  homepage: 'https://aicanvas.me',
  items: registryItems,
}

writeFileSync(join(outDir, 'registry.json'), JSON.stringify(registry, null, 2) + '\n')

console.log(`Generated ${count} components + ${dsCount} system/block items in ${outDir}/`)

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

// Build design-system / block metadata from the same source-of-truth config.
// Each entry mirrors the per-slug JSON's shape at a high level — enough for an
// AI agent to decide what to install and to surface the dep chain.
const mcpSystems = []
const mcpBlocks = []
for (const ds of DESIGN_SYSTEMS) {
  const tokensSlug = `${ds.slug}-tokens`
  const tokensJsonPath = join(outDir, `${tokensSlug}.json`)
  const sysJsonPath = join(outDir, `${ds.slug}.json`)
  let tokensItem, sysItem
  try { tokensItem = JSON.parse(readFileSync(tokensJsonPath, 'utf-8')) } catch { tokensItem = null }
  try { sysItem = JSON.parse(readFileSync(sysJsonPath, 'utf-8')) } catch { sysItem = null }

  mcpSystems.push({
    slug: ds.slug,
    name: ds.name,
    description: sysItem?.description ?? `${ds.name} design system.`,
    componentCount: sysItem?.files?.length ?? 0,
    tokenFileCount: tokensItem?.files?.length ?? 0,
    dependencies: [...new Set([...(tokensItem?.dependencies ?? []), ...(sysItem?.dependencies ?? [])])].sort(),
    registryDependencies: sysItem?.registryDependencies ?? [],
    tokensSlug,
    blockSlugs: ds.blocks.map((b) => b.slug),
    homepageUrl: `https://aicanvas.me/design-systems/${ds.slug}`,
    sourceUrl: `https://aicanvas.me/r/${ds.slug}.json`,
    tokensSourceUrl: `https://aicanvas.me/r/${tokensSlug}.json`,
    installCommand: `npx shadcn@latest add @aicanvas/${ds.slug}`,
    tokensInstallCommand: `npx shadcn@latest add @aicanvas/${tokensSlug}`,
  })
  for (const block of ds.blocks) {
    const blockJsonPath = join(outDir, `${block.slug}.json`)
    let blockItem
    try { blockItem = JSON.parse(readFileSync(blockJsonPath, 'utf-8')) } catch { blockItem = null }
    mcpBlocks.push({
      slug: block.slug,
      name: block.name,
      system: ds.slug,
      domain: block.domain,
      description: blockItem?.description ?? `${block.name} block from ${ds.name}.`,
      fileCount: blockItem?.files?.length ?? 0,
      dependencies: blockItem?.dependencies ?? [],
      registryDependencies: blockItem?.registryDependencies ?? [],
      homepageUrl: `https://aicanvas.me/design-systems/${ds.slug}/blocks/${block.slug.replace(`${ds.slug}-`, '')}`,
      sourceUrl: `https://aicanvas.me/r/${block.slug}.json`,
      installCommand: `npx shadcn@latest add @aicanvas/${block.slug}`,
    })
  }
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
  systems: mcpSystems,
  blocks: mcpBlocks,
}

writeFileSync(join(outDir, 'aicanvas-mcp.json'), JSON.stringify(mcpMeta, null, 2) + '\n')
console.log(`Generated MCP metadata: ${mcpComponents.length} components, ${Object.keys(categoryCounts).length} categories`)

// ── Lint the shipped JSON for transform integrity ─────────────────────────────
// Catches the regex-too-greedy class of bug (e.g. inner h-full incorrectly
// turned into min-h-screen, breaking installs). Non-zero exit fails the build.
try {
  execSync('node scripts/lint-registry-json.mjs', { stdio: 'inherit' })
} catch {
  process.exit(1)
}
