'use client'

import { useState, useRef, useEffect } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { ComponentCard } from './ComponentCard'
import type { ComponentEntry } from '../lib/component-registry'

// ─── HomeClient ───────────────────────────────────────────────────────────────

export function HomeClient({ components }: { components: ComponentEntry[] }) {
  const [query, setQuery]       = useState('')
  const [focused, setFocused]   = useState(false)
  const inputRef                = useRef<HTMLInputElement>(null)

  // ⌘K / Ctrl+K focuses the search input
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const q = query.trim().toLowerCase()
  const filtered = q
    ? components.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.label.toLowerCase().includes(q)),
      )
    : components

  const showKbd = !focused && !query

  return (
    <div className="flex min-h-full flex-col">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b border-sand-300 bg-sand-200/90 px-6 backdrop-blur dark:border-sand-800 dark:bg-sand-950/90">

        {/* Title + count */}
        <h1 className="shrink-0 text-sm font-semibold text-sand-900 dark:text-sand-50">Components</h1>
        <span className="shrink-0 text-sm text-sand-400 dark:text-sand-600">{filtered.length}</span>

        {/* Search */}
        <div className="relative ml-auto w-56">
          <MagnifyingGlass
            weight="regular"
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sand-400 dark:text-sand-500"
          />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search components…"
            className="
              w-full rounded-lg border border-sand-300 bg-sand-100 py-1.5 pl-8
              text-sm text-sand-900 placeholder:text-sand-400
              outline-none transition-all duration-150
              hover:border-sand-400
              focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20
              dark:border-sand-700 dark:bg-sand-900 dark:text-sand-50 dark:placeholder:text-sand-500
              dark:hover:border-sand-600
              dark:focus:border-olive-500 dark:focus:ring-olive-500/20
            "
            style={{ paddingRight: showKbd ? '3.75rem' : query ? '2rem' : '0.75rem' }}
          />

          {/* ⌘K badge — shown when idle */}
          {showKbd && (
            <div className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
              <kbd className="rounded border border-sand-300 px-1.5 py-0.5 font-mono text-[10px] text-sand-400 dark:border-sand-700 dark:text-sand-600">⌘</kbd>
              <kbd className="rounded border border-sand-300 px-1.5 py-0.5 font-mono text-[10px] text-sand-400 dark:border-sand-700 dark:text-sand-600">K</kbd>
            </div>
          )}

          {/* Clear button — shown when query is active */}
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-sand-400 transition-colors hover:text-sand-700 dark:text-sand-500 dark:hover:text-sand-300"
            >
              <X weight="regular" size={13} />
            </button>
          )}
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
              onClick={() => setQuery('')}
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
