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
//
// Responsive (desktop-first — see rules.md → Responsive): the shell
// is a flex row on desktop. Below `mq.md` it becomes a flex COLUMN,
// the desktop Sidebar is hidden (`display:none`), and the Header
// gains a hamburger that opens the SAME console-nav content in a
// left-side Drawer. The hero's dual-pane and the Recent/Levels split
// collapse to one column at the same threshold; the stacked source
// order reads sensibly (primary panel first, peripheral panels last).
// Drawer open/close is local client state, starts closed — SSR-safe,
// no hydration flash.
// ============================================================

'use client';

import { useState } from 'react';
import { tokens } from '../../tokens';
import { mq } from '../../components/lib/responsive';
import { useCascadeProps } from '../../components/lib/motion';
import { Sidebar, SidebarNav } from './Sidebar';
import { Header } from './Header';
import { NowTransmitting } from './NowTransmitting';
import { TransmitStats } from './TransmitStats';
import { MixesRow } from './MixesRow';
import { RecentTransmissions } from './RecentTransmissions';
import { LevelsPanel } from './LevelsPanel';
import { Transport } from './Transport';
import { nowPlaying } from './data';
import { motion } from 'framer-motion';
import { Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody } from '../../components/Drawer';

// Normalize a source item (mix card / transmission row) to the shape the
// bottom player consumes: title, subtitle, code, cover (image url or null →
// glyph), duration in seconds.
const parseDur = (d) => {
  const [m, s] = String(d).split(':').map(Number);
  return (m || 0) * 60 + (s || 0);
};
const mixToNowPlaying = (mix) => ({
  title: mix.name, subtitle: mix.desc, code: mix.code, cover: mix.image, duration: 221,
});
const recToNowPlaying = (r) => ({
  title: r.track, subtitle: r.artist, code: r.id, cover: null, duration: parseDur(r.duration),
});

export default function SignalRoom() {
  const [activeNav, setActiveNav] = useState('library');
  // Mobile nav drawer — starts closed so SSR + first client render match the
  // desktop-first base (the drawer is portaled + display:none-gated anyway).
  const [navOpen, setNavOpen] = useState(false);

  // The one source of truth for the player. Pressing play on a routine card or
  // a transmission row sets `current` and starts playback; the Transport bar
  // (cover + title + transport state) reflects it.
  const [current, setCurrent] = useState(() => ({
    title: nowPlaying.track,
    subtitle: nowPlaying.artist,
    code: nowPlaying.code,
    cover: null,
    duration: nowPlaying.duration,
  }));
  const [isPlaying, setIsPlaying] = useState(true);
  const togglePlay = () => setIsPlaying((p) => !p);
  // Clicking the already-current item toggles play/pause; a different item
  // switches to it and starts playing.
  const playMix = (mix) => {
    if (current.code === mix.code) togglePlay();
    else { setCurrent(mixToNowPlaying(mix)); setIsPlaying(true); }
  };
  const playRec = (r) => {
    if (current.code === r.id) togglePlay();
    else { setCurrent(recToNowPlaying(r)); setIsPlaying(true); }
  };

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

  // Selecting a nav item from the mobile drawer also closes the drawer.
  const handleNavChange = (id) => { setActiveNav(id); setNavOpen(false); };

  return (
    <div
      className="sr-shell"
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
        className="sr-sidebar"
        activeNav={activeNav}
        onNavChange={handleNavChange}
        motionProps={sidebarMotion}
      />

      <div
        className="sr-main-col"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
          gap: tokens.spacing[4],
        }}
      >
        <Header
          sectionTitle="Library"
          motionProps={headerMotion}
          onMenuOpen={() => setNavOpen(true)}
          menuOpen={navOpen}
        />

        <main
          className="sr-main"
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
            <MixesRow onPlay={playMix} currentCode={current.code} isPlaying={isPlaying} />
          </motion.div>

          <motion.div
            {...splitMotion}
            className="sr-split"
            style={{ display: 'flex', gap: tokens.spacing[5], alignItems: 'stretch' }}
          >
            <RecentTransmissions onPlay={playRec} currentCode={current.code} isPlaying={isPlaying} />
            <div className="sr-levels" style={{ flex: '0 0 360px', display: 'flex', minWidth: 0 }}>
              <LevelsPanel />
            </div>
          </motion.div>
        </main>

        <Transport
          motionProps={transportMotion}
          current={current}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />
      </div>

      {/* Mobile nav — the same console nav content, served in a left-side
          Drawer below `mq.md`. The desktop Sidebar is hidden at that width
          (see <style> below); the hamburger lives in the Header. */}
      <Drawer open={navOpen} onOpenChange={setNavOpen} side="left" size={tokens.layout.sidebarWidth}>
        <DrawerHeader>
          <DrawerTitle>Andromeda</DrawerTitle>
          <DrawerDescription>Signal Room</DrawerDescription>
        </DrawerHeader>
        <DrawerBody style={{ padding: 0 }}>
          <SidebarNav
            activeNav={activeNav}
            onNavChange={handleNavChange}
            layoutGroupId="signal-room-drawer-nav"
          />
        </DrawerBody>
      </Drawer>

      <style>{`
        ${mq.md} {
          /* Stack the shell AND release its desktop 100vh pin: below md the
             page grows to its stacked height and the route column scrolls it as
             one (no nested inner scroller, no blank strip). The Transport flows
             at the bottom of the scroll on mobile rather than staying pinned. */
          .sr-shell {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100dvh !important;
            overflow: visible !important;
            gap: ${tokens.spacing[3]} !important;
            padding: ${tokens.spacing[3]} !important;
          }
          /* Desktop sidebar hidden — its content lives in the Drawer. */
          .sr-sidebar { display: none !important; }
          .sr-main-col { overflow: visible !important; gap: ${tokens.spacing[3]} !important; }
          .sr-main { flex: 0 0 auto !important; overflow-y: visible !important; padding-right: 0 !important; }
          /* Recent/Levels dual-pane collapses to one column; the levels panel
             releases its fixed 360px column and flows full-width below the
             transmissions table. */
          .sr-split { flex-direction: column !important; gap: ${tokens.spacing[4]} !important; }
          .sr-levels { flex: 1 1 auto !important; }
        }
      `}</style>
    </div>
  );
}
