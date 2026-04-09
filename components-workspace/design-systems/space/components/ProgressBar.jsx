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
import { cn, spaceVars } from './lib/utils';

const trackVariants = cva(
  [
    'relative h-[3px] w-full overflow-hidden',
    'bg-[color:var(--space-surface-overlay)]',
    'border border-solid border-[color:var(--space-border-subtle)]',
    'rounded-[var(--space-radius-none)]',
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
          '[background:linear-gradient(90deg,var(--space-accent-dim)_0%,var(--space-accent-base)_100%)]',
          'shadow-[0_0_8px_var(--space-accent-glow)]',
        ],
        warning: [
          '[background:linear-gradient(90deg,var(--space-warning-dim)_0%,var(--space-warning)_100%)]',
          'shadow-[0_0_8px_var(--space-warning-ring)]',
        ],
        fault: [
          '[background:linear-gradient(90deg,var(--space-fault-dim)_0%,var(--space-fault)_100%)]',
          'shadow-[0_0_8px_var(--space-fault-ring)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const labelClass = cn(
  '[font-family:var(--space-font-mono)]',
  'text-[length:var(--space-text-xs)]',
  'uppercase [letter-spacing:var(--space-tracking-wider)]',
  'text-[color:var(--space-text-secondary)]',
);

const valueClass = cn(
  '[font-family:var(--space-font-mono)]',
  'text-[length:var(--space-text-xs)]',
  'font-[number:var(--space-weight-medium)]',
  'uppercase [letter-spacing:var(--space-tracking-wider)]',
  'text-[color:var(--space-text-primary)]',
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
      className={cn('flex flex-col gap-[var(--space-2)]', className)}
      style={{ ...spaceVars(), ...style }}
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
