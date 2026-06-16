/**
 * Generate shadcn-compatible registry JSON files from component source files.
 * Outputs to registry-data/ — each component gets its own JSON file. The files
 * are served at /r/<slug>.json by the dynamic route in app/r/[file]/route.ts
 * (NOT statically from public/), so the route can identify the caller and
 * enforce entitlement. Same bytes as before; only the on-disk location moved.
 *
 * Usage: node scripts/generate-registry.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs'
import { join, dirname, resolve, relative, sep, posix } from 'path'
import { execSync } from 'child_process'
import { transformRootHeightClass } from './lib/copy-paste-transform.mjs'
import { DESIGN_SYSTEMS } from './lib/design-systems.config.mjs'

const wsDir = 'components-workspace'
const outDir = 'registry-data'
const SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json'
const REGISTRY_SCHEMA = 'https://ui.shadcn.com/schema/registry.json'

// Origin that serves the registry items (app/r/[file]/route.ts → /r/<slug>.json).
// registryDependencies MUST be fully-qualified URLs (or @namespace/name). A BARE
// slug makes shadcn resolve it against its DEFAULT registry (ui.shadcn.com) and
// 404 — which silently broke every design-system + template install. Emitting
// full URLs is the documented shadcn pattern for self-hosted/custom registries.
// Overridable so the generator can emit a localhost variant for install tests.
const REGISTRY_BASE = (process.env.AICANVAS_REGISTRY_BASE ?? 'https://aicanvas.me').replace(/\/+$/, '')
const depUrl = (slug) => `${REGISTRY_BASE}/r/${slug}.json`

// Folders to skip when building the public registry. `_template` is the
// scaffold copy-source and is never publicly installable.
const SKIP_FOLDERS = new Set(['_template'])

// ── Extract metadata from the component registry ──────────────────────────────

function parseRegistryMetadata() {
  const file = readFileSync('app/lib/component-registry.tsx', 'utf-8')
  const metadata = {}

  // IMPORTANT: scope parsing to the COMPONENTS_RAW array only. The entry regex
  // below is non-greedy, so if it runs over the whole file a `slug:` in an
  // earlier object (e.g. the `andromeda` design system in DESIGN_SYSTEMS) pairs
  // with the *first* component's `code: componentCodes[...]`, fabricating a
  // phantom component and clobbering the real one (wave-lines). Slice first.
  const rawStart = file.indexOf('const COMPONENTS_RAW')
  const rawEnd = file.indexOf('export const COMPONENTS', rawStart)
  if (rawStart === -1 || rawEnd === -1 || rawEnd <= rawStart) {
    throw new Error(
      'generate-registry: could not locate the COMPONENTS_RAW array in component-registry.tsx',
    )
  }
  const content = file.slice(rawStart, rawEnd)

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
// Used by `template` and `system` registry items to bundle every relative-imported
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
 * components out of template bundles.
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
// Reserve filenames for design systems (tokens + per-component + system +
// templates) so they survive the stale-file cleanup pass.
function componentSlug(systemSlug, fileBaseName) {
  // Convert PascalCase file name to kebab-case, prefix with system slug.
  // Button.tsx → andromeda-button; PanelHeader.tsx → andromeda-panel-header.
  const kebab = fileBaseName
    .replace(/\.(tsx|ts|jsx|js|mjs|cjs)$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
  return `${systemSlug}-${kebab}`
}
// Resolve a system component's registry slug, honoring per-system `slugOverrides`
// (keyed by the file's posix path relative to the system rootDir). Lets a
// design-system component whose natural slug collides with a published standalone
// (e.g. Button.tsx → andromeda-button) emit under its own unique slug instead of
// being skipped.
function dsComponentSlug(ds, entryRelPosix, baseName) {
  return ds.slugOverrides?.[entryRelPosix] ?? componentSlug(ds.slug, baseName)
}
for (const ds of DESIGN_SYSTEMS) {
  expectedNames.add(`${ds.slug}-tokens`)
  expectedNames.add(ds.slug)
  for (const entry of ds.systemEntries) {
    const baseName = entry.split('/').pop()
    expectedNames.add(dsComponentSlug(ds, entry, baseName))
  }
  for (const template of ds.templates) expectedNames.add(template.slug)
  if (ds.templates.length > 0) expectedNames.add(`${ds.slug}-all`)
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

// ── Design systems & templates ───────────────────────────────────────────────
// Three-layer registry items connected by `registryDependencies` so files are
// installed exactly once regardless of which entry the user picks:
//
//   <slug>-tokens     (registry:lib)    — tokens.ts + utils + system icons
//   <slug>            (registry:style)  — every component file; deps on tokens
//   <slug>-<template> (registry:block)  — only the example folder; deps on system
//
// Note: shadcn's CLI requires the `type` field to be one of its known enum
// values — `registry:block` is shadcn vocabulary, kept verbatim in the JSON.
// Everything user-facing (URLs, copy, MCP tool names) uses "template".
//
// Internal relative imports stay intact because every layer writes into the
// same `components/aicanvas/<slug>/` tree, preserving the source layout.

let dsCount = 0

// Every shipped file is code (.ts/.tsx) → registry:lib. The .md "brain" docs are
// deliberately NOT shipped to consumers; they stay in design-systems/ for
// internal use only.
function makeFile(fileAbs, rootDirAbs, slug) {
  const target = targetPathFor(fileAbs, rootDirAbs, slug)
  return {
    path: target,
    content: readFileSync(fileAbs, 'utf-8'),
    type: 'registry:lib',
    target,
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

// Content-type manifest consumed by the /r gate (lib/registry/lookup.ts).
// Collected from what this generator ACTUALLY emits, so the paywall classifier
// can never drift from the registry contents. Written as _manifest.json — the
// /r route's filename regex rejects leading underscores, so it is not servable.
const manifest = { systemSlugs: [], designSystemSlugs: [], templateSlugs: [] }

for (const ds of DESIGN_SYSTEMS) {
  const rootDirAbs = resolve(ds.rootDir)
  const tokenEntriesAbs = (ds.tokenEntries ?? []).map((p) => resolve(rootDirAbs, p))
  const systemEntriesAbs = ds.systemEntries.map((p) => resolve(rootDirAbs, p))
  manifest.systemSlugs.push(ds.slug)

  // ── 1. Tokens ────────────────────────────────────────────────────────────────
  const tokensSlug = `${ds.slug}-tokens`
  const tokensWalk = walkDependencies(tokenEntriesAbs, rootDirAbs)
  const tokensFiles = tokensWalk.files.map((f) => makeFile(f, rootDirAbs, ds.slug))
  // Self-load the system font for installed projects. The app provides the font
  // via next/font; consumers don't — so inject the font import into the SHIPPED
  // tokens file ONLY (on-disk source stays clean, app keeps using next/font) and
  // declare the package so shadcn installs it for the consumer.
  const fontPackages = ds.fontPackages ?? []
  if (fontPackages.length > 0) {
    const injectTarget = targetPathFor(resolve(rootDirAbs, ds.fontInjectInto), rootDirAbs, ds.slug)
    const injectFile = tokensFiles.find((f) => f.target === injectTarget)
    if (!injectFile) {
      throw new Error(`generate-registry: fontInjectInto "${ds.fontInjectInto}" is not among the ${ds.slug} tokens files`)
    }
    injectFile.content = fontPackages.map((p) => `import '${p}';`).join('\n') + '\n' + injectFile.content
  }
  const tokensItem = {
    $schema: SCHEMA,
    name: tokensSlug,
    type: 'registry:lib',
    title: `${ds.name} tokens`,
    description: `Foundation files for the ${ds.name} design system — tokens, shared utilities, and the system mark. Required by every ${ds.name} component and template.`,
    author: 'aicanvas <https://aicanvas.me>',
    dependencies: [...new Set([...tokensWalk.npmDeps, ...fontPackages])].sort(),
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
    registryDependencies: [depUrl(tokensSlug)],
    dependencies: systemWalk.npmDeps,
    files: systemFiles,
  }
  writeFileSync(join(outDir, `${ds.slug}.json`), JSON.stringify(systemItem, null, 2) + '\n')
  registryItems.push(indexEntry(systemItem, systemFiles))
  dsCount++

  const systemFileSet = new Set(systemWalk.files)
  const dsBoundary = new Set([...tokensFileSet, ...systemFileSet])

  // ── 2b. Individual components ───────────────────────────────────────────────
  // One installable item per component file. Each ships its own `.tsx` + sibling
  // `.rules.md`, depends on `andromeda-tokens` for the foundation, and declares
  // any other system components it imports as `registryDependencies` so the dep
  // graph stays correct (PanelHeader → IconButton → tokens, etc.).
  //
  // Collision handling: if a component's slug already exists as a published
  // standalone in `components-workspace/` (e.g. the inlined `andromeda-button`
  // wrapper), skip the system emit — the standalone retains the slug. Users on
  // that component's page get the standalone install command; the system version
  // is still reachable via the full `andromeda` bundle install.
  const componentWorkspaceSlugs = new Set(
    readdirSync(wsDir).filter((d) => {
      try { return statSync(join(wsDir, d)).isDirectory() } catch { return false }
    }),
  )

  // Files that are emitted as their OWN individual registry item. Only these may
  // become another component's `registryDependencies`. Every OTHER file reached
  // by the system walk — shared non-component helpers like components/lib/motion.ts
  // (imported by Button/IconButton/StatTile but never published on its own) —
  // must be BUNDLED into each component that imports it, or the installed file
  // would carry an unresolved relative import (`./lib/motion`) and fail to build.
  const emittedComponentFiles = new Set()
  for (const entry of ds.systemEntries) {
    const fileAbs = resolve(rootDirAbs, entry)
    if (!systemFileSet.has(fileAbs)) continue
    const slug = dsComponentSlug(ds, entry, entry.split('/').pop())
    if (componentWorkspaceSlugs.has(slug)) continue   // emitted as a standalone instead
    emittedComponentFiles.add(fileAbs)
  }

  for (const entry of ds.systemEntries) {
    const fileAbs = resolve(rootDirAbs, entry)
    if (!systemFileSet.has(fileAbs)) continue   // not part of system walk (skipped)
    const baseName = entry.split('/').pop()
    const slug = dsComponentSlug(ds, entry, baseName)

    // Slug collision with components-workspace — skip individual emit (unless a
    // slugOverride gave this file its own unique slug, which won't collide).
    if (componentWorkspaceSlugs.has(slug)) continue

    // Walk this component's transitive deps within the system, excluding tokens
    // files (those come via registry deps) AND excluding OTHER individually-emitted
    // components (those become registry deps). Shared helpers that are NOT emitted
    // on their own (e.g. lib/motion.ts) fall through and get bundled inline so the
    // component's relative imports resolve after install.
    const otherComponentFiles = [...emittedComponentFiles].filter((f) => f !== fileAbs)
    const componentBoundary = new Set([...tokensFileSet, ...otherComponentFiles])
    const compWalk = walkDependencies([fileAbs], rootDirAbs, componentBoundary)

    // Read the component's own imports to figure out which sibling components
    // it actually pulls in — those become registry deps. The walker doesn't
    // report this directly, so re-read and parse imports to identify them.
    const sourceContent = readFileSync(fileAbs, 'utf-8')
    const componentRegistryDeps = new Set([`${ds.slug}-tokens`])
    for (const spec of extractImportSpecifiers(sourceContent)) {
      if (!spec.startsWith('.') && !spec.startsWith('/')) continue
      const resolved = resolveImport(fileAbs, spec)
      // Only an individually-emitted sibling component becomes a registry dep.
      // Non-emitted shared helpers (lib/motion.ts) are bundled inline above, so
      // they must NOT be turned into a (non-existent) registry dependency.
      if (!resolved || !emittedComponentFiles.has(resolved) || resolved === fileAbs) continue
      // Sibling component — find its slug
      const relPath = relative(rootDirAbs, resolved)
      const relPosix = relPath.split(sep).join(posix.sep)
      const siblingBase = relPath.split(sep).pop()
      const siblingSlug = dsComponentSlug(ds, relPosix, siblingBase)
      // Only declare a dep if that sibling is itself published individually
      // (i.e. doesn't collide with a workspace standalone).
      if (!componentWorkspaceSlugs.has(siblingSlug)) {
        componentRegistryDeps.add(siblingSlug)
      }
    }

    const compFiles = compWalk.files.map((f) => makeFile(f, rootDirAbs, ds.slug))

    const compName = baseName.replace(/\.tsx$/, '')
    const compItem = {
      $schema: SCHEMA,
      name: slug,
      type: 'registry:ui',
      title: `${compName} (${ds.name})`,
      description: `${ds.name} ${compName} component. Install just this piece — tokens and any sibling components are pulled in automatically.`,
      author: 'aicanvas <https://aicanvas.me>',
      registryDependencies: [...componentRegistryDeps].sort().map(depUrl),
      dependencies: compWalk.npmDeps,
      files: compFiles,
    }
    writeFileSync(join(outDir, `${slug}.json`), JSON.stringify(compItem, null, 2) + '\n')
    registryItems.push(indexEntry(compItem, compFiles))
    manifest.designSystemSlugs.push(slug)
    dsCount++
  }

  // ── 3. Templates (compositions) ──────────────────────────────────────────────
  // Each template ships only its example folder. Components and tokens come
  // from the system + tokens registry items via `registryDependencies`.
  // (Type stays `registry:block` because that's shadcn's CLI vocabulary.)
  for (const template of ds.templates) {
    const templateEntryAbs = resolve(rootDirAbs, template.entryPath)
    const templateWalk = walkDependencies([templateEntryAbs], rootDirAbs, dsBoundary)
    const templateFiles = templateWalk.files.map((f) => makeFile(f, rootDirAbs, ds.slug))
    const templateItem = {
      $schema: SCHEMA,
      name: template.slug,
      type: 'registry:block',
      title: `${template.name} (${ds.name})`,
      description: `${template.name} composition from ${ds.name}${template.domain ? ` — ${template.domain.toLowerCase()} dashboard` : ''}. Pulls in the full ${ds.name} system on first install; subsequent template installs reuse it.`,
      author: 'aicanvas <https://aicanvas.me>',
      registryDependencies: [depUrl(ds.slug)],
      dependencies: templateWalk.npmDeps,
      files: templateFiles,
    }
    writeFileSync(join(outDir, `${template.slug}.json`), JSON.stringify(templateItem, null, 2) + '\n')
    registryItems.push(indexEntry(templateItem, templateFiles))
    manifest.templateSlugs.push(template.slug)
    dsCount++
  }

  // ── 4. Full-system bundle (everything) ──────────────────────────────────────
  // Single registry item that pulls components + tokens (via the system slug)
  // plus every template via `registryDependencies`. One CLI command grabs the
  // entire system. Soft-gated in the website UI; the JSON itself stays public
  // alongside every other `/r/*.json` per Phase 1.
  if (ds.templates.length > 0) {
    const allItem = {
      $schema: SCHEMA,
      name: `${ds.slug}-all`,
      type: 'registry:style',
      title: `${ds.name} — full system`,
      description: `Every ${ds.name} component, token, and template in one install.`,
      author: 'aicanvas <https://aicanvas.me>',
      registryDependencies: [depUrl(ds.slug), ...ds.templates.map((t) => depUrl(t.slug))],
      files: [],
    }
    writeFileSync(join(outDir, `${ds.slug}-all.json`), JSON.stringify(allItem, null, 2) + '\n')
    registryItems.push(indexEntry(allItem, []))
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

// Gate manifest (see lib/registry/lookup.ts). Sorted for stable diffs.
manifest.systemSlugs.sort()
manifest.designSystemSlugs.sort()
manifest.templateSlugs.sort()
writeFileSync(join(outDir, '_manifest.json'), JSON.stringify(manifest, null, 2) + '\n')

console.log(`Generated ${count} components + ${dsCount} system/template items in ${outDir}/ (+ gate manifest: ${manifest.designSystemSlugs.length} ds components, ${manifest.templateSlugs.length} templates)`)

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

// Build design-system / template metadata from the same source-of-truth config.
// Each entry mirrors the per-slug JSON's shape at a high level — enough for an
// AI agent to decide what to install and to surface the dep chain.
const mcpSystems = []
const mcpTemplates = []
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
    templateSlugs: ds.templates.map((t) => t.slug),
    homepageUrl: `https://aicanvas.me/design-systems/${ds.slug}`,
    sourceUrl: `https://aicanvas.me/r/${ds.slug}.json`,
    tokensSourceUrl: `https://aicanvas.me/r/${tokensSlug}.json`,
    installCommand: `npx shadcn@latest add @aicanvas/${ds.slug}`,
    tokensInstallCommand: `npx shadcn@latest add @aicanvas/${tokensSlug}`,
  })
  for (const template of ds.templates) {
    const templateJsonPath = join(outDir, `${template.slug}.json`)
    let templateItem
    try { templateItem = JSON.parse(readFileSync(templateJsonPath, 'utf-8')) } catch { templateItem = null }
    mcpTemplates.push({
      slug: template.slug,
      name: template.name,
      system: ds.slug,
      domain: template.domain,
      description: templateItem?.description ?? `${template.name} template from ${ds.name}.`,
      fileCount: templateItem?.files?.length ?? 0,
      dependencies: templateItem?.dependencies ?? [],
      registryDependencies: templateItem?.registryDependencies ?? [],
      homepageUrl: `https://aicanvas.me/design-systems/${ds.slug}/templates/${template.slug.replace(`${ds.slug}-`, '')}`,
      sourceUrl: `https://aicanvas.me/r/${template.slug}.json`,
      installCommand: `npx shadcn@latest add @aicanvas/${template.slug}`,
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
  templates: mcpTemplates,
}

// ── Integrity guard ──────────────────────────────────────────────────────────
// AI agents turn these slugs into /components/<slug> and /design-systems/<slug>
// URLs. A slug landing in more than one bucket (e.g. the 'andromeda' design
// system leaking into components[]) ships a dead link straight to the MCP.
// Fail the build loudly instead.
{
  const bucketOf = new Map()
  const claim = (slug, bucket) => {
    if (bucketOf.has(slug)) {
      throw new Error(
        `generate-registry: slug "${slug}" is in both "${bucketOf.get(slug)}" and "${bucket}". ` +
          `Each slug must belong to exactly one of components/systems/templates, ` +
          `otherwise the MCP hands AI agents a URL that 404s.`,
      )
    }
    bucketOf.set(slug, bucket)
  }
  for (const c of mcpComponents) claim(c.slug, 'components')
  for (const s of mcpSystems) claim(s.slug, 'systems')
  for (const t of mcpTemplates) claim(t.slug, 'templates')
}

writeFileSync(join(outDir, 'aicanvas-mcp.json'), JSON.stringify(mcpMeta, null, 2) + '\n')
console.log(`Generated MCP metadata: ${mcpComponents.length} components, ${Object.keys(categoryCounts).length} categories`)

// ── Lightweight nav counts (sidebar / mobile-nav) ─────────────────────────────
// The client nav imports THIS registry-free module instead of component-registry,
// so the preview components it references (three.js, matter-js, …) never enter
// the shared client bundle. Counts use accent (category) tags, which the
// stack-tag transform never touches, so they match the registry exactly.
const navTs =
  '// AUTO-GENERATED by scripts/generate-registry.mjs — do not edit by hand.\n' +
  '// Category counts + total for the sidebar/mobile nav, with zero component\n' +
  '// imports (keeps three.js etc. out of the shared bundle).\n\n' +
  `export const CATEGORY_COUNTS: Record<string, number> = ${JSON.stringify(categoryCounts, null, 2)}\n\n` +
  `export const TOTAL_COMPONENTS = ${mcpComponents.length}\n`
writeFileSync('app/lib/component-nav.generated.ts', navTs)
console.log(`Generated app/lib/component-nav.generated.ts (${Object.keys(categoryCounts).length} categories, ${mcpComponents.length} total)`)

// ── Lint the shipped JSON for transform integrity ─────────────────────────────
// Catches the regex-too-greedy class of bug (e.g. inner h-full incorrectly
// turned into min-h-screen, breaking installs). Non-zero exit fails the build.
try {
  execSync('node scripts/lint-registry-json.mjs', { stdio: 'inherit' })
} catch {
  process.exit(1)
}
