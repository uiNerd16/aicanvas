// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL · Overview section
// Original dashboard composition: TelemetryRow + RadarChart + SystemStatus
// + VehiclesTable + CommsLog. Lifted out of index.tsx so the section
// switcher can route to it like any other section.
// ============================================================

import { tokens } from '../../../tokens';
import { TelemetryRow } from '../TelemetryRow';
import { RadarChart } from '../../../components/RadarChart';
import { SystemStatus } from '../SystemStatus';
import { VehiclesTable } from '../VehiclesTable';
import { CommsLog } from '../CommsLog';
import { NextDestination } from '../NextDestination';

export function OverviewSection() {
  return (
    <>
      <TelemetryRow />

      <NextDestination />

      <div style={{ display: 'flex', gap: tokens.spacing[5] }}>
        <RadarChart
          style={{ flex: '0 0 calc(60% - 10px)', minWidth: 0 }}
          label="/// Systems"
          title="Ship Diagnostics"
          description="Nominal vs critical thresholds"
        />
        <SystemStatus />
      </div>

      <div style={{ display: 'flex', gap: tokens.spacing[5] }}>
        <VehiclesTable />
        <CommsLog />
      </div>
    </>
  );
}
