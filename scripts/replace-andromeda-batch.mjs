import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
let key
for (const line of readFileSync(path.join(process.cwd(), '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^IMAGEKIT_PRIVATE_KEY=(.*)$/); if (m) key = m[1].trim().replace(/^['"]|['"]$/g, '')
}
const auth = Buffer.from(key + ':').toString('base64')
const SRC_FOLDER = '/andromeda/New Screenshoots'
const WIDTH = 1280
const METndromeda_PATH = 'app/_lib/andromeda/andromeda-meta.ts'
let meta = readFileSync(METndromeda_PATH, 'utf8')
const known = new Set([...meta.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]))
const norm = (n) => n.replace(/\.[a-z0-9]+$/i, '').trim().toLowerCase().replace(/\s+/g, '-')

const listRes = await fetch('https://api.imagekit.io/v1/files?path=' + encodeURIComponent(SRC_FOLDER) + '&limit=300', { headers: { Authorization: `Basic ${auth}` } })
const files = await listRes.json()
if (!Array.isArray(files)) { console.error('list failed: ' + JSON.stringify(files).slice(0,200)); process.exit(1) }
console.log(`folder "${SRC_FOLDER}" has ${files.length} files\n`)

const replaced = [], skipped = []
for (const f of files) {
  const slug = norm(f.name)
  if (!known.has(slug)) { skipped.push(`${f.name} → "${slug}" (not a known component)`); continue }
  try {
    const base = f.url.split('?')[0]
    const r = await fetch(`${base}?tr=w-${WIDTH},f-png`)
    if (!r.ok) { skipped.push(`${f.name} (download ${r.status})`); continue }
    const buf = Buffer.from(await r.arrayBuffer())
    const body = new FormData()
    body.append('file', `data:image/png;base64,${buf.toString('base64')}`)
    body.append('fileName', `${slug}.png`)
    body.append('folder', '/andromeda')
    body.append('useUniqueFileName', 'false')
    body.append('overwriteFile', 'true')
    const up = await fetch('https://upload.imagekit.io/api/v1/files/upload', { method: 'POST', headers: { Authorization: `Basic ${auth}` }, body })
    if (!up.ok) { skipped.push(`${f.name} (upload ${up.status})`); continue }
    const { url } = await up.json()
    await fetch('https://api.imagekit.io/v1/files/purge', { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
    replaced.push(slug)
    console.log(`  OK  ${f.name}  ${f.width}x${f.height}  →  andromeda/${slug}.png @ ${WIDTH}w (${Math.round(buf.length/1024)}KB)`)
  } catch (e) { skipped.push(`${f.name} (${e.message})`) }
}

// Bump ?v cache-bust for each replaced slug so its card refreshes.
let bumped = 0
for (const slug of replaced) {
  const re = new RegExp(`(andromeda/${slug}\\.png\\?v=)(\\d+)'`)
  if (re.test(meta)) { meta = meta.replace(re, (_m, p, n) => `${p}${+n + 1}'`); bumped++ }
}
writeFileSync(METndromeda_PATH, meta)

console.log(`\nreplaced ${replaced.length}: ${replaced.join(', ') || '(none)'}`)
console.log(`cache-bumped ${bumped} entries in andromeda-meta.ts`)
if (skipped.length) console.log(`\nskipped ${skipped.length}:\n  ${skipped.join('\n  ')}`)
