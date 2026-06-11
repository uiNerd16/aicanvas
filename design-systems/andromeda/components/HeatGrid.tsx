// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: HeatGrid
// A 2-D matrix fill gauge — the cousin of ProgressBar. A grid of
// cells fills from the bottom-centre outward in a widening pyramid
// as `value` (0–100) rises. Three accent stops give the wave front
// depth: bright (accent-300) at the frontier, dim (accent-500) at
// the base. Empty cells are surface.overlay.
//
// Use it when a level reads better as a heat-matrix than a bar —
// risk meters, capacity gauges, saturation. The fill IS a
// measurement, so accent is allowed (the rules.md "colour is for
// meaning" exception, same as ProgressBar / charts).
//
// The fill animation is gated on `useInView` so a HeatGrid below
// the fold plays when scrolled into view (consistent with
// ProgressBar / StatTile), and it honours prefers-reduced-motion.
// ============================================================

'use client';

import { forwardRef, useMemo, useRef } from 'react';
import { useInView } from 'framer-motion';
import { tokens } from '../tokens';
import { andromedaVars } from './lib/utils';
import { useReducedMotion } from './lib/motion';

// intensity → fill: 0 = empty, 1 = dim (base), 2 = mid, 3 = bright (frontier)
const INTENSITY_COLOR = {
  0: { bg: tokens.color.surface.overlay, border: tokens.color.border.subtle },
  1: { bg: tokens.color.accent[500],     border: tokens.color.accent[400]   },
  2: { bg: tokens.color.accent[400],     border: tokens.color.accent[300]   },
  3: { bg: tokens.color.accent[300],     border: tokens.color.accent[200]   },
};

const msNum = (v) => parseInt(v, 10); // "120ms" → 120

// Compute the fill map for a value. Cells fill bottom-centre first in a
// widening pyramid; intensity ramps dim (base, low rank) → bright (frontier,
// high rank). Returns { "r-c": intensity } for every cell.
function buildFillMap(value, cols, rows) {
  const center = (cols - 1) / 2;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // rank: lower fills earlier. Bottom rows first (vertical term), centre
      // columns first (horizontal term) → a triangular, rising wave front.
      const rank = (rows - 1 - r) + Math.abs(c - center);
      cells.push({ r, c, rank });
    }
  }
  // Deterministic order: rank, then row, then column.
  const order = [...cells].sort((a, b) => a.rank - b.rank || a.r - b.r || a.c - b.c);

  const clamped = Math.max(0, Math.min(100, value));
  const target = Math.round((clamped / 100) * cols * rows);

  const filled = order.slice(0, target);
  const ranks = filled.map((c) => c.rank);
  const minRank = ranks.length ? Math.min(...ranks) : 0;
  const maxRank = ranks.length ? Math.max(...ranks) : 0;
  const span = maxRank - minRank || 1;

  const map = {};
  order.forEach((cell, i) => {
    let intensity = 0;
    if (i < target) {
      // Closer to the frontier (higher rank) → brighter.
      const frac = (cell.rank - minRank) / span;
      intensity = frac >= 0.66 ? 3 : frac >= 0.33 ? 2 : 1;
    }
    map[`${cell.r}-${cell.c}`] = intensity;
  });
  return map;
}

/**
 * @typedef {object} HeatGridProps
 * @property {number}  value              0–100 fill level (clamped).
 * @property {number}  [cols=7]
 * @property {number}  [rows=5]
 * @property {number}  [cellSize=22]      px per cell side.
 * @property {number}  [gap=3]            px between cells.
 * @property {boolean} [showValue=true]   Render the accent percentage readout beside the grid.
 * @property {string}  [unit='%']
 * @property {string}  [label]            Accessible name for the meter.
 * @property {string}  [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<HeatGridProps & React.HTMLAttributes<HTMLDivElement>>} */
export const HeatGrid = forwardRef(function HeatGrid(
  {
    value = 0,
    cols = 7,
    rows = 5,
    cellSize = 22,
    gap = 3,
    showValue = true,
    unit = '%',
    label,
    className,
    style,
    ...props
  },
  ref,
) {
  const innerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(innerRef, { once: true, margin: '-10% 0px' });
  // Reduced motion → render filled immediately; otherwise wait until on-screen.
  const revealed = reducedMotion ? true : inView;

  const fillMap = useMemo(() => buildFillMap(value, cols, rows), [value, cols, rows]);
  const clamped = Math.max(0, Math.min(100, value));
  const center = (cols - 1) / 2;

  // Cascade base-first, centre-out — token-driven tempo.
  const rowStaggerMs = msNum(tokens.motion.stagger.progressbar);
  const colStaggerMs = Math.round(rowStaggerMs * 0.18);

  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div
      ref={setRefs}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label ?? 'Fill level'}
      className={className}
      style={{
        ...andromedaVars(),
        display: 'inline-flex',
        alignItems: 'center',
        gap: tokens.spacing[6],
        ...style,
      }}
      {...props}
    >
      <div
        aria-hidden="true"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: `${gap}px`,
          flexShrink: 0,
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const intensity = fillMap[`${r}-${c}`] ?? 0;
            const shown = revealed ? intensity : 0;
            const { bg, border } = INTENSITY_COLOR[shown];
            const delay =
              !reducedMotion && revealed && intensity > 0
                ? (rows - 1 - r) * rowStaggerMs + Math.abs(c - center) * colStaggerMs
                : 0;
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  background: bg,
                  border: `${tokens.border.thin} ${border}`,
                  transition: reducedMotion
                    ? undefined
                    : `background ${tokens.motion.duration.cascade} ${tokens.motion.easing.out}, border-color ${tokens.motion.duration.cascade} ${tokens.motion.easing.out}`,
                  transitionDelay: `${delay}ms`,
                }}
              />
            );
          }),
        )}
      </div>

      {showValue ? (
        <span
          aria-hidden="true"
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size['3xl'],
            fontWeight: tokens.typography.weight.medium,
            letterSpacing: tokens.typography.tracking.tight,
            color: tokens.color.accent[300],
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.round(clamped)}
          {unit}
        </span>
      ) : null}
    </div>
  );
});
