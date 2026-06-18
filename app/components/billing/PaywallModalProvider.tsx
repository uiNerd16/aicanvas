'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { LockSimple, Sparkle, X } from '@phosphor-icons/react'
import { useSession } from '../auth/SessionProvider'
import { PremiumCards } from './PremiumCards'

// ─── PaywallModalProvider ───────────────────────────────────────────────────
// Global, full-screen upgrade modal — the paywall equivalent of AuthModal.
// Mounted once at the root layout so it overlays the WHOLE viewport (a modal
// rendered inside a component card would be clipped by the card's transforms).
// Any locked surface calls usePaywallModal().open({ reason }); calling it from
// several locked panes at once is harmless — there is only ever one modal.

export type PaywallReason = 'premium-only' | 'quota-exceeded'

type PaywallState = { reason: PaywallReason; limit?: number }

type PaywallModalContextValue = {
  open: (state: PaywallState) => void
  close: () => void
}

const PaywallModalContext = createContext<PaywallModalContextValue | null>(null)

export function usePaywallModal(): PaywallModalContextValue {
  const ctx = useContext(PaywallModalContext)
  if (!ctx) throw new Error('usePaywallModal must be used within PaywallModalProvider')
  return ctx
}

export function PaywallModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PaywallState | null>(null)
  const open = useCallback((next: PaywallState) => setState(next), [])
  const close = useCallback(() => setState(null), [])

  return (
    <PaywallModalContext.Provider value={{ open, close }}>
      {children}
      {state && <PaywallModalView reason={state.reason} limit={state.limit} onClose={close} />}
    </PaywallModalContext.Provider>
  )
}

function PaywallModalView({
  reason,
  limit,
  onClose,
}: PaywallState & { onClose: () => void }) {
  const { user } = useSession()
  const isAnonymous = !user

  // premium-only: a free account doesn't unlock it → just the Premium card.
  // quota-exceeded + anonymous: both cards (sign up free OR go Premium).
  // quota-exceeded + signed-in free: just the Premium card (already on 10/day).
  const show = reason === 'quota-exceeded' && isAnonymous ? 'both' : 'premium-only'

  const title = reason === 'premium-only' ? 'Premium component' : 'Daily limit reached'
  const subtitle =
    reason === 'premium-only'
      ? 'Design systems and templates are part of Premium. Unlock every one, plus unlimited installs.'
      : isAnonymous
        ? `You've used your ${limit ?? 2} free installs for today. A free account gets you 10 a day, and Premium lifts the limit entirely.`
        : `You've used your ${limit ?? 10} installs for today. Premium lifts the daily limit entirely.`

  // Lock body scroll + close on Escape while open. Backdrop clicks also close
  // (this is a soft "you hit a limit" notice, not a flow you must complete).
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to Premium"
      className="dark fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto px-4 py-8 sm:items-center"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-sand-950/85 backdrop-blur-sm"
      />

      <div className="relative z-10 my-auto w-full max-w-3xl rounded-2xl border border-sand-800 bg-sand-950 p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-sand-400 transition-colors hover:bg-sand-800 hover:text-sand-100"
        >
          <X weight="regular" size={18} />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-sand-800 bg-sand-900">
            <LockSimple weight="regular" size={20} className="text-olive-400" />
          </div>
          <h3 className="text-xl font-bold text-sand-50">{title}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-sand-400">{subtitle}</p>
        </div>

        <div className="mt-6">
          <PremiumCards show={show} compact />
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-sand-500">
          <Sparkle weight="regular" size={12} className="text-olive-400" />
          Remix with AI stays free for everyone.
        </p>
      </div>
    </div>
  )
}
