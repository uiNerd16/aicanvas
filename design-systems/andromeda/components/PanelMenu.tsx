// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: PanelMenu
// Kebab-trigger overflow menu for panel headers. Trigger is an
// IconButton (size sm, ghost). Menu opens beneath it — or flips
// above when a downward menu wouldn't fit on screen (e.g. the kebab
// on the last row of a scrolled table). Supports items with optional
// icons and a single level of submenu (right-flyout). Closes on
// outside click and on Escape.
// ============================================================

'use client';

import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CaretRight, DotsThreeVertical } from '@phosphor-icons/react';
import { tokens } from '../tokens';
import { IconButton } from './IconButton';
import { andromedaVars } from './lib/utils';

/**
 * @typedef {object} MenuItem
 * @property {string}   [label] Text shown for the menu item.
 * @property {React.ComponentType<{ size?: number, weight?: string }>} [icon] Icon rendered to the left of the label.
 * @property {() => void} [onSelect] Handler called when the item is chosen (ignored on items with a submenu).
 * @property {MenuItem[]} [submenu] Nested items opened as a flyout submenu.
 * @property {boolean}  [selected] Marks the item as the active choice, styling it accordingly.
 * @property {boolean}  [destructive] Renders the item label in the destructive red color.
 * @property {'separator'} [type] Set to 'separator' to render a divider rule instead of a clickable item.
 */

/**
 * @typedef {object} PanelMenuProps
 * @property {MenuItem[]} items Entries rendered in the menu, in order.
 * @property {'left'|'right'} [align='right'] Edge of the trigger the menu aligns to.
 * @property {'sm'|'md'|'lg'} [size='md'] Trigger size, forwarded straight to
 *   IconButton. `md` is the panel-header default. Drop to `sm` when the menu is
 *   a per-row overflow inside a dense table, where a 34px square would set the
 *   row height. The rows follow the same rung as the trigger.
 * @property {string} [ariaLabel='Panel options'] Accessible label for the kebab trigger button and menu.
 * @property {boolean} [defaultOpen=false] Render the menu pre-opened. Useful in
 *   showcases / docs so the consumer can see the menu contents without first
 *   having to click the trigger. Click-outside and Escape still dismiss it.
 * @property {boolean} [staticOpen=false] Like defaultOpen, but the menu stays
 *   open: the click-outside and Escape dismissers are not attached. For
 *   showcases / docs where the menu must remain visible as the reader scrolls
 *   past, so the component reads as a menu without any interaction. The trigger
 *   cannot toggle it. Not for product UI; a real overflow menu must dismiss.
 * @property {string} [className] Extra class applied to the wrapper element.
 * @property {React.CSSProperties} [style] Inline styles merged onto the wrapper element.
 */

// Row geometry per rung — kept IDENTICAL to UserMenu's copy of this const;
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

// Layout effect on the client (runs before paint so the flip lands without a
// flash), plain effect on the server (avoids the useLayoutEffect SSR warning
// when a staticOpen menu is server-rendered).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Shared panel chrome for the dropdown (inline and portaled paths).
// maxWidth / maxHeight cap the menu to a token-inset of the viewport so a wide
// or tall menu on a phone never forces page scroll; a taller-than-viewport menu
// scrolls internally instead of spilling off the bottom edge. boxSizing keeps
// the border inside that cap.
const MENU_PANEL_STYLE = {
  // Rows are separated, not stacked flush: 4px of ground between them so the
  // highlight of a hovered row reads as one object rather than a block sliced
  // out of a column. Same gap as UserMenu's panel.
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing[1],
  minWidth: '160px', // ponytail: identity constant, no token
  maxWidth: `calc(100vw - ${tokens.spacing[4]})`,
  maxHeight: `calc(100vh - ${tokens.spacing[4]})`,
  overflowY: 'auto',
  boxSizing: 'border-box',
  background: tokens.color.surface.overlay,
  border: `${tokens.border.thin} ${tokens.color.border.bright}`,
  borderRadius: tokens.radius.frame,
  // A 16px frame measured to the row INK, not to the row box. Inline: rows
  // supply spacing[3] and the panel the remaining spacing[1]. Block: a row is
  // ROW_FOR_SIZE[rung].height tall with its label centred, so it already
  // carries its own leading above the first label and below the last —
  // spacing[4] on top of that read as a top and bottom margin twice the
  // sides. spacing[3] lands the ink at the same 16px.
  padding: `${tokens.spacing[3]} ${tokens.spacing[1]}`,
  zIndex: 1000,
  boxShadow: tokens.effect.shadowMd,
};

// Roving arrow-key navigation for a `role="menu"` container. Queries the
// direct menuitem buttons, finds the focused one, and moves focus up/down
// with wrap-around. Home/End jump to first/last. Separators are ignored
// because they are not `role="menuitem"` buttons. Shared by the top-level
// menu and any open submenu — each gets its own onKeyDown bound to its own
// container, and stopPropagation keeps an inner submenu's keys from also
// being handled by the parent menu.
function handleMenuKeyDown(e) {
  const container = e.currentTarget;
  const itemsList = Array.from(
    container.querySelectorAll(':scope > div > button[role="menuitem"]'),
  );
  if (itemsList.length === 0) return;

  const current = document.activeElement;
  const idx = itemsList.indexOf(current);

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    e.stopPropagation();
    const next = idx < 0 ? 0 : (idx + 1) % itemsList.length;
    itemsList[next].focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    e.stopPropagation();
    const prev = idx < 0 ? itemsList.length - 1 : (idx - 1 + itemsList.length) % itemsList.length;
    itemsList[prev].focus();
  } else if (e.key === 'Home') {
    e.preventDefault();
    e.stopPropagation();
    itemsList[0].focus();
  } else if (e.key === 'End') {
    e.preventDefault();
    e.stopPropagation();
    itemsList[itemsList.length - 1].focus();
  }
}

function MenuItem({ item, onClose, menuOwnerId, size = 'md' }) {
  // Falls back to md on an unrecognised size instead of throwing on
  // `rung.height` — same guard as PanelMenu's own size resolution.
  const rung = ROW_FOR_SIZE[size] ?? ROW_FOR_SIZE.md;
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const itemRef = useRef(null);
  const buttonRef = useRef(null);
  const submenuRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // When the submenu opens via keyboard (ArrowRight), move focus into its
  // first item. Guarded by the keyboard-open flag so hover-opening the
  // submenu never steals focus from the pointer.
  const submenuOpenedByKey = useRef(false);
  useEffect(() => {
    if (submenuOpen && submenuOpenedByKey.current && submenuRef.current) {
      const first = submenuRef.current.querySelector('button[role="menuitem"]');
      if (first) first.focus();
    }
    if (!submenuOpen) submenuOpenedByKey.current = false;
  }, [submenuOpen]);

  // Submenu side is measured, not breakpoint-driven: default to a right-flyout
  // (left:100%) and flip to a left-flyout (right:100%) ONLY when the right side
  // would overflow the viewport AND the left side has room. A blind CSS flip
  // below `md` just moves the overflow to the opposite edge — off the LEFT edge
  // when the parent menu is clamped near x=0 on a phone. Mirrors the parent
  // menu's reposition clamp; runs before paint, re-measures on resize/scroll.
  // The percentages above describe the same edge geometry the portal expresses
  // in fixed viewport coordinates; fixed placement is what escapes the panel's
  // intentional tall-menu scrollport.
  const [submenuCoords, setSubmenuCoords] = useState(null);
  useIsomorphicLayoutEffect(() => {
    if (!submenuOpen) return;
    const decide = () => {
      const itemEl = itemRef.current;
      const sub = submenuRef.current;
      if (!itemEl || !sub) return;
      const margin = parseInt(tokens.spacing[2], 10) || 8;
      const gap = parseInt(tokens.spacing[1], 10) || 4;
      const ir = itemEl.getBoundingClientRect();
      const sr = sub.getBoundingClientRect();
      const rightLeft = ir.right + gap;
      const leftLeft = ir.left - gap - sr.width;
      const rightOverflows = rightLeft + sr.width > window.innerWidth - margin;
      const leftFits = leftLeft >= margin;
      let left = rightOverflows && leftFits ? leftLeft : rightLeft;
      let top = ir.top;
      // The submenu is portaled out of the scrolling parent below. Clamp its
      // fixed coordinates here so escaping that clip cannot trade it for
      // viewport overflow at either edge.
      left = Math.max(margin, Math.min(left, window.innerWidth - sr.width - margin));
      top = Math.max(margin, Math.min(top, window.innerHeight - sr.height - margin));
      setSubmenuCoords({ top, left });
    };
    decide();
    window.addEventListener('resize', decide);
    window.addEventListener('scroll', decide, true);
    return () => {
      window.removeEventListener('resize', decide);
      window.removeEventListener('scroll', decide, true);
    };
  }, [submenuOpen]);

  if (item.type === 'separator') {
    return (
      <div
        role="separator"
        style={{
          height: tokens.border.width[1],
          // The panel contributes 4px; spacing[2] supplies the remaining 8px
          // required by the system's 12px divider inset.
          margin: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
          background: tokens.color.border.base,
        }}
      />
    );
  }

  const Icon = item.icon;
  const hasSub = Array.isArray(item.submenu) && item.submenu.length > 0;

  // Hover-with-grace-period so the user can move the cursor across the gap
  // between the parent item and the submenu without the submenu collapsing.
  function handleEnter() {
    clearTimeout(closeTimer.current);
    if (hasSub) setSubmenuOpen(true);
  }
  function handleLeave() {
    if (hasSub) {
      // Nearest system duration to the former 120ms grace period.
      closeTimer.current = setTimeout(() => setSubmenuOpen(false), parseInt(tokens.motion.duration.normal, 10));
    }
  }

  function handleClick() {
    if (hasSub) {
      setSubmenuOpen((o) => !o);
      return;
    }
    item.onSelect?.();
    onClose();
  }

  // ArrowRight opens the submenu and focuses into it; ArrowLeft (handled on
  // the submenu container) closes it and returns focus to this parent button.
  function handleButtonKeyDown(e) {
    if (hasSub && e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      submenuOpenedByKey.current = true;
      setSubmenuOpen(true);
    }
  }

  function handleSubmenuKeyDown(e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      setSubmenuOpen(false);
      buttonRef.current?.focus();
    }
  }

  const color = item.destructive
    ? tokens.color.red[300]
    : item.selected
      ? tokens.color.text.primary
      : tokens.color.text.secondary;

  return (
    <div
      ref={itemRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ position: 'relative' }}
    >
      <button
        ref={buttonRef}
        type="button"
        role="menuitem"
        aria-haspopup={hasSub ? 'menu' : undefined}
        aria-expanded={hasSub ? submenuOpen : undefined}
        onClick={handleClick}
        onKeyDown={handleButtonKeyDown}
        className="andromeda-panel-menu-item"
        data-selected={item.selected ? 'true' : 'false'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          width: '100%',
          height: rung.height,
          padding: `0 ${tokens.spacing[3]}`,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: tokens.typography.fontMono,
          fontSize: rung.text,
          fontWeight: item.selected ? tokens.typography.weight.medium : tokens.typography.weight.regular,
          color,
          textAlign: 'left',
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wide,
          whiteSpace: 'nowrap',
          transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}, color ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        }}
      >
        {/* Row icons ride the rung's icon size, same ladder as UserMenu. */}
        {Icon
          ? <Icon size={rung.icon} weight="regular" />
          : <span style={{ width: `${rung.icon}px` }} />}
        <span style={{ flex: 1 }}>{item.label}</span>
        {hasSub ? <CaretRight size={10} weight="bold" /> : null}
      </button>

      {/* Right-flyout submenu — portaled so the parent's deliberate tall-menu
          scroll cannot turn the sideways flyout into scrollable overflow. */}
      {hasSub && submenuOpen ? createPortal(
        <div
          ref={submenuRef}
          role="menu"
          aria-label={`${item.label} submenu`}
          className="andro-submenu"
          data-panel-menu-owner={menuOwnerId}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onKeyDown={(e) => {
            handleSubmenuKeyDown(e);
            handleMenuKeyDown(e);
          }}
          style={{
            ...andromedaVars(),
            ...MENU_PANEL_STYLE,
            position: 'fixed',
            top: submenuCoords ? submenuCoords.top : 0,
            left: submenuCoords ? submenuCoords.left : 0,
            visibility: submenuCoords ? 'visible' : 'hidden',
            zIndex: 1001,
          }}
        >
          {item.submenu.map((sub, i) => (
            <MenuItem key={i} item={sub} onClose={onClose} menuOwnerId={menuOwnerId} size={size} />
          ))}
        </div>,
        document.body,
      ) : null}
    </div>
  );
}

/** @type {React.ForwardRefExoticComponent<PanelMenuProps & React.HTMLAttributes<HTMLDivElement>>} */
export const PanelMenu = forwardRef(function PanelMenu(
  { items, align = 'right', size = 'md', ariaLabel = 'Panel options', defaultOpen = false, staticOpen = false, className, style, ...props },
  ref,
) {
  // Resolve once for the rows below — an unrecognised size must fall back to
  // md instead of throwing when MenuItem indexes ROW_FOR_SIZE. IconButton
  // already defends its own size prop, so only the rows need this guard.
  const rowSize = ROW_FOR_SIZE[size] ? size : 'md';
  const [open, setOpen] = useState(defaultOpen || staticOpen);
  // Interactive menus portal to <body> and position with `fixed` coords, so they
  // sit in the top layer — never clipped by an `overflow` container, never
  // stacked under sibling table rows — and flip above the trigger when a
  // downward menu would fall off the bottom of the viewport. staticOpen (docs)
  // menus stay inline in normal flow on purpose.
  const [coords, setCoords] = useState(null);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);
  const menuOwnerId = useId();
  useEffect(() => setMounted(true), []);
  // The element to return focus to when the menu closes — captured at the
  // moment the trigger toggles the menu open (interactive open only).
  const returnFocusRef = useRef(null);

  // Focus the first menuitem when the panel opens — but NEVER in staticOpen
  // mode, where multiple pinned menus would fight over focus.
  useEffect(() => {
    if (!open || staticOpen) return;
    const first = menuRef.current?.querySelector('button[role="menuitem"]');
    if (first) first.focus();
  }, [open, staticOpen, mounted]);

  // Return focus to the trigger when the menu closes after an interactive
  // open. Skipped in staticOpen mode (no focus stealing on showcase pages).
  useEffect(() => {
    if (open || staticOpen) return;
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (target) target.focus();
  }, [open, staticOpen]);

  useEffect(() => {
    // staticOpen pins the menu open (showcase/docs) — skip the dismissers so it
    // survives outside clicks and scrolling.
    if (!open || staticOpen) return;
    function onClick(e) {
      // The portaled menu lives outside the wrapper, so check it too — otherwise
      // clicking a menu item would register as an outside click and close before
      // the item fires.
      const inWrapper = wrapperRef.current && wrapperRef.current.contains(e.target);
      const inMenu = menuRef.current && menuRef.current.contains(e.target);
      // Submenus are portaled to <body> to escape the parent scrollport, so
      // DOM containment cannot identify them as part of this menu. The stable
      // owner marker keeps a submenu click from dismissing before its item can
      // receive the corresponding click event.
      const inSubmenu = typeof e.composedPath === 'function' && e.composedPath().some(
        (node) => node instanceof HTMLElement && node.dataset.panelMenuOwner === menuOwnerId,
      );
      if (!inWrapper && !inMenu && !inSubmenu) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, staticOpen, menuOwnerId]);

  // Position the portaled (interactive) menu in viewport coords, flipping above
  // the trigger when a downward menu wouldn't fit. Measured in a layout effect
  // so it lands before paint (no flash), and recomputed on scroll/resize so the
  // menu stays pinned to its trigger. staticOpen menus are inline — skipped here.
  useIsomorphicLayoutEffect(() => {
    if (staticOpen) return;
    if (!open) { setCoords(null); return; }
    const reposition = () => {
      const trigger = wrapperRef.current;
      const menu = menuRef.current;
      if (!trigger || !menu) return;
      const margin = parseInt(tokens.spacing[2], 10) || 8;
      const tr = trigger.getBoundingClientRect();
      const mr = menu.getBoundingClientRect();
      const fitsDown = tr.bottom + margin + mr.height <= window.innerHeight - margin;
      const fitsUp = tr.top - margin - mr.height >= margin;
      let top = !fitsDown && fitsUp ? tr.top - margin - mr.height : tr.bottom + margin;
      // Clamp vertically so a menu taller than the gap (or taller than the
      // whole viewport on a phone) can never spill off the bottom or top edge.
      // The panel itself caps its height (maxHeight below) and scrolls, so the
      // clamped top keeps the first item on-screen either way.
      top = Math.max(margin, Math.min(top, window.innerHeight - mr.height - margin));
      let left = align === 'right' ? tr.right - mr.width : tr.left;
      left = Math.max(margin, Math.min(left, window.innerWidth - mr.width - margin));
      setCoords({ top, left });
    };
    reposition();
    window.addEventListener('scroll', reposition, true); // capture: catch scroll in any ancestor
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
    // `mounted` is a dep so a defaultOpen menu repositions once the portal
    // actually mounts (the menu ref doesn't exist until then).
  }, [open, staticOpen, align, mounted]);

  return (
    <div
      ref={(node) => {
        wrapperRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="panel-menu"
      // The rung that actually rendered — the default never appears in props,
      // so <PanelMenu /> is otherwise un-inspectable.
      data-size={rowSize}
      className={className}
      style={{ ...andromedaVars(), position: 'relative', display: 'inline-flex', ...style }}
      {...props}
    >
      <IconButton
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        variant="ghost"
        // Defaults to md — the shared control ladder's 34px box with an 18px
        // glyph. md is what reads correctly beside a panel title; sm (a 28px
        // box, 16px glyph) is for dense table rows, where the trigger must not
        // be the thing setting the row height.
        size={size}
        icon={DotsThreeVertical}
        onClick={(e) => {
          if (staticOpen) return;
          // Capture the trigger as the focus-return target before opening.
          if (!open && !staticOpen) returnFocusRef.current = e.currentTarget;
          setOpen((o) => !o);
        }}
        data-state={open ? 'open' : 'closed'}
        style={open ? {
          background: tokens.color.surface.active,
          color: tokens.color.text.primary,
        } : undefined}
      />

      {open ? (
        staticOpen ? (
          // Docs / showcase: inline absolute under the trigger, in normal flow.
          <div
            ref={menuRef}
            role="menu"
            aria-label={ariaLabel}
            onKeyDown={handleMenuKeyDown}
            style={{
              position: 'absolute',
              top: `calc(100% + ${tokens.spacing[2]})`,
              [align === 'right' ? 'right' : 'left']: 0,
              ...MENU_PANEL_STYLE,
            }}
          >
            {items.map((item, i) => (
              <MenuItem key={i} item={item} onClose={() => setOpen(false)} menuOwnerId={menuOwnerId} size={rowSize} />
            ))}
          </div>
        ) : mounted ? (
          // Product: portal to <body>, fixed coords → top layer, never clipped.
          createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label={ariaLabel}
              onKeyDown={handleMenuKeyDown}
              style={{
                ...andromedaVars(),
                position: 'fixed',
                top: coords ? coords.top : 0,
                left: coords ? coords.left : 0,
                visibility: coords ? 'visible' : 'hidden',
                ...MENU_PANEL_STYLE,
              }}
            >
              {items.map((item, i) => (
                <MenuItem key={i} item={item} onClose={() => setOpen(false)} menuOwnerId={menuOwnerId} size={rowSize} />
              ))}
            </div>,
            document.body,
          )
        ) : null
      ) : null}

      <style>{`
        /* !important is required: the menuitem button carries inline
           style={{ background:'transparent', color }} which would otherwise
           beat any class rule on hover/active. Same precedence trap as
           DateRangePicker — see the Andromeda interaction-states rules. */
        .andromeda-panel-menu-item:hover {
          background: var(--andromeda-surface-hover) !important;
          color: var(--andromeda-text-primary) !important;
        }
        .andromeda-panel-menu-item:active {
          background: var(--andromeda-surface-active) !important;
          color: var(--andromeda-text-primary) !important;
        }
        .andromeda-panel-menu-item[data-selected="true"] {
          background: var(--andromeda-surface-active) !important;
          color: var(--andromeda-text-primary) !important;
        }
        .andromeda-panel-menu-item:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 ${tokens.border.width[1]} var(--andromeda-accent-400);
        }
      `}</style>
    </div>
  );
});
