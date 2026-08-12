// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: UserMenu
// Avatar-trigger user menu. Click the avatar (with a small
// CaretUpDown indicator) to open a popover with Profile /
// Preferences / Sign Out etc. Pair with `UserCard` when the
// trigger needs to also show the user's name and role.
//
// Follows the Andromeda popover spec (the Andromeda interaction-states rules):
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
import { mq } from './lib/responsive';

// Motion locals — framer-motion takes seconds + a 4-tuple bezier, but
// `tokens.motion` exposes ms strings and CSS cubic-bezier() strings.
// These two helpers keep every value traceable to a token while
// adapting to framer's shape (same convention as Drawer.tsx).
const toSeconds = (ms) => parseInt(ms, 10) / 1000;
const EASE_STANDARD = [0.4, 0, 0.2, 1]; // tokens.motion.easing.standard

// Chevron per rung, at half the avatar's box (24/32/40 gives 12/16/20) so the
// indicator holds the same weight against the face at every size. Same ramp
// SearchField's leading glyph uses. The old flat 14 sat on neither
// tokens.iconSize (12/16/18/20/22) nor any avatar ratio.
export const CHEVRON_FOR_SIZE = {
  sm: tokens.iconSize.xs,
  md: tokens.iconSize.sm,
  lg: tokens.iconSize.lg,
};

// Trigger geometry per rung. The avatar sets the scale and the chrome follows
// it. Vertical padding cannot step below md's, because the spacing scale
// floors at 4px, so sm tightens the sides and the gap only.
const TRIGGER_FOR_SIZE = {
  sm: { padY: tokens.spacing[1], padX: tokens.spacing[1], gap: tokens.spacing[1] },
  md: { padY: tokens.spacing[1], padX: tokens.spacing[2], gap: tokens.spacing[2] },
  lg: { padY: tokens.spacing[2], padX: tokens.spacing[3], gap: tokens.spacing[3] },
};

// Row geometry per rung — kept IDENTICAL to PanelMenu's copy of this const;
// change one, change both. The panel is the trigger's continuation, so its
// rows step with the same control ladder the trigger itself sits on.
// The icon rung runs one stop AHEAD of the label's: a menu row is scanned by
// its glyph first, and at 16px beside 14px type the glyph read as the smaller
// of the two.
const ROW_FOR_SIZE = {
  sm: { height: tokens.control.sm.height, text: tokens.typography.size.sm, icon: tokens.iconSize.sm },
  md: { height: tokens.control.md.height, text: tokens.typography.size.md, icon: tokens.iconSize.lg },
  lg: { height: tokens.control.lg.height, text: tokens.typography.size.lg, icon: tokens.iconSize.xl },
};

// Roving arrow-key navigation for the `role="menu"` panel. Queries the
// menuitem buttons, finds the focused one, and moves focus up/down with
// wrap-around; Home/End jump to first/last. Separators are ignored because
// they are not `role="menuitem"` buttons. Bound to the panel's onKeyDown.
function handleMenuKeyDown(e) {
  const itemsList = Array.from(
    e.currentTarget.querySelectorAll('button[role="menuitem"]'),
  );
  if (itemsList.length === 0) return;
  const idx = itemsList.indexOf(document.activeElement);

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    itemsList[idx < 0 ? 0 : (idx + 1) % itemsList.length].focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    itemsList[idx < 0 ? itemsList.length - 1 : (idx - 1 + itemsList.length) % itemsList.length].focus();
  } else if (e.key === 'Home') {
    e.preventDefault();
    itemsList[0].focus();
  } else if (e.key === 'End') {
    e.preventDefault();
    itemsList[itemsList.length - 1].focus();
  }
}

/**
 * @typedef {object} UserMenuItem
 * @property {string}   [id]           Stable key for the row, falling back to its array index.
 * @property {string}   [label]        Text shown on the menu item, rendered uppercase.
 * @property {React.ComponentType<{ size?: number, weight?: string }>} [icon] Icon component rendered before the label.
 * @property {() => void} [onSelect]   Handler called when the item is chosen; the menu closes after.
 * @property {boolean}  [destructive]  Renders the item in the destructive red color.
 * @property {'separator'} [type]      Set to 'separator' to render a divider instead of an item.
 */

/**
 * Shared state hook — owns the open/close lifecycle, the wrapper ref,
 * and the listeners for outside-click + Escape. Used by both
 * `UserMenu` and `UserCard` so the trigger behavior stays identical.
 *
 * `initialOpen` lets callers render the menu pre-opened (showcases /
 * docs); outside-click and Escape still dismiss it.
 *
 * `staticOpen` pins the panel open: the outside-click + Escape dismissers
 * are not attached, so it survives clicks elsewhere on the page. For
 * showcases / docs where several popovers are shown open at once and one
 * must not close the others. The trigger can still toggle it.
 */
export function useUserMenuPanel(initialOpen = false, staticOpen = false) {
  const [open, setOpen] = useState(initialOpen || staticOpen);
  const wrapperRef = useRef(null);
  // The element to return focus to on close — captured when the trigger
  // toggles the menu open (interactive open only).
  const returnFocusRef = useRef(null);

  useEffect(() => {
    if (!open || staticOpen) return;
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
  }, [open, staticOpen]);

  // Focus the first menuitem when the panel opens — NEVER in staticOpen mode,
  // where multiple pinned menus would fight over focus. Queried from the
  // wrapper (which both UserMenu and UserCard set) so the panel ref does not
  // need threading through every trigger component.
  useEffect(() => {
    if (!open || staticOpen) return;
    const first = wrapperRef.current?.querySelector('[role="menu"] button[role="menuitem"]');
    if (first) first.focus();
  }, [open, staticOpen]);

  // Return focus to the trigger when the panel closes after an interactive
  // open. Skipped in staticOpen mode (no focus stealing on showcase pages).
  useEffect(() => {
    if (open || staticOpen) return;
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (target) target.focus();
  }, [open, staticOpen]);

  const toggle = (e) => {
    // Capture the trigger as the focus-return target before opening.
    if (!open && !staticOpen) {
      returnFocusRef.current = e?.currentTarget ?? document.activeElement;
    }
    setOpen((o) => !o);
  };
  const close = () => setOpen(false);
  const triggerProps = {
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'data-state': open ? 'open' : 'closed',
    onClick: toggle,
  };

  return { open, toggle, close, wrapperRef, triggerProps };
}

function UserMenuItemRow({ item, onClose, size = 'md' }) {
  // Falls back to md on an unrecognised size instead of throwing on
  // `rung.height` — same guard as UserMenu's own sizeKey resolution.
  const rung = ROW_FOR_SIZE[size] ?? ROW_FOR_SIZE.md;
  if (item.type === 'separator') {
    return (
      <div
        role="separator"
        style={{
          height: '1px',
          // The panel contributes 4px; spacing[2] supplies the remaining 8px
          // required by the system's 12px divider inset, matching PanelMenu.
          margin: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
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
        // Stated height, not padding — the row rides the same control ladder
        // as its trigger, so the vertical rhythm is the rung, not the box's
        // own top/bottom padding.
        height: rung.height,
        padding: `0 ${tokens.spacing[3]}`,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: tokens.typography.fontMono,
        // Rung text, not a flat xs — the old 10px also sat under the 12px
        // legibility floor for interactive text (this row is a button).
        fontSize: rung.text,
        fontWeight: tokens.typography.weight.medium,
        color: baseColor,
        textAlign: 'left',
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.wide,
        whiteSpace: 'nowrap',
        transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}, color ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
      }}
    >
      {/* Row icons ride the rung's icon size, same ladder as PanelMenu. */}
      {Icon
        ? <Icon size={rung.icon} weight="regular" />
        : <span style={{ width: `${rung.icon}px` }} />}
      <span style={{ flex: 1 }}>{item.label}</span>
    </button>
  );
}

/**
 * Shared panel — renders the floating menu surface and its items.
 * Visibility, placement, and alignment are controlled by props so
 * each trigger component can pick its own canonical defaults.
 *
 * The panel is the trigger's continuation, not a separate surface with its
 * own opinion — so it takes the trigger's `size` and its rows step with it.
 * A fixed row height meant an sm trigger opened a menu built for a
 * different control; the popover should read like part of the same control,
 * not a fresh one bolted on.
 */
export function UserMenuPanel({ open, items, size = 'md', placement = 'bottom', align = 'start', panelMinWidth = 200, ariaLabel = 'User menu', onClose }) {
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
      onKeyDown={handleMenuKeyDown}
      className="andromeda-user-menu-panel"
      data-align={align}
      // The direction is an inline `top:`/`bottom:` offset, which no ancestor
      // rule can read. Stating it as an attribute lets a page reserve room on
      // the side the panel actually opens toward. Paints nothing itself.
      data-placement={placement}
      style={{
        position: 'absolute',
        ...vertical,
        ...horizontal,
        // Rows are separated, not stacked flush: 4px of ground between them so
        // the highlight of a hovered row reads as one object rather than a
        // block sliced out of a column.
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing[1],
        minWidth: `${panelMinWidth}px`,
        // Cap to a token-inset of the viewport so the absolutely-positioned
        // panel can never push past the screen and force horizontal page
        // scroll on a phone. box-sizing keeps the border inside that cap.
        maxWidth: `calc(100vw - ${tokens.spacing[4]})`,
        boxSizing: 'border-box',
        background: tokens.color.surface.raised,
        border: `${tokens.border.thin} ${tokens.color.border.base}`,
        borderRadius: tokens.radius.frame,
        // Rows already supply spacing[2] vertically and spacing[3] horizontally.
        // This remainder puts their icon-and-label content in the same 16px
        // frame on all four edges as PanelMenu.
        padding: `${tokens.spacing[2]} ${tokens.spacing[1]}`,
        zIndex: 1000,
        boxShadow: 'var(--andromeda-shadow-md, 0 8px 21.6px rgba(0, 0, 0, 0.45))',
      }}
    >
      {items.map((item, i) => (
        <UserMenuItemRow key={item.id ?? i} item={item} onClose={onClose} size={size} />
      ))}
    </div>
  );
}

// Hover/focus styles for the menuitem buttons. Marked `!important`
// because the buttons carry inline `style={{ background:'transparent' }}`
// which would otherwise beat any non-important class rule — same
// precedence trap covered in the Andromeda interaction-states rules.
function UserMenuStyles() {
  return (
    <style>{`
      .andromeda-user-menu-item:hover {
        background: var(--andromeda-surface-hover) !important;
        color: var(--andromeda-text-primary) !important;
      }
      .andromeda-user-menu-item[data-destructive="true"]:hover {
        background: var(--andromeda-surface-hover) !important;
        color: var(--andromeda-red-200) !important;
      }
      .andromeda-user-menu-item:active {
        background: var(--andromeda-surface-active) !important;
      }
      .andromeda-user-menu-item:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 1px var(--andromeda-accent-400);
      }
      /* Phone fit — a start-aligned (left:0) panel anchored to a trigger that
         sits in the right half of a phone would open off the right edge. Below
         sm, pin it to the trigger's RIGHT edge instead so it stays on-screen.
         stretch (left:0 + right:0) and end (right:0) are already viewport-safe.
         !important: left/right are inline styles (the Andromeda interaction-states rules). */
      ${mq.sm} {
        .andromeda-user-menu-panel[data-align="start"] {
          left: auto !important;
          right: 0 !important;
        }
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
 * @property {'online'|'busy'|'away'|'offline'} [status] Presence state; passed to Avatar for the status dot.
 * @property {'sm'|'md'|'lg'} [size='md'] Scales the whole trigger: avatar (24/32/40), padding, gap and chevron. The popover rows follow the same rung. Replaces the older `avatarSize` prop, which scaled only the avatar; a copy still passing `avatarSize` renders md.
 * @property {UserMenuItem[]} items The menu rows to render, including separators.
 * @property {'top'|'bottom'} [placement='bottom'] Whether the panel opens below or above the trigger.
 * @property {'start'|'end'} [align='end'] Which trigger edge the panel aligns to horizontally.
 * @property {boolean} [defaultOpen=false] Render the menu pre-opened (showcases / docs). Outside-click and Escape still dismiss it.
 * @property {boolean} [staticOpen=false] Render pre-opened AND pinned; outside-click / Escape do not dismiss it. For showcases / docs where several popovers are shown open at once and one must not close the others.
 * @property {string} [ariaLabel='User menu'] Accessible label for the trigger button and menu panel.
 * @property {string} [className] Class name applied to the wrapper element.
 * @property {React.CSSProperties} [style] Inline styles merged onto the wrapper element.
 */

/** @type {React.ForwardRefExoticComponent<UserMenuProps>} */
export const UserMenu = forwardRef(function UserMenu(
  {
    name,
    src,
    status,
    size = 'md',
    items,
    placement = 'bottom',
    align = 'end',
    defaultOpen = false,
    staticOpen = false,
    ariaLabel = 'User menu',
    className,
    style,
    ...props
  },
  ref,
) {
  // Resolve the rung once. `size` comes from a caller, so an unrecognised value
  // must fall back to md instead of throwing on `rung.padY` and taking the whole
  // subtree down. The same key feeds the chevron and the Avatar so all three
  // land on one rung. Same guard as PanelHeader.
  const sizeKey = TRIGGER_FOR_SIZE[size] ? size : 'md';
  const rung = TRIGGER_FOR_SIZE[sizeKey];
  const { open, wrapperRef, triggerProps, close } = useUserMenuPanel(defaultOpen, staticOpen);
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
      // The rung that actually rendered, after the default and the guard above.
      // A default never appears in props, so <UserMenu /> is otherwise
      // un-inspectable.
      data-size={sizeKey}
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
          gap: rung.gap,
          padding: `${rung.padY} ${rung.padX}`,
          cursor: 'pointer',
          background: highlight ? tokens.color.surface.hover : 'transparent',
          transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        }}
      >
        <Avatar name={name} src={src} status={status} size={sizeKey} />
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
          <CaretUpDown size={CHEVRON_FOR_SIZE[sizeKey]} weight="regular" />
        </motion.span>
      </button>

      <UserMenuPanel
        open={open}
        items={items}
        size={sizeKey}
        placement={placement}
        align={align}
        ariaLabel={ariaLabel}
        onClose={close}
      />
      <UserMenuStyles />
    </div>
  );
});
