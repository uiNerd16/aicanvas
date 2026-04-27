// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL · Telemetry section
// Stat strip on top (continuity with Overview), then a 2x2 grid of
// time-series charts: Altitude / Velocity / Power / Signal.
// ============================================================

import { tokens } from '../../../tokens';
import { TelemetryRow } from '../TelemetryRow';
import { TelemetryChart } from '../TelemetryChart';
import { altitudeData, velocityData, powerData, signalData } from '../data';

// Existing AltitudeChart's data uses { t, alt } shape; the new TelemetryChart
// reads { t, v }. Coerce on the fly so we don't fork the source data.
const altitudeAsV = altitudeData.map(d => ({ t: d.t, v: d.alt }));

export function TelemetrySection() {
  const half = { flex: '1 1 calc(50% - 10px)', minWidth: 0 };

  return (
    <>
      <TelemetryRow />

      {/* Row 1 — wide altitude */}
      <div style={{ display: 'flex', gap: tokens.spacing[5] }}>
        <TelemetryChart
          style={{ flex: 1, minWidth: 0 }}
          label="/// Telemetry"
          title="Altitude · 24h"
          data={altitudeAsV}
          unit="KM"
        />
      </div>

      {/* Row 2 — velocity + power */}
      <div style={{ display: 'flex', gap: tokens.spacing[5] }}>
        <TelemetryChart
          style={half}
          label="/// Telemetry"
          title="Velocity · 24h"
          data={velocityData}
          unit="KM/S"
        />
        <TelemetryChart
          style={half}
          label="/// Telemetry"
          title="Power · 24h"
          data={powerData}
          unit="%"
          variant="warning"
          badgeText="Trending"
        />
      </div>

      {/* Row 3 — signal */}
      <div style={{ display: 'flex', gap: tokens.spacing[5] }}>
        <TelemetryChart
          style={{ flex: 1, minWidth: 0 }}
          label="/// Telemetry"
          title="Signal · 24h"
          data={signalData}
          unit="%"
          height={192}
        />
      </div>
    </>
  );
}
