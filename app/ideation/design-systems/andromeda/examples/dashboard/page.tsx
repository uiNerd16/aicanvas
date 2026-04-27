// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import { X } from '@phosphor-icons/react'
import MissionControl from '../../../../../../design-systems/andromeda/examples/mission-control'
import { tokens } from '../../../../../../design-systems/andromeda/tokens'

// Distraction-free example. The ideation sidebar/topbar are suppressed
// for this route (see IdeationSidebar + IdeationTopBar) so the dashboard
// fills the viewport. The example opens in a new tab — the exit button
// closes the tab; if the browser refuses (e.g. the tab wasn't opened by
// script and the user navigated here directly), we fall back to the
// Andromeda landing.

export default function DashboardExample() {
  function handleExit() {
    window.close()
    setTimeout(() => {
      if (!window.closed) {
        window.location.href = '/ideation/design-systems/andromeda'
      }
    }, 50)
  }

  return (
    <div
      className="relative min-h-full"
      style={{ backgroundColor: tokens.color.surface.void }}
    >
      <MissionControl />

      <button
        type="button"
        onClick={handleExit}
        aria-label="Close example"
        className="fixed z-50 flex items-center justify-center transition-colors"
        style={{
          top: tokens.spacing[4],
          right: tokens.spacing[4],
          width: tokens.spacing[10],
          height: tokens.spacing[10],
          borderRadius: tokens.radius.sm,
          backgroundColor: tokens.color.surface.hover,
          border: `${tokens.border.thin} ${tokens.color.border.base}`,
          color: tokens.color.text.secondary,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      >
        <X weight="regular" size={16} />
      </button>
    </div>
  )
}
