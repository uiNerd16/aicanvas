// Replace a component card shot from the user's "andromeda/New Screenshoots"
// folder. Finds the file whose name matches the slug (case/space-insensitive),
// resizes it to 1280px wide (PNG), and overwrites andromeda/<slug>.png.
// Usage: node scripts/replace-andromeda-shot.mjs <slug>
import { readFileSync } from 'fs'
import path from 'path'
let key
for (const line of readFileSync(path.join(process.cwd(), '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^IMAGEKIT_PRIVATE_KEY=(.*)$/); if (m) key = m[1].trim().replace(/^['"]|['"]$/g, '')
}
const auth = Buffer.from(key + ':').toString('base64')
const SRC_FOLDER = '/andromeda/New Screenshoots'
const WIDTH = 1280
const slug = process.argv[2]
if (!slug) { console.error('usage: node scripts/replace-andromeda-shot.mjs <slug>'); process.exit(1) }

const norm = (n) => n.replace(/\.[a-z0-9]+$/i, '').trim().toLowerCase().replace(/\s+/g, '-')
const listRes = await fetch('https://api.imagekit.io/v1/files?path=' + encodeURIComponent(SRC_FOLDER) + '&limit=300', { headers: { Authorization: `Basic ${auth}` } })
const files = await listRes.json()
if (!Array.isArray(files)) { console.error('list failed: ' + JSON.stringify(files).slice(0,200)); process.exit(1) }
const match = files.find((f) => norm(f.name) === slug)
if (!match) { console.error(`No file matching "${slug}" in ${SRC_FOLDER}. Found: ${files.map(f=>f.name).join(', ') || '(empty)'}`); process.exit(1) }
console.log(`source: ${match.name}  ${match.width}x${match.height}  ${Math.round(match.size/1024)}KB`)

// Strip any existing query (ImageKit list urls carry ?updatedAt=) before adding
// the transform, else the double-? makes ImageKit ignore tr.
const base = match.url.split('?')[0]
const imgRes = await fetch(`${base}?tr=w-${WIDTH},f-png`)
if (!imgRes.ok) { console.error('resize/download failed ' + imgRes.status); process.exit(1) }
const buf = Buffer.from(await imgRes.arrayBuffer())
console.log(`resized to ${WIDTH}w: ${Math.round(buf.length/1024)}KB`)

const body = new FormData()
body.append('file', `data:image/png;base64,${buf.toString('base64')}`)
body.append('fileName', `${slug}.png`)
body.append('folder', '/andromeda')
body.append('useUniqueFileName', 'false')
body.append('overwriteFile', 'true')
const up = await fetch('https://upload.imagekit.io/api/v1/files/upload', { method: 'POST', headers: { Authorization: `Basic ${auth}` }, body })
if (!up.ok) { console.error('upload failed ' + up.status + ' ' + await up.text()); process.exit(1) }
const { url } = await up.json()
await fetch('https://api.imagekit.io/v1/files/purge', { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
console.log(`OK  replaced andromeda/${slug}.png  ->  ${url}`)
