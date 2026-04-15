'use client'

// npm install class-variance-authority clsx tailwind-merge @carbon/icons-react
// font: JetBrains Mono

import { forwardRef } from 'react'
import type { ComponentType, ReactNode, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { JetBrains_Mono } from 'next/font/google'
import { Notification, Settings } from '@carbon/icons-react'

// ─── Utilities ────────────────────────────────────────────────────────────────

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Andromeda design tokens inlined as CSS custom properties —
// no external token file or design-system folder needed.
function andromedaVars(): React.CSSProperties {
  return {
    '--andromeda-text-primary':    'rgba(255, 255, 255, 0.96)',
    '--andromeda-text-secondary':  'rgba(255, 255, 255, 0.62)',
    '--andromeda-surface-raised':  'rgba(255, 255, 255, 0.025)',
    '--andromeda-surface-hover':   'rgba(255, 255, 255, 0.06)',
    '--andromeda-surface-active':  'rgba(255, 255, 255, 0.09)',
    '--andromeda-border-base':     'rgba(255, 255, 255, 0.08)',
    '--andromeda-border-bright':   'rgba(255, 255, 255, 0.32)',
    '--andromeda-accent-base':     '#2DD4BF',
    '--andromeda-accent-bright':   '#5EEAD4',
    '--andromeda-accent-dim':      'rgba(45, 212, 191, 0.55)',
    '--andromeda-accent-glow':     'rgba(45, 212, 191, 0.18)',
    '--andromeda-accent-glow-soft':'rgba(45, 212, 191, 0.08)',
    '--andromeda-fault':           '#EF4444',
    '--andromeda-fault-dim':       'rgba(239, 68, 68, 0.50)',
    '--andromeda-fault-glow':      'rgba(239, 68, 68, 0.10)',
    '--andromeda-fault-ring':      'rgba(239, 68, 68, 0.25)',
    '--andromeda-font-mono':       "'JetBrains Mono', 'IBM Plex Mono', Menlo, monospace",
    '--andromeda-text-xs':         '10px',
    '--andromeda-text-sm':         '12px',
    '--andromeda-text-md':         '14px',
    '--andromeda-weight-medium':   '500',
    '--andromeda-leading-tight':   '1.1',
    '--andromeda-tracking-wider':  '0.14em',
    '--andromeda-2':               '8px',
    '--andromeda-3':               '12px',
    '--andromeda-4':               '16px',
    '--andromeda-5':               '20px',
    '--andromeda-radius-none':     '0',
  } as React.CSSProperties
}

// ─── Button ───────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center select-none whitespace-nowrap',
    'gap-[var(--andromeda-2)] border border-solid rounded-[var(--andromeda-radius-none)]',
    '[font-family:var(--andromeda-font-mono)] font-[number:var(--andromeda-weight-medium)]',
    'uppercase [letter-spacing:var(--andromeda-tracking-wider)] [line-height:var(--andromeda-leading-tight)]',
    'cursor-pointer transition-all duration-150 ease-out active:scale-[0.97]',
    '[backdrop-filter:blur(2px)] [-webkit-backdrop-filter:blur(2px)]',
    'focus-visible:outline-none',
    'focus-visible:shadow-[0_0_0_1px_var(--andromeda-accent-dim),0_0_12px_var(--andromeda-accent-glow)]',
    'disabled:cursor-not-allowed disabled:opacity-[0.35] disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-[color:var(--andromeda-accent-base)] bg-[color:var(--andromeda-accent-glow-soft)] border-[color:var(--andromeda-accent-dim)]',
          'hover:text-[color:var(--andromeda-accent-bright)] hover:bg-[color:var(--andromeda-accent-glow)] hover:border-[color:var(--andromeda-accent-bright)]',
          'hover:shadow-[0_0_16px_var(--andromeda-accent-glow)]',
        ],
        outline: [
          'text-[color:var(--andromeda-text-primary)] bg-[color:var(--andromeda-surface-raised)] border-[color:var(--andromeda-border-base)]',
          'hover:bg-[color:var(--andromeda-surface-hover)] hover:border-[color:var(--andromeda-border-bright)]',
          'active:bg-[color:var(--andromeda-surface-active)]',
        ],
        ghost: [
          'text-[color:var(--andromeda-text-secondary)] bg-transparent border-transparent',
          'hover:text-[color:var(--andromeda-text-primary)] hover:bg-[color:var(--andromeda-surface-raised)]',
          'active:bg-[color:var(--andromeda-surface-hover)]',
        ],
        destructive: [
          'text-[color:var(--andromeda-fault)] bg-[color:var(--andromeda-fault-glow)] border-[color:var(--andromeda-fault-dim)]',
          'hover:bg-[color:var(--andromeda-fault-dim)] hover:text-[color:var(--andromeda-text-primary)] hover:border-[color:var(--andromeda-fault)]',
          'hover:shadow-[0_0_16px_var(--andromeda-fault-ring)]',
          'focus-visible:shadow-[0_0_0_1px_var(--andromeda-fault-dim),0_0_12px_var(--andromeda-fault-ring)]',
        ],
        link: [
          'text-[color:var(--andromeda-accent-base)] bg-transparent border-transparent',
          'underline-offset-4 hover:underline hover:text-[color:var(--andromeda-accent-bright)]',
          'focus-visible:shadow-none focus-visible:underline',
        ],
      },
      size: {
        sm: 'px-[var(--andromeda-3)] py-[5px] text-[length:var(--andromeda-text-xs)]',
        md: 'px-[var(--andromeda-4)] py-[var(--andromeda-2)] text-[length:var(--andromeda-text-sm)]',
        lg: 'px-[var(--andromeda-5)] py-[11px] text-[length:var(--andromeda-text-md)]',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    icon?: ComponentType<{ size?: number | string }>
  }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, icon: Icon, children, style, type = 'button', ...props },
  ref,
) {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </button>
  )
})

// ─── Font ─────────────────────────────────────────────────────────────────────

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// ─── Demo ─────────────────────────────────────────────────────────────────────

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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
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
          <Button variant="outline" icon={Settings}>Settings</Button>
          <Button variant="destructive" icon={Notification}>Abort</Button>
        </Row>
        <Row label="Disabled">
          <Button disabled>Default</Button>
          <Button variant="outline" disabled>Outline</Button>
          <Button variant="destructive" disabled>Destructive</Button>
        </Row>
      </div>
    </div>
  )
}
