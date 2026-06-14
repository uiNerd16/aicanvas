/** Pure flag reader. Pass the raw env value; defaults to off. */
export function isPremiumEnabled(raw: string | undefined): boolean {
  return raw === 'true'
}

/**
 * Master switch for all premium/subscription UI (and, later, enforcement).
 * Off = today's fully-free site. This is also the kill switch.
 * NEXT_PUBLIC_ so client components can branch on it; the value is inlined
 * at build time on both server and client.
 */
export function premiumEnabled(): boolean {
  return isPremiumEnabled(process.env.NEXT_PUBLIC_PREMIUM_ENABLED)
}

/** Pure reader for the checkout coming-soon flag; defaults to off. */
export function isCheckoutComingSoon(raw: string | undefined): boolean {
  return raw === 'true'
}

/**
 * When true, the upgrade CTA renders as a disabled "Coming soon" button even
 * if Paddle is configured. Use this during the Paddle review window: show the
 * pricing / Premium card so Paddle can verify the product, but keep the
 * checkout dormant until the account is approved. Flip to false (and set the
 * live Paddle keys) to go live. NEXT_PUBLIC_ so the client button can branch.
 */
export function checkoutComingSoon(): boolean {
  return isCheckoutComingSoon(process.env.NEXT_PUBLIC_CHECKOUT_COMING_SOON)
}
