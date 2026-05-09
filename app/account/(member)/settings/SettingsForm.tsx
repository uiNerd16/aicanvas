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
}

// Two preferences with autosave-on-click. Optimistic local state + a brief
// "Saved" affordance so the user knows the change persisted.
export function SettingsForm({ initial }: { initial: Initial }) {
  const { updatePreferences } = useSession()
  const [pkg, setPkg] = useState<PackageManager | null>(initial.package_manager)
  const [platform, setPlatform] = useState<AiPlatform | null>(initial.ai_platform)
  const [savedTick, setSavedTick] = useState(false)

  async function flashSaved() {
    setSavedTick(true)
    setTimeout(() => setSavedTick(false), 1500)
  }

  async function selectPkg(value: PackageManager | null) {
    setPkg(value)
    await updatePreferences({ package_manager: value })
    void flashSaved()
  }

  async function selectPlatform(value: AiPlatform | null) {
    setPlatform(value)
    await updatePreferences({ ai_platform: value })
    void flashSaved()
  }

  return (
    <div className="space-y-8">
      {/* Saved indicator floats beside the heading area */}
      <div
        aria-live="polite"
        className={`flex items-center gap-1.5 text-xs font-semibold transition-opacity ${
          savedTick ? 'text-olive-500 opacity-100' : 'text-transparent opacity-0'
        }`}
      >
        <Check weight="bold" size={12} />
        Saved
      </div>

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
    </div>
  )
}

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
  onSelect: (value: T | null) => void
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-sand-900 dark:text-sand-50">{label}</div>
      <div className="mt-1 text-xs text-sand-500 dark:text-sand-400">{description}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(active ? null : opt)}
              className={`rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? 'border-olive-500 bg-olive-500/15 text-olive-600 dark:text-olive-400'
                  : 'border-sand-300 bg-sand-100 text-sand-700 hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
