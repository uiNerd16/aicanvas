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
