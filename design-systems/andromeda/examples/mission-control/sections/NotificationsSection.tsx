// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL · Notifications section
// Read / unread list. Unread items get an accent left rail and bold
// title; reading marks them dim. "Mark all read" clears all rails.
// ============================================================

import { useState } from 'react';
import { Bell, Check } from '@phosphor-icons/react';
import { tokens } from '../../../tokens';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { notifications as INITIAL } from '../data';

function NotificationRow({ notif, isLast, onRead }) {
  const isUnread = !notif.read;

  return (
    <div
      onClick={onRead}
      style={{
        display: 'flex',
        gap: tokens.spacing[3],
        padding: tokens.spacing[4],
        borderBottom: isLast ? 'none' : `${tokens.border.thin} ${tokens.color.border.subtle}`,
        cursor: isUnread ? 'pointer' : 'default',
        background: isUnread ? tokens.color.surface.raised : 'transparent',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Unread rail */}
      <div style={{
        width: tokens.spacing[1],
        flexShrink: 0,
        background: isUnread ? tokens.color.accent.dim : 'transparent',
      }} />

      {/* Icon */}
      <div style={{
        width: tokens.spacing[10],
        height: tokens.spacing[10],
        flexShrink: 0,
        background: isUnread ? tokens.color.accent.glowSoft : tokens.color.surface.raised,
        border: `${tokens.border.thin} ${isUnread ? tokens.color.accent.dim : tokens.color.border.base}`,
        color: isUnread ? tokens.color.accent.bright : tokens.color.text.muted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Bell size={18} weight="light" />
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: tokens.spacing[3],
          marginBottom: tokens.spacing[1],
        }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            fontWeight: isUnread ? tokens.typography.weight.semibold : tokens.typography.weight.regular,
            color: isUnread ? tokens.color.text.primary : tokens.color.text.secondary,
            letterSpacing: tokens.typography.tracking.wide,
          }}>
            {notif.title}
          </span>
          <span style={{
            flexShrink: 0,
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            {notif.time}
          </span>
        </div>
        <div style={{
          fontFamily: tokens.typography.fontSans,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.secondary,
          lineHeight: tokens.typography.lineHeight.snug,
        }}>
          {notif.detail}
        </div>
      </div>
    </div>
  );
}

export function NotificationsSection() {
  const [list, setList] = useState(INITIAL);

  const unreadCount = list.filter(n => !n.read).length;

  function markRead(id) {
    setList(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }
  function markAllRead() {
    setList(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <Card style={{ flex: 1, minWidth: 0 }}>
      <CardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            /// Inbox
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.primary,
            fontWeight: tokens.typography.weight.medium,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            Notifications
          </span>
        </div>
        <div style={{ display: 'flex', gap: tokens.spacing[2], alignItems: 'center' }}>
          {unreadCount > 0 ? (
            <Badge variant="accent">{unreadCount} unread</Badge>
          ) : (
            <Badge variant="subtle">All read</Badge>
          )}
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" icon={Check} onClick={markAllRead}>
              Mark all
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wider,
          marginBottom: tokens.spacing[2],
        }}>
          {list.length} total
        </div>
      </CardContent>

      {list.map((n, i) => (
        <NotificationRow
          key={n.id}
          notif={n}
          isLast={i === list.length - 1}
          onRead={() => markRead(n.id)}
        />
      ))}
    </Card>
  );
}
