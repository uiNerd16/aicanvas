// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Slider
// shadcn/ui-aligned API: forwardRef, controlled (`value`) /
// uncontrolled (`defaultValue`), onValueChange. Single-value
// horizontal range slider with a sharp rectangular thumb and
// a glowing accent fill — sci-fi telemetry vibe.
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
import { cn, andromedaVars } from './lib/utils';
import { mq } from './lib/responsive';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function snap(n, step) {
  if (!step || step <= 0) return n;
  return Math.round(n / step) * step;
}

// ponytail: identity constants — the slider's shape is a ratio, not a token.
// Each rung keeps the thumb twice as tall as it is wide and the row tall enough
// to contain it, so md is exactly today's 18px row with an 8x16 thumb.
const SIZES = {
  sm: { row: 'h-[14px]', line: 'h-[2px]', thumb: 'w-[6px] h-[12px]',  text: 'text-[length:var(--andromeda-text-sm)]' },
  md: { row: 'h-[18px]', line: 'h-[3px]', thumb: 'w-[8px] h-[16px]',  text: 'text-[length:var(--andromeda-text-md)]' },
  lg: { row: 'h-[22px]', line: 'h-[4px]', thumb: 'w-[10px] h-[20px]', text: 'text-[length:var(--andromeda-text-lg)]' },
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
 * @property {'sm'|'md'|'lg'} [size='md']      Rung on the shared control ladder. Scales the track row, thumb and readout together; md is today's slider.
 * @property {boolean} [showValue=true]        Render the numeric readout next to the label.
 * @property {string} [unit]                   Optional unit suffix (e.g. "%", "KM").
 * @property {boolean} [disabled=false]      Disables interaction and dims the slider.
 * @property {string} [className]            Additional classes for the root wrapper.
 * @property {React.CSSProperties} [style]   Inline styles merged onto the root wrapper.
 * @property {string} [id]                   Id for the slider track; auto-generated when omitted.
 */

/** @type {React.ForwardRefExoticComponent<SliderProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>>} */
export const Slider = forwardRef(function Slider(
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
    unit,
    disabled = false,
    id: idProp,
    style,
    ...props
  },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `andromeda-slider-${reactId}`;
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = useState(
    defaultValue ?? min,
  );
  const value = clamp(isControlled ? controlledValue : internal, min, max);

  const trackRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const draggingRef = useRef(false);

  const setValue = useCallback(
    (next) => {
      const snapped = clamp(snap(next, step), min, max);
      if (snapped === value) return;
      if (!isControlled) setInternal(snapped);
      onValueChange?.(snapped);
    },
    [isControlled, max, min, onValueChange, step, value],
  );

  const valueFromClientX = useCallback(
    (clientX) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
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
      setValue(valueFromClientX(e.clientX));
    };
    const onPointerUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [disabled, setValue, valueFromClientX]);

  function handlePointerDown(e) {
    if (disabled) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    setValue(valueFromClientX(e.clientX));
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

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={ref}
      data-size={size}
      className={cn('flex flex-col gap-[var(--andromeda-2)]', className)}
      style={{ ...andromedaVars(), ...style }}
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
              {Number.isInteger(step) ? Math.round(value) : value.toFixed(2)}
              {unit ?? ''}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Track */}
      <div
        ref={trackRef}
        id={id}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${Number.isInteger(step) ? Math.round(value) : value.toFixed(2)}${unit ?? ''}`}
        aria-label={typeof label === 'string' ? label : undefined}
        aria-disabled={disabled || undefined}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        className={cn(
          'andromeda-slider-track',
          'relative w-full select-none touch-none',
          SIZES[size].row,
          'cursor-pointer',
          disabled && 'opacity-[var(--andromeda-opacity-disabled)] cursor-not-allowed pointer-events-none',
          'focus-visible:outline-none',
          'focus-visible:[--slider-thumb-shadow:0_0_0_1px_var(--andromeda-accent-100),0_0_10px_var(--andromeda-accent-500)]',
        )}
      >
        {/* Track line */}
        <div
          className={cn(
            'absolute left-0 right-0 top-1/2 -translate-y-1/2',
            SIZES[size].line,
            'border-[length:var(--andromeda-border-width,1px)] border-solid',
            'bg-[color:var(--andromeda-surface-overlay)]',
            'border-[color:var(--andromeda-border-subtle)]',
          )}
        />
        {/* Filled portion — the accent gradient IS the measurement; no resting
            glow (glow is reserved for the focused/active thumb, below). */}
        <div
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2',
            SIZES[size].line,
            '[background:linear-gradient(90deg,var(--andromeda-accent-400)_0%,var(--andromeda-accent-300)_100%)]',
          )}
          style={{ width: `${percent}%` }}
        />
        {/* Thumb */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
            SIZES[size].thumb,
            'bg-[color:var(--andromeda-accent-300)]',
            'border-[length:var(--andromeda-border-width,1px)] border-solid border-[color:var(--andromeda-accent-100)]',
            // No resting glow; the focus-visible state sets --slider-thumb-shadow.
            'shadow-[var(--slider-thumb-shadow,none)]',
            'transition-[box-shadow,transform] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
            'hover:scale-[1.25]',
          )}
          style={{ left: `${percent}%` }}
        />
      </div>

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
});
