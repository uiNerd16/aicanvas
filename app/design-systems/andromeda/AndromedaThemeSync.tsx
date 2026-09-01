'use client'

import { useEffect } from 'react'
import { andromedaLightVars } from '../../../design-systems/andromeda/components/lib/utils'

// Andromeda ships two themes and the site already has a light/dark state, so
// the Andromeda routes follow it rather than carrying a switch of their own.
//
// This only ever READS the site theme. The `dark` class on <html> belongs to
// ThemeProvider and nothing else may write it: a page that previews a design
// system must never be able to move the site it is previewed on.
//
// Light means defining the --andromeda-theme-* channel on <html>, which every
// andromedaVars() root below reads through; dark means removing it, which
// hands every component back the dark literal baked into its own fallback.
// So dark is not a second palette to keep in sync. It is the absence of one.
export function AndromedaThemeSync() {
  useEffect(() => {
    const root = document.documentElement
    const vars = andromedaLightVars()
    const names = Object.keys(vars)
    // Only touch the DOM when the answer actually changed. The observer fires
    // on any class mutation, and ~40 setProperty calls per keystroke of an
    // unrelated class would be 40 style recalcs for nothing.
    let applied: boolean | null = null

    const sync = () => {
      const isDark = root.classList.contains('dark')
      if (applied === !isDark) return
      applied = !isDark
      if (isDark) {
        for (const name of names) root.style.removeProperty(name)
      } else {
        for (const name of names) root.style.setProperty(name, vars[name as keyof typeof vars])
      }
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    return () => {
      observer.disconnect()
      // Leaving the route must leave <html> exactly as it was found. These
      // properties are global, and a stale light theme would follow the user
      // onto every page after this one.
      for (const name of names) root.style.removeProperty(name)
    }
  }, [])

  return null
}
