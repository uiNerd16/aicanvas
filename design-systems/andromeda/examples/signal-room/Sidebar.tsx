// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SIGNAL ROOM: Sidebar
// Console nav + pinned channels list + user card. Mirrors the
// mission-control sidebar so the system reads as one family;
// the lower "pinned channels" rail replaces the playlists rail
// in the Spotify reference.
// ============================================================

import { motion, LayoutGroup } from 'framer-motion';
import {
  UserCircle,
  Gear,
  Keyboard,
  SignOut,
  WaveSine,
} from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { NavItem } from '../../components/NavItem';
import { UserCard } from '../../components/UserCard';
import { AndromedaIcon } from '../../AndromedaIcon';
import { navItems, channels } from './data';

function InsetDivider({ side = 'bottom' }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        left: tokens.spacing[3],
        right: tokens.spacing[3],
        [side]: 0,
        height: '1px',
        background: tokens.color.border.subtle,
        pointerEvents: 'none',
      }}
    />
  );
}

const userMenuItems = [
  { id: 'profile',     label: 'Profile',             icon: UserCircle },
  { id: 'preferences', label: 'Preferences',         icon: Gear },
  { id: 'shortcuts',   label: 'Keyboard Shortcuts',  icon: Keyboard },
  { id: 'sep1',        type: 'separator' },
  { id: 'signout',     label: 'Sign Out',            icon: SignOut },
];

function ChannelRow({ ch }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
        cursor: 'pointer',
      }}
    >
      {/* Mono icon square — square corners, hairline border, no fill */}
      <div
        style={{
          width: '24px',
          height: '24px',
          flexShrink: 0,
          border: `${tokens.border.thin} ${tokens.color.border.subtle}`,
          background: tokens.color.surface.overlay,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WaveSine
          size={12}
          weight="regular"
          color={tokens.color.text.muted}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.primary,
            letterSpacing: tokens.typography.tracking.wide,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {ch.name}
        </span>
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: '10px',
            color: tokens.color.text.faint,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}
        >
          {ch.code} · {ch.tracks} TRACKS
        </span>
      </div>
    </div>
  );
}

export function Sidebar({ activeNav, onNavChange, motionProps }) {
  return (
    <motion.aside
      {...(motionProps ?? {})}
      style={{
        position: 'relative',
        width: tokens.layout.sidebarWidth,
        flexShrink: 0,
        background: tokens.color.surface.raised,
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
      }}
    >
      <CornerMarkers />

      {/* Logo block */}
      <div
        style={{
          position: 'relative',
          padding: `${tokens.spacing[6]} ${tokens.spacing[3]} ${tokens.spacing[3]}`,
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[3],
        }}
      >
        <InsetDivider />
        <AndromedaIcon size={28} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.primary,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
              fontWeight: tokens.typography.weight.semibold,
            }}
          >
            Signal Room
          </span>
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
            }}
          >
            Audio Console
          </span>
        </div>
      </div>

      {/* Section label */}
      <div
        style={{
          padding: `${tokens.spacing[3]} ${tokens.spacing[3]} ${tokens.spacing[2]}`,
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.faint,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
        }}
      >
        /// Console
      </div>

      {/* Primary nav */}
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        <LayoutGroup id="signal-room-sidebar">
          {navItems.map(item => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.id}
              onClick={() => onNavChange(item.id)}
            />
          ))}
        </LayoutGroup>
      </nav>

      {/* Channels rail */}
      <div
        style={{
          position: 'relative',
          marginTop: tokens.spacing[4],
          padding: `${tokens.spacing[3]} 0 ${tokens.spacing[2]}`,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <InsetDivider side="top" />
        <div
          style={{
            padding: `0 ${tokens.spacing[3]} ${tokens.spacing[2]}`,
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.faint,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}
        >
          /// Channels
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {channels.map(ch => (
            <ChannelRow key={ch.id} ch={ch} />
          ))}
        </div>
      </div>

      {/* User card */}
      <div style={{ position: 'relative' }}>
        <InsetDivider side="top" />
        <UserCard
          name="Kerem Alkan"
          role="Engineer · Premium"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
          status="online"
          items={userMenuItems}
          placement="top"
          align="stretch"
        />
      </div>
    </motion.aside>
  );
}
