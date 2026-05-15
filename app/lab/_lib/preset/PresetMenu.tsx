'use client'

import { useEffect, useRef, useState } from 'react'
import { CaretDown, DotsThree, PencilSimple, Trash, FolderOpen } from '@phosphor-icons/react'

// "My presets" dropdown for in-tool preset switching. Lists the user's
// saved presets for the current tool, with per-row actions to rename and
// delete. Closes on outside click. The trigger always renders — when the
// user has no presets (or is signed out) the menu opens to an empty state.

export type PresetSummary = {
  id: string
  name: string
  updated_at: string
}

type Props = {
  presets: PresetSummary[]
  loading: boolean
  signedIn: boolean
  onLoad: (id: string) => void
  onRename: (id: string, currentName: string) => void
  onDelete: (id: string) => void
}

export function PresetMenu({ presets, loading, signedIn, onLoad, onRename, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-sand-300 bg-transparent px-3 py-2 text-sm font-semibold text-sand-700 transition-colors hover:bg-sand-100 dark:border-sand-700 dark:text-sand-200 dark:hover:bg-sand-900"
      >
        <span className="flex items-center gap-2">
          <FolderOpen size={14} weight="regular" />
          My presets
          {signedIn && presets.length > 0 && (
            <span className="ml-1 text-xs text-sand-500">({presets.length})</span>
          )}
        </span>
        <CaretDown size={12} weight="regular" className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-30 mt-1 max-h-72 overflow-y-auto rounded-md border border-sand-300 bg-sand-50 shadow-lg dark:border-sand-700 dark:bg-sand-900">
          {!signedIn && (
            <p className="px-3 py-3 text-xs text-sand-500">
              Sign in to save and reload your tunes.
            </p>
          )}
          {signedIn && loading && (
            <p className="px-3 py-3 text-xs text-sand-500">Loading…</p>
          )}
          {signedIn && !loading && presets.length === 0 && (
            <p className="px-3 py-3 text-xs text-sand-500">
              No presets yet. Tune your particles, then hit Save preset.
            </p>
          )}
          {signedIn && presets.length > 0 && (
            <ul className="py-1">
              {presets.map((p) => (
                <PresetRow
                  key={p.id}
                  preset={p}
                  onLoad={() => {
                    onLoad(p.id)
                    setOpen(false)
                  }}
                  onRename={() => {
                    onRename(p.id, p.name)
                    setOpen(false)
                  }}
                  onDelete={() => {
                    onDelete(p.id)
                  }}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function PresetRow({
  preset,
  onLoad,
  onRename,
  onDelete,
}: {
  preset: PresetSummary
  onLoad: () => void
  onRename: () => void
  onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const rowRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onClickOutside(e: MouseEvent) {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  return (
    <li ref={rowRef} className="relative flex items-center justify-between gap-1 px-1">
      <button
        type="button"
        onClick={onLoad}
        className="flex-1 truncate rounded px-2 py-1.5 text-left text-sm text-sand-800 hover:bg-sand-100 dark:text-sand-100 dark:hover:bg-sand-800"
        title={preset.name}
      >
        {preset.name}
      </button>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Preset actions"
        className="rounded p-1.5 text-sand-500 transition-colors hover:bg-sand-100 hover:text-sand-900 dark:hover:bg-sand-800 dark:hover:text-sand-100"
      >
        <DotsThree size={16} weight="regular" />
      </button>
      {menuOpen && (
        <div className="absolute right-1 top-full z-40 mt-1 w-32 overflow-hidden rounded-md border border-sand-300 bg-sand-50 shadow-lg dark:border-sand-700 dark:bg-sand-900">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              onRename()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-sand-800 hover:bg-sand-100 dark:text-sand-100 dark:hover:bg-sand-800"
          >
            <PencilSimple size={14} weight="regular" /> Rename
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              onDelete()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-500 hover:bg-red-500/10"
          >
            <Trash size={14} weight="regular" /> Delete
          </button>
        </div>
      )}
    </li>
  )
}
