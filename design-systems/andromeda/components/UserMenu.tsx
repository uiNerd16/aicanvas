// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: UserMenu
// Avatar-trigger user menu. Click the avatar (with a small
// CaretUpDown indicator) to open a popover with Profile /
// Preferences / Sign Out etc. Pair with `UserCard` when the
// trigger needs to also show the user's name and role.
//
// Follows the Andromeda popover spec (rules.md → Popovers):
//  - position: relative wrapper, position: absolute panel
//  - solid `surface.raised` panel, `0 8px 32px surface.base` shadow
//  - frame is a single 1px `border.base` — no CornerMarkers (the
//    "border OR corners, never both" rule applies; menu-style
//    popovers default to the simple border).
//  - ESC / outside-click close (listeners only attached while open)
//  - the only animation is the trigger's caret rotation; the panel
//    itself does NOT fade in.
//
// Internals (`useUserMenuPanel`, `UserMenuPanel`) are exported so
// `UserCard` can compose the same panel with a different trigger.
// Consumers of the system should reach for `UserMenu` / `UserCard`,
// not the internals.
// ============================================================

'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CaretUpDown } from '@phosphor-icons/react';
import { tokens } from '../tokens';
import { Avatar } from './Avatar';
import { andromedaVars } from './lib/utils';

// Motion locals — framer-motion takes seconds + a 4-tuple bezier, but
// `tokens.motion` exposes ms strings and CSS cubic-bezier() strings.
// These two helpers keep every value traceable to a token while
// adapting to framer's shape (same convention as Drawer.tsx).
const toSeconds = (ms) => parseInt(ms, 10) / 1000;
const EASE_STANDARD = [0.4, 0, 0.2, 1]; // tokens.motion.easing.standard

/**
 * @typedef {object} UserMenuItem
 * @property {string}   [id]
 * @property {string}   [label]
 * @property {React.ComponentType<{ size?: number, weight?: string }>} [icon]
 * @property {() => void} [onSelect]
 * @property {boolean}  [destructive]
 * @property {'separator'} [type]
 */

/**
 * Shared state hook — owns the open/close lifecycle, the wrapper ref,
 * and the listeners for outside-click + Escape. Used by both
 * `UserMenu` and `UserCard` so the trigger behavior stays identical.
 *
 * `initialOpen` lets callers render the menu pre-opened (showcases /
 * docs); outside-click and Escape still dismiss it.
 */
export function useUserMenuPanel(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);
  const triggerProps = {
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'data-state': open ? 'open' : 'closed',
    onClick: toggle,
  };

  return { open, toggle, close, wrapperRef, triggerProps };
}

function UserMenuItemRow({ item, onClose }) {
  if (item.type === 'separator') {
    return (
      <div
        aria-hidden="true"
        role="separator"
        style={{
          height: '1px',
          margin: `${tokens.spacing[1]} 0`,
          background: tokens.color.border.subtle,
        }}
      />
    );
  }
  const Icon = item.icon;
  const baseColor = item.destructive ? tokens.color.red[300] : tokens.color.text.secondary;
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => { item.onSelect?.(); onClose(); }}
      className="andromeda-user-menu-item"
      data-destructive={item.destructive ? 'true' : 'false'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[3],
        width: '100%',
        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.xs,
        fontWeight: tokens.typography.weight.medium,
        color: baseColor,
        textAlign: 'left',
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.wide,
        whiteSpace: 'nowrap',
        transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}, color ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
      }}
    >
      {Icon ? <Icon size={14} weight="regular" /> : <span style={{ width: '14px' }} />}
      <span style={{ flex: 1 }}>{item.label}</span>
    </button>
  );
}

/**
 * Shared panel — renders the floating menu surface and its items.
 * Visibility, placement, and alignment are controlled by props so
 * each trigger component can pick its own canonical defaults.
 */
export function UserMenuPanel({ open, items, placement = 'bottom', align = 'start', panelMinWidth = 200, ariaLabel = 'User menu', onClose }) {
  if (!open) return null;
  const vertical =
    placement === 'top'
      ? { bottom: `calc(100% + ${tokens.spacing[2]})` }
      : { top: `calc(100% + ${tokens.spacing[2]})` };
  const horizontal =
    align === 'stretch'
      ? { left: 0, right: 0 }
      : align === 'end'
        ? { right: 0 }
        : { left: 0 };
  return (
    <div
      role="menu"
      aria-label={ariaLabel}
      style={{
        position: 'absolute',
        ...vertical,
        ...horizontal,
        minWidth: `${panelMinWidth}px`,
        background: tokens.color.surface.raised,
        border: `${tokens.border.thin} ${tokens.color.border.base}`,
        padding: tokens.spacing[1],
        zIndex: 1000,
        boxShadow: `0 8px 32px ${tokens.color.surface.base}`,
      }}
    >
      {items.map((item, i) => (
        <UserMenuItemRow key={item.id ?? i} item={item} onClose={onClose} />
      ))}
    </div>
  );
}

// Hover/focus styles for the menuitem buttons. Marked `!important`
// because the buttons carry inline `style={{ background:'transparent' }}`
// which would otherwise beat any non-important class rule — same
// precedence trap covered in rules.md → "Hover on inline-styled controls".
function UserMenuStyles() {
  return (
    <style>{`
      .andromeda-user-menu-item:hover {
        background: ${tokens.color.surface.hover} !important;
        color: ${tokens.color.text.primary} !important;
      }
      .andromeda-user-menu-item[data-destructive="true"]:hover {
        background: ${tokens.color.surface.hover} !important;
        color: ${tokens.color.red[200]} !important;
      }
      .andromeda-user-menu-item:active {
        background: ${tokens.color.surface.active} !important;
      }
      .andromeda-user-menu-item:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 1px ${tokens.color.accent[400]};
      }
    `}</style>
  );
}

// Export so UserCard can mount the same stylesheet without
// duplicating it. Both components must end up with the same
// selectors active or hover state will silently regress.
export { UserMenuStyles };

/**
 * @typedef {object} UserMenuProps
 * @property {string} name             Display name; passed to Avatar for the initial fallback.
 * @property {string} [src]            Avatar image URL.
 * @property {'online'|'busy'|'away'|'offline'} [status]
 * @property {'sm'|'md'|'lg'} [avatarSize='md']
 * @property {UserMenuItem[]} items
 * @property {'top'|'bottom'} [placement='bottom']
 * @property {'start'|'end'} [align='end']
 * @property {boolean} [defaultOpen=false] Render the menu pre-opened (showcases / docs). Outside-click and Escape still dismiss it.
 * @property {string} [ariaLabel='User menu']
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<UserMenuProps>} */
export const UserMenu = forwardRef(function UserMenu(
  {
    name,
    src,
    status,
    avatarSize = 'md',
    items,
    placement = 'bottom',
    align = 'end',
    defaultOpen = false,
    ariaLabel = 'User menu',
    className,
    style,
    ...props
  },
  ref,
) {
  const { open, wrapperRef, triggerProps, close } = useUserMenuPanel(defaultOpen);
  const [hover, setHover] = useState(false);
  const highlight = open || hover;

  return (
    <div
      ref={(node) => {
        wrapperRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="user-menu"
      className={className}
      style={{ ...andromedaVars(), position: 'relative', display: 'inline-flex', ...style }}
      {...props}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        {...triggerProps}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        style={{
          all: 'unset',
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
          cursor: 'pointer',
          background: highlight ? tokens.color.surface.hover : 'transparent',
          transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        }}
      >
        <Avatar name={name} src={src} status={status} size={avatarSize} />
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{
            duration: toSeconds(tokens.motion.duration.normal),
            ease: EASE_STANDARD,
          }}
          style={{
            display: 'inline-flex',
            color: highlight ? tokens.color.text.secondary : tokens.color.text.faint,
            transition: `color ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
          }}
        >
          <CaretUpDown size={14} weight="regular" />
        </motion.span>
      </button>

      <UserMenuPanel
        open={open}
        items={items}
        placement={placement}
        align={align}
        ariaLabel={ariaLabel}
        onClose={close}
      />
      <UserMenuStyles />
    </div>
  );
});
