// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL: Row 1 — Telemetry Stat Tiles
//
// Live drift: every 2s, each numeric telemetry value drifts by a
// small random delta (~0.1% of the value). The visible effect is
// the system "watching live data" — numbers nudge as if the ship
// is sending fresh readings. This is "movement signals data
// movement" — exactly the case where motion is on-brand for
// Andromeda. StatTile in `live` mode snaps to the new value on
// each tick rather than re-running the count-up.
//
// Honours `prefers-reduced-motion`: drift is suspended, values
// stay at their initial state.
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { StatTile } from '../../components/StatTile';
import { useReducedMotion } from '../../components/lib/motion';
import { telemetryStats } from './data';

const DRIFT_INTERVAL_MS = 2000;
// Drift amount is a tiny fraction of the value, signed randomly. Bounded
// so values don't wander into nonsense over long sessions — the drift
// re-anchors gently toward the original value.
const DRIFT_FACTOR = 0.001;       // 0.1% of value per tick
const RECENTRE_FACTOR = 0.05;     // pull 5% back toward the original each tick

export function TelemetryRow() {
  const reducedMotion = useReducedMotion();
  const [stats, setStats] = useState(telemetryStats);

  useEffect(() => {
    if (reducedMotion) return;

    const id = setInterval(() => {
      setStats((current) => current.map((s, i) => {
        const num = parseFloat(s.value);
        if (Number.isNaN(num)) return s;

        const original = parseFloat(telemetryStats[i].value);
        const decimals = (s.value.split('.')[1] || '').length;

        // Random walk + soft re-centre toward the original value. Without
        // re-centring, the drift accumulates and a 5-minute idle session
        // shows altitude at 380 or 450 instead of ~412.
        const drift = num * DRIFT_FACTOR * (Math.random() - 0.5) * 2;
        const recentre = (original - num) * RECENTRE_FACTOR;
        const next = num + drift + recentre;

        return { ...s, value: next.toFixed(decimals) };
      }));
    }, DRIFT_INTERVAL_MS);

    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {stats.map((stat, i) => (
        <StatTile
          key={stat.code}
          code={stat.code}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          delta={stat.delta}
          deltaLabel={stat.deltaLabel}
          live
          style={{ marginLeft: i > 0 ? -1 : 0 }}
        />
      ))}
    </div>
  );
}
