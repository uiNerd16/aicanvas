'use client'

import { useEffect, useState } from 'react'
import { andromedaLightVars, themeColor } from '../../../design-systems/andromeda/components/lib/utils'

// Dev-only stand-in for the site theme toggle, which does not exist yet: the
// site is still hard-pinned dark (app/layout.tsx + ThemeProvider). Until a
// real toggle lands, this floating switch previews the Andromeda light theme
// by applying the --andromeda-theme-* channel directly. It never touches the
// site's `dark` class or any persisted theme state, and it renders nothing in
// production builds. Delete it once the site toggle ships and
// AndromedaThemeSync takes over.
export function AndromedaThemePreview() {
  const [lightOn, setLightOn] = useState(false)

  useEffect(() => {
    if (!lightOn) return
    const root = document.documentElement
    const vars = andromedaLightVars()
    for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value)
    return () => {
      for (const name of Object.keys(vars)) root.style.removeProperty(name)
    }
  }, [lightOn])

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <button
      type="button"
      onClick={() => setLightOn((v) => !v)}
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 60,
        padding: '6px 12px',
        fontFamily: 'var(--font-jetbrains-mono, monospace)',
        fontSize: '11px',
        color: themeColor.text.secondary,
        backgroundColor: themeColor.surface.raised,
        border: `1px solid ${themeColor.border.base}`,
        cursor: 'pointer',
      }}
    >
      {lightOn ? 'Dark theme' : 'Light theme'}
    </button>
  )
}
