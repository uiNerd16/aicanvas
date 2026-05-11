/**
 * Fire-and-forget install logger. Called when a logged-in user copies a CLI
 * command. Server returns 204 silently for anonymous users; we never block UI.
 */
export function trackInstall(slug: string, system: string | null, pkgManager: string) {
  fetch('/api/history', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug, system, pkg_manager: pkgManager }),
  }).catch(() => {})
}
