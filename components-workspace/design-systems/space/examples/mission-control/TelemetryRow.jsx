// ============================================================
// MISSION CONTROL: Row 1 — Telemetry Stat Tiles
// ============================================================

import { tokens } from '../../tokens';
import { StatTile } from '../../components/StatTile';
import { telemetryStats } from './data';

export function TelemetryRow() {
  return (
    <div style={{ display: 'flex', gap: tokens.spacing[5] }}>
      {telemetryStats.map(stat => (
        <StatTile
          key={stat.code}
          code={stat.code}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          delta={stat.delta}
          deltaLabel={stat.deltaLabel}
        />
      ))}
    </div>
  );
}
