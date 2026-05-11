'use client'

import { Heart } from '@phosphor-icons/react'
import { useSession } from './auth/SessionProvider'

// ─── SaveButton ───────────────────────────────────────────────────────────────
// Heart toggle for saving a component. Two visual variants:
//   • 'pill'   — round 32px circle, used as a card overlay on the homepage
//                grid (the original look).
//   • 'action' — 38px square with rounded-lg corners, matched to the action
//                bar on /components/[slug] so it lines up with "Copy CLI" and
//                "Remix with AI" by height + corner radius + border weight.
// `className` is appended raw so callers can still tweak spacing on either.

type Variant = 'pill' | 'action'

type SaveButtonProps = {
  slug: string
  system?: string | null
  className?: string
  size?: number
  variant?: Variant
}

const VARIANT_CLASSES: Record<Variant, string> = {
  pill:
    'flex h-8 w-8 items-center justify-center rounded-full border border-sand-300 bg-sand-50/90 text-sand-600 backdrop-blur-sm transition-colors hover:border-sand-400 hover:text-olive-500 dark:border-sand-700 dark:bg-sand-900/90 dark:text-sand-400 dark:hover:border-sand-600 dark:hover:text-olive-400',
  action:
    'flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-sand-300 bg-transparent text-sand-700 transition-all hover:border-sand-400 hover:text-olive-500 active:scale-95 dark:border-sand-700 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-olive-400',
}

export function SaveButton({
  slug,
  system = null,
  className = '',
  size,
  variant = 'pill',
}: SaveButtonProps) {
  const { user, savedSlugs, toggleSaved } = useSession()
  if (!user) return null

  const saved = savedSlugs.has(slug)
  const iconSize = size ?? (variant === 'action' ? 15 : 16)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    void toggleSaved(slug, system)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Unsave component' : 'Save component'}
      aria-pressed={saved}
      className={`${VARIANT_CLASSES[variant]} ${
        saved ? 'text-olive-500 dark:text-olive-400' : ''
      } ${className}`}
    >
      <Heart weight={saved ? 'fill' : 'regular'} size={iconSize} />
    </button>
  )
}
