// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: SegmentedControl
// shadcn/ui-aligned API: controlled `value` / `onChange`, options
// array, sized variants. A row of buttons carrying an icon, a label,
// or both, with a
// `surface.active` fill that slides between segments via framer's
// `layoutId` — no manual measurement, no ResizeObserver, no raw
// timing strings. Token-driven duration + easing throughout.
// ============================================================

'use client';

import { forwardRef, useId } from 'react';
import { motion } from 'framer-motion';
import { cn, andromedaVars, easingArray } from './lib/utils';
import { mq } from './lib/responsive';
import { tokens } from '../tokens';
import { useReducedMotion } from './lib/motion';

// Narrow-width overflow guard — a multi-segment strip can be wider than a phone
// viewport. Faithful-stack rule (mirrors the Table): the strip scrolls
// HORIZONTALLY inside its own box, never wraps (wrapping would break the
// fixed-height row, the borderLeft dividers, and the sliding indicator) and
// never forces page scroll. Below `md` the control is capped at max-width:100%
// and its segments scroll within. The buttons are flex-shrink:0 so they keep
// their tap size while scrolling. !important to beat the inline-styled root.
// the Andromeda responsive rules (faithful stack, no horizontal PAGE scroll).
const RESPONSIVE_STYLE = `
  ${mq.md} {
    .andromeda-segmented {
      display: flex !important;
      max-width: 100% !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch;
      /* Hide the scroll affordance. The strip has a fixed ladder height
         (28/34/40px); a classic, space-consuming horizontal scrollbar (narrow
         desktop window, some platforms) would eat that height and vertically
         crush the segment row. Scrolling still works — the gutter just isn't
         painted. */
      scrollbar-width: none !important;
    }
    .andromeda-segmented::-webkit-scrollbar { display: none !important; }
    .andromeda-segmented > .andromeda-segmented-item {
      flex-shrink: 0 !important;
    }
  }
`;

// CSS var per size, pointing at the shared control ladder instead of the
// spacing grid it happens to duplicate today: a theme that retunes
// tokens.control has to move this strip along with the Buttons beside it.
const SIZE_VAR = {
  sm: '--andromeda-control-sm',
  md: '--andromeda-control-md',
  lg: '--andromeda-control-lg',
};

const ICON_PX = {
  sm: 14,
  md: 16,
  lg: 18,
};

const ms = (v) => parseInt(v, 10) / 1000;
// framer boundary: derived from tokens, cannot follow runtime var overrides
const INDICATOR_TX = {
  duration: ms(tokens.motion.duration.slow),
  ease: easingArray(tokens.motion.easing.standard),
};

/**
 * @typedef {object} SegmentOption
 * @property {string} value Unique value that identifies this segment.
 * @property {string} [label] Text shown on the segment.
 * @property {React.ComponentType<{ size?: number, weight?: string }>} [icon] Icon component rendered in the segment, optionally alongside its label.
 * @property {string} [ariaLabel] Accessible name for the segment, falling back to label when omitted.
 */

/**
 * @typedef {object} SegmentedControlProps
 * @property {string} value Value of the currently selected segment.
 * @property {(next: string) => void} onChange Handler called with the value of the newly selected segment.
 * @property {SegmentOption[]} options Segments to render, in display order.
 * @property {string} ariaLabel Accessible name for the tablist; required when no surrounding label names the control.
 * @property {'sm'|'md'|'lg'} [size='md'] Height and icon-size preset for the control.
 * @property {string} [layoutGroupId]
 *   Override the auto-generated per-instance id only when you explicitly want
 *   two SegmentedControls to share their indicator (animating across both as
 *   one unit). The default `useId()` value scopes the indicator to a single
 *   control, which is what you want 99% of the time, without it, switching
 *   selections in one control makes the indicator fly between controls.
 * @property {string} [className] Extra classes merged onto the root element.
 * @property {React.CSSProperties} [style] Inline styles merged onto the root element.
 */

/** @type {React.ForwardRefExoticComponent<SegmentedControlProps & React.HTMLAttributes<HTMLDivElement>>} */
export const SegmentedControl = forwardRef(function SegmentedControl(
  { className, value, onChange, options, size = 'md', layoutGroupId, ariaLabel, style, ...props },
  ref,
) {
  // Auto-scope the indicator's layoutId to this instance so multiple
  // SegmentedControls on the same page don't share the marker. Override
  // via `layoutGroupId` only when you explicitly want cross-instance
  // animation (rare).
  const generatedId = useId();
  const reducedMotion = useReducedMotion();
  const indicatorId = layoutGroupId ?? `andromeda-segmented-${generatedId}`;
  // Resolve the rung ONCE. Three separate ?? fallbacks meant an out-of-ladder
  // value rendered md geometry while data-size still published the raw string,
  // so the inspector would read "xl" over a control that is md in every
  // dimension. Same guard shape the other sized components use.
  const sizeKey = tokens.control[size] ? size : 'md';
  const rung = tokens.control[sizeKey];
  const cellVar = SIZE_VAR[sizeKey];
  const iconSize = ICON_PX[sizeKey];

  function handleKeyDown(event, index) {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % options.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + options.length) % options.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = options.length - 1;
    else return;
    event.preventDefault();
    const tabs = event.currentTarget.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]');
    tabs?.[nextIndex]?.focus();
    onChange(options[nextIndex].value);
  }

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={ariaLabel}
      data-size={sizeKey}
      data-slot="segmented-control"
      className={cn('andromeda-segmented inline-flex relative select-none', className)}
      style={{
        ...andromedaVars(),
        height: `var(${cellVar}, ${rung.height})`,
        border: `${tokens.border.thin} ${tokens.color.border.base}`,
        borderRadius: tokens.radius.frame,
        background: tokens.color.surface.raised,
        ...style,
      }}
      {...props}
    >
      {options.map((opt, i) => {
        const Icon = opt.icon;
        const active = opt.value === value;
        // Geometry follows the LABEL, not the absence of an icon. This used to
        // ask `!Icon && opt.label`, so an icon+label segment fell through to
        // the icon-only branch and rendered its label inside a square cell with
        // zero side padding. A segment is square only when it has no words.
        const hasLabel = Boolean(opt.label);
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={opt.ariaLabel ?? opt.label}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(event) => handleKeyDown(event, i)}
            data-active={active}
            className="andromeda-segmented-item"
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: tokens.spacing[2],
              minWidth: hasLabel ? undefined : `var(${cellVar}, ${rung.height})`,
              height: '100%',
              // A labelled segment is a centred-label button, so it takes the
              // rung's padX like Button does. A flat spacing[3] left an lg
              // strip padded like an sm one next to an lg Button.
              padding: hasLabel ? `0 ${rung.padX}` : 0,
              background: 'transparent',
              border: 'none',
              borderLeft: i === 0 ? 'none' : `${tokens.border.thin} ${tokens.color.border.base}`,
              cursor: 'pointer',
              flexShrink: 0,
              // A segment never wraps its label — a wrapped label breaks the
              // fixed-height row, the borderLeft dividers and the sliding
              // indicator (the strip scrolls horizontally instead, see
              // RESPONSIVE_STYLE). Without this a label squeezed in a narrow
              // container ("View all") drops to a second line.
              whiteSpace: 'nowrap',
              fontFamily: tokens.typography.fontMono,
              // Label type steps with the rung. Pinned at size.sm the sm strip
              // read as a shrunken md and the lg strip as an inflated one.
              fontSize: rung.text,
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
                layoutId={reducedMotion ? undefined : indicatorId}
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
              {hasLabel ? <span>{opt.label}</span> : null}
            </span>
          </button>
        );
      })}

      {/* Hover styles — inline rule injected once per render scope.
          The :hover psuedo-class can't be expressed with React inline styles. */}
      <style>{`
        .andromeda-segmented-item:hover[data-active="false"] {
          color: var(--andromeda-text-primary);
        }
        .andromeda-segmented-item:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 ${tokens.border.width[1]} var(--andromeda-accent-400);
        }
        ${RESPONSIVE_STYLE}
      `}</style>
    </div>
  );
});
