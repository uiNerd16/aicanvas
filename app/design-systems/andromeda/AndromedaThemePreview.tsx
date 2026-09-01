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
  // Inside the phone-preview iframe the content mirrors the embedding page
  // (AndromedaThemeSync), so the frame must not carry a second, competing
  // toggle floating over the mock.
  const [framed, setFramed] = useState(false)
  useEffect(() => {
    setFramed(window.self !== window.top)
  }, [])

  useEffect(() => {
    if (!lightOn) return
    const root = document.documentElement
    const vars = andromedaLightVars()
    // The marker tells AndromedaThemeSync to stand down while this toggle
    // owns the channel; removing it LAST hands control back so the sync can
    // re-assert the site's real theme.
    root.setAttribute('data-andromeda-theme-preview', '')
    for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value)
    return () => {
      for (const name of Object.keys(vars)) root.style.removeProperty(name)
      root.removeAttribute('data-andromeda-theme-preview')
    }
  }, [lightOn])

  if (process.env.NODE_ENV !== 'development' || framed) return null

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
