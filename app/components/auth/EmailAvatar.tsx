// ─── EmailAvatar ─────────────────────────────────────────────────────────────
// Identity glyph for the signed-in user. When the account has a profile photo
// (Google fills one in at sign-in) it is painted on top; otherwise the circle
// falls back to a deterministic gradient seeded by the email hash — same email
// always renders the same two-hue gradient at the same angle, no storage
// required. Used in the top pill, the sidebar menu and the account header.
//
// The photo is a CSS background layer stacked OVER the gradient rather than an
// <img>, so a missing, slow or dead photo URL degrades to the gradient with no
// client JS and no error handler — this component stays server-renderable.
//
// Saturation and lightness are clamped to a muted mid-tone range so the
// gradient sits comfortably alongside the sand/olive palette in both themes.
// Hue and angle are derived from a 32-bit FNV-1a hash of the email so the
// distribution covers the wheel without bias from short or alphabetic inputs.

function hashEmail(email: string): number {
  let h = 2166136261
  const lower = email.toLowerCase()
  for (let i = 0; i < lower.length; i++) {
    h = Math.imul(h ^ lower.charCodeAt(i), 16777619)
  }
  return h >>> 0
}

function gradientFromEmail(email: string) {
  const h = hashEmail(email)
  // Two hues 60–120° apart for visible duotone without clashing.
  const hue1 = h % 360
  const hue2 = (hue1 + 60 + ((h >>> 9) % 60)) % 360
  const angle = (h >>> 18) % 360
  return { hue1, hue2, angle }
}

type UserLike = { user_metadata?: Record<string, unknown> | null } | null | undefined

// Google hands us a 96px photo (…=s96-c). The largest circle we draw is 64px,
// so ask for 128 — sharp on retina, and one URL for every size on the page
// means the browser downloads it once.
const PHOTO_PX = 128

/**
 * Profile photo URL an OAuth provider stored on the account, if any. Supabase
 * writes Google's picture claim into user_metadata at sign-in under both
 * `avatar_url` and `picture`; neither is present for email/password accounts.
 * Only a plain https URL is accepted, since the value lands in a CSS url().
 */
export function photoFromUser(user: UserLike): string | undefined {
  const meta = user?.user_metadata
  if (!meta) return undefined
  const url = meta.avatar_url ?? meta.picture
  if (typeof url !== 'string') return undefined
  if (!/^https:\/\/[^\s'"()\\]+$/.test(url)) return undefined
  // googleusercontent takes the size as a path suffix, so replace whatever
  // suffix came with the URL. `-c` crops to a square, which the circle wants.
  if (!/^https:\/\/[a-z0-9-]+\.googleusercontent\.com\//.test(url)) return url
  return `${url.replace(/=[-\w]*$/, '')}=s${PHOTO_PX}-c`
}

type Props = {
  email: string
  photoUrl?: string
  className?: string
}

export function EmailAvatar({ email, photoUrl, className = '' }: Props) {
  const { hue1, hue2, angle } = gradientFromEmail(email)
  const gradient = `linear-gradient(${angle}deg, hsl(${hue1} 55% 55%), hsl(${hue2} 55% 40%))`
  return (
    <span
      aria-hidden="true"
      className={`block rounded-full bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: photoUrl ? `url("${photoUrl}"), ${gradient}` : gradient,
      }}
    />
  )
}
