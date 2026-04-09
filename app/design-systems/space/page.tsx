'use client'

import { JetBrains_Mono } from 'next/font/google'
import MissionControl from '../../../components-workspace/design-systems/space/examples/mission-control'

// JetBrains Mono is the only font in the Space design system.
// next/font self-hosts it, subsets it, and exposes it as a CSS variable
// (--font-jetbrains-mono) that the Space tokens reference.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export default function SpacePage() {
  return (
    <div
      className={jetbrainsMono.variable}
      style={{
        minHeight: '100vh',
        backgroundColor: '#0E0E0F',
        backgroundImage: 'url(https://ik.imagekit.io/aitoolkit/design%20systems/universe%20bg%202.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <MissionControl />
    </div>
  )
}
