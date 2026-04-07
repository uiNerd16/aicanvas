import { GithubLogo, XLogo } from '@phosphor-icons/react'
import { GITHUB_URL, X_URL } from '../lib/config'

// ─── HeaderSocials ────────────────────────────────────────────────────────────
// Two icon-only links (GitHub + X) intended for the right side of any sticky
// page header. Borderless ghost buttons with a soft sand-tinted hover halo.

export function HeaderSocials() {
  return (
    <div className="flex items-center gap-1">
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
      >
        <GithubLogo weight="regular" size={20} />
      </a>

      <a
        href={X_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X profile"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
      >
        <XLogo weight="regular" size={20} />
      </a>
    </div>
  )
}
