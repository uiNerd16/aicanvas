// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL: Row 1 — Telemetry Stat Tiles
// ============================================================

import { tokens } from '../../tokens';
import { StatTile } from '../../components/StatTile';
import { telemetryStats } from './data';

export function TelemetryRow() {
  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {telemetryStats.map((stat, i) => (
        <StatTile
          key={stat.code}
          code={stat.code}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          delta={stat.delta}
          deltaLabel={stat.deltaLabel}
          style={{ marginLeft: i > 0 ? -1 : 0 }}
        />
      ))}
    </div>
  );
}
