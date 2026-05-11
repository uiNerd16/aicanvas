// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: PanelMenu
// Kebab-trigger overflow menu for panel headers. Trigger is an
// IconButton (size sm, ghost). Menu opens beneath it, supports
// items with optional icons and a single level of submenu (right-
// flyout). Closes on outside click and on Escape.
// ============================================================

'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { CaretRight, DotsThreeVertical } from '@phosphor-icons/react';
import { tokens } from '../tokens';
import { IconButton } from './IconButton';
import { andromedaVars } from './lib/utils';

/**
 * @typedef {object} MenuItem
 * @property {string}   [label]
 * @property {React.ComponentType<{ size?: number, weight?: string }>} [icon]
 * @property {() => void} [onSelect]
 * @property {MenuItem[]} [submenu]
 * @property {boolean}  [selected]
 * @property {boolean}  [destructive]
 * @property {'separator'} [type]
 */

/**
 * @typedef {object} PanelMenuProps
 * @property {MenuItem[]} items
 * @property {'left'|'right'} [align='right']
 * @property {string} [ariaLabel='Panel options']
 * @property {boolean} [defaultOpen=false] Render the menu pre-opened. Useful in
 *   showcases / docs so the consumer can see the menu contents without first
 *   having to click the trigger. Click-outside and Escape still dismiss it.
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

const ITEM_HEIGHT = 26;

function MenuItem({ item, onClose }) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const itemRef = useRef(null);
  const closeTimer = useRef(null);

  if (item.type === 'separator') {
    return (
      <div
        aria-hidden="true"
        role="separator"
        style={{
          height: '1px',
          margin: `${tokens.spacing[1]} 0`,
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
      closeTimer.current = setTimeout(() => setSubmenuOpen(false), 120);
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
        type="button"
        role="menuitem"
        aria-haspopup={hasSub ? 'menu' : undefined}
        aria-expanded={hasSub ? submenuOpen : undefined}
        onClick={handleClick}
        className="andromeda-panel-menu-item"
        data-selected={item.selected ? 'true' : 'false'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          width: '100%',
          height: `${ITEM_HEIGHT}px`,
          padding: `0 ${tokens.spacing[3]}`,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          fontWeight: item.selected ? tokens.typography.weight.medium : tokens.typography.weight.regular,
          color,
          textAlign: 'left',
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wide,
          whiteSpace: 'nowrap',
          transition: 'background 100ms ease, color 100ms ease',
        }}
      >
        {Icon ? <Icon size={14} weight="regular" /> : <span style={{ width: '14px' }} />}
        <span style={{ flex: 1 }}>{item.label}</span>
        {hasSub ? <CaretRight size={10} weight="bold" /> : null}
      </button>

      {/* Right-flyout submenu */}
      {hasSub && submenuOpen ? (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 0,
            left: '100%',
            marginLeft: tokens.spacing[1],
            minWidth: '160px',
            background: tokens.color.surface.overlay,
            border: `${tokens.border.thin} ${tokens.color.border.bright}`,
            padding: tokens.spacing[1],
            zIndex: 1001,
            boxShadow: `0 12px 28px ${tokens.color.surface.alpha}`,
          }}
        >
          {item.submenu.map((sub, i) => (
            <MenuItem key={i} item={sub} onClose={onClose} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** @type {React.ForwardRefExoticComponent<PanelMenuProps & React.HTMLAttributes<HTMLDivElement>>} */
export const PanelMenu = forwardRef(function PanelMenu(
  { items, align = 'right', ariaLabel = 'Panel options', defaultOpen = false, className, style, ...props },
  ref,
) {
  const [open, setOpen] = useState(defaultOpen);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
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
  }, [open]);

  return (
    <div
      ref={(node) => {
        wrapperRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="panel-menu"
      className={className}
      style={{ ...andromedaVars(), position: 'relative', display: 'inline-flex', ...style }}
      {...props}
    >
      <IconButton
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        variant="ghost"
        size="sm"
        icon={DotsThreeVertical}
        onClick={() => setOpen((o) => !o)}
        data-state={open ? 'open' : 'closed'}
        style={open ? {
          background: tokens.color.surface.active,
          color: tokens.color.text.primary,
        } : undefined}
      />

      {open ? (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            [align === 'right' ? 'right' : 'left']: 0,
            minWidth: '160px',
            background: tokens.color.surface.overlay,
            border: `${tokens.border.thin} ${tokens.color.border.bright}`,
            padding: tokens.spacing[1],
            zIndex: 1000,
            boxShadow: `0 12px 28px ${tokens.color.surface.alpha}`,
          }}
        >
          {items.map((item, i) => (
            <MenuItem key={i} item={item} onClose={() => setOpen(false)} />
          ))}
        </div>
      ) : null}

      <style>{`
        /* !important is required: the menuitem button carries inline
           style={{ background:'transparent', color }} which would otherwise
           beat any class rule on hover/active. Same precedence trap as
           DateRangePicker — see rules.md "Hover on inline-styled controls". */
        .andromeda-panel-menu-item:hover {
          background: ${tokens.color.surface.hover} !important;
          color: ${tokens.color.text.primary} !important;
        }
        .andromeda-panel-menu-item:active {
          background: ${tokens.color.surface.active} !important;
          color: ${tokens.color.text.primary} !important;
        }
        .andromeda-panel-menu-item[data-selected="true"] {
          background: ${tokens.color.surface.active} !important;
          color: ${tokens.color.text.primary} !important;
        }
        .andromeda-panel-menu-item:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 1px ${tokens.color.accent[400]};
        }
      `}</style>
    </div>
  );
});
