// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: SegmentedControl
// shadcn/ui-aligned API: controlled `value` / `onChange`, options
// array, sized variants. A row of icon-or-label buttons with a
// sliding `surface.active` background that translates between
// segments when the active value changes.
// ============================================================

'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn, andromedaVars } from './lib/utils';
import { tokens } from '../tokens';

const SIZE_PX = {
  sm: 24,
  md: 32,
  lg: 40,
};

const ICON_PX = {
  sm: 14,
  md: 16,
  lg: 18,
};

/**
 * @typedef {object} SegmentOption
 * @property {string} value
 * @property {string} [label]
 * @property {React.ComponentType<{ size?: number, weight?: string }>} [icon]
 * @property {string} [ariaLabel]
 */

/**
 * @typedef {object} SegmentedControlProps
 * @property {string} value
 * @property {(next: string) => void} onChange
 * @property {SegmentOption[]} options
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<SegmentedControlProps & React.HTMLAttributes<HTMLDivElement>>} */
export const SegmentedControl = forwardRef(function SegmentedControl(
  { className, value, onChange, options, size = 'md', style, ...props },
  ref,
) {
  const itemRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  // Measure the active segment's box and position the indicator over it.
  // Re-measure on value change AND on container resize so the indicator
  // tracks accurately when the parent reflows.
  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value);
    const el = itemRefs.current[idx];
    if (!el) return;
    const measure = () => {
      setIndicator({
        left: el.offsetLeft,
        width: el.offsetWidth,
        ready: true,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value, options]);

  const cellSize = SIZE_PX[size] ?? SIZE_PX.md;
  const iconSize = ICON_PX[size] ?? ICON_PX.md;

  return (
    <div
      ref={ref}
      role="tablist"
      data-size={size}
      data-slot="segmented-control"
      className={cn('inline-flex relative select-none', className)}
      style={{
        ...andromedaVars(),
        height: `${cellSize}px`,
        border: `${tokens.border.thin} ${tokens.color.border.base}`,
        background: tokens.color.surface.raised,
        ...style,
      }}
      {...props}
    >
      {/* Sliding indicator — absolutely positioned, transitions between segments */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${indicator.width}px`,
          transform: `translateX(${indicator.left}px)`,
          background: tokens.color.surface.active,
          transition: indicator.ready
            ? 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1), width 220ms cubic-bezier(0.32, 0.72, 0, 1)'
            : 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {options.map((opt, i) => {
        const Icon = opt.icon;
        const active = opt.value === value;
        const showLabel = !Icon && opt.label;
        return (
          <button
            key={opt.value}
            ref={(el) => { itemRefs.current[i] = el; }}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={opt.ariaLabel ?? opt.label}
            onClick={() => onChange(opt.value)}
            data-active={active}
            className="andromeda-segmented-item"
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: tokens.spacing[2],
              minWidth: showLabel ? undefined : `${cellSize}px`,
              height: '100%',
              padding: showLabel ? `0 ${tokens.spacing[3]}` : 0,
              background: 'transparent',
              border: 'none',
              borderLeft: i === 0 ? 'none' : `${tokens.border.thin} ${tokens.color.border.base}`,
              cursor: 'pointer',
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.sm,
              fontWeight: active ? tokens.typography.weight.medium : tokens.typography.weight.regular,
              color: active ? tokens.color.text.primary : tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.wider,
              transition: 'color 140ms ease',
            }}
          >
            {Icon ? <Icon size={iconSize} weight="regular" /> : null}
            {opt.label && Icon ? <span>{opt.label}</span> : null}
            {showLabel ? opt.label : null}
          </button>
        );
      })}

      {/* Hover styles — inline rule injected once per render scope.
          The :hover psuedo-class can't be expressed with React inline styles. */}
      <style>{`
        .andromeda-segmented-item:hover[data-active="false"] {
          color: ${tokens.color.text.primary};
        }
        .andromeda-segmented-item:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 1px ${tokens.color.accent[400]};
        }
      `}</style>
    </div>
  );
});
