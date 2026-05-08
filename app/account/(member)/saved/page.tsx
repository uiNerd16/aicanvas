import Link from 'next/link'
import { createClient } from '../../../lib/supabase/server'
import type { SavedComponent } from '../../../lib/supabase/types'

export default async function SavedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: saved } = await supabase
    .from('saved_components')
    .select('slug, system, saved_at')
    .order('saved_at', { ascending: false })

  const rows = (saved as Pick<SavedComponent, 'slug' | 'system' | 'saved_at'>[] | null) ?? []

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

  return (
    <div className="overflow-hidden rounded-xl border border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
      <ul className="divide-y divide-sand-300 dark:divide-sand-800">
        {rows.map((row) => {
          const href = row.system === 'andromeda'
            ? `/design-systems/andromeda/${row.slug.replace(/^andromeda-/, '')}`
            : `/components/${row.slug}`
          return (
            <li key={row.slug}>
              <Link
                href={href}
                className="flex items-center justify-between px-5 py-4 text-sand-900 transition-colors hover:bg-sand-200 dark:text-sand-50 dark:hover:bg-sand-800"
              >
                <div>
                  <div className="font-medium">{row.slug}</div>
                  {row.system && (
                    <div className="mt-0.5 text-xs text-sand-500 dark:text-sand-400">
                      {row.system} system
                    </div>
                  )}
                </div>
                <div className="text-xs text-sand-500 dark:text-sand-400">
                  {new Date(row.saved_at).toLocaleDateString()}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
