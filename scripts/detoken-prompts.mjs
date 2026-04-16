/**
 * Replace sand-N and olive-N design token class names in all prompts.ts files
 * with explicit hex values (Tailwind arbitrary value syntax: bg-[#hex]).
 *
 * Usage: node scripts/detoken-prompts.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const wsDir = 'components-workspace'

// ─── Token → hex maps ─────────────────────────────────────────────────────────

const SAND = {
  '50':  '#FAFAF0',
  '100': '#E8E8DF',
  '200': '#D4D4CC',
  '300': '#BABAB4',
  '400': '#9E9E98',
  '500': '#7D7D78',
  '600': '#666662',
  '700': '#4F4F4C',
  '800': '#383836',
  '900': '#21211F',
  '950': '#1A1A19',
}

const OLIVE = {
  '400': '#DAE4A0',
  '500': '#A8B94D',
  '600': '#869631',
}

// Tailwind utility prefixes that can carry a color value
const PREFIXES = [
  'bg', 'text', 'border', 'ring', 'outline', 'shadow',
  'fill', 'stroke', 'from', 'to', 'via', 'divide',
  'placeholder', 'decoration', 'caret', 'accent',
]

function buildReplacements() {
  const map = []

  for (const [shade, hex] of Object.entries(SAND)) {
    for (const prefix of PREFIXES) {
      map.push([`${prefix}-sand-${shade}`, `${prefix}-[${hex}]`])
    }
    // bare sand-N (e.g. in class strings like "sand-950")
    map.push([`sand-${shade}`, hex])
  }

  for (const [shade, hex] of Object.entries(OLIVE)) {
    for (const prefix of PREFIXES) {
      map.push([`${prefix}-olive-${shade}`, `${prefix}-[${hex}]`])
    }
    map.push([`olive-${shade}`, hex])
  }

  return map
}

const REPLACEMENTS = buildReplacements()

function detokenize(source) {
  let out = source
  for (const [token, hex] of REPLACEMENTS) {
    // Word-boundary aware: don't replace mid-word
    const re = new RegExp(`(?<![\\w-])${token.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}(?![\\w-])`, 'g')
    out = out.replace(re, hex)
  }
  return out
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const dirs = readdirSync(wsDir).filter(d => {
  const p = join(wsDir, d)
  return statSync(p).isDirectory() && d !== '_template'
}).sort()

let changed = 0
let unchanged = 0

for (const dir of dirs) {
  const filePath = join(wsDir, dir, 'prompts.ts')
  let source
  try { source = readFileSync(filePath, 'utf-8') } catch { continue }

  const updated = detokenize(source)
  if (updated !== source) {
    writeFileSync(filePath, updated, 'utf-8')
    console.log(`  ✓  ${dir}`)
    changed++
  } else {
    unchanged++
  }
}

console.log(`\nDe-tokenized ${changed} files, ${unchanged} already clean`)
