// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Tag
// shadcn/ui-aligned API: variant, cva, forwardRef.
// Variants: default | accent | warning | fault
// Compact uppercase mono label, sharp corners, optional X.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { X } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';

const tagVariants = cva(
  [
    'inline-flex items-center select-none whiteandromeda-nowrap',
    'gap-[var(--andromeda-2)]',
    'px-[var(--andromeda-2)] py-[3px]',
    'border border-solid',
    'rounded-[var(--andromeda-radius-none)]',
    '[font-family:var(--andromeda-font-mono)]',
    'text-[length:var(--andromeda-text-xs)]',
    'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
    'transition-colors duration-150 ease-out',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[color:var(--andromeda-surface-raised)]',
          'text-[color:var(--andromeda-text-secondary)]',
          'border-[color:var(--andromeda-border-subtle)]',
        ],
        accent: [
          'bg-[color:var(--andromeda-accent-500)]',
          'text-[color:var(--andromeda-accent-100)]',
          'border-[color:var(--andromeda-accent-400)]',
        ],
        warning: [
          // text-100 on bg-500 = 8.3:1 (WCAG AA pass)
          'bg-[color:var(--andromeda-orange-500)]',
          'text-[color:var(--andromeda-orange-100)]',
          'border-[color:var(--andromeda-orange-400)]',
        ],
        fault: [
          // text-100 on bg-500 = 7.4:1 (WCAG AA pass)
          'bg-[color:var(--andromeda-red-500)]',
          'text-[color:var(--andromeda-red-100)]',
          'border-[color:var(--andromeda-red-400)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);


const closeButtonClass = cn(
  'inline-flex items-center justify-center',
  'p-0 m-0 bg-transparent border-0',
  'cursor-pointer leading-none',
  // Inherit the variant's text color so contrast against the variant
  // bg always matches the tag label (text-100 on bg-500 → ≥7:1).
  'text-[color:currentColor]',
  'opacity-70 transition-[opacity,transform] duration-150 ease-out',
  'hover:opacity-100',
  'active:scale-[0.80]',
  'focus-visible:outline-none focus-visible:opacity-100',
);

/**
 * @typedef {object} TagProps
 * @property {'default'|'accent'|'warning'|'fault'} [variant='default']
 * @property {React.ReactNode} [children]
 * @property {() => void} [onClose] When provided, renders a close button.
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<TagProps & React.HTMLAttributes<HTMLSpanElement>>} */
export const Tag = forwardRef(function Tag(
  { className, variant = 'default', children, onClose, style, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(tagVariants({ variant }), className)}
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
      {children}
      {onClose ? (
        <button
          type="button"
          aria-label="Remove"
          onClick={onClose}
          className={closeButtonClass}
        >
          <X size={12} weight="light" />
        </button>
      ) : null}
    </span>
  );
});

export { tagVariants };
