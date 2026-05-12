// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SIGNAL ROOM: Header
// Section label left, command-K search center, transmit-status
// right. Mirrors the mission-control header so the system reads
// as one family.
// ============================================================

import { MagnifyingGlass } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';

function CommandSearch() {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[3],
        width: '420px',
        maxWidth: '60%',
        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
        border: `${tokens.border.thin} ${tokens.color.border.base}`,
        background: tokens.color.surface.raised,
      }}
    >
      <CornerMarkers size={4} offset={2} />
      <MagnifyingGlass
        size={14}
        weight="regular"
        color={tokens.color.text.muted}
      />
      <span
        style={{
          flex: 1,
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          letterSpacing: tokens.typography.tracking.wide,
        }}
      >
        Search tracks, channels, waveforms
      </span>
      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: '10px',
          color: tokens.color.text.faint,
          padding: '2px 6px',
          border: `${tokens.border.thin} ${tokens.color.border.subtle}`,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
        }}
      >
        ⌘ K
      </span>
    </div>
  );
}

export function Header({ sectionTitle = 'Library', motionProps }) {
  return (
    <motion.header
      {...(motionProps ?? {})}
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
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <CommandSearch />
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
    </motion.header>
  );
}
