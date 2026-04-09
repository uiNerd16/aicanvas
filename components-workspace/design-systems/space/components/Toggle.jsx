// ============================================================
// COMPONENT: Toggle (Switch)
// shadcn/ui-aligned API: forwardRef, controlled (`checked`) /
// uncontrolled, `onCheckedChange`, optional inline `label`.
// Sharp rectangular track with a sliding rectangular thumb —
// matches the rest of the Space vocabulary (no rounded chrome).
// ============================================================

'use client';

import { forwardRef, useId, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn, spaceVars } from './lib/utils';

const trackVariants = cva(
  [
    'relative inline-flex items-center shrink-0',
    'w-[34px] h-[18px]',
    'border border-solid',
    'rounded-[var(--space-radius-none)]',
    'transition-[background-color,border-color,box-shadow] duration-200 ease-out',
    'cursor-pointer',
    'peer-focus-visible:shadow-[0_0_0_1px_var(--space-accent-dim),0_0_8px_var(--space-accent-glow)]',
  ],
  {
    variants: {
      state: {
        off: [
          'bg-[color:var(--space-surface-raised)]',
          'border-[color:var(--space-border-base)]',
          'hover:border-[color:var(--space-border-bright)]',
        ],
        on: [
          'bg-[color:var(--space-accent-glow-soft)]',
          'border-[color:var(--space-accent-base)]',
          'hover:border-[color:var(--space-accent-bright)]',
        ],
      },
      disabled: {
        true:  'opacity-[0.35] pointer-events-none cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      state: 'off',
      disabled: false,
    },
  },
);

const thumbVariants = cva(
  [
    'absolute top-[2px]',
    'w-[12px] h-[12px]',
    'rounded-[var(--space-radius-none)]',
    'transition-[left,background-color,transform] duration-200 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
  ],
  {
    variants: {
      state: {
        off: 'left-[2px] bg-[color:var(--space-text-muted)]',
        on:  'left-[18px] bg-[color:var(--space-accent-base)] shadow-[0_0_8px_var(--space-accent-glow)]',
      },
    },
    defaultVariants: { state: 'off' },
  },
);

const labelClass = cn(
  '[font-family:var(--space-font-mono)]',
  'text-[length:var(--space-text-sm)]',
  'font-[number:var(--space-weight-medium)]',
  'uppercase [letter-spacing:var(--space-tracking-wide)]',
  'text-[color:var(--space-text-secondary)]',
  'select-none cursor-pointer',
);

/**
 * @typedef {object} ToggleProps
 * @property {boolean} [checked]
 * @property {boolean} [defaultChecked=false]
 * @property {(next: boolean) => void} [onCheckedChange]
 * @property {string}  [label]
 * @property {boolean} [disabled]
 * @property {string}  [className]
 * @property {React.CSSProperties} [style]
 * @property {string}  [id]
 */

/** @type {React.ForwardRefExoticComponent<ToggleProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'|'type'>>} */
export const Toggle = forwardRef(function Toggle(
  {
    className,
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    label,
    disabled = false,
    id: idProp,
    style,
    ...props
  },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `space-toggle-${reactId}`;
  const isControlled = controlledChecked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const checked = isControlled ? controlledChecked : internal;
  const state = checked ? 'on' : 'off';

  function handleChange(e) {
    const next = e.target.checked;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  }

  return (
    <div
      className="inline-flex items-center gap-[var(--space-3)]"
      style={{ ...spaceVars(), ...style }}
    >
      <span className="relative inline-flex">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(trackVariants({ state, disabled }), className)}
        >
          <span className={thumbVariants({ state })} />
        </span>
      </span>
      {label ? (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      ) : null}
    </div>
  );
});

export { trackVariants as toggleTrackVariants, thumbVariants as toggleThumbVariants };
