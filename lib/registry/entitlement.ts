// The per-install metered decision model lived here (decide()/Decision); it was
// removed when installs became uncounted (free content needs only an account,
// premium content is gated by tier). Only the Tier type remains — the shared
// entitlement vocabulary imported across the identity and registry layers.
export type Tier = 'anonymous' | 'free' | 'premium'
