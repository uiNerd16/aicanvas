// @ts-nocheck — showcase page consumes JSX design-system components whose
// forwardRef wrappers lack TypeScript prop types in a .tsx context.
'use client'

import { useState, type ReactNode } from 'react'
import { JetBrains_Mono } from 'next/font/google'
import {
  MagnifyingGlass,
  Bell,
  Gear,
  Pulse,
  Users,
  Database,
  Compass,
  Envelope,
  EnvelopeOpen,
  Warning,
  Info,
} from '@phosphor-icons/react'
import { tokens } from '../../../../design-systems/andromeda/tokens'
import { Button } from '../../../../design-systems/andromeda/components/Button'
import { Badge } from '../../../../design-systems/andromeda/components/Badge'
import { Avatar } from '../../../../design-systems/andromeda/components/Avatar'
import { Input } from '../../../../design-systems/andromeda/components/Input'
import { NavItem } from '../../../../design-systems/andromeda/components/NavItem'
import { ProgressBar } from '../../../../design-systems/andromeda/components/ProgressBar'
import { StatTile } from '../../../../design-systems/andromeda/components/StatTile'
import { Tag } from '../../../../design-systems/andromeda/components/Tag'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '../../../../design-systems/andromeda/components/Card'
import { CornerMarkers } from '../../../../design-systems/andromeda/components/CornerMarkers'
import { Checkbox } from '../../../../design-systems/andromeda/components/Checkbox'
import { Radio, RadioGroup } from '../../../../design-systems/andromeda/components/Radio'
import { Toggle } from '../../../../design-systems/andromeda/components/Toggle'
import { Spinner } from '../../../../design-systems/andromeda/components/Spinner'
import { Slider } from '../../../../design-systems/andromeda/components/Slider'
import { Textarea } from '../../../../design-systems/andromeda/components/Textarea'
import {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from '../../../../design-systems/andromeda/components/Alert'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
} from '../../../../design-systems/andromeda/components/EmptyState'
import { RadarChart } from '../../../../design-systems/andromeda/components/RadarChart'
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
} from '../../../../design-systems/andromeda/components/Drawer'

// Same JetBrains Mono setup as the dashboard page so the showcase
// matches the design system's only font exactly.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// ─── Layout helpers ──────────────────────────────────────────────────────────
// Local to this page — they exist only to keep the JSX below readable, not
// to abstract anything reusable. Each Section is a Card; each Row is a flex
// strip with an uppercase mono mini-label above it.

function Section({
  title,
  kicker,
  description,
  children,
}: {
  title: string
  kicker?: string
  description?: string
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
            }}
          >
            /// {kicker ?? 'Component'}
          </span>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {description ? (
          <p
            style={{
              margin: 0,
              marginBottom: tokens.spacing[6],
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.wide,
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        ) : null}
        {children}
      </CardContent>
    </Card>
  )
}

function Row({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: tokens.spacing[5] }}>
      {label ? (
        <div
          style={{
            marginBottom: tokens.spacing[3],
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            color: tokens.color.text.faint,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}
        >
          {label}
        </div>
      ) : null}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: tokens.spacing[3],
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SpaceShowcasePage() {
  // Local interactive state used by the live demos below.
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sliderValue, setSliderValue] = useState(64)
  const [thrustValue, setThrustValue] = useState(38)
  const [radioValue, setRadioValue] = useState('orbit')

  return (
    <div
      className={jetbrainsMono.variable}
      style={{
        minHeight: '100vh',
        backgroundColor: tokens.color.surface.void,
        padding: `${tokens.spacing[10]} ${tokens.spacing[8]}`,
      }}
    >
      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[6],
        }}
      >
        {/* Page header */}
        <header style={{ marginBottom: tokens.spacing[6] }}>
          <div
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
              marginBottom: tokens.spacing[2],
            }}
          >
            /// Andromeda Design System
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size['3xl'],
              fontWeight: tokens.typography.weight.medium,
              color: tokens.color.text.primary,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.wider,
              lineHeight: 1.1,
            }}
          >
            Component Showcase
          </h1>
          <div
            style={{
              marginTop: tokens.spacing[3],
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.wide,
            }}
          >
            19 components · all variants · live interaction
          </div>
        </header>

        {/* ── Colors ─────────────────────────────────────────────────────── */}
        <Section
          title="Color Palette"
          kicker="Foundation · Colors"
          description="One white-alpha scale for all text, surfaces, and borders. One electric-blue accent. Two semantic states — warning amber and fault red — each with dim and glow variants for borders and tinted fills."
        >
          <Row label="Text">
            {[
              { name: 'text.primary',   color: tokens.color.text.primary,   note: 'Headings · values' },
              { name: 'text.secondary', color: tokens.color.text.secondary, note: 'Body · descriptions' },
              { name: 'text.muted',     color: tokens.color.text.muted,     note: 'Kickers · metadata' },
              { name: 'text.faint',     color: tokens.color.text.faint,     note: 'Labels · hints' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: '14px', color, letterSpacing: '0.1em' }}>Aa 01</span>
                </div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint, marginTop: '2px' }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '9px', color: tokens.color.accent.dim, marginTop: '4px', wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <Row label="Surfaces">
            {[
              { name: 'surface.void',    color: tokens.color.surface.void,    note: 'Page background' },
              { name: 'surface.base',    color: tokens.color.surface.base,    note: 'Root · transparent' },
              { name: 'surface.raised',  color: tokens.color.surface.raised,  note: 'Cards · panels' },
              { name: 'surface.overlay', color: tokens.color.surface.overlay, note: 'Dropdowns · tips' },
              { name: 'surface.hover',   color: tokens.color.surface.hover,   note: 'Hover state' },
              { name: 'surface.active',  color: tokens.color.surface.active,  note: 'Pressed state' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, background: color, border: '1px solid rgba(255,255,255,0.12)', marginBottom: '8px' }} />
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint, marginTop: '2px' }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '9px', color: tokens.color.accent.dim, marginTop: '4px', wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <Row label="Borders">
            {[
              { name: 'border.subtle', color: tokens.color.border.subtle, note: 'Dividers' },
              { name: 'border.base',   color: tokens.color.border.base,   note: 'Default edges' },
              { name: 'border.bright', color: tokens.color.border.bright, note: 'Focus · hover' },
              { name: 'border.strong', color: tokens.color.border.strong, note: 'High emphasis' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, border: `2px solid ${color}`, marginBottom: '8px' }} />
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint, marginTop: '2px' }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '9px', color: tokens.color.accent.dim, marginTop: '4px', wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <Row label="Accent · Electric Blue">
            {[
              { name: 'accent.base',     color: tokens.color.accent.base,     note: 'Active · selected' },
              { name: 'accent.bright',   color: tokens.color.accent.bright,   note: 'Highlighted text' },
              { name: 'accent.dim',      color: tokens.color.accent.dim,      note: 'Focus borders' },
              { name: 'accent.glow',     color: tokens.color.accent.glow,     note: 'Glow halos' },
              { name: 'accent.glowSoft', color: tokens.color.accent.glowSoft, note: 'Tinted fills' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, background: color, border: '1px solid rgba(255,255,255,0.08)', marginBottom: '8px' }} />
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint, marginTop: '2px' }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '9px', color: tokens.color.accent.dim, marginTop: '4px', wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <Row label="Semantic · Warning + Fault">
            {[
              { name: 'warning',     color: tokens.color.warning,     note: 'Warning solid' },
              { name: 'warningDim',  color: tokens.color.warningDim,  note: 'Warning border' },
              { name: 'warningGlow', color: tokens.color.warningGlow, note: 'Warning fill' },
              { name: 'fault',       color: tokens.color.fault,       note: 'Fault solid' },
              { name: 'faultDim',    color: tokens.color.faultDim,    note: 'Fault border' },
              { name: 'faultGlow',   color: tokens.color.faultGlow,   note: 'Fault fill' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, background: color, border: '1px solid rgba(255,255,255,0.08)', marginBottom: '8px' }} />
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint, marginTop: '2px' }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '9px', color: tokens.color.accent.dim, marginTop: '4px', wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <div>
            <div style={{ marginBottom: tokens.spacing[3], fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.widest }}>
              Usage Reference
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacing[2] }}>
              {[
                { role: 'Page headings',       token: 'text.primary' },
                { role: 'Body · descriptions', token: 'text.secondary' },
                { role: 'Kickers · metadata',  token: 'text.muted' },
                { role: 'Decorative labels',   token: 'text.faint' },
                { role: 'Page background',     token: 'surface.void' },
                { role: 'Card backgrounds',    token: 'surface.raised' },
                { role: 'Hover → pressed',     token: 'surface.hover → surface.active' },
                { role: 'Dividers',            token: 'border.subtle' },
                { role: 'Default borders',     token: 'border.base' },
                { role: 'Focus borders',       token: 'border.bright' },
                { role: 'Active · selected',   token: 'accent.base' },
                { role: 'Accent glow',         token: 'accent.glow' },
                { role: 'Fault indicator',     token: 'fault + faultGlow' },
              ].map(({ role, token }) => (
                <div key={role} style={{ padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`, background: tokens.color.surface.raised, border: `1px solid ${tokens.color.border.subtle}` }}>
                  <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider, marginBottom: '3px' }}>{role}</div>
                  <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '11px', color: tokens.color.accent.bright }}>{token}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Typography ──────────────────────────────────────────────────── */}
        <Section
          title="Typography"
          kicker="Foundation · Type"
          description="JetBrains Mono is the only typeface. Both fontSans and fontMono resolve to it — the distinction exists only for backward compatibility. Hierarchy comes from size, weight, and letter-spacing, not from switching families."
        >
          <div style={{ marginBottom: tokens.spacing[5] }}>
            <div style={{ marginBottom: tokens.spacing[3], fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.widest }}>
              Type Scale
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { token: 'xs',  px: '10px', usage: 'Data labels · kickers · row headers' },
                { token: 'sm',  px: '12px', usage: 'Descriptions · captions · error text' },
                { token: 'md',  px: '14px', usage: 'UI body · card descriptions' },
                { token: 'lg',  px: '15px', usage: 'Card titles · nav labels' },
                { token: 'xl',  px: '18px', usage: 'Section headings' },
                { token: '2xl', px: '22px', usage: 'Sub-page headings' },
                { token: '3xl', px: '28px', usage: 'Showcase page title' },
                { token: '4xl', px: '36px', usage: 'Dashboard hero readout' },
                { token: '5xl', px: '48px', usage: 'Telemetry primary value' },
              ].map(({ token, px, usage }) => (
                <div key={token} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[4], padding: `${tokens.spacing[2]} 0`, borderBottom: `1px solid ${tokens.color.border.subtle}` }}>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.widest, width: 28, flexShrink: 0 }}>{token}</span>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint, width: 32, flexShrink: 0 }}>{px}</span>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: px, color: tokens.color.text.primary, letterSpacing: tokens.typography.tracking.wide, lineHeight: 1.1, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>MISSION</span>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint, flexShrink: 0, textAlign: 'right' }}>{usage}</span>
                </div>
              ))}
            </div>
          </div>

          <Row label="Weight Scale">
            {[
              { name: 'thin',     val: 200 },
              { name: 'regular',  val: 400 },
              { name: 'medium',   val: 500 },
              { name: 'semibold', val: 600 },
              { name: 'bold',     val: 700 },
            ].map(({ name, val }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '22px', fontWeight: val, color: tokens.color.text.primary, letterSpacing: tokens.typography.tracking.wider, marginBottom: tokens.spacing[1] }}>NOVA</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>weight.{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint }}>{val}</div>
              </div>
            ))}
          </Row>

          <Row label="Letter Spacing · Tracking">
            {[
              { name: 'tight',  val: '0',      usage: 'Dense data tables' },
              { name: 'normal', val: '0.02em',  usage: 'Inline body text' },
              { name: 'wide',   val: '0.08em',  usage: 'Values · readouts' },
              { name: 'wider',  val: '0.14em',  usage: 'Nav labels' },
              { name: 'widest', val: '0.22em',  usage: 'Kickers · row heads' },
            ].map(({ name, val, usage }) => (
              <div key={name} style={{ width: 160 }}>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '14px', fontWeight: 500, color: tokens.color.text.primary, letterSpacing: val, textTransform: 'uppercase', marginBottom: tokens.spacing[1] }}>LAUNCH</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>tracking.{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.muted }}>{val || '0'}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: '10px', color: tokens.color.text.faint, marginTop: '2px' }}>{usage}</div>
              </div>
            ))}
          </Row>
        </Section>

        {/* ── Button ─────────────────────────────────────────────────────── */}
        <Section
          title="Button"
          description="5 variants × 3 sizes. Supports asChild via Radix Slot, optional leading icon, full hover / focus / active / disabled state coverage."
        >
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
            <Button icon={Bell}>Notifications</Button>
            <Button variant="outline" icon={Gear}>
              Settings
            </Button>
            <Button variant="destructive" icon={Bell}>
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
        </Section>

        {/* ── Badge ──────────────────────────────────────────────────────── */}
        <Section
          title="Badge"
          description="6 variants for status, telemetry tags, and inline labels."
        >
          <Row>
            <Badge variant="default">Default</Badge>
            <Badge variant="accent">Live</Badge>
            <Badge variant="warning">Caution</Badge>
            <Badge variant="fault">Fault</Badge>
            <Badge variant="subtle">Subtle</Badge>
            <Badge variant="outline">Outline</Badge>
          </Row>
        </Section>

        {/* ── Avatar ─────────────────────────────────────────────────────── */}
        <Section
          title="Avatar"
          description="3 sizes. Initials derived from `name`. Optional status dot in 4 states."
        >
          <Row label="Sizes">
            <Avatar name="Reza Quinn" size="sm" />
            <Avatar name="Reza Quinn" size="md" />
            <Avatar name="Reza Quinn" size="lg" />
          </Row>
          <Row label="With status">
            <Avatar name="Reza Quinn" status="online" />
            <Avatar name="Mira Voss" status="caution" />
            <Avatar name="Kai Ortiz" status="fault" />
            <Avatar name="June Park" status="offline" />
          </Row>
        </Section>

        {/* ── Card ───────────────────────────────────────────────────────── */}
        <Section
          title="Card"
          description="Compound primitive: Card / CardHeader / CardContent / CardFooter / CardTitle / CardDescription. No continuous border by default — corner brackets do the framing."
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: tokens.spacing[5],
            }}
          >
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span
                    style={{
                      fontFamily: tokens.typography.fontMono,
                      fontSize: tokens.typography.size.xs,
                      color: tokens.color.text.muted,
                      textTransform: 'uppercase',
                      letterSpacing: tokens.typography.tracking.widest,
                    }}
                  >
                    /// Default
                  </span>
                  <CardTitle>Mission card</CardTitle>
                </div>
                <Badge variant="default">Idle</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sharp corners with bracket markers tucked into each corner. No
                  perimeter stroke — the brackets are the frame.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Configure
                </Button>
              </CardFooter>
            </Card>

            <Card variant="glow">
              <CardHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span
                    style={{
                      fontFamily: tokens.typography.fontMono,
                      fontSize: tokens.typography.size.xs,
                      color: tokens.color.text.muted,
                      textTransform: 'uppercase',
                      letterSpacing: tokens.typography.tracking.widest,
                    }}
                  >
                    /// Glow
                  </span>
                  <CardTitle>Highlight card</CardTitle>
                </div>
                <Badge variant="accent">Live</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tinted accent gradient surface. Use for the card you want to
                  draw the operator's eye to first.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button size="sm">Engage</Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* ── CornerMarkers ──────────────────────────────────────────────── */}
        <Section
          title="CornerMarkers"
          description="The defining motif. Renders 4 L-shaped brackets at the corners of the nearest position:relative ancestor. Geometry comes from tokens.marker."
        >
          <div style={{ display: 'flex', gap: tokens.spacing[5], flexWrap: 'wrap' }}>
            {[
              { label: 'Default', props: {} },
              { label: 'Larger', props: { size: 18 } },
              { label: 'Inset 6px', props: { offset: 6 } },
              { label: 'Accent', props: { color: tokens.color.accent.base } },
            ].map(({ label, props }) => (
              <div
                key={label}
                style={{
                  position: 'relative',
                  width: 180,
                  height: 100,
                  background: tokens.color.surface.raised,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CornerMarkers {...props} />
                <span
                  style={{
                    fontFamily: tokens.typography.fontMono,
                    fontSize: tokens.typography.size.xs,
                    color: tokens.color.text.muted,
                    textTransform: 'uppercase',
                    letterSpacing: tokens.typography.tracking.widest,
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Input ──────────────────────────────────────────────────────── */}
        <Section
          title="Input"
          description="Optional uppercase mono label, optional left icon, default + error states. Border transitions on focus."
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: tokens.spacing[5],
            }}
          >
            <Input label="Callsign" placeholder="ENTER CALLSIGN" />
            <Input label="Search" icon={MagnifyingGlass} placeholder="QUERY DATABASE" />
            <Input
              label="Operator"
              icon={Envelope}
              placeholder="OPERATOR@MISSION.CONTROL"
            />
            <Input
              label="Validation"
              defaultValue="invalid"
              error="Field cannot be empty"
            />
          </div>
        </Section>

        {/* ── NavItem ────────────────────────────────────────────────────── */}
        <Section
          title="NavItem"
          description="Sidebar item with icon, active state, accent left bar. Mono label by default; pass mono={false} for sans."
        >
          <div
            style={{
              width: 260,
              background: tokens.color.surface.raised,
              position: 'relative',
            }}
          >
            <CornerMarkers />
            <NavItem icon={Compass} label="Overview" active />
            <NavItem icon={Pulse} label="Telemetry" />
            <NavItem icon={Users} label="Crew" />
            <NavItem icon={Database} label="Logs" />
            <NavItem icon={Gear} label="Settings" />
          </div>
        </Section>

        {/* ── ProgressBar ────────────────────────────────────────────────── */}
        <Section
          title="ProgressBar"
          description="3 variants. 3px tall track with a gradient fill and soft glow halo. Smooth width transitions."
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[5],
              maxWidth: 520,
            }}
          >
            <ProgressBar label="Fuel Reserve" value={72} variant="default" />
            <ProgressBar label="Heat Shield" value={48} variant="warning" />
            <ProgressBar label="Thermal Danger" value={91} variant="fault" />
          </div>
        </Section>

        {/* ── StatTile ───────────────────────────────────────────────────── */}
        <Section
          title="StatTile"
          description="Telemetry-style readout built on Card. Big numeric value, optional unit, optional ▲/▼ delta colored by sign."
        >
          <div
            style={{
              display: 'flex',
              gap: tokens.spacing[5],
              flexWrap: 'wrap',
            }}
          >
            <StatTile
              label="Velocity"
              code="V-01"
              value="7842"
              unit="m/s"
              delta={2.4}
              deltaLabel="vs prior cycle"
            />
            <StatTile
              label="Altitude"
              code="A-02"
              value="412"
              unit="km"
              delta={-1.2}
              deltaLabel="vs prior cycle"
            />
            <StatTile label="G-Force" code="G-03" value="1.04" unit="g" />
          </div>
        </Section>

        {/* ── Tag ────────────────────────────────────────────────────────── */}
        <Section
          title="Tag"
          description="Compact uppercase mono label. 4 variants. Optional dismiss button when onClose is provided."
        >
          <Row label="Variants">
            <Tag variant="default">Default</Tag>
            <Tag variant="accent">Accent</Tag>
            <Tag variant="warning">Warning</Tag>
            <Tag variant="fault">Fault</Tag>
          </Row>
          <Row label="Dismissible">
            <Tag variant="default" onClose={() => {}}>
              Removable
            </Tag>
            <Tag variant="accent" onClose={() => {}}>
              Active filter
            </Tag>
          </Row>
        </Section>

        {/* ── Checkbox ───────────────────────────────────────────────────── */}
        <Section
          title="Checkbox"
          description="Square boolean control. Controlled or uncontrolled. Inline label, accent fill on checked."
        >
          <Row label="States">
            <Checkbox label="Unchecked" />
            <Checkbox label="Checked" defaultChecked />
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
          </Row>
        </Section>

        {/* ── Radio (Choicebox) ──────────────────────────────────────────── */}
        <Section
          title="Radio · Choicebox"
          description="Mutually-exclusive square radio. Use standalone or inside a RadioGroup that wires up `name` / `value` / `onValueChange`."
        >
          <Row label="Group">
            <RadioGroup
              value={radioValue}
              onValueChange={setRadioValue}
              style={{ flexDirection: 'row', gap: tokens.spacing[4] }}
            >
              <Radio value="orbit" label="Orbital" />
              <Radio value="suborbit" label="Suborbital" />
              <Radio value="ground" label="Ground" />
              <Radio value="disabled" label="Restricted" disabled />
            </RadioGroup>
          </Row>
          <Row label="Standalone">
            <Radio label="Standalone" defaultChecked />
            <Radio label="Off" />
          </Row>
        </Section>

        {/* ── Toggle ─────────────────────────────────────────────────────── */}
        <Section
          title="Toggle · Switch"
          description="Sharp rectangular track + sliding rectangular thumb. Same vocabulary as Checkbox, but feels like a hardware switch."
        >
          <Row label="States">
            <Toggle label="Off" />
            <Toggle label="On" defaultChecked />
            <Toggle label="Disabled" disabled />
            <Toggle label="Disabled on" disabled defaultChecked />
          </Row>
        </Section>

        {/* ── Spinner ────────────────────────────────────────────────────── */}
        <Section
          title="Spinner"
          description="SVG arc that rotates via a CSS keyframe — runs on the compositor, no React per-frame work. 4 color variants × 3 sizes."
        >
          <Row label="Sizes">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </Row>
          <Row label="Variants">
            <Spinner variant="default" />
            <Spinner variant="accent" />
            <Spinner variant="warning" />
            <Spinner variant="fault" />
          </Row>
        </Section>

        {/* ── Slider ─────────────────────────────────────────────────────── */}
        <Section
          title="Slider"
          description="Custom horizontal range. Pointer drag + full keyboard support (←/→/↑/↓, PageUp/PageDown, Home/End). ARIA-compliant."
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[5],
              maxWidth: 520,
            }}
          >
            <Slider
              label="Throttle"
              unit="%"
              value={sliderValue}
              onValueChange={setSliderValue}
            />
            <Slider
              label="Thrust Vector"
              unit="°"
              min={-30}
              max={30}
              value={thrustValue}
              onValueChange={setThrustValue}
            />
            <Slider label="Locked" value={50} disabled />
          </div>
        </Section>

        {/* ── Textarea ───────────────────────────────────────────────────── */}
        <Section
          title="Textarea"
          description="Multi-line counterpart to Input. Same border / focus / error behavior, vertical resize."
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: tokens.spacing[5],
            }}
          >
            <Textarea
              label="Mission Brief"
              placeholder="ENTER MISSION OBJECTIVES…"
              rows={4}
            />
            <Textarea
              label="Validation"
              defaultValue="too short"
              error="Brief must be at least 80 characters"
              rows={4}
            />
          </div>
        </Section>

        {/* ── Alert ──────────────────────────────────────────────────────── */}
        <Section
          title="Alert"
          kicker="Component · Error"
          description="Banner-style status component for inline messages. 4 variants — default, accent, warning, fault — each with its own icon color and title color."
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[3],
            }}
          >
            <Alert variant="default">
              <AlertIcon><Info weight="light" /></AlertIcon>
              <AlertContent>
                <AlertTitle>System nominal</AlertTitle>
                <AlertDescription>All vehicles reporting in.</AlertDescription>
              </AlertContent>
            </Alert>
            <Alert variant="accent">
              <AlertIcon><Pulse weight="light" /></AlertIcon>
              <AlertContent>
                <AlertTitle>New telemetry</AlertTitle>
                <AlertDescription>Burst received from VHCL-04.</AlertDescription>
              </AlertContent>
            </Alert>
            <Alert variant="warning">
              <AlertIcon><Warning weight="light" /></AlertIcon>
              <AlertContent>
                <AlertTitle>Caution</AlertTitle>
                <AlertDescription>Heat shield within 12% of operational limit.</AlertDescription>
              </AlertContent>
            </Alert>
            <Alert variant="fault">
              <AlertIcon><Warning weight="light" /></AlertIcon>
              <AlertContent>
                <AlertTitle>Telemetry lost</AlertTitle>
                <AlertDescription>Reconnecting to vehicle. ETA 8 seconds.</AlertDescription>
              </AlertContent>
            </Alert>
          </div>
        </Section>

        {/* ── Empty State ────────────────────────────────────────────────── */}
        <Section
          title="Empty State"
          description="Centered icon + uppercase mono title + sans description + optional action. Built on Card so it inherits the bracket motif."
        >
          <EmptyState>
            <EmptyStateIcon><EnvelopeOpen weight="light" /></EmptyStateIcon>
            <EmptyStateTitle>No transmissions</EmptyStateTitle>
            <EmptyStateDescription>
              Awaiting signal from the deep-space array. The next pass is in
              approximately 14 minutes.
            </EmptyStateDescription>
            <EmptyStateAction>
              <Button variant="outline" size="sm">Refresh</Button>
              <Button size="sm">Open log</Button>
            </EmptyStateAction>
          </EmptyState>
        </Section>

        {/* ── Charts ─────────────────────────────────────────────────────── */}
        <Section
          title="Radar Chart"
          kicker="Component · Charts"
          description="Polygon spider chart for multi-axis system diagnostics. Supports single or multiple overlapping series. Built on recharts, fully styled with andromeda tokens."
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing[5] }}>
            <RadarChart
              label="/// Systems"
              title="Ship Diagnostics"
              description="Nominal vs critical thresholds"
            />
            <RadarChart
              label="/// Crew"
              title="Crew Performance"
              description="Current mission readiness"
              data={[
                { axis: 'PILOT',   score: 94 },
                { axis: 'ENG',     score: 81 },
                { axis: 'MED',     score: 76 },
                { axis: 'COMMS',   score: 88 },
                { axis: 'RECON',   score: 65 },
                { axis: 'CMD',     score: 90 },
              ]}
              series={[{ key: 'score', label: 'Readiness', color: 'rgba(96,165,250,0.9)' }]}
            />
          </div>
        </Section>

        {/* ── Drawer ─────────────────────────────────────────────────────── */}
        <Section
          title="Drawer"
          description="Right-side slide-in panel with backdrop, ESC to close, body scroll lock, and the bracket motif. React Portal escapes any clipped ancestor."
        >
          <Row label="Trigger">
            <Button onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          </Row>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} side="right" size={420}>
            <DrawerHeader>
              <DrawerTitle>Mission Parameters</DrawerTitle>
              <DrawerDescription>Configure flight envelope</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[5] }}>
                <Input label="Callsign" placeholder="ENTER CALLSIGN" />
                <Slider label="Throttle" unit="%" defaultValue={64} />
                <Toggle label="Autopilot" defaultChecked />
                <Toggle label="Manual override" />
                <Checkbox label="Confirm pre-flight checklist" defaultChecked />
                <Textarea label="Notes" rows={3} placeholder="OPERATOR NOTES…" />
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button variant="outline" size="sm" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setDrawerOpen(false)}>
                Engage
              </Button>
            </DrawerFooter>
          </Drawer>
        </Section>
      </div>
    </div>
  )
}
