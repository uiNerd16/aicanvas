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
    'border-[length:var(--andromeda-border-width,1px)] border-solid',
    'rounded-[var(--andromeda-radius-frame,0px)]',
    '[backdrop-filter:blur(var(--andromeda-blur-sm,2px))] [-webkit-backdrop-filter:blur(var(--andromeda-blur-sm,2px))]',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[color:var(--andromeda-surface-raised)]',
          'border-[color:var(--andromeda-border-base)]',
          '[--alert-icon-color:var(--andromeda-text-secondary)]',
          '[--alert-title-color:var(--andromeda-text-primary)]',
          '[--alert-description-color:var(--andromeda-text-secondary)]',
        ],
        accent: [
          // Fill is the family TINT, not the solid 500 stop (2026-08-10). An
          // alert is a surface carrying a tone, not a control, so it belongs in
          // the page rather than on top of it. Over surface.raised the tint
          // resolves to #142725 and every foreground GAINS contrast: title
          // 13.2:1, description 11.0:1, icon 7.9:1, border 4.1:1, against
          // 6.2 / 5.2 / 3.7 / 1.9 on the old solid fill.
          'bg-[color:var(--andromeda-accent-alpha)]',
          'border-[color:var(--andromeda-accent-400)]',
          '[--alert-icon-color:var(--andromeda-accent-300)]',
          '[--alert-title-color:var(--andromeda-accent-100)]',
          '[--alert-description-color:var(--andromeda-accent-200)]',
        ],
        warning: [
          // Tint over surface.raised = #2C2213. title 12.7:1, description
          // 9.9:1, icon 7.6:1, border 3.9:1 (was 9.2 / 7.1 / 5.5 / 2.8).
          'bg-[color:var(--andromeda-orange-alpha)]',
          'border-[color:var(--andromeda-orange-400)]',
          '[--alert-icon-color:var(--andromeda-orange-300)]',
          '[--alert-title-color:var(--andromeda-orange-100)]',
          '[--alert-description-color:var(--andromeda-orange-200)]',
        ],
        fault: [
          // Tint over surface.raised = #2C1819. title 12.1:1, description
          // 7.4:1, icon 4.7:1, border 2.7:1 (was 9.6 / 5.9 / 3.7 / 2.1).
          'bg-[color:var(--andromeda-red-alpha)]',
          'border-[color:var(--andromeda-red-400)]',
          '[--alert-icon-color:var(--andromeda-red-300)]',
          '[--alert-title-color:var(--andromeda-red-100)]',
          '[--alert-description-color:var(--andromeda-red-200)]',
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
  // Severity-aware live region: warning/fault interrupt (assertive),
  // everything else announces politely.
  const role = variant === 'warning' || variant === 'fault' ? 'alert' : 'status';
  return (
    <div
      ref={ref}
      role={role}
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
        '[&>svg]:w-[var(--andromeda-icon-sm,16px)] [&>svg]:h-[var(--andromeda-icon-sm,16px)]',
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
        '[font-family:var(--andromeda-font-sans)]',
        'text-[length:var(--andromeda-text-xs)]',
        'text-[color:var(--alert-description-color)]',
        '[line-height:var(--andromeda-leading-relaxed)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export { alertVariants };
