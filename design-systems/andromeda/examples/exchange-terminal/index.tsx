// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// EXCHANGE TERMINAL
// ============================================================

'use client';

import {
  Download,
  Gear,
  GridFour,
  PlayCircle,
  DotsThree,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Avatar } from '../../components/Avatar';
import { IconButton } from '../../components/IconButton';
import { useCascadeProps } from '../../components/lib/motion';
import { AndromedaIcon } from '../../AndromedaIcon';
import { OrderBook } from './OrderBook';
import { ChartPanel } from './ChartPanel';
import { PairList } from './PairList';
import { Dropdown } from './Dropdown';
import { pair } from './data';

// ─── Global hover stylesheet ──────────────────────────────────────────
// Inline-style React doesn't support :hover, so we inject one stylesheet
// for the whole terminal. Class names are short to avoid noisy DOM.
function HoverStyles() {
  return (
    <style>{`
      .ex-btn-hover { transition: background 140ms ease, color 140ms ease, border-color 140ms ease; }
      .ex-btn-hover:hover { color: ${tokens.color.text.primary} !important; }

      .ex-icon-btn { transition: background 140ms ease, color 140ms ease, border-color 140ms ease; }
      .ex-icon-btn:hover { background: ${tokens.color.surface.active} !important; color: ${tokens.color.accent[200]} !important; border-color: ${tokens.color.border.bright} !important; }

      .ex-row { transition: background 100ms ease; cursor: pointer; }
      .ex-row:hover { background: ${tokens.color.surface.hover}; }

      .ex-menu-item-hover { transition: background 100ms ease, color 100ms ease; }
      .ex-menu-item-hover:hover { background: ${tokens.color.surface.hover} !important; color: ${tokens.color.text.primary} !important; }

      .ex-link { transition: color 140ms ease; }
      .ex-link:hover { color: ${tokens.color.accent[300]} !important; }
    `}</style>
  );
}

// ─── TopBar ─────────────────────────────────────────────────────────────────
const NAV_MENUS = {
  'Buy Crypto':  ['GBP', 'USD', 'EUR', 'JPY', 'AUD'],
  'Trade':       ['Spot', 'Margin', 'Futures', 'P2P', 'Convert'],
  'Derivatives': ['USDⓈ-M Futures', 'COIN-M Futures', 'Options', 'Leveraged Tokens'],
  'Finance':     ['Earn', 'Pool', 'Loans', 'BNB Vault', 'Liquidity Farming'],
};

function TopBar() {
  return (
    <header
      style={{
        position: 'relative',
        height: tokens.layout.headerHeight,    // 60px
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[4],
        padding: `0 ${tokens.spacing[6]}`,
        background: tokens.color.surface.raised,
      }}
    >
      <CornerMarkers />

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2], flexShrink: 0 }}>
        <AndromedaIcon size={22} />
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.lg,
            fontWeight: tokens.typography.weight.bold,
            color: tokens.color.text.primary,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}
        >
          Andromeda
        </span>
      </div>

      {/* App switcher */}
      <IconButton aria-label="App grid" variant="outline" size="md" icon={GridFour} />

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1] }}>
        <Dropdown
          variant="nav"
          label="Buy Crypto"
          items={NAV_MENUS['Buy Crypto']}
          leadingBadge={
            <span
              style={{
                padding: `0 ${tokens.spacing[1]}`,
                background: tokens.color.accent.alpha,
                color: tokens.color.accent[200],
                fontSize: tokens.typography.size.xs,
                borderRadius: tokens.radius.sm,
              }}
            >
              GBP
            </span>
          }
        />
        <button
          type="button"
          className="ex-btn-hover"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            fontWeight: tokens.typography.weight.medium,
            color: tokens.color.text.primary,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}
        >
          Markets
        </button>
        <Dropdown variant="nav" label="Trade"       items={NAV_MENUS['Trade']} />
        <Dropdown variant="nav" label="Derivatives" items={NAV_MENUS['Derivatives']} />
        <Dropdown variant="nav" label="Finance"     items={NAV_MENUS['Finance']} />
      </nav>

      <div style={{ flex: 1 }} />

      {/* Right utilities — IconButton aligns the entire cluster on a 32px baseline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
        <IconButton aria-label="Downloads" variant="outline" icon={Download} />
        {/* Region/currency — labeled chunk that still matches the 32px row */}
        <button
          type="button"
          className="ex-icon-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: tokens.spacing[8],
            padding: `0 ${tokens.spacing[3]}`,
            background: tokens.color.surface.hover,
            border: `${tokens.border.thin} ${tokens.color.border.base}`,
            cursor: 'pointer',
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            color: tokens.color.text.primary,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
            flexShrink: 0,
          }}
        >
          EN/USD
        </button>
        <IconButton aria-label="Settings"  variant="outline" icon={Gear} />
        <Avatar name="OPS-01" size="sm" status="online" />
      </div>
    </header>
  );
}

// ─── PairHeader ────────────────────────────────────────────────────────────
const fmt = (n, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// Demoted stat — small label above small value. Used only for the
// secondary metrics (24h high/low/volumes) which sit at tier-2 of the
// PairHeader hierarchy below the hero price.
function Stat({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1], minWidth: 0 }}>
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
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.primary,
          letterSpacing: tokens.typography.tracking.wide,
          fontWeight: tokens.typography.weight.medium,
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
    </div>
  );
}

// 1px tall vertical rule used to chunk the PairHeader into legible groups.
function VRule() {
  return (
    <span
      aria-hidden
      style={{
        width: '1px',
        height: tokens.spacing[8],
        background: tokens.color.border.subtle,
        flexShrink: 0,
      }}
    />
  );
}

function PairHeader() {
  const pos = pair.changePct24h >= 0;
  const changeColor = pos ? tokens.color.accent[200] : tokens.color.red[200];

  return (
    <div
      style={{
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[6],
        padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
        background: tokens.color.surface.raised,
      }}
    >
      <CornerMarkers />

      {/* Pair identity */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xl,
            fontWeight: tokens.typography.weight.bold,
            color: tokens.color.text.primary,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}
        >
          {pair.base}/{pair.quote}
          <span
            style={{
              padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
              background: tokens.color.orange.alpha,
              color: tokens.color.orange[200],
              fontSize: tokens.typography.size.xs,
              fontWeight: tokens.typography.weight.medium,
              letterSpacing: tokens.typography.tracking.wide,
              borderRadius: tokens.radius.sm,
            }}
          >
            {pair.leverage}
          </span>
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: tokens.spacing[1],
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}
        >
          <DotsThree weight="bold" size={10} />
          {pair.longName}
        </span>
      </div>

      <VRule />

      {/* Tier 1 — hero price block. Spot is 3xl, USD reference is sm muted,
          24h change sits inline under the spot so the eye reads price → delta
          without scanning across to a separate Stat tile. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size['3xl'],
            fontWeight: tokens.typography.weight.bold,
            color: changeColor,
            letterSpacing: tokens.typography.tracking.tight,
            lineHeight: tokens.typography.lineHeight.tight,
          }}
        >
          {fmt(pair.price)}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: tokens.spacing[2],
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            letterSpacing: tokens.typography.tracking.wide,
          }}
        >
          <span style={{ color: tokens.color.text.muted }}>${fmt(pair.priceUsd)}</span>
          <span style={{ color: changeColor, fontWeight: tokens.typography.weight.medium }}>
            {pos ? '+' : ''}{fmt(pair.change24h)}
          </span>
          <span style={{ color: changeColor, fontWeight: tokens.typography.weight.medium }}>
            {pos ? '+' : ''}{pair.changePct24h.toFixed(2)}%
          </span>
        </span>
      </div>

      <VRule />

      {/* Tier 2 — secondary 24h range. Tighter gap groups them as one cluster. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[5] }}>
        <Stat label="24h High" value={fmt(pair.high24h)} />
        <Stat label="24h Low"  value={fmt(pair.low24h)} />
      </div>

      <VRule />

      {/* Tier 2 — volumes, also clustered. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[5] }}>
        <Stat label={`24h Vol (${pair.base})`}  value={fmt(pair.volBase24h)} />
        <Stat label={`24h Vol (${pair.quote})`} value={fmt(pair.volQuote24h)} />
      </div>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        className="ex-link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.accent[200],
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wider,
        }}
      >
        <PlayCircle weight="regular" size={15} />
        Spot Tutorial
      </button>
    </div>
  );
}

// ─── OrderTabs ─────────────────────────────────────────────────────────────
const ORDER_TABS = ['Spot', 'Cross 3x', 'Isolated 10x'];

function OrderTabs() {
  return (
    <div
      style={{
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[6],
        padding: `0 ${tokens.spacing[6]}`,
        height: tokens.spacing[10],            // 40px
        background: tokens.color.surface.raised,
      }}
    >
      <CornerMarkers />
      {ORDER_TABS.map((label, i) => {
        const active = i === 0;
        return (
          <button
            key={label}
            type="button"
            className="ex-btn-hover"
            style={{
              position: 'relative',
              height: '100%',
              padding: `0`,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.sm,
              fontWeight: active
                ? tokens.typography.weight.semibold
                : tokens.typography.weight.regular,
              color: active ? tokens.color.text.primary : tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.wider,
            }}
          >
            {label}
            {active ? (
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '2px',
                  background: tokens.color.accent[300],
                }}
              />
            ) : null}
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.faint,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
        }}
      >
        /// Andromeda Exchange
      </span>
    </div>
  );
}

// ─── Composition ───────────────────────────────────────────────────────────
export default function ExchangeTerminal() {
  // Six cascade slots, top-to-bottom: TopBar, PairHeader, then the three
  // main columns (OrderBook → ChartPanel → PairList — staggers
  // left-to-right within the same row), then OrderTabs at the bottom.
  const topBarMotion       = useCascadeProps(0);
  const pairHeaderMotion   = useCascadeProps(1);
  const orderBookMotion    = useCascadeProps(2);
  const chartPanelMotion   = useCascadeProps(3);
  const pairListMotion     = useCascadeProps(4);
  const orderTabsMotion    = useCascadeProps(5);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        background: tokens.color.surface.base,
        fontFamily: tokens.typography.fontSans,
        color: tokens.color.text.primary,
        overflow: 'hidden',
        gap: '12px',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <HoverStyles />
      <motion.div {...topBarMotion} style={{ flexShrink: 0 }}>
        <TopBar />
      </motion.div>
      <motion.div {...pairHeaderMotion} style={{ flexShrink: 0 }}>
        <PairHeader />
      </motion.div>

      {/* Main 3-column layout — flex gives each wrapper a definite height
          so inner panels can use flex:1 reliably (grid auto-rows don't). */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          gap: '12px',
          minHeight: 0,
        }}
      >
        <motion.div {...orderBookMotion} style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <OrderBook />
        </motion.div>
        <motion.div {...chartPanelMotion} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ChartPanel />
        </motion.div>
        <motion.div {...pairListMotion} style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <PairList />
        </motion.div>
      </main>

      <motion.div {...orderTabsMotion} style={{ flexShrink: 0 }}>
        <OrderTabs />
      </motion.div>
    </div>
  );
}
