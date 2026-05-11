/**
 * gsc-submit.ts — Google Indexing API submission.
 *
 * Reads scripts/gsc-output/audit.json (produced by gsc-audit.ts) and submits
 * eligible URLs via the Indexing API. By default only "Discovered, awaiting
 * crawl" and "Unknown to Google" buckets are submitted — submission rarely
 * helps "Crawled, not indexed" (that's a content/quality signal).
 *
 * Honest disclaimer: Google's Indexing API is officially intended for
 * JobPosting / BroadcastEvent schema. For marketing pages, results are
 * inconsistent — sometimes it nudges crawl, sometimes nothing happens.
 * This script is a tool, not a guarantee. Re-run gsc:audit a week after
 * submitting to measure impact.
 *
 * Flags:
 *   --dry-run                       Print what would be submitted, exit.
 *   --limit=N                       Cap submissions (default 100; daily quota 200).
 *   --include-crawled-not-indexed   Also submit "Crawled, not indexed" URLs.
 *
 * Run: npm run gsc:submit -- --dry-run
 */

import fs from 'fs'
import path from 'path'
import { google } from 'googleapis'

// ─────────────────────────────────────────────────────────────────────
// .env.local loader (mirrors gsc-audit.ts to avoid a dotenv dependency)
// ─────────────────────────────────────────────────────────────────────
function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const text = fs.readFileSync(envPath, 'utf8')
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadDotEnvLocal()

const CREDS = process.env.GOOGLE_APPLICATION_CREDENTIALS
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'gsc-output')
const AUDIT_JSON = path.join(OUTPUT_DIR, 'audit.json')
const SUBMIT_LOG = path.join(OUTPUT_DIR, 'submit-log.json')

// Mirrors AuditEntry in gsc-audit.ts.
interface AuditEntry {
  url: string
  category: string
  error?: string
}

interface AuditFile {
  generatedAt: string
  siteUrl: string
  totalUrls: number
  entries: AuditEntry[]
}

interface SubmitLogEntry {
  url: string
  submittedAt: string
  category: string
  status: 'success' | 'error'
  notifyTime?: string | null
  error?: string
}

// ─────────────────────────────────────────────────────────────────────
// CLI flags
// ─────────────────────────────────────────────────────────────────────
function parseFlags(argv: string[]): {
  dryRun: boolean
  limit: number
  includeCrawledNotIndexed: boolean
} {
  let dryRun = false
  let limit = 100
  let includeCrawledNotIndexed = false
  for (const arg of argv) {
    if (arg === '--dry-run') dryRun = true
    else if (arg === '--include-crawled-not-indexed') includeCrawledNotIndexed = true
    else if (arg.startsWith('--limit=')) {
      const n = parseInt(arg.slice('--limit='.length), 10)
      if (!Number.isFinite(n) || n <= 0) throw new Error(`Invalid --limit value: ${arg}`)
      limit = n
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown flag: ${arg}`)
    }
  }
  return { dryRun, limit, includeCrawledNotIndexed }
}

// ─────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────
async function main() {
  const flags = parseFlags(process.argv.slice(2))

  if (!CREDS) throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not set. Add it to .env.local.')
  if (!fs.existsSync(CREDS)) throw new Error(`Service account JSON not found at: ${CREDS}`)
  if (!fs.existsSync(AUDIT_JSON)) {
    throw new Error(
      `audit.json not found at ${AUDIT_JSON}.\nRun \`npm run gsc:audit\` first.`,
    )
  }

  const audit: AuditFile = JSON.parse(fs.readFileSync(AUDIT_JSON, 'utf8'))
  const auditAge = (Date.now() - new Date(audit.generatedAt).getTime()) / (1000 * 60 * 60)
  if (auditAge > 24) {
    console.warn(`⚠ audit.json is ${auditAge.toFixed(1)}h old. Consider re-running gsc:audit first.\n`)
  }

  const submittableCategories = new Set([
    'Discovered, awaiting crawl',
    'Unknown to Google',
    ...(flags.includeCrawledNotIndexed ? ['Crawled, not indexed'] : []),
  ])

  const eligible = audit.entries.filter((e) => submittableCategories.has(e.category))
  const toSubmit = eligible.slice(0, flags.limit)

  console.log('GSC submit')
  console.log('---')
  console.log(`Audit:        ${path.relative(process.cwd(), AUDIT_JSON)}  (${audit.generatedAt})`)
  console.log(`Eligible:     ${eligible.length} URLs in [${[...submittableCategories].join(', ')}]`)
  console.log(`Will submit:  ${toSubmit.length} (limit=${flags.limit})`)
  console.log(`Dry run:      ${flags.dryRun ? 'yes' : 'no'}`)
  console.log('')
  console.log(
    'Note: the Indexing API is officially for JobPosting / BroadcastEvent schema.',
  )
  console.log(
    '      For marketing pages, results vary. Re-run gsc:audit after a week.',
  )
  console.log('')

  if (toSubmit.length === 0) {
    console.log('Nothing to submit. Done.')
    return
  }

  if (flags.dryRun) {
    console.log('URLs that would be submitted:')
    for (const e of toSubmit) console.log(`  [${e.category}] ${e.url}`)
    console.log('')
    console.log('(dry run — no submissions made)')
    return
  }

  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })
  const indexing = google.indexing({ version: 'v3', auth })

  const log: SubmitLogEntry[] = []
  let success = 0
  let errors = 0

  let i = 0
  for (const e of toSubmit) {
    i++
    process.stdout.write(`  [${String(i).padStart(3, ' ')}/${toSubmit.length}] ${e.url} ... `)
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: { url: e.url, type: 'URL_UPDATED' },
      })
      const notifyTime = res.data.urlNotificationMetadata?.latestUpdate?.notifyTime ?? null
      log.push({
        url: e.url,
        submittedAt: new Date().toISOString(),
        category: e.category,
        status: 'success',
        notifyTime,
      })
      success++
      process.stdout.write(`OK\n`)
    } catch (err: any) {
      const message = err?.message || String(err)
      log.push({
        url: e.url,
        submittedAt: new Date().toISOString(),
        category: e.category,
        status: 'error',
        error: message,
      })
      errors++
      process.stdout.write(`ERROR: ${message}\n`)
    }
    // Throttle: ~5 req/sec — gentle on quota.
    if (i < toSubmit.length) await new Promise((r) => setTimeout(r, 200))
  }

  // Append to existing log if present, so multiple runs accumulate history.
  let existing: SubmitLogEntry[] = []
  if (fs.existsSync(SUBMIT_LOG)) {
    try {
      existing = JSON.parse(fs.readFileSync(SUBMIT_LOG, 'utf8'))
      if (!Array.isArray(existing)) existing = []
    } catch {
      existing = []
    }
  }
  fs.writeFileSync(SUBMIT_LOG, JSON.stringify([...existing, ...log], null, 2))

  console.log('')
  console.log(`Done. ${success} ok, ${errors} errors.`)
  console.log(`Log: ${path.relative(process.cwd(), SUBMIT_LOG)}`)
  console.log('')
  console.log('Re-run `npm run gsc:audit` in 3–7 days to see what moved.')
}

main().catch((err) => {
  console.error('\nFAILED:', err?.message || err)
  process.exit(1)
})
