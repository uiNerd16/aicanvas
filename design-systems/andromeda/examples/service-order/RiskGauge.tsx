// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SERVICE ORDER · RiskGauge
// Radial SVG gauge — single accent stroke over a subtle track.
// Per Andromeda's color philosophy, color is meaning here: the
// arc length IS the measurement (a risk reading), not decoration,
// so a single accent stop reads cleanly without a red→green ramp.
// ============================================================

'use client';

import { tokens } from '../../tokens';

const SIZE   = 110;    // outer SVG box
const STROKE = 7;
const CX     = SIZE / 2;
const R      = CX - STROKE;
const C      = 2 * Math.PI * R;

export function RiskGauge({ value = 0 }) {
  const clamped = Math.max(0, Math.min(100, value));
  const filled  = (clamped / 100) * C;

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`Risk ${clamped} percent`}
      style={{ flexShrink: 0 }}
    >
      <circle
        cx={CX}
        cy={CX}
        r={R}
        fill="none"
        stroke={tokens.color.border.subtle}
        strokeWidth={STROKE}
      />
      <circle
        cx={CX}
        cy={CX}
        r={R}
        fill="none"
        stroke={tokens.color.accent[300]}
        strokeWidth={STROKE}
        strokeDasharray={`${filled} ${C}`}
        strokeLinecap="butt"
        transform={`rotate(-90 ${CX} ${CX})`}
      />
      <text
        x={CX}
        y={CX}
        textAnchor="middle"
        dominantBaseline="central"
        fill={tokens.color.text.primary}
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xl,
          fontWeight: tokens.typography.weight.bold,
          letterSpacing: tokens.typography.tracking.tight,
        }}
      >
        {clamped}%
      </text>
    </svg>
  );
}
