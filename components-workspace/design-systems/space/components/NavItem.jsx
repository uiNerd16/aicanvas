// ============================================================
// COMPONENT: NavItem
// shadcn/ui-aligned API: variant/state, asChild, forwardRef, cva.
// Active state: accent text + accent.glowSoft bg + 2px left bar.
// Inactive: text.secondary, hover surface.hover.
// Mono label is the default; pass `mono={false}` for sans labels.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn, spaceVars } from './lib/utils';

const navItemVariants = cva(
  [
    'relative flex items-center w-full text-left box-border',
    'gap-[var(--space-3)]',
    'pl-[var(--space-5)] pr-[var(--space-4)] py-[var(--space-3)]',
    'border-0 rounded-[var(--space-radius-none)]',
    'cursor-pointer select-none',
    'font-[number:var(--space-weight-medium)]',
    'text-[length:var(--space-text-sm)]',
    '[line-height:var(--space-leading-snug)]',
    'transition-all duration-150 ease-out',
    'active:translate-x-[1px]',
    'focus-visible:outline-none',
    'focus-visible:shadow-[inset_0_0_0_1px_var(--space-accent-dim)]',
    'disabled:opacity-[0.4] disabled:pointer-events-none',
  ],
  {
    variants: {
      active: {
        true: [
          'text-[color:var(--space-accent-bright)]',
          'bg-[color:var(--space-accent-glow-soft)]',
        ],
        false: [
          'text-[color:var(--space-text-secondary)]',
          'bg-transparent',
          'hover:text-[color:var(--space-text-primary)]',
          'hover:bg-[color:var(--space-surface-hover)]',
          'active:bg-[color:var(--space-surface-active)]',
        ],
      },
      mono: {
        true: [
          '[font-family:var(--space-font-mono)]',
          'uppercase [letter-spacing:var(--space-tracking-wider)]',
        ],
        false: [
          '[font-family:var(--space-font-sans)]',
          '[letter-spacing:var(--space-tracking-normal)]',
        ],
      },
    },
    defaultVariants: {
      active: false,
      mono: true,
    },
  },
);

/**
 * @typedef {object} NavItemProps
 * @property {React.ComponentType<{ size?: number, strokeWidth?: number }>} [icon]
 * @property {React.ReactNode} label
 * @property {boolean} [active=false]
 * @property {boolean} [mono=true]
 * @property {boolean} [asChild=false]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<NavItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>>} */
export const NavItem = forwardRef(function NavItem(
  {
    className,
    icon: Icon,
    label,
    active = false,
    mono = true,
    asChild = false,
    style,
    type = 'button',
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      data-active={active ? 'true' : 'false'}
      className={cn(navItemVariants({ active, mono }), className)}
      style={{ ...spaceVars(), ...style }}
      {...props}
    >
      {/* Left accent bar — visible only when active */}
      {active ? (
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-0 top-0 bottom-0 w-[2px]',
            'bg-[color:var(--space-accent-base)]',
            'shadow-[0_0_8px_var(--space-accent-glow)]',
          )}
        />
      ) : null}
      {Icon ? <Icon size={20} strokeWidth={1.5} /> : null}
      <span>{label}</span>
    </Comp>
  );
});

export { navItemVariants };
