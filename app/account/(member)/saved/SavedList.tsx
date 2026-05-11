'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { CaretDown, Check, Plus, PushPinSlash, X } from '@phosphor-icons/react'

export type SavedRow = {
  slug: string
  system: string | null
  collection: string | null
  saved_at: string
  // Enriched server-side from the component registry so the client doesn't
  // need to ship the full COMPONENTS array. `name` falls back to the slug,
  // `image` is null when the component isn't in the registry (e.g. some
  // design-system templates) — the card renders a neutral fallback then.
  name: string
  image: string | null
}

const UNCAT = '__uncategorized__'

function hrefFor(row: SavedRow) {
  return row.system === 'andromeda'
    ? `/design-systems/andromeda/${row.slug.replace(/^andromeda-/, '')}`
    : `/components/${row.slug}`
}

export function SavedList({ initial }: { initial: SavedRow[] }) {
  const [rows, setRows] = useState<SavedRow[]>(initial)
  const [filter, setFilter] = useState<string | null>(null) // null = All

  const collections = useMemo(() => {
    const set = new Set<string>()
    let hasUncat = false
    for (const row of rows) {
      if (row.collection) set.add(row.collection)
      else hasUncat = true
    }
    return { names: [...set].sort(), hasUncat }
  }, [rows])

  const visible = useMemo(() => {
    if (filter === null) return rows
    if (filter === UNCAT) return rows.filter((r) => !r.collection)
    return rows.filter((r) => r.collection === filter)
  }, [rows, filter])

  async function setCollection(slug: string, value: string | null) {
    setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, collection: value } : r)))
    try {
      await fetch('/api/saved', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, collection: value }),
      })
    } catch {
      // Roll back on failure
      setRows(initial)
    }
  }

  async function unsave(slug: string) {
    // Optimistic remove — drop the row immediately, restore from `initial`
    // if the request fails so the user sees their state preserved.
    const previous = rows
    setRows((prev) => prev.filter((r) => r.slug !== slug))
    try {
      const res = await fetch('/api/saved', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) throw new Error('delete failed')
    } catch {
      setRows(previous)
    }
  }

  return (
    <div className="space-y-4">
      <FilterChips
        names={collections.names}
        hasUncat={collections.hasUncat}
        active={filter}
        onChange={setFilter}
      />

      {/* Individual row cards with a small gap between them — each card is
          its own surface so the list reads as a collection of items rather
          than a single table. */}
      <ul className="space-y-2">
        {visible.map((row) => (
          <li
            key={row.slug}
            className="flex items-center gap-4 rounded-xl border border-sand-300 bg-sand-100 px-3 py-3 transition-colors hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
          >
            <Link
              href={hrefFor(row)}
              className="group flex min-w-0 flex-1 items-center gap-4"
              aria-label={`Open ${row.name}`}
            >
              <SavedThumbnail src={row.image} alt="" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-sand-900 transition-colors group-hover:text-olive-500 dark:text-sand-50 dark:group-hover:text-olive-400">
                  {row.name}
                </div>
                {row.system && (
                  <div className="mt-0.5 truncate text-xs text-sand-500 dark:text-sand-400">
                    {row.system} system
                  </div>
                )}
              </div>
            </Link>
            <CollectionPicker
              value={row.collection}
              allNames={collections.names}
              onChange={(value) => setCollection(row.slug, value)}
            />
            <button
              type="button"
              onClick={() => unsave(row.slug)}
              aria-label={`Remove ${row.name} from saved`}
              title="Remove from saved"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sand-500 transition-colors hover:bg-sand-200 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
            >
              <PushPinSlash size={16} weight="regular" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Component preview thumbnail at the start of each row. Fixed 56×40 box on
// sand-950 so previews with transparent backgrounds (the site convention) sit
// on the same deep surface they're authored against. Falls back to a muted
// placeholder for rows the registry has no image for.
function SavedThumbnail({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-sand-950 ring-1 ring-sand-300 dark:ring-sand-800">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : null}
    </div>
  )
}

function FilterChips({
  names,
  hasUncat,
  active,
  onChange,
}: {
  names: string[]
  hasUncat: boolean
  active: string | null
  onChange: (value: string | null) => void
}) {
  if (names.length === 0 && !hasUncat) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Chip label="All" active={active === null} onClick={() => onChange(null)} />
      {names.map((name) => (
        <Chip key={name} label={name} active={active === name} onClick={() => onChange(name)} />
      ))}
      {hasUncat && (
        <Chip label="Uncategorized" active={active === UNCAT} onClick={() => onChange(UNCAT)} muted />
      )}
    </div>
  )
}

function Chip({
  label,
  active,
  onClick,
  muted = false,
}: {
  label: string
  active: boolean
  onClick: () => void
  muted?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? 'border-olive-500 bg-olive-500/15 text-olive-600 dark:text-olive-400'
          : muted
            ? 'border-sand-300 bg-transparent text-sand-500 hover:text-sand-700 dark:border-sand-800 dark:text-sand-500 dark:hover:text-sand-300'
            : 'border-sand-300 bg-sand-50 text-sand-700 hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100'
      }`}
    >
      {label}
    </button>
  )
}

function CollectionPicker({
  value,
  allNames,
  onChange,
}: {
  value: string | null
  allNames: string[]
  onChange: (value: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')

  function commit(name: string | null) {
    onChange(name)
    setOpen(false)
    setDraft('')
  }

  function commitDraft() {
    const trimmed = draft.trim()
    if (trimmed) commit(trimmed)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
          value
            ? 'border-olive-500/40 bg-olive-500/10 text-olive-600 dark:text-olive-400'
            : 'border-dashed border-sand-300 bg-transparent text-sand-500 hover:border-sand-400 hover:text-sand-700 dark:border-sand-700 dark:text-sand-500 dark:hover:border-sand-600 dark:hover:text-sand-300'
        }`}
      >
        {value ?? 'Add to collection'}
        <CaretDown size={10} weight="regular" className={`transition-transform ${open ? '-rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* Backdrop closes the popover on outside click */}
          <button
            type="button"
            aria-label="Close collection picker"
            onClick={() => { setOpen(false); setDraft('') }}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div className="absolute right-0 top-full z-40 mt-1 w-56 overflow-hidden rounded-lg border border-sand-300 bg-sand-50 shadow-lg dark:border-sand-700 dark:bg-sand-900">
            {value && (
              <button
                type="button"
                onClick={() => commit(null)}
                className="flex w-full items-center gap-2 border-b border-sand-300 px-3 py-2 text-xs font-medium text-sand-600 transition-colors hover:bg-sand-200 dark:border-sand-800 dark:text-sand-400 dark:hover:bg-sand-800"
              >
                <X size={12} weight="regular" />
                Remove from collection
              </button>
            )}
            <ul className="max-h-48 overflow-y-auto">
              {allNames.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => commit(name)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-xs font-medium transition-colors hover:bg-sand-200 dark:hover:bg-sand-800 ${
                      value === name
                        ? 'text-olive-600 dark:text-olive-400'
                        : 'text-sand-700 dark:text-sand-300'
                    }`}
                  >
                    {name}
                    {value === name && <Check size={12} weight="bold" />}
                  </button>
                </li>
              ))}
            </ul>
            <form
              onSubmit={(e) => { e.preventDefault(); commitDraft() }}
              className="flex items-center gap-1.5 border-t border-sand-300 bg-sand-100 px-2 py-2 dark:border-sand-800 dark:bg-sand-950"
            >
              <input
                type="text"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="New collection…"
                className="flex-1 rounded-md border border-sand-300 bg-white px-2 py-1 text-xs text-sand-900 outline-none focus:border-olive-500 dark:border-sand-700 dark:bg-sand-900 dark:text-sand-50"
                maxLength={40}
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Create collection"
                className="rounded-md bg-olive-500 p-1 text-sand-950 transition-colors hover:bg-olive-400 disabled:opacity-30"
              >
                <Plus size={12} weight="bold" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
