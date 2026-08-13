// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: NavItem
// shadcn/ui-aligned API: variant/state, asChild, forwardRef, cva.
// Active state: accent text + a small square indicator on the right.
// No background fill — the indicator alone marks the selected row.
// Inactive: text.secondary, hover surface.hover.
// Mono label is the default; pass `mono={false}` for sans labels.
// `collapsed` is the icon-rail form: same row, label kept for screen readers
// only, and NO edge square — the accent glyph carries active on a rail.
// Pair it with a Tooltip for the visible name.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars, easingArray } from './lib/utils';
import { mq } from './lib/responsive';
import { useReducedMotion } from './lib/motion';
import { tokens } from '../tokens';

// Touch-target floor — a nav row is full-bleed (no isolated chrome to protect),
// so on coarse pointers we raise its min-height to spacing[10] (40px) so the
// whole row is a comfortable tap. Vertical centering is preserved by the row's
// existing `items-center`. Scoped className, !important to out-specify the cva
// base. the Andromeda responsive rules → "Grow touch targets on coarse pointers".
const TOUCH_TARGET_STYLE = `
  ${mq.coarse} {
    .andromeda-navitem-touch {
      min-height: ${tokens.spacing[10]} !important;
    }
  }
`;

// Sliding-indicator transition — token-driven. The active dot uses framer's
// `layoutId` to animate between sibling NavItems when wrapped in a
// <LayoutGroup>. See the Andromeda motion rules.
const ms = (v) => parseInt(v, 10) / 1000;
// framer boundary: derived from tokens, cannot follow runtime var overrides
const INDICATOR_TX = {
  duration: ms(tokens.motion.duration.slow),
  ease: easingArray(tokens.motion.easing.standard),
};

const navItemVariants = cva(
  [
    'relative flex items-center w-full text-left box-border',
    'gap-[var(--andromeda-3)]',
    'pl-[var(--andromeda-5)] pr-[var(--andromeda-4)] py-[var(--andromeda-3)]',
    'border-0 rounded-[var(--andromeda-radius-frame,0px)]',
    'cursor-pointer select-none',
    'font-[number:var(--andromeda-weight-medium)]',
    'text-[length:var(--andromeda-text-sm)]',
    '[line-height:var(--andromeda-leading-snug)]',
    'transition-[background-color,color,transform] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
    'active:translate-x-[1px]',
    'focus-visible:outline-none',
    'focus-visible:shadow-[inset_0_0_0_1px_var(--andromeda-accent-400)]',
    'disabled:opacity-[var(--andromeda-opacity-disabled)] disabled:pointer-events-none',
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
      // Icon rail form: the same row with its label taken out of the visual
      // layout. The no-background-fill active state, the hover lift and the
      // layoutId slide are unchanged, so a rail is a narrow nav list rather
      // than a different component. Two things do change: the asymmetric
      // reading inset collapses to a symmetric one (no label to indent past),
      // and the right-edge square is dropped (no width left to be an edge).
      collapsed: {
        true: ['justify-center', 'px-[var(--andromeda-2)]', 'gap-0'],
        false: [],
      },
    },
    defaultVariants: {
      active: false,
      mono: true,
      collapsed: false,
    },
  },
);

/**
 * @typedef {object} NavItemProps
 * @property {React.ComponentType<{ size?: number, weight?: string }>} [icon]
 *   Optional icon component rendered at 20px before the label.
 * @property {React.ReactNode} label Visible content of the nav row.
 * @property {boolean} [active=false] Marks the row as the current selection, applying accent text and the indicator dot.
 * @property {boolean} [mono=true] Renders the label in uppercase mono type; set false for sans.
 * @property {boolean} [collapsed=false] Icon-rail form: centers the icon, drops the label to screen readers only, and drops the active edge square — the accent glyph is the active signal on a rail. Requires `icon`; pair with a Tooltip so the label is still reachable by sight.
 * @property {boolean} [asChild=false] Renders via Radix Slot, merging props onto the child instead of a native button.
 * @property {'button'|'submit'|'reset'} [type='button'] HTML button type; defaults to 'button' to avoid accidental form submits, and is omitted when asChild is set.
 * @property {string} [layoutGroupId='andromeda-navitem-indicator']
 *   Override only when two distinct nav lists share a viewport and you don't
 *   want the active dot to animate between them. To get the slide between
 *   sibling NavItems, wrap the list in framer's <LayoutGroup>.
 * @property {string} [className] Extra classes merged onto the root element.
 * @property {React.CSSProperties} [style] Inline styles merged onto the root element.
 */

/** @type {React.ForwardRefExoticComponent<NavItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>>} */
export const NavItem = forwardRef(function NavItem(
  {
    className,
    icon: Icon,
    label,
    active = false,
    mono = true,
    collapsed = false,
    asChild = false,
    layoutGroupId = 'andromeda-navitem-indicator',
    style,
    type = 'button',
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  // The indicator slide is the one piece of motion this row owns, and it was
  // playing at full duration for users who asked for less. Same opt-out
  // IconButton and Badge use: the dot still moves to the right row, it just
  // arrives instead of travelling.
  const reducedMotion = useReducedMotion();

  return (
    <>
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        data-active={active ? 'true' : 'false'}
        aria-current={active ? 'page' : undefined}
        className={cn(navItemVariants({ active, mono, collapsed }), 'andromeda-navitem-touch', className)}
        style={{ ...andromedaVars(), ...style }}
        {...props}
      >
        {/* Right indicator square — when wrapped in <LayoutGroup>, this slides
            between sibling NavItems on active change via `layoutId`.
            Expanded rows only: on a rail the row is barely wider than the
            glyph, so an edge marker sits on top of the icon instead of beside
            it and reads as a defect. Collapsed marks active with the accent
            glyph alone (the icon inherits the row's `currentColor`). */}
        {active && !collapsed ? (
          <motion.span
            layoutId={layoutGroupId}
            aria-hidden="true"
            transition={reducedMotion ? { duration: 0 } : INDICATOR_TX}
            style={{
              position: 'absolute',
              right: 'var(--andromeda-3, 12px)',
              top: '50%',
              translateY: '-50%',
              width: 'var(--andromeda-1, 4px)',
              height: 'var(--andromeda-1, 4px)',
              flexShrink: 0,
              background: 'var(--andromeda-accent-300)',
              // ponytail: glow offsets are identity constants, no token
              boxShadow: '-2px 0 8px var(--andromeda-accent-500)',
            }}
          />
        ) : null}
        {Icon ? <Icon size={tokens.iconSize.lg} weight="regular" /> : null}
        {/* Collapsed keeps the label in the accessibility tree and takes it
            out of the picture. Hiding it outright would leave a button whose
            only content is a decorative glyph, so the row would announce as
            nothing; this way the accessible name still comes from the row's
            own content and no caller has to remember an aria-label. */}
        <span className={collapsed ? 'sr-only' : undefined}>{label}</span>
      </Comp>
      <style>{TOUCH_TARGET_STYLE}</style>
    </>
  );
});

export { navItemVariants };
