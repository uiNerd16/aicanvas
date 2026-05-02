// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// EXCHANGE TERMINAL · Dropdown
// Lightweight chevron-menu primitive used by every "▾" trigger
// in the terminal (top-bar nav, timeframe chips, pair tabs, etc).
// Closes on outside click and on item selection.
// ============================================================

'use client';

import { useEffect, useRef, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { tokens } from '../../tokens';

export function Dropdown({
  label,
  items,
  align = 'left',
  active = false,
  variant = 'nav',  // 'nav' | 'tab' | 'chip' | 'chunk'
  leadingBadge = null,
  iconSize = 10,
  selected = null,  // optional: highlight the active item by label
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  // Trigger styles per variant.
  const triggerStyle = {
    nav: {
      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
      fontSize: tokens.typography.size.sm,
      color: tokens.color.text.primary,
      letterSpacing: tokens.typography.tracking.wider,
    },
    tab: {
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      fontSize: tokens.typography.size.sm,
      color: active ? tokens.color.text.primary : tokens.color.text.muted,
      letterSpacing: tokens.typography.tracking.normal,
    },
    chip: {
      padding: `${tokens.spacing[2]} ${tokens.spacing[2]}`,
      fontSize: tokens.typography.size.sm,
      color: active ? tokens.color.accent[200] : tokens.color.text.secondary,
      letterSpacing: tokens.typography.tracking.wider,
    },
    chunk: {
      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
      fontSize: tokens.typography.size.sm,
      color: tokens.color.text.secondary,
      letterSpacing: tokens.typography.tracking.wide,
      border: `${tokens.border.thin} ${tokens.color.border.base}`,
      background: tokens.color.surface.hover,
    },
  }[variant];

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        className="ex-btn-hover"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: tokens.spacing[1],
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: tokens.typography.fontMono,
          fontWeight: active
            ? tokens.typography.weight.semibold
            : tokens.typography.weight.medium,
          textTransform: 'uppercase',
          ...triggerStyle,
        }}
      >
        {label}
        {leadingBadge}
        <CaretDown
          weight="regular"
          size={iconSize}
          style={{
            color: tokens.color.text.muted,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 160ms ease',
          }}
        />
      </button>

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
            boxShadow: `0 12px 28px rgba(0, 0, 0, 0.55)`,
          }}
        >
          {items.map((item) => {
            const isSelected = selected != null && item === selected;
            return (
              <button
                key={item}
                type="button"
                role="menuitem"
                className="ex-menu-item-hover"
                onClick={() => {
                  if (onSelect) onSelect(item);
                  setOpen(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
                  background: isSelected
                    ? tokens.color.surface.active
                    : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: tokens.typography.fontMono,
                  fontSize: tokens.typography.size.sm,
                  fontWeight: isSelected
                    ? tokens.typography.weight.semibold
                    : tokens.typography.weight.regular,
                  color: isSelected
                    ? tokens.color.accent[200]
                    : tokens.color.text.secondary,
                  textAlign: 'left',
                  textTransform: 'uppercase',
                  letterSpacing: tokens.typography.tracking.wide,
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
