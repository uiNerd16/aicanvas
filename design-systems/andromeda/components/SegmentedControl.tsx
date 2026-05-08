// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: SegmentedControl
// shadcn/ui-aligned API: controlled `value` / `onChange`, options
// array, sized variants. A row of icon-or-label buttons with a
// `surface.active` fill that slides between segments via framer's
// `layoutId` — no manual measurement, no ResizeObserver, no raw
// timing strings. Token-driven duration + easing throughout.
// ============================================================

'use client';

import { forwardRef, useId } from 'react';
import { motion } from 'framer-motion';
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

const ms = (v) => parseInt(v, 10) / 1000;
// Inline cubic-bezier — framer wants arrays, tokens.motion.easing values are
// CSS strings. Keep in sync with tokens.motion.easing.standard.
const STANDARD_EASE = [0.4, 0, 0.2, 1];
const INDICATOR_TX = {
  duration: ms(tokens.motion.duration.slow),
  ease: STANDARD_EASE,
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
 * @property {string} [layoutGroupId]
 *   Override the auto-generated per-instance id only when you explicitly want
 *   two SegmentedControls to share their indicator (animating across both as
 *   one unit). The default `useId()` value scopes the indicator to a single
 *   control, which is what you want 99% of the time — without it, switching
 *   selections in one control makes the indicator fly between controls.
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<SegmentedControlProps & React.HTMLAttributes<HTMLDivElement>>} */
export const SegmentedControl = forwardRef(function SegmentedControl(
  { className, value, onChange, options, size = 'md', layoutGroupId, style, ...props },
  ref,
) {
  // Auto-scope the indicator's layoutId to this instance so multiple
  // SegmentedControls on the same page don't share the marker. Override
  // via `layoutGroupId` only when you explicitly want cross-instance
  // animation (rare).
  const generatedId = useId();
  const indicatorId = layoutGroupId ?? `andromeda-segmented-${generatedId}`;
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
      {options.map((opt, i) => {
        const Icon = opt.icon;
        const active = opt.value === value;
        const showLabel = !Icon && opt.label;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={opt.ariaLabel ?? opt.label}
            onClick={() => onChange(opt.value)}
            data-active={active}
            className="andromeda-segmented-item"
            style={{
              position: 'relative',
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
              transition: `color ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
            }}
          >
            {/* Sliding indicator — only the active button renders it.
                Framer's `layoutId` matches the new instance to the previous
                one and animates the layout change between siblings. */}
            {active ? (
              <motion.span
                layoutId={indicatorId}
                aria-hidden="true"
                transition={INDICATOR_TX}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: tokens.color.surface.active,
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />
            ) : null}
            <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: tokens.spacing[2] }}>
              {Icon ? <Icon size={iconSize} weight="regular" /> : null}
              {opt.label && Icon ? <span>{opt.label}</span> : null}
              {showLabel ? opt.label : null}
            </span>
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
