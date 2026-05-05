// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Textarea
// shadcn/ui-aligned API: forwardRef, label, error, ...props.
// Multi-line counterpart to <Input>. Same border / focus / error
// behavior; resizes vertically; min-height controlled via `rows`.
// ============================================================

'use client';

import { forwardRef, useId } from 'react';
import { cva } from 'class-variance-authority';
import { cn, andromedaVars } from './lib/utils';

const textareaVariants = cva(
  [
    'block w-full box-border resize-y',
    'border border-solid',
    'rounded-[var(--andromeda-radius-none)]',
    '[font-family:var(--andromeda-font-sans)]',
    'text-[length:var(--andromeda-text-md)]',
    'text-[color:var(--andromeda-text-primary)]',
    'bg-[color:var(--andromeda-surface-raised)]',
    'px-[var(--andromeda-3)] py-[var(--andromeda-2)]',
    'leading-[1.5]',
    'outline-none',
    'transition-[border-color,box-shadow] duration-150 ease-out',
    'placeholder:text-[color:var(--andromeda-text-muted)]',
    'disabled:opacity-[0.4] disabled:cursor-not-allowed disabled:resize-none',
  ],
  {
    variants: {
      state: {
        default: [
          'border-[color:var(--andromeda-border-base)]',
          'hover:border-[color:var(--andromeda-border-bright)]',
          'focus:border-[color:var(--andromeda-accent-400)]',
          'focus:shadow-[0_0_0_1px_var(--andromeda-accent-400),0_0_8px_var(--andromeda-accent-500)]',
        ],
        error: [
          'border-[color:var(--andromeda-red-300)]',
          'focus:border-[color:var(--andromeda-red-300)]',
          'focus:shadow-[0_0_0_1px_var(--andromeda-red-300),0_0_8px_var(--andromeda-red-400)]',
        ],
      },
    },
    defaultVariants: { state: 'default' },
  },
);

/**
 * @typedef {object} TextareaProps
 * @property {string} [label]            Uppercase mono label rendered above the field.
 * @property {string} [error]            When set, switches the field into the error state.
 * @property {string} [className]        Forwarded to the <textarea>.
 * @property {string} [wrapperClassName] Forwarded to the outer wrapper.
 */

/** @type {React.ForwardRefExoticComponent<TextareaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>} */
export const Textarea = forwardRef(function Textarea(
  {
    className,
    wrapperClassName,
    label,
    error,
    id: idProp,
    rows = 4,
    style,
    disabled,
    ...props
  },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `andromeda-textarea-${reactId}`;
  const errorId = error ? `${id}-error` : undefined;
  const state = error ? 'error' : 'default';

  return (
    <div
      className={cn('flex flex-col gap-[var(--andromeda-2)]', wrapperClassName)}
      style={{ ...andromedaVars(), ...style }}
    >
      {label ? (
        <label
          htmlFor={id}
          className={cn(
            '[font-family:var(--andromeda-font-mono)]',
            'text-[length:var(--andromeda-text-xs)]',
            'font-[number:var(--andromeda-weight-medium)]',
            'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
            'text-[color:var(--andromeda-text-secondary)]',
          )}
        >
          {label}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        disabled={disabled}
        className={cn(textareaVariants({ state }), className)}
        {...props}
      />

      {error ? (
        <span
          id={errorId}
          className={cn(
            '[font-family:var(--andromeda-font-mono)]',
            'text-[length:var(--andromeda-text-xs)]',
            'text-[color:var(--andromeda-red-300)]',
            'uppercase [letter-spacing:var(--andromeda-tracking-wide)]',
          )}
        >
          {error}
        </span>
      ) : null}
    </div>
  );
});

export { textareaVariants };
