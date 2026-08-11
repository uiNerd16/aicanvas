// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Toggle (Switch)
// shadcn/ui-aligned API: forwardRef, controlled (`checked`) /
// uncontrolled, `onCheckedChange`, optional inline `label`.
// Sharp rectangular track with a sliding rectangular thumb —
// matches the rest of the Andromeda vocabulary (no rounded chrome).
// ============================================================

'use client';

import { forwardRef, useId, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';
import { mq } from './lib/responsive';

// Touch-target expander — the visible 34x18px track stays its desktop size; on
// coarse pointers the invisible input (which receives the click, kept on top via
// z-10) grows to spacing[10] (40px), centered over the track. inset-0 is released
// so the input can overflow the short track. Scoped className, !important to beat
// the peer/absolute base classes. the Andromeda responsive rules + the Andromeda interaction-states rules "Invisible inputs over
// visual proxies" (input must stay above the proxy — z-10 is preserved).
const TOUCH_TARGET_STYLE = `
  ${mq.coarse} {
    .andromeda-toggle-touch {
      inset: auto !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: var(--andromeda-10) !important;
      height: var(--andromeda-10) !important;
    }
  }
`;

const trackVariants = cva(
  [
    'relative inline-flex items-center shrink-0 box-border',
    'border-[length:var(--andromeda-border-width,1px)] border-solid',
    'rounded-[var(--andromeda-radius-frame,0px)]',
    'transition-[background-color,border-color,box-shadow] [transition-duration:var(--andromeda-duration-slow)] [transition-timing-function:var(--andromeda-easing-out)]',
    'cursor-pointer',
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
      // ponytail: identity constants — the switch's shape is a fixed ratio, not
      // a token. Each rung keeps the same 2px inset all round, so the thumb
      // travel below is always trackWidth - thumb - 4. md is today's 34x18.
      size: {
        md: 'w-[34px] h-[18px]',
        lg: 'w-[42px] h-[22px]',
      },
      state: {
        off: [
          'bg-[image:linear-gradient(var(--andromeda-surface-alpha),var(--andromeda-surface-alpha))]',
          'border-[color:var(--andromeda-border-base)]',
          'hover:border-[color:var(--andromeda-border-bright)]',
        ],
        on: [
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
      state: 'off',
      disabled: false,
    },
  },
);

const thumbVariants = cva(
  [
    'absolute top-[2px]',
    'rounded-[var(--andromeda-radius-frame,0px)]',
    'transition-[left,background-color,transform] [transition-duration:var(--andromeda-duration-slow)] [transition-timing-function:var(--andromeda-easing-out)]',
  ],
  {
    variants: {
      size: {
        md: 'w-[12px] h-[12px]',
        lg: 'w-[16px] h-[16px]',
      },
      state: {
        off: 'left-[2px] bg-[color:var(--andromeda-text-muted)]',
        on:  'bg-[color:var(--andromeda-accent-300)] shadow-[0_0_8px_var(--andromeda-accent-500)]',
      },
    },
    // The on-position is per rung: track width minus thumb minus the 2px inset
    // on each side. Splitting it out of `state` is what keeps the thumb landing
    // flush at every size instead of only at md.
    compoundVariants: [
      { size: 'md', state: 'on', class: 'left-[18px]' },
      { size: 'lg', state: 'on', class: 'left-[22px]' },
    ],
    defaultVariants: { size: 'md', state: 'off' },
  },
);

// Label text steps with the switch, matching Checkbox and Radio.
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

/**
 * @typedef {object} ToggleProps
 * @property {boolean} [checked] Controlled checked state; supplying it puts the switch in controlled mode.
 * @property {boolean} [defaultChecked=false] Initial checked state when uncontrolled.
 * @property {(next: boolean) => void} [onCheckedChange] Handler called with the next checked state whenever the switch toggles.
 * @property {string}  [label] Optional text rendered beside the switch and linked to it via htmlFor.
 * @property {'md'|'lg'} [size='md'] Two rungs, 34x18 and 42x22, scaling the track, thumb travel and label together. The 26x14 `sm` rung was dropped 2026-08-10 across Checkbox, Radio and Toggle together.
 * @property {boolean} [disabled=false] Disables interaction and dims the switch.
 * @property {string}  [className] Extra classes merged onto the visual track.
 * @property {React.CSSProperties} [style] Inline styles merged onto the wrapper element.
 * @property {string}  [id] Id for the input; falls back to a generated id and links the label.
 */

/** @type {React.ForwardRefExoticComponent<ToggleProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'|'type'>>} */
export const Toggle = forwardRef(function Toggle(
  {
    className,
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    label,
    size = 'md',
    disabled = false,
    id: idProp,
    style,
    ...props
  },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `andromeda-toggle-${reactId}`;
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
      data-size={size}
      className="inline-flex items-center gap-[var(--andromeda-3)]"
      style={{ ...andromedaVars(), ...style }}
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
          // z-10 keeps the invisible input on top of the visual track so clicks
          // reach the input. Both layers are positioned, so without an explicit
          // z-index the track span paints last and swallows every click on the
          // switch — only the label (via htmlFor) would toggle. Mirrors Checkbox.
          className="andromeda-toggle-touch peer absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(trackVariants({ size, state, disabled }), className)}
        >
          <span className={thumbVariants({ size, state })} />
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

export { trackVariants as toggleTrackVariants, thumbVariants as toggleThumbVariants };
