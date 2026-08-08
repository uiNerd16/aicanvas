// @ts-nocheck — showcase consumes JSX design-system components whose
// forwardRef wrappers lack TypeScript prop types in a .tsx context.
//
// Sibling component (NOT a route file). Both the showcase route and
// the ideation Andromeda landing render this so the body lives in one
// place.
'use client'

import { Fragment, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { JetBrains_Mono } from 'next/font/google'
import { SiteFooter } from '../../../components/SiteFooter'
import {
  MagnifyingGlass,
  Bell,
  Gear,
  Pulse,
  Users,
  Database,
  Compass,
  EnvelopeOpen,
  Warning,
  Info,
  ArrowUpRight,
  ArrowClockwise,
  Sliders,
  Export,
  EyeSlash,
  Trash,
  Pencil,
  Copy,
  Star,
  ChartLine,
  ChartBar,
  Clock,
  Keyboard,
  SignOut,
  UserCircle,
} from '@phosphor-icons/react'
import { tokens } from '../../../../design-systems/andromeda/tokens'
import { mq } from '../../../../design-systems/andromeda/components/lib/responsive'
import { Button, buttonVariants } from '../../../../design-systems/andromeda/components/Button'
import { IconButton } from '../../../../design-systems/andromeda/components/IconButton'
import { PanelHeader } from '../../../../design-systems/andromeda/components/PanelHeader'
import { PanelMenu } from '../../../../design-systems/andromeda/components/PanelMenu'
import { SegmentedControl } from '../../../../design-systems/andromeda/components/SegmentedControl'
import { DateRangePicker } from '../../../../design-systems/andromeda/components/DateRangePicker'
import { andromedaVars } from '../../../../design-systems/andromeda/components/lib/utils'
import { Badge } from '../../../../design-systems/andromeda/components/Badge'
import { Avatar } from '../../../../design-systems/andromeda/components/Avatar'
import { Input } from '../../../../design-systems/andromeda/components/Input'
import { SearchField } from '../../../../design-systems/andromeda/components/SearchField'
import { NavItem } from '../../../../design-systems/andromeda/components/NavItem'
import { ProgressBar } from '../../../../design-systems/andromeda/components/ProgressBar'
import { HeatGrid } from '../../../../design-systems/andromeda/components/HeatGrid'
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
import { UserCard } from '../../../../design-systems/andromeda/components/UserCard'
import { UserMenu } from '../../../../design-systems/andromeda/components/UserMenu'
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
import { TrendChart } from '../../../../design-systems/andromeda/components/TrendChart'
import { Planet } from '../../../../design-systems/andromeda/components/Planet'
import { Tooltip } from '../../../../design-systems/andromeda/components/Tooltip'
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableStyles,
} from '../../../../design-systems/andromeda/components/Table'
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
} from '../../../../design-systems/andromeda/components/Drawer'
// v2 components come from the build-time-injected shim (real re-exports when
// injected, placeholder panels on degraded builds) — never import them from
// design-systems/ directly. See scripts/inject-premium.mjs.
import { MetricChart, Gauge, Waveform, MediaCard, DataTable, MusicPlayer, FunnelChart } from '../../../lib/andromeda-v2.generated'
import { ShowcaseInstall } from '../../../_components/ShowcaseInstall'
import { ShowcaseInstallCard } from '../../../_components/ShowcaseInstallCard'

// Same JetBrains Mono setup as the dashboard page so the showcase
// matches the design system's only font exactly.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// Organic demo telemetry for the Trend Chart — deterministic (no Math.random)
// so SSR and client agree. Real day-to-day variance: allocated wanders, used
// tracks at a varying fraction so the gap weaves, reserved holds roughly flat.
const _tcFract = (x: number) => x - Math.floor(x)
const _tcNoise = (i: number, s: number) => _tcFract(Math.sin((i + 1) * 12.9898 + s * 78.233) * 43758.5453)
const _tcClamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const TREND_DEMO_DATA = Array.from({ length: 31 }, (_, i) => {
  const allocated = _tcClamp(
    Math.round(8600 + Math.sin(i / 5) * 900 + Math.sin(i / 2.3 + 1) * 700 + (_tcNoise(i, 1) - 0.5) * 1900),
    6200,
    11400,
  )
  return {
    t: i + 1,
    allocated,
    used: Math.round(allocated * (0.76 + _tcNoise(i, 2) * 0.2)),
    reserved: Math.round(1480 + (_tcNoise(i, 3) - 0.5) * 160),
  }
})

// Funnel demo data — mirrors the per-component page (andromeda-demos) so the
// two surfaces show the same story. Tone is DERIVED from step conversion,
// never assigned to tell stages apart; that is the only sanctioned way colour
// enters a funnel (FunnelChart.rules.md).
const FUNNEL_DEMO_TONE = (share: number) =>
  share >= 0.85 ? 'accent' : share >= 0.75 ? 'warning' : 'fault'
const FUNNEL_DEMO_STAGES = [
  { id: 'awareness', label: 'Awareness', value: 4100 },
  { id: 'interest', label: 'Interest', value: 2957 },
  { id: 'consideration', label: 'Consideration', value: 2184 },
  { id: 'intent', label: 'Intent', value: 1038 },
  { id: 'purchase', label: 'Purchase', value: 820 },
]
const FUNNEL_DEMO_TONED = FUNNEL_DEMO_STAGES.map((stage, i) => ({
  ...stage,
  tone: i === 0 ? 'accent' : FUNNEL_DEMO_TONE(stage.value / FUNNEL_DEMO_STAGES[i - 1].value),
}))

// ─── Layout helpers ──────────────────────────────────────────────────────────
// Local to this page — they exist only to keep the JSX below readable, not
// to abstract anything reusable. Each Section is a Card; each Row is a flex
// strip with an uppercase mono mini-label above it.

// Section descriptions author code identifiers in `backticks`. Render those in
// their true case; everything around them is body copy. Without this the
// backticks printed literally AND the uppercase transform flattened the camel
// hump, so `onClose` reached the page as ONCLOSE — one unreadable word.
function withCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.length > 2 && part.startsWith('`') && part.endsWith('`') ? (
      <code key={i} style={{ fontFamily: 'inherit', color: tokens.color.text.primary }}>
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  )
}

function Section({
  title,
  kicker,
  description,
  slug,
  allowOverflow,
  children,
}: {
  title: string
  kicker?: string
  description?: string
  // When provided, renders a right-aligned "Open <title>" link in the
  // header pointing at /design-systems/andromeda/<slug>. Foundation
  // sections (Color Palette, Typography) omit this and have no button.
  slug?: string
  // Skip content-visibility for sections whose demo opens an INLINE docs
  // popover (defaultOpen/staticOpen menu, calendar, tooltip) that paints
  // outside the card box. content-visibility implies `contain: paint`, which
  // clips the open popover (the bug the kebab menus hit) — at every width, so
  // this also un-clips desktop. Correctness beats the offscreen-skip perf win
  // for these few sections.
  allowOverflow?: boolean
  children: ReactNode
}) {
  return (
    <Card
      // Perf: the showcase is a very tall single page, so let the browser skip
      // rendering/layout of each section while it's offscreen. contain-intrinsic-size
      // reserves a placeholder height (scrollbar stays stable), then `auto`
      // remembers the real size after first render. Corner markers are inset
      // (inside the card box), so paint containment never clips them. Degrades
      // gracefully where content-visibility is unsupported. Sections with an
      // open inline popover opt out via `allowOverflow`.
      style={allowOverflow ? undefined : { contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }}
    >
      {/* A showcase section is a SECTION, not a card-in-a-dashboard, so it takes
          the section padding step (spacing[6]) rather than Card's spacing[3]
          default. Scoped here on purpose: Card's 12px is a documented must and
          every template depends on it. The inset dividers stay on spacing[3]
          either way — that inset is fixed by rule, it does not track padding. */}
      <CardHeader className="px-[var(--andromeda-6)] py-[var(--andromeda-6)]">
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.sm,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
            }}
          >
            /// {kicker ?? 'Component'}
          </span>
          <CardTitle>{title}</CardTitle>
        </div>
        {slug ? (
          // Plain Link styled with buttonVariants — bypasses Radix Slot,
          // which doesn't tolerate the Button's internal `{icon}{children}`
          // rendering when asChild is true.
          <Link
            href={`/design-systems/andromeda/${slug}`}
            className={buttonVariants({ variant: 'ghost', size: 'md' })}
            style={andromedaVars()}
          >
            Open {title}
            <ArrowUpRight weight="regular" size={14} />
          </Link>
        ) : null}
      </CardHeader>
      <CardContent className="p-[var(--andromeda-6)]">
        {description ? (
          <p
            style={{
              margin: 0,
              marginBottom: tokens.spacing[6],
              fontFamily: tokens.typography.fontMono,
              // Body copy, per voice-and-copy: normal case, text.secondary,
              // normal tracking. It used to render uppercase / muted / wide,
              // which is the UI-LABEL treatment — wrong for a paragraph, and
              // the reason every prop name in here lost its camel hump.
              fontSize: tokens.typography.size.md,
              color: tokens.color.text.secondary,
              letterSpacing: tokens.typography.tracking.normal,
              lineHeight: tokens.typography.lineHeight.relaxed,
            }}
          >
            {withCode(description)}
          </p>
        ) : null}
        {children}
      </CardContent>
    </Card>
  )
}

// Size × state matrix. Columns are the three control rungs, rows are variants
// or states, so one glance answers both "how big can it be" and "what states
// does it have" — and every cell is directly comparable to the one above it.
// Prefer this over separate Variants and Sizes rows, which show each axis at a
// single fixed value of the other and hide the combinations.
function Matrix({
  rows,
  render,
  sizes = ['sm', 'md', 'lg'] as const,
}: {
  rows: { label: string; props?: Record<string, unknown> }[]
  render: (size: 'sm' | 'md' | 'lg', props: Record<string, unknown>) => ReactNode
  sizes?: readonly ('sm' | 'md' | 'lg')[]
}) {
  const head = {
    fontFamily: tokens.typography.fontMono,
    fontSize: tokens.typography.size.sm,
    color: tokens.color.text.faint,
    textTransform: 'uppercase' as const,
    letterSpacing: tokens.typography.tracking.widest,
  }
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `max-content repeat(${sizes.length}, max-content)`,
        gap: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
        alignItems: 'center',
        justifyContent: 'start',
        // The matrix is the widest thing in a narrow card, so it scrolls
        // inside its own box rather than forcing the page to scroll.
        overflowX: 'auto',
      }}
    >
      <span />
      {sizes.map((s) => (
        <span key={s} style={head}>
          {s}
        </span>
      ))}
      {rows.map((r) => (
        <Fragment key={r.label}>
          <span style={head}>{r.label}</span>
          {sizes.map((s) => (
            <span key={s}>{render(s, r.props ?? {})}</span>
          ))}
        </Fragment>
      ))}
    </div>
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
            fontSize: tokens.typography.size.sm,
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
          alignItems: 'flex-start',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

interface AndromedaShowcaseProps {
  componentCount?: number
  templateCount?: number
}

export default function AndromedaShowcase({
  componentCount = 0,
  templateCount = 0,
}: AndromedaShowcaseProps = {}) {
  // Local interactive state used by the live demos below.
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sliderValue, setSliderValue] = useState(64)
  const [thrustValue, setThrustValue] = useState(38)
  const [radioValue, setRadioValue] = useState('default')
  const [chartTypeSm, setChartTypeSm] = useState('line')
  const [periodValue, setPeriodValue] = useState('1w')
  const [heatValue, setHeatValue] = useState(60)
  const [dateRange, setDateRange] = useState({
    start: new Date(2026, 5, 17),
    end:   new Date(2026, 5, 21),
  })

  return (
    <>
    <ShowcaseInstall
      installs={[
        { slug: 'andromeda', label: 'All components' },
        { slug: 'andromeda-all', label: 'Everything' },
      ]}
    />
    <div
      className={`as-shell ${jetbrainsMono.variable}`}
      style={{
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: tokens.color.surface.base,
        // All-longhand (no `padding` shorthand) so paddingBottom isn't clobbered.
        paddingTop: tokens.spacing[10],
        paddingLeft: tokens.spacing[8],
        paddingRight: tokens.spacing[8],
        paddingBottom: tokens.spacing[10],
      }}
    >
      <div
        style={{
          maxWidth: '1180px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[6],
        }}
      >
        {/* Responsive reflow — desktop-first. The default (unqualified)
            rules ARE the desktop layout; the mq.md block collapses the dense
            two/three-column section grids to a single column below 768px, and
            mq.sm tightens the page gutter and steps the display title down on
            phones. Grid tracks use minmax(0,…) and items get min-width:0 so a
            wide child (chart/table) can never push the page past the viewport.
            Overrides that compete with an inline style (shell padding, title
            font-size) carry !important per the brain's inline-style rule. */}
        <style>{`
          .as-grid-2 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
          .as-grid-2 > * { min-width: 0; }
          .as-grid-planet { grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); }
          .as-grid-planet > * { min-width: 0; }
          .as-usage-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .as-usage-grid > * { min-width: 0; }
          ${mq.md} {
            .as-grid-2 { grid-template-columns: minmax(0, 1fr); }
            .as-grid-planet { grid-template-columns: minmax(0, 1fr); }
            .as-usage-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .as-shell { padding: ${tokens.spacing[8]} ${tokens.spacing[5]} !important; padding-bottom: 7.5rem !important; }
          }
          ${mq.sm} {
            .as-usage-grid { grid-template-columns: minmax(0, 1fr); }
            .as-shell { padding: ${tokens.spacing[6]} ${tokens.spacing[4]} !important; padding-bottom: 7.5rem !important; }
            .as-title { font-size: ${tokens.typography.size['2xl']} !important; }
            /* Phones: drop the right-hand usage gloss on the Type Scale and
               Spacing rows — at phone widths it crowds the specimen off-screen.
               Desktop/tablet keep it (rule is mq.sm-only). */
            .as-scale-usage { display: none !important; }
            /* The ProgressBar segment row is fixed geometry (30×6px + 29×3px =
               267px, segments don't shrink). On a sub-~323px phone it would
               exceed the card and widen the page, so let it scroll inside its
               own stack — the sanctioned fixed-geometry behaviour. Inert on
               wider phones/desktop where 267px fits. */
            .as-progress-stack { overflow-x: auto; }
          }
        `}</style>

        {/* Page header — AI Canvas site style (Manrope), not the Andromeda mono
            aesthetic of the demos below. Fixed light-on-dark colours because the
            showcase surface is always the Andromeda void. */}
        <header style={{ marginBottom: tokens.spacing[6], fontFamily: "var(--font-sans), 'Manrope', system-ui, sans-serif" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#DAE4A0',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 10,
            }}
          >
            Andromeda
          </div>
          <h1
            className="as-title"
            style={{
              margin: 0,
              fontSize: 'clamp(30px, 4.5vw, 42px)',
              fontWeight: 800,
              color: '#F4F4FA',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            System
          </h1>
          <p
            style={{
              margin: '16px 0 0 0',
              maxWidth: '56ch',
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.6,
              color: '#9B9B9E',
            }}
          >
            Built for designers, developers, and teams who want a system, not a stylesheet. Tokens, components, templates, and a documented brain that keeps everyone aligned.
          </p>
          <div
            style={{
              marginTop: 16,
              fontSize: 11,
              fontWeight: 600,
              color: '#7B7B7D',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {componentCount} components · {templateCount} templates · 1 brain · one-command install
          </div>
        </header>

        {/* ── Colors ─────────────────────────────────────────────────────── */}
        <Section
          title="Color Palette"
          kicker="Foundation · Colors"
          description="Three brand hue palettes lead: accent (turquoise), orange (warning), red (fault), each a 5-stop scale (100 lightest → 500 darkest) with a matching alpha. The foundational greys follow: surface, border, text. Every alpha sits in a single row at the seam between the two halves."
        >
          <Row label="Accent · Turquoise">
            {[
              { name: 'accent.100', color: tokens.color.accent[100], note: 'Highlighted text · pastel' },
              { name: 'accent.200', color: tokens.color.accent[200], note: 'Light emphasis' },
              { name: 'accent.300', color: tokens.color.accent[300], note: 'Active · selected · base' },
              { name: 'accent.400', color: tokens.color.accent[400], note: 'Focus borders · dim' },
              { name: 'accent.500', color: tokens.color.accent[500], note: 'Glow halos · tinted fills' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, background: color, border: `1px solid ${tokens.color.border.base}`, marginBottom: tokens.spacing[2] }} />
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, marginTop: tokens.spacing[1], minHeight: 28 }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.accent[400], marginTop: tokens.spacing[1], wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <Row label="Orange · Warning">
            {[
              { name: 'orange.100', color: tokens.color.orange[100], note: 'Pastel · highlight' },
              { name: 'orange.200', color: tokens.color.orange[200], note: 'Light · emphasis' },
              { name: 'orange.300', color: tokens.color.orange[300], note: 'Solid · icon · base' },
              { name: 'orange.400', color: tokens.color.orange[400], note: 'Border · ring' },
              { name: 'orange.500', color: tokens.color.orange[500], note: 'Subtle fill' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, background: color, border: `1px solid ${tokens.color.border.base}`, marginBottom: tokens.spacing[2] }} />
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, marginTop: tokens.spacing[1], minHeight: 28 }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.accent[400], marginTop: tokens.spacing[1], wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <Row label="Red · Fault">
            {[
              { name: 'red.100', color: tokens.color.red[100], note: 'Pastel · highlight' },
              { name: 'red.200', color: tokens.color.red[200], note: 'Light · emphasis' },
              { name: 'red.300', color: tokens.color.red[300], note: 'Solid · icon · base' },
              { name: 'red.400', color: tokens.color.red[400], note: 'Border · ring' },
              { name: 'red.500', color: tokens.color.red[500], note: 'Subtle fill' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, background: color, border: `1px solid ${tokens.color.border.base}`, marginBottom: tokens.spacing[2] }} />
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, marginTop: tokens.spacing[1], minHeight: 28 }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.accent[400], marginTop: tokens.spacing[1], wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <Row label="Alpha · Layered Tints">
            {[
              { name: 'accent.alpha',  color: tokens.color.accent.alpha,  note: 'Turquoise selection · highlight' },
              { name: 'orange.alpha', color: tokens.color.orange.alpha,   note: 'Warning overlay · caution tint' },
              { name: 'red.alpha',     color: tokens.color.red.alpha,     note: 'Fault overlay · error tint' },
              { name: 'surface.alpha', color: tokens.color.surface.alpha, note: 'Modal scrim · backdrop' },
              { name: 'border.alpha',  color: tokens.color.border.alpha,  note: 'Glassy edge · sheen' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, background: color, border: `1px solid ${tokens.color.border.base}`, marginBottom: tokens.spacing[2] }} />
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, marginTop: tokens.spacing[1], minHeight: 28 }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.accent[400], marginTop: tokens.spacing[1], wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <Row label="Surfaces">
            {[
              { name: 'surface.base',    color: tokens.color.surface.base,    note: 'Page void · root' },
              { name: 'surface.raised',  color: tokens.color.surface.raised,  note: 'Cards · panels' },
              { name: 'surface.overlay', color: tokens.color.surface.overlay, note: 'Dropdowns · tips' },
              { name: 'surface.hover',   color: tokens.color.surface.hover,   note: 'Hover state' },
              { name: 'surface.active',  color: tokens.color.surface.active,  note: 'Pressed state' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, background: color, border: `1px solid ${tokens.color.border.base}`, marginBottom: tokens.spacing[2] }} />
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, marginTop: tokens.spacing[1], minHeight: 28 }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.accent[400], marginTop: tokens.spacing[1], wordBreak: 'break-all' }}>{color}</div>
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
                <div style={{ height: 48, border: `1px solid ${color}`, marginBottom: tokens.spacing[2] }} />
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, marginTop: tokens.spacing[1], minHeight: 28 }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.accent[400], marginTop: tokens.spacing[1], wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <Row label="Text">
            {[
              { name: 'text.primary',   color: tokens.color.text.primary,   note: 'Headings · values' },
              { name: 'text.secondary', color: tokens.color.text.secondary, note: 'Body · descriptions' },
              { name: 'text.muted',     color: tokens.color.text.muted,     note: 'Kickers · metadata' },
              { name: 'text.faint',     color: tokens.color.text.faint,     note: 'Labels · hints' },
            ].map(({ name, color, note }) => (
              <div key={name} style={{ width: 148 }}>
                <div style={{ height: 48, border: `1px solid ${tokens.color.border.base}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: tokens.spacing[2] }}>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.md, color, letterSpacing: '0.1em' }}>Aa 01</span>
                </div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, marginTop: tokens.spacing[1], minHeight: 28 }}>{note}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.accent[400], marginTop: tokens.spacing[1], wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </Row>

          <div>
            <div style={{ marginBottom: tokens.spacing[3], fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.widest }}>
              Usage Reference
            </div>
            <div className="as-usage-grid" style={{ display: 'grid', gap: tokens.spacing[2] }}>
              {[
                { role: 'Page headings',       token: 'text.primary' },
                { role: 'Body · descriptions', token: 'text.secondary' },
                { role: 'Kickers · metadata',  token: 'text.muted' },
                { role: 'Decorative labels',   token: 'text.faint' },
                { role: 'Page background',     token: 'surface.base' },
                { role: 'Card backgrounds',    token: 'surface.raised' },
                { role: 'Hover → pressed',     token: 'surface.hover → surface.active' },
                { role: 'Dividers',            token: 'border.subtle' },
                { role: 'Default borders',     token: 'border.base' },
                { role: 'Focus borders',       token: 'border.bright' },
                { role: 'Active · selected',   token: 'accent.300' },
                { role: 'Accent glow',         token: 'accent.500' },
                { role: 'Warning indicator',   token: 'orange.300 + orange.500' },
                { role: 'Fault indicator',     token: 'red.300 + red.500' },
                { role: 'Modal scrim',         token: 'surface.alpha' },
                { role: 'Glassy edge',         token: 'border.alpha' },
                { role: 'Selection sheen',     token: 'color.alpha' },
              ].map(({ role, token }) => (
                <div key={role} style={{ padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`, background: tokens.color.surface.raised, border: `1px solid ${tokens.color.border.subtle}` }}>
                  <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider, marginBottom: tokens.spacing[1] }}>{role}</div>
                  <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.accent[100] }}>{token}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Typography ──────────────────────────────────────────────────── */}
        <Section
          title="Typography"
          kicker="Foundation · Type"
          description="JetBrains Mono is the only typeface. Both fontSans and fontMono resolve to it, and the distinction exists only for backward compatibility. Hierarchy comes from size, weight, and letter-spacing, not from switching families."
        >
          <div style={{ marginBottom: tokens.spacing[5] }}>
            <div style={{ marginBottom: tokens.spacing[3], fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.widest }}>
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
                { token: '5xl', px: '48px', usage: 'Stat primary value' },
              ].map(({ token, px, usage }) => (
                <div key={token} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[4], padding: `${tokens.spacing[2]} 0`, borderBottom: `1px solid ${tokens.color.border.subtle}` }}>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.widest, width: 28, flexShrink: 0 }}>{token}</span>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, width: 32, flexShrink: 0 }}>{px}</span>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: px, color: tokens.color.text.primary, letterSpacing: tokens.typography.tracking.wide, lineHeight: 1.1, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>ANDROMEDA</span>
                  <span className="as-scale-usage" style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, flexShrink: 0, textAlign: 'right' }}>{usage}</span>
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
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size['2xl'], fontWeight: val, color: tokens.color.text.primary, letterSpacing: tokens.typography.tracking.wider, marginBottom: tokens.spacing[1] }}>NOVA</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>weight.{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint }}>{val}</div>
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
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.md, fontWeight: 500, color: tokens.color.text.primary, letterSpacing: val, textTransform: 'uppercase', marginBottom: tokens.spacing[1] }}>TRACKING</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>tracking.{name}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.muted }}>{val || '0'}</div>
                <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, marginTop: tokens.spacing[1] }}>{usage}</div>
              </div>
            ))}
          </Row>
        </Section>

        {/* ── Spacing ────────────────────────────────────────────────────── */}
        <Section
          title="Spacing"
          kicker="Foundation · Spacing"
          description="A 4px-based scale. Token names track the px value: spacing.1 → 4px, spacing.4 → 16px. The scale skips 7, 9, and 11, because only the values the system actually uses are emitted, so the keys you have are the keys you should be reaching for."
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { token: '1',  px: '4px',  usage: 'Micro gaps · dot offsets · sub-line padding' },
              { token: '2',  px: '8px',  usage: 'Icon ↔ text · inline rhythm' },
              { token: '3',  px: '12px', usage: 'Card padding · list rows · default form gap' },
              { token: '4',  px: '16px', usage: 'Row gap · panel content rhythm' },
              { token: '5',  px: '20px', usage: 'Toolbar gap · header rhythm' },
              { token: '6',  px: '24px', usage: 'Section padding · panel gutter' },
              { token: '8',  px: '32px', usage: 'Page gutter · hero margin' },
              { token: '10', px: '40px', usage: 'Page top padding · large breaks' },
              { token: '12', px: '48px', usage: 'Hero bottom · max scale break' },
            ].map(({ token, px, usage }) => (
              <div
                key={token}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing[4],
                  padding: `${tokens.spacing[2]} 0`,
                  borderBottom: `1px solid ${tokens.color.border.subtle}`,
                }}
              >
                <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.widest, width: 110, flexShrink: 0 }}>
                  {`spacing.${token}`}
                </span>
                <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, width: 36, flexShrink: 0 }}>
                  {px}
                </span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                  <div
                    aria-hidden
                    style={{
                      width: px,
                      height: 8,
                      background: tokens.color.text.primary,
                      flexShrink: 0,
                    }}
                  />
                </div>
                <span className="as-scale-usage" style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, flexShrink: 0, textAlign: 'right' }}>
                  {usage}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Button ─────────────────────────────────────────────────────── */}
        <Section
          title="Button"
          slug="button"
          description="Action primitive with a mono uppercase label, a hover lift, a press scale, and a focus ring. Pass `asChild` to render a real link and `icon` for a leading glyph; when the action needs no text label, use IconButton. 5 variants × 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Default', props: { variant: 'default' } },
              { label: 'Outline', props: { variant: 'outline' } },
              { label: 'Ghost', props: { variant: 'ghost' } },
              { label: 'Destructive', props: { variant: 'destructive' } },
              { label: 'Link', props: { variant: 'link' } },
              { label: 'Disabled', props: { variant: 'default', disabled: true } },
            ]}
            render={(size, props) => (
              <Button size={size} {...props}>
                Label
              </Button>
            )}
          />
          {/* The icon slot is orthogonal to variant, so this row runs the full
              five rather than a sample. The link + ArrowUpRight pairing is the
              "way out of this panel" footer button (see the City Operations
              alerts panel), which the matrix cannot show. */}
          <Row label="With icon">
            <Button icon={Bell}>Notifications</Button>
            <Button variant="outline" icon={Gear}>
              Settings
            </Button>
            <Button variant="ghost" icon={EyeSlash}>
              Hide
            </Button>
            <Button variant="destructive" icon={Bell}>
              Abort
            </Button>
            <Button variant="link" icon={ArrowUpRight}>
              View all
            </Button>
          </Row>
        </Section>

        {/* ── IconButton ─────────────────────────────────────────────────── */}
        <Section
          title="Icon Button"
          slug="icon-button"
          description="Icon-only companion to `Button` for actions whose glyph reads as the label: close, refresh, settings, expand. It runs the same size ladder as `Button` so the two align in a toolbar row, and it needs an `aria-label` since there is no visible text; an icon-only sidebar entry stays a `NavItem` with `collapsed`. 4 variants × 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Default', props: { variant: 'default', 'aria-label': 'Default action' } },
              { label: 'Outline', props: { variant: 'outline', 'aria-label': 'Outline action' } },
              { label: 'Ghost', props: { variant: 'ghost', 'aria-label': 'Ghost action' } },
              { label: 'Destructive', props: { variant: 'destructive', 'aria-label': 'Destructive action' } },
              { label: 'Disabled', props: { variant: 'default', disabled: true, 'aria-label': 'Disabled action' } },
            ]}
            render={(size, props) => <IconButton size={size} icon={Gear} {...props} />}
          />
        </Section>

        {/* ── PanelHeader ────────────────────────────────────────────────── */}
        <Section
          allowOverflow
          title="Panel Header"
          slug="panel-header"
          description="Title row for a top-level dashboard panel: sentence-case title on the left, an optional `actions` slot on the right, and an inset divider below. Use it for page-level panels and `CardHeader` for regions nested inside a `Card`. 3 sizes."
        >
          {/* Fixed-width cells on purpose: a block header has no intrinsic
              width, so a max-content matrix column would shrink every panel
              down to the width of its own title. The actions control takes the
              row's rung by name, which is the pairing the JSDoc prescribes. */}
          <Matrix
            rows={[
              { label: 'Title only' },
              { label: 'Icon button', props: { actions: 'icon' } },
              { label: 'Panel menu', props: { actions: 'menu' } },
            ]}
            render={(size, props) => (
              <div style={{ width: 240, maxWidth: '100%', position: 'relative', background: tokens.color.surface.raised }}>
                <CornerMarkers />
                <PanelHeader
                  size={size}
                  title="Capacity"
                  actions={
                    props.actions === 'icon' ? (
                      <IconButton size={size} variant="ghost" aria-label={`Refresh (${size})`} icon={ArrowClockwise} />
                    ) : props.actions === 'menu' ? (
                      // Interactive, not staticOpen: the menu portals to <body>
                      // on click, so this cell needs neither allowOverflow nor a
                      // reserved minHeight.
                      <PanelMenu
                        size={size}
                        ariaLabel={`Capacity options (${size})`}
                        items={[
                          { label: 'Refresh', icon: ArrowClockwise, onSelect: () => {} },
                          { label: 'Export',  icon: Export,         onSelect: () => {} },
                          { type: 'separator' },
                          { label: 'Hide',    icon: EyeSlash,       onSelect: () => {} },
                        ]}
                      />
                    ) : undefined
                  }
                />
              </div>
            )}
          />
        </Section>

        {/* ── PanelMenu ──────────────────────────────────────────────────── */}
        <Section
          allowOverflow
          title="Panel Menu"
          slug="panel-menu"
          description="Kebab overflow menu for the `actions` slot of a panel header: items carry icons, separators, `selected` and `destructive` states, and one level of right-flyout submenu. The panel portals to the body and flips above the trigger when a downward menu would not fit, a submenu flips to the left when the right side would overflow, and the menu closes on outside click or Escape. 3 trigger sizes."
        >
          {/* The size prop moves the trigger box only (24/32/40); the menu panel
              itself never changes size, so the ladder is a one-row matrix. These
              triggers are interactive: click one and the real portaled menu
              opens and flips if it would not fit. */}
          <Matrix
            rows={[{ label: 'Trigger' }]}
            render={(size) => (
              <PanelMenu
                size={size}
                align="left"
                ariaLabel={`Panel options (${size})`}
                items={[
                  { label: 'Refresh', icon: ArrowClockwise, onSelect: () => {} },
                  { label: 'Export',  icon: Export,         onSelect: () => {} },
                ]}
              />
            )}
          />

          <Row label="Open menu · selection, submenu, destructive">
            {/* staticOpen pins both menus open so the contents read without a
                click (docs only, never product). They are absolutely
                positioned, so they add no height: minHeight reserves the room
                they would otherwise paint over. */}
            <div style={{ display: 'flex', gap: tokens.spacing[6], flexWrap: 'wrap', minHeight: 220 }}>
              <div style={{ width: 200, flexShrink: 0 }}>
                <PanelMenu
                  align="left"
                  staticOpen
                  ariaLabel="Range options"
                  items={[
                    { label: 'Live',      icon: Pulse,     selected: true, onSelect: () => {} },
                    { label: 'Hourly',    icon: Clock,     onSelect: () => {} },
                    { label: 'Daily',     icon: ChartLine, onSelect: () => {} },
                    { type: 'separator' },
                    { label: 'Configure', icon: Sliders,   onSelect: () => {} },
                    { label: 'Export',    icon: Export,    onSelect: () => {} },
                  ]}
                />
              </div>
              <div style={{ width: 200, flexShrink: 0 }}>
                <PanelMenu
                  align="left"
                  staticOpen
                  ariaLabel="Row options"
                  items={[
                    { label: 'Edit', icon: Pencil, onSelect: () => {} },
                    { label: 'Copy', icon: Copy,   onSelect: () => {} },
                    {
                      label: 'Move to',
                      icon: ArrowUpRight,
                      submenu: [
                        { label: 'Starred', icon: Star,     onSelect: () => {} },
                        { label: 'Archive', icon: Database, onSelect: () => {} },
                        { label: 'Snoozed', icon: Clock,    onSelect: () => {} },
                      ],
                    },
                    { type: 'separator' },
                    { label: 'Delete', icon: Trash, destructive: true, onSelect: () => {} },
                  ]}
                />
              </div>
            </div>
          </Row>
        </Section>

        {/* ── Badge ──────────────────────────────────────────────────────── */}
        <Section
          title="Badge"
          slug="badge"
          description="Read-only status label for the state a row or cell reports: online, queued, fault. The leading dot carries the signal rather than the text, and Badge never responds to a click, so use Tag when the label has to be dismissible. 6 variants × 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Default', props: { variant: 'default' } },
              { label: 'Accent', props: { variant: 'accent' } },
              { label: 'Warning', props: { variant: 'warning' } },
              { label: 'Fault', props: { variant: 'fault' } },
              { label: 'Subtle', props: { variant: 'subtle' } },
              { label: 'Outline', props: { variant: 'outline' } },
            ]}
            render={(size, props) => (
              <Badge size={size} {...props}>
                Label
              </Badge>
            )}
          />
        </Section>

        {/* ── Avatar ─────────────────────────────────────────────────────── */}
        <Section
          title="Avatar"
          slug="avatar"
          description="Square initials chip that stands for a person in a row, table cell, or assignee slot. Pass `src` to show an image, which falls back to initials if the image fails to load, and `status` to add the edge bar: online, caution, fault, or offline. 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Initials' },
              { label: 'Image', props: { src: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
              { label: 'Online', props: { status: 'online' } },
              { label: 'Caution', props: { status: 'caution' } },
              { label: 'Fault', props: { status: 'fault' } },
              { label: 'Offline', props: { status: 'offline' } },
            ]}
            render={(size, props) => (
              <Avatar name="Reza Quinn" size={size} {...props} />
            )}
          />
        </Section>

        {/* ── Card ───────────────────────────────────────────────────────── */}
        <Section
          title="Card"
          slug="card"
          description="Compound panel primitive: `Card` with `CardHeader`, `CardContent`, `CardFooter`, `CardTitle` and `CardDescription`, framed by corner brackets rather than a perimeter stroke. `bordered` swaps the brackets for a continuous 1px border and the `glow` variant tints the surface for the one panel that should be read first; use `CardHeader` for a region inside a card, `PanelHeader` for a top level panel. 2 variants x 2 frame modes."
        >
          <div
            className="as-grid-2"
            style={{
              display: 'grid',
              gap: tokens.spacing[5],
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
                    {'/// Default'}
                  </span>
                  <CardTitle>Default card</CardTitle>
                </div>
                <Badge variant="default">Idle</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sharp corners with bracket markers tucked into each corner. No
                  perimeter stroke: the brackets are the frame.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button size="md" variant="outline">
                  Configure
                </Button>
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
                    {'/// Glow'}
                  </span>
                  <CardTitle>Highlight card</CardTitle>
                </div>
                <Badge variant="accent">Live</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tinted accent gradient surface. Use for the card you want to
                  draw the user's eye to first.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button size="md">Open</Button>
              </CardFooter>
            </Card>

            <Card bordered>
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
                    /// Bordered
                  </span>
                  <CardTitle>Bordered card</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A continuous 1px border.base stroke replaces the brackets. It
                  is either the perimeter or the markers, never both.
                </CardDescription>
              </CardContent>
            </Card>

            <Card variant="glow" bordered>
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
                    /// Bordered · Glow
                  </span>
                  <CardTitle>Bordered glow</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  The bordered glow takes its perimeter from accent.500, the peak
                  of the gradient, so the stroke sits with the fill.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ── CornerMarkers ──────────────────────────────────────────────── */}
        <Section
          title="Corner Markers"
          slug="corner-markers"
          description="The defining Andromeda motif: 4 L-shaped brackets pinned to the corners of the nearest `position: relative` ancestor, framing it in place of a perimeter border. `Card` renders them for you, so reach for this directly only in a bespoke container. `size`, `offset` and `borderWidth` override the `tokens.marker` geometry and `radius` overrides the frame radius; the brackets stay `border.bright` grey, because color is reserved for measurement."
        >
          <div style={{ display: 'flex', gap: tokens.spacing[5], flexWrap: 'wrap' }}>
            {[
              { label: 'Default', props: {} },
              { label: 'Size 18', props: { size: 18 } },
              { label: 'Offset 6', props: { offset: 6 } },
              { label: 'Radius 6', props: { radius: 6 } },
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
          slug="input"
          description="Single-line text field for free text in a form row, with an optional mono uppercase label and an optional left icon. Pass `error` and the border, focus ring, and helper message switch to fault with `aria-invalid` wired in; a command bar with a shortcut chip is `SearchField`, and a date is `DateRangePicker`. 2 states × 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Default', props: {} },
              { label: 'With label', props: { label: 'Callsign' } },
              { label: 'With icon', props: { icon: MagnifyingGlass } },
              { label: 'Error', props: { label: 'Validation', defaultValue: 'INVALID', error: 'Field cannot be empty' } },
              { label: 'Disabled', props: { defaultValue: 'LOCKED', disabled: true } },
            ]}
            render={(size, props) => (
              <Input size={size} placeholder="ENTER CALLSIGN" style={{ width: 220 }} {...props} />
            )}
          />
        </Section>

        {/* ── SearchField ────────────────────────────────────────────────── */}
        <Section
          title="Search Field"
          slug="search-field"
          description="Command bar style search input: leading icon, mono text, and an optional ⌘ K chip you drop by passing `null` to `shortcut`. Use `Input` for a labelled form field, and `IconButton` when you only need a trigger that opens a search overlay. 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Placeholder', props: {} },
              { label: 'Typed', props: { defaultValue: 'orbital launch' } },
              { label: 'Custom shortcut', props: { shortcut: '⌘ F' } },
              { label: 'No shortcut', props: { shortcut: null } },
              { label: 'No icon', props: { icon: null } },
              { label: 'Disabled', props: { disabled: true } },
            ]}
            render={(size, props) => (
              // The field is width:100% by default, so each cell states its own
              // width; a fixed 240 keeps the three rungs directly comparable.
              <SearchField size={size} placeholder="Search anything" style={{ width: 240 }} {...props} />
            )}
          />
        </Section>

        {/* ── NavItem ────────────────────────────────────────────────────── */}
        <Section
          title="Nav Item"
          slug="nav-item"
          description="Sidebar navigation row: optional icon, label, and an active state carried by accent text plus a small square on the right edge, never a background fill. `collapsed` is the icon-rail form, which drops that square and lets the accent glyph carry active, so pair it with a Tooltip for the visible name; an icon-only row that is still a destination belongs here rather than in IconButton. 3 boolean axes, no sizes: `active`, `mono` (uppercase mono label by default, sans when false), `collapsed`."
        >
          <div style={{ display: 'flex', gap: tokens.spacing[5], alignItems: 'flex-start' }}>
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
              <NavItem icon={ChartLine} label="Reports" />
              <NavItem icon={Bell} label="Alerts" />
              <NavItem icon={Users} label="Members" />
              <NavItem icon={Database} label="Logs" />
              <NavItem icon={Gear} label="Settings" />
            </div>

            {/* The same list collapsed to an icon rail. No edge square here —
                the accent glyph marks the current row. Tooltip is inline-flex
                by default, which would shrink-wrap the row to the glyph and
                leave the hover fill narrower than the rail. */}
            <div
              style={{
                width: 56,
                background: tokens.color.surface.raised,
                position: 'relative',
              }}
            >
              <CornerMarkers />
              {[
                { icon: Compass, label: 'Overview' },
                { icon: Pulse, label: 'Activity' },
                { icon: ChartLine, label: 'Reports' },
                { icon: Bell, label: 'Alerts' },
                { icon: Users, label: 'Members' },
                { icon: Database, label: 'Logs' },
                { icon: Gear, label: 'Settings' },
              ].map((item, i) => (
                <Tooltip
                  key={item.label}
                  label={item.label}
                  position="right"
                  style={{ display: 'flex', width: '100%' }}
                >
                  <NavItem collapsed icon={item.icon} label={item.label} active={i === 0} />
                </Tooltip>
              ))}
            </div>
          </div>
        </Section>

        {/* ── ProgressBar ────────────────────────────────────────────────── */}
        <Section
          title="Progress Bar"
          slug="progress-bar"
          description="A bounded 0 to 100 meter for one reading such as capacity, load, or completion: 30 skewed segments fill left to right in a scroll-gated cascade, with an optional `label` and percent readout above. Set `variant` to escalate a reading past a threshold; for a series over time use `TrendChart`, for a matrix of readings use `HeatGrid`. 3 variants."
        >
          <Row label="Variants">
            <div
              className="as-progress-stack"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacing[5],
                maxWidth: 520,
              }}
            >
              <ProgressBar label="Storage Used" value={72} variant="default" />
              <ProgressBar label="Bandwidth" value={48} variant="warning" />
              <ProgressBar label="Memory Critical" value={91} variant="fault" />
            </div>
          </Row>
        </Section>

        {/* ── HeatGrid ───────────────────────────────────────────────────── */}
        <Section
          title="Heat Grid"
          slug="heat-grid"
          description="A 2-D matrix fill gauge for a single level: risk, capacity, saturation. Cells fill from the bottom centre outward as `value` rises, dim at the base and bright at the frontier, and the gauge stays live after the first fill so later `value` changes crossfade in place. Use `ProgressBar` when levels sit in list rows or need comparing side by side."
        >
          <Row label="Live · jump or drag (cells appear / disappear in real time)">
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[8], flexWrap: 'wrap' }}>
              <HeatGrid value={heatValue} label="Live gauge" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[4], minWidth: 240 }}>
                <div style={{ display: 'flex', gap: tokens.spacing[2], flexWrap: 'wrap' }}>
                  {[0, 40, 60, 80, 100].map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={heatValue === v ? 'default' : 'outline'}
                      onClick={() => setHeatValue(v)}
                    >
                      {v}%
                    </Button>
                  ))}
                </div>
                <Slider value={heatValue} onValueChange={setHeatValue} min={0} max={100} label="Fill" unit="%" />
              </div>
            </div>
          </Row>
          <Row label="Fill levels · without readout">
            <HeatGrid value={30} cellSize={16} gap={2} showValue={false} label="Low" />
            <HeatGrid value={75} cellSize={16} gap={2} showValue={false} label="High" />
            <HeatGrid value={100} cellSize={16} gap={2} showValue={false} label="Full" />
          </Row>
        </Section>

        {/* ── StatTile ───────────────────────────────────────────────────── */}
        <Section
          title="Stat Tile"
          slug="stat-tile"
          description="A single headline metric framed as a `Card`: big value, optional `unit`, and a signed delta whose arrow gives the direction while the colour gives the judgment. Set `polarity` to `lower-is-better` for latency or error rate so a drop reads as good, or to `none` for a reading with no good side. The value counts up once when the tile scrolls into view; `live` snaps later updates and `liveRoll` rolls them digit by digit."
        >
          {/* Direction and judgment are two channels. Latency falling is ▼ AND
              good, so it reads accent; Demand has no good direction at all, so
              `polarity="none"` declines the judgment and stays muted. */}
          <Row label="Delta polarity">
            <StatTile
              label="Throughput"
              code="REQ-01"
              value="7842"
              unit="rps"
              delta={2.4}
              deltaLabel="vs prior period"
            />
            <StatTile
              label="Latency"
              code="LAT-02"
              value="412"
              unit="ms"
              delta={-1.2}
              polarity="lower-is-better"
              deltaLabel="vs prior period"
            />
            <StatTile
              label="Demand"
              code="DEM-04"
              value="318"
              unit="kw"
              delta={3.1}
              polarity="none"
              deltaLabel="vs prior period"
            />
          </Row>
          <Row label="Flat and no delta">
            <StatTile
              label="Queue Depth"
              code="QUE-05"
              value="12"
              delta={0}
              deltaLabel="vs prior period"
            />
            <StatTile label="Errors" code="ERR-03" value="1.04" unit="%" />
          </Row>
        </Section>

        {/* ── Tag ────────────────────────────────────────────────────────── */}
        <Section
          title="Tag"
          slug="tag"
          description="Compact labels for metadata, filters, and multi-select inputs. Like Badge, but dismissible: pass `onClose` and it grows a dismiss button. 4 variants × 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Default', props: { variant: 'default' } },
              { label: 'Accent', props: { variant: 'accent' } },
              { label: 'Warning', props: { variant: 'warning' } },
              { label: 'Fault', props: { variant: 'fault' } },
              { label: 'Dismissible', props: { variant: 'default', onClose: () => {} } },
            ]}
            render={(size, props) => (
              <Tag size={size} {...props}>
                Label
              </Tag>
            )}
          />
        </Section>

        {/* ── Checkbox ───────────────────────────────────────────────────── */}
        <Section
          title="Checkbox"
          slug="checkbox"
          description="Square boolean control for multi-select sets: filters, table row selection, single opt-ins. Controlled with `checked` and `onCheckedChange`, or uncontrolled with `defaultChecked`; use Radio for one choice out of several and Toggle for a setting that applies with no submit step. 2 states × 3 sizes, plus a disabled form of each."
        >
          <Matrix
            rows={[
              { label: 'Unchecked', props: {} },
              { label: 'Checked', props: { defaultChecked: true } },
              { label: 'Disabled', props: { disabled: true } },
              { label: 'Disabled checked', props: { disabled: true, defaultChecked: true } },
            ]}
            render={(size, props) => <Checkbox size={size} label="Label" {...props} />}
          />
        </Section>

        {/* ── Radio (Choicebox) ──────────────────────────────────────────── */}
        <Section
          title="Radio · Choicebox"
          slug="radio"
          description="Square radio for one mutually exclusive choice from a small set that stays visible, such as a mode or a filter. Wrap the options in `RadioGroup` to share a `name` and drive selection through `value` and `onValueChange`; use `Checkbox` when more than one option can be picked at once. 2 states x 3 sizes."
        >
          <Row label="Group">
            <RadioGroup
              value={radioValue}
              onValueChange={setRadioValue}
              // flexWrap so the four labeled radios drop to a second line on a
              // phone instead of overflowing the card. Inert on desktop (all
              // four fit one line in the 1180px shell), so desktop is unchanged.
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[4] }}
            >
              <Radio value="default" label="Default" />
              <Radio value="alternate" label="Alternate" />
              <Radio value="ground" label="Ground" />
              <Radio value="disabled" label="Restricted" disabled />
            </RadioGroup>
          </Row>
          <Matrix
            rows={[
              { label: 'Unchecked', props: {} },
              { label: 'Checked', props: { defaultChecked: true } },
              { label: 'Disabled', props: { disabled: true } },
              { label: 'Disabled checked', props: { disabled: true, defaultChecked: true } },
            ]}
            render={(size, props) => <Radio size={size} label="Label" {...props} />}
          />
        </Section>

        {/* ── Toggle ─────────────────────────────────────────────────────── */}
        <Section
          title="Toggle · Switch"
          slug="toggle"
          description="Binary switch for a setting that takes effect the moment it flips: live mode, notifications, autopilot. Use `Checkbox` when the choice belongs to a form that submits later; here `checked` and `onCheckedChange` drive it, or `defaultChecked` leaves it uncontrolled. 2 states x 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Off' },
              { label: 'On', props: { defaultChecked: true } },
              { label: 'Disabled', props: { disabled: true } },
              { label: 'Disabled on', props: { disabled: true, defaultChecked: true } },
            ]}
            render={(size, props) => <Toggle size={size} label="Label" {...props} />}
          />
        </Section>

        {/* ── SegmentedControl ───────────────────────────────────────────── */}
        <Section
          title="Segmented Control"
          slug="segmented-control"
          description="Fixed height strip of mutually exclusive segments for switching a view or mode, a chart range or a unit picker, with a grey fill that slides to the active segment. It holds no state, so drive it with `value` and `onChange`; reach for `Button` or `IconButton` when the choices are independent actions. 3 sizes."
        >
          <Matrix
            rows={[
              {
                label: 'Icons',
                props: {
                  group: 'chart',
                  options: [
                    { value: 'line', icon: ChartLine, ariaLabel: 'Line chart' },
                    { value: 'bars', icon: ChartBar,  ariaLabel: 'Bar chart' },
                  ],
                },
              },
              {
                label: 'Labels',
                props: {
                  group: 'period',
                  options: [
                    { value: '1d',  label: '1D' },
                    { value: '1w',  label: '1W' },
                    { value: '1m',  label: '1M' },
                    { value: 'all', label: 'ALL' },
                  ],
                },
              },
            ]}
            render={(size, { group, options }) => (
              <SegmentedControl
                size={size}
                // Distinct per cell: the sliding indicator is a shared layoutId,
                // and six strips on one page would fight over a single marker.
                layoutGroupId={`andromeda-showcase-segmented-${group}-${size}`}
                value={group === 'period' ? periodValue : chartTypeSm}
                onChange={group === 'period' ? setPeriodValue : setChartTypeSm}
                options={options}
              />
            )}
          />
        </Section>

        {/* ── DateRangePicker ────────────────────────────────────────────── */}
        <Section
          allowOverflow
          title="Date Range Picker"
          slug="date-range-picker"
          description="Trigger chip that opens a calendar popover for picking a start and end date: report windows, telemetry spans, filter bands. Controlled only, drive `value` as a start and end pair and commit through `onChange`, where the first click sets the anchor and the second confirms. Accent fills the two endpoints and outlines the days between, so colour marks the selection and nothing else."
        >
          <Row label="Trigger">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <DateRangePicker value={dateRange} presetLabel="Last month" onChange={setDateRange} />
          </Row>
          <Row label="Panel, pinned open">
            {/* The calendar panel is absolutely positioned (~330px tall) and
                would otherwise overflow into the next section. */}
            <div style={{ minHeight: 380 }}>
              <DateRangePicker
                value={dateRange}
                presetLabel="Custom"
                onChange={setDateRange}
                staticOpen
              />
            </div>
          </Row>
        </Section>

        {/* ── Spinner ────────────────────────────────────────────────────── */}
        <Section
          title="Spinner"
          slug="spinner"
          description="Indeterminate busy indicator: a 3x3 pixel grid whose 8 perimeter cells run a snake trail off one shared keyframe, with the center cell held statically dim. Use `ProgressBar` instead when the percentage is known. 4 variants x 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Default', props: { variant: 'default' } },
              { label: 'Accent', props: { variant: 'accent' } },
              { label: 'Warning', props: { variant: 'warning' } },
              { label: 'Fault', props: { variant: 'fault' } },
            ]}
            render={(size, props) => <Spinner size={size} {...props} />}
          />
        </Section>

        {/* ── Slider ─────────────────────────────────────────────────────── */}
        <Section
          title="Slider"
          slug="slider"
          description="Single-value horizontal range control: drag the thumb, or use the arrows, PageUp and PageDown, Home and End to set one continuous number. The accent fill is the reading, so reach for `ProgressBar` when the level is read-only and cannot be dragged. 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Default', props: { defaultValue: 64 } },
              { label: 'No readout', props: { defaultValue: 64, showValue: false } },
              { label: 'Disabled', props: { defaultValue: 64, disabled: true } },
            ]}
            render={(size, props) => (
              <Slider size={size} label="Level" unit="%" style={{ width: 180 }} {...props} />
            )}
          />
          {/* Controlled pair — the matrix cells are uncontrolled, so this row is
              what shows `value` + `onValueChange` and a range that crosses zero. */}
          <Row label="Controlled">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: tokens.spacing[5],
                width: '100%',
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
            </div>
          </Row>
        </Section>

        {/* ── Textarea ───────────────────────────────────────────────────── */}
        <Section
          title="Textarea"
          slug="textarea"
          description="Multi-line text entry for notes, descriptions, and log input. Use `Input` when the value fits on one line; here the starting height comes from `rows`, the field resizes vertically only, and passing `error` turns the border red and announces the message. 2 states x 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Default' },
              { label: 'Error', props: { error: 'Too short', defaultValue: 'BRIEF' } },
              { label: 'Disabled', props: { disabled: true, defaultValue: 'LOCKED' } },
            ]}
            render={(size, props) => (
              <Textarea
                size={size}
                label="Notes"
                rows={2}
                placeholder="ENTER NOTES…"
                style={{ width: 200 }}
                {...props}
              />
            )}
          />
        </Section>

        {/* ── Alert ──────────────────────────────────────────────────────── */}
        <Section
          title="Alert"
          slug="alert"
          kicker="Component · Error"
          description="Banner-style status message that stays in the document flow, composed from `AlertIcon`, `AlertContent`, `AlertTitle` and `AlertDescription`. The `variant` prop sets severity: warning and fault announce assertively, default and accent politely; for a labeled block with no severity, use Card. 4 variants."
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[3],
              // Cap the banner width so the alerts read as inline messages
              // instead of stretching the full (very wide) showcase column on
              // desktop. maxWidth caps; the alerts still fill the width on
              // phones (where full-width is the right look).
              maxWidth: 640,
            }}
          >
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
        </Section>

        {/* ── Empty State ────────────────────────────────────────────────── */}
        <Section
          title="Empty State"
          slug="empty-state"
          description="Placeholder for a region that resolved to nothing: a table with zero rows, a first-run panel, a filter that matched nothing. Built on `Card`, so it brings its own corner-marker frame; compose it from `EmptyStateIcon`, `EmptyStateTitle`, `EmptyStateDescription` and `EmptyStateAction`. It states absence, not failure or loading, so the icon and text stay grey and the action slot holds one or two buttons at most."
        >
          <div className="as-grid-2" style={{ display: 'grid', gap: tokens.spacing[5] }}>
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
            <EmptyState>
              <EmptyStateTitle>No records</EmptyStateTitle>
              <EmptyStateDescription>
                The filter matched nothing in this sector. Widen the range or
                clear the filter.
              </EmptyStateDescription>
            </EmptyState>
          </div>
        </Section>

        {/* ── Charts ─────────────────────────────────────────────────────── */}
        <Section
          title="Radar Chart"
          slug="radar-chart"
          kicker="Component · Charts"
          description="Radial spider chart for comparing up to four series across one shared set of axes, such as a ship systems diagnostic. Choose it when every series is measured on the same multi-axis profile; for values over time or over a category axis use `TrendChart`. It frames itself with a header, plot, and legend, so never wrap it in a `Card`."
        >
          <div className="as-grid-2" style={{ display: 'grid', gap: tokens.spacing[5] }}>
            <RadarChart
              label="/// Systems"
              title="Ship Diagnostics"
            />
            <RadarChart
              label="/// Performance"
              title="System Performance"
              description="Current system readiness"
              data={[
                { axis: 'CPU',      score: 94 },
                { axis: 'MEMORY',   score: 81 },
                { axis: 'STORAGE',  score: 76 },
                { axis: 'NETWORK',  score: 88 },
                { axis: 'SECURITY', score: 65 },
                { axis: 'API',      score: 90 },
              ]}
              series={[{ key: 'score', label: 'Readiness', color: tokens.color.accent[300] }]}
            />
          </div>
        </Section>

        {/* ── Trend Chart ────────────────────────────────────────────────── */}
        <Section
          title="Trend Chart"
          slug="trend-chart"
          kicker="Component · Charts"
          description="Multi-series time-series chart, up to four series, drawn as line, area, or bar from the built-in mode toggle; each series takes a `role` that sets its colour: `baseline` white, `live` accent, `context` faint, `threshold` red dashed. It renders content only, so wrap it in a `Card` or a corner-marked surface, and reach for `MetricChart` when a single series needs a panel with its own frame. 3 modes x 4 series roles."
        >
          <div style={{ position: 'relative', background: tokens.color.surface.raised, padding: tokens.spacing[5] }}>
            <CornerMarkers />
            <TrendChart
              title="Allocation vs usage"
              yLabel="Compute units, PFLOPS"
              height={260}
              data={TREND_DEMO_DATA}
              series={[
                { key: 'allocated', label: 'Allocated', role: 'baseline' },
                { key: 'used',      label: 'Used',      role: 'live' },
                { key: 'reserved',  label: 'Reserved',  role: 'context' },
              ]}
              tooltipLabelFormatter={(l) => `DAY ${String(l).padStart(2, '0')}`}
            />
          </div>
        </Section>

        {/* ── Funnel Chart ───────────────────────────────────────────────── */}
        <Section
          title="Funnel Chart"
          slug="funnel-chart"
          kicker="Component · Charts"
          description="Stage-to-stage conversion where each stage is a subset of the one before it, and the taper between bands is the loss you read. Ordered categories that are independent of one another belong in `TrendChart` bar mode instead. Bands rest in neutral ink; `tone` says how healthy a stage is and has to be derived from the data, never one hue per stage. 5 tones × 2 percentage bases."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[5], width: '100%' }}>
            <Row label="Overall conversion">
              <div style={{ position: 'relative', background: tokens.color.surface.raised, padding: tokens.spacing[5], width: '100%' }}>
                <CornerMarkers />
                <FunnelChart stages={FUNNEL_DEMO_STAGES} height={160} style={{ width: '100%' }} />
              </div>
            </Row>
            <Row label="Step conversion · tone from the data">
              <div style={{ position: 'relative', background: tokens.color.surface.raised, padding: tokens.spacing[5], width: '100%' }}>
                <CornerMarkers />
                <FunnelChart stages={FUNNEL_DEMO_TONED} percentOf="previous" height={160} style={{ width: '100%' }} />
              </div>
            </Row>
          </div>
        </Section>

        {/* ── Metric Chart ───────────────────────────────────────────────── */}
        <Section
          title="Metric Chart"
          slug="metric-chart"
          kicker="Component · Charts"
          description="Self-framed panel for one live measurement over time: altitude, latency, a bounded percentage. It carries its own corner markers, header and status badge, and fits the y-domain to the data, so a non-zero floor is not crushed into a sliver; reach for `TrendChart` when you need more than one series, or a plot inside a panel you compose yourself. 3 variants, and they color the status badge only: chart ink stays neutral."
        >
          <div className="as-grid-2" style={{ display: 'grid', gap: tokens.spacing[5] }}>
            <MetricChart />
            <MetricChart
              label="/// Station"
              title="Orbital Altitude"
              description="Reboost burn at 14:00"
              unit="km"
              variant="warning"
              badgeText="Drift"
            />
          </div>
        </Section>

        {/* ── Gauge ──────────────────────────────────────────────────────── */}
        <Section
          title="Gauge"
          slug="gauge"
          kicker="Component · Charts"
          description="Radial readout for one bounded measurement: utilization, health, signal strength. The arc carries the reading, so its color escalates from accent to orange to red over a neutral track, and `ProgressBar` covers the same job when a level reads better as a linear bar. 3 variants × 3 sizes."
        >
          <Matrix
            rows={[
              { label: 'Accent', props: { variant: 'accent', value: 82 } },
              { label: 'Warning', props: { variant: 'warning', value: 64 } },
              { label: 'Fault', props: { variant: 'fault', value: 12 } },
              { label: 'With label', props: { value: 68, label: 'CPU' } },
              { label: 'Label only', props: { value: 68, label: 'CPU', showValue: false } },
            ]}
            render={(size, props) => <Gauge size={size} {...props} />}
          />
        </Section>

        {/* ── Waveform ───────────────────────────────────────────────────── */}
        <Section
          title="Waveform"
          slug="waveform"
          kicker="Component · Charts"
          description="Live signal line for audio or telemetry: a morphing polyline over mirrored level bars and a dashed centre reference, drawn in a fluid SVG. `paused` and reduced motion hold a static frame instead of blanking it, and setting `showBars` or `showCenterline` to false removes the reference layers. Use `MetricChart` or `TrendChart` when the numbers have to be read; `Waveform` only shows that a feed is alive."
        >
          <Row label="Live">
            <div style={{ width: '100%' }}>
              <Waveform />
            </div>
          </Row>
          {/* paused holds the frame rather than blanking the box, the same
              thing prefers-reduced-motion gets. Bars off, shorter height. */}
          <Row label="Paused, no bars">
            <div style={{ width: '100%' }}>
              <Waveform height={80} showBars={false} paused />
            </div>
          </Row>
        </Section>

        {/* ── Media Card ─────────────────────────────────────────────────── */}
        <Section
          title="Media Card"
          slug="media-card"
          kicker="Component · Surfaces"
          description="Image-backed content tile for mixes, channels, and featured items whose artwork is the recognition cue. It composes `Card` with `markers` off, adds a bottom scrim, a mono code tag, title and meta, and one corner control; the whole card is the hit target unless `action` is `none`, and the image zooms on hover while the frame and text hold still. 3 `action` modes: `play`, `cta`, `none`."
        >
          <div className="as-grid-2" style={{ display: 'grid', gap: tokens.spacing[5] }}>
            <MediaCard code="MIX-01" title="Your Mix" meta="3.4k plays" action="play" />
            <MediaCard
              code="CH-04"
              title="Deep Focus"
              meta="Ambient · 2h"
              action="cta"
              ctaLabel="Open"
              image="https://ik.imagekit.io/aitoolkit/andromeda/signal-room/mix-03.webp"
            />
          </div>
        </Section>

        {/* ── Data Table ─────────────────────────────────────────────────── */}
        <Section
          title="Data Table"
          slug="data-table"
          kicker="Component · Data"
          description="Configuration-driven data grid: pass `columns` and `rows` to get dense mono cells, inset hairline dividers, row hover, and an accent left edge on the row named by `selectedRowKey`. Reach for Table instead when cells need bespoke structure that no shared column model can describe. Below the md breakpoint a `hideBelow` column folds into the per-row info tooltip or the primary column's sub-line, so the grid never grows a horizontal scrollbar."
        >
          <DataTable />
        </Section>

        {/* ── Music Player ───────────────────────────────────────────────── */}
        <Section
          title="Music Player"
          slug="music-player"
          kicker="Component · Composites"
          description="Block-scale transport bar: track identity, the transport cluster, a scrub slider with elapsed and remaining readouts, and like, lyrics and volume controls. Play is the one accent-filled action, everything else is ghost, and the bar stacks into three rows on its own container width rather than the viewport. Pass `playing`, `elapsed` and the matching callbacks to drive it, or omit them and it runs the live demo below."
        >
          <MusicPlayer />
        </Section>

        {/* ── Planet · Next Destination ──────────────────────────────────── */}
        <Section
          title="Planet"
          slug="planet"
          kicker="Component · Visualization"
          description="Particle sphere rendered in Three.js on a transparent canvas, lit from one side and slowly rotating: a hero set piece for an active body or a next destination. It shows no value, so use `ProgressBar` or `HeatGrid` when a measurement is the point. Every particle takes its color from the accent ramp read at mount, so a themed page renders a themed planet, and reduced motion holds the sphere still."
        >
          <div className="as-grid-planet" style={{ display: 'grid', gap: tokens.spacing[5] }}>
            {/* Standalone planet — full canvas */}
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.widest }}>/// Body</span>
                  <CardTitle>Solo</CardTitle>
                </div>
              </CardHeader>
              <div style={{ height: 280, position: 'relative' }}>
                <Planet />
              </div>
            </Card>

            {/* Composed "Next Destination" widget */}
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
                  <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.widest }}>/// Heading</span>
                  <CardTitle>Next Destination</CardTitle>
                </div>
                <Badge variant="accent">LOCKED</Badge>
              </CardHeader>
              <div className="as-grid-2" style={{ display: 'grid', gap: tokens.spacing[4], padding: tokens.spacing[4], alignItems: 'center' }}>
                <div style={{ height: 220, position: 'relative' }}>
                  <Planet particleCount={5500} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[3] }}>
                  <div>
                    <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.widest }}>Target</div>
                    <div style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xl, color: tokens.color.text.primary, fontWeight: tokens.typography.weight.bold, letterSpacing: tokens.typography.tracking.wider, marginTop: tokens.spacing[1] }}>KEPLER-186F</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
                    {[
                      { label: 'Distance', value: '492.3 ly' },
                      { label: 'ETA',      value: '2027.04.18' },
                      { label: 'Bearing',  value: '042.7°'    },
                      { label: 'Class',    value: 'M-Dwarf'   },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${tokens.color.border.subtle}`, paddingBottom: tokens.spacing[2] }}>
                        <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.muted, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>{label}</span>
                        <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.sm, color: tokens.color.text.primary, letterSpacing: tokens.typography.tracking.wide }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <CardFooter>
                <Button variant="default" size="sm">ENGAGE TRAJECTORY</Button>
                <Button variant="ghost"   size="sm">DETAILS</Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <Section
          title="Table"
          slug="table"
          description="Compound primitive for dense tabular data: `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell`. Headers take `sort` for the caret and `aria-sort`, rows take `selected` for the accent left edge, and a wide table scrolls inside its panel instead of reflowing into cards. Reach for `DataTable` when a column config describes the records, and for `Table` when cells need bespoke structure; mount one `TableStyles` per page."
        >
          <TableStyles />
          <Table>
            <TableHead>
              <TableRow hoverable={false}>
                <TableHeader>Order ID</TableHeader>
                <TableHeader>Part ID</TableHeader>
                <TableHeader>Source Location</TableHeader>
                <TableHeader sort="asc">Source Level</TableHeader>
                <TableHeader sort="sortable">Service Level</TableHeader>
                <TableHeader align="right">Total Volume</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { id: 'AB-00032734', part: 'X60 BJGJ29839281', source: 'US, Denver - 24071',        lvl: '66%', svc: '4/10', vol: '10.9985' },
                { id: 'AB-00032736', part: 'X61 BHH09027512',  source: 'US, San Francisco - 27381',  lvl: '75%', svc: '3/10', vol: '8.85221', selected: true },
                { id: 'AB-00039925', part: 'X52 BB0372/2 X5A', source: 'US, Houston - 24027',        lvl: '98%', svc: '7/10', vol: '10.29701' },
                { id: 'AB-00032002', part: 'B12 BZ9025/2 X12', source: 'EU, Sweden - 00085',         lvl: '68%', svc: '2/10', vol: '3.92871' },
              ].map((r) => (
                <TableRow key={r.id} selected={!!r.selected}>
                  <TableCell muted>{r.id}</TableCell>
                  <TableCell>{r.part}</TableCell>
                  <TableCell muted>{r.source}</TableCell>
                  <TableCell>{r.lvl}</TableCell>
                  <TableCell>{r.svc}</TableCell>
                  <TableCell align="right">{r.vol}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* ── Tooltip ────────────────────────────────────────────────────── */}
        <Section
          title="Tooltip"
          slug="tooltip"
          description="Hover and focus label for a control that carries no text of its own, most often an `IconButton`. It never eats a click and shifts away from a viewport edge instead of pushing the page sideways; set `position` to `left` or `right` on an icon rail, where a label above a row would cover its neighbour. 4 positions."
        >
          <Row label="Position · top (default)">
            <Tooltip label="Refresh">
              <IconButton aria-label="Refresh" icon={ArrowClockwise} />
            </Tooltip>
            <Tooltip label="Settings">
              <IconButton aria-label="Settings" icon={Gear} />
            </Tooltip>
            <Tooltip label="Notifications">
              <IconButton aria-label="Notifications" icon={Bell} />
            </Tooltip>
            <Tooltip label="Export">
              <IconButton aria-label="Export" variant="outline" icon={Export} />
            </Tooltip>
            <Tooltip label="Delete">
              <IconButton aria-label="Delete" variant="destructive" icon={Trash} />
            </Tooltip>
          </Row>
          <Row label="Position · bottom, right, left">
            <Tooltip label="Bottom" position="bottom">
              <IconButton aria-label="Bottom" icon={ArrowClockwise} />
            </Tooltip>
            <Tooltip label="Right" position="right">
              <IconButton aria-label="Right" icon={Gear} />
            </Tooltip>
            <Tooltip label="Left" position="left">
              <IconButton aria-label="Left" icon={Bell} />
            </Tooltip>
          </Row>
        </Section>

        {/* ── Drawer ─────────────────────────────────────────────────────── */}
        <Section
          title="Drawer"
          slug="drawer"
          description="Modal panel that slides in from a screen edge: settings, filters, and detail views that need to take over focus. Portal-rendered with a scrim, focus trap, focus return, ESC to close and a body scroll lock, composed from `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerBody` and `DrawerFooter`. 4 sides, and `size` sets the width or height in px, clamped to the viewport."
        >
          <Row label="Trigger">
            <Button onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          </Row>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} side="right" size={420}>
            <DrawerHeader>
              <DrawerTitle>System Parameters</DrawerTitle>
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

        {/* ── UserMenu ───────────────────────────────────────────────────── */}
        <Section
          allowOverflow
          title="User Menu"
          slug="user-menu"
          description="Avatar trigger that opens a popover of account actions, with rows supplied by the `items` prop, including separators and destructive entries. Pick `UserCard` when the trigger has room to spell out name and role; `UserMenu` is the compact top-bar form. 3 sizes."
        >
          {(() => {
            const items = [
              { id: 'profile',     label: 'Profile',             icon: UserCircle },
              { id: 'preferences', label: 'Preferences',         icon: Gear },
              { id: 'shortcuts',   label: 'Keyboard Shortcuts',  icon: Keyboard },
              { id: 'sep1',        type: 'separator' as const },
              { id: 'signout',     label: 'Sign Out',            icon: SignOut },
            ];
            const src = 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            return (
              <>
                {/* Rows are the trigger's own states: the presence dot forwarded
                    to Avatar, and the initials fallback when there is no image.
                    The panel is not in the matrix — three pinned popovers per
                    row would overlap each other. */}
                <Matrix
                  rows={[
                    { label: 'Online', props: { status: 'online' } },
                    { label: 'Fault', props: { status: 'fault' } },
                    { label: 'Initials', props: { src: undefined, status: 'online' } },
                  ]}
                  render={(size, props) => (
                    <UserMenu
                      name="OPS-01"
                      src={src}
                      items={items}
                      size={size}
                      ariaLabel={`User menu ${size}`}
                      {...props}
                    />
                  )}
                />

                {/* Interactive: click to see the panel open upward. */}
                <div style={{ marginTop: tokens.spacing[6] }}>
                  <Row label="Open up">
                    <UserMenu
                      name="OPS-01"
                      src={src}
                      status="online"
                      items={items}
                      placement="top"
                      align="end"
                    />
                  </Row>
                </div>

                {/* Pinned open so the shared panel is on the page at rest.
                    minHeight reserves the ~200px it paints into so it never
                    covers the next section. */}
                <div style={{ minHeight: 260 }}>
                  <Row label="Open down">
                    <UserMenu
                      name="OPS-01"
                      src={src}
                      status="online"
                      items={items}
                      placement="bottom"
                      align="end"
                      staticOpen
                    />
                  </Row>
                </div>
              </>
            );
          })()}
        </Section>

        {/* ── UserCard ───────────────────────────────────────────────────── */}
        <Section
          allowOverflow
          title="User Card"
          slug="user-card"
          description="Wide identity trigger for the foot of a sidebar: avatar, name, role, and a caret that opens the same popover as `UserMenu`, with rows from the `items` prop. Choose it when there is room to name the user and `UserMenu` when the slot is a tight top bar; it opens upward and stretches to the trigger width by default. 3 sizes."
        >
          {(() => {
            const items = [
              { id: 'profile',     label: 'Profile',             icon: UserCircle },
              { id: 'preferences', label: 'Preferences',         icon: Gear },
              { id: 'shortcuts',   label: 'Keyboard Shortcuts',  icon: Keyboard },
              { id: 'sep1',        type: 'separator' as const },
              { id: 'signout',     label: 'Sign Out',            icon: SignOut },
            ];
            const src = 'https://images.unsplash.com/photo-1669287731461-bd8ce3126710?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            return (
              <>
                {/* The card is width:100%, so each cell gets a fixed-width
                    holder on surface.raised — the sidebar-foot slot it is
                    built for. Rows are its optional parts: role, image. */}
                <Matrix
                  rows={[
                    { label: 'Default' },
                    { label: 'No role', props: { role: undefined } },
                    { label: 'Initials', props: { src: undefined } },
                  ]}
                  render={(size, props) => (
                    <div style={{ width: 180, background: tokens.color.surface.raised }}>
                      <UserCard
                        name="Reza Quinn"
                        role="Flight Director"
                        src={src}
                        status="online"
                        size={size}
                        items={items}
                        ariaLabel={`User card ${size}`}
                        {...props}
                      />
                    </div>
                  )}
                />

                {/* Matrix triggers sit closed and open upward on click (the
                    default). This one is pinned open downward so the shared
                    panel is visible at rest; minHeight reserves its room. */}
                <div style={{ minHeight: 300, marginTop: tokens.spacing[6] }}>
                  <Row label="Open down">
                    <div style={{ width: 224, background: tokens.color.surface.raised }}>
                      <UserCard
                        name="Reza Quinn"
                        role="Flight Director"
                        src={src}
                        status="online"
                        items={items}
                        placement="bottom"
                        align="stretch"
                        staticOpen
                      />
                    </div>
                  </Row>
                </div>
              </>
            );
          })()}
        </Section>

        {/* Bottom install card — the two packages, like the brain's card. */}
        <ShowcaseInstallCard />
      </div>
      <SiteFooter />
    </div>
    </>
  )
}
