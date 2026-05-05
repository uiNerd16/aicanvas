// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// RESOURCE PLANNING · AllocationChart
// Multi-series area chart showing planned vs actual vs reserved
// compute. Allocated is the white baseline, used is the live accent
// signal, reserved is a faint peripheral series.
// ============================================================

'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChartLine, ChartBar } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Toggle } from '../../components/Toggle';
import { SegmentedControl } from '../../components/SegmentedControl';
import { allocationSeries } from './data';

const SERIES = [
  { key: 'allocated', label: 'Allocated', color: tokens.color.text.secondary  },
  { key: 'used',      label: 'Used',      color: tokens.color.accent[400]   },
  { key: 'reserved',  label: 'Reserved',  color: tokens.color.text.faint    },
];

// ── Custom tooltip ───────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const ordered = ['allocated', 'used', 'reserved'].map((k) => payload.find((p) => p.dataKey === k)).filter(Boolean);
  return (
    <div
      style={{
        position: 'relative',
        background: tokens.color.surface.overlay,
        border: `${tokens.border.thin} ${tokens.color.border.bright}`,
        padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        fontFamily: tokens.typography.fontMono,
        minWidth: '180px',
      }}
    >
      <div
        style={{
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
          marginBottom: tokens.spacing[2],
        }}
      >
        AUG {String(label).padStart(2, '0')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
        {ordered.map((p) => {
          const meta = SERIES.find((s) => s.key === p.dataKey);
          return (
            <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: tokens.spacing[4] }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: tokens.spacing[2],
                  fontSize: tokens.typography.size.sm,
                  color: tokens.color.text.muted,
                  letterSpacing: tokens.typography.tracking.wide,
                }}
              >
                <span aria-hidden style={{ width: '6px', height: '6px', background: meta.color, flexShrink: 0 }} />
                {meta.label}
              </span>
              <span
                style={{
                  fontSize: tokens.typography.size.sm,
                  color: tokens.color.text.primary,
                  fontWeight: tokens.typography.weight.medium,
                  letterSpacing: tokens.typography.tracking.wide,
                }}
              >
                {p.value.toLocaleString('en-US')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Legend chip ──────────────────────────────────────────────────
function LegendChip({ color, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
        padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        opacity: active ? 1 : 0.4,
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.sm,
        color: tokens.color.text.secondary,
        letterSpacing: tokens.typography.tracking.wide,
      }}
    >
      <span aria-hidden style={{ width: '10px', height: '10px', background: color, flexShrink: 0 }} />
      {label}
    </button>
  );
}

// ── Composition ──────────────────────────────────────────────────
export function AllocationChart() {
  const [mode, setMode] = useState('line');
  const [visible, setVisible] = useState({ allocated: true, used: true, reserved: true });
  const [vsPrev, setVsPrev] = useState(false);

  function toggle(key) {
    setVisible((v) => ({ ...v, [key]: !v[key] }));
  }

  return (
    <div
      style={{
        position: 'relative',
        background: tokens.color.surface.raised,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      <CornerMarkers />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[3],
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
          Allocation vs usage
        </span>
        <div style={{ flex: 1 }} />
        <SegmentedControl
          size="md"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'line', icon: ChartLine, ariaLabel: 'Line chart' },
            { value: 'bar',  icon: ChartBar,  ariaLabel: 'Bar chart'  },
          ]}
        />
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0, padding: `${tokens.spacing[4]} ${tokens.spacing[5]} 0 ${tokens.spacing[5]}` }}>
        {/* Y-axis label (top-left) */}
        <span
          style={{
            position: 'absolute',
            top: tokens.spacing[2],
            left: tokens.spacing[5],
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}
        >
          Compute units, PFLOPS
        </span>

        <ResponsiveContainer width="100%" height="100%">
          {mode === 'line' ? (
            <AreaChart data={allocationSeries} margin={{ top: 32, right: 8, left: 0, bottom: 12 }}>
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.key} id={`rp-fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={s.color} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0}    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke={tokens.color.border.subtle} vertical={false} />
              <XAxis
                dataKey="t"
                tick={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: parseInt(tokens.typography.size.xs, 10),
                  fill: tokens.color.text.muted,
                  letterSpacing: '0.05em',
                }}
                axisLine={{ stroke: tokens.color.border.subtle }}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: parseInt(tokens.typography.size.xs, 10),
                  fill: tokens.color.text.muted,
                  letterSpacing: '0.05em',
                }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: tokens.color.border.bright, strokeWidth: 1, strokeDasharray: '2 4' }}
              />
              {SERIES.map((s) => visible[s.key] ? (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={1.5}
                  fill={`url(#rp-fill-${s.key})`}
                  dot={false}
                  activeDot={{ r: 4, fill: s.color, stroke: tokens.color.surface.raised, strokeWidth: 1 }}
                />
              ) : null)}
            </AreaChart>
          ) : (
            <BarChart data={allocationSeries} margin={{ top: 32, right: 8, left: 0, bottom: 12 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={tokens.color.border.subtle} vertical={false} />
              <XAxis
                dataKey="t"
                tick={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: parseInt(tokens.typography.size.xs, 10),
                  fill: tokens.color.text.muted,
                  letterSpacing: '0.05em',
                }}
                axisLine={{ stroke: tokens.color.border.subtle }}
                tickLine={false}
                interval={4}
              />
              <YAxis
                tick={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: parseInt(tokens.typography.size.xs, 10),
                  fill: tokens.color.text.muted,
                  letterSpacing: '0.05em',
                }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: tokens.color.surface.hover }}
              />
              {SERIES.map((s) => visible[s.key] ? (
                <Bar key={s.key} dataKey={s.key} fill={s.color} />
              ) : null)}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer — series toggles + vs previous period */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[3],
          padding: `${tokens.spacing[3]} ${tokens.spacing[5]}`,
          borderTop: `${tokens.border.thin} ${tokens.color.border.subtle}`,
        }}
      >
        {SERIES.map((s) => (
          <LegendChip
            key={s.key}
            color={s.color}
            label={s.label}
            active={visible[s.key]}
            onClick={() => toggle(s.key)}
          />
        ))}
        <div style={{ flex: 1 }} />
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            color: tokens.color.text.muted,
            letterSpacing: tokens.typography.tracking.wide,
          }}
        >
          <Toggle checked={vsPrev} onCheckedChange={setVsPrev} />
          Vs. previous period
        </span>
      </div>
    </div>
  );
}
