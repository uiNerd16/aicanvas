// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: RadarChart
// Andromeda-styled radar/spider chart built on recharts primitives.
// No shadcn chart wrapper needed — everything is styled directly
// via andromeda tokens and inline SVG overrides.
//
// Props:
//   data        — array of { axis, [key]: number } objects
//   series      — array of { key, label, color? } descriptors
//   label       — card kicker label
//   title       — card title
//   description — card description line
//   className / style passthrough
//
// Defaults to a single series "NOMINAL" vs "CRITICAL" ship-systems
// diagnostic if no data/series are provided.
// ============================================================

'use client';

import { forwardRef, useState, useEffect, useRef } from 'react';
import {
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn, andromedaVars } from './lib/utils';
import { tokens } from '../tokens';
import { CornerMarkers } from './CornerMarkers';

// ── Default demo data ────────────────────────────────────────────────────────
const DEFAULT_DATA = [
  { axis: 'HULL',   nominal: 92, critical: 68 },
  { axis: 'POWER',  nominal: 78, critical: 45 },
  { axis: 'NAV',    nominal: 88, critical: 80 },
  { axis: 'COMMS',  nominal: 60, critical: 30 },
  { axis: 'LIFE',   nominal: 95, critical: 90 },
  { axis: 'THRUST', nominal: 72, critical: 55 },
];

const DEFAULT_SERIES = [
  { key: 'nominal',  label: 'Nominal',  color: tokens.color.accent.base },
  { key: 'critical', label: 'Critical', color: tokens.color.fault },
];

// ── Custom tooltip ───────────────────────────────────────────────────────────
function SpaceTooltip({ active, payload, label, series, onFirstActive }) {
  useEffect(() => {
    if (active && payload?.length) onFirstActive?.();
  }, [active]);

  if (!active || !payload?.length) return null;

  return (
    <div style={{
      // Near-opaque dark surface so text is always legible against any chart color
      background: 'rgba(10, 10, 13, 0.94)',
      border: `1px solid ${tokens.color.border.base}`,
      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'relative',
      // Slide-in from slightly above, fade in — triggered on every mount
      animation: 'andromeda-tooltip-in 400ms cubic-bezier(0.25,1,0.5,1) both',
      minWidth: 120,
    }}>
      <div style={{
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.xs,
        color: tokens.color.text.muted,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.widest,
        marginBottom: tokens.spacing[1],
      }}>
        {label}
      </div>
      {payload.map((entry) => {
        const s = series?.find(s => s.key === entry.dataKey);
        return (
          <div key={entry.dataKey} style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
          }}>
            <span style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              background: entry.color,
              flexShrink: 0,
            }} />
            <span style={{ color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: tokens.typography.tracking.wider }}>
              {s?.label ?? entry.dataKey}
            </span>
            <span style={{ color: tokens.color.text.primary, marginLeft: 'auto', paddingLeft: tokens.spacing[3] }}>
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Custom polar angle tick ──────────────────────────────────────────────────
function SpaceTick({ x, y, payload, cx, cy }) {
  // Nudge label slightly away from center
  const dx = x - cx;
  const dy = y - cy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = x + (dx / len) * 10;
  const ny = y + (dy / len) * 10;

  return (
    <text
      x={nx}
      y={ny}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontFamily: tokens.typography.fontMono,
        fontSize: '9px',
        fill: tokens.color.text.muted,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
      }}
    >
      {payload.value}
    </text>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * @typedef {object} RadarSeries
 * @property {string} key
 * @property {string} label
 * @property {string} [color]
 *
 * @typedef {object} RadarChartProps
 * @property {object[]} [data]
 * @property {RadarSeries[]} [series]
 * @property {string} [label]
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

// After the tooltip first becomes active, we enable CSS transition on the
// wrapper so movement between segments is smooth. On first appearance the
// transition is suppressed so the tooltip snaps to the cursor (no fly from 0,0).
function useTooltipTransition() {
  const [shown, setShown] = useState(false);
  const shownRef = useRef(false);

  const onFirstActivation = () => {
    if (shownRef.current) return;
    shownRef.current = true;
    // One rAF: let recharts place wrapper at cursor, then enable transition.
    requestAnimationFrame(() => setShown(true));
  };

  return { shown, onFirstActivation };
}

/** @type {React.ForwardRefExoticComponent<RadarChartProps & React.HTMLAttributes<HTMLDivElement>>} */
export const RadarChart = forwardRef(function RadarChart(
  {
    data = DEFAULT_DATA,
    series = DEFAULT_SERIES,
    label = '/// Diagnostics',
    title = 'Systems Radar',
    description,
    className,
    style,
    ...props
  },
  ref,
) {
  const { shown, onFirstActivation } = useTooltipTransition();

  // Scanline on mount
  const [scanDone, setScanDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setScanDone(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      style={{
        ...andromedaVars(),
        background: tokens.color.surface.raised,
        ...style,
      }}
      {...props}
    >
      <CornerMarkers />

      {/* Header */}
      <div style={{
        padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        borderBottom: `1px solid ${tokens.color.border.subtle}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
        <span style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.md,
          fontWeight: tokens.typography.weight.medium,
          color: tokens.color.text.primary,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wider,
        }}>
          {title}
        </span>
        {description ? (
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.faint,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wide,
            marginTop: '2px',
          }}>
            {description}
          </span>
        ) : null}
      </div>

      {/* Chart area */}
      <div style={{ padding: `${tokens.spacing[4]} ${tokens.spacing[2]}`, position: 'relative' }}>
        {/* Scanline */}
        {!scanDone && (
          <div aria-hidden="true" style={{
            position: 'absolute',
            left: 0, right: 0, top: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${tokens.color.accent.dim}, transparent)`,
            animation: 'andromeda-radar-scan 1.1s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 2,
          }} />
        )}

        <ResponsiveContainer width="100%" height={280}>
          <ReRadarChart data={data} margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
            {/* Grid rings */}
            <PolarGrid
              stroke={tokens.color.border.subtle}
              strokeWidth={1}
              gridType="polygon"
            />

            {/* Axis labels */}
            <PolarAngleAxis
              dataKey="axis"
              tick={<SpaceTick />}
              tickLine={false}
              axisLine={{ stroke: tokens.color.border.subtle, strokeWidth: 1 }}
            />

            {/* isAnimationActive always off — recharts never tweens position.
                CSS transition on wrapperStyle handles smooth between-segment
                glide, but only after first activation (shown=true), so the
                first appearance snaps to cursor with no travel from (0,0). */}
            <Tooltip
              cursor={false}
              isAnimationActive={false}
              content={<SpaceTooltip series={series} onFirstActive={onFirstActivation} />}
              wrapperStyle={{
                outline: 'none',
                transition: shown
                  ? 'transform 380ms cubic-bezier(0.22,1,0.36,1)'
                  : 'none',
              }}
            />

            {/* Series */}
            {series.map((s, i) => (
              <Radar
                key={s.key}
                dataKey={s.key}
                stroke={s.color ?? tokens.color.accent.base}
                strokeWidth={1.5}
                fill={s.color ?? tokens.color.accent.base}
                fillOpacity={i === 0 ? 0.12 : 0.06}
                dot={false}
                activeDot={{
                  r: 3,
                  fill: s.color ?? tokens.color.accent.base,
                  strokeWidth: 0,
                }}
              />
            ))}
          </ReRadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{
        padding: `${tokens.spacing[2]} ${tokens.spacing[4]} ${tokens.spacing[3]}`,
        borderTop: `1px solid ${tokens.color.border.subtle}`,
        display: 'flex',
        gap: tokens.spacing[4],
      }}>
        {series.map(s => (
          <div key={s.key} style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
          }}>
            <span style={{
              display: 'inline-block',
              width: 8,
              height: 2,
              background: s.color ?? tokens.color.accent.base,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.wider,
            }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes andromeda-radar-scan {
          from { top: 0%; opacity: 0.8; }
          to   { top: 100%; opacity: 0; }
        }
        @keyframes andromeda-tooltip-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
});
