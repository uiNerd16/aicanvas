// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: ProgressBar
// shadcn/ui-aligned API: variant, forwardRef, ARIA progressbar.
// Variants: default | warning | fault
// Visual: a row of bars, each bar = 3 stacked squares. All bars
// are the same height. Filled bars glow in the variant colour.
// ============================================================

'use client';

import { forwardRef, useEffect, useState } from 'react';
import { cn, andromedaVars } from './lib/utils';

const BARS       = 30;  // number of columns
const SQUARES    = 1;   // squares per column
const SQUARE_W   = 6;   // width in px
const SQUARE_H   = 16;  // height in px
const GAP_INNER  = 2;   // gap between squares within a column
const GAP_COL    = 3;   // gap between columns

const variantConfig = {
  default: {
    activeColor:  'var(--andromeda-accent-dim)',
    activeGlow:   '0 0 5px var(--andromeda-accent-glow)',
    activeBorder: 'var(--andromeda-accent-dim)',
  },
  warning: {
    activeColor:  'var(--andromeda-warning-dim)',
    activeGlow:   '0 0 5px var(--andromeda-warning-ring)',
    activeBorder: 'var(--andromeda-warning-dim)',
  },
  fault: {
    activeColor:  'var(--andromeda-fault-dim)',
    activeGlow:   '0 0 5px var(--andromeda-fault-ring)',
    activeBorder: 'var(--andromeda-fault-dim)',
  },
};

const labelClass = cn(
  '[font-family:var(--andromeda-font-mono)]',
  'text-[length:var(--andromeda-text-xs)]',
  'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
  'text-[color:var(--andromeda-text-secondary)]',
);

const valueClass = cn(
  '[font-family:var(--andromeda-font-mono)]',
  'text-[length:var(--andromeda-text-xs)]',
  'font-[number:var(--andromeda-weight-medium)]',
  'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
  'text-[color:var(--andromeda-text-primary)]',
);

/**
 * @typedef {object} ProgressBarProps
 * @property {string} [label]
 * @property {number} value 0–100; clamped internally.
 * @property {'default'|'warning'|'fault'} [variant='default']
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<ProgressBarProps & React.HTMLAttributes<HTMLDivElement>>} */
export const ProgressBar = forwardRef(function ProgressBar(
  { className, label, value, variant = 'default', style, ...props },
  ref,
) {
  const clamped     = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const activeCount = Math.round((clamped / 100) * BARS);
  const cfg         = variantConfig[variant] ?? variantConfig.default;

  // Render-with-zero-then-set so the first paint shows an empty track,
  // and per-bar transition-delay below makes them light up left→right.
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplayed(activeCount));
    return () => cancelAnimationFrame(id);
  }, [activeCount]);

  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-[var(--andromeda-2)]', className)}
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
      {label ? (
        <div className="flex items-baseline justify-between">
          <span className={labelClass}>{label}</span>
          <span className={valueClass}>{clamped}%</span>
        </div>
      ) : null}

      {/* Grid: BARS columns × SQUARES rows */}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={typeof label === 'string' ? label : undefined}
        style={{
          display: 'flex',
          gap: `${GAP_COL}px`,
        }}
      >
        {Array.from({ length: BARS }, (_, barIndex) => {
          const active = barIndex < displayed;

          return (
            <div
              key={barIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${GAP_INNER}px`,
              }}
            >
              {Array.from({ length: SQUARES }, (_, sqIndex) => (
                <div
                  key={sqIndex}
                  style={{
                    width:  `${SQUARE_W}px`,
                    height: `${SQUARE_H}px`,
                    flexShrink: 0,
                    background: active
                      ? cfg.activeColor
                      : 'var(--andromeda-surface-overlay)',
                    border: `1px solid ${active ? cfg.activeBorder : 'var(--andromeda-border-subtle)'}`,
                    boxShadow: active ? cfg.activeGlow : 'none',
                    transition: 'background 400ms ease, box-shadow 400ms ease, border-color 400ms ease',
                    // Stagger in groups of 3 — bars 0–2 fire together, then
                    // bars 3–5, etc. 120ms between groups for a slow cascade.
                    transitionDelay: `${Math.floor(barIndex / 3) * 120}ms`,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export { variantConfig };
