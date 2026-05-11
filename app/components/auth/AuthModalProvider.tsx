'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

// ─── AuthModalProvider ────────────────────────────────────────────────────────
// Global state for the auth modal — open/closed, current mode (sign-in or
// sign-up), and an optional `next` URL for post-success redirects. Mounted
// once at the root layout. The actual <AuthModal /> reads this state and
// renders the dialog with whichever form-fields component matches the mode.
//
// API:
//   const { open, close, setMode, isOpen, mode, next } = useAuthModal()
//   open()                                  // opens in sign-in mode (default)
//   open({ mode: 'sign-up' })               // opens in sign-up mode
//   open({ next: '/account/saved' })        // opens, redirect after success
//   setMode('sign-up')                      // toggle mode while open

export type AuthModalMode = 'sign-in' | 'sign-up'

type AuthModalContextValue = {
  isOpen: boolean
  mode: AuthModalMode
  next: string | null
  open: (opts?: { mode?: AuthModalMode; next?: string }) => void
  close: () => void
  setMode: (mode: AuthModalMode) => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setModeState] = useState<AuthModalMode>('sign-in')
  const [next, setNext] = useState<string | null>(null)

  const open = useCallback((opts?: { mode?: AuthModalMode; next?: string }) => {
    setModeState(opts?.mode ?? 'sign-in')
    setNext(opts?.next ?? null)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setNext(null)
    // mode is preserved across closes — most users return to whichever
    // tab they last had open. Reset on next open() call.
  }, [])

  const setMode = useCallback((nextMode: AuthModalMode) => {
    setModeState(nextMode)
  }, [])

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, next, open, close, setMode }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error('useAuthModal must be used within <AuthModalProvider>')
  return ctx
}
