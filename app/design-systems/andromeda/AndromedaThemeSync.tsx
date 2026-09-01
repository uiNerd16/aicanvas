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
// Activation is deliberately narrow, because a missing `dark` class does not
// prove the visitor chose light. Inside any iframe the sync never runs: the
// template phone preview loads the bare ?frame=1 shell, which carries no
// theme state at all, and its stage is pinned dark. And while the dev-only
// preview toggle owns the channel (it marks <html> with
// data-andromeda-theme-preview) the sync stands down, then re-asserts the
// site's answer the moment the marker leaves.
export function AndromedaThemeSync() {
  useEffect(() => {
    if (window.self !== window.top) return
    const root = document.documentElement
    if (root.hasAttribute('data-frame')) return

    const vars = andromedaLightVars()
    const names = Object.keys(vars)
    // The DOM is the state: probing one channel property instead of caching a
    // flag means a third party clearing the set (or the preview toggle
    // handing control back) is noticed and corrected on the next mutation.
    const probe = names[0]

    const sync = () => {
      if (root.hasAttribute('data-andromeda-theme-preview')) return
      const wantLight = !root.classList.contains('dark')
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
    observer.observe(root, {
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
