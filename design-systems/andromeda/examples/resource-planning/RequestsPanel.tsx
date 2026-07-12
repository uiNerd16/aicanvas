// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// RESOURCE PLANNING · RequestsPanel
// Top-right card. Three breakdown cells (approved / pending /
// rejected) and a stacked-share bar at the bottom that reads as a
// single horizontal split rather than three independent bars.
// ============================================================

'use client';

import { tokens } from '../../tokens';
import { mq } from '../../components/lib/responsive';
import { CornerMarkers } from '../../components/CornerMarkers';
import { PanelHeader } from '../../components/PanelHeader';
import { PanelMenu } from '../../components/PanelMenu';
import { ArrowClockwise, Export, Check, EyeSlash } from '@phosphor-icons/react';
import { requestsBreakdown } from './data';

const BUCKETS = [
  { key: 'approved', label: 'Approved', color: tokens.color.accent[400], borderColor: tokens.color.accent[200] },
  { key: 'pending',  label: 'Pending',  color: tokens.color.orange[400], borderColor: tokens.color.orange[200] },
  { key: 'rejected', label: 'Rejected', color: tokens.color.red[400],    borderColor: tokens.color.red[200]    },
];

// ── Single breakdown cell ─────────────────────────────────────────
// `rp-req-cell` carries the responsive separator swap: the desktop
// vertical border (borderRight, inline below) drops below `mq.md` and
// becomes a horizontal one when the three cells stack — see <style> in
// RequestsPanel.
function Cell({ label, value, share, last = false }) {
  return (
    <div
      className={last ? 'rp-req-cell rp-req-cell-last' : 'rp-req-cell'}
      style={{
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: tokens.spacing[2],
        padding: `${tokens.spacing[5]} ${tokens.spacing[5]}`,
        borderRight: last ? 'none' : `${tokens.border.thin} ${tokens.color.border.subtle}`,
      }}
    >
      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size['2xl'],
          fontWeight: tokens.typography.weight.bold,
          color: tokens.color.text.primary,
          letterSpacing: tokens.typography.tracking.tight,
          lineHeight: tokens.typography.lineHeight.tight,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.muted,
          letterSpacing: tokens.typography.tracking.wide,
        }}
      >
        {(share * 100).toFixed(1)}%
      </span>
    </div>
  );
}

// ── Stacked-share bar ─────────────────────────────────────────────
// Single horizontal bar with three skewed parallelogram segments,
// matching the ProgressBar diagonal motif. Each segment width
// reflects its share of the total.
function StackedBar() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '3px',
        height: tokens.spacing[5],
        padding: `0 ${tokens.spacing[5]} ${tokens.spacing[5]} ${tokens.spacing[5]}`,
      }}
    >
      {BUCKETS.map((b) => {
        const share = requestsBreakdown[b.key].share;
        return (
          <div
            key={b.key}
            style={{
              flex: `${share} 1 0`,
              minWidth: 0,
              height: '100%',
              transform: 'skewX(-12deg)',
              background: b.color,
              border: `${tokens.border.thin} ${b.borderColor}`,
              borderRadius: tokens.radius.frame,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Composition ──────────────────────────────────────────────────
export function RequestsPanel() {
  return (
    <div
      style={{
        position: 'relative',
        background: tokens.color.surface.raised,
        display: 'flex',
        flexDirection: 'column',
        // Fill the grid cell so this matches the Capacity panel's height in the
        // shared top row (the two were drifting — Requests sat shorter).
        height: '100%',
      }}
    >
      <CornerMarkers />

      <PanelHeader
        title="Requests"
        actions={
          <PanelMenu
            ariaLabel="Requests options"
            items={[
              { label: 'Refresh', icon: ArrowClockwise, onSelect: () => {} },
              { label: 'Review',  icon: Check,          onSelect: () => {} },
              { label: 'Export',  icon: Export,         onSelect: () => {} },
              { type: 'separator' },
              { label: 'Hide',    icon: EyeSlash,       onSelect: () => {} },
            ]}
          />
        }
      />

      {/* Three cells — flex:1 so the row fills the panel height. Below
          `mq.md` the row stacks (flex-direction:column) and the inter-cell
          separators flip from vertical to horizontal. */}
      <div className="rp-req-cells" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {BUCKETS.map((b, i) => (
          <Cell
            key={b.key}
            label={b.label}
            value={requestsBreakdown[b.key].value}
            share={requestsBreakdown[b.key].share}
            last={i === BUCKETS.length - 1}
          />
        ))}
      </div>

      {/* Stacked share bar */}
      <StackedBar />

      <style>{`
        ${mq.md} {
          /* Stack the three breakdown cells top-to-bottom; swap the vertical
             inter-cell border for a horizontal one so the divider follows the
             new flow. */
          .rp-req-cells { flex-direction: column !important; }
          .rp-req-cell {
            border-right: none !important;
            border-bottom: ${tokens.border.thin} ${tokens.color.border.subtle} !important;
          }
          .rp-req-cell-last { border-bottom: none !important; }
        }
      `}</style>
    </div>
  );
}
