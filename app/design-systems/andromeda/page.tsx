'use client'

import { JetBrains_Mono } from 'next/font/google'
import MissionControl from '../../../design-systems/andromeda/examples/mission-control'

// JetBrains Mono is the only font in the Andromeda design system.
// next/font self-hosts it, subsets it, and exposes it as a CSS variable
// (--font-jetbrains-mono) that the Andromeda tokens reference.
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
      }}
    >
      <MissionControl />
    </div>
  )
}
