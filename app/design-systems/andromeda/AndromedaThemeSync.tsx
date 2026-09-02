'use client'

import { useEffect } from 'react'
import { andromedaLightVars } from '../../../design-systems/andromeda/components/lib/utils'

// Top documents need no JS for Andromeda theming: globals.css defines the
// --andromeda-theme-* channel under .andromeda-theme-scope whenever <html>
// carries no `dark` class and is not a frame document, so the palette is
// right from the very first server paint, with nothing to hydrate.
//
// This component exists for the one place CSS cannot reach: the same-origin
// phone-preview iframe. Its bare ?frame=1 shell carries no theme state and
// its document is excluded from the CSS rule via [data-frame], so the frame
// MIRRORS the embedding page instead, light exactly when the parent shows
// light, by writing the channel inline on the frame document's root. It only
// ever READS the parent's theme; the `dark` class and the cookie belong to
// ThemeProvider alone (lib/theme/scope.test.ts enforces that split). A
// cross-origin embed gets no mirror and keeps the dark default.
export function AndromedaThemeSync() {
  useEffect(() => {
    if (window.self === window.top) return
    let parentRoot: HTMLElement
    try {
      parentRoot = window.parent.document.documentElement
    } catch {
      return
    }
    const frameRoot = window.document.documentElement
    const vars = andromedaLightVars()
    const names = Object.keys(vars)
    const probe = names[0]

    const sync = () => {
      const wantLight = !parentRoot.classList.contains('dark')
      const hasLight = frameRoot.style.getPropertyValue(probe) !== ''
      if (wantLight === hasLight) return
      if (wantLight) {
        // The marker lets the frame shell's forced-dark pins (globals.css and
        // the FramePayload style block) step aside without a flash.
        frameRoot.setAttribute('data-frame-light', '')
        for (const name of names) frameRoot.style.setProperty(name, vars[name as keyof typeof vars])
      } else {
        frameRoot.removeAttribute('data-frame-light')
        for (const name of names) frameRoot.style.removeProperty(name)
      }
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(parentRoot, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return null
}
