// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL · TelemetryChart
// Generic single-series area chart. Used by TelemetrySection for
// altitude/velocity/power/signal. Same recipe as AltitudeChart but
// parametrised so the section can render N of them. If a future
// example needs the same shape, this is a candidate to promote into
// design-systems/andromeda/components as `LineChart` or similar.
// ============================================================

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { tokens } from '../../tokens';
import { Card, CardHeader, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';

const VARIANTS = {
  accent: {
    stroke: tokens.color.text.primary,
    badge:  'accent',
  },
  warning: {
    stroke: tokens.color.text.primary,
    badge:  'warning',
  },
  fault: {
    stroke: tokens.color.text.primary,
    badge:  'fault',
  },
};

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      position: 'relative',
      background: tokens.color.surface.overlay,
      border: `${tokens.border.thin} ${tokens.color.border.bright}`,
      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
      fontFamily: tokens.typography.fontMono,
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    }}>
      <div style={{
        fontSize: tokens.typography.size.xs,
        color: tokens.color.text.muted,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.wider,
        marginBottom: tokens.spacing[1],
      }}>
        T {label}
      </div>
      <div style={{
        fontSize: tokens.typography.size.md,
        color: tokens.color.text.primary,
        fontWeight: tokens.typography.weight.medium,
        letterSpacing: tokens.typography.tracking.wide,
      }}>
        {payload[0].value}
        {unit ? (
          <span style={{
            color: tokens.color.text.muted,
            fontSize: tokens.typography.size.xs,
            marginLeft: tokens.spacing[1],
          }}>
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function TelemetryChart({
  label,
  title,
  data,
  unit,
  variant = 'accent',
  height = 224,
  badgeText = 'Live',
  style,
}) {
  const v = VARIANTS[variant] ?? VARIANTS.accent;
  const fillId = `fill-${title.replace(/\s+/g, '-').toLowerCase()}-${variant}`;

  return (
    <Card style={style}>
      <CardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
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
            color: tokens.color.text.primary,
            fontWeight: tokens.typography.weight.medium,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            {title}
          </span>
        </div>
        {badgeText ? <Badge variant={v.badge}>{badgeText}</Badge> : null}
      </CardHeader>

      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={v.stroke} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={v.stroke} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="2 4"
                stroke={tokens.color.border.subtle}
                vertical={false}
              />
              <XAxis
                dataKey="t"
                tick={{
                  fontFamily: tokens.typography.fontMono,
                  // recharts expects a number; derive it from the xs token
                  // ('10px') so the chart axis follows the system scale.
                  fontSize: parseInt(tokens.typography.size.xs, 10),
                  fill: tokens.color.text.muted,
                  letterSpacing: '0.05em',
                }}
                axisLine={{ stroke: tokens.color.border.subtle }}
                tickLine={false}
                interval={3}
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: parseInt(tokens.typography.size.xs, 10),
                  fill: tokens.color.text.muted,
                  letterSpacing: '0.05em',
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<ChartTooltip unit={unit} />}
                cursor={{ stroke: tokens.color.border.bright, strokeWidth: 1, strokeDasharray: '2 4' }}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke={v.stroke}
                strokeWidth={1.5}
                fill={`url(#${fillId})`}
                dot={false}
                activeDot={{ r: 4, fill: tokens.color.text.primary, stroke: tokens.color.border.base, strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
