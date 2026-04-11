// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
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
import { cn, andromedaVars } from './lib/utils';

const alertVariants = cva(
  [
    'relative flex items-start gap-[var(--andromeda-3)]',
    'p-[var(--andromeda-3)]',
    'border border-solid',
    'rounded-[var(--andromeda-radius-none)]',
    '[backdrop-filter:blur(2px)] [-webkit-backdrop-filter:blur(2px)]',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[color:var(--andromeda-surface-raised)]',
          'border-[color:var(--andromeda-border-base)]',
          '[--alert-icon-color:var(--andromeda-text-secondary)]',
          '[--alert-title-color:var(--andromeda-text-primary)]',
        ],
        accent: [
          'bg-[color:var(--andromeda-accent-glow-soft)]',
          'border-[color:var(--andromeda-accent-dim)]',
          '[--alert-icon-color:var(--andromeda-accent-base)]',
          '[--alert-title-color:var(--andromeda-accent-bright)]',
        ],
        warning: [
          'bg-[color:var(--andromeda-warning-glow)]',
          'border-[color:var(--andromeda-warning-dim)]',
          '[--alert-icon-color:var(--andromeda-warning)]',
          '[--alert-title-color:var(--andromeda-warning)]',
        ],
        fault: [
          'bg-[color:var(--andromeda-fault-glow)]',
          'border-[color:var(--andromeda-fault-dim)]',
          '[--alert-icon-color:var(--andromeda-fault)]',
          '[--alert-title-color:var(--andromeda-fault)]',
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
      style={{ ...andromedaVars(), ...style }}
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
        '[font-family:var(--andromeda-font-mono)]',
        'text-[length:var(--andromeda-text-sm)]',
        'font-[number:var(--andromeda-weight-medium)]',
        'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
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
        '[font-family:var(--andromeda-font-mono)]',
        'text-[length:var(--andromeda-text-xs)]',
        'text-[color:var(--andromeda-text-secondary)]',
        'uppercase [letter-spacing:var(--andromeda-tracking-wide)]',
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
