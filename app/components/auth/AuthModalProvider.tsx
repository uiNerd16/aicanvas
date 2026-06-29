'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

// ─── AuthModalProvider ────────────────────────────────────────────────────────
// Global state for the auth modal — open/closed, current mode (gate, sign-in,
// or sign-up), and an optional `next` URL for post-success redirects. Mounted
// once at the root layout. The actual <AuthModal /> reads this state and
// renders the dialog with whichever screen matches the mode.
//
// API:
//   const { open, close, setMode, isOpen, mode, next } = useAuthModal()
//   open()                                  // opens in sign-in mode (default)
//   open({ mode: 'sign-up' })               // opens in sign-up mode
//   open({ mode: 'gate' })                  // soft-gate confidence screen (Sign in / Sign up)
//   open({ next: '/account/saved' })        // opens, redirect after success
//   open({ title, subtitle })               // override the modal's default copy
//   setMode('sign-up')                      // toggle mode while open
//
// The 'gate' mode is used when a value-extracting action (Lab Save / Record /
// Save Preset, etc.) wants to soft-pitch the value of signing in before
// asking for credentials. The gate screen renders confidence copy + two
// buttons that call setMode('sign-in' | 'sign-up').

export type AuthModalMode = 'gate' | 'sign-in' | 'sign-up'

type AuthModalContextValue = {
  isOpen: boolean
  mode: AuthModalMode
  next: string | null
  // Optional copy overrides for the sign-in / sign-up screens. When null the
  // modal renders its default headline + sub-copy. Per-open() so a caller can
  // tailor the pitch ("Grab this component.") without changing the global copy.
  title: string | null
  subtitle: string | null
  open: (opts?: { mode?: AuthModalMode; next?: string; title?: string; subtitle?: string }) => void
  close: () => void
  setMode: (mode: AuthModalMode) => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setModeState] = useState<AuthModalMode>('sign-in')
  const [next, setNext] = useState<string | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [subtitle, setSubtitle] = useState<string | null>(null)

  const open = useCallback((opts?: { mode?: AuthModalMode; next?: string; title?: string; subtitle?: string }) => {
    setModeState(opts?.mode ?? 'sign-in')
    setNext(opts?.next ?? null)
    setTitle(opts?.title ?? null)
    setSubtitle(opts?.subtitle ?? null)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setNext(null)
    setTitle(null)
    setSubtitle(null)
    // mode is preserved across closes — most users return to whichever
    // tab they last had open. Reset on next open() call.
  }, [])

  const setMode = useCallback((nextMode: AuthModalMode) => {
    setModeState(nextMode)
  }, [])

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, next, title, subtitle, open, close, setMode }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error('useAuthModal must be used within <AuthModalProvider>')
  return ctx
}
