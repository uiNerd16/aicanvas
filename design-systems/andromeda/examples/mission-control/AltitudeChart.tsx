// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL: Row 2 left — Altitude Chart
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
import { altitudeData } from './data';

function AltitudeTooltip({ active, payload, label }) {
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
        color: tokens.color.accent.bright,
        fontWeight: tokens.typography.weight.medium,
        letterSpacing: tokens.typography.tracking.wide,
      }}>
        {payload[0].value} <span style={{ color: tokens.color.text.muted, fontSize: tokens.typography.size.xs }}>KM</span>
      </div>
    </div>
  );
}

export function AltitudeChart() {
  return (
    <Card style={{ flex: '0 0 calc(60% - 10px)', minWidth: 0 }}>
      <CardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            /// Telemetry
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.primary,
            fontWeight: tokens.typography.weight.medium,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            Altitude · 24h
          </span>
        </div>
        <Badge variant="accent">Live</Badge>
      </CardHeader>

      <CardContent>
        <div style={{ height: '224px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={altitudeData}
              margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="altitudeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={tokens.color.accent.base} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={tokens.color.accent.base} stopOpacity={0}    />
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
                  fontSize: 10,
                  fill: tokens.color.text.muted,
                  letterSpacing: '0.05em',
                }}
                axisLine={{ stroke: tokens.color.border.subtle }}
                tickLine={false}
                interval={3}
              />
              <YAxis
                domain={['dataMin - 4', 'dataMax + 4']}
                tick={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: 10,
                  fill: tokens.color.text.muted,
                  letterSpacing: '0.05em',
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<AltitudeTooltip />} cursor={{ stroke: tokens.color.accent.dim, strokeWidth: 1, strokeDasharray: '2 4' }} />
              <Area
                type="monotone"
                dataKey="alt"
                stroke={tokens.color.accent.base}
                strokeWidth={1.5}
                fill="url(#altitudeFill)"
                dot={false}
                activeDot={{ r: 4, fill: tokens.color.accent.bright, stroke: tokens.color.accent.base, strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
