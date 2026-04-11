// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
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
import { cn, andromedaVars } from './lib/utils';

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
    'inline-flex items-center gap-[5px] select-none whiteandromeda-nowrap',
    'rounded-[var(--andromeda-radius-none)]',
    'px-[var(--andromeda-2)] py-[2px]',
    '[font-family:var(--andromeda-font-mono)]',
    'text-[length:var(--andromeda-text-xs)]',
    'font-[number:var(--andromeda-weight-medium)]',
    'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
    '[line-height:var(--andromeda-leading-normal)]',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[color:var(--andromeda-surface-raised)]',
          'text-[color:var(--andromeda-text-secondary)]',
        ],
        accent: [
          'bg-[color:var(--andromeda-accent-glow-soft)]',
          'text-[color:var(--andromeda-accent-bright)]',
        ],
        warning: [
          'bg-[color:var(--andromeda-warning-glow)]',
          'text-[color:var(--andromeda-warning)]',
        ],
        fault: [
          'bg-[color:var(--andromeda-fault-glow)]',
          'text-[color:var(--andromeda-fault)]',
        ],
        subtle: [
          'bg-[color:var(--andromeda-surface-overlay)]',
          'text-[color:var(--andromeda-text-muted)]',
        ],
        outline: [
          'bg-transparent',
          'border border-solid border-[color:var(--andromeda-border-bright)]',
          'text-[color:var(--andromeda-text-primary)]',
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
  default: 'var(--andromeda-text-muted)',
  accent:  'var(--andromeda-accent-base)',
  warning: 'var(--andromeda-warning)',
  fault:   'var(--andromeda-fault)',
  subtle:  'var(--andromeda-text-faint)',
  outline: 'var(--andromeda-text-primary)',
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
      style={{ ...andromedaVars(), ...style }}
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
