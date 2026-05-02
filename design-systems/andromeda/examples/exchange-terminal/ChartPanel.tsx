// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// EXCHANGE TERMINAL · ChartPanel
// Custom SVG candlestick chart + MA polylines + volume strip below.
// ============================================================

'use client';

import { Eye, EyeSlash, X, ArrowsOutSimple, ListBullets } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { IconButton } from '../../components/IconButton';
import { Dropdown } from './Dropdown';
import { candles, last, maSeries } from './data';

const TIME_MENU = ['1s', '5s', '15s', '30s'];
const M_MENU    = ['1m', '3m', '5m', '15m', '30m'];
const H_MENU    = ['1H', '2H', '4H', '6H', '12H'];

// ── Layout constants ──────────────────────────────────────────────
const PRICE_PAD    = 0.04;   // extra headroom above/below price range
const Y_AXIS_W     = 72;     // px for price-label gutter (right)
const X_AXIS_H     = 24;     // px for date-label gutter (bottom)

// ── Derived ranges ────────────────────────────────────────────────
const N        = candles.length;
const priceMin = Math.min(...candles.map((c) => c.l));
const priceMax = Math.max(...candles.map((c) => c.h));
const priceRange = priceMax - priceMin;
const yMin     = priceMin - priceRange * PRICE_PAD;
const yMax     = priceMax + priceRange * PRICE_PAD;
const yRange   = yMax - yMin;
const volMax   = Math.max(...candles.map((c) => c.v));

// Pick a "nice" step that yields ~6 labels across the visible price range,
// so this chart works for any asset (BTC tens-of-thousands, SOL tens-of-dollars,
// memecoins fractions-of-a-cent). Steps are powers of 10 × {1, 2, 5}.
const yLabels = (() => {
  const TARGET_TICKS = 6;
  const rough = (yMax - yMin) / TARGET_TICKS;
  const mag   = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm  = rough / mag;
  const nice  = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  const step  = nice * mag;
  const start = Math.ceil(yMin / step) * step;
  const out   = [];
  for (let v = start; v <= yMax; v += step) out.push(v);
  return out;
})();

const cx = (i) => i + 0.5;
const cy = (p) => yMax - p;

const MA_COLORS = {
  5:  tokens.color.accent[200],
  10: tokens.color.orange[200],
  20: tokens.color.red[200],
};

function maPath(series) {
  let started = false;
  let d = '';
  for (let i = 0; i < N; i++) {
    const v = series[i];
    if (v == null) continue;
    d += `${started ? 'L' : 'M'}${cx(i)} ${cy(v)} `;
    started = true;
  }
  return d.trim();
}

const fmtNum = (n, d = 2) =>
  n == null
    ? '—'
    : n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ── Chart header ─────────────────────────────────────────────────
function TimeframeChip({ label, active }) {
  return (
    <button
      type="button"
      className="ex-btn-hover"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: tokens.spacing[1],
        padding: `${tokens.spacing[2]} ${tokens.spacing[2]}`,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.sm,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.wider,
        color: active ? tokens.color.accent[200] : tokens.color.text.secondary,
      }}
    >
      {label}
    </button>
  );
}

function ViewTab({ label, active }) {
  return (
    <button
      type="button"
      className="ex-btn-hover"
      style={{
        position: 'relative',
        padding: `${tokens.spacing[2]} 0`,
        marginRight: tokens.spacing[4],
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.sm,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.wider,
        color: active ? tokens.color.text.primary : tokens.color.text.muted,
        fontWeight: active ? tokens.typography.weight.medium : tokens.typography.weight.regular,
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
            height: '1px',
            background: tokens.color.accent[300],
          }}
        />
      ) : null}
    </button>
  );
}

function ChartHeader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[1],
          padding: `0 ${tokens.spacing[3]}`,
          borderRight: `${tokens.border.thin} ${tokens.color.border.subtle}`,
        }}
      >
        <Dropdown variant="chip" label="Time" items={TIME_MENU} />
        <Dropdown variant="chip" label="m"    items={M_MENU} />
        <Dropdown variant="chip" label="H"    items={H_MENU} />
        <TimeframeChip label="1D" active />
        <TimeframeChip label="1W" />
        <TimeframeChip label="1M" />
        <IconButton aria-label="More indicators" variant="ghost" size="sm" icon={ListBullets} />
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', paddingRight: tokens.spacing[3] }}>
        <ViewTab label="Original" active />
        <ViewTab label="Trading View" />
        <ViewTab label="Depth" />
        <IconButton aria-label="Fullscreen" variant="ghost" size="sm" icon={ArrowsOutSimple} />
      </div>
    </div>
  );
}

// ── OHLC + MA legend ─────────────────────────────────────────────
function LegendKV({ label, value, valueColor }) {
  return (
    <span style={{ display: 'inline-flex', gap: tokens.spacing[1], alignItems: 'baseline' }}>
      <span style={{ color: tokens.color.text.muted }}>{label}</span>
      <span style={{ color: valueColor ?? tokens.color.text.primary }}>{value}</span>
    </span>
  );
}

function LegendMA({ label, color, value }) {
  return (
    <span style={{ display: 'inline-flex', gap: tokens.spacing[1], alignItems: 'baseline' }}>
      <span style={{ color }}>{label}:</span>
      <span style={{ color }}>{value}</span>
    </span>
  );
}

// Compact 1px tall vertical rule that visually chunks the legend strip
// into its three distinct semantic groups (OHLC | derived | moving averages).
function LegendDivider() {
  return (
    <span
      aria-hidden
      style={{
        width: '1px',
        height: tokens.spacing[3],
        background: tokens.color.border.subtle,
      }}
    />
  );
}

function LegendStrip() {
  const change    = ((last.c - last.o) / last.o) * 100;
  const amplitude = ((last.h - last.l) / last.o) * 100;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        // Slightly tighter horizontal gap so the dividers sit naturally
        // between groups rather than getting lost in white space.
        gap: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.sm,
        letterSpacing: tokens.typography.tracking.wide,
        borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
      }}
    >
      <span style={{ color: tokens.color.text.muted }}>2026/05/01</span>

      <LegendDivider />

      {/* OHLC group */}
      <LegendKV label="O" value={fmtNum(last.o)} />
      <LegendKV label="H" value={fmtNum(last.h)} />
      <LegendKV label="L" value={fmtNum(last.l)} />
      <LegendKV label="C" value={fmtNum(last.c)} />

      <LegendDivider />

      {/* Derived stats group */}
      <LegendKV
        label="CHANGE"
        value={`${change >= 0 ? '+' : ''}${fmtNum(change, 2)}%`}
        valueColor={change >= 0 ? tokens.color.accent[200] : tokens.color.red[200]}
      />
      <LegendKV
        label="AMPLITUDE"
        value={`${fmtNum(amplitude, 2)}%`}
        valueColor={tokens.color.orange[200]}
      />

      <span style={{ flex: 1 }} />

      {/* Moving averages group */}
      <LegendMA label="MA(5)"  color={MA_COLORS[5]}  value={fmtNum(maSeries[5][N - 1])} />
      <LegendMA label="MA(10)" color={MA_COLORS[10]} value={fmtNum(maSeries[10][N - 1])} />
      <LegendMA label="MA(20)" color={MA_COLORS[20]} value={fmtNum(maSeries[20][N - 1])} />

      <LegendDivider />

      <span style={{ display: 'flex', gap: tokens.spacing[2], color: tokens.color.text.faint }}>
        <Eye weight="regular" size={13} />
        <EyeSlash weight="regular" size={13} />
        <X weight="regular" size={13} />
      </span>
    </div>
  );
}

// ── SVG renderers ─────────────────────────────────────────────────
function CandlesSvg() {
  return (
    <svg
      viewBox={`0 0 ${N} ${yRange}`}
      preserveAspectRatio="none"
      style={{ position: 'absolute', top: 0, left: 0, width: `calc(100% - ${Y_AXIS_W}px)`, height: '100%', display: 'block' }}
    >
      {yLabels.map((p) => (
        <line
          key={`gy-${p}`}
          x1={0} x2={N} y1={cy(p)} y2={cy(p)}
          stroke={tokens.color.border.subtle}
          strokeWidth={1}
          strokeDasharray="2 4"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {candles.map((c, i) => {
        const up      = c.c >= c.o;
        const color   = up ? tokens.color.accent[300] : tokens.color.red[300];
        const bodyTop = cy(Math.max(c.o, c.c));
        const bodyBot = cy(Math.min(c.o, c.c));
        const bodyH   = Math.max(bodyBot - bodyTop, yRange * 0.0006);
        const x       = cx(i);
        return (
          <g key={`k-${i}`}>
            <line
              x1={x} x2={x} y1={cy(c.h)} y2={cy(c.l)}
              stroke={color}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <rect x={x - 0.38} width={0.76} y={bodyTop} height={bodyH} fill={color} />
          </g>
        );
      })}

      {[5, 10, 20].map((p) => (
        <path
          key={`ma-${p}`}
          d={maPath(maSeries[p])}
          fill="none"
          stroke={MA_COLORS[p]}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      <line
        x1={0} x2={N} y1={cy(last.c)} y2={cy(last.c)}
        stroke={tokens.color.accent[300]}
        strokeWidth={1}
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function VolumeSvg() {
  return (
    <svg
      viewBox={`0 0 ${N} ${volMax}`}
      preserveAspectRatio="none"
      style={{ position: 'absolute', top: 0, left: 0, width: `calc(100% - ${Y_AXIS_W}px)`, height: `calc(100% - ${X_AXIS_H}px)`, display: 'block' }}
    >
      {candles.map((c, i) => {
        const up    = c.c >= c.o;
        const fill  = up ? tokens.color.accent[300] : tokens.color.red[300];
        const tint  = up ? tokens.color.accent.alpha : tokens.color.red.alpha;
        return (
          <rect
            key={`v-${i}`}
            x={cx(i) - 0.32} width={0.64}
            y={volMax - c.v} height={c.v}
            fill={tint}
            stroke={fill}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

// ── HTML overlays for axis labels ─────────────────────────────────
const LABEL_STYLE = {
  fontFamily: tokens.typography.fontMono,
  fontSize: tokens.typography.size.sm,
  color: tokens.color.text.muted,
  letterSpacing: tokens.typography.tracking.wide,
};

function YAxisLabels() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: `${Y_AXIS_W}px`,
        pointerEvents: 'none',
      }}
    >
      {yLabels.map((p) => {
        const top = ((yMax - p) / yRange) * 100;
        return (
          <span
            key={`yl-${p}`}
            style={{
              position: 'absolute',
              top: `${top}%`,
              right: tokens.spacing[2],
              transform: 'translateY(-50%)',
              ...LABEL_STYLE,
            }}
          >
            {p.toLocaleString('en-US')}
          </span>
        );
      })}

      {/* Last-price flag */}
      <span
        style={{
          position: 'absolute',
          top: `${((yMax - last.c) / yRange) * 100}%`,
          right: 0,
          transform: 'translateY(-50%)',
          padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
          background: tokens.color.accent[400],
          color: tokens.color.text.primary,
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          letterSpacing: tokens.typography.tracking.wide,
          fontWeight: tokens.typography.weight.semibold,
        }}
      >
        {last.c.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  );
}

function XAxisLabels() {
  const tickIdxs = [0, Math.floor(N / 2), N - 1];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: `${Y_AXIS_W}px`,
        bottom: 0,
        height: `${X_AXIS_H}px`,
        pointerEvents: 'none',
      }}
    >
      {tickIdxs.map((i) => (
        <span
          key={`xl-${i}`}
          style={{
            position: 'absolute',
            left: `${((i + 0.5) / N) * 100}%`,
            top: `${tokens.spacing[1]}`,
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            ...LABEL_STYLE,
          }}
        >
          {candles[i].t}
        </span>
      ))}
    </div>
  );
}

// ── Volume legend ─────────────────────────────────────────────────
function VolumeLegend() {
  const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(3)}K` : `${n.toFixed(0)}`);
  return (
    <div
      style={{
        position: 'absolute',
        top: tokens.spacing[2],
        left: tokens.spacing[4],
        display: 'flex',
        gap: tokens.spacing[3],
        alignItems: 'center',
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.sm,
        letterSpacing: tokens.typography.tracking.wide,
      }}
    >
      <span style={{ color: tokens.color.text.muted }}>VOL</span>
      <span style={{ color: tokens.color.accent[200] }}>{fmt(last.v)}</span>
      <span style={{ display: 'flex', gap: tokens.spacing[2], color: tokens.color.text.faint }}>
        <Eye weight="regular" size={13} />
        <EyeSlash weight="regular" size={13} />
        <X weight="regular" size={13} />
      </span>
    </div>
  );
}

// ── Composition ───────────────────────────────────────────────────
export function ChartPanel() {
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
      <ChartHeader />
      <LegendStrip />

      <div
        style={{
          position: 'relative',
          flex: '1 1 0',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Candle area — SVG is absolutely placed so it fills regardless of
            whether height:100% resolves against a flex-basis:0 item. */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 0',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <CandlesSvg />
          <YAxisLabels />
        </div>

        <div style={{ flexShrink: 0, height: '1px', background: tokens.color.border.subtle }} />

        {/* Volume area — fixed height so it stays compact */}
        <div
          style={{
            position: 'relative',
            flex: '0 0 80px',
            overflow: 'hidden',
          }}
        >
          <VolumeLegend />
          <VolumeSvg />
          <XAxisLabels />

          {/* Vol axis labels */}
          <span
            style={{
              position: 'absolute',
              top: tokens.spacing[2],
              right: tokens.spacing[2],
              ...LABEL_STYLE,
            }}
          >
            {(volMax / 1000).toFixed(0)}K
          </span>
          <span
            style={{
              position: 'absolute',
              bottom: `${X_AXIS_H}px`,
              right: tokens.spacing[2],
              transform: 'translateY(50%)',
              ...LABEL_STYLE,
            }}
          >
            0
          </span>
        </div>
      </div>
    </div>
  );
}
