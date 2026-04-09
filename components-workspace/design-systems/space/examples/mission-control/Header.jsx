// ============================================================
// MISSION CONTROL: Header
// Title left, mission clock center, status + bell + avatar right.
// ============================================================

import { useState, useEffect } from 'react';
import { Notification } from '@carbon/icons-react';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Avatar } from '../../components/Avatar';

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
        color: tokens.color.accent.bright,
        fontWeight: tokens.typography.weight.medium,
        letterSpacing: tokens.typography.tracking.wide,
      }}>
        T+ {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  );
}

export function Header() {
  const [notifHovered, setNotifHovered] = useState(false);

  return (
    <header style={{
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
    }}>
      <CornerMarkers />

      {/* Title block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
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
          Overview
        </h1>
      </div>

      {/* Mission clock — centered */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <MissionClock />
      </div>

      {/* Right: status + bell + avatar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[3],
        flexShrink: 0,
      }}>
        {/* Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
          border: `${tokens.border.thin} ${tokens.color.border.base}`,
          background: tokens.color.surface.raised,
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            background: tokens.color.accent.base,
            boxShadow: `0 0 6px ${tokens.color.accent.glow}`,
          }} />
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.accent.bright,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            Nominal
          </span>
        </div>

        {/* Notification bell */}
        <button
          onMouseEnter={() => setNotifHovered(true)}
          onMouseLeave={() => setNotifHovered(false)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            border: `${tokens.border.thin} ${notifHovered ? tokens.color.border.bright : tokens.color.border.base}`,
            background: notifHovered ? tokens.color.surface.hover : tokens.color.surface.raised,
            cursor: 'pointer',
            color: tokens.color.text.secondary,
            transition: 'all 0.15s ease',
          }}
        >
          <Notification size={20} />
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '5px',
            height: '5px',
            background: tokens.color.warning,
            boxShadow: `0 0 4px rgba(245, 165, 36, 0.6)`,
          }} />
        </button>

        <Avatar name="Reza Quinn" size="md" />
      </div>
    </header>
  );
}
