'use client'

import { getPaddle, PRICES, type BillingCycle } from '../../lib/paddle/client'
import { useSession } from '../auth/SessionProvider'
import { checkoutComingSoon } from '../../../lib/flags'

/**
 * Opens the Paddle overlay for the chosen cycle. No account is required up
 * front: signed-out users check out anonymously (Paddle collects the email),
 * and the webhook provisions the account from that email, then emails a
 * magic-link claim. Signed-in users pass customData.user_id so the webhook +
 * activation endpoint attribute the sale to the existing account.
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
  const { user } = useSession()

  // Checkout is only possible once the Paddle env is configured. When the flag
  // is on (or env is not configured), the CTA renders as a dormant "Coming soon"
  // button rather than opening a broken/erroring overlay.
  const configured = Boolean(PRICES[cycle] && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN)
  const comingSoon = checkoutComingSoon() || !configured

  async function onClick() {
    if (comingSoon) return
    const paddle = await getPaddle()
    // showAddDiscounts:false hides the public "Add discount" box, so promos are
    // never offered to every visitor (protects conversion against coupon-fishing).
    // Instead a targeted link carries the code: a ?promo=CODE in the URL is passed
    // to Checkout.open as discountCode and applied silently. Paddle ignores an
    // unknown code and opens at full price, so no validation is needed here.
    //
    // Signed-in: attribute the sale to the account up front (user_id + email).
    // Signed-out: open anonymously, Paddle collects the email itself and the
    // webhook keys the new/linked account off it (no user_id to pass).
    const promo = new URLSearchParams(window.location.search).get('promo')?.trim()
    paddle?.Checkout.open({
      items: [{ priceId: PRICES[cycle], quantity: 1 }],
      ...(user
        ? {
            customer: user.email ? { email: user.email } : undefined,
            customData: { user_id: user.id },
          }
        : {}),
      ...(promo ? { discountCode: promo } : {}),
      settings: { displayMode: 'overlay', theme: 'light', showAddDiscounts: false },
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
