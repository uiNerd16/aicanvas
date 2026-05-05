// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: StatTile
// shadcn/ui-aligned API: forwardRef, className passthrough.
// Telemetry-style readout built on the Card primitive.
//
//  ┌── label (mono, text.secondary, tracking.wide) ── code ─┐
//  │  BIG NUMBER (sans, text.primary, size.4xl)   unit      │
//  ├────────────────────────────────────────────────────────┤
//  │  ▲/▼ delta (accent on +, fault on −)   delta label     │
//  └────────────────────────────────────────────────────────┘
//
// Animations:
//  - Value counts up from 0 on mount (easeOutExpo, 1.8s)
//  - Delta arrow flickers randomly (signal-loss glitch)
//  - Scanline sweeps down on mount (terminal boot)
// ============================================================

'use client';

import { forwardRef, useEffect, useRef, useState } from 'react'; // useRef kept for useCountUp's RAF tracking
import { cn, andromedaVars } from './lib/utils';
import { Card, CardContent } from './Card';

// ── Styles injected once ─────────────────────────────────────────────────────
function useStatTileStyles() {
  useEffect(() => {
    if (document.querySelector('#andromeda-stat-tile-style')) return;
    const style = document.createElement('style');
    style.id = 'andromeda-stat-tile-style';
    style.textContent = `
      @keyframes andromeda-value-in {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);
}

// ── easeOutExpo ──────────────────────────────────────────────────────────────
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ── useCountUp ───────────────────────────────────────────────────────────────
// Animates from 0 → target over `duration` ms. Returns the display string,
// preserving the original decimal precision of `rawValue`.
function useCountUp(rawValue, duration = 1800) {
  const num = parseFloat(rawValue);
  const isNumeric = !isNaN(num);
  const decimals = isNumeric
    ? (String(rawValue).split('.')[1] ?? '').length
    : 0;

  const [display, setDisplay] = useState(isNumeric ? '0' : rawValue);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!isNumeric) { setDisplay(rawValue); return; }

    // Small delay so the card mount animation is visible first.
    const timeout = setTimeout(() => {
      startRef.current = null;

      function tick(now) {
        if (!startRef.current) startRef.current = now;
        const elapsed = now - startRef.current;
        const t = Math.min(elapsed / duration, 1);
        const current = num * easeOutExpo(t);
        setDisplay(decimals > 0 ? current.toFixed(decimals) : String(Math.round(current)));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
    }, 120);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawValue]);

  return display;
}


// ── Classes ──────────────────────────────────────────────────────────────────
const labelClass = cn(
  '[font-family:var(--andromeda-font-mono)]',
  'text-[length:var(--andromeda-text-xs)]',
  'font-[number:var(--andromeda-weight-medium)]',
  'uppercase [letter-spacing:var(--andromeda-tracking-wide)]',
  'text-[color:var(--andromeda-text-secondary)]',
);

const codeClass = cn(
  '[font-family:var(--andromeda-font-mono)]',
  'text-[length:var(--andromeda-text-xs)]',
  'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
  'text-[color:var(--andromeda-text-faint)]',
);

const valueClass = cn(
  '[font-family:var(--andromeda-font-sans)]',
  'text-[length:var(--andromeda-text-4xl)]',
  'font-[number:var(--andromeda-weight-thin)]',
  'text-[color:var(--andromeda-text-primary)]',
  '[line-height:var(--andromeda-leading-tight)]',
  '[letter-spacing:var(--andromeda-tracking-tight)]',
);

const unitClass = cn(
  '[font-family:var(--andromeda-font-mono)]',
  'text-[length:var(--andromeda-text-sm)]',
  'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
  'text-[color:var(--andromeda-text-muted)]',
);

const deltaLabelClass = cn(
  '[font-family:var(--andromeda-font-mono)]',
  'text-[length:var(--andromeda-text-xs)]',
  'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
  'text-[color:var(--andromeda-text-muted)]',
);

const deltaBaseClass = cn(
  '[font-family:var(--andromeda-font-mono)]',
  'text-[length:var(--andromeda-text-xs)]',
  'font-[number:var(--andromeda-weight-medium)]',
  '[letter-spacing:var(--andromeda-tracking-wide)]',
);

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * @typedef {object} StatTileProps
 * @property {string} label
 * @property {string|number} value
 * @property {string} [unit]
 * @property {number} [delta] Positive → accent, negative → fault.
 * @property {string} [deltaLabel]
 * @property {string} [code] Optional small mono identifier in the top-right.
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<StatTileProps & React.HTMLAttributes<HTMLDivElement>>} */
export const StatTile = forwardRef(function StatTile(
  { className, label, value, unit, delta, deltaLabel, code, style, ...props },
  ref,
) {
  useStatTileStyles();

  const displayValue = useCountUp(value);
  const hasDelta = typeof delta === 'number' && Number.isFinite(delta);
  const isPositive = hasDelta && delta >= 0;
  const trendColorClass = !hasDelta
    ? 'text-[color:var(--andromeda-text-muted)]'
    : isPositive
      ? 'text-[color:var(--andromeda-accent-300)]'
      : 'text-[color:var(--andromeda-red-300)]';

  return (
    <Card
      ref={ref}
      className={cn('flex-1 min-w-0 overflow-hidden', className)}
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
<CardContent className="flex flex-col gap-[var(--andromeda-3)]">
        {/* Label row */}
        <div className="flex items-baseline justify-between">
          <span className={labelClass}>{label}</span>
          {code ? <span className={codeClass}>{code}</span> : null}
        </div>

        {/* Value + unit */}
        <div
          className="flex items-baseline gap-[var(--andromeda-2)]"
          style={{ animation: 'andromeda-value-in 0.4s ease-out both', animationDelay: '80ms' }}
        >
          <span className={valueClass}>{displayValue}</span>
          {unit ? <span className={unitClass}>{unit}</span> : null}
        </div>

        {/* Delta row */}
        {(hasDelta || deltaLabel) ? (
          <div
            className={cn(
              'flex items-center gap-[var(--andromeda-2)]',
              'pt-[var(--andromeda-2)]',
              'border-t border-solid border-[color:var(--andromeda-border-subtle)]',
            )}
          >
            {hasDelta ? (
              <span className={cn(deltaBaseClass, trendColorClass)}>
                {isPositive ? '▲' : '▼'} {Math.abs(delta)}
              </span>
            ) : null}
            {deltaLabel ? <span className={deltaLabelClass}>{deltaLabel}</span> : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
});
