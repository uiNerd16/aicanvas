// ============================================================
// COMPONENT: Badge
// shadcn/ui-aligned API: variant prop, cva, forwardRef.
// Variants: default | accent | warning | fault | subtle | outline
// Monospace, uppercase, wide letter-spacing, sharp corners.
// ============================================================

// ============================================================
// COMPONENT: Badge
// shadcn/ui-aligned API: variant prop, cva, forwardRef.
// Variants: default | accent | warning | fault | subtle | outline
// No border — badge is a read-only status label, not a control.
// Leading 4×4 dot colored by variant distinguishes it from Button.
// ============================================================

'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn, spaceVars } from './lib/utils';

// Blinks once every ~2s: full opacity → 0.12 for 200ms → full opacity.
function useBlink() {
  const [opacity, setOpacity] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    function schedule() {
      timerRef.current = setTimeout(() => {
        setOpacity(0.12);
        setTimeout(() => {
          setOpacity(1);
          schedule();
        }, 200);
      }, 1800 + Math.random() * 800);
    }
    schedule();
    return () => clearTimeout(timerRef.current);
  }, []);

  return opacity;
}

const badgeVariants = cva(
  [
    'inline-flex items-center gap-[5px] select-none whitespace-nowrap',
    'rounded-[var(--space-radius-none)]',
    'px-[var(--space-2)] py-[2px]',
    '[font-family:var(--space-font-mono)]',
    'text-[length:var(--space-text-xs)]',
    'font-[number:var(--space-weight-medium)]',
    'uppercase [letter-spacing:var(--space-tracking-wider)]',
    '[line-height:var(--space-leading-normal)]',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[color:var(--space-surface-raised)]',
          'text-[color:var(--space-text-secondary)]',
        ],
        accent: [
          'bg-[color:var(--space-accent-glow-soft)]',
          'text-[color:var(--space-accent-bright)]',
        ],
        warning: [
          'bg-[color:var(--space-warning-glow)]',
          'text-[color:var(--space-warning)]',
        ],
        fault: [
          'bg-[color:var(--space-fault-glow)]',
          'text-[color:var(--space-fault)]',
        ],
        subtle: [
          'bg-[color:var(--space-surface-overlay)]',
          'text-[color:var(--space-text-muted)]',
        ],
        outline: [
          'bg-transparent',
          'border border-solid border-[color:var(--space-border-bright)]',
          'text-[color:var(--space-text-primary)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// Dot color per variant — matches the text color of each variant.
const dotColor = {
  default: 'var(--space-text-muted)',
  accent:  'var(--space-accent-base)',
  warning: 'var(--space-warning)',
  fault:   'var(--space-fault)',
  subtle:  'var(--space-text-faint)',
  outline: 'var(--space-text-primary)',
};

/**
 * @typedef {object} BadgeProps
 * @property {'default'|'accent'|'warning'|'fault'|'subtle'|'outline'} [variant='default']
 * @property {React.ReactNode} [children]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<BadgeProps & React.HTMLAttributes<HTMLSpanElement>>} */
export const Badge = forwardRef(function Badge(
  { className, variant = 'default', children, style, ...props },
  ref,
) {
  const dotOpacity = useBlink();

  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      style={{ ...spaceVars(), ...style }}
      {...props}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '4px',
          height: '4px',
          flexShrink: 0,
          background: dotColor[variant ?? 'default'],
          opacity: dotOpacity,
          transition: 'opacity 80ms ease-out',
        }}
      />
      {children}
    </span>
  );
});

export { badgeVariants };
