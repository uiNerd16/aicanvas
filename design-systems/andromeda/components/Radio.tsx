// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Radio (Choicebox)
// shadcn/ui-aligned API: forwardRef, controlled (`checked`) or
// uncontrolled, `onCheckedChange`, optional `label`. Square box
// with a small filled square in the center when selected — same
// sci-fi vocabulary as Checkbox, but mutually-exclusive semantics.
//
// For radio groups, use the `name` prop on each Radio so the native
// inputs share the same group. The companion `RadioGroup` is just
// a thin convenience wrapper that fans `name`/`value` down.
// ============================================================

'use client';

import { forwardRef, useId, useState, createContext, useContext, useEffect } from 'react';

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
    'peer-focus-visible:shadow-[0_0_0_1px_var(--andromeda-accent-400),0_0_8px_var(--andromeda-accent-500)]',
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
          'bg-[color:var(--andromeda-accent-500)]',
          'border-[color:var(--andromeda-accent-300)]',
          'hover:border-[color:var(--andromeda-accent-100)]',
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

// ── Group context ───────────────────────────────────────────────────────────
const RadioGroupContext = createContext(/** @type {null | { name: string, value: string|undefined, onValueChange: (v: string) => void, disabled?: boolean }} */ (null));

/**
 * @typedef {object} RadioGroupProps
 * @property {string} [name]
 * @property {string} [value]
 * @property {string} [defaultValue]
 * @property {(next: string) => void} [onValueChange]
 * @property {boolean} [disabled]
 * @property {React.ReactNode} [children]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

export function RadioGroup({
  name,
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled = false,
  children,
  className,
  style,
  ...props
}) {
  const reactId = useId();
  const groupName = name ?? `andromeda-radio-${reactId}`;
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const value = isControlled ? controlledValue : internal;

  function handleChange(next) {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  }

  return (
    <RadioGroupContext.Provider
      value={{ name: groupName, value, onValueChange: handleChange, disabled }}
    >
      <div
        role="radiogroup"
        className={cn('flex flex-col gap-[var(--andromeda-2)]', className)}
        style={{ ...andromedaVars(), ...style }}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

/**
 * @typedef {object} RadioProps
 * @property {string}  [value]               Required when used inside RadioGroup.
 * @property {boolean} [checked]             Standalone controlled state.
 * @property {boolean} [defaultChecked=false]
 * @property {(next: boolean) => void} [onCheckedChange]
 * @property {string}  [label]
 * @property {boolean} [disabled]
 * @property {string}  [className]
 * @property {React.CSSProperties} [style]
 * @property {string}  [id]
 * @property {string}  [name]
 */

/** @type {React.ForwardRefExoticComponent<RadioProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'|'type'>>} */
export const Radio = forwardRef(function Radio(
  {
    className,
    value,
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    label,
    disabled: disabledProp,
    id: idProp,
    name: nameProp,
    style,
    ...props
  },
  ref,
) {
  useSpacePopIn();
  const reactId = useId();
  const id = idProp ?? `andromeda-radio-${reactId}`;
  const group = useContext(RadioGroupContext);

  // Standalone fallback state when this Radio is rendered outside a group.
  const [internal, setInternal] = useState(defaultChecked);

  let checked;
  let disabled = disabledProp;
  let name = nameProp;
  let onChange;

  if (group) {
    checked = group.value === value;
    disabled = disabled || group.disabled;
    name = name ?? group.name;
    onChange = () => group.onValueChange(value);
  } else {
    const isControlled = controlledChecked !== undefined;
    checked = isControlled ? controlledChecked : internal;
    onChange = (e) => {
      if (!isControlled) setInternal(e.target.checked);
      onCheckedChange?.(e.target.checked);
    };
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
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
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
            className,
          )}
        >
          {checked ? (
            <span
              className="block w-[6px] h-[6px]"
              style={{
                background: 'var(--andromeda-accent-300)',
                boxShadow: '0 0 6px var(--andromeda-accent-500)',
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

export { boxVariants as radioVariants };
