'use client'

import { useRouter } from 'next/navigation'
import { getPaddle, PRICES, type BillingCycle } from '../../lib/paddle/client'
import { useSession } from '../auth/SessionProvider'

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

  // Checkout is only possible once the Paddle env is configured. Render a
  // disabled CTA instead of opening a broken overlay (or silently failing
  // after payment because the server half is missing).
  const configured = Boolean(PRICES[cycle] && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN)

  async function onClick() {
    if (!user) {
      router.push('/account/sign-up?next=/pricing&intent=premium')
      return
    }
    if (!configured) return
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
      disabled={Boolean(user) && !configured}
      title={user && !configured ? 'Checkout is not configured yet' : undefined}
    >
      {children}
    </button>
  )
}
