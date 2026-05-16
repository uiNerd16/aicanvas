'use client'

import { Heart } from '@phosphor-icons/react'
import { useSession } from './auth/SessionProvider'
import { Button, buttonClasses } from './Button'

// ─── SaveButton ───────────────────────────────────────────────────────────────
// Heart toggle for saving a component. Renders as a 32×32 icon-only Button
// from the unified system (size="sm") so it aligns with the sm label buttons
// it sits next to in the component action bar. Saved-state styling (olive
// heart) is layered on top via className.

type SaveButtonProps = {
  slug: string
  system?: string | null
  className?: string
  size?: number
}

export function SaveButton({ slug, system = null, className = '', size = 15 }: SaveButtonProps) {
  const { user, savedSlugs, toggleSaved } = useSession()
  if (!user) return null

  const saved = savedSlugs.has(slug)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    void toggleSaved(slug, system)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      iconOnly
      onClick={handleClick}
      aria-label={saved ? 'Unsave component' : 'Save component'}
      aria-pressed={saved}
      className={`${saved ? 'text-olive-500 dark:text-olive-400' : ''} ${className}`.trim()}
    >
      <Heart weight={saved ? 'fill' : 'regular'} size={size} />
    </Button>
  )
}
