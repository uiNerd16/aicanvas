'use client'

// npm install @carbon/icons-react

import type { ComponentType, ReactNode } from 'react'
import { JetBrains_Mono } from 'next/font/google'
import { Notification, Settings } from '@carbon/icons-react'
import { Button as RawButton } from '../../design-systems/andromeda/components/Button'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// Andromeda Button has no explicit TS prop types — retype at the boundary.
type AndromedaButtonProps = {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg'
  icon?: ComponentType<{ size?: number }>
  children?: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}
const Button = RawButton as unknown as ComponentType<AndromedaButtonProps>

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          marginBottom: 12,
          fontFamily: "var(--andromeda-font-mono, 'JetBrains Mono', monospace)",
          fontSize: 10,
          color: 'rgba(255,255,255,0.22)',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default function AndromedaButton() {
  return (
    <div
      className={'relative flex min-h-screen w-full items-center justify-center ' + jetbrainsMono.variable}
      style={{ background: '#0E0E0F' }}
    >
      <div style={{ width: '100%', maxWidth: 640, padding: 24 }}>
        <Row label="Variants">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </Row>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="With icon">
          <Button icon={Notification}>Notifications</Button>
          <Button variant="outline" icon={Settings}>
            Settings
          </Button>
          <Button variant="destructive" icon={Notification}>
            Abort
          </Button>
        </Row>
        <Row label="Disabled">
          <Button disabled>Default</Button>
          <Button variant="outline" disabled>
            Outline
          </Button>
          <Button variant="destructive" disabled>
            Destructive
          </Button>
        </Row>
      </div>
    </div>
  )
}
