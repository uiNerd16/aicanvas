// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL: Sidebar
// ============================================================

import { motion, LayoutGroup } from 'framer-motion';
import {
  UserCircle,
  Gear,
  Keyboard,
  SignOut,
} from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { NavItem } from '../../components/NavItem';
import { UserCard } from '../../components/UserCard';
import { AndromedaIcon } from '../../AndromedaIcon';
import { navItems } from './data';

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
      <div style={{
        position: 'relative',
        padding: `${tokens.spacing[6]} ${tokens.spacing[3]} ${tokens.spacing[3]}`,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[3],
      }}>
        <InsetDivider />
        <AndromedaIcon size={28} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.primary,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
            fontWeight: tokens.typography.weight.semibold,
          }}>
            Andromeda
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            Design System
          </span>
        </div>
      </div>

      {/* Section label */}
      <div style={{
        padding: `${tokens.spacing[3]} ${tokens.spacing[3]} ${tokens.spacing[2]}`,
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.xs,
        color: tokens.color.text.faint,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.widest,
      }}>
        /// Console
      </div>

      {/* Nav — LayoutGroup scopes NavItem's `layoutId` so the active dot
          slides between siblings on selection change. */}
      <nav style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <LayoutGroup id="mission-control-sidebar">
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

      {/* User card — opens upward and stretches to the sidebar width so
          the panel sits flush. The inset divider above the card lives
          inside this wrapper so it scopes to the row. */}
      <div style={{ position: 'relative' }}>
        <InsetDivider side="top" />
        <UserCard
          name="Reza Quinn"
          role="Flight Director"
          src="https://images.unsplash.com/photo-1669287731461-bd8ce3126710?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          status="online"
          items={userMenuItems}
          placement="top"
          align="stretch"
        />
      </div>
    </motion.aside>
  );
}
