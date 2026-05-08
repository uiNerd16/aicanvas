'use client'

import { Heart } from '@phosphor-icons/react'
import { useSession } from './auth/SessionProvider'

type SaveButtonProps = {
  slug: string
  system?: string | null
  className?: string
  size?: number
}

export function SaveButton({ slug, system = null, className = '', size = 16 }: SaveButtonProps) {
  const { user, savedSlugs, toggleSaved } = useSession()
  if (!user) return null

  const saved = savedSlugs.has(slug)

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
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-sand-300 bg-sand-50/90 text-sand-600 backdrop-blur-sm transition-colors hover:border-sand-400 hover:text-olive-500 dark:border-sand-700 dark:bg-sand-900/90 dark:text-sand-400 dark:hover:border-sand-600 dark:hover:text-olive-400 ${
        saved ? 'text-olive-500 dark:text-olive-400' : ''
      } ${className}`}
    >
      <Heart weight={saved ? 'fill' : 'regular'} size={size} />
    </button>
  )
}
