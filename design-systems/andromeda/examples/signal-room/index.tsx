// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SIGNAL ROOM
// A music-app composition re-interpreted as an audio
// transmission control room. The reference (Spotify) was used as
// a layout starting point — sidebar / header / hero / mixes row /
// recent list / transport bar — and every visual decision was
// translated into Andromeda's idiom: token-driven surfaces,
// hairline corner markers, JetBrains Mono labels, accent reserved
// for live measurement and the one primary action per region
// (Engage stream in the hero, Play in the transport).
//
// Entrance cascade: Sidebar → Header → NowTransmitting →
// MixesRow → RecentTransmissions/LevelsPanel → Transport.
// After each cell settles, its internal motion (waveform redraw,
// stat-tile live drift, progress fills, row-stagger) takes over.
// ============================================================

'use client';

import { useState } from 'react';
import { tokens } from '../../tokens';
import { useCascadeProps } from '../../components/lib/motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NowTransmitting } from './NowTransmitting';
import { TransmitStats } from './TransmitStats';
import { MixesRow } from './MixesRow';
import { RecentTransmissions } from './RecentTransmissions';
import { LevelsPanel } from './LevelsPanel';
import { Transport } from './Transport';
import { motion } from 'framer-motion';

export default function SignalRoom() {
  const [activeNav, setActiveNav] = useState('library');

  // Cascade slots: Sidebar 0 → Header 1 → NowTransmitting 2 → TransmitStats 3
  // → MixesRow 4 → Recent/Levels row 5 → Transport 6. The stats row sits as
  // a sibling of the hero so its StatTile corners don't nest inside the
  // hero's frame (see rules.md → "Frames don't nest").
  const sidebarMotion   = useCascadeProps(0);
  const headerMotion    = useCascadeProps(1);
  const nowMotion       = useCascadeProps(2);
  const statsMotion     = useCascadeProps(3);
  const mixesMotion     = useCascadeProps(4);
  const splitMotion     = useCascadeProps(5);
  const transportMotion = useCascadeProps(6);

  const handleNavChange = (id) => setActiveNav(id);

  return (
    <div
      style={{
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
      }}
    >
      <Sidebar
        activeNav={activeNav}
        onNavChange={handleNavChange}
        motionProps={sidebarMotion}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
          gap: tokens.spacing[4],
        }}
      >
        <Header sectionTitle="Library" motionProps={headerMotion} />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing[5],
            paddingRight: tokens.spacing[2],
            boxSizing: 'border-box',
          }}
        >
          <motion.div {...nowMotion}>
            <NowTransmitting />
          </motion.div>

          <motion.div {...statsMotion}>
            <TransmitStats />
          </motion.div>

          <motion.div {...mixesMotion}>
            <MixesRow />
          </motion.div>

          <motion.div
            {...splitMotion}
            style={{ display: 'flex', gap: tokens.spacing[5], alignItems: 'stretch' }}
          >
            <RecentTransmissions />
            <div style={{ flex: '0 0 360px', display: 'flex' }}>
              <LevelsPanel />
            </div>
          </motion.div>
        </main>

        <Transport motionProps={transportMotion} />
      </div>
    </div>
  );
}
