import Link from 'next/link'
import { createClient } from '../../../lib/supabase/server'
import type { SavedComponent } from '../../../lib/supabase/types'
import { SavedList, type SavedRow } from './SavedList'

export default async function SavedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Try the full select; fall back to the pre-migration shape so existing
  // saves still surface during the brief window after deploying the code
  // and before applying migration 0002 (which adds the `collection` column).
  let rows: Pick<SavedComponent, 'slug' | 'system' | 'collection' | 'saved_at'>[] = []
  const full = await supabase
    .from('saved_components')
    .select('slug, system, collection, saved_at')
    .order('saved_at', { ascending: false })
  if (full.error) {
    const legacy = await supabase
      .from('saved_components')
      .select('slug, system, saved_at')
      .order('saved_at', { ascending: false })
    rows = (legacy.data ?? []).map((r: { slug: string; system: string | null; saved_at: string }) => ({ ...r, collection: null }))
  } else {
    rows = (full.data ?? []) as Pick<SavedComponent, 'slug' | 'system' | 'collection' | 'saved_at'>[]
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-sand-300 bg-sand-100 p-12 text-center dark:border-sand-800 dark:bg-sand-900">
        <p className="text-sm text-sand-600 dark:text-sand-400">
          You haven&apos;t saved anything yet.
        </p>
        <Link
          href="/components"
          className="mt-4 inline-block rounded-lg bg-olive-500 px-4 py-2 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
        >
          Browse components
        </Link>
      </div>
    )
  }

  return <SavedList initial={rows as SavedRow[]} />
}
