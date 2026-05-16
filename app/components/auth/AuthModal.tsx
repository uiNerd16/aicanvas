'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { X } from '@phosphor-icons/react'
import { Button } from '../Button'
import { useAuthModal } from './AuthModalProvider'
import { SignInFormFields } from './SignInFormFields'
import { SignUpFormFields } from './SignUpFormFields'

// Focusable selector — anything keyboard users can land on. The Tab handler
// uses this to find the first/last elements inside the dialog for wrap-around.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

// ─── AuthModal ────────────────────────────────────────────────────────────────
// Global auth dialog. Opens via useAuthModal().open() and closes on X click
// or any pathname change — backdrop clicks and ESC are intentionally NOT
// handled, so users only exit deliberately via the close button. Renders
// SignInFormFields or SignUpFormFields depending on `mode`. The internal
// "Create an account" / "Already have one? Sign in" links flip the mode in
// place rather than navigating, keeping the modal open for a single
// seamless flow.

export function AuthModal() {
  const router = useRouter()
  const pathname = usePathname()
  const { isOpen, mode, next, close, setMode } = useAuthModal()
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on route change. The "Forgot password?" link inside the sign-in
  // form navigates to /account/forgot-password — we want the modal to
  // dismiss when that happens. Switching between sign-in and sign-up modes
  // doesn't change the pathname, so this doesn't fire on those.
  useEffect(() => {
    close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Lock body scroll while open so the page beneath doesn't shift.
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  // Focus management while open:
  //   1. Capture the element that triggered the modal so we can restore
  //      focus to it on close (cleanup runs when `isOpen` flips false).
  //   2. Trap Tab inside the dialog so keyboard users don't accidentally
  //      tab into the page beneath while still in the auth flow.
  // Initial focus is provided by the form's `autoFocus` on the email input,
  // so we don't force-focus anything ourselves on open.
  useEffect(() => {
    if (!isOpen) return
    const previouslyFocused = document.activeElement as HTMLElement | null

    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('aria-hidden'))
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [isOpen])

  if (!isOpen) return null

  // Stay on the current page after sign-in unless an explicit `next` was
  // provided when opening. router.refresh() re-runs RSCs so the page picks
  // up the new auth state (header pill, gated content, etc.).
  function handleSignInSuccess() {
    close()
    if (next) router.push(next)
    router.refresh()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'sign-in' ? 'Sign in' : 'Create your account'}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
    >
      {/* Backdrop — visual only; clicks do NOT dismiss the modal. The X
          button is the sole exit so users don't fall out of the auth flow
          accidentally. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-sand-950/80 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-md rounded-xl border border-sand-300 bg-sand-100 p-8 shadow-2xl dark:border-sand-800 dark:bg-sand-900"
      >
        <Button
          variant="icon"
          size="md"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3"
        >
          <X weight="regular" size={18} />
        </Button>

        {mode === 'sign-in' ? (
          <SignInFormFields
            next={next ?? '/'}
            onSuccess={handleSignInSuccess}
            onSwitchToSignUp={() => setMode('sign-up')}
          />
        ) : (
          <SignUpFormFields
            next={next ?? '/'}
            onSwitchToSignIn={() => setMode('sign-in')}
          />
        )}
      </div>
    </div>
  )
}
