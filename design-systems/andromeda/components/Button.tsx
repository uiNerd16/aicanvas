// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Button
// shadcn/ui-aligned API: variant, size, asChild, forwardRef.
// Variants: default | outline | ghost | destructive | link
// Sizes:    sm | md | lg
// All interactive states (hover, focus-visible, active, disabled)
// are expressed as cva variants and trace back to Andromeda tokens
// via CSS custom properties from `andromedaVars()`.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';
import { useReducedMotion } from './lib/motion';
import { tokens } from '../tokens';

// Token-driven framer transitions. tokens.motion.duration values are
// strings like "140ms"; framer expects seconds, so parseInt → /1000.
const ms = (v) => parseInt(v, 10) / 1000;
const HOVER_TX = { duration: ms(tokens.motion.duration.normal), ease: [0, 0, 0.2, 1] };
const PRESS_TX = { duration: ms(tokens.motion.duration.fast),   ease: [0.4, 0, 1, 1] };
// whileHover / whileTap targets — transitions inlined inside the variant
// so hover uses duration.normal and press uses duration.fast independently.
const HOVER_LIFT = { y: -1, filter: 'brightness(1.05)', transition: HOVER_TX };
const PRESS_DOWN = { scale: 0.98, transition: PRESS_TX };

const buttonVariants = cva(
  [
    // structural
    'relative inline-flex items-center justify-center select-none whiteandromeda-nowrap',
    'gap-[var(--andromeda-2)]',
    'border border-solid',
    'rounded-[var(--andromeda-radius-none)]',
    // typography (all token-driven via CSS vars)
    '[font-family:var(--andromeda-font-mono)]',
    'font-[number:var(--andromeda-weight-medium)]',
    'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
    '[line-height:var(--andromeda-leading-tight)]',
    // motion — colours/border/shadow tween via CSS at duration.normal so the
    // focus ring fades in (was previously a hard snap). Transform/lift/press
    // are driven by framer-motion's whileHover/whileTap on the motion.button
    // root, see below — they get duration.normal (hover) and duration.fast
    // (press) per `tokens.motion`.
    'cursor-pointer',
    'transition-[background-color,border-color,box-shadow,color] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
    '[backdrop-filter:blur(2px)] [-webkit-backdrop-filter:blur(2px)]',
    // focus & disabled
    'focus-visible:outline-none',
    'focus-visible:shadow-[0_0_0_1px_var(--andromeda-accent-400),0_0_8px_var(--andromeda-accent-500)]',
    'disabled:cursor-not-allowed disabled:opacity-[0.35] disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-[color:var(--andromeda-text-primary)]',
          'bg-[color:var(--andromeda-accent-400)]',
          'border-[color:var(--andromeda-accent-200)]',
          'hover:bg-[color:var(--andromeda-accent-400)]',
          'hover:border-[color:var(--andromeda-accent-200)]',
          'hover:shadow-[0_0_8px_var(--andromeda-accent-400)]',
          'active:bg-[color:var(--andromeda-accent-400)]',
          'active:border-[color:var(--andromeda-accent-200)]',
        ],
        outline: [
          'text-[color:var(--andromeda-text-primary)]',
          'bg-[color:var(--andromeda-surface-raised)]',
          'border-[color:var(--andromeda-border-base)]',
          'hover:bg-[color:var(--andromeda-surface-hover)]',
          'hover:border-[color:var(--andromeda-border-bright)]',
          'active:bg-[color:var(--andromeda-surface-active)]',
        ],
        ghost: [
          'text-[color:var(--andromeda-text-secondary)]',
          'bg-transparent',
          'border-transparent',
          'hover:text-[color:var(--andromeda-text-primary)]',
          'hover:bg-[color:var(--andromeda-surface-raised)]',
          'active:bg-[color:var(--andromeda-surface-hover)]',
        ],
        destructive: [
          'text-[color:var(--andromeda-text-primary)]',
          'bg-[color:var(--andromeda-red-400)]',
          'border-[color:var(--andromeda-red-400)]',
          'hover:bg-[color:var(--andromeda-red-400)]',
          'hover:border-[color:var(--andromeda-red-300)]',
          'hover:shadow-[0_0_8px_var(--andromeda-red-400)]',
          'focus-visible:shadow-[0_0_0_1px_var(--andromeda-red-400),0_0_8px_var(--andromeda-red-400)]',
          'active:bg-[color:var(--andromeda-red-400)]',
        ],
        link: [
          'text-[color:var(--andromeda-text-primary)]',
          'bg-transparent',
          'border-transparent',
          'underline-offset-4 hover:underline',
          'hover:text-[color:var(--andromeda-text-primary)]',
          // link variant has no shadow ring on focus
          'focus-visible:shadow-none',
          'focus-visible:underline',
        ],
      },
      size: {
        sm: 'px-[var(--andromeda-3)] py-[5px] text-[length:var(--andromeda-text-xs)]',
        md: 'px-[var(--andromeda-4)] py-[var(--andromeda-2)] text-[length:var(--andromeda-text-sm)]',
        lg: 'px-[var(--andromeda-5)] py-[11px] text-[length:var(--andromeda-text-md)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

/**
 * @typedef {object} ButtonProps
 * @property {'default'|'outline'|'ghost'|'destructive'|'link'} [variant='default']
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {boolean} [asChild=false]  When true, renders the only child element with the button's props/styles.
 * @property {React.ComponentType<{ size?: number }>} [icon] Phosphor / Lucide icon component rendered before children.
 * @property {React.ReactNode} [children]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 * @property {boolean} [disabled]
 * @property {(e: React.MouseEvent<HTMLButtonElement>) => void} [onClick]
 */

/** @type {React.ForwardRefExoticComponent<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>} */
export const Button = forwardRef(function Button(
  {
    className,
    variant = 'default',
    size = 'md',
    asChild = false,
    icon: Icon,
    children,
    style,
    type = 'button',
    disabled,
    ...props
  },
  ref,
) {
  // Icons render ~1.3× the label size so they read clearly next to the text.
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;
  const reducedMotion = useReducedMotion();
  const baseClass = cn(buttonVariants({ variant, size }), className);
  const baseStyle = { ...andromedaVars(), ...style };
  const content = (
    <>
      {Icon ? <Icon size={iconSize} weight="light" /> : null}
      {children}
    </>
  );

  // asChild path — Slot composes onto whatever child was passed (typically
  // an <a>). Slot can't accept framer-motion gesture props, so the asChild
  // path falls back to CSS-only transitions defined in cva. The hover lift
  // + press scale are skipped for this path; this is a known trade-off.
  if (asChild) {
    return (
      <Slot ref={ref} className={baseClass} style={baseStyle} {...props}>
        {content}
      </Slot>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      className={baseClass}
      style={baseStyle}
      disabled={disabled}
      whileHover={reducedMotion || disabled ? undefined : HOVER_LIFT}
      whileTap={reducedMotion || disabled ? undefined : PRESS_DOWN}
      {...props}
    >
      {content}
    </motion.button>
  );
});

export { buttonVariants };
