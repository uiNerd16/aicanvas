'use client'

import { useRouter } from 'next/navigation'
import { getPaddle, PRICES, type BillingCycle } from '../../lib/paddle/client'
import { useSession } from '../auth/SessionProvider'
import { checkoutComingSoon } from '../../../lib/flags'

/**
 * Opens the Paddle overlay for the chosen cycle. Premium requires an account
 * (the subscription attaches to user_id), so signed-out users are routed to
 * sign-up first. customData.user_id lets the webhook + activation endpoint
 * attribute the sale.
 */
export function UpgradeButton({
  cycle,
  children,
  className,
}: {
  cycle: BillingCycle
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()
  const { user } = useSession()

  // Checkout is only possible once the Paddle env is configured. We also show a
  // deliberate "Coming soon" state during the Paddle review window (flag on, or
  // env not configured): the Premium card stays visible for Paddle to verify the
  // product, but the CTA is dormant rather than opening a broken/erroring overlay.
  const configured = Boolean(PRICES[cycle] && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN)
  const comingSoon = checkoutComingSoon() || !configured

  async function onClick() {
    if (comingSoon) return
    if (!user) {
      router.push('/account/sign-up?next=/pricing&intent=premium')
      return
    }
    const paddle = await getPaddle()
    paddle?.Checkout.open({
      items: [{ priceId: PRICES[cycle], quantity: 1 }],
      customer: user.email ? { email: user.email } : undefined,
      customData: { user_id: user.id },
      settings: { displayMode: 'overlay', theme: 'dark' },
    })
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={comingSoon}
      aria-disabled={comingSoon}
      title={comingSoon ? 'Available soon' : undefined}
    >
      {comingSoon ? 'Coming soon' : children}
    </button>
  )
}
