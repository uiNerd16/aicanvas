export type SavedComponent = {
  user_id: string
  slug: string
  system: string | null
  collection: string | null
  saved_at: string
}

export type InstallHistoryRow = {
  id: number
  user_id: string
  slug: string
  system: string | null
  pkg_manager: string | null
  copied_at: string
}

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'
export type AiPlatform = 'Claude Code' | 'Lovable' | 'V0'

export type UserPreferences = {
  user_id: string
  package_manager: PackageManager | null
  ai_platform: AiPlatform | null
  newsletter_opt_in: boolean
  updated_at: string
}

export type UserApiKey = {
  user_id: string
  token: string
  created_at: string
  expires_at: string
  last_used_at: string | null
  revoked: boolean
}

export type SubscriptionStatus =
  | 'none' | 'active' | 'trialing' | 'past_due' | 'paused' | 'canceled'

export type UserSubscription = {
  user_id: string
  paddle_customer_id: string | null
  paddle_subscription_id: string | null
  status: SubscriptionStatus
  plan: 'monthly' | 'annual' | null
  current_period_end: string | null
  last_event_at: string | null
  updated_at: string
}
