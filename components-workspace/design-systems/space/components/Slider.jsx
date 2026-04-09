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
import { cn, spaceVars } from './lib/utils';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function snap(n, step) {
  if (!step || step <= 0) return n;
  return Math.round(n / step) * step;
}

/**
 * @typedef {object} SliderProps
 * @property {number} [value]                  Controlled value.
 * @property {number} [defaultValue]           Uncontrolled initial value.
 * @property {number} [min=0]
 * @property {number} [max=100]
 * @property {number} [step=1]
 * @property {(next: number) => void} [onValueChange]
 * @property {string} [label]                  Optional uppercase mono label.
 * @property {boolean} [showValue=true]        Render the numeric readout next to the label.
 * @property {string} [unit]                   Optional unit suffix (e.g. "%", "KM").
 * @property {boolean} [disabled]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 * @property {string} [id]
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
  const id = idProp ?? `space-slider-${reactId}`;
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
      className={cn('flex flex-col gap-[var(--space-2)]', className)}
      style={{ ...spaceVars(), ...style }}
      {...props}
    >
      {(label || showValue) ? (
        <div className="flex items-baseline justify-between">
          {label ? (
            <span
              className={cn(
                '[font-family:var(--space-font-mono)]',
                'text-[length:var(--space-text-xs)]',
                'uppercase [letter-spacing:var(--space-tracking-wider)]',
                'text-[color:var(--space-text-secondary)]',
              )}
            >
              {label}
            </span>
          ) : <span />}
          {showValue ? (
            <span
              className={cn(
                '[font-family:var(--space-font-mono)]',
                'text-[length:var(--space-text-xs)]',
                'font-[number:var(--space-weight-medium)]',
                'uppercase [letter-spacing:var(--space-tracking-wider)]',
                'text-[color:var(--space-text-primary)]',
              )}
            >
              {Number.isInteger(step) ? Math.round(value) : value.toFixed(2)}
              {unit ? ` ${unit}` : ''}
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
        aria-label={typeof label === 'string' ? label : undefined}
        aria-disabled={disabled || undefined}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative h-[18px] w-full select-none touch-none',
          'cursor-pointer',
          disabled && 'opacity-[0.4] cursor-not-allowed pointer-events-none',
          'focus-visible:outline-none',
          'focus-visible:[--slider-thumb-shadow:0_0_0_1px_var(--space-accent-bright),0_0_10px_var(--space-accent-glow)]',
        )}
      >
        {/* Track line */}
        <div
          className={cn(
            'absolute left-0 right-0 top-1/2 -translate-y-1/2',
            'h-[3px] border border-solid',
            'bg-[color:var(--space-surface-overlay)]',
            'border-[color:var(--space-border-subtle)]',
          )}
        />
        {/* Filled portion */}
        <div
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 h-[3px]',
            '[background:linear-gradient(90deg,var(--space-accent-dim)_0%,var(--space-accent-base)_100%)]',
            'shadow-[0_0_8px_var(--space-accent-glow)]',
          )}
          style={{ width: `${percent}%` }}
        />
        {/* Thumb */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
            'w-[8px] h-[16px]',
            'bg-[color:var(--space-accent-base)]',
            'border border-solid border-[color:var(--space-accent-bright)]',
            'shadow-[var(--slider-thumb-shadow,0_0_8px_var(--space-accent-glow))]',
            'transition-[box-shadow,transform] duration-150 ease-out',
            'hover:scale-[1.25]',
          )}
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
});
