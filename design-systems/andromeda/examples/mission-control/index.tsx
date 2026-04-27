// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL
// Composition shell. Background is intentionally transparent —
// drop in any image at the page route level. The active sidebar
// item drives which section renders in <main>.
// ============================================================

import { useState } from 'react';
import { tokens } from '../../tokens';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OverviewSection }      from './sections/OverviewSection';
import { TelemetrySection }     from './sections/TelemetrySection';
import { VehiclesSection }      from './sections/VehiclesSection';
import { CommsSection }         from './sections/CommsSection';
import { AnomaliesSection }     from './sections/AnomaliesSection';
import { MaintenanceSection }   from './sections/MaintenanceSection';
import { NotificationsSection } from './sections/NotificationsSection';

const SECTIONS = {
  overview:      { title: 'Overview',      Render: OverviewSection      },
  telemetry:     { title: 'Telemetry',     Render: TelemetrySection     },
  vehicles:      { title: 'Vehicles',      Render: VehiclesSection      },
  comms:         { title: 'Comms',         Render: CommsSection         },
  anomalies:     { title: 'Anomalies',     Render: AnomaliesSection     },
  maintenance:   { title: 'Maintenance',   Render: MaintenanceSection   },
  notifications: { title: 'Notifications', Render: NotificationsSection },
};

export default function MissionControl() {
  const [activeNav, setActiveNav] = useState('overview');
  const section = SECTIONS[activeNav] ?? SECTIONS.overview;
  const Render = section.Render;

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: 'transparent',
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
        <Header sectionTitle={section.title} />

        <main style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[5],
          paddingRight: tokens.spacing[2],
          boxSizing: 'border-box',
        }}>
          <Render />
        </main>
      </div>
    </div>
  );
}
