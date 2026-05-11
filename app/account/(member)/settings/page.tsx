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
    // Default true matches the DB column default and the implicit opt-in
    // recorded at sign-up via the § 7 (3) UWG notice on the sign-up form.
    newsletter_opt_in: data?.newsletter_opt_in ?? true,
  }

  return (
    <div className="space-y-4">
      <SettingsForm initial={initial} />
      <DeleteAccountSection />
    </div>
  )
}
