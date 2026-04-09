// ============================================================
// SPACE EXAMPLE: Mission Control
// Composition shell. Background is intentionally transparent —
// drop in any image at the page route level.
// ============================================================

import { useState } from 'react';
import { tokens } from '../../tokens';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TelemetryRow } from './TelemetryRow';
import { RadarChart } from '../../components/RadarChart';
import { SystemStatus } from './SystemStatus';
import { VehiclesTable } from './VehiclesTable';
import { CommsLog } from './CommsLog';

export default function MissionControl() {
  const [activeNav, setActiveNav] = useState('overview');

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: 'transparent', // user provides background image at the page level
      fontFamily: tokens.typography.fontSans,
      color: tokens.color.text.primary,
      overflow: 'hidden',
      gap: tokens.spacing[4],
      padding: tokens.spacing[4],
      boxSizing: 'border-box',
    }}>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        gap: tokens.spacing[4],
      }}>
        <Header />

        <main style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[5],
          paddingRight: tokens.spacing[2],
          boxSizing: 'border-box',
        }}>
          <TelemetryRow />

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
        </main>
      </div>
    </div>
  );
}
