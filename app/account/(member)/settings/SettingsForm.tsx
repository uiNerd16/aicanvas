'use client'

import { useState } from 'react'
import { Check } from '@phosphor-icons/react'
import { useSession } from '../../../components/auth/SessionProvider'
import type { AiPlatform, PackageManager } from '../../../lib/supabase/types'

const PACKAGE_MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun']
const AI_PLATFORMS: AiPlatform[] = ['Claude Code', 'Lovable', 'V0']

type Initial = {
  package_manager: PackageManager | null
  ai_platform: AiPlatform | null
  newsletter_opt_in: boolean
}

// Three preferences with autosave-on-click. The "Saved" affordance is owned
// by each field (rendered inline at the end of its row) so the user sees
// confirmation right next to the control they just touched — no global
// indicator floating above the cards.
export function SettingsForm({ initial }: { initial: Initial }) {
  const { updatePreferences } = useSession()
  const [pkg, setPkg] = useState<PackageManager | null>(initial.package_manager)
  const [platform, setPlatform] = useState<AiPlatform | null>(initial.ai_platform)
  const [newsletter, setNewsletter] = useState<boolean>(initial.newsletter_opt_in)

  async function selectPkg(value: PackageManager | null) {
    setPkg(value)
    await updatePreferences({ package_manager: value })
  }

  async function selectPlatform(value: AiPlatform | null) {
    setPlatform(value)
    await updatePreferences({ ai_platform: value })
  }

  async function selectNewsletter(value: boolean) {
    setNewsletter(value)
    await updatePreferences({ newsletter_opt_in: value })
  }

  return (
    <div className="space-y-4">
      <Field
        label="Preferred package manager"
        description="The CLI install drawer opens with this selected."
        value={pkg}
        options={PACKAGE_MANAGERS}
        onSelect={selectPkg}
      />

      <Field
        label="Preferred AI platform"
        description="Used when a prompt drawer offers multiple platforms."
        value={platform}
        options={AI_PLATFORMS}
        onSelect={selectPlatform}
      />

      <BooleanField
        label="Marketing emails"
        description="Occasional updates about AI Canvas — new components, design-system releases, MCP changes. Transactional emails (sign-up confirmation, magic links, password reset) are unaffected."
        value={newsletter}
        onSelect={selectNewsletter}
        onLabel="Subscribed"
        offLabel="Unsubscribed"
      />
    </div>
  )
}

// useSavedFlash — fires a 1.5s "Saved" tick after an async write resolves.
// Local to each field so multiple fields can flash independently.
function useSavedFlash() {
  const [saved, setSaved] = useState(false)
  function flash() {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }
  return { saved, flash }
}

function SavedTick({ visible }: { visible: boolean }) {
  return (
    <span
      aria-live="polite"
      className={`ml-auto text-xs font-semibold transition-opacity ${
        visible ? 'text-olive-500 opacity-100' : 'opacity-0'
      }`}
    >
      Saved
    </span>
  )
}

// Pill button — active state shows an inline check before the label.
function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? 'border-olive-500 bg-olive-500/15 text-olive-600 dark:text-olive-400'
          : 'border-sand-300 bg-sand-50 text-sand-700 hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100'
      }`}
    >
      {active && <Check weight="bold" size={12} />}
      {children}
    </button>
  )
}

// Each field is its own card surface so the three preferences don't read as
// one undifferentiated block — title + description sit on a sand-100 card
// (sand-900 dark) with consistent padding. The Saved tick appears at the
// end of the pill row when the most recent change persisted.
function Field<T extends string>({
  label,
  description,
  value,
  options,
  onSelect,
}: {
  label: string
  description: string
  value: T | null
  options: readonly T[]
  onSelect: (value: T | null) => Promise<void>
}) {
  const { saved, flash } = useSavedFlash()

  async function handle(opt: T) {
    const active = value === opt
    await onSelect(active ? null : opt)
    flash()
  }

  return (
    <div className="rounded-xl border border-sand-300 bg-sand-100 p-6 dark:border-sand-800 dark:bg-sand-900">
      <div className="text-lg font-bold text-sand-900 dark:text-sand-50">{label}</div>
      <div className="mt-1 text-sm text-sand-600 dark:text-sand-400">{description}</div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {options.map((opt) => (
          <Pill key={opt} active={value === opt} onClick={() => handle(opt)}>
            {opt}
          </Pill>
        ))}
        <SavedTick visible={saved} />
      </div>
    </div>
  )
}

// Boolean variant of Field — two pills, strict on/off (no null state). Used
// for /account/settings's marketing-emails toggle so the user can't end up
// in a "neither subscribed nor unsubscribed" limbo state.
function BooleanField({
  label,
  description,
  value,
  onSelect,
  onLabel,
  offLabel,
}: {
  label: string
  description: string
  value: boolean
  onSelect: (value: boolean) => Promise<void>
  onLabel: string
  offLabel: string
}) {
  const { saved, flash } = useSavedFlash()

  async function handle(opt: boolean) {
    await onSelect(opt)
    flash()
  }

  return (
    <div className="rounded-xl border border-sand-300 bg-sand-100 p-6 dark:border-sand-800 dark:bg-sand-900">
      <div className="text-lg font-bold text-sand-900 dark:text-sand-50">{label}</div>
      <div className="mt-1 text-sm text-sand-600 dark:text-sand-400">{description}</div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[true, false].map((opt) => (
          <Pill key={String(opt)} active={value === opt} onClick={() => handle(opt)}>
            {opt ? onLabel : offLabel}
          </Pill>
        ))}
        <SavedTick visible={saved} />
      </div>
    </div>
  )
}
