import type { ReactNode } from 'react'

// Forces the scroll container background to match Andromeda's void colour
// (#0E0E0F) so it doesn't bleed the site's sand-950 when scrolling.
export default function AndromedaLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100%', backgroundColor: '#0E0E0F' }}>
      {children}
    </div>
  )
}
