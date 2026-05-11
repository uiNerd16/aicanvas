import { createClient } from '../../../lib/supabase/server'
import { SettingsForm } from './SettingsForm'
import { DeleteAccountSection } from './DeleteAccountSection'
import type { AiPlatform, PackageManager } from '../../../lib/supabase/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('user_preferences')
    .select('package_manager, ai_platform, newsletter_opt_in')
    .eq('user_id', user.id)
    .maybeSingle()

  const initial = {
    package_manager: (data?.package_manager ?? null) as PackageManager | null,
    ai_platform: (data?.ai_platform ?? null) as AiPlatform | null,
    // Default FALSE — GDPR Art. 7 requires explicit opt-in for marketing
    // emails. Users can flip the flag on from /account/settings.
    newsletter_opt_in: data?.newsletter_opt_in ?? false,
  }

  return (
    <div className="space-y-4">
      <SettingsForm initial={initial} />
      <DeleteAccountSection />
    </div>
  )
}
