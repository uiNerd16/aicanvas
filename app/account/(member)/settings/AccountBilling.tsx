'use client'

import { useState } from 'react'
import { Crown, Key } from '@phosphor-icons/react'
import { premiumEnabled } from '../../../../lib/flags'
import { buttonClasses } from '../../../components/buttonClasses'
import { usePaywallModal } from '../../../components/billing/PaywallModalProvider'
import { usePremiumStatus } from '../../../components/billing/usePremiumStatus'

/**
 * Account billing + token controls. Flag-gated (premium UI). Premium users get
 * the Paddle customer portal ("Manage subscription"); free users get an
 * "Upgrade to Premium" CTA that opens the upgrade modal. "Rotate API token" is
 * for any signed-in user: the one-click fix for a leaked token.
 */
export function AccountBilling() {
  const { open: openPaywall } = usePaywallModal()
  const status = usePremiumStatus()
  const [portalLoading, setPortalLoading] = useState(false)
  const [noPortal, setNoPortal] = useState(false)
  const [rotateState, setRotateState] = useState<'idle' | 'rotating' | 'done' | 'error'>('idle')

  if (!premiumEnabled()) return null

  async function manageSubscription() {
    setPortalLoading(true)
    setNoPortal(false)
    try {
      const res = await fetch('/api/billing/portal')
      const { url } = await res.json()
      if (url) {
        window.location.href = url
        return
      }
      setNoPortal(true)
    } catch {
      setNoPortal(true)
    } finally {
      setPortalLoading(false)
    }
  }

  async function rotateToken() {
    setRotateState('rotating')
    try {
      const res = await fetch('/api/me/token/rotate', { method: 'POST' })
      setRotateState(res.ok ? 'done' : 'error')
    } catch {
      setRotateState('error')
    }
  }

  return (
    <section className="rounded-2xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900">
      <h2 className="text-base font-bold text-sand-900 dark:text-sand-50">Subscription &amp; access</h2>
      <p className="mt-1 text-sm text-sand-500 dark:text-sand-400">
        {status === 'premium'
          ? "You're on Premium."
          : status === 'not-premium'
            ? "You're on the Free plan."
            : 'Checking your plan…'}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {status === 'premium' ? (
          <button
            type="button"
            onClick={manageSubscription}
            disabled={portalLoading}
            className={buttonClasses({ variant: 'outline', size: 'sm' })}
          >
            <Crown weight="regular" size={15} />
            {portalLoading ? 'Opening…' : 'Manage subscription'}
          </button>
        ) : status === 'not-premium' ? (
          <button
            type="button"
            onClick={() => openPaywall({ reason: 'upgrade' })}
            className={buttonClasses({ variant: 'primary', size: 'sm' })}
          >
            <Crown weight="regular" size={15} />
            Upgrade to Premium
          </button>
        ) : (
          <button type="button" disabled className={buttonClasses({ variant: 'outline', size: 'sm' })}>
            <Crown weight="regular" size={15} />
            Checking your plan…
          </button>
        )}

        <button
          type="button"
          onClick={rotateToken}
          disabled={rotateState === 'rotating'}
          className={buttonClasses({ variant: 'outline', size: 'sm' })}
        >
          <Key weight="regular" size={15} />
          {rotateState === 'rotating' ? 'Rotating…' : 'Rotate API token'}
        </button>
      </div>

      {noPortal && (
        <p className="mt-3 text-xs text-sand-500 dark:text-sand-400">
          No active subscription to manage.
        </p>
      )}
      {rotateState === 'done' && (
        <p className="mt-3 text-xs text-olive-600 dark:text-olive-400">
          Done. The old token is now disabled. Grab a fresh install command from any component page.
        </p>
      )}
      {rotateState === 'error' && (
        <p className="mt-3 text-xs text-red-500">Could not rotate the token. Try again.</p>
      )}
    </section>
  )
}
