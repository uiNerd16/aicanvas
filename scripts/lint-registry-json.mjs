/**
 * Lint shipped registry JSON files for transform integrity issues.
 *
 * Verifies that `min-h-screen` only appears in the ROOT className of each
 * component's content. The build script transforms the root className from
 * `h-full` to `min-h-screen` for copy-paste readiness — if `min-h-screen`
 * shows up anywhere else, either:
 *   1. The transform regex is too greedy (caught a previous bug where inner
 *      `h-full` on 3px progress-bar fills became `min-h-screen`, rendering
 *      as viewport-tall pills clipped into dome shapes — see upload-progress)
 *   2. A component author put `min-h-screen` in an inner className manually
 *
 * Either way, the user gets a broken install. This script catches both.
 *
 * Usage:  node scripts/lint-registry-json.mjs
 * Exit:   0 = clean, 1 = errors found
 */

import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { findJSXReturnContentStart } from './lib/copy-paste-transform.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REGISTRY_DIR = join(__dirname, '..', 'registry-data')

// Index files (registry index, MCP metadata) don't have a `files[].content` to lint.
const SKIP_FILES = new Set(['registry.json', 'aicanvas-mcp.json'])

/**
 * Find the root element's opening tag range in component source.
 * Returns { start, end } byte positions covering `<TagName ... >` (or `... />`),
 * or null if the structure isn't recognised.
 *
 * Anything between these positions is part of the root element's attributes
 * (className, style, etc.) — including template literal classNames like
 * `className={`flex min-h-screen ...`}`.
 */
function findRootOpeningTagRange(content) {
  const exportMatch = content.match(/export\s+default\s+function/)
  if (!exportMatch) return null
  const exportPos = exportMatch.index

  // Find the JSX return — distinguishes from useEffect cleanup returns etc.
  const returnEndPos = findJSXReturnContentStart(content, exportPos)
  if (returnEndPos === -1) return null

  // Skip whitespace and a Fragment opener (<>) if present.
  let i = returnEndPos
  while (i < content.length && /\s/.test(content[i])) i++
  if (content.slice(i, i + 2) === '<>') {
    i += 2
    while (i < content.length && /\s/.test(content[i])) i++
  }

  if (content[i] !== '<') return null
  const tagStart = i

  // Find the matching `>` for the opening tag, treating attributes as a
  // mini-state-machine so braces / strings / template literals don't confuse us.
  let depth = 0  // JSX expression brace depth (inside `{...}` attributes)
  let inSingle = false, inDouble = false, inTemplate = false
  let templateExprDepth = 0

  i = tagStart + 1
  while (i < content.length) {
    const ch = content[i]
    const prev = content[i - 1]

    if ((inSingle || inDouble || inTemplate) && prev === '\\') { i++; continue }

    if (inSingle) {
      if (ch === "'") inSingle = false
    } else if (inDouble) {
      if (ch === '"') inDouble = false
    } else if (inTemplate) {
      if (ch === '`') inTemplate = false
      else if (ch === '$' && content[i + 1] === '{') {
        templateExprDepth++
        i += 2
        continue
      } else if (ch === '}' && templateExprDepth > 0) {
        templateExprDepth--
      }
    } else if (depth > 0) {
      if (ch === '{') depth++
      else if (ch === '}') depth--
      else if (ch === '"') inDouble = true
      else if (ch === "'") inSingle = true
      else if (ch === '`') inTemplate = true
    } else {
      if (ch === '{') depth++
      else if (ch === '"') inDouble = true
      else if (ch === "'") inSingle = true
      else if (ch === '>') return { start: tagStart, end: i + 1 }
    }

    i++
  }

  return null
}

/** Convert a byte position into a 1-indexed line number. */
function lineAt(content, pos) {
  return content.slice(0, pos).split('\n').length
}

const files = readdirSync(REGISTRY_DIR)
  .filter(f => f.endsWith('.json') && !SKIP_FILES.has(f))
  .sort()

let totalIssues = 0
const failures = []

// ── JSON validity gate ────────────────────────────────────────────────────────
// A registry file must strict-parse everywhere. The directory reviewer reported
// "literal control characters inside strings, so strict parsers reject them."
// Node's JSON.parse IS strict (it rejects unescaped U+0000–U+001F in strings), so
// a successful parse already rules out his exact bug — but the two index files
// (registry.json, aicanvas-mcp.json) were skipped entirely below, and
// U+2028/U+2029/BOM are legal in JSON yet break some JS-based consumers. Scan
// EVERY .json here (including the skipped index files) so bad bytes can never ship
// silently. Runs in the build (generate-registry invokes this) — fails loud.
const RISKY = [
  { re: /\u2028/, label: 'U+2028 LINE SEPARATOR' },
  { re: /\u2029/, label: 'U+2029 PARAGRAPH SEPARATOR' },
  { re: /^\uFEFF/, label: 'leading U+FEFF BOM' },
]
for (const file of readdirSync(REGISTRY_DIR).filter(f => f.endsWith('.json')).sort()) {
  const slug = file.replace(/\.json$/, '')
  const issues = []
  let raw
  try {
    raw = readFileSync(join(REGISTRY_DIR, file), 'utf-8')
    JSON.parse(raw) // strict — throws on literal control chars inside strings
  } catch (e) {
    issues.push(`strict JSON parse failed: ${e.message}`)
  }
  if (raw) {
    for (const { re, label } of RISKY) {
      if (re.test(raw)) issues.push(`contains ${label} — legal JSON but breaks some strict/JS parsers`)
    }
  }
  if (issues.length > 0) {
    failures.push({ slug, issues })
    totalIssues += issues.length
  }
}

for (const file of files) {
  const slug = file.replace(/\.json$/, '')
  let json
  try {
    json = JSON.parse(readFileSync(join(REGISTRY_DIR, file), 'utf-8'))
  } catch {
    // Already reported as a strict-parse failure in the validity gate above.
    continue
  }

  // Only lint single-file `registry:ui` items. Design-system blocks / systems
  // ship multiple files that bypass the `h-full → min-h-screen` transform —
  // they author with explicit `100vh` / `h-screen` values and don't need this
  // check.
  if (json.type !== 'registry:ui') continue

  const content = json.files?.[0]?.content
  if (typeof content !== 'string') continue

  const root = findRootOpeningTagRange(content)
  const issues = []

  // Find every min-h-screen and check it's inside the root opening tag range.
  const re = /\bmin-h-screen\b/g
  let m
  while ((m = re.exec(content)) !== null) {
    const pos = m.index
    const inRoot = root && pos >= root.start && pos < root.end
    if (!inRoot) {
      const line = lineAt(content, pos)
      issues.push(
        `min-h-screen at content line ${line} is not in the root element's opening tag. ` +
        `Inner elements should use h-full (or omit), not min-h-screen.`
      )
    }
  }

  if (issues.length > 0) {
    failures.push({ slug, issues })
    totalIssues += issues.length
  }
}

console.log(`\nRegistry JSON Lint — ${files.length} files scanned`)

if (failures.length === 0) {
  console.log('✓ All clear\n')
  process.exit(0)
}

console.log(`✗ ${totalIssues} issue(s) in ${failures.length} file(s):\n`)
for (const { slug, issues } of failures) {
  console.log(`  ${slug}`)
  for (const issue of issues) {
    console.log(`    → ${issue}`)
  }
  console.log()
}
console.log('Likely causes:')
console.log('  - The h-full → min-h-screen transform is mis-targeting inner elements.')
console.log('  - Check scripts/lib/copy-paste-transform.mjs and verify the root-detection logic.')
console.log('  - Or a component author wrote min-h-screen in an inner className — fix the source.\n')
process.exit(1)
