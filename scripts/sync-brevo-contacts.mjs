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
const { data, error } = await db
  .from('newsletter_subscribers')
  .select('email, name, status')
  .order('email')
if (error) { console.error('supabase:', error.message); process.exit(1) }

const mailable = data.filter(r => r.status !== 'unsubscribed')
const suppressed = data.filter(r => r.status === 'unsubscribed')

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

await importMailable(mailable)
for (const r of suppressed) await suppressContact(r)
console.log(`done: ${mailable.length} mailable, ${suppressed.length} suppressed, ${data.length} total`)
