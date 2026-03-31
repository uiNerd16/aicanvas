'use client'

import { Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from './ThemeProvider'

export function TopBar({ count }: { count: number }) {
  const { theme, toggle } = useTheme()

  return (
    <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b border-sand-300 bg-sand-200/90 px-6 backdrop-blur dark:border-sand-800 dark:bg-sand-950/90">
      <h1 className="text-sm font-semibold text-sand-900 dark:text-sand-50">Components</h1>
      <span className="ml-2 text-sm text-sand-400 dark:text-sand-600">{count}</span>

      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-sand-400 transition-colors hover:bg-sand-300/60 hover:text-sand-700 dark:text-sand-500 dark:hover:bg-sand-800 dark:hover:text-sand-300"
      >
        {theme === 'dark'
          ? <Sun weight="regular" size={14} />
          : <Moon weight="regular" size={14} />}
      </button>
    </div>
  )
}
