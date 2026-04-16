/**
 * Enrich all component prompts with an explicit ## Typography section.
 *
 * Reads each components-workspace/<name>/index.tsx, extracts:
 *   - Font family (next/font/google, geist/font, inline fontFamily, font-mono class)
 *   - Font sizes (Tailwind text-* classes, arbitrary text-[Npx], inline fontSize)
 *   - Font weights (Tailwind font-* classes, inline fontWeight)
 *
 * Appends a ## Typography section to every platform in the component's prompts.ts.
 * Idempotent — skips if ## Typography already present.
 *
 * Usage: node scripts/enrich-prompts-typography.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const wsDir = 'components-workspace'

// ─── Tailwind → explicit value maps ──────────────────────────────────────────

const TW_SIZES = {
  'text-xs':   '12px',
  'text-sm':   '14px',
  'text-base': '16px',
  'text-lg':   '18px',
  'text-xl':   '20px',
  'text-2xl':  '24px',
  'text-3xl':  '30px',
  'text-4xl':  '36px',
  'text-5xl':  '48px',
  'text-6xl':  '60px',
  'text-7xl':  '72px',
  'text-8xl':  '96px',
  'text-9xl':  '128px',
}

const TW_WEIGHTS = {
  'font-thin':        '100',
  'font-extralight':  '200',
  'font-light':       '300',
  'font-normal':      '400',
  'font-medium':      '500',
  'font-semibold':    '600',
  'font-bold':        '700',
  'font-extrabold':   '800',
  'font-black':       '900',
}

// ─── Typography extraction ────────────────────────────────────────────────────

function extractTypography(source) {
  const fonts = new Set()
  const sizes = new Set()
  const weights = new Set()

  // ── Font family ──────────────────────────────────────────────────────────

  // next/font/google: import { Inter } from 'next/font/google'
  const googleFontRe = /import\s*\{([^}]+)\}\s*from\s*['"]next\/font\/google['"]/g
  let m
  while ((m = googleFontRe.exec(source)) !== null) {
    m[1].split(',').forEach(name => {
      const clean = name.trim().replace(/_/g, ' ')
      if (clean) fonts.add(clean)
    })
  }

  // geist/font/*: import { GeistMono } from 'geist/font/mono'
  const geistRe = /import\s*\{([^}]+)\}\s*from\s*['"]geist\/font[^'"]*['"]/g
  while ((m = geistRe.exec(source)) !== null) {
    m[1].split(',').forEach(name => {
      const clean = name.trim()
      if (clean) fonts.add(clean)
    })
  }

  // inline fontFamily: handles 'Font Name', "Font Name", '"Font Name"', "'Font Name'"
  const fontFamilyRe = /fontFamily[=:\s]+["'`](.*?)["'`](?=[,;\s}]|$)/gm
  while ((m = fontFamilyRe.exec(source)) !== null) {
    // Take first family before comma, strip any wrapping quotes
    const first = m[1].split(',')[0].trim().replace(/^['"]|['"]$/g, '').trim()
    if (first && !first.startsWith('var(') && !first.startsWith('--') && first.length > 1) {
      fonts.add(first)
    }
  }

  // Tailwind font-mono / font-sans / font-serif class
  if (/\bfont-mono\b/.test(source) && fonts.size === 0) fonts.add('monospace (system)')
  if (/\bfont-serif\b/.test(source) && fonts.size === 0) fonts.add('serif (system)')

  // ── Font sizes ───────────────────────────────────────────────────────────

  // Tailwind standard classes
  for (const [cls, px] of Object.entries(TW_SIZES)) {
    if (new RegExp(`\\b${cls}\\b`).test(source)) sizes.add(px)
  }

  // Tailwind arbitrary: text-[14px], text-[1.5rem]
  const twArbitraryRe = /text-\[(\d+(?:\.\d+)?)(px|rem)\]/g
  while ((m = twArbitraryRe.exec(source)) !== null) {
    const val = m[2] === 'rem' ? `${Math.round(parseFloat(m[1]) * 16)}px` : `${m[1]}px`
    sizes.add(val)
  }

  // Inline fontSize: number or string
  const fontSizeNumRe = /fontSize[:\s]+(\d+(?:\.\d+)?)(?!\s*px|rem|em|%)/g
  while ((m = fontSizeNumRe.exec(source)) !== null) {
    sizes.add(`${m[1]}px`)
  }
  const fontSizePxRe = /fontSize[:\s]+['"](\d+(?:\.\d+)?)(px|rem)['"]/g
  while ((m = fontSizePxRe.exec(source)) !== null) {
    const val = m[2] === 'rem' ? `${Math.round(parseFloat(m[1]) * 16)}px` : `${m[1]}px`
    sizes.add(val)
  }

  // ── Font weights ─────────────────────────────────────────────────────────

  // Tailwind weight classes
  for (const [cls, w] of Object.entries(TW_WEIGHTS)) {
    if (new RegExp(`\\b${cls}\\b`).test(source)) weights.add(w)
  }

  // Inline fontWeight: number
  const fontWeightNumRe = /fontWeight[:\s]+(\d+)/g
  while ((m = fontWeightNumRe.exec(source)) !== null) weights.add(m[1])

  // Inline fontWeight: string keyword
  const kwMap = { thin: '100', light: '300', normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800', black: '900' }
  const fontWeightKwRe = /fontWeight[:\s]+['"]([a-z]+)['"]/g
  while ((m = fontWeightKwRe.exec(source)) !== null) {
    if (kwMap[m[1]]) weights.add(kwMap[m[1]])
  }

  return { fonts, sizes, weights }
}

function buildTypographySection({ fonts, sizes, weights }) {
  const lines = ['## Typography']

  if (fonts.size > 0) {
    lines.push(`- Font: ${[...fonts].join(', ')}`)
  } else {
    lines.push('- Font: project default sans-serif')
  }

  if (sizes.size > 0) {
    // Sort numerically
    const sorted = [...sizes].sort((a, b) => parseFloat(a) - parseFloat(b))
    lines.push(`- Sizes: ${sorted.join(', ')}`)
  }

  if (weights.size > 0) {
    const sorted = [...weights].sort((a, b) => parseInt(a) - parseInt(b))
    lines.push(`- Weights: ${sorted.join(', ')}`)
  }

  return lines.join('\n')
}

// ─── Template literal extractor (same as migrate-prompts.mjs) ────────────────

function extractTemplateLiteral(source, key) {
  const startRe = new RegExp(`(?:^|\\s)['"]?${key}['"]?\\s*:\\s*\``, 'm')
  const startMatch = startRe.exec(source)
  if (!startMatch) return null

  const startIdx = startMatch.index + startMatch[0].length
  let i = startIdx

  while (i < source.length) {
    const ch = source[i]
    if (ch === '\\') { i += 2; continue }
    if (ch === '`') return source.slice(startIdx, i)
    if (ch === '$' && source[i + 1] === '{') {
      let depth = 1; i += 2
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

function replaceTemplateLiteral(source, key, newContent) {
  const startRe = new RegExp(`((?:^|\\s)['"]?${key}['"]?\\s*:\\s*\`)`, 'm')
  const startMatch = startRe.exec(source)
  if (!startMatch) return source

  const afterTick = startMatch.index + startMatch[0].length
  let i = afterTick

  while (i < source.length) {
    const ch = source[i]
    if (ch === '\\') { i += 2; continue }
    if (ch === '`') {
      return source.slice(0, afterTick) + newContent + source.slice(i)
    }
    if (ch === '$' && source[i + 1] === '{') {
      let depth = 1; i += 2
      while (i < source.length && depth > 0) {
        if (source[i] === '{') depth++
        else if (source[i] === '}') depth--
        i++
      }
      continue
    }
    i++
  }
  return source
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const dirs = readdirSync(wsDir).filter(d => {
  const p = join(wsDir, d)
  return statSync(p).isDirectory() && d !== '_template'
}).sort()

let enriched = 0
let skipped = 0

for (const dir of dirs) {
  const indexPath = join(wsDir, dir, 'index.tsx')
  const promptsPath = join(wsDir, dir, 'prompts.ts')

  let indexSource, promptsSource
  try {
    indexSource = readFileSync(indexPath, 'utf-8')
    promptsSource = readFileSync(promptsPath, 'utf-8')
  } catch {
    continue
  }

  // Skip if already enriched
  if (promptsSource.includes('## Typography')) {
    console.log(`  skip  ${dir} — already has ## Typography`)
    skipped++
    continue
  }

  const typo = extractTypography(indexSource)
  const section = buildTypographySection(typo)

  // Append typography to each platform's content
  let updated = promptsSource
  for (const platform of ['Claude Code', 'Figma Make', 'V0']) {
    const content = extractTemplateLiteral(updated, platform.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    if (content === null) continue
    const newContent = content.trimEnd() + '\n\n' + section
    updated = replaceTemplateLiteral(updated, platform.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), newContent)
  }

  if (updated !== promptsSource) {
    writeFileSync(promptsPath, updated, 'utf-8')
    console.log(`  ✓  ${dir}`)
    enriched++
  } else {
    console.log(`  —  ${dir} (no platforms found)`)
    skipped++
  }
}

console.log(`\nEnriched ${enriched} components, skipped ${skipped}`)
