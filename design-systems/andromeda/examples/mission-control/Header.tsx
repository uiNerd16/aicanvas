// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL: Header
// Title left, mission clock center, status + bell right.
//
// Responsive (desktop-first — see rules.md → Responsive): the
// header gains a hamburger IconButton, hidden on desktop and shown
// (`inline-flex`) below `mq.md`, that opens the nav Drawer. Below
// `mq.md` the inline padding tightens and the centered mission clock
// is allowed to shrink so the row never overflows the viewport.
// ============================================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { List } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { mq } from '../../components/lib/responsive';
import { CornerMarkers } from '../../components/CornerMarkers';
import { IconButton } from '../../components/IconButton';

function pad(n) { return String(n).padStart(2, '0'); }

function MissionClock() {
  // Display "T+ HH:MM:SS" — counts up from page mount.
  const [seconds, setSeconds] = useState(14 * 3600 + 32 * 60 + 8); // start at T+ 14:32:08

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing[3],
      padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
      border: `${tokens.border.thin} ${tokens.color.border.base}`,
      background: tokens.color.surface.raised,
      position: 'relative',
      minWidth: 0,
    }}>
      <CornerMarkers size={4} offset={2} />
      <span style={{
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.xs,
        color: tokens.color.text.muted,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.widest,
      }}>
        Mission
      </span>
      <span style={{
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.md,
        color: tokens.color.accent[300],
        fontWeight: tokens.typography.weight.medium,
        letterSpacing: tokens.typography.tracking.wide,
      }}>
        T+ {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  );
}

export function Header({ sectionTitle = 'Overview', motionProps, onMenuOpen, menuOpen = false }) {
  return (
    <motion.header
      {...(motionProps ?? {})}
      className="mc-header"
      style={{
        position: 'relative',
        height: tokens.layout.headerHeight,
        flexShrink: 0,
        background: tokens.color.surface.raised,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${tokens.spacing[6]}`,
        gap: tokens.spacing[5],
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
      }}
    >
      <CornerMarkers />

      {/* Hamburger — opens the nav Drawer. Hidden on desktop (the sidebar is
          visible there); shown below `mq.md` where the sidebar is hidden.
          Carries the stateful data-state look while the drawer is open. */}
      <IconButton
        className="mc-hamburger"
        variant="ghost"
        size="lg"
        icon={List}
        aria-label="Open navigation"
        aria-expanded={menuOpen}
        data-state={menuOpen ? 'open' : 'closed'}
        onClick={onMenuOpen}
        style={{
          display: 'none',
          flexShrink: 0,
          ...(menuOpen
            ? { background: tokens.color.surface.active, color: tokens.color.text.primary }
            : null),
        }}
      />

      {/* Title block — section-aware */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1], flexShrink: 0 }}>
        <span style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
        }}>
          /// Section
        </span>
        <h1 style={{
          margin: 0,
          fontFamily: tokens.typography.fontSans,
          fontSize: tokens.typography.size.lg,
          fontWeight: tokens.typography.weight.semibold,
          color: tokens.color.text.primary,
          letterSpacing: '-0.01em',
        }}>
          {sectionTitle}
        </h1>
      </div>

      {/* Mission clock — centered */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <MissionClock />
      </div>

      {/* Right: status only — dot + label, no box */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
        flexShrink: 0,
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          flexShrink: 0,
          background: tokens.color.accent[400],
          border: `1px solid ${tokens.color.accent[400]}`,
          boxShadow: `0 0 6px ${tokens.color.accent[500]}`,
        }} />
        <span
          className="mc-status-label"
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.accent[100],
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}
        >
          Nominal
        </span>
      </div>

      <style>{`
        ${mq.md} {
          /* Tighter inline padding + gap so the hamburger, title, clock and
             status all fit the narrow row without forcing page scroll. */
          .mc-header {
            padding: 0 ${tokens.spacing[4]} !important;
            gap: ${tokens.spacing[3]} !important;
          }
          /* Hamburger appears; inline display:none is overridden here. */
          .mc-hamburger { display: inline-flex !important; }
        }
        ${mq.sm} {
          /* On the smallest phones drop the status word — the glowing dot
             still signals nominal status, and the clock keeps its room. */
          .mc-status-label { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
}
