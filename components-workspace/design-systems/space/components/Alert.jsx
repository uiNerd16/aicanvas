// ============================================================
// COMPONENT: Alert
// shadcn/ui-aligned API: forwardRef, variant, cva, compound parts.
// Banner-style status component for inline messages, errors,
// system notices, etc. Variants: default | accent | warning | fault.
//
//   <Alert variant="fault">
//     <AlertIcon><AlertOctagon /></AlertIcon>
//     <AlertContent>
//       <AlertTitle>Telemetry lost</AlertTitle>
//       <AlertDescription>Reconnecting to vehicle…</AlertDescription>
//     </AlertContent>
//   </Alert>
// ============================================================

'use client';

import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn, spaceVars } from './lib/utils';

const alertVariants = cva(
  [
    'relative flex items-start gap-[var(--space-3)]',
    'p-[var(--space-3)]',
    'border border-solid',
    'rounded-[var(--space-radius-none)]',
    '[backdrop-filter:blur(2px)] [-webkit-backdrop-filter:blur(2px)]',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[color:var(--space-surface-raised)]',
          'border-[color:var(--space-border-base)]',
          '[--alert-icon-color:var(--space-text-secondary)]',
          '[--alert-title-color:var(--space-text-primary)]',
        ],
        accent: [
          'bg-[color:var(--space-accent-glow-soft)]',
          'border-[color:var(--space-accent-dim)]',
          '[--alert-icon-color:var(--space-accent-base)]',
          '[--alert-title-color:var(--space-accent-bright)]',
        ],
        warning: [
          'bg-[color:var(--space-warning-glow)]',
          'border-[color:var(--space-warning-dim)]',
          '[--alert-icon-color:var(--space-warning)]',
          '[--alert-title-color:var(--space-warning)]',
        ],
        fault: [
          'bg-[color:var(--space-fault-glow)]',
          'border-[color:var(--space-fault-dim)]',
          '[--alert-icon-color:var(--space-fault)]',
          '[--alert-title-color:var(--space-fault)]',
        ],
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

/**
 * @typedef {object} AlertProps
 * @property {'default'|'accent'|'warning'|'fault'} [variant='default']
 * @property {React.ReactNode} [children]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<AlertProps & React.HTMLAttributes<HTMLDivElement>>} */
export const Alert = forwardRef(function Alert(
  { className, variant = 'default', children, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      style={{ ...spaceVars(), ...style }}
      {...props}
    >
      {children}
    </div>
  );
});

/** Icon slot — recolors any child SVG to the variant's icon color. */
export const AlertIcon = forwardRef(function AlertIcon(
  { className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="alert-icon"
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center mt-[1px]',
        '[&>svg]:w-[16px] [&>svg]:h-[16px]',
        'text-[color:var(--alert-icon-color)] [&>svg]:stroke-current',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
});

export const AlertContent = forwardRef(function AlertContent(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="alert-content"
      className={cn('flex flex-col gap-[2px] min-w-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});

export const AlertTitle = forwardRef(function AlertTitle(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="alert-title"
      className={cn(
        '[font-family:var(--space-font-mono)]',
        'text-[length:var(--space-text-sm)]',
        'font-[number:var(--space-weight-medium)]',
        'uppercase [letter-spacing:var(--space-tracking-wider)]',
        'text-[color:var(--alert-title-color)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const AlertDescription = forwardRef(function AlertDescription(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        '[font-family:var(--space-font-mono)]',
        'text-[length:var(--space-text-xs)]',
        'text-[color:var(--space-text-secondary)]',
        'uppercase [letter-spacing:var(--space-tracking-wide)]',
        'leading-[1.6]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export { alertVariants };
