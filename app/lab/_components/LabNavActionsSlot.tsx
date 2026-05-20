'use client'

// Renders whatever the active LAB page has registered into the navbar
// slots — right (next to TopAuthPill) and center (absolutely centered).

import { useLabNavCenterSlot, useLabNavRightSlot } from '../_lib/navActionsContext'

export function LabNavRightSlot() {
  const actions = useLabNavRightSlot()
  if (!actions) return null
  return <>{actions}</>
}

export function LabNavCenterSlot() {
  const actions = useLabNavCenterSlot()
  if (!actions) return null
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Re-enable pointer events on the actual control. */}
      <div className="pointer-events-auto">{actions}</div>
    </div>
  )
}
