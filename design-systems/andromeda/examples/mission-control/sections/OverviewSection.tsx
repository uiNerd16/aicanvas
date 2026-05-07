// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL · Overview section
// Original dashboard composition: TelemetryRow + NextDestination
// + RadarChart/SystemStatus + VehiclesTable/CommsLog. Lifted out
// of index.tsx so the section switcher can route to it like any
// other section.
//
// Entrance: each visual row is a `motion.div` that picks up the
// next slot in the parent's cascade via `useCascadeProps`. Pass
// `startIndex` to align this section's first row with the parent
// sequence (Sidebar=0, Header=1, then our rows pick up from 2).
// Rendered standalone, the default startIndex=0 cascades from
// scratch.
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { tokens } from '../../../tokens';
import { useCascadeProps } from '../../../components/lib/motion';
import { TelemetryRow } from '../TelemetryRow';
import { RadarChart } from '../../../components/RadarChart';
import { SystemStatus } from '../SystemStatus';
import { VehiclesTable } from '../VehiclesTable';
import { CommsLog } from '../CommsLog';
import { NextDestination } from '../NextDestination';

export function OverviewSection({ startIndex = 0 }) {
  // Four visual rows, each gets the next slot in the parent's cascade.
  // Standalone: rows cascade 0..3. Inside Mission Control: 2..5.
  const row0 = useCascadeProps(startIndex);
  const row1 = useCascadeProps(startIndex + 1);
  const row2 = useCascadeProps(startIndex + 2);
  const row3 = useCascadeProps(startIndex + 3);

  return (
    <>
      <motion.div {...row0}>
        <TelemetryRow />
      </motion.div>

      <motion.div {...row1}>
        <NextDestination />
      </motion.div>

      <motion.div {...row2} style={{ display: 'flex', gap: tokens.spacing[5] }}>
        <RadarChart
          style={{ flex: '0 0 calc(60% - 10px)', minWidth: 0 }}
          label="/// Systems"
          title="Ship Diagnostics"
          description="Nominal vs critical thresholds"
        />
        <SystemStatus />
      </motion.div>

      <motion.div {...row3} style={{ display: 'flex', gap: tokens.spacing[5] }}>
        <VehiclesTable />
        <CommsLog />
      </motion.div>
    </>
  );
}
