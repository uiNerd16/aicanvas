// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Checkbox
// shadcn/ui-aligned API: forwardRef, controlled (`checked`) or
// uncontrolled (`defaultChecked`), `onCheckedChange` callback,
// optional inline `label`. Square box, sharp corners, accent
// fill on checked, full hover/focus/disabled coverage.
// ============================================================

'use client';

import { forwardRef, useId, useState, useEffect } from 'react';
import { Checkmark } from '@carbon/icons-react';

function useSpacePopIn() {
  useEffect(() => {
    if (document.querySelector('#andromeda-pop-in-style')) return;
    const style = document.createElement('style');
    style.id = 'andromeda-pop-in-style';
    style.textContent = `@keyframes andromeda-pop-in{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}`;
    document.head.appendChild(style);
  }, []);
}
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';

const boxVariants = cva(
  [
    'relative inline-flex items-center justify-center shrink-0',
    'w-[16px] h-[16px]',
    'border border-solid',
    'rounded-[var(--andromeda-radius-none)]',
    'transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out',
    'cursor-pointer',
    'active:scale-[0.88]',
    'focus-visible:outline-none',
    'focus-visible:shadow-[0_0_0_1px_var(--andromeda-accent-dim),0_0_8px_var(--andromeda-accent-glow)]',
  ],
  {
    variants: {
      state: {
        unchecked: [
          'bg-[color:var(--andromeda-surface-raised)]',
          'border-[color:var(--andromeda-border-base)]',
          'hover:border-[color:var(--andromeda-border-bright)]',
        ],
        checked: [
          'bg-[color:var(--andromeda-accent-glow-soft)]',
          'border-[color:var(--andromeda-accent-base)]',
          'hover:border-[color:var(--andromeda-accent-bright)]',
        ],
      },
      disabled: {
        true:  'opacity-[0.35] pointer-events-none cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      state: 'unchecked',
      disabled: false,
    },
  },
);

const labelClass = cn(
  '[font-family:var(--andromeda-font-mono)]',
  'text-[length:var(--andromeda-text-sm)]',
  'font-[number:var(--andromeda-weight-medium)]',
  'uppercase [letter-spacing:var(--andromeda-tracking-wide)]',
  'text-[color:var(--andromeda-text-secondary)]',
  'select-none cursor-pointer',
);

/**
 * @typedef {object} CheckboxProps
 * @property {boolean} [checked]               Controlled checked state.
 * @property {boolean} [defaultChecked=false]  Uncontrolled initial state.
 * @property {(next: boolean) => void} [onCheckedChange]
 * @property {string}  [label]                 Optional inline label.
 * @property {boolean} [disabled]
 * @property {string}  [className]
 * @property {React.CSSProperties} [style]
 * @property {string}  [id]
 */

/** @type {React.ForwardRefExoticComponent<CheckboxProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'|'type'>>} */
export const Checkbox = forwardRef(function Checkbox(
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
  useSpacePopIn();
  const reactId = useId();
  const id = idProp ?? `andromeda-checkbox-${reactId}`;
  const isControlled = controlledChecked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const checked = isControlled ? controlledChecked : internal;

  function handleChange(e) {
    const next = e.target.checked;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  }

  return (
    <div
      className="inline-flex items-center gap-[var(--andromeda-2)]"
      style={{ ...andromedaVars(), ...style }}
    >
      <span className="relative inline-flex">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            boxVariants({
              state: checked ? 'checked' : 'unchecked',
              disabled,
            }),
            // Sync focus ring with the hidden native input.
            'peer-focus-visible:shadow-[0_0_0_1px_var(--andromeda-accent-dim),0_0_8px_var(--andromeda-accent-glow)]',
            className,
          )}
        >
          {checked ? (
            <Checkmark
              size={12}
              style={{
                fill: 'var(--andromeda-accent-bright)',
                animation: 'andromeda-pop-in 120ms ease-out',
              }}
            />
          ) : null}
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

export { boxVariants as checkboxVariants };
