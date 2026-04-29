// @ts-nocheck — design-systems components are not type-checked yet
// (see design-systems/CLAUDE.md). Demos consume those components, so this
// file inherits the same posture.
'use client'

import { useState } from 'react'
import {
  Bell,
  Compass,
  Database,
  EnvelopeOpen,
  Envelope,
  Gear,
  Info,
  MagnifyingGlass,
  Pulse,
  Users,
  Warning,
} from '@phosphor-icons/react'

import { tokens } from '../../../design-systems/andromeda/tokens'
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '../../../design-systems/andromeda/components/Alert'
import { Avatar } from '../../../design-systems/andromeda/components/Avatar'
import { Badge } from '../../../design-systems/andromeda/components/Badge'
import { Button } from '../../../design-systems/andromeda/components/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../design-systems/andromeda/components/Card'
import { Checkbox } from '../../../design-systems/andromeda/components/Checkbox'
import { CornerMarkers } from '../../../design-systems/andromeda/components/CornerMarkers'
import { Drawer, DrawerBody, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '../../../design-systems/andromeda/components/Drawer'
import { EmptyState, EmptyStateAction, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle } from '../../../design-systems/andromeda/components/EmptyState'
import { Input } from '../../../design-systems/andromeda/components/Input'
import { NavItem } from '../../../design-systems/andromeda/components/NavItem'
import { ProgressBar } from '../../../design-systems/andromeda/components/ProgressBar'
import { RadarChart } from '../../../design-systems/andromeda/components/RadarChart'
import { Radio, RadioGroup } from '../../../design-systems/andromeda/components/Radio'
import { Slider } from '../../../design-systems/andromeda/components/Slider'
import { Spinner } from '../../../design-systems/andromeda/components/Spinner'
import { StatTile } from '../../../design-systems/andromeda/components/StatTile'
import { Tag } from '../../../design-systems/andromeda/components/Tag'
import { Textarea } from '../../../design-systems/andromeda/components/Textarea'
import { Toggle } from '../../../design-systems/andromeda/components/Toggle'

// ─── Layout helpers ──────────────────────────────────────────────────────────

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: tokens.spacing[5] }}>
      {label ? (
        <div
          style={{
            marginBottom: tokens.spacing[3],
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
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

// ─── Per-slug demos ──────────────────────────────────────────────────────────

function ButtonDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
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
        <Button variant="outline" icon={Gear}>Settings</Button>
        <Button variant="destructive" icon={Bell}>Abort</Button>
      </Row>
      <Row label="Disabled">
        <Button disabled>Default</Button>
        <Button variant="outline" disabled>Outline</Button>
      </Row>
    </div>
  )
}

function BadgeDemo() {
  return (
    <Row>
      <Badge variant="default">Default</Badge>
      <Badge variant="accent">Live</Badge>
      <Badge variant="warning">Caution</Badge>
      <Badge variant="fault">Fault</Badge>
      <Badge variant="subtle">Subtle</Badge>
      <Badge variant="outline">Outline</Badge>
    </Row>
  )
}

function AvatarDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
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
    </div>
  )
}

function CardDemo() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: tokens.spacing[5],
        width: '100%',
        maxWidth: 720,
      }}
    >
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
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
            <CardTitle>Default card</CardTitle>
          </div>
          <Badge variant="default">Idle</Badge>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Sharp corners with bracket markers. The brackets are the frame.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline">Configure</Button>
        </CardFooter>
      </Card>
      <Card variant="glow">
        <CardHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
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
          <CardDescription>Tinted accent gradient surface.</CardDescription>
        </CardContent>
        <CardFooter>
          <Button size="sm">Engage</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function CornerMarkersDemo() {
  return (
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
  )
}

function InputDemo() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: tokens.spacing[5],
        width: '100%',
        maxWidth: 720,
      }}
    >
      <Input label="Callsign" placeholder="ENTER CALLSIGN" />
      <Input label="Search" icon={MagnifyingGlass} placeholder="QUERY DATABASE" />
      <Input label="Email" icon={Envelope} placeholder="OPERATOR@DOMAIN.COM" />
      <Input label="Validation" defaultValue="INVALID" error="Field cannot be empty" />
    </div>
  )
}

function NavItemDemo() {
  return (
    <div
      style={{
        width: 260,
        background: tokens.color.surface.raised,
        position: 'relative',
      }}
    >
      <CornerMarkers />
      <NavItem icon={Compass} label="Overview" active />
      <NavItem icon={Pulse} label="Activity" />
      <NavItem icon={Users} label="Members" />
      <NavItem icon={Database} label="Logs" />
      <NavItem icon={Gear} label="Settings" />
    </div>
  )
}

function ProgressBarDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[5], width: '100%', maxWidth: 520 }}>
      <ProgressBar label="Storage Used" value={72} variant="default" />
      <ProgressBar label="Bandwidth" value={48} variant="warning" />
      <ProgressBar label="Memory Critical" value={91} variant="fault" />
    </div>
  )
}

function StatTileDemo() {
  return (
    <div style={{ display: 'flex', gap: tokens.spacing[5], flexWrap: 'wrap' }}>
      <StatTile label="Throughput" code="REQ-01" value="7842" unit="rps" delta={2.4} deltaLabel="vs prior period" />
      <StatTile label="Latency" code="LAT-02" value="412" unit="ms" delta={-1.2} deltaLabel="vs prior period" />
      <StatTile label="Errors" code="ERR-03" value="1.04" unit="%" />
    </div>
  )
}

function TagDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <Row label="Variants">
        <Tag variant="default">Default</Tag>
        <Tag variant="accent">Accent</Tag>
        <Tag variant="warning">Warning</Tag>
        <Tag variant="fault">Fault</Tag>
      </Row>
      <Row label="Dismissible">
        <Tag variant="default" onClose={() => {}}>Removable</Tag>
        <Tag variant="accent" onClose={() => {}}>Active filter</Tag>
      </Row>
    </div>
  )
}

function CheckboxDemo() {
  return (
    <Row label="States">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </Row>
  )
}

function RadioDemo() {
  const [value, setValue] = useState('default')
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <Row label="Group">
        <RadioGroup
          value={value}
          onValueChange={setValue}
          style={{ flexDirection: 'row', gap: tokens.spacing[4] }}
        >
          <Radio value="default" label="Default" />
          <Radio value="alternate" label="Alternate" />
          <Radio value="ground" label="Ground" />
          <Radio value="disabled" label="Restricted" disabled />
        </RadioGroup>
      </Row>
      <Row label="Standalone">
        <Radio label="Standalone" defaultChecked />
        <Radio label="Off" />
      </Row>
    </div>
  )
}

function ToggleDemo() {
  return (
    <Row label="States">
      <Toggle label="Off" />
      <Toggle label="On" defaultChecked />
      <Toggle label="Disabled" disabled />
      <Toggle label="Disabled on" disabled defaultChecked />
    </Row>
  )
}

function SpinnerDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
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
    </div>
  )
}

function SliderDemo() {
  const [a, setA] = useState(64)
  const [b, setB] = useState(38)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[5], width: '100%', maxWidth: 520 }}>
      <Slider label="Throttle" unit="%" value={a} onValueChange={setA} />
      <Slider label="Thrust Vector" unit="°" min={-30} max={30} value={b} onValueChange={setB} />
      <Slider label="Locked" value={50} disabled />
    </div>
  )
}

function TextareaDemo() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: tokens.spacing[5],
        width: '100%',
        maxWidth: 720,
      }}
    >
      <Textarea label="Description" placeholder="ENTER DESCRIPTION…" rows={4} />
      <Textarea label="Validation" defaultValue="TOO SHORT" error="Brief must be at least 80 characters" rows={4} />
    </div>
  )
}

function AlertDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[3], width: '100%', maxWidth: 640 }}>
      <Alert variant="default">
        <AlertIcon><Info weight="light" /></AlertIcon>
        <AlertContent>
          <AlertTitle>System nominal</AlertTitle>
          <AlertDescription>All systems reporting in.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="accent">
        <AlertIcon><Pulse weight="light" /></AlertIcon>
        <AlertContent>
          <AlertTitle>New activity</AlertTitle>
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
          <AlertTitle>Connection lost</AlertTitle>
          <AlertDescription>Reconnecting. ETA 8 seconds.</AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  )
}

function EmptyStateDemo() {
  return (
    <EmptyState>
      <EmptyStateIcon><EnvelopeOpen weight="light" /></EmptyStateIcon>
      <EmptyStateTitle>No activity</EmptyStateTitle>
      <EmptyStateDescription>
        Awaiting signal from the deep-space array. The next pass is in
        approximately 14 minutes.
      </EmptyStateDescription>
      <EmptyStateAction>
        <Button variant="outline" size="sm">Refresh</Button>
        <Button size="sm">Open log</Button>
      </EmptyStateAction>
    </EmptyState>
  )
}

function RadarChartDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing[5], width: '100%' }}>
      <RadarChart label="/// Systems" title="Ship Diagnostics" description="Nominal vs critical thresholds" />
      <RadarChart
        label="/// Performance"
        title="System Performance"
        description="Current system readiness"
        data={[
          { axis: 'CPU', score: 94 },
          { axis: 'MEMORY', score: 81 },
          { axis: 'STORAGE', score: 76 },
          { axis: 'NETWORK', score: 88 },
          { axis: 'SECURITY', score: 65 },
          { axis: 'API', score: 90 },
        ]}
        series={[{ key: 'score', label: 'Readiness', color: tokens.color.accent.base }]}
      />
    </div>
  )
}

function DrawerDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Row label="Trigger">
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
      </Row>
      <Drawer open={open} onOpenChange={setOpen} side="right" size={420}>
        <DrawerHeader>
          <DrawerTitle>System Parameters</DrawerTitle>
          <DrawerDescription>Configure flight envelope</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[5] }}>
            <Input label="Callsign" placeholder="ENTER CALLSIGN" />
            <Slider label="Throttle" unit="%" defaultValue={64} />
            <Toggle label="Autopilot" defaultChecked />
            <Checkbox label="Confirm pre-flight checklist" defaultChecked />
            <Textarea label="Notes" rows={3} placeholder="ADD A NOTE…" />
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => setOpen(false)}>Engage</Button>
        </DrawerFooter>
      </Drawer>
    </>
  )
}

// ─── Public switcher ─────────────────────────────────────────────────────────

const DEMOS: Record<string, () => React.ReactElement> = {
  alert: AlertDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  button: ButtonDemo,
  card: CardDemo,
  checkbox: CheckboxDemo,
  'corner-markers': CornerMarkersDemo,
  drawer: DrawerDemo,
  'empty-state': EmptyStateDemo,
  input: InputDemo,
  'nav-item': NavItemDemo,
  'progress-bar': ProgressBarDemo,
  'radar-chart': RadarChartDemo,
  radio: RadioDemo,
  slider: SliderDemo,
  spinner: SpinnerDemo,
  'stat-tile': StatTileDemo,
  tag: TagDemo,
  textarea: TextareaDemo,
  toggle: ToggleDemo,
}

export function AndromedaDemo({ slug }: { slug: string }) {
  const Demo = DEMOS[slug]
  if (!Demo) {
    return (
      <div
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wider,
        }}
      >
        /// No demo wired for "{slug}"
      </div>
    )
  }
  return <Demo />
}
