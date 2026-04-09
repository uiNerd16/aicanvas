// ============================================================
// COMPONENT: Avatar
// shadcn/ui-aligned API: variant/size, cva, forwardRef.
// Sizes: sm | md | lg
// Initials, monospace, square (radius.none).
// Optional status dot: online | caution | fault | offline
// ============================================================

'use client';

import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn, spaceVars } from './lib/utils';

const avatarVariants = cva(
  [
    'inline-flex items-center justify-center select-none shrink-0',
    'border border-solid',
    'rounded-[var(--space-radius-none)]',
    'bg-[color:var(--space-surface-overlay)]',
    'border-[color:var(--space-border-base)]',
    'text-[color:var(--space-text-primary)]',
    '[font-family:var(--space-font-mono)]',
    'font-[number:var(--space-weight-semibold)]',
    '[letter-spacing:var(--space-tracking-normal)]',
    'transition-transform duration-150 ease-out',
    'hover:scale-[1.05]',
  ],
  {
    variants: {
      size: {
        sm: 'w-[24px] h-[24px] text-[length:var(--space-text-xs)]',
        md: 'w-[32px] h-[32px] text-[length:var(--space-text-sm)]',
        lg: 'w-[40px] h-[40px] text-[length:var(--space-text-md)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const statusDotVariants = cva(
  [
    'absolute -bottom-[1px] -right-[1px] block',
    'border-0',
  ],
  {
    variants: {
      size: {
        sm: 'w-[6px] h-[6px]',
        md: 'w-[6px] h-[6px]',
        lg: 'w-[8px] h-[8px]',
      },
      status: {
        online:  'bg-[color:var(--space-accent-base)] shadow-[0_0_6px_var(--space-accent-glow)]',
        caution: 'bg-[color:var(--space-warning)]',
        fault:   'bg-[color:var(--space-fault)]',
        offline: 'bg-[color:var(--space-text-muted)]',
      },
    },
    defaultVariants: {
      size: 'md',
      status: 'offline',
    },
  },
);

function deriveInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * @typedef {object} AvatarProps
 * @property {string} [name='?'] Used to derive uppercase initials.
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {'online'|'caution'|'fault'|'offline'} [status] When set, renders a status dot.
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<AvatarProps & React.HTMLAttributes<HTMLDivElement>>} */
export const Avatar = forwardRef(function Avatar(
  { className, name = '?', size = 'md', status, style, ...props },
  ref,
) {
  const initials = deriveInitials(name);

  return (
    <div
      ref={ref}
      className="relative inline-flex shrink-0"
      style={{ ...spaceVars(), ...style }}
      {...props}
    >
      <div className={cn(avatarVariants({ size }), className)}>{initials}</div>
      {status ? <span className={statusDotVariants({ size, status })} aria-hidden="true" /> : null}
    </div>
  );
});

export { avatarVariants, statusDotVariants };
