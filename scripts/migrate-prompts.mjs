/**
 * One-time migration: replace 4-platform prompts (Claude/GPT/Gemini/V0)
 * with 3-platform prompts (Claude Code / Figma Make / V0).
 *
 * Strategy:
 *   - 'Claude Code' = preamble + existing Claude prompt
 *   - 'Figma Make'  = existing Claude prompt (works universally)
 *   - 'V0'          = existing Claude prompt (Claude prompts outperform V0-specific ones)
 *
 * Usage: node scripts/migrate-prompts.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const wsDir = 'components-workspace'

const CLAUDE_CODE_PREAMBLE = `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

`

/**
 * Extract the content of a template literal assigned to a given key.
 * Handles escaped backticks (\`) and ${} expressions inside the literal.
 */
function extractTemplateLiteral(source, key) {
  // Match:  Claude: `  or  'Claude': `  (with optional whitespace)
  const startRe = new RegExp(`(?:^|\\s)${key}\\s*:\\s*\``, 'm')
  const startMatch = startRe.exec(source)
  if (!startMatch) return null

  const startIdx = startMatch.index + startMatch[0].length
  let i = startIdx

  while (i < source.length) {
    const ch = source[i]

    if (ch === '\\') {
      i += 2 // skip escaped character
      continue
    }

    if (ch === '`') {
      return source.slice(startIdx, i)
    }

    // Skip ${...} template expressions (may contain nested braces/backticks)
    if (ch === '$' && source[i + 1] === '{') {
      let depth = 1
      i += 2
      while (i < source.length && depth > 0) {
        if (source[i] === '{') depth++
        else if (source[i] === '}') depth--
        i++
      }
      continue
    }

    i++
  }

  return null
}

const dirs = readdirSync(wsDir).filter(d => {
  const p = join(wsDir, d)
  return statSync(p).isDirectory() && d !== '_template'
}).sort()

let migrated = 0
let skipped = 0

for (const dir of dirs) {
  const filePath = join(wsDir, dir, 'prompts.ts')
  let source
  try {
    source = readFileSync(filePath, 'utf-8')
  } catch {
    continue // no prompts.ts
  }

  // Extract the Claude prompt
  const claudeContent = extractTemplateLiteral(source, 'Claude')

  if (!claudeContent) {
    console.log(`  skip  ${dir} — no Claude prompt found`)
    skipped++
    continue
  }

  const claudeCodeContent = CLAUDE_CODE_PREAMBLE + claudeContent

  const newSource = `import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': \`${claudeCodeContent}\`,

  'Figma Make': \`${claudeContent}\`,

  'V0': \`${claudeContent}\`,
}
`

  writeFileSync(filePath, newSource, 'utf-8')
  console.log(`  ✓  ${dir}`)
  migrated++
}

console.log(`\nMigrated ${migrated} components, skipped ${skipped}`)
