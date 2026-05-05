// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL · Maintenance section
// Scheduled maintenance windows. State chip + target + task + window
// + duration. In-progress rows get an accent left rail.
// ============================================================

import { useState } from 'react';
import { Wrench, Clock, CheckCircle, XCircle } from '@phosphor-icons/react';
import { tokens } from '../../../tokens';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { maintenance as MAINTENANCE } from '../data';

const STATE = {
  scheduled:   { badge: 'default', label: 'Scheduled',   icon: Clock,       rail: tokens.color.border.base   },
  'in-progress': { badge: 'accent',  label: 'In Progress', icon: Wrench,      rail: tokens.color.accent[400]    },
  completed:   { badge: 'subtle',  label: 'Completed',   icon: CheckCircle, rail: tokens.color.border.subtle },
  failed:      { badge: 'fault',   label: 'Failed',      icon: XCircle,     rail: tokens.color.red[300]         },
};

const FILTERS = [
  { id: 'upcoming', label: 'Upcoming', match: ['scheduled', 'in-progress'] },
  { id: 'past',     label: 'Past',     match: ['completed', 'failed']      },
  { id: 'all',      label: 'All',      match: null                          },
];

function MaintenanceRow({ row, isLast }) {
  const s = STATE[row.state];
  const Icon = s.icon;

  return (
    <div style={{
      display: 'flex',
      gap: tokens.spacing[4],
      padding: tokens.spacing[4],
      borderBottom: isLast ? 'none' : `${tokens.border.thin} ${tokens.color.border.subtle}`,
      alignItems: 'center',
    }}>
      <div style={{
        width: tokens.spacing[1],
        flexShrink: 0,
        alignSelf: 'stretch',
        background: s.rail,
      }} />

      {/* Icon block */}
      <div style={{
        width: tokens.spacing[10],
        height: tokens.spacing[10],
        flexShrink: 0,
        background: tokens.color.surface.raised,
        border: `${tokens.border.thin} ${tokens.color.border.base}`,
        color: tokens.color.text.secondary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={20} weight="light" />
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          gap: tokens.spacing[3],
          alignItems: 'center',
          marginBottom: tokens.spacing[1],
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.faint,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            {row.id}
          </span>
          <Badge variant={s.badge}>{s.label}</Badge>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            · {row.target}
          </span>
        </div>
        <div style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.md,
          color: tokens.color.text.primary,
          fontWeight: tokens.typography.weight.medium,
          letterSpacing: tokens.typography.tracking.wide,
          marginBottom: tokens.spacing[1],
        }}>
          {row.task}
        </div>
        <div style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          letterSpacing: tokens.typography.tracking.wide,
        }}>
          {row.window}
        </div>
      </div>

      {/* Duration column */}
      <div style={{
        flexShrink: 0,
        textAlign: 'right',
        minWidth: tokens.spacing[12],
      }}>
        <div style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.faint,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
          marginBottom: tokens.spacing[1],
        }}>
          Duration
        </div>
        <div style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.md,
          color: tokens.color.text.primary,
          fontWeight: tokens.typography.weight.medium,
          letterSpacing: tokens.typography.tracking.wide,
        }}>
          {row.duration}
        </div>
      </div>

      {/* Action */}
      <div style={{ flexShrink: 0 }}>
        {row.state === 'scheduled' && (
          <Button variant="outline" size="sm">Reschedule</Button>
        )}
        {row.state === 'in-progress' && (
          <Button size="sm">Monitor</Button>
        )}
        {(row.state === 'completed' || row.state === 'failed') && (
          <Button variant="ghost" size="sm">Report</Button>
        )}
      </div>
    </div>
  );
}

export function MaintenanceSection() {
  const [filter, setFilter] = useState('upcoming');

  const filtered = MAINTENANCE.filter(row => {
    const f = FILTERS.find(x => x.id === filter);
    return f.match === null ? true : f.match.includes(row.state);
  });

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
            /// Operations
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.primary,
            fontWeight: tokens.typography.weight.medium,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            Maintenance
          </span>
        </div>
        <Button variant="outline" size="sm">Schedule</Button>
      </CardHeader>

      <CardContent>
        <div style={{ display: 'flex', gap: tokens.spacing[2], flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              style={{
                padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
                border: `${tokens.border.thin} ${filter === f.id ? tokens.color.accent[400] : tokens.color.border.base}`,
                background: filter === f.id ? tokens.color.accent[500] : tokens.color.surface.raised,
                color: filter === f.id ? tokens.color.accent[100] : tokens.color.text.secondary,
                fontFamily: tokens.typography.fontMono,
                fontSize: tokens.typography.size.xs,
                fontWeight: tokens.typography.weight.medium,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.tracking.wider,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </CardContent>

      {filtered.length === 0 ? (
        <div style={{
          padding: tokens.spacing[6],
          textAlign: 'center',
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wider,
        }}>
          No maintenance windows
        </div>
      ) : (
        filtered.map((row, i) => (
          <MaintenanceRow key={row.id} row={row} isLast={i === filtered.length - 1} />
        ))
      )}
    </Card>
  );
}
