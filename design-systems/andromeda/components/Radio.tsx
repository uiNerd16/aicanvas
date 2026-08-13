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
    style.textContent = `
      @keyframes andromeda-pop-in{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
      @media (prefers-reduced-motion: reduce) {
        .andromeda-checkbox-box { transition: none !important; transform: none !important; }
        .andromeda-checkbox-mark { animation: none !important; }
        .andromeda-radio-box { transition: none !important; transform: none !important; }
        .andromeda-radio-mark { animation: none !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);
}
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';
import { mq } from './lib/responsive';
import { tokens } from '../tokens';

// Touch-target expander — the visible 16px box stays its desktop size; on coarse
// pointers the invisible input (which receives the click, kept on top via z-10)
// grows to spacing[10] (40px), centered over the box. inset-0 is released so the
// input can overflow the small wrapper. Scoped className, !important to beat the
// peer/absolute base classes. the Andromeda responsive rules + the Andromeda interaction-states rules "Invisible inputs over
// visual proxies" (input must stay above the proxy — z-10 is preserved).
const TOUCH_TARGET_STYLE = `
  ${mq.coarse} {
    .andromeda-radio-touch {
      inset: auto !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: ${tokens.spacing[10]} !important;
      height: ${tokens.spacing[10]} !important;
    }
  }
`;

const boxVariants = cva(
  [
    'relative inline-flex items-center justify-center shrink-0 box-border',
    'border-[length:var(--andromeda-border-width,1px)] border-solid',
    'rounded-[var(--andromeda-radius-frame,0px)]',
    'transition-[background-color,border-color,box-shadow,transform] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
    'cursor-pointer',
    'active:scale-[0.88]',
    // A control has to look the same wherever it lands. The tints are painted
    // as a background-IMAGE layer over this opaque base, so the box composites
    // against surface.raised every time instead of against whatever row it sits
    // in — a Service Order row changes colour on hover and selection, and a
    // translucent background-color made the checkbox change with it.
    'bg-[color:var(--andromeda-surface-raised)]',
    'peer-focus-visible:shadow-[0_0_0_1px_var(--andromeda-accent-400),0_0_8px_var(--andromeda-accent-500)]',
  ],
  {
    variants: {
      // Mirrors Checkbox exactly, so a radio and a checkbox at the same size
      // are the same square. md is today's 16px box.
      size: {
        md: 'w-[length:var(--andromeda-4)] h-[length:var(--andromeda-4)]',
        lg: 'w-[length:var(--andromeda-5)] h-[length:var(--andromeda-5)]',
      },
      state: {
        unchecked: [
          'bg-[image:linear-gradient(var(--andromeda-surface-alpha),var(--andromeda-surface-alpha))]',
          'border-[color:var(--andromeda-border-base)]',
          'hover:border-[color:var(--andromeda-border-bright)]',
        ],
        checked: [
          // The BOX is a surface, so it takes the family tint; the MARK inside
          // carries the state and stays solid and bright. Border is accent-500,
          // the deep stop, so the perimeter reads as an edge rather than a
          // second signal competing with the mark. Hover still brightens it.
          'bg-[image:linear-gradient(var(--andromeda-accent-alpha),var(--andromeda-accent-alpha))]',
          'border-[color:var(--andromeda-accent-500)]',
          'hover:border-[color:var(--andromeda-accent-300)]',
        ],
      },
      disabled: {
        true:  'opacity-[var(--andromeda-opacity-disabled)] pointer-events-none cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'unchecked',
      disabled: false,
    },
  },
);

// ponytail: identity constants — mark geometry, kept proportional to the box
const MARK_FOR_SIZE = {
  md: 'block w-[6px] h-[6px]',
  lg: 'block w-[8px] h-[8px]',
};

// Label text steps with the box, matching Checkbox. Size-step rule
// (2026-08-11): md is 14px, lg is 16px — both were one rung low.
const LABEL_TEXT = {
  md: 'text-[length:var(--andromeda-text-md)]',
  lg: 'text-[length:var(--andromeda-text-lg)]',
};

const labelClass = cn(
  '[font-family:var(--andromeda-font-mono)]',
  'font-[number:var(--andromeda-weight-medium)]',
  'uppercase [letter-spacing:var(--andromeda-tracking-wide)]',
  'text-[color:var(--andromeda-text-secondary)]',
  'select-none cursor-pointer',
);

// ── Group context ───────────────────────────────────────────────────────────
const RadioGroupContext = createContext(/** @type {null | { name: string, value: string|undefined, onValueChange: (v: string) => void, disabled?: boolean }} */ (null));

/**
 * @typedef {object} RadioGroupProps
 * @property {string} [name] Shared group name for the radios' native inputs; auto-generated when omitted.
 * @property {string} [value] Selected value in controlled mode; the matching radio is checked.
 * @property {string} [defaultValue] Initially selected value when uncontrolled.
 * @property {(next: string) => void} [onValueChange] Handler called with the newly selected value.
 * @property {boolean} [disabled=false] Disables every radio in the group.
 * @property {React.ReactNode} [children] Radio elements belonging to the group.
 * @property {string} [className] Extra classes for the group wrapper.
 * @property {React.CSSProperties} [style] Inline styles merged onto the group wrapper.
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
 * @property {boolean} [defaultChecked=false] Initial checked state when uncontrolled and standalone.
 * @property {(next: boolean) => void} [onCheckedChange] Handler called with the new checked state when toggled.
 * @property {string}  [label]               Text label rendered beside the box.
 * @property {'md'|'lg'} [size='md']    Two rungs, 16 and 20px boxes, scaling the box, its mark and the label together, matching Checkbox at the same value. The 12px `sm` rung was dropped 2026-08-10 across Checkbox, Radio and Toggle together.
 * @property {boolean} [disabled]            Disables the radio and blocks interaction.
 * @property {string}  [className]           Extra classes merged onto the visual box.
 * @property {React.CSSProperties} [style]   Inline styles merged onto the wrapper.
 * @property {string}  [id]                  Id for the input; links the label via htmlFor, auto-generated when omitted.
 * @property {string}  [name]                Native input name that groups radios; falls back to the group's name.
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
    size = 'md',
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

  if (process.env.NODE_ENV !== 'production' && group && value === undefined) {
    console.warn('Andromeda Radio: `value` is required when used inside RadioGroup.');
  }

  // Standalone fallback state when this Radio is rendered outside a group.
  const [internal, setInternal] = useState(defaultChecked);

  let checked;
  let disabled = disabledProp;
  let name = nameProp;
  let onChange;

  if (group) {
    checked = value !== undefined && group.value === value;
    disabled = disabled || group.disabled;
    name = name ?? group.name;
    onChange = () => { group.onValueChange(value); onCheckedChange?.(true); };
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
      // Reflect the rung actually rendered — the default never appears in
      // props, so <Radio /> would otherwise be un-inspectable. Mirrors Checkbox.
      data-size={size}
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
          // z-10 keeps the invisible input on top of the visual box so clicks
          // reach the input. Both layers are positioned, so without an explicit
          // z-index the box span paints last and swallows every click on the
          // square — only the label (via htmlFor) would toggle. Mirrors Checkbox.
          className="andromeda-radio-touch peer absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            boxVariants({
              size,
              state: checked ? 'checked' : 'unchecked',
              disabled,
            }),
            'andromeda-radio-box',
            className,
          )}
        >
          {checked ? (
            <span
              // Mark geometry tracks the box so the ring around it stays even.
              className={cn(MARK_FOR_SIZE[size], 'andromeda-radio-mark')}
              style={{
                background: 'var(--andromeda-accent-300)',
                boxShadow: '0 0 6px var(--andromeda-accent-500)',
                animation:
                  'andromeda-pop-in var(--andromeda-duration-normal) var(--andromeda-easing-out)',
              }}
            />
          ) : null}
        </span>
      </span>
      {label ? (
        <label htmlFor={id} className={cn(labelClass, LABEL_TEXT[size])}>
          {label}
        </label>
      ) : null}
      <style>{TOUCH_TARGET_STYLE}</style>
    </div>
  );
});

export { boxVariants as radioVariants };
