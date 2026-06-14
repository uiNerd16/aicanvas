import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client using the secret key. BYPASSES RLS.
 * ONLY import from server code (route handlers, server helpers). Never expose
 * its results directly to the browser. Used by the token-validation and
 * Paddle-webhook paths, which have no user session to scope reads.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) throw new Error('Supabase admin env vars missing')
  return createClient(url, key, { auth: { persistSession: false } })
}
