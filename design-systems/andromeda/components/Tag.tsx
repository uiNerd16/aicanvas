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
    // max-w-full + min-w-0 keep a long label from forcing horizontal scroll
    // in a stacked (single-column) layout; the label span truncates while
    // the close button stays pinned (see render below).
    'inline-flex items-center select-none whitespace-nowrap',
    'max-w-full min-w-0',
    'gap-[var(--andromeda-2)]',
    'box-border',
    'border-[length:var(--andromeda-border-width,1px)] border-solid',
    'rounded-[var(--andromeda-radius-frame,0px)]',
    '[font-family:var(--andromeda-font-mono)]',
    // Stated, not inherited. Tag set no weight at all, so a chip rendered inside
    // a heading or a bold cell silently picked that up — the same chip weighed
    // different things on different pages. Regular for the same reason as Badge:
    // the weight axis belongs to the controls.
    'font-[number:var(--andromeda-weight-regular)]',
    'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
    'transition-colors duration-150 ease-out',
  ],
  {
    variants: {
      // LABEL LADDER, not the control ladder. 20 / 24 / 32 instead of the
      // controls' 28 / 34 / 40 (maintainer's call, 2026-08-10). A tag or a badge
      // is a label inside a row or a cell, not a control in a strip, and sitting
      // on the same rungs as Button was the whole reason the three read as one
      // object. The default stays `sm`, so the common case drops 24px -> 20px.
      //
      // Heights come from the SPACING scale rather than a new token family:
      // 20/24/32 are already spacing 5/6/8, and inventing a parallel ladder for
      // three numbers the grid already names would be a token nobody reads.
      // Padding and text steps are unchanged — only the box got shorter.
      size: {
        sm: 'h-[var(--andromeda-5)] px-[var(--andromeda-2)] text-[length:var(--andromeda-text-sm)]',
        md: 'h-[var(--andromeda-6)] px-[var(--andromeda-3)] text-[length:var(--andromeda-text-md)]',
        lg: 'h-[var(--andromeda-8)] px-[var(--andromeda-4)] text-[length:var(--andromeda-text-lg)]',
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
          'bg-[color:var(--andromeda-surface-raised)]',
          'text-[color:var(--andromeda-text-primary)]',
          'border-[color:var(--andromeda-border-base)]',
        ],
        accent: [
          'bg-[color:var(--andromeda-accent-alpha)]',
          // on-fill fix: guaranteed-contrast on-fill foreground (defaults to family 100)
          'text-[color:var(--andromeda-accent-on)]',
          'border-[color:var(--andromeda-accent-400)]',
        ],
        warning: [
          'bg-[color:var(--andromeda-orange-alpha)]',
          'text-[color:var(--andromeda-orange-on)]',
          'border-[color:var(--andromeda-orange-400)]',
        ],
        fault: [
          'bg-[color:var(--andromeda-red-alpha)]',
          'text-[color:var(--andromeda-red-on)]',
          'border-[color:var(--andromeda-red-400)]',
        ],
      },
    },
    defaultVariants: {
      size: 'sm',
      variant: 'default',
    },
  },
);


const closeButtonClass = cn(
  'inline-flex items-center justify-center shrink-0',
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
 * @property {'sm'|'md'|'lg'} [size='sm'] Rung on the LABEL ladder: 20, 24 or 32px tall (not the 28/34/40 control ladder). Defaults to sm because a tag usually sits inline rather than in a control row; pass md or lg to line it up beside a field or button of that size.
 * @property {React.ReactNode} [children]
 * @property {() => void} [onClose] When provided, renders a close button.
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<TagProps & React.HTMLAttributes<HTMLSpanElement>>} */
export const Tag = forwardRef(function Tag(
  { className, variant = 'default', size = 'sm', children, onClose, style, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      data-size={size}
      data-variant={variant}
      className={cn(tagVariants({ variant, size }), className)}
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {children}
      </span>
      {onClose ? (
        <button
          type="button"
          aria-label={typeof children === 'string' ? `Remove ${children}` : 'Remove'}
          onClick={onClose}
          className={closeButtonClass}
        >
          <X size={12} weight="regular" />
        </button>
      ) : null}
    </span>
  );
});

export { tagVariants };
