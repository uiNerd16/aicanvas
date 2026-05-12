// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SIGNAL ROOM: Recent transmissions
// Replaces the Spotify "Jump back in" row. Tabular layout —
// dense, one row per track, with mono identifiers and a right-
// aligned numeric peak meter. Row reveals use the row-stagger
// pattern from the design-system rules.
// ============================================================

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { Card } from '../../components/Card';
import { PanelHeader } from '../../components/PanelHeader';
import { IconButton } from '../../components/IconButton';
import { rowContainer, rowItem } from '../../components/lib/motion';
import { recentTransmissions } from './data';

// All columns left-align. Right-alignment on numeric columns was
// cramping the four trailing headers (Duration/Plays/Peak/Last) into
// each other; a uniform left baseline reads more like a media table
// than a finance table and lets the eye scan top-to-bottom cleanly.
const COLS = [
  { key: 'play',     label: '',         width: '48px'  },
  { key: 'id',       label: 'ID',       width: '104px' },
  { key: 'track',    label: 'Track',    width: 'auto'  },
  { key: 'duration', label: 'Duration', width: '96px'  },
  { key: 'plays',    label: 'Plays',    width: '88px'  },
  { key: 'peak',     label: 'Peak',     width: '128px' },
  { key: 'last',     label: 'Last',     width: '96px'  },
];

function PeakBar({ value }) {
  return (
    <div
      style={{
        position: 'relative',
        height: '4px',
        width: '60px',
        background: tokens.color.surface.overlay,
        border: `${tokens.border.thin} ${tokens.color.border.subtle}`,
        display: 'inline-block',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${value}%`,
          background: value > 85 ? tokens.color.orange[300] : tokens.color.text.primary,
        }}
      />
    </div>
  );
}

function HeaderCell({ col }) {
  return (
    <th
      style={{
        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
        textAlign: 'left',
        width: col.width === 'auto' ? undefined : col.width,
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.xs,
        color: tokens.color.text.muted,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.widest,
        fontWeight: tokens.typography.weight.medium,
        verticalAlign: 'top',
      }}
    >
      {col.label}
    </th>
  );
}

function BodyCell({ children, align = 'left', mono = true, color, width }) {
  return (
    <td
      style={{
        padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`,
        textAlign: align,
        width,
        fontFamily: mono ? tokens.typography.fontMono : tokens.typography.fontSans,
        fontSize: tokens.typography.size.xs,
        color: color ?? tokens.color.text.secondary,
        letterSpacing: mono ? tokens.typography.tracking.wide : 'normal',
        verticalAlign: 'top',
        lineHeight: 1,
      }}
    >
      {children}
    </td>
  );
}

export function RecentTransmissions() {
  return (
    <Card style={{ flex: 1, minWidth: 0 }}>
      <PanelHeader
        title="Recent transmissions"
        actions={
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
              cursor: 'pointer',
            }}
          >
            See all
          </span>
        }
      />
      <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundImage: `linear-gradient(to right, transparent, transparent ${tokens.spacing[3]}, ${tokens.color.border.subtle} ${tokens.spacing[3]}, ${tokens.color.border.subtle} calc(100% - ${tokens.spacing[3]}), transparent calc(100% - ${tokens.spacing[3]}))`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom left',
                backgroundSize: '100% 1px',
              }}
            >
              {COLS.map(c => <HeaderCell key={c.key} col={c} />)}
            </tr>
          </thead>
          <motion.tbody
            variants={rowContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <AnimatePresence initial={false}>
              {recentTransmissions.map((r) => (
                <motion.tr
                  key={r.id}
                  variants={rowItem}
                  exit="exit"
                  style={{
                    backgroundImage: `linear-gradient(to right, transparent, transparent ${tokens.spacing[3]}, ${tokens.color.border.subtle} ${tokens.spacing[3]}, ${tokens.color.border.subtle} calc(100% - ${tokens.spacing[3]}), transparent calc(100% - ${tokens.spacing[3]}))`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom left',
                    backgroundSize: '100% 1px',
                  }}
                >
                  <BodyCell width="48px">
                    <IconButton variant="ghost" size="sm" icon={Play} aria-label={`Play ${r.track}`} />
                  </BodyCell>
                  <BodyCell width="104px" color={tokens.color.text.faint}>
                    {r.id}
                  </BodyCell>
                  <BodyCell mono={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span
                        style={{
                          fontFamily: tokens.typography.fontSans,
                          fontSize: tokens.typography.size.sm,
                          color: tokens.color.text.primary,
                          fontWeight: tokens.typography.weight.medium,
                          letterSpacing: '-0.01em',
                          lineHeight: 1,
                        }}
                      >
                        {r.track}
                      </span>
                      <span
                        style={{
                          fontFamily: tokens.typography.fontMono,
                          fontSize: '10px',
                          color: tokens.color.text.muted,
                          textTransform: 'uppercase',
                          letterSpacing: tokens.typography.tracking.widest,
                          lineHeight: 1,
                        }}
                      >
                        {r.artist}
                      </span>
                    </div>
                  </BodyCell>
                  <BodyCell width="96px" color={tokens.color.text.primary}>
                    {r.duration}
                  </BodyCell>
                  <BodyCell width="88px" color={tokens.color.text.primary}>
                    {r.plays}
                  </BodyCell>
                  <BodyCell width="128px">
                    <PeakBar value={r.peak} />
                  </BodyCell>
                  <BodyCell width="96px" color={tokens.color.text.faint}>
                    {r.last}
                  </BodyCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
    </Card>
  );
}
