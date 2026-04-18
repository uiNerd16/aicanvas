'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])
  return <>{children}</>
}

/**
 * Reactive theme hook — returns `'light' | 'dark'` based on the `dark` class
 * on `<html>`. Components that set colours via inline styles can branch on
 * this without needing to manage their own MutationObserver.
 */
export type Theme = 'light' | 'dark'

function readCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useTheme(): { theme: Theme } {
  const [theme, setTheme] = useState<Theme>(() => readCurrentTheme())

  useEffect(() => {
    // Sync once on mount (SSR renders with the default).
    setTheme(readCurrentTheme())

    if (typeof document === 'undefined') return
    const html = document.documentElement
    const observer = new MutationObserver(() => {
      setTheme(readCurrentTheme())
    })
    observer.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return { theme }
}
