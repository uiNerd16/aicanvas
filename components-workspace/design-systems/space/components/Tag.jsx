// ============================================================
// COMPONENT: Tag
// shadcn/ui-aligned API: variant, cva, forwardRef.
// Variants: default | accent | warning | fault
// Compact uppercase mono label, sharp corners, optional X.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { Close } from '@carbon/icons-react';
import { cva } from 'class-variance-authority';
import { cn, spaceVars } from './lib/utils';

const tagVariants = cva(
  [
    'inline-flex items-center select-none whitespace-nowrap',
    'gap-[var(--space-2)]',
    'px-[var(--space-2)] py-[3px]',
    'border border-solid',
    'rounded-[var(--space-radius-none)]',
    '[font-family:var(--space-font-mono)]',
    'text-[length:var(--space-text-xs)]',
    'uppercase [letter-spacing:var(--space-tracking-wider)]',
    'transition-colors duration-150 ease-out',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[color:var(--space-surface-raised)]',
          'text-[color:var(--space-text-secondary)]',
          'border-[color:var(--space-border-subtle)]',
        ],
        accent: [
          'bg-[color:var(--space-accent-glow-soft)]',
          'text-[color:var(--space-accent-bright)]',
          'border-[color:rgba(96,165,250,0.12)]',
        ],
        warning: [
          'bg-[color:var(--space-warning-glow)]',
          'text-[color:var(--space-warning)]',
          'border-[color:rgba(245,165,36,0.15)]',
        ],
        fault: [
          'bg-[color:var(--space-fault-glow)]',
          'text-[color:var(--space-fault)]',
          'border-[color:rgba(239,68,68,0.15)]',
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
  'text-[color:var(--space-text-muted)]',
  'transition-[colors,transform] duration-150 ease-out',
  'hover:text-[color:var(--space-text-primary)]',
  'active:scale-[0.80]',
  'focus-visible:outline-none focus-visible:text-[color:var(--space-text-primary)]',
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
      style={{ ...spaceVars(), ...style }}
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
          <Close size={12} />
        </button>
      ) : null}
    </span>
  );
});

export { tagVariants };
