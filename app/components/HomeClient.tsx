'use client'

import { MagnifyingGlass } from '@phosphor-icons/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ComponentCard } from './ComponentCard'
import { HeaderSocials } from './HeaderSocials'
import type { ComponentEntry } from '../lib/component-registry'

// ─── HomeClient ───────────────────────────────────────────────────────────────

export function HomeClient({ components }: { components: ComponentEntry[] }) {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const query         = searchParams.get('q') ?? ''

  const q = query.trim().toLowerCase()
  const filtered = q
    ? components.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.label.toLowerCase().includes(q)),
      )
    : components

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    const qs = params.toString()
    router.replace(qs ? `/?${qs}` : '/', { scroll: false })
  }

  return (
    <div className="flex min-h-full flex-col">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b border-sand-300 bg-sand-200/90 px-6 backdrop-blur dark:border-sand-800 dark:bg-sand-950/90">
        <h1 className="shrink-0 text-sm font-semibold text-sand-900 dark:text-sand-50">Components</h1>
        <span className="shrink-0 text-sm text-sand-400 dark:text-sand-600">{filtered.length}</span>

        <div className="ml-auto">
          <HeaderSocials />
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="flex-1 p-6">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((entry) => (
              <ComponentCard
                key={entry.slug}
                name={entry.name}
                description={entry.description}
                tags={entry.tags}
                image={entry.image}
                href={`/components/${entry.slug}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <MagnifyingGlass weight="regular" size={32} className="mb-4 text-sand-400 dark:text-sand-600" />
            <p className="text-sm font-semibold text-sand-700 dark:text-sand-300">
              No components match &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-sm text-sand-400 dark:text-sand-600">
              Try a different keyword or clear the search.
            </p>
            <button
              onClick={clearSearch}
              className="mt-4 rounded-lg border border-sand-300 px-3.5 py-2 text-sm font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
