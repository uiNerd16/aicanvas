'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { X } from '@phosphor-icons/react'
import { PremiumCards } from './PremiumCards'
import { PaymentMethods } from './PaymentMethods'

// ─── PaywallModalProvider ───────────────────────────────────────────────────
// Global, full-screen upgrade modal — the paywall equivalent of AuthModal.
// Mounted once at the root layout so it overlays the WHOLE viewport (a modal
// rendered inside a component card would be clipped by the card's transforms).
// Any locked surface calls usePaywallModal().open({ reason }); calling it from
// several locked panes at once is harmless — there is only ever one modal.

// Per-install metering is gone, so nothing in the install flow produces
// 'quota-exceeded' any more — the only locked state is premium content. The
// literal is kept in the union solely so other surfaces that still reference
// it stay type-correct; it now renders the same premium-only modal.
export type PaywallReason = 'premium-only' | 'quota-exceeded' | 'upgrade'

type PaywallState = { reason: PaywallReason; limit?: number; resetAt?: string | null }

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
      {state && (
        <PaywallModalView
          reason={state.reason}
          onClose={close}
        />
      )}
    </PaywallModalContext.Provider>
  )
}

function PaywallModalView({
  reason,
  onClose,
}: PaywallState & { onClose: () => void }) {
  // Metering is gone, so the modal only ever pitches Premium content now.
  // Both the 'premium-only' and the legacy 'quota-exceeded' reason collapse to
  // a single Premium card.
  const title = reason === 'upgrade' ? 'Upgrade to Premium' : 'Premium component'
  const subtitle =
    reason === 'upgrade'
      ? null
      : 'Design systems and templates are part of Premium. Unlock every one, plus unlimited installs.'

  // Lock body scroll + close on Escape while open. Backdrop clicks also close
  // (this is a soft upgrade pitch, not a flow you must complete).
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

      {/* Width hugs the content: just the single Premium card + padding. */}
      <div className="relative z-10 my-auto w-full max-w-lg rounded-2xl bg-sand-950 p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-sand-400 transition-colors hover:bg-sand-800 hover:text-sand-100"
        >
          <X weight="regular" size={18} />
        </button>

        <div className="text-center">
          <h3 className="text-xl font-bold text-sand-50">{title}</h3>
          {subtitle && (
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-sand-400">{subtitle}</p>
          )}
        </div>

        <div className="mt-5">
          <PremiumCards show="premium-only" compact />
        </div>

        {/* Accepted payment methods — a card-width container matching the
            Premium card so it reads as the bottom of the same column. */}
        <div className="mx-auto mt-5 max-w-md rounded-2xl border border-sand-800 bg-sand-900/50 px-4 py-3">
          <PaymentMethods />
        </div>
      </div>
    </div>
  )
}
