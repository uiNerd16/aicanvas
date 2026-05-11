// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: IconButton
// Square, label-less companion to Button. Same variant + size
// vocabulary so the two compose into a single coherent toolbar.
// Variants: default | outline | ghost | destructive
// Sizes:    sm (24px) | md (32px) | lg (40px)
// Optional `badge` slot for unread counters / status pips.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';
import { useReducedMotion } from './lib/motion';
import { tokens } from '../tokens';

const ms = (v) => parseInt(v, 10) / 1000;
const HOVER_TX = { duration: ms(tokens.motion.duration.normal), ease: [0, 0, 0.2, 1] };
const PRESS_TX = { duration: ms(tokens.motion.duration.fast),   ease: [0.4, 0, 1, 1] };
const HOVER_LIFT = { y: -1, filter: 'brightness(1.05)', transition: HOVER_TX };
// IconButton is denser than Button so its press is a touch deeper, matching
// the original 0.94 active scale that signalled the squeeze on a small target.
const PRESS_DOWN = { scale: 0.95, transition: PRESS_TX };

const iconButtonVariants = cva(
  [
    // structural — perfectly square, icon dead-center
    'relative inline-flex items-center justify-center select-none flex-shrink-0',
    'border border-solid',
    'rounded-[var(--andromeda-radius-none)]',
    'p-0',
    // motion — colours/border/shadow tween via CSS at duration.normal so the
    // focus ring fades in. Lift + press are framer-motion gesture props on
    // the motion.button root.
    'cursor-pointer',
    'transition-[background-color,border-color,box-shadow,color] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
    '[backdrop-filter:blur(2px)] [-webkit-backdrop-filter:blur(2px)]',
    // focus + disabled — match Button.tsx exactly
    'focus-visible:outline-none',
    'focus-visible:shadow-[0_0_0_1px_var(--andromeda-accent-400),0_0_8px_var(--andromeda-accent-500)]',
    'disabled:cursor-not-allowed disabled:opacity-[0.35] disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-[color:var(--andromeda-accent-100)]',
          'bg-[color:var(--andromeda-accent-500)]',
          'border-[color:var(--andromeda-accent-400)]',
          'hover:border-[color:var(--andromeda-accent-300)]',
          'hover:shadow-[0_0_8px_var(--andromeda-accent-500)]',
          'active:border-[color:var(--andromeda-accent-300)]',
        ],
        outline: [
          'text-[color:var(--andromeda-text-secondary)]',
          'bg-[color:var(--andromeda-surface-hover)]',
          'border-[color:var(--andromeda-border-base)]',
          'hover:text-[color:var(--andromeda-accent-200)]',
          'hover:bg-[color:var(--andromeda-surface-active)]',
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
          'text-[color:var(--andromeda-red-100)]',
          'bg-[color:var(--andromeda-red-500)]',
          'border-[color:var(--andromeda-red-400)]',
          'hover:bg-[color:var(--andromeda-red-400)]',
          'hover:border-[color:var(--andromeda-red-300)]',
          'hover:shadow-[0_0_8px_var(--andromeda-red-400)]',
          'focus-visible:shadow-[0_0_0_1px_var(--andromeda-red-400),0_0_8px_var(--andromeda-red-400)]',
          'active:bg-[color:var(--andromeda-red-400)]',
        ],
      },
      size: {
        // Each step matches a Button height so the two line up in a strip.
        // Button sm = 24px, md = 32px, lg = 40px (computed from py + line-height).
        sm: 'w-[var(--andromeda-6)] h-[var(--andromeda-6)]',
        md: 'w-[var(--andromeda-8)] h-[var(--andromeda-8)]',
        lg: 'w-[var(--andromeda-10)] h-[var(--andromeda-10)]',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  },
);

const ICON_SIZE = { sm: 14, md: 16, lg: 20 };

/**
 * @typedef {object} IconButtonProps
 * @property {'default'|'outline'|'ghost'|'destructive'} [variant='outline']
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {React.ComponentType<{ size?: number, weight?: string }>} [icon]
 *   Phosphor / Lucide icon. Pass either `icon` OR `children` for custom glyphs.
 * @property {React.ReactNode} [children] Custom icon content (SVG, bars, etc.)
 * @property {string} [aria-label]  Required for accessibility (no visible text).
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 * @property {boolean} [disabled]
 * @property {(e: React.MouseEvent<HTMLButtonElement>) => void} [onClick]
 */

/** @type {React.ForwardRefExoticComponent<IconButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>} */
export const IconButton = forwardRef(function IconButton(
  {
    className,
    variant = 'outline',
    size = 'md',
    icon: Icon,
    children,
    style,
    type = 'button',
    disabled,
    ...props
  },
  ref,
) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.button
      ref={ref}
      type={type}
      className={cn(iconButtonVariants({ variant, size }), className)}
      style={{ ...andromedaVars(), ...style }}
      disabled={disabled}
      whileHover={reducedMotion || disabled ? undefined : HOVER_LIFT}
      whileTap={reducedMotion || disabled ? undefined : PRESS_DOWN}
      {...props}
    >
      {Icon ? <Icon size={ICON_SIZE[size]} weight="regular" /> : children}
    </motion.button>
  );
});

export { iconButtonVariants };
