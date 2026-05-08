import Link from 'next/link'
import { createClient } from '../../../lib/supabase/server'
import type { InstallHistoryRow } from '../../../lib/supabase/types'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('install_history')
    .select('*')
    .order('copied_at', { ascending: false })
    .limit(100)

  const rows = (data as InstallHistoryRow[] | null) ?? []

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-sand-300 bg-sand-100 p-12 text-center dark:border-sand-800 dark:bg-sand-900">
        <p className="text-sm text-sand-600 dark:text-sand-400">
          No install history yet. Copy a CLI command from any component and it&apos;ll show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
      <table className="w-full text-sm">
        <thead className="border-b border-sand-300 dark:border-sand-800">
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-sand-500 dark:text-sand-400">
            <th className="px-4 py-3">Component</th>
            <th className="px-4 py-3">System</th>
            <th className="px-4 py-3">Manager</th>
            <th className="px-4 py-3">When</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sand-300 dark:divide-sand-800">
          {rows.map((row) => (
            <tr key={row.id} className="text-sand-900 dark:text-sand-50">
              <td className="px-4 py-3 font-medium">
                <Link href={`/components/${row.slug}`} className="hover:text-olive-500 dark:hover:text-olive-400">
                  {row.slug}
                </Link>
              </td>
              <td className="px-4 py-3 text-sand-600 dark:text-sand-400">{row.system ?? '—'}</td>
              <td className="px-4 py-3 text-sand-600 dark:text-sand-400">{row.pkg_manager ?? '—'}</td>
              <td className="px-4 py-3 text-sand-600 dark:text-sand-400">
                {new Date(row.copied_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
