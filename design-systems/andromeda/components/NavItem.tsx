// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: NavItem
// shadcn/ui-aligned API: variant/state, asChild, forwardRef, cva.
// Active state: accent text + accent.glowSoft bg + 6px square on the right
// that glows leftward, illuminating the row.
// Inactive: text.secondary, hover surface.hover.
// Mono label is the default; pass `mono={false}` for sans labels.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';

const navItemVariants = cva(
  [
    'relative flex items-center w-full text-left box-border',
    'gap-[var(--andromeda-3)]',
    'pl-[var(--andromeda-5)] pr-[var(--andromeda-4)] py-[var(--andromeda-3)]',
    'border-0 rounded-[var(--andromeda-radius-none)]',
    'cursor-pointer select-none',
    'font-[number:var(--andromeda-weight-medium)]',
    'text-[length:var(--andromeda-text-sm)]',
    '[line-height:var(--andromeda-leading-snug)]',
    'transition-all duration-150 ease-out',
    'active:translate-x-[1px]',
    'focus-visible:outline-none',
    'focus-visible:shadow-[inset_0_0_0_1px_var(--andromeda-accent-dim)]',
    'disabled:opacity-[0.4] disabled:pointer-events-none',
  ],
  {
    variants: {
      active: {
        true: [
          'text-[color:var(--andromeda-accent-bright)]',
        ],
        false: [
          'text-[color:var(--andromeda-text-secondary)]',
          'bg-transparent',
          'hover:text-[color:var(--andromeda-text-primary)]',
          'hover:bg-[color:var(--andromeda-surface-hover)]',
          'active:bg-[color:var(--andromeda-surface-active)]',
        ],
      },
      mono: {
        true: [
          '[font-family:var(--andromeda-font-mono)]',
          'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
        ],
        false: [
          '[font-family:var(--andromeda-font-sans)]',
          '[letter-spacing:var(--andromeda-tracking-normal)]',
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
      style={{ ...andromedaVars(), ...style }}
      {...props}
    >
      {/* Right accent square + gradient glow — visible only when active */}
      {active ? (
        <>
          {/* Gradient light sweep from square leftward */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to left, rgba(45,212,191,0.10) 0%, rgba(45,212,191,0.04) 40%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
          {/* The square itself */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '6px',
              height: '6px',
              flexShrink: 0,
              background: 'var(--andromeda-accent-dim)',
              border: '1px solid var(--andromeda-accent-dim)',
              boxShadow: '-6px 0 12px var(--andromeda-accent-glow), -2px 0 20px var(--andromeda-accent-glowSoft)',
            }}
          />
        </>
      ) : null}
      {Icon ? <Icon size={20} weight="light" /> : null}
      <span>{label}</span>
    </Comp>
  );
});

export { navItemVariants };
