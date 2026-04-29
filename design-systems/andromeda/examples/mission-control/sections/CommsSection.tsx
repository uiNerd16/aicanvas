// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL · Comms section
// Full comms log with a direction filter (All / Down / Up / Alerts)
// and a search input. Two-column layout on wide viewports: filtered
// log left, channel summary right.
// ============================================================

import { useState, useMemo } from 'react';
import { ArrowDown, ArrowUp, Warning, MagnifyingGlass } from '@phosphor-icons/react';
import { tokens } from '../../../tokens';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { Tag } from '../../../components/Tag';
import { Badge } from '../../../components/Badge';
import { commsLog } from '../data';

const dirConfig = {
  down: {
    icon:  ArrowDown,
    label: 'DN',
    color: tokens.color.accent.bright,
    bg:    tokens.color.accent.glowSoft,
    border:tokens.color.accent.dim,
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
    color: tokens.color.warning,
    bg:    tokens.color.warningGlow,
    border:tokens.color.warningDim,
  },
};

const FILTERS = [
  { id: 'all',   label: 'All'    },
  { id: 'down',  label: 'Down'   },
  { id: 'up',    label: 'Up'     },
  { id: 'alert', label: 'Alerts' },
];

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
      <div style={{
        width: tokens.spacing[8],
        height: tokens.spacing[8],
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

function FilterRow({ filter, setFilter }) {
  return (
    <div style={{
      display: 'flex',
      gap: tokens.spacing[2],
      flexWrap: 'wrap',
      marginBottom: tokens.spacing[4],
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
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export function CommsSection() {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return commsLog.filter(e => {
      if (filter !== 'all' && e.dir !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !e.from.toLowerCase().includes(q) &&
          !e.text.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [filter, query]);

  const counts = {
    all:   commsLog.length,
    down:  commsLog.filter(e => e.dir === 'down').length,
    up:    commsLog.filter(e => e.dir === 'up').length,
    alert: commsLog.filter(e => e.dir === 'alert').length,
  };

  return (
    <div style={{ display: 'flex', gap: tokens.spacing[5], flex: 1, minWidth: 0 }}>
      {/* Main log */}
      <Card style={{ flex: '1 1 auto', minWidth: 0 }}>
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
          <Badge variant="accent">{filtered.length} / {commsLog.length}</Badge>
        </CardHeader>

        <CardContent>
          <div style={{ marginBottom: tokens.spacing[4] }}>
            <Input
              icon={MagnifyingGlass}
              placeholder="SEARCH CALLSIGN OR MESSAGE"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <FilterRow filter={filter} setFilter={setFilter} />
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
            No transmissions match
          </div>
        ) : (
          filtered.map((entry, i) => (
            <CommsItem key={i} entry={entry} isLast={i === filtered.length - 1} />
          ))
        )}
      </Card>

      {/* Summary side panel — flex-fraction so the width tracks the
          container instead of a magic px value. */}
      <Card style={{ flex: '0 1 28%', minWidth: 0, alignSelf: 'flex-start' }}>
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
              Summary
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[3] }}>
            {[
              { id: 'down',  label: 'Downlink', count: counts.down  },
              { id: 'up',    label: 'Uplink',   count: counts.up    },
              { id: 'alert', label: 'Alerts',   count: counts.alert },
            ].map(row => (
              <div key={row.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: `${tokens.spacing[2]} 0`,
                borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
              }}>
                <span style={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: tokens.typography.size.xs,
                  color: tokens.color.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: tokens.typography.tracking.wider,
                }}>
                  {row.label}
                </span>
                <Tag variant={row.id === 'alert' ? 'warning' : 'default'}>
                  {row.count}
                </Tag>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
