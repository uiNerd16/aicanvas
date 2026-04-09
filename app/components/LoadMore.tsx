'use client'

import { ArrowDown } from '@phosphor-icons/react'

// ─── Constants ───────────────────────────────────────────────────────────────

export const INITIAL_LOAD = 48
export const LOAD_MORE_SIZE = 24

// ─── LoadMore ────────────────────────────────────────────────────────────────

interface LoadMoreProps {
  hasMore: boolean
  remaining: number
  onLoadMore: () => void
}

export function LoadMore({ hasMore, remaining, onLoadMore }: LoadMoreProps) {
  if (!hasMore) return null

  return (
    <div className="flex flex-col items-center gap-2 pt-10 pb-2">
      <button
        onClick={onLoadMore}
        className="flex items-center gap-2 rounded-xl border border-sand-300 bg-sand-100 px-5 py-2.5 text-sm font-semibold text-sand-700 transition-all duration-150 hover:border-sand-400 hover:bg-sand-50 hover:text-sand-900 active:scale-95 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-300 dark:hover:border-sand-700 dark:hover:bg-sand-800 dark:hover:text-sand-100"
      >
        <ArrowDown weight="regular" size={15} />
        Load more
      </button>
      <span className="text-xs text-sand-400 dark:text-sand-600">
        {remaining} more component{remaining !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
