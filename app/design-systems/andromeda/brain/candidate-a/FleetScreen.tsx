'use client'

// ============================================================
// CANDIDATE A — the screen the one prompt produces.
//
// Real Andromeda v1 components (MIT, in this repo) composed into a
// fleet monitoring dashboard. Each panel is a permanent hairline
// FRAME; its contents mount only once the run reaches that panel, so
// the layout never jumps and the assembly reads as the screen filling
// in. Mount-on-reveal also lets StatTile's count-up fire at the moment
// the panel lands instead of silently behind an opacity:0 wrapper.
// ============================================================

import { motion } from 'framer-motion'
import { tokens } from '@/design-systems/andromeda/tokens'
import { CornerMarkers } from '@/design-systems/andromeda/components/CornerMarkers'
import { PanelHeader } from '@/design-systems/andromeda/components/PanelHeader'
import { StatTile } from '@/design-systems/andromeda/components/StatTile'
import { TrendChart } from '@/design-systems/andromeda/components/TrendChart'
import { HeatGrid } from '@/design-systems/andromeda/components/HeatGrid'
import { ProgressBar } from '@/design-systems/andromeda/components/ProgressBar'
import { Badge } from '@/design-systems/andromeda/components/Badge'

const T = tokens
const MONO = T.typography.fontMono

// design-systems/ ships as JSDoc-annotated JSX (see design-systems/CLAUDE.md),
// so its forwardRef wrappers expose no TypeScript prop types. The rest of the
// repo blanket-@ts-nocheck's the consuming file; these aliases buy the same
// thing without switching type-checking off for the whole file.
type DsComp = React.FC<Record<string, unknown>>
const Markers = CornerMarkers as unknown as DsComp
const Panel = PanelHeader as unknown as DsComp
const Stat = StatTile as unknown as DsComp
const Trend = TrendChart as unknown as DsComp
const Heat = HeatGrid as unknown as DsComp
const Bar = ProgressBar as unknown as DsComp
const StatusBadge = Badge as unknown as DsComp

// Deterministic sample telemetry — a fixed seed keeps SSR and client identical.
const noise = (i: number, k: number) => {
  const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453
  return s - Math.floor(s)
}
const TREND = Array.from({ length: 28 }, (_, i) => {
  const planned = 120 + Math.round(Math.sin(i / 3.4) * 22 + noise(i, 1) * 14)
  return {
    t: `${String(6 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`,
    planned,
    actual: Math.round(planned * (0.82 + noise(i, 2) * 0.2)),
  }
})

const UNITS = [
  { id: 'AX-114', route: 'North loop', state: 'accent', label: 'Live' },
  { id: 'AX-207', route: 'Harbour spur', state: 'accent', label: 'Live' },
  { id: 'AX-233', route: 'Depot hold', state: 'warning', label: 'Charging' },
  { id: 'AX-341', route: 'West ridge', state: 'fault', label: 'Fault' },
] as const

/** A panel frame that exists from the first frame; contents mount on reveal. */
function Frame({
  filled,
  minHeight,
  children,
  gridArea,
}: {
  filled: boolean
  minHeight: number
  children: React.ReactNode
  gridArea?: string
}) {
  return (
    <div
      style={{
        gridArea,
        position: 'relative',
        minHeight,
        background: filled ? T.color.surface.raised : 'transparent',
        border: `${T.border.width} solid ${filled ? T.color.border.subtle : 'transparent'}`,
        transition: `background ${T.motion.duration.slow} ease, border-color ${T.motion.duration.slow} ease`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Markers color={filled ? T.color.border.bright : T.color.border.subtle} />
      {filled ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0.2, 1] }}
          style={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  )
}

const label: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: T.typography.size.xs,
  letterSpacing: T.typography.tracking.wider,
  textTransform: 'uppercase',
  color: T.color.text.faint,
}

/** `revealed` counts panels the run has composed so far (0 .. 4). */
export function FleetScreen({ revealed }: { revealed: number }) {
  return (
    <div style={{ fontFamily: MONO, width: '100%' }}>
      <style>{`
        .fs-grid {
          display: grid;
          gap: ${T.spacing[3]};
          grid-template-columns: 1.55fr 1fr;
          grid-template-areas: 'stats stats' 'chart side';
        }
        .fs-stats { display: flex; }
        .fs-stats > * { flex: 1; min-width: 0; }
        .fs-stats > * + * { margin-left: -1px; }
        @media (max-width: 860px) {
          .fs-grid { grid-template-columns: 1fr; grid-template-areas: 'stats' 'chart' 'side'; }
          .fs-stats { display: grid; grid-template-columns: 1fr 1fr; }
          .fs-stats > * + * { margin-left: 0; }
        }
      `}</style>

      <div className="fs-grid">
        {/* Recipe 1 — stat card row */}
        <Frame gridArea="stats" filled={revealed >= 1} minHeight={148}>
          <Panel title="Fleet overview" actions={<span style={label}>ops / live</span>} />
          <div className="fs-stats" style={{ padding: T.spacing[3] }}>
            <Stat label="Units online" code="FLT-01" value="248" delta={1.8} deltaLabel="vs shift" />
            <Stat label="Avg latency" code="LAT-02" value="412" unit="ms" delta={-2.4} polarity="lower-is-better" deltaLabel="vs shift" />
            <Stat label="Faults open" code="ERR-03" value="3" delta={-1} polarity="lower-is-better" deltaLabel="vs shift" />
            <Stat label="Utilisation" code="UTL-04" value="87" unit="%" delta={0.6} deltaLabel="vs shift" />
          </div>
        </Frame>

        {/* Recipe 2 — chart panel */}
        <Frame gridArea="chart" filled={revealed >= 2} minHeight={300}>
          <Panel title="Telemetry throughput" actions={<span style={label}>06:00 → 20:00</span>} />
          <div style={{ padding: T.spacing[3], flex: 1 }}>
            <Trend
              data={TREND}
              series={[
                { key: 'planned', label: 'Planned', role: 'baseline' },
                { key: 'actual', label: 'Actual', role: 'live' },
              ]}
              yLabel="Packets / sec"
              height={200}
              xInterval={5}
            />
          </div>
        </Frame>

        <div style={{ gridArea: 'side', display: 'grid', gap: T.spacing[3], gridTemplateRows: 'auto 1fr' }}>
          <Frame filled={revealed >= 3} minHeight={140}>
            <Panel title="Route risk" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: T.spacing[4], padding: T.spacing[3] }}>
              <Heat value={62} cellSize={14} gap={3} label="Risk window" />
              <Bar label="Charge reserve" value={74} />
            </div>
          </Frame>

          <Frame filled={revealed >= 4} minHeight={148}>
            <Panel title="Active units" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: T.spacing[2], padding: T.spacing[3] }}>
              {UNITS.map((u) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: T.spacing[3] }}>
                  <span style={{ fontSize: T.typography.size.sm, color: T.color.text.primary, minWidth: 62 }}>{u.id}</span>
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: T.typography.size.sm, color: T.color.text.muted }}>
                    {u.route}
                  </span>
                  <StatusBadge variant={u.state}>{u.label}</StatusBadge>
                </div>
              ))}
            </div>
          </Frame>
        </div>
      </div>
    </div>
  )
}
