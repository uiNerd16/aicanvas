// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL
// Composition shell. Background is intentionally transparent —
// drop in any image at the page route level.
//
// Only the Overview section is wired up. The other sidebar items
// (Telemetry, Vehicles, Comms, Anomalies, Maintenance) remain
// visible in the cyber-nav for scenic value but are inert —
// clicking them does nothing.
//
// Entrance cascade: Sidebar → Header → six rows of OverviewSection
// stagger in top-to-bottom on mount. After each element settles,
// its own internal motion (clock tick, count-up, scan reveal,
// telemetry flicker) takes over without further coordination.
// ============================================================

'use client';

import { useState } from 'react';
import { tokens } from '../../tokens';
import { useCascadeProps } from '../../components/lib/motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OverviewSection } from './sections/OverviewSection';

export default function MissionControl() {
  const [activeNav] = useState('overview');

  // Inert handler: non-overview ids are ignored, active stays on overview.
  const handleNavChange = (id) => {
    if (id === 'overview') return;
  };

  // Outer cascade slots — Sidebar 0, Header 1. OverviewSection's inner
  // rows continue the cascade from index 2 so the whole dashboard reads
  // as one continuous top-to-bottom sequence rather than two cascades
  // happening at the same time.
  const sidebarMotion = useCascadeProps(0);
  const headerMotion  = useCascadeProps(1);

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      background: 'transparent',
      fontFamily: tokens.typography.fontSans,
      color: tokens.color.text.primary,
      overflow: 'hidden',
      gap: tokens.spacing[4],
      padding: tokens.spacing[4],
      boxSizing: 'border-box',
    }}>
      <Sidebar
        activeNav={activeNav}
        onNavChange={handleNavChange}
        motionProps={sidebarMotion}
      />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        gap: tokens.spacing[4],
      }}>
        <Header sectionTitle="Overview" motionProps={headerMotion} />

        <main style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[5],
          paddingRight: tokens.spacing[2],
          boxSizing: 'border-box',
        }}>
          <OverviewSection startIndex={2} />
        </main>
      </div>
    </div>
  );
}
