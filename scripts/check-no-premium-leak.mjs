#!/usr/bin/env node
/**
 * PREMIUM LEAK GUARD — structural, manifest-INDEPENDENT.
 *
 * Refuses to let premium material enter the PUBLIC aicanvas repo, by PATH, by
 * CONTENT MARKER, and by SECRET SHAPE:
 *   - injected premium working folders   (components-workspace|design-systems)/zz-premium-*
 *   - generated premium shims            *.premium.generated.(ts|tsx), premium-registry.generated.*
 *   - the premium source marker          a fixed token the inject script stamps
 *                                         into every premium file (in ANY path)
 *   - a GitHub Personal Access Token     ghp_… / github_pat_…
 *
 * The CONTENT MARKER is the real backstop: every premium source file MUST carry
 * it, so a hand-authored or mis-placed premium file is blocked even when it is
 * NOT under the zz-premium- path. The marker is assembled from parts below so
 * this guard never matches itself; the inject script must use the identical
 * marker (ideally a shared constant) so the two can't drift.
 *
 * Works before any premium component exists and cannot drift from a manifest.
 * Runs as a pre-commit hook (--staged), a pre-push hook (full tree), and in CI.
 *
 * Usage:
 *   node scripts/check-no-premium-leak.mjs            # whole tracked tree
 *   node scripts/check-no-premium-leak.mjs --staged   # staged blobs only
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

// Read the version that WOULD be committed: in --staged mode the staged BLOB
// (`git show :path`), not the working tree — otherwise a stage-then-revert
// (e.g. `git add -p` then edit) slips a secret past the scan (TOCTOU). Full-tree
// mode reads the working copy of tracked files.
function readContent(f) {
  try {
    if (staged) return execSync(`git show :"${f}"`, { encoding: 'utf8' })
    return readFileSync(f, 'utf8')
  } catch {
    return '' // deleted / binary / unreadable — nothing to scan
  }
}

const PREMIUM_PATH =
  /(^|\/)(components-workspace-premium|design-systems-premium)\/|(^|\/)(components-workspace|design-systems)\/zz-premium-/
const PREMIUM_GENERATED =
  /\.premium\.generated\.(ts|tsx|js)$|(^|\/)premium-registry\.generated\.|(^|\/)component-copy\.premium\.generated\./
// Assembled from parts so THIS file does not contain the literal marker (which
// would make the content scan flag the guard itself). Keep in sync with inject.
const MARKER = new RegExp(['AICANVAS', 'PREMIUM', 'DO', 'NOT', 'COMMIT'].join('-'))
const PAT = /\bghp_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{20,}\b/

const violations = []

for (const f of files) {
  if (PREMIUM_PATH.test(f)) violations.push(`tracked premium working folder: ${f}`)
  if (PREMIUM_GENERATED.test(f)) violations.push(`tracked premium generated shim: ${f}`)
}

for (const f of files) {
  const content = readContent(f)
  if (!content) continue
  if (MARKER.test(content)) violations.push(`premium source marker in: ${f}`)
  if (PAT.test(content)) violations.push(`PAT-shaped token in: ${f}`)
}

if (violations.length > 0) {
  console.error('\n🚫 PREMIUM LEAK GUARD — refusing to proceed.')
  console.error('   The public aicanvas repo must never contain premium source,')
  console.error('   premium generated shims, or a GitHub token:\n')
  for (const v of violations) console.error('   • ' + v)
  console.error('\n   Premium source lives ONLY in the private aicanvas-premium repo.')
  console.error('   If this is a false positive, fix the path/marker/secret — do not bypass.\n')
  process.exit(1)
}

console.log(`premium leak guard: clean (${files.length} ${staged ? 'staged' : 'tracked'} files)`)
