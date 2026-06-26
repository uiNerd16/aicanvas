#!/usr/bin/env node
/**
 * PREMIUM LEAK GUARD — structural, manifest-INDEPENDENT.
 *
 * Refuses to let premium material enter the PUBLIC aicanvas repo:
 *   - injected premium working folders   (components-workspace|design-systems)/zz-premium-*
 *   - generated premium shims            *.premium.generated.(ts|tsx), premium-registry.generated.*
 *   - a GitHub Personal Access Token     ghp_… / github_pat_…
 *
 * It works by PATH + CONTENT SHAPE, so it protects the repo even before any
 * premium component exists, and cannot drift from a manifest. Runs as a
 * pre-commit hook (--staged), a pre-push hook (full tree), and in CI.
 *
 * Usage:
 *   node scripts/check-no-premium-leak.mjs            # whole tracked tree
 *   node scripts/check-no-premium-leak.mjs --staged   # staged files only
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const staged = process.argv.includes('--staged')
const listCmd = staged
  ? 'git diff --cached --name-only --diff-filter=ACM'
  : 'git ls-files'

let files
try {
  files = execSync(listCmd, { encoding: 'utf8' }).split('\n').map((s) => s.trim()).filter(Boolean)
} catch (err) {
  console.error('check-no-premium-leak: could not list files:', err.message)
  process.exit(1)
}

// Premium working folders injected at build time — must never be tracked.
const PREMIUM_PATH = /(^|\/)(components-workspace|design-systems)\/zz-premium-/
// Gitignored generated shims — must never be tracked.
const PREMIUM_GENERATED =
  /\.premium\.generated\.(ts|tsx|js)$|(^|\/)premium-registry\.generated\.|(^|\/)component-copy\.premium\.generated\./
// GitHub PAT shapes — must never appear in any tracked file's content.
const PAT = /\bghp_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{20,}\b/

const violations = []

for (const f of files) {
  if (PREMIUM_PATH.test(f)) violations.push(`tracked premium working folder: ${f}`)
  if (PREMIUM_GENERATED.test(f)) violations.push(`tracked premium generated shim: ${f}`)
}

for (const f of files) {
  let content
  try { content = readFileSync(f, 'utf8') } catch { continue } // deleted/binary — skip
  if (PAT.test(content)) violations.push(`PAT-shaped token in: ${f}`)
}

if (violations.length > 0) {
  console.error('\n🚫 PREMIUM LEAK GUARD — refusing to proceed.')
  console.error('   The public aicanvas repo must never contain premium source,')
  console.error('   premium generated shims, or a GitHub token:\n')
  for (const v of violations) console.error('   • ' + v)
  console.error('\n   Premium source lives ONLY in the private aicanvas-premium repo.')
  console.error('   If this is a false positive, fix the path/secret — do not bypass.\n')
  process.exit(1)
}

console.log(`premium leak guard: clean (${files.length} ${staged ? 'staged' : 'tracked'} files)`)
