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
import { useReducedMotion } from './lib/motion';
import { tokens } from '../tokens';

// JS timer boundary: setTimeout cannot read CSS vars; derived from tokens at
// module load, cannot follow runtime var overrides.
const BLINK_OFF_MS = parseFloat(tokens.motion.duration.slow); // 200ms

// Blinks once every ~2s: full opacity → 0.12 for 200ms → full opacity.
// Honours reduced-motion: when the user opts out, the dot holds at full
// opacity and the blink loop never schedules.
function useBlink() {
  const reducedMotion = useReducedMotion();
  const [opacity, setOpacity] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      setOpacity(1);
      return;
    }
    function schedule() {
      timerRef.current = setTimeout(() => {
        setOpacity(0.12);
        setTimeout(() => {
          setOpacity(1);
          schedule();
        }, BLINK_OFF_MS);
        // ponytail: 1800/800 are bespoke blink-cadence jitter, no token
      }, 1800 + Math.random() * 800);
    }
    schedule();
    return () => clearTimeout(timerRef.current);
  }, [reducedMotion]);

  return opacity;
}

const badgeVariants = cva(
  [
    // max-w-full + min-w-0 keep a long label from forcing horizontal scroll
    // when the Badge sits in a stacked (single-column) layout; the label
    // span truncates instead (see render below).
    // ponytail: 5px gap is an identity constant, no token
    'inline-flex items-center gap-[5px] select-none whitespace-nowrap',
    'max-w-full min-w-0 box-border',
    'rounded-[var(--andromeda-radius-frame,0px)]',
    '[font-family:var(--andromeda-font-mono)]',
    // REGULAR, not medium (2026-08-10). Interactive things look heavier: Button
    // keeps medium, and a label that matches its weight is one more axis making
    // the two read as the same object.
    'font-[number:var(--andromeda-weight-regular)]',
    'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
    // leading-none: at 1.5 the label box was 15 / 18 / 21px inside a
    // 20 / 24 / 32px chip, leaving 1.5 / 2 / 4.5px. Same reasoning as Button.
    '[line-height:var(--andromeda-leading-none,1)]',
  ],
  {
    variants: {
      // LABEL LADDER, not the control ladder. 20 / 24 / 32 instead of the
      // controls' 24 / 32 / 40 (maintainer's call, 2026-08-10). A tag or a badge
      // is a label inside a row or a cell, not a control in a strip, and sitting
      // on the same rungs as Button was the whole reason the three read as one
      // object. The default stays `sm`, so the common case drops 24px -> 20px.
      //
      // Heights come from the SPACING scale rather than a new token family:
      // 20/24/32 are already spacing 5/6/8, and inventing a parallel ladder for
      // three numbers the grid already names would be a token nobody reads.
      // Padding and text steps are unchanged — only the box got shorter.
      size: {
        sm: 'h-[var(--andromeda-5)] px-[var(--andromeda-2)] text-[length:var(--andromeda-text-xs)]',
        md: 'h-[var(--andromeda-6)] px-[var(--andromeda-3)] text-[length:var(--andromeda-text-sm)]',
        lg: 'h-[var(--andromeda-8)] px-[var(--andromeda-4)] text-[length:var(--andromeda-text-md)]',
      },
      variant: {
        // TONE FILLS ARE ALPHA (2026-08-10). Each family carries exactly one
        // sanctioned alpha and this is what it is for: a translucent tint reads
        // as a LABEL sitting on the surface, where a solid -500 block reads as a
        // filled control. That difference, not the height, is what separates a
        // chip from a Button at a glance.
        //
        // The label still takes the family `on` token, unchanged — `on` is the
        // guaranteed-contrast pairing and it is the right indirection whatever
        // the fill is. Whether it still CLEARS AA over a 25% tint is measured
        // separately; if a tone fails, the fix is that tone's alpha or its `on`
        // value, never a per-component hardcoded hex.
        default: [
          'bg-[color:var(--andromeda-surface-active)]',
          'text-[color:var(--andromeda-text-primary)]',
        ],
        accent: [
          'bg-[color:var(--andromeda-accent-alpha)]',
          'text-[color:var(--andromeda-accent-on)]',
        ],
        warning: [
          'bg-[color:var(--andromeda-orange-alpha)]',
          'text-[color:var(--andromeda-orange-on)]',
        ],
        fault: [
          'bg-[color:var(--andromeda-red-alpha)]',
          'text-[color:var(--andromeda-red-on)]',
        ],
        subtle: [
          'bg-[color:var(--andromeda-surface-overlay)]',
          'text-[color:var(--andromeda-text-primary)]',
        ],
        outline: [
          'bg-transparent',
          'border-[length:var(--andromeda-border-width,1px)] border-solid border-[color:var(--andromeda-border-bright)]',
          'text-[color:var(--andromeda-text-primary)]',
        ],
      },
    },
    defaultVariants: {
      size: 'sm',
      variant: 'default',
    },
  },
);

// Dot color per variant — the dot is the per-variant signal (text is always
// text.primary across variants, so the colored dot, not the label, carries meaning).
const dotColor = {
  default: 'var(--andromeda-text-muted)',
  accent:  'var(--andromeda-accent-300)',
  warning: 'var(--andromeda-orange-300)',
  fault:   'var(--andromeda-red-300)',
  subtle:  'var(--andromeda-text-faint)',
  outline: 'var(--andromeda-text-primary)',
};

/**
 * @typedef {object} BadgeProps
 * @property {'default'|'accent'|'warning'|'fault'|'subtle'|'outline'} [variant='default']
 * @property {'sm'|'md'|'lg'} [size='sm'] Rung on the shared control ladder: 24, 32 or 40px tall. Defaults to sm, the inline density; pass md or lg to align with a field or button of that size.
 * @property {React.ReactNode} [children]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<BadgeProps & React.HTMLAttributes<HTMLSpanElement>>} */
export const Badge = forwardRef(function Badge(
  { className, variant = 'default', size = 'sm', children, style, ...props },
  ref,
) {
  const dotOpacity = useBlink();

  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 'var(--andromeda-1, 4px)',
          height: 'var(--andromeda-1, 4px)',
          flexShrink: 0,
          background: dotColor[variant],
          opacity: dotOpacity,
          transition: 'opacity var(--andromeda-duration-fast, 80ms) var(--andromeda-easing-out, cubic-bezier(0, 0, 0.2, 1))',
        }}
      />
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {children}
      </span>
    </span>
  );
});

export { badgeVariants };
