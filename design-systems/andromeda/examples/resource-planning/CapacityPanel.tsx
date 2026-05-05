// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// RESOURCE PLANNING · CapacityPanel
// Top-left card. Three KPI cells separated by 1px borders, each with
// a different micro-visual: skewed bar grid, gradient threshold bar,
// and a sparkline.
// ============================================================

'use client';

import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { PanelMenu } from '../../components/PanelMenu';
import { ArrowClockwise, Sliders, Export, EyeSlash } from '@phosphor-icons/react';
import { clusterUtilisation, missionSuccessRate, activeAllocations } from './data';

// ── Reusable cell wrapper ─────────────────────────────────────────
function Cell({ label, children, last = false }) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: tokens.spacing[3],
        padding: `${tokens.spacing[5]} ${tokens.spacing[5]}`,
        borderRight: last ? 'none' : `${tokens.border.thin} ${tokens.color.border.subtle}`,
      }}
    >
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
      {children}
    </div>
  );
}

// ── Headline number ───────────────────────────────────────────────
function BigValue({ value, suffix, delta }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: tokens.spacing[2] }}>
      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size['3xl'],
          fontWeight: tokens.typography.weight.bold,
          color: tokens.color.text.primary,
          letterSpacing: tokens.typography.tracking.tight,
          lineHeight: tokens.typography.lineHeight.tight,
        }}
      >
        {value}
      </span>
      {suffix ? (
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.muted,
            letterSpacing: tokens.typography.tracking.wide,
          }}
        >
          {suffix}
        </span>
      ) : null}
      {typeof delta === 'number' ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: tokens.spacing[1],
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            color: tokens.color.accent[300],
            letterSpacing: tokens.typography.tracking.wide,
          }}
        >
          ▲ {delta.toFixed(1)}%
        </span>
      ) : null}
    </div>
  );
}

// ── Shared visualisation slot ─────────────────────────────────────
// Every viz in the CapacityPanel renders into a 40px-tall slot, anchored
// to the bottom of its cell, so the three cells line up perfectly across
// the row regardless of which visual they contain.
const VIZ_HEIGHT = 40;

// ── Skewed-bar grid (cluster utilisation) ────────────────────────
function BarGrid({ values }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: `${VIZ_HEIGHT}px`, width: '100%' }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            flex: '1 1 0',
            minWidth: 0,
            height: `${Math.max(8, v * VIZ_HEIGHT)}px`,
            transform: 'skewX(-12deg)',
            background: tokens.color.accent[400],
          }}
        />
      ))}
    </div>
  );
}

// ── Gradient threshold bar (mission success) ─────────────────────
// Renders into the same 40px slot as the other viz. The bar pins to the
// top of the slot (so the marker sits comfortably above it) and the
// 0% / 100% labels pin to the bottom.
function ThresholdBar({ value }) {
  return (
    <div
      style={{
        position: 'relative',
        height: `${VIZ_HEIGHT}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          position: 'relative',
          marginTop: '8px',
          height: '12px',
          background: `linear-gradient(90deg, ${tokens.color.red[400]} 0%, ${tokens.color.orange[300]} 50%, ${tokens.color.accent[300]} 100%)`,
          border: `${tokens.border.thin} ${tokens.color.border.subtle}`,
        }}
      >
        {/* Marker — anchored above the bar with a downward arrow */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: '-8px',
            left: `calc(${value}% - 4px)`,
            width: 0,
            height: 0,
            borderLeft: `4px solid transparent`,
            borderRight: `4px solid transparent`,
            borderTop: `6px solid ${tokens.color.text.primary}`,
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, letterSpacing: tokens.typography.tracking.wider }}>
          0%
        </span>
        <span style={{ fontFamily: tokens.typography.fontMono, fontSize: tokens.typography.size.xs, color: tokens.color.text.faint, letterSpacing: tokens.typography.tracking.wider }}>
          100%
        </span>
      </div>
    </div>
  );
}

// ── Sparkline (active allocations) ───────────────────────────────
function Sparkline({ data }) {
  return (
    <div style={{ height: `${VIZ_HEIGHT}px`, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id="rp-spark-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={tokens.color.text.primary} stopOpacity={0.12} />
              <stop offset="100%" stopColor={tokens.color.text.primary} stopOpacity={0}    />
            </linearGradient>
          </defs>
          {/* Hidden axis — clamps the Y range to the actual data so the
              rise reads visually instead of being flattened by the default
              [0, dataMax] domain. */}
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={tokens.color.text.primary}
            strokeWidth={1.25}
            fill="url(#rp-spark-fill)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Composition ──────────────────────────────────────────────────
export function CapacityPanel() {
  return (
    <div
      style={{
        position: 'relative',
        background: tokens.color.surface.raised,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CornerMarkers />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: `${tokens.spacing[4]} ${tokens.spacing[5]}`,
          borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
        }}
      >
        <span
          style={{
            fontFamily: tokens.typography.fontSans,
            fontSize: tokens.typography.size.xl,
            fontWeight: tokens.typography.weight.semibold,
            color: tokens.color.text.primary,
            letterSpacing: tokens.typography.tracking.tight,
          }}
        >
          Capacity
        </span>
        <div style={{ flex: 1 }} />
        <PanelMenu
          ariaLabel="Capacity options"
          items={[
            { label: 'Refresh',   icon: ArrowClockwise, onSelect: () => {} },
            { label: 'Configure', icon: Sliders,        onSelect: () => {} },
            { label: 'Export',    icon: Export,         onSelect: () => {} },
            { type: 'separator' },
            { label: 'Hide',      icon: EyeSlash,       onSelect: () => {} },
          ]}
        />
      </div>

      {/* Three KPI cells — flex:1 so the row fills the panel height in
          a bento grid where both top panels share a single row height. */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Cell label="Cluster utilisation">
          <BigValue value={`${clusterUtilisation.value.toFixed(1)}`} suffix="%" />
          <BarGrid values={clusterUtilisation.segments} />
        </Cell>
        <Cell label="Mission success rate">
          <BigValue value={`${missionSuccessRate.value.toFixed(1)}`} suffix="%" />
          <ThresholdBar value={missionSuccessRate.value} />
        </Cell>
        <Cell label="Active allocations" last>
          <BigValue value={activeAllocations.value.toLocaleString('en-US')} delta={activeAllocations.delta} />
          <Sparkline data={activeAllocations.series} />
        </Cell>
      </div>
    </div>
  );
}
