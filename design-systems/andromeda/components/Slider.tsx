// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Slider
// shadcn/ui-aligned API: forwardRef, controlled (`value`) /
// uncontrolled (`defaultValue`), onValueChange. Single-value
// horizontal range slider with a rectangular thumb — sharp by
// default, since --andromeda-radius-frame defaults to 0px, and
// rounded in step with the rest of the frame when that's tuned —
// plus a glowing accent fill — sci-fi telemetry vibe.
// A two-number tuple keeps the same visual language while adding
// a second endpoint and filling only the measured span between them.
//
// Built without a native <input type="range"> so the chrome
// is fully consistent across browsers. ARIA-compliant via
// role="slider" + aria-valuenow/min/max.
// ============================================================

'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type {
  CSSProperties,
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from 'react';
import { cn, andromedaVars } from './lib/utils';
import { mq } from './lib/responsive';
import { useReducedMotion } from './lib/motion';
import { tokens } from '../tokens';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function snap(n, step, min) {
  if (!step || step <= 0) return n;
  return min + Math.round((n - min) / step) * step;
}

function normalizeRange(range, min, max) {
  const first = clamp(range[0], min, max);
  const second = clamp(range[1], min, max);
  return first <= second ? [first, second] : [second, first];
}

function formatValue(value, step) {
  return Number.isInteger(step) ? Math.round(value) : value.toFixed(2);
}

// ponytail: identity constants — the slider's shape is a ratio, not a token.
// Each rung keeps the thumb twice as tall as it is wide and the row tall enough
// to contain it, so md is exactly today's 18px row with an 8x16 thumb.
// thumbW repeats the width in the `thumb` class as a number, because the RANGE
// pair anchors by its inner edges and CSS has to subtract a real px value to
// do it. Keep the two in step.
// No sm rung. A 14px row on a 6px thumb is a small target for a control whose
// whole job is to be dragged, and a range pair on that thumb read as one slider
// rather than two marks. The ladder starts at md here — the one departure, kept
// in step with Slider.rules.md.
const SIZES = {
  md: { row: 'h-[18px]', line: 'h-[3px]', thumb: 'w-[8px] h-[16px]',  thumbW: 8,  text: 'text-[length:var(--andromeda-text-md)]' },
  lg: { row: 'h-[22px]', line: 'h-[4px]', thumb: 'w-[10px] h-[20px]', thumbW: 10, text: 'text-[length:var(--andromeda-text-lg)]' },
};

/**
 * @typedef {object} SliderProps
 * @property {number} [value]                  Controlled value.
 * @property {number} [defaultValue]           Uncontrolled initial value.
 * @property {number} [min=0]                Minimum value of the range.
 * @property {number} [max=100]              Maximum value of the range.
 * @property {number} [step=1]               Increment the value snaps to.
 * @property {(next: number) => void} [onValueChange]  Handler called with the new value on drag or keyboard change.
 * @property {string} [label]                  Optional uppercase mono label.
 * @property {'md'|'lg'} [size='md']           Rung on the shared control ladder, which starts at md here — an sm slider is too small a drag target. Scales the track row, thumb and readout together.
 * @property {boolean} [showValue=true]        Render the numeric readout next to the label.
 * @property {boolean} [showScale=true]        Print `min` and `max` under the track ends, the domain the fill is a proportion of. Turn it off for a slider whose range is already obvious from its surroundings.
 * @property {string} [unit]                   Optional unit suffix (e.g. "%", "KM").
 * @property {boolean} [disabled=false]      Disables interaction and dims the slider.
 * @property {string} [className]            Additional classes for the root wrapper.
 * @property {React.CSSProperties} [style]   Inline styles merged onto the root wrapper.
 * @property {string} [id]                   Id for the slider track; auto-generated when omitted.
 */

/** @typedef {readonly [number, number]} SliderRangeValue */

/**
 * @typedef {Omit<SliderProps, 'value' | 'defaultValue' | 'onValueChange'> & (
 *   { value: SliderRangeValue, defaultValue?: SliderRangeValue } |
 *   { value?: undefined, defaultValue: SliderRangeValue }
 * ) & {
 *   onValueChange?: (next: [number, number]) => void
 * }} RangeSliderProps
 */

/** @typedef {Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & React.RefAttributes<HTMLDivElement>} SliderNativeProps */

type SliderSharedProps = {
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  size?: 'md' | 'lg';
  showValue?: boolean;
  showScale?: boolean;
  unit?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

type SliderNativeAttributes = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>;

type SingleSliderComponentProps = SliderSharedProps & SliderNativeAttributes & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (next: number) => void;
};

type RangeSliderComponentProps = SliderSharedProps & SliderNativeAttributes & (
  { value: readonly [number, number]; defaultValue?: readonly [number, number] } |
  { value?: undefined; defaultValue: readonly [number, number] }
) & {
  onValueChange?: (next: [number, number]) => void;
};

type SliderComponent =
  & ForwardRefExoticComponent<SingleSliderComponentProps & RefAttributes<HTMLDivElement>>
  & ForwardRefExoticComponent<RangeSliderComponentProps & RefAttributes<HTMLDivElement>>
  & ForwardRefExoticComponent<(SingleSliderComponentProps | RangeSliderComponentProps) & RefAttributes<HTMLDivElement>>;

/** @type {React.ForwardRefExoticComponent<SliderProps & SliderNativeProps> & React.ForwardRefExoticComponent<RangeSliderProps & SliderNativeProps>} */
export const Slider = forwardRef<HTMLDivElement, SingleSliderComponentProps | RangeSliderComponentProps>(function Slider(
  {
    className,
    value: controlledValue,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
    label,
    size = 'md',
    showValue = true,
    showScale = true,
    unit,
    disabled = false,
    id: idProp,
    style,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const reactId = useId();
  const reducedMotion = useReducedMotion();
  const id = idProp ?? `andromeda-slider-${reactId}`;
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = useState(
    defaultValue ?? min,
  );
  const rawValue = isControlled ? controlledValue : internal;
  const isRange = Array.isArray(rawValue);
  const rangeValue = isRange ? normalizeRange(rawValue, min, max) : [min, min];
  const value = isRange ? min : clamp(rawValue, min, max);

  const trackRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const rangeThumbRefs = useRef(/** @type {(HTMLDivElement|null)[]} */ ([null, null]));
  const rangeValueRef = useRef(rangeValue);
  const draggingRef = useRef(false);
  const activeThumbRef = useRef(/** @type {0|1|null} */ (null));
  const pointerIdRef = useRef(/** @type {number|null} */ (null));
  rangeValueRef.current = rangeValue;

  const setValue = useCallback(
    (next) => {
      const snapped = clamp(snap(next, step, min), min, max);
      if (snapped === value) return;
      if (!isControlled) setInternal(snapped);
      onValueChange?.(snapped);
    },
    [isControlled, max, min, onValueChange, step, value],
  );

  const setRangeThumb = useCallback(
    (thumb, next, shouldSnap = true) => {
      const current = rangeValueRef.current;
      const lowerLimit = thumb === 0 ? min : current[0];
      const upperLimit = thumb === 0 ? current[1] : max;
      // Each endpoint uses its sibling as a live bound, keeping thumb identity
      // and keyboard focus stable while snap rounding stays inside the clamp.
      const bounded = clamp(shouldSnap ? snap(next, step, min) : next, lowerLimit, upperLimit);
      if (bounded === current[thumb]) return;

      const nextRange = thumb === 0
        ? [bounded, current[1]]
        : [current[0], bounded];
      if (!isControlled) {
        rangeValueRef.current = nextRange;
        setInternal(nextRange);
      }
      onValueChange?.(nextRange);
    },
    [isControlled, max, min, onValueChange, step],
  );

  const valueFromClientX = useCallback(
    (clientX) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return min;
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return min + ratio * (max - min);
    },
    [max, min, value],
  );

  // ── Pointer drag (mouse + touch unified) ─────────────────────────────────
  useEffect(() => {
    if (disabled) return undefined;

    const onPointerMove = (e) => {
      if (!draggingRef.current) return;
      if (isRange) {
        if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
        if (activeThumbRef.current === null) return;
        setRangeThumb(activeThumbRef.current, valueFromClientX(e.clientX));
        return;
      }
      setValue(valueFromClientX(e.clientX));
    };
    const onPointerUp = (e) => {
      if (isRange && pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
      draggingRef.current = false;
      activeThumbRef.current = null;
      pointerIdRef.current = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [disabled, isRange, setRangeThumb, setValue, valueFromClientX]);

  function handlePointerDown(e) {
    if (disabled) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    const next = valueFromClientX(e.clientX);
    if (!isRange) {
      setValue(next);
      return;
    }

    const [low, high] = rangeValueRef.current;
    const lowDistance = Math.abs(next - low);
    const highDistance = Math.abs(next - high);
    let nearest;
    if (lowDistance < highDistance) nearest = 0;
    else if (highDistance < lowDistance) nearest = 1;
    else if (e.target === rangeThumbRefs.current[0]) nearest = 0;
    else if (e.target === rangeThumbRefs.current[1]) nearest = 1;
    else if (low === high && next !== low) nearest = next < low ? 0 : 1;
    else nearest = 0;

    // Pick by value-distance before moving anything; otherwise a track press
    // can make the far endpoint jump and drag the wrong side of the span.
    activeThumbRef.current = nearest;
    pointerIdRef.current = e.pointerId;
    rangeThumbRefs.current[nearest]?.focus({ preventScroll: true });
    setRangeThumb(nearest, next);
  }

  function handleKeyDown(e) {
    if (disabled) return;
    const big = (max - min) / 10;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        setValue(value - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        setValue(value + step);
        break;
      case 'PageDown':
        e.preventDefault();
        setValue(value - big);
        break;
      case 'PageUp':
        e.preventDefault();
        setValue(value + big);
        break;
      case 'Home':
        e.preventDefault();
        setValue(min);
        break;
      case 'End':
        e.preventDefault();
        setValue(max);
        break;
      default:
        break;
    }
  }

  function handleRangeKeyDown(e, thumb) {
    if (disabled) return;
    const current = rangeValueRef.current;
    const big = (max - min) / 10;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        setRangeThumb(thumb, current[thumb] - step, false);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        setRangeThumb(thumb, current[thumb] + step, false);
        break;
      case 'PageDown':
        e.preventDefault();
        setRangeThumb(thumb, current[thumb] - big, false);
        break;
      case 'PageUp':
        e.preventDefault();
        setRangeThumb(thumb, current[thumb] + big, false);
        break;
      case 'Home':
        e.preventDefault();
        setRangeThumb(thumb, thumb === 0 ? min : current[0], false);
        break;
      case 'End':
        e.preventDefault();
        setRangeThumb(thumb, thumb === 0 ? current[1] : max, false);
        break;
      default:
        break;
    }
  }

  const rangeSpan = max - min;
  const percent = rangeSpan === 0 ? 0 : ((value - min) / rangeSpan) * 100;
  const lowPercent = rangeSpan === 0 ? 0 : ((rangeValue[0] - min) / rangeSpan) * 100;
  const highPercent = rangeSpan === 0 ? 0 : ((rangeValue[1] - min) / rangeSpan) * 100;
  const rangeAccessibleLabel = typeof label === 'string' && label ? label : ariaLabel;
  const rangeThumbLabels = rangeAccessibleLabel
    ? [`${rangeAccessibleLabel} minimum`, `${rangeAccessibleLabel} maximum`]
    : ['Minimum value', 'Maximum value'];

  return (
    <div
      ref={ref}
      data-size={size}
      className={cn('flex flex-col gap-[var(--andromeda-2)]', className)}
      style={{
        ...andromedaVars(),
        // The focused thumb deliberately glows 2px beyond the system glow.
        '--slider-focus-shadow': `0 0 0 ${tokens.border.width[1]} var(--andromeda-accent-100), 0 0 calc(${tokens.effect.glow} + 2px) var(--andromeda-accent-500)`,
        ...style,
      }}
      {...props}
    >
      {(label || showValue) ? (
        <div className="flex items-baseline justify-between">
          {label ? (
            <span
              className={cn(
                '[font-family:var(--andromeda-font-mono)]',
                SIZES[size].text,
                'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
                'text-[color:var(--andromeda-text-secondary)]',
              )}
            >
              {label}
            </span>
          ) : <span />}
          {showValue ? (
            <span
              className={cn(
                '[font-family:var(--andromeda-font-mono)]',
                SIZES[size].text,
                'font-[number:var(--andromeda-weight-medium)]',
                'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
                'text-[color:var(--andromeda-text-primary)]',
              )}
            >
              {isRange ? (
                <>
                  {formatValue(rangeValue[0], step)}{unit ?? ''}
                  {' → '}
                  {formatValue(rangeValue[1], step)}{unit ?? ''}
                </>
              ) : (
                <>
                  {Number.isInteger(step) ? Math.round(value) : value.toFixed(2)}
                  {unit ?? ''}
                </>
              )}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Track */}
      <div
        ref={trackRef}
        id={id}
        role={isRange ? undefined : 'slider'}
        tabIndex={isRange ? undefined : (disabled ? -1 : 0)}
        aria-valuemin={isRange ? undefined : min}
        aria-valuemax={isRange ? undefined : max}
        aria-valuenow={isRange ? undefined : value}
        aria-valuetext={isRange ? undefined : `${Number.isInteger(step) ? Math.round(value) : value.toFixed(2)}${unit ?? ''}`}
        aria-label={isRange ? undefined : (typeof label === 'string' && label ? label : ariaLabel)}
        aria-disabled={isRange ? undefined : (disabled || undefined)}
        onPointerDown={handlePointerDown}
        onKeyDown={isRange ? undefined : handleKeyDown}
        className={cn(
          'andromeda-slider-track',
          'relative w-full select-none touch-none',
          SIZES[size].row,
          'cursor-pointer',
          disabled && 'opacity-[var(--andromeda-opacity-disabled)] cursor-not-allowed pointer-events-none',
          'focus-visible:outline-none',
          'focus-visible:[--slider-thumb-shadow:var(--slider-focus-shadow)]',
        )}
      >
        {/* Track line */}
        <div
          className={cn(
            'absolute left-0 right-0 top-1/2 -translate-y-1/2',
            SIZES[size].line,
            'rounded-[var(--andromeda-radius-frame,0px)]',
            'border-[length:var(--andromeda-border-width,1px)] border-solid',
            'bg-[color:var(--andromeda-surface-overlay)]',
            // border.base, not border.subtle: at subtle the empty remainder sank
            // into the panel and the control had no readable LENGTH — a slider
            // near its minimum read as a lone mark floating on nothing. The fill
            // needs a track to be measured against.
            'border-[color:var(--andromeda-border-base)]',
          )}
        />
        {/* Filled portion — the accent gradient IS the measurement; no resting
            glow (glow is reserved for the focused/active thumb, below). */}
        <div
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2',
            SIZES[size].line,
            'rounded-[var(--andromeda-radius-frame,0px)]',
            '[background:linear-gradient(90deg,var(--andromeda-accent-400)_0%,var(--andromeda-accent-300)_100%)]',
          )}
          style={isRange
            ? { left: `${lowPercent}%`, width: `${highPercent - lowPercent}%` }
            : { width: `${percent}%` }}
        />
        {/* Thumb */}
        {isRange ? rangeValue.map((thumbValue, thumb) => (
          <div
            key={thumb}
            ref={(node) => { rangeThumbRefs.current[thumb] = node; }}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-orientation="horizontal"
            aria-valuemin={thumb === 0 ? min : rangeValue[0]}
            aria-valuemax={thumb === 0 ? rangeValue[1] : max}
            aria-valuenow={thumbValue}
            aria-valuetext={`${formatValue(thumbValue, step)}${unit ?? ''}`}
            aria-label={rangeThumbLabels[thumb]}
            aria-disabled={disabled || undefined}
            data-range-thumb={thumb === 0 ? 'minimum' : 'maximum'}
            onKeyDown={(e) => handleRangeKeyDown(e, thumb)}
            className={cn(
              // NOT centred on its value like the single thumb below. A range
              // endpoint marks the BOUNDARY of a span, so each thumb anchors by
              // its INNER edge: the low thumb sits to the left of its value, the
              // high thumb to the right. Two consequences, both wanted. The pair
              // can meet and touch but never merge into one blob, which on a
              // narrow thumb was the whole defect. And the accent fill now runs
              // exactly between the two thumbs instead of under them, so the
              // measurement and the marks agree.
              // max()/min() keep a thumb inside the track at the ends, where the
              // inner-edge anchor would otherwise push it fully off.
              'absolute top-1/2 -translate-y-1/2',
              SIZES[size].thumb,
              'rounded-[var(--andromeda-radius-frame,0px)]',
              'bg-[color:var(--andromeda-accent-300)]',
              'border-[length:var(--andromeda-border-width,1px)] border-solid border-[color:var(--andromeda-accent-100)]',
              // No resting glow; the focus-visible state sets --slider-thumb-shadow.
              'shadow-[var(--slider-thumb-shadow,none)]',
              !reducedMotion && 'transition-[box-shadow,transform] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
              !reducedMotion && 'hover:scale-[1.25]',
              'focus-visible:z-10 focus-visible:outline-none',
              'focus-visible:[--slider-thumb-shadow:var(--slider-focus-shadow)]',
            )}
            style={{
              left: thumb === 0
                ? `max(0px, calc(${lowPercent}% - ${SIZES[size].thumbW}px))`
                : `min(calc(100% - ${SIZES[size].thumbW}px), ${highPercent}%)`,
            }}
          />
        )) : (
          <div
            aria-hidden="true"
            className={cn(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
              SIZES[size].thumb,
              'rounded-[var(--andromeda-radius-frame,0px)]',
              'bg-[color:var(--andromeda-accent-300)]',
              'border-[length:var(--andromeda-border-width,1px)] border-solid border-[color:var(--andromeda-accent-100)]',
              // No resting glow; the focus-visible state sets --slider-thumb-shadow.
              'shadow-[var(--slider-thumb-shadow,none)]',
              !reducedMotion && 'transition-[box-shadow,transform] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
              !reducedMotion && 'hover:scale-[1.25]',
            )}
            style={{ left: `${percent}%` }}
          />
        )}
      </div>

      {/* Scale — the domain the fill is a proportion OF. Without it a filled
          track is a picture: 64% of what, from where. Reference text, so it
          takes text.faint at a fixed 12px like the system's other reference
          labels rather than following the size ladder the reading uses. */}
      {showScale ? (
        <div
          aria-hidden="true"
          className={cn(
            'flex justify-between',
            '[font-family:var(--andromeda-font-mono)]',
            'text-[length:var(--andromeda-text-sm)]',
            'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
            'text-[color:var(--andromeda-text-faint)]',
          )}
        >
          <span>{formatValue(min, step)}{unit ?? ''}</span>
          <span>{formatValue(max, step)}{unit ?? ''}</span>
        </div>
      ) : null}

      {/* Touch-target growth (the Andromeda responsive rules). Mirror Button/IconButton:
          a centered transparent ::before overlay grows the *hit area* toward
          spacing[10] (40px) on coarse pointers with ZERO layout impact — the
          track keeps its 18px box, so neither the desktop visual nor the
          surrounding row height inflate. The track owns onPointerDown and the
          ::before is part of it, so taps in the enlarged zone still set the
          value (the horizontal getBoundingClientRect mapping is unaffected by
          the taller overlay). Growing the track's own height instead would
          inflate the wrapper — the forbidden technique (the Andromeda responsive rules). */}
      <style>{`
        ${mq.coarse} {
          .andromeda-slider-track::before {
            content: '' !important;
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            height: var(--andromeda-10) !important;
          }
        }
      `}</style>
    </div>
  );
}) as SliderComponent;
