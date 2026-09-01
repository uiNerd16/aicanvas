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
//
// Activation is deliberately positive, because a missing `dark` class does
// not prove the visitor chose light. In the top document the class decides
// (and the dev preview toggle, which marks <html> with
// data-andromeda-theme-preview, takes precedence while present). Inside the
// same-origin phone-preview iframe, whose bare ?frame=1 shell carries no
// theme state at all, the sync instead MIRRORS the embedding page: light
// exactly when the parent's channel is live, dark otherwise. A cross-origin
// embed gets no mirror and keeps the dark default.
export function AndromedaThemeSync() {
  useEffect(() => {
    const root = document.documentElement
    const framed = window.self !== window.top

    let stateRoot = root
    if (framed) {
      try {
        stateRoot = window.parent.document.documentElement
      } catch {
        return
      }
    } else if (root.hasAttribute('data-frame')) {
      // A frame shell opened directly as the top document stays dark: its
      // stage is pinned to the void and carries no theme state to follow.
      return
    }

    const vars = andromedaLightVars()
    const names = Object.keys(vars)
    // The DOM is the state: probing one channel property instead of caching a
    // flag means a third party clearing the set (or the preview toggle
    // handing control back) is noticed and corrected on the next mutation.
    const probe = names[0]

    const sync = () => {
      let wantLight: boolean
      if (framed) {
        wantLight = stateRoot.style.getPropertyValue(probe) !== ''
      } else {
        if (root.hasAttribute('data-andromeda-theme-preview')) return
        wantLight = !root.classList.contains('dark')
      }
      const hasLight = root.style.getPropertyValue(probe) !== ''
      if (wantLight === hasLight) return
      if (wantLight) {
        for (const name of names) root.style.setProperty(name, vars[name as keyof typeof vars])
      } else {
        for (const name of names) root.style.removeProperty(name)
      }
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(stateRoot, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-andromeda-theme-preview'],
    })

    return () => {
      observer.disconnect()
      // Leaving the route must leave <html> exactly as it was found, unless
      // the preview toggle currently owns the properties (its own cleanup
      // removes them).
      if (!root.hasAttribute('data-andromeda-theme-preview')) {
        for (const name of names) root.style.removeProperty(name)
      }
    }
  }, [])

  return null
}
