import { createClient } from '../../../lib/supabase/server'
import { SettingsForm } from './SettingsForm'
import { PasswordSection } from './PasswordSection'
import { AccountBilling } from './AccountBilling'
import { McpTokenSection } from './McpTokenSection'
import { DeleteAccountSection } from './DeleteAccountSection'
import type { PackageManager } from '../../../lib/supabase/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // ai_platform is no longer read: the multi-platform prompt drawer is gone
  // (one general Remix prompt now), so the preference has nothing to drive.
  // The column stays in Supabase untouched.
  const { data } = await supabase
    .from('user_preferences')
    .select('package_manager, newsletter_opt_in')
    .eq('user_id', user.id)
    .maybeSingle()

  const initial = {
    package_manager: (data?.package_manager ?? null) as PackageManager | null,
    // Default false matches the DB column default (migration 0007) — the
    // newsletter is explicit opt-in, off until the user turns it on here.
    newsletter_opt_in: data?.newsletter_opt_in ?? false,
  }

  // change vs set mode = whether the account has a usable password. Providers
  // can't tell us (setting a password on a Google account doesn't add an
  // 'email' identity), so read encrypted_password via a self-scoped RPC.
  const { data: hasPw } = await supabase.rpc('current_user_has_password')
  const hasPassword = hasPw === true

  // MCP access token — same RLS-scoped read the /api/me/token route uses.
  // Resilient: any error (e.g. table not migrated) falls back to null, and the
  // section renders its "not set up yet" state instead of breaking the page.
  const { data: keyRow } = await supabase
    .from('user_api_keys')
    .select('token')
    .eq('user_id', user.id)
    .maybeSingle()
  const apiToken = (keyRow?.token ?? null) as string | null

  return (
    <div className="space-y-4">
      <SettingsForm initial={initial} />
      <PasswordSection hasPassword={hasPassword} email={user.email ?? ''} />
      <AccountBilling />
      {/* Rendered outside AccountBilling so the token never depends on the
          premium/billing feature flag — it always shows for signed-in users. */}
      <McpTokenSection token={apiToken} />
      <DeleteAccountSection />
    </div>
  )
}
