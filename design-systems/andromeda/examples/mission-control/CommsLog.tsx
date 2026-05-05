// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL: Row 3 right — Comms Log
// ============================================================

import { ArrowDown, ArrowUp, Warning } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { Card, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { commsLog } from './data';

const dirConfig = {
  down: {
    icon:  ArrowDown,
    label: 'DN',
    color: tokens.color.accent[100],
    bg:    tokens.color.accent[500],
    border:tokens.color.accent[400],
  },
  up: {
    icon:  ArrowUp,
    label: 'UP',
    color: tokens.color.text.primary,
    bg:    tokens.color.surface.raised,
    border:tokens.color.border.base,
  },
  alert: {
    icon:  Warning,
    label: '!',
    color: tokens.color.orange[300],
    bg:    tokens.color.orange[500],
    border:tokens.color.orange[400],
  },
};

function CommsItem({ entry, isLast }) {
  const cfg = dirConfig[entry.dir];
  const Icon = cfg.icon;

  return (
    <div style={{
      display: 'flex',
      gap: tokens.spacing[3],
      padding: tokens.spacing[3],
      borderBottom: isLast ? 'none' : `${tokens.border.thin} ${tokens.color.border.subtle}`,
    }}>
      {/* Direction box */}
      <div style={{
        width: '32px',
        height: '32px',
        flexShrink: 0,
        background: cfg.bg,
        border: `${tokens.border.thin} ${cfg.border}`,
        color: cfg.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={20} weight="light" />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: tokens.spacing[2],
          marginBottom: tokens.spacing[1],
        }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            fontWeight: tokens.typography.weight.semibold,
            color: cfg.color,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            {entry.from}
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            letterSpacing: tokens.typography.tracking.wide,
            flexShrink: 0,
          }}>
            {entry.time}
          </span>
        </div>
        <div style={{
          fontFamily: tokens.typography.fontSans,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.secondary,
          lineHeight: tokens.typography.lineHeight.snug,
        }}>
          {entry.text}
        </div>
      </div>
    </div>
  );
}

export function CommsLog() {
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
            /// Channel
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.primary,
            fontWeight: tokens.typography.weight.medium,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            Comms Log
          </span>
        </div>
        <Button variant="ghost" size="sm">All</Button>
      </CardHeader>

      {/* Items render directly inside Card — they own their own padding.
          Sliced to 5 entries so the card matches the VehiclesTable height
          on the Overview row. The "All" button in the header is the
          escape hatch when a viewer wants the full log. */}
      {commsLog.slice(0, 5).map((entry, i, arr) => (
        <CommsItem
          key={i}
          entry={entry}
          isLast={i === arr.length - 1}
        />
      ))}
    </Card>
  );
}
