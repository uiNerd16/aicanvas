// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Card
// shadcn/ui-aligned compound component:
//   <Card><CardHeader/><CardContent/><CardFooter/></Card>
// Variant: default | glow (adds accent.glowSoft tint + bright markers)
// Sharp corners, transparent surface.raised, thin border.subtle.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';
import { CornerMarkers } from './CornerMarkers';

const cardVariants = cva(
  [
    'relative block',
    'rounded-[var(--andromeda-radius-none)]',
    '[backdrop-filter:blur(2px)] [-webkit-backdrop-filter:blur(2px)]',
  ],
  {
    variants: {
      variant: {
        default: ['bg-[color:var(--andromeda-surface-raised)]'],
        glow:    ['bg-[image:var(--andromeda-gradient-accent-sweep)]'],
      },
      bordered: {
        true:  ['border', 'border-solid'],
        false: [],
      },
    },
    compoundVariants: [
      { variant: 'default', bordered: true, class: 'border-[color:var(--andromeda-border-base)]' },
      { variant: 'glow',    bordered: true, class: 'border-[color:var(--andromeda-accent-dim)]' },
    ],
    defaultVariants: {
      variant: 'default',
      bordered: false,
    },
  },
);

/**
 * @typedef {object} CardProps
 * @property {'default'|'glow'} [variant='default']
 * @property {boolean} [bordered=false] Toggle a continuous 1px border. Off by default — Andromeda cards rely on corner brackets, not perimeter strokes.
 * @property {boolean} [markers=true] Toggle the corner markers motif.
 * @property {import('./CornerMarkers').CornerMarkersProps} [markerProps] Pass-through overrides for the inner CornerMarkers.
 * @property {React.ReactNode} [children]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<CardProps & React.HTMLAttributes<HTMLDivElement>>} */
export const Card = forwardRef(function Card(
  { className, variant = 'default', bordered = false, markers = true, markerProps, children, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card"
      className={cn(cardVariants({ variant, bordered }), className)}
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
      {markers ? <CornerMarkers {...markerProps} /> : null}
      {children}
    </div>
  );
});

/**
 * @typedef {object} CardSectionProps
 * @property {React.ReactNode} [children]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<CardSectionProps & React.HTMLAttributes<HTMLDivElement>>} */
export const CardHeader = forwardRef(function CardHeader(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        'flex items-center justify-between gap-[var(--andromeda-3)]',
        'px-[var(--andromeda-3)] py-[var(--andromeda-3)]',
        'border-b border-solid border-[color:var(--andromeda-border-subtle)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

/** @type {React.ForwardRefExoticComponent<CardSectionProps & React.HTMLAttributes<HTMLDivElement>>} */
export const CardContent = forwardRef(function CardContent(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn('p-[var(--andromeda-3)]', className)}
      {...props}
    >
      {children}
    </div>
  );
});

/** @type {React.ForwardRefExoticComponent<CardSectionProps & React.HTMLAttributes<HTMLDivElement>>} */
export const CardFooter = forwardRef(function CardFooter(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(
        'flex items-center gap-[var(--andromeda-3)]',
        'px-[var(--andromeda-3)] py-[var(--andromeda-3)]',
        'border-t border-solid border-[color:var(--andromeda-border-subtle)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

/** @type {React.ForwardRefExoticComponent<{ children?: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLHeadingElement>>} */
export const CardTitle = forwardRef(function CardTitle(
  { className, children, ...props },
  ref,
) {
  return (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn(
        '[font-family:var(--andromeda-font-mono)]',
        'text-[length:var(--andromeda-text-sm)]',
        'font-[number:var(--andromeda-weight-medium)]',
        'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
        'text-[color:var(--andromeda-text-primary)]',
        'm-0',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
});

/** @type {React.ForwardRefExoticComponent<{ children?: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLParagraphElement>>} */
export const CardDescription = forwardRef(function CardDescription(
  { className, children, ...props },
  ref,
) {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn(
        '[font-family:var(--andromeda-font-sans)]',
        'text-[length:var(--andromeda-text-xs)]',
        'text-[color:var(--andromeda-text-secondary)]',
        'm-0',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
});

export { cardVariants };
