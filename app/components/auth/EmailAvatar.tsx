// ─── EmailAvatar ─────────────────────────────────────────────────────────────
// Deterministic gradient circle seeded by the email hash — same email always
// renders the same two-hue gradient at the same angle, no storage required.
// Used wherever a user identity glyph is needed (top pill, sidebar menu,
// account page header).
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

type Props = {
  email: string
  className?: string
}

export function EmailAvatar({ email, className = '' }: Props) {
  const { hue1, hue2, angle } = gradientFromEmail(email)
  return (
    <span
      aria-hidden="true"
      className={`block rounded-full ${className}`}
      style={{
        background: `linear-gradient(${angle}deg, hsl(${hue1} 55% 55%), hsl(${hue2} 55% 40%))`,
      }}
    />
  )
}
