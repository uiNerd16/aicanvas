// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: ProgressBar
// shadcn/ui-aligned API: variant, cva, forwardRef, ARIA progressbar.
// Variants: default | warning | fault
// Track uses surface.overlay; fill is an accent.dim → accent.base
// gradient (recolored per variant) with a soft glow halo.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';

const trackVariants = cva(
  [
    'relative h-[3px] w-full overflow-hidden',
    'bg-[color:var(--andromeda-surface-overlay)]',
    'border border-solid border-[color:var(--andromeda-border-subtle)]',
    'rounded-[var(--andromeda-radius-none)]',
  ],
);

const fillVariants = cva(
  [
    'h-full',
    'transition-[width] duration-[400ms] ease-out',
  ],
  {
    variants: {
      variant: {
        default: [
          '[background:linear-gradient(90deg,var(--andromeda-accent-dim)_0%,var(--andromeda-accent-base)_100%)]',
          'shadow-[0_0_8px_var(--andromeda-accent-glow)]',
        ],
        warning: [
          '[background:linear-gradient(90deg,var(--andromeda-warning-dim)_0%,var(--andromeda-warning)_100%)]',
          'shadow-[0_0_8px_var(--andromeda-warning-ring)]',
        ],
        fault: [
          '[background:linear-gradient(90deg,var(--andromeda-fault-dim)_0%,var(--andromeda-fault)_100%)]',
          'shadow-[0_0_8px_var(--andromeda-fault-ring)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

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
 * @property {string} [label] Optional label rendered above the track.
 * @property {number} value 0–100 percentage; clamped internally.
 * @property {'default'|'warning'|'fault'} [variant='default']
 * @property {string} [className] Forwarded to outer wrapper.
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<ProgressBarProps & React.HTMLAttributes<HTMLDivElement>>} */
export const ProgressBar = forwardRef(function ProgressBar(
  { className, label, value, variant = 'default', style, ...props },
  ref,
) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

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
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={typeof label === 'string' ? label : undefined}
        className={trackVariants()}
      >
        <div
          className={fillVariants({ variant })}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
});

export { trackVariants, fillVariants };
