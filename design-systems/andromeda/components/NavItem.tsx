// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: NavItem
// shadcn/ui-aligned API: variant/state, asChild, forwardRef, cva.
// Active state: accent text + a small square indicator on the right.
// No background fill — the indicator alone marks the selected row.
// Inactive: text.secondary, hover surface.hover.
// Mono label is the default; pass `mono={false}` for sans labels.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';
import { tokens } from '../tokens';

// Sliding-indicator transition — token-driven. The active dot uses framer's
// `layoutId` to animate between sibling NavItems when wrapped in a
// <LayoutGroup>. See `rules.md` → Active indicator pattern.
const ms = (v) => parseInt(v, 10) / 1000;
const INDICATOR_TX = {
  duration: ms(tokens.motion.duration.slow),
  ease: [0.4, 0, 0.2, 1], // tokens.motion.easing.standard
};

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
    'focus-visible:shadow-[inset_0_0_0_1px_var(--andromeda-accent-400)]',
    'disabled:opacity-[0.4] disabled:pointer-events-none',
  ],
  {
    variants: {
      active: {
        true: [
          'text-[color:var(--andromeda-accent-300)]',
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
 * @property {string} [layoutGroupId='andromeda-navitem-indicator']
 *   Override only when two distinct nav lists share a viewport and you don't
 *   want the active dot to animate between them. To get the slide between
 *   sibling NavItems, wrap the list in framer's <LayoutGroup>.
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
    layoutGroupId = 'andromeda-navitem-indicator',
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
      {/* Right indicator square — when wrapped in <LayoutGroup>, this slides
          between sibling NavItems on active change via `layoutId`. */}
      {active ? (
        <motion.span
          layoutId={layoutGroupId}
          aria-hidden="true"
          transition={INDICATOR_TX}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            translateY: '-50%',
            width: '4px',
            height: '4px',
            flexShrink: 0,
            background: 'var(--andromeda-accent-300)',
            boxShadow: '-2px 0 8px var(--andromeda-accent-500)',
          }}
        />
      ) : null}
      {Icon ? <Icon size={20} weight="light" /> : null}
      <span>{label}</span>
    </Comp>
  );
});

export { navItemVariants };
