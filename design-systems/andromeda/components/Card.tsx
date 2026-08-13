// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Card
// shadcn/ui-aligned compound component:
//   <Card><CardHeader/><CardContent/><CardFooter/></Card>
// Variant: default | glow (adds accent.shade2 tint + bright markers)
// Sharp corners, surface.raised background, thin border.subtle.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';
import { CornerMarkers } from './CornerMarkers';

const cardVariants = cva(
  [
    // Column flex, not block: a Card stretched by a grid/flex row (equal-height
    // siblings) must send the slack to CardContent, not dump it below the
    // footer. Unstretched cards are unaffected — the column is still auto-height.
    'relative flex flex-col',
    'rounded-[var(--andromeda-radius-frame,0px)]',
    '[backdrop-filter:blur(var(--andromeda-blur-sm,2px))] [-webkit-backdrop-filter:blur(var(--andromeda-blur-sm,2px))]',
  ],
  {
    variants: {
      variant: {
        default: ['bg-[color:var(--andromeda-surface-raised)]'],
        glow:    ['bg-[image:var(--andromeda-gradient-accent-sweep)]'],
        // The louder glow: same idea, roughly 2x the top-left bloom plus a
        // small counter-light bottom-right. `glow` is the whisper you can put
        // on any card; this one claims the eye, so one per screen at most.
        flare:   ['bg-[image:var(--andromeda-gradient-accent-sweep-dual)]'],
      },
      bordered: {
        true:  ['border-[length:var(--andromeda-border-width,1px)]', 'border-solid'],
        false: [],
      },
    },
    compoundVariants: [
      { variant: 'default', bordered: true, class: 'border-[color:var(--andromeda-border-base)]' },
      // Glow uses accent-500 (matches the gradient peak) so the perimeter
      // blends with the fill instead of fighting it. accent-400 was too bright.
      { variant: 'glow',    bordered: true, class: 'border-[color:var(--andromeda-accent-500)]' },
      { variant: 'flare',   bordered: true, class: 'border-[color:var(--andromeda-accent-500)]' },
    ],
    defaultVariants: {
      variant: 'default',
      bordered: false,
    },
  },
);

/**
 * @typedef {object} CardProps
 * @property {'default'|'glow'|'flare'} [variant='default']
 * @property {boolean} [bordered=false] Toggle a continuous 1px border. Off by default. Andromeda cards rely on corner brackets, not perimeter strokes.
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
  // EITHER a perimeter border OR corner markers, never both.
  const showMarkers = markers && !bordered;
  return (
    <div
      ref={ref}
      data-slot="card"
      className={cn(cardVariants({ variant, bordered }), className)}
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
      {showMarkers ? <CornerMarkers {...markerProps} /> : null}
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
        'relative',
        'flex items-center justify-between gap-[var(--andromeda-3)]',
        'px-[var(--andromeda-3)] py-[var(--andromeda-3)]',
        // Inset divider via ::after — left/right match the section padding
        // so the line stops short of the card's vertical edges.
        'after:content-[""] after:absolute after:bottom-0',
        'after:left-[var(--andromeda-3)] after:right-[var(--andromeda-3)]',
        'after:h-[var(--andromeda-border-width,1px)] after:bg-[color:var(--andromeda-border-subtle)]',
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
      // grow: absorbs the slack when the card is stretched, so the footer and
      // its divider stay pinned to the bottom edge instead of floating.
      className={cn('grow p-[var(--andromeda-3)]', className)}
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
        'relative',
        'flex items-center gap-[var(--andromeda-3)]',
        'px-[var(--andromeda-3)] py-[var(--andromeda-3)]',
        // Inset divider via ::before — left/right match the section padding
        // so the line stops short of the card's vertical edges.
        'before:content-[""] before:absolute before:top-0',
        'before:left-[var(--andromeda-3)] before:right-[var(--andromeda-3)]',
        'before:h-[var(--andromeda-border-width,1px)] before:bg-[color:var(--andromeda-border-subtle)]',
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
        // size.md (14px), raised from size.sm (12px) on 2026-08-10. A card is
        // a reading surface, not a control: its title and description are the
        // one place in the system where 12px was doing real prose work.
        'text-[length:var(--andromeda-text-md)]',
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
        // size.md (14px), raised from size.xs (10px) on 2026-08-10. Body copy
        // on a card is read, not scanned, and 10px is a label size.
        'text-[length:var(--andromeda-text-md)]',
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
