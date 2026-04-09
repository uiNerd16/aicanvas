// ============================================================
// MISSION CONTROL: Sidebar
// ============================================================

import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Avatar } from '../../components/Avatar';
import { NavItem } from '../../components/NavItem';
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
        <div style={{
          position: 'relative',
          width: '34px',
          height: '34px',
          background: tokens.color.accent.glowSoft,
          border: `${tokens.border.thin} ${tokens.color.accent.dim}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          fontWeight: tokens.typography.weight.bold,
          color: tokens.color.accent.bright,
          letterSpacing: tokens.typography.tracking.tight,
        }}>
          <CornerMarkers size={4} offset={2} />
          MC
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.primary,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
            fontWeight: tokens.typography.weight.semibold,
          }}>
            Mission
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            Control
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
        <Avatar name="Reza Quinn" size="md" status="online" />
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
