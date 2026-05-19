'use client'

// Lets a LAB page inject controls into the lab layout's top header. Two
// named slots: 'right' (next to TopAuthPill) and 'center' (absolutely
// centered in the header). Pages register nodes via the hooks below;
// nodes are cleared on unmount.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type SlotName = 'right' | 'center'

type Ctx = {
  rightActions: ReactNode | null
  centerActions: ReactNode | null
  setSlot: (slot: SlotName, node: ReactNode | null) => void
}

const LabNavActionsContext = createContext<Ctx | null>(null)

export function LabNavActionsProvider({ children }: { children: ReactNode }) {
  const [rightActions, setRightActions] = useState<ReactNode | null>(null)
  const [centerActions, setCenterActions] = useState<ReactNode | null>(null)
  // Stable setter — without useCallback, consumers' useEffect deps would
  // change every render and re-fire the setSlot call infinitely.
  const setSlot = useCallback((slot: SlotName, node: ReactNode | null) => {
    if (slot === 'right') setRightActions(node)
    else setCenterActions(node)
  }, [])
  const value = useMemo(
    () => ({ rightActions, centerActions, setSlot }),
    [rightActions, centerActions, setSlot],
  )
  return (
    <LabNavActionsContext.Provider value={value}>
      {children}
    </LabNavActionsContext.Provider>
  )
}

function useCtx() {
  const ctx = useContext(LabNavActionsContext)
  if (!ctx) throw new Error('useLabNavActions* must be used inside LabNavActionsProvider')
  return ctx
}

export function useLabNavRightSlot() {
  return useCtx().rightActions
}

export function useLabNavCenterSlot() {
  return useCtx().centerActions
}

/**
 * Register a node to render in the lab navbar's right slot (next to the
 * auth pill). Cleans up on unmount.
 */
export function useLabNavActions(node: ReactNode | null) {
  const { setSlot } = useCtx()
  useEffect(() => {
    setSlot('right', node)
    return () => setSlot('right', null)
  }, [node, setSlot])
}

/**
 * Register a node to render absolutely centered in the lab navbar.
 * Cleans up on unmount.
 */
export function useLabNavCenterActions(node: ReactNode | null) {
  const { setSlot } = useCtx()
  useEffect(() => {
    setSlot('center', node)
    return () => setSlot('center', null)
  }, [node, setSlot])
}
