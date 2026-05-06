// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SERVICE ORDER · RiskGrid
// 7 × 5 grid of skewed parallelogram cells that reads as a
// level-meter for the risk value. Cells fill from the bottom
// upward in a widening pyramid; three accent stops give each
// cell depth — accent-300 at the wave front, accent-500 at the
// base. Empty cells are surface.overlay.
//
// The skewX(-12deg) ties it to Andromeda's ProgressBar motif.
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { tokens } from '../../tokens';

const COLS     = 7;
const ROWS     = 5;
const CELL     = 22;   // px per side (before skew)
const GAP      = 3;    // px between cells

// intensity: 0 = empty, 1 = dim (accent-500), 2 = mid (accent-400), 3 = bright (accent-300)
// Shape represents exactly 60% fill: 3 + 5 + 6 + 7 = 21 / 35 cells.
// Bright cells cluster at the wave front (topmost filled row).
const PATTERN_60 = [
  [0, 0, 0, 0, 0, 0, 0],  // row 0 — empty
  [0, 0, 2, 3, 2, 0, 0],  // row 1 — 3 cells  (wave front)
  [0, 1, 2, 3, 3, 2, 0],  // row 2 — 5 cells
  [1, 2, 3, 3, 2, 2, 0],  // row 3 — 6 cells
  [1, 1, 2, 2, 2, 1, 1],  // row 4 — 7 cells  (base)
];

const INTENSITY_COLOR = {
  0: { bg: tokens.color.surface.overlay,  border: tokens.color.border.subtle  },
  1: { bg: tokens.color.accent[500],      border: tokens.color.accent[400]    },
  2: { bg: tokens.color.accent[400],      border: tokens.color.accent[300]    },
  3: { bg: tokens.color.accent[300],      border: tokens.color.accent[200]    },
};

export function RiskGrid() {
  // Start all cells empty; after mount stagger them filled bottom-row first.
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
        gridTemplateRows:    `repeat(${ROWS}, ${CELL}px)`,
        gap: `${GAP}px`,
        flexShrink: 0,
      }}
    >
      {PATTERN_60.map((row, ri) =>
        row.map((intensity, ci) => {
          const isEmpty = intensity === 0;
          // Bottom rows fill first: row 4 → 0ms, row 3 → 80ms, row 2 → 160ms …
          // Add a small per-column nudge so cells cascade left-to-right within each row.
          const delay = filled && !isEmpty
            ? (ROWS - 1 - ri) * 80 + ci * 18
            : 0;

          const { bg, border } = INTENSITY_COLOR[filled && !isEmpty ? intensity : 0];

          return (
            <div
              key={`${ri}-${ci}`}
              style={{
                background:      bg,
                border:          `1px solid ${border}`,
                transition:      'background 400ms ease, border-color 400ms ease',
                transitionDelay: `${delay}ms`,
              }}
            />
          );
        })
      )}
    </div>
  );
}
