// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SIGNAL ROOM: Header
// Section label left, command-K search center, transmit-status
// right. Mirrors the mission-control header so the system reads
// as one family.
//
// Responsive (desktop-first — see rules.md → Responsive): the
// header gains a hamburger IconButton, hidden on desktop and shown
// (`inline-flex`) below `mq.md`, that opens the nav Drawer. Below
// `mq.md` the inline padding/gap tighten so the row never overflows
// the viewport; below `mq.sm` the centered search collapses (the
// row is too narrow for it) and the "Transmitting" word drops,
// leaving the glowing dot to carry the live signal.
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { List } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { mq } from '../../components/lib/responsive';
import { CornerMarkers } from '../../components/CornerMarkers';
import { IconButton } from '../../components/IconButton';
import { SearchField } from '../../components/SearchField';

export function Header({ sectionTitle = 'Library', motionProps, onMenuOpen, menuOpen = false }) {
  return (
    <motion.header
      {...(motionProps ?? {})}
      className="sr-header"
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
        className="sr-hamburger"
        variant="ghost"
        size="md"
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

      {/* Section title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1], flexShrink: 0 }}>
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}
        >
          /// Section
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: tokens.typography.fontSans,
            fontSize: tokens.typography.size.lg,
            fontWeight: tokens.typography.weight.semibold,
            color: tokens.color.text.primary,
            letterSpacing: '-0.01em',
          }}
        >
          {sectionTitle}
        </h1>
      </div>

      {/* Command search */}
      <div className="sr-search" style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <SearchField style={{ width: '420px', maxWidth: '60%' }} />
      </div>

      {/* Transmit status — dot + label, no box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            flexShrink: 0,
            background: tokens.color.accent[400],
            border: `1px solid ${tokens.color.accent[400]}`,
            boxShadow: `0 0 6px ${tokens.color.accent[500]}`,
          }}
        />
        <span
          className="sr-status-label"
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.accent[100],
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}
        >
          Transmitting
        </span>
      </div>

      <style>{`
        ${mq.md} {
          /* Tighter inline padding + gap so the hamburger, title, search and
             status all fit the narrow row without forcing page scroll. */
          .sr-header {
            padding: 0 ${tokens.spacing[4]} !important;
            gap: ${tokens.spacing[3]} !important;
          }
          /* Hamburger appears; inline display:none is overridden here. */
          .sr-hamburger { display: inline-flex !important; }
        }
        ${mq.sm} {
          /* On phones the row is too narrow for a centered search; drop it
             (it lives in the command palette anyway) and drop the status word
             so the title + glowing dot keep their room. */
          .sr-search { display: none !important; }
          .sr-status-label { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
}
