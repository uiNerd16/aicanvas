// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: EmptyState
// shadcn/ui-aligned API: forwardRef + compound parts.
// Centered icon + uppercase mono title + sans description +
// optional action slot. Built on Card so it inherits the
// bracket motif automatically.
//
//   <EmptyState>
//     <EmptyStateIcon><Inbox /></EmptyStateIcon>
//     <EmptyStateTitle>No transmissions</EmptyStateTitle>
//     <EmptyStateDescription>Awaiting signal from the array.</EmptyStateDescription>
//     <EmptyStateAction><Button>Refresh</Button></EmptyStateAction>
//   </EmptyState>
// ============================================================

'use client';

import { forwardRef } from 'react';
import { cn, andromedaVars } from './lib/utils';
import { Card, CardContent } from './Card';

/**
 * @typedef {object} EmptyStateProps
 * @property {React.ReactNode} [children]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<EmptyStateProps & React.HTMLAttributes<HTMLDivElement>>} */
export const EmptyState = forwardRef(function EmptyState(
  { className, children, style, ...props },
  ref,
) {
  return (
    <Card
      ref={ref}
      data-slot="empty-state"
      className={cn(className)}
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
      <CardContent
        className={cn(
          'flex flex-col items-center justify-center text-center',
          'gap-[var(--andromeda-3)] py-[var(--andromeda-10)] px-[var(--andromeda-6)]',
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
});

export const EmptyStateIcon = forwardRef(function EmptyStateIcon(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="empty-state-icon"
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center',
        'w-[44px] h-[44px] mb-[var(--andromeda-2)]',
        'border border-solid',
        'border-[color:var(--andromeda-border-base)]',
        'bg-[color:var(--andromeda-surface-overlay)]',
        '[&>svg]:w-[22px] [&>svg]:h-[22px]',
        'text-[color:var(--andromeda-text-muted)] [&>svg]:stroke-current',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const EmptyStateTitle = forwardRef(function EmptyStateTitle(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="empty-state-title"
      className={cn(
        '[font-family:var(--andromeda-font-mono)]',
        'text-[length:var(--andromeda-text-md)]',
        'font-[number:var(--andromeda-weight-medium)]',
        'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
        'text-[color:var(--andromeda-text-primary)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const EmptyStateDescription = forwardRef(function EmptyStateDescription(
  { className, children, ...props },
  ref,
) {
  return (
    <p
      ref={ref}
      data-slot="empty-state-description"
      className={cn(
        'm-0 max-w-[44ch]',
        '[font-family:var(--andromeda-font-mono)]',
        'text-[length:var(--andromeda-text-xs)]',
        'text-[color:var(--andromeda-text-muted)]',
        'uppercase [letter-spacing:var(--andromeda-tracking-wide)]',
        'leading-[1.6]',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
});

export const EmptyStateAction = forwardRef(function EmptyStateAction(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="empty-state-action"
      className={cn('mt-[var(--andromeda-3)] flex items-center gap-[var(--andromeda-3)]', className)}
      {...props}
    >
      {children}
    </div>
  );
});
