'use client'

// "i" badge beside the Record button. Matches Record's xs sizing so the
// pair reads as one row of chrome. Tooltip pops upward since this lives at
// the bottom of the canvas.

import { Info } from '@phosphor-icons/react'

export function RecordInfoTooltip() {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-label="About the recorder"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-sand-300 bg-sand-100/90 text-sand-600 backdrop-blur transition-colors hover:border-sand-400 hover:text-sand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-olive-500 dark:border-sand-700 dark:bg-sand-900/90 dark:text-sand-400 dark:hover:border-sand-600 dark:hover:text-sand-100"
      >
        <Info weight="regular" size={13} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-sand-300 bg-sand-100 px-3 py-2 text-xs leading-snug text-sand-700 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-sand-700 dark:bg-sand-900 dark:text-sand-200"
      >
        Testing a new way to animate. Move your mouse, hit record. No keyframes, no rigging — just straightforward.
      </span>
    </div>
  )
}
