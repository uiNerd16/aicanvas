'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'

/**
 * SITE theme only.
 *
 * The site owns exactly one thing: the `dark` class on `<html>`, mirrored into
 * the `theme` cookie so the server can render the right class on the first
 * paint. It is the only writer of either.
 *
 * A component or block preview does NOT use this. Previews carry their own
 * `[data-card-theme]` wrapper (see the scope contract in globals.css) and hold
 * their choice in local state. That separation is load-bearing: an earlier site
 * toggle and the component toggles both wrote `<html>`, so flipping a preview
 * to dark dragged the whole site with it, and the site toggle was deleted to
 * stop it. Nothing below may reach into a preview, and nothing in a preview may
 * call back into here.
 */

const ThemeContext = createContext<{ theme: Theme; setTheme: (next: Theme) => void }>({
  theme: 'dark',
  setTheme: () => {},
})

export function ThemeProvider({ initial, children }: { initial: Theme; children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initial)

  function setTheme(next: Theme) {
    setThemeState(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    // A year, so the choice survives. Carries the word light or dark and
    // nothing else: no id, no session, nothing that could identify a visitor.
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax${
      location.protocol === 'https:' ? '; secure' : ''
    }`
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
