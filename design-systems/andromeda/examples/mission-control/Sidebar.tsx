// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL: Sidebar
// ============================================================

import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Avatar } from '../../components/Avatar';
import { NavItem } from '../../components/NavItem';
import { AndromedaIcon } from '../../AndromedaIcon';
import { navItems } from './data';

export function Sidebar({ activeNav, onNavChange }) {
  return (
    <aside style={{
      position: 'relative',
      width: tokens.layout.sidebarWidth,
      flexShrink: 0,
      background: tokens.color.surface.raised,
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(2px)',
      WebkitBackdropFilter: 'blur(2px)',
    }}>
      <CornerMarkers />

      {/* Logo block */}
      <div style={{
        padding: `${tokens.spacing[6]} ${tokens.spacing[3]} ${tokens.spacing[3]}`,
        borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[3],
      }}>
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

      {/* Nav */}
      <nav style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {navItems.map(item => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeNav === item.id}
            onClick={() => onNavChange(item.id)}
          />
        ))}
      </nav>

      {/* User card */}
      <div style={{
        padding: tokens.spacing[3],
        borderTop: `${tokens.border.thin} ${tokens.color.border.subtle}`,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[3],
      }}>
        <Avatar name="Reza Quinn" src="https://images.unsplash.com/photo-1669287731461-bd8ce3126710?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" size="md" status="online" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            fontWeight: tokens.typography.weight.semibold,
            color: tokens.color.text.primary,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            Reza Quinn
          </div>
          <div style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wide,
          }}>
            Flight Director
          </div>
        </div>
      </div>
    </aside>
  );
}
