// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// EXCHANGE TERMINAL · OrderBook
// ============================================================

'use client';

import { Funnel, Printer } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { IconButton } from '../../components/IconButton';
import { Dropdown } from './Dropdown';
import { asks, bids, tape } from './data';

const num = (n, d = 3) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// Shared text style for all data rows.
const ROW_TEXT = {
  fontFamily: tokens.typography.fontMono,
  fontSize: tokens.typography.size.sm,        // 12px — readable at density
  letterSpacing: tokens.typography.tracking.wide,
};

// Shared header style for column labels.
const COL_HEADER = {
  fontFamily: tokens.typography.fontMono,
  fontSize: tokens.typography.size.sm,
  color: tokens.color.text.muted,
  textTransform: 'uppercase',
  letterSpacing: tokens.typography.tracking.widest,
};

function DepthRow({ row, side, depth }) {
  const tint = side === 'ask' ? tokens.color.red.alpha : tokens.color.accent.alpha;
  const priceColor = side === 'ask' ? tokens.color.red[200] : tokens.color.accent[200];
  return (
    <div
      className="ex-row"
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'center',
        height: tokens.spacing[6],             // 24px — one token step up from original 20px
        padding: `0 ${tokens.spacing[4]}`,
        ...ROW_TEXT,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: `1px 0 1px auto`,
          right: 0,
          width: `${depth * 100}%`,
          background: tint,
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', color: priceColor }}>{num(row.p, 2)}</span>
      <span style={{ position: 'relative', color: tokens.color.text.secondary, textAlign: 'right' }}>
        {num(row.a, 3)}
      </span>
      <span style={{ position: 'relative', color: tokens.color.text.secondary, textAlign: 'right' }}>
        {num(row.t, 3)}
      </span>
    </div>
  );
}

function maxAmount(rows) {
  return rows.reduce((m, r) => Math.max(m, r.a), 0);
}

// Two small coloured bars stacked — represents both / asks / bids view mode.
// Used as `children` of IconButton (custom glyph, not a phosphor icon).
function ModeIcon({ topColor, botColor }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ width: tokens.spacing[3], height: '3px', background: topColor }} />
      <span style={{ width: tokens.spacing[3], height: '3px', background: botColor }} />
    </span>
  );
}

const STEP_OPTIONS = ['0.001', '0.01', '0.1', '1', '10'];

export function OrderBook() {
  const askMax = maxAmount(asks);
  const bidMax = maxAmount(bids);

  return (
    <div
      style={{
        position: 'relative',
        background: tokens.color.surface.raised,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      <CornerMarkers />

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
          borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
        }}
      >
        <IconButton aria-label="Both sides" variant="default" size="sm">
          <ModeIcon topColor={tokens.color.red[300]} botColor={tokens.color.accent[300]} />
        </IconButton>
        <IconButton aria-label="Asks only" variant="outline" size="sm">
          <ModeIcon topColor={tokens.color.red[300]} botColor={tokens.color.text.faint} />
        </IconButton>
        <IconButton aria-label="Bids only" variant="outline" size="sm">
          <ModeIcon topColor={tokens.color.text.faint} botColor={tokens.color.accent[300]} />
        </IconButton>

        <div style={{ flex: 1 }} />

        <Dropdown
          variant="chunk"
          label="0.1"
          items={STEP_OPTIONS}
          selected="0.1"
          align="right"
        />

        <IconButton aria-label="Print depth" variant="outline" size="sm" icon={Printer} />
      </div>

      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
          borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
          ...COL_HEADER,
        }}
      >
        <span>Price (USDT)</span>
        <span style={{ textAlign: 'right' }}>Amount (SOL)</span>
        <span style={{ textAlign: 'right' }}>Total</span>
      </div>

      {/* Asks — pinned to bottom of their half */}
      <div
        style={{
          flex: '1 1 0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {asks.map((row) => (
          <DepthRow key={`ask-${row.p}`} row={row} side="ask" depth={row.a / askMax} />
        ))}
      </div>

      {/* Centerline last-price */}
      <div
        style={{
          padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
          borderTop: `${tokens.border.thin} ${tokens.color.border.subtle}`,
          borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
          background: tokens.color.surface.overlay,
          display: 'flex',
          alignItems: 'baseline',
          gap: tokens.spacing[3],
        }}
      >
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xl,   // 18px — hero readout
            fontWeight: tokens.typography.weight.semibold,
            color: tokens.color.accent[200],
            letterSpacing: tokens.typography.tracking.wide,
          }}
        >
          {num(tape.price, 2)}
        </span>
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            color: tokens.color.text.muted,
            letterSpacing: tokens.typography.tracking.wide,
          }}
        >
          ${num(tape.priceUsd, 2)}
        </span>
        <span style={{ flex: 1 }} />
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            color: tokens.color.text.faint,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}
        >
          More
        </span>
        <Funnel weight="regular" size={14} style={{ color: tokens.color.accent[300] }} />
      </div>

      {/* Bids */}
      <div style={{ flex: '1 1 0', overflow: 'hidden' }}>
        {bids.map((row) => (
          <DepthRow key={`bid-${row.p}`} row={row} side="bid" depth={row.a / bidMax} />
        ))}
      </div>
    </div>
  );
}
