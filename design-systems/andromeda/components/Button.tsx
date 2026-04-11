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
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';

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
    // motion
    'cursor-pointer transition-all duration-150 ease-out',
    'active:scale-[0.97]',
    '[backdrop-filter:blur(2px)] [-webkit-backdrop-filter:blur(2px)]',
    // focus & disabled
    'focus-visible:outline-none',
    'focus-visible:shadow-[0_0_0_1px_var(--andromeda-accent-dim),0_0_12px_var(--andromeda-accent-glow)]',
    'disabled:cursor-not-allowed disabled:opacity-[0.35] disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-[color:var(--andromeda-accent-base)]',
          'bg-[color:var(--andromeda-accent-glow-soft)]',
          'border-[color:var(--andromeda-accent-dim)]',
          'hover:text-[color:var(--andromeda-accent-bright)]',
          'hover:bg-[color:var(--andromeda-accent-glow)]',
          'hover:border-[color:var(--andromeda-accent-bright)]',
          'hover:shadow-[0_0_16px_var(--andromeda-accent-glow)]',
          'active:bg-[color:var(--andromeda-accent-glow)]',
          'active:border-[color:var(--andromeda-accent-bright)]',
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
          'text-[color:var(--andromeda-fault)]',
          'bg-[color:var(--andromeda-fault-glow)]',
          'border-[color:var(--andromeda-fault-dim)]',
          'hover:bg-[color:var(--andromeda-fault-dim)]',
          'hover:text-[color:var(--andromeda-text-primary)]',
          'hover:border-[color:var(--andromeda-fault)]',
          'hover:shadow-[0_0_16px_var(--andromeda-fault-ring)]',
          'focus-visible:shadow-[0_0_0_1px_var(--andromeda-fault-dim),0_0_12px_var(--andromeda-fault-ring)]',
          'active:bg-[color:var(--andromeda-fault-dim)]',
        ],
        link: [
          'text-[color:var(--andromeda-accent-base)]',
          'bg-transparent',
          'border-transparent',
          'underline-offset-4 hover:underline',
          'hover:text-[color:var(--andromeda-accent-bright)]',
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
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  // Icons render ~1.3× the label size so they read clearly next to the text.
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size }), className)}
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
      {Icon ? <Icon size={iconSize} strokeWidth={1.5} /> : null}
      {children}
    </Comp>
  );
});

export { buttonVariants };
