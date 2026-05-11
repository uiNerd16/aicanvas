// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// EXCHANGE TERMINAL · PairList + MarketTrades
// ============================================================

'use client';

import { Star, MagnifyingGlass } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { rowContainer, rowItem } from '../../components/lib/motion';
import { Dropdown } from './Dropdown';
import { pairs, trades } from './data';

const ALTS_MENU  = ['All Alts', 'DeFi', 'NFT', 'Metaverse', 'Layer 1', 'Layer 2'];
const FIAT_MENU  = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'TRY'];
const ZONES_MENU = ['Innovation', 'Monitoring', 'Seed', 'Cross', 'Spot'];

// Shared text baseline for all data rows.
const ROW_TEXT = {
  fontFamily: tokens.typography.fontMono,
  fontSize: tokens.typography.size.sm,
  letterSpacing: tokens.typography.tracking.wide,
};

// Shared header baseline for column labels — tracking.normal prevents
// wide-spaced text from overflowing its grid column at 320px panel width.
const COL_HEADER = {
  fontFamily: tokens.typography.fontMono,
  fontSize: tokens.typography.size.sm,
  color: tokens.color.text.muted,
  textTransform: 'uppercase',
  letterSpacing: tokens.typography.tracking.normal,
  whiteSpace: 'nowrap',
};

function InsetDivider({ side = 'bottom' }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        left: tokens.spacing[3],
        right: tokens.spacing[3],
        [side]: 0,
        height: '1px',
        background: tokens.color.border.subtle,
        pointerEvents: 'none',
      }}
    />
  );
}

function TabButton({ label, active, hasMenu, leadingStar }) {
  return (
    <button
      type="button"
      className="ex-btn-hover"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: tokens.spacing[1],
        padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.sm,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.normal,
        color: active ? tokens.color.text.primary : tokens.color.text.muted,
        fontWeight: active
          ? tokens.typography.weight.medium
          : tokens.typography.weight.regular,
        position: 'relative',
      }}
    >
      {leadingStar ? (
        <Star weight="regular" size={13} style={{ color: tokens.color.text.faint }} />
      ) : null}
      {label}
      {hasMenu ? <span style={{ color: tokens.color.text.faint }}>▾</span> : null}
      {active ? (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: tokens.spacing[2],
            right: tokens.spacing[2],
            bottom: 0,
            height: '1px',
            background: tokens.color.accent[300],
          }}
        />
      ) : null}
    </button>
  );
}

const fmtPrice = (n) => n.toFixed(3);

function PairRow({ row }) {
  const pos = row.chg >= 0;
  const changeColor = pos ? tokens.color.accent[200] : tokens.color.red[200];
  return (
    <motion.div
      variants={rowItem}
      className="ex-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 0.7fr',
        alignItems: 'center',
        height: tokens.spacing[8],             // 32px — comfortable row height
        padding: `0 ${tokens.spacing[4]}`,
        ...ROW_TEXT,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: tokens.spacing[1] }}>
        <Star weight="regular" size={11} style={{ color: tokens.color.text.faint, flexShrink: 0 }} />
        <span style={{ color: tokens.color.text.primary }}>{row.sym}</span>
        <span style={{ color: tokens.color.text.faint }}>/BTC</span>
        {row.lev ? (
          <span
            style={{
              padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
              background: tokens.color.orange.alpha,
              color: tokens.color.orange[200],
              fontSize: tokens.typography.size.xs,
              letterSpacing: tokens.typography.tracking.wide,
              borderRadius: tokens.radius.sm,
              flexShrink: 0,
            }}
          >
            {row.lev}
          </span>
        ) : null}
      </span>
      <span style={{ color: tokens.color.text.primary, textAlign: 'right' }}>
        {fmtPrice(row.last)}
      </span>
      <span style={{ color: changeColor, textAlign: 'right' }}>
        {pos ? '+' : ''}{row.chg.toFixed(2)}%
      </span>
    </motion.div>
  );
}

function TradeRow({ row }) {
  const pos = row.side === 'buy';
  const priceColor = pos ? tokens.color.accent[200] : tokens.color.red[200];
  return (
    <div
      className="ex-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'center',
        height: tokens.spacing[6],             // 24px
        padding: `0 ${tokens.spacing[4]}`,
        ...ROW_TEXT,
      }}
    >
      <span style={{ color: priceColor }}>{row.p.toFixed(2)}</span>
      <span style={{ color: tokens.color.text.secondary, textAlign: 'right' }}>
        {row.a.toFixed(3)}
      </span>
      <span style={{ color: tokens.color.text.muted, textAlign: 'right' }}>{row.t}</span>
    </div>
  );
}

function ColumnHeaders({ template, labels }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: template,
        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
        ...COL_HEADER,
      }}
    >
      {labels.map((l, i) => (
        <span key={l} style={{ textAlign: i === 0 ? 'left' : 'right' }}>
          {l}
          {i > 0 ? (
            <span style={{ marginLeft: tokens.spacing[1], color: tokens.color.text.faint }}>↕</span>
          ) : null}
        </span>
      ))}
      <InsetDivider />
    </div>
  );
}

export function PairList() {
  return (
    <div
      style={{
        position: 'relative',
        background: tokens.color.surface.overlay,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <CornerMarkers />

      {/* Tab strip */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: `${tokens.spacing[3]} ${tokens.spacing[2]} 0`,
          overflowX: 'auto',
        }}
      >
        <TabButton label="" leadingStar />
        <TabButton label="Margin" />
        <TabButton label="BNB" />
        <TabButton label="BTC" active />
        <Dropdown variant="tab" label="ALTS"  items={ALTS_MENU}  iconSize={9} />
        <Dropdown variant="tab" label="FIAT"  items={FIAT_MENU}  iconSize={9} />
        <Dropdown variant="tab" label="Zones" items={ZONES_MENU} iconSize={9} align="right" />
        <InsetDivider />
      </div>

      {/* Search + mode toggle */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[3],
          padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        }}
      >
        <InsetDivider />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
            flex: 1,
            padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
            background: tokens.color.surface.hover,
            border: `${tokens.border.thin} ${tokens.color.border.base}`,
          }}
        >
          <MagnifyingGlass weight="regular" size={13} style={{ color: tokens.color.text.faint, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.sm,
              color: tokens.color.text.primary,
              letterSpacing: tokens.typography.tracking.wide,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[3],
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            letterSpacing: tokens.typography.tracking.wider,
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: tokens.spacing[1], color: tokens.color.accent[200] }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: tokens.color.accent[300] }} />
            Change
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: tokens.spacing[1], color: tokens.color.text.muted }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', border: `${tokens.border.thin} ${tokens.color.border.bright}` }} />
            Volume
          </span>
        </div>
      </div>

      {/* Pair table */}
      <ColumnHeaders template="1.4fr 1fr 0.7fr" labels={['Pair', 'Price', 'Change']} />
      <motion.div
        variants={rowContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        style={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}
      >
        {pairs.map((row) => (
          <PairRow key={row.sym} row={row} />
        ))}
      </motion.div>

      {/* Market Trades */}
      <div style={{ borderTop: `${tokens.border.thin} ${tokens.color.border.subtle}` }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[5],
            padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
          }}
        >
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.md,       // 14px — section label
              fontWeight: tokens.typography.weight.semibold,
              color: tokens.color.text.primary,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.wider,
              borderBottom: `1px solid ${tokens.color.accent[300]}`,
              paddingBottom: tokens.spacing[1],
            }}
          >
            Market Trades
          </span>
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.md,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.wider,
            }}
          >
            My Trades
          </span>
        </div>

        <ColumnHeaders template="1fr 1fr 1fr" labels={['Price (USDT)', 'Amount (SOL)', 'Time']} />

        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {trades.map((row, i) => (
            <TradeRow key={`${row.t}-${i}`} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}
