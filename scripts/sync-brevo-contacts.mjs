/**
 * One-way sync: Supabase newsletter_subscribers -> Brevo contacts.
 * The DB is the source of truth; run this any time to make Brevo match it.
 *
 *   subscribed / soft -> in the "AI Canvas updates" list, mailable
 *   unsubscribed      -> imported BLACKLISTED so Brevo can never mail them,
 *                        even if someone adds them to a list by hand
 *
 * Reads .env.local (BREVO_API_KEY, BREVO_LIST_ID, NEXT_PUBLIC_SUPABASE_URL,
 * SUPABASE_SECRET_KEY). Prints counts only, never addresses.
 *
 * Usage: node scripts/sync-brevo-contacts.mjs
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, BREVO_API_KEY, BREVO_LIST_ID } = process.env
if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SECRET_KEY || !BREVO_API_KEY || !BREVO_LIST_ID) {
  console.error('missing env vars'); process.exit(1)
}

const db = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false } })

// PostgREST caps a single select at 1000 rows (db.max_rows) and truncates
// SILENTLY — page explicitly and assert against an exact count so a growing
// table can never quietly leave the tail (including unsubscribes) unsynced.
const { count, error: countError } = await db
  .from('newsletter_subscribers')
  .select('*', { count: 'exact', head: true })
if (countError) { console.error('supabase count:', countError.message); process.exit(1) }

const data = []
const PAGE = 1000
for (let from = 0; ; from += PAGE) {
  const { data: page, error } = await db
    .from('newsletter_subscribers')
    .select('email, name, status')
    .order('email')
    .range(from, from + PAGE - 1)
  if (error) { console.error('supabase:', error.message); process.exit(1) }
  data.push(...page)
  if (page.length < PAGE) break
}
if (data.length !== count) {
  console.error(`row mismatch: fetched ${data.length}, table has ${count} — aborting`)
  process.exit(1)
}

const mailable = data.filter(r => r.status !== 'unsubscribed')
const suppressed = data.filter(r => r.status === 'unsubscribed')
const optedIn = data.filter(r => r.status === 'subscribed')

// Mailable contacts: Brevo's bulk import endpoint (async server-side job).
async function importMailable(rows) {
  if (!rows.length) return
  const res = await fetch('https://api.brevo.com/v3/contacts/import', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonBody: rows.map(r => ({
        email: r.email,
        ...(r.name ? { attributes: { FIRSTNAME: r.name } } : {}),
      })),
      listIds: [Number(BREVO_LIST_ID)],
      updateExistingContacts: true,
    }),
  })
  if (!res.ok) { console.error('brevo import:', res.status, await res.text()); process.exit(1) }
  const { processId } = await res.json()
  console.log(`mailable: ${rows.length} queued (process ${processId})`)
}

// Suppressed: per-contact upsert with emailBlacklisted, kept OUT of the list.
// (Bulk import requires listIds; blacklist is global so no list is needed.)
async function suppressContact(r) {
  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ email: r.email, updateEnabled: true, emailBlacklisted: true }),
  })
  if (!res.ok && res.status !== 204) {
    console.error('brevo suppress:', res.status, await res.text()); process.exit(1)
  }
}

// Explicit opt-ins additionally get emailBlacklisted:false per-contact: the
// bulk import never touches suppression, so this is what repairs the
// resubscribe direction (DB says subscribed, Brevo still blacklisted from an
// old unsubscribe). Merely-'soft' contacts are NOT forced mailable — a
// Brevo-side unsubscribe of a soft contact must stay suppressed.
async function unsuppressContact(r) {
  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ email: r.email, updateEnabled: true, emailBlacklisted: false }),
  })
  if (!res.ok && res.status !== 204) {
    console.error('brevo unsuppress:', res.status, await res.text()); process.exit(1)
  }
}

await importMailable(mailable)
for (const r of optedIn) await unsuppressContact(r)
for (const r of suppressed) await suppressContact(r)
console.log(`done: ${mailable.length} mailable, ${suppressed.length} suppressed, ${data.length} total`)
