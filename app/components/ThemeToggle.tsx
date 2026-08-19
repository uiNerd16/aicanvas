'use client'

import { Moon, Sun } from '@phosphor-icons/react'
import { buttonClasses } from './Button'
import { useTheme } from './ThemeProvider'

/**
 * The site's only theme control. Flips `<html>` and the cookie through
 * ThemeProvider and stops there: a component preview's own light/dark switch is
 * a separate, local thing and this must never touch it.
 *
 * Both icons stay mounted and cross-fade. Swapping the element instead would
 * drop focus off the button mid-press for anyone driving it from the keyboard.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className={`${buttonClasses({ variant: 'icon', size: 'md' })} ${className}`}
    >
      <span className="relative block h-[18px] w-[18px]">
        <Sun
          weight="regular"
          size={18}
          className={`absolute inset-0 transition-all duration-200 ${
            dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'
          }`}
        />
        <Moon
          weight="regular"
          size={18}
          className={`absolute inset-0 transition-all duration-200 ${
            dark ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </span>
    </button>
  )
}
