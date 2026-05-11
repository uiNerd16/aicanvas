'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { X } from '@phosphor-icons/react'
import { useAuthModal } from './AuthModalProvider'
import { SignInFormFields } from './SignInFormFields'
import { SignUpFormFields } from './SignUpFormFields'

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
      <div className="relative z-10 w-full max-w-md rounded-xl border border-sand-300 bg-sand-100 p-8 shadow-2xl dark:border-sand-800 dark:bg-sand-900">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-200 hover:text-sand-900 dark:hover:bg-sand-800 dark:hover:text-sand-100"
        >
          <X weight="regular" size={18} />
        </button>

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
