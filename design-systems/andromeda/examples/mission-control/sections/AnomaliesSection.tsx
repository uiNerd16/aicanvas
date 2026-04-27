// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL · Anomalies section
// Severity-grouped alert list. Open faults rise to the top, then
// warnings, then info. Each row carries an action pair (Acknowledge /
// Resolve) using existing Andromeda Buttons.
// ============================================================

import { useState, useMemo } from 'react';
import { tokens } from '../../../tokens';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Tag } from '../../../components/Tag';
import { anomalies as ANOMALIES } from '../data';

const SEVERITY = {
  fault:   { badge: 'fault',   label: 'Fault',   color: tokens.color.fault       },
  warning: { badge: 'warning', label: 'Warning', color: tokens.color.warning     },
  info:    { badge: 'subtle',  label: 'Info',    color: tokens.color.text.muted  },
};

const STATUS_LABEL = {
  open:          'Open',
  investigating: 'Investigating',
  resolved:      'Resolved',
};

// Tag only ships 4 variants — collapse 'resolved' onto 'default'
// (visually distinct enough via the dimmed severity rail next to it).
const STATUS_TAG_VARIANT = {
  open:          'default',
  investigating: 'accent',
  resolved:      'default',
};

const FILTERS = [
  { id: 'open',          label: 'Open'          },
  { id: 'investigating', label: 'Investigating' },
  { id: 'resolved',      label: 'Resolved'      },
  { id: 'all',           label: 'All'           },
];

function AnomalyRow({ anomaly, isLast }) {
  const sev = SEVERITY[anomaly.severity];

  return (
    <div style={{
      display: 'flex',
      gap: tokens.spacing[3],
      padding: tokens.spacing[4],
      borderBottom: isLast ? 'none' : `${tokens.border.thin} ${tokens.color.border.subtle}`,
    }}>
      {/* Severity rail */}
      <div style={{
        width: tokens.spacing[1],
        flexShrink: 0,
        background: sev.color,
        opacity: anomaly.status === 'resolved' ? 0.3 : 1,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[3],
          marginBottom: tokens.spacing[2],
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.faint,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            {anomaly.id}
          </span>
          <Badge variant={sev.badge}>{sev.label}</Badge>
          <Tag variant={STATUS_TAG_VARIANT[anomaly.status]}>
            {STATUS_LABEL[anomaly.status]}
          </Tag>
          <span style={{
            marginLeft: 'auto',
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            letterSpacing: tokens.typography.tracking.wide,
          }}>
            {anomaly.time}
          </span>
        </div>

        {/* Title + source */}
        <div style={{ marginBottom: tokens.spacing[2] }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.primary,
            fontWeight: tokens.typography.weight.medium,
            letterSpacing: tokens.typography.tracking.wide,
          }}>
            {anomaly.title}
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
            marginLeft: tokens.spacing[3],
          }}>
            · {anomaly.source}
          </span>
        </div>

        {/* Detail */}
        <div style={{
          fontFamily: tokens.typography.fontSans,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.secondary,
          lineHeight: tokens.typography.lineHeight.snug,
          marginBottom: tokens.spacing[3],
        }}>
          {anomaly.detail}
        </div>

        {/* Actions */}
        {anomaly.status !== 'resolved' && (
          <div style={{ display: 'flex', gap: tokens.spacing[2] }}>
            <Button variant="outline" size="sm">Acknowledge</Button>
            <Button size="sm">Resolve</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AnomaliesSection() {
  const [filter, setFilter] = useState('open');

  const filtered = useMemo(() => {
    const list = filter === 'all'
      ? ANOMALIES
      : ANOMALIES.filter(a => a.status === filter);
    // Sort by severity weight (fault > warning > info), then by status
    const weight = { fault: 3, warning: 2, info: 1 };
    return [...list].sort((a, b) => weight[b.severity] - weight[a.severity]);
  }, [filter]);

  const counts = {
    open:          ANOMALIES.filter(a => a.status === 'open').length,
    investigating: ANOMALIES.filter(a => a.status === 'investigating').length,
    resolved:      ANOMALIES.filter(a => a.status === 'resolved').length,
    all:           ANOMALIES.length,
  };

  return (
    <Card style={{ flex: 1, minWidth: 0 }}>
      <CardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            /// Anomalies
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.primary,
            fontWeight: tokens.typography.weight.medium,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            Alert Queue
          </span>
        </div>
        <Badge variant={counts.open > 0 ? 'fault' : 'subtle'}>
          {counts.open} open
        </Badge>
      </CardHeader>

      <CardContent>
        <div style={{
          display: 'flex',
          gap: tokens.spacing[2],
          flexWrap: 'wrap',
        }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              style={{
                padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
                border: `${tokens.border.thin} ${filter === f.id ? tokens.color.accent.dim : tokens.color.border.base}`,
                background: filter === f.id ? tokens.color.accent.glowSoft : tokens.color.surface.raised,
                color: filter === f.id ? tokens.color.accent.bright : tokens.color.text.secondary,
                fontFamily: tokens.typography.fontMono,
                fontSize: tokens.typography.size.xs,
                fontWeight: tokens.typography.weight.medium,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.tracking.wider,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: tokens.spacing[2],
              }}
            >
              {f.label}
              <span style={{
                color: filter === f.id ? tokens.color.accent.bright : tokens.color.text.muted,
              }}>
                {counts[f.id]}
              </span>
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
          No anomalies in this view
        </div>
      ) : (
        filtered.map((a, i) => (
          <AnomalyRow key={a.id} anomaly={a} isLast={i === filtered.length - 1} />
        ))
      )}
    </Card>
  );
}
