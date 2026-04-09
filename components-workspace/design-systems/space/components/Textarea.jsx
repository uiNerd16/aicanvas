// ============================================================
// COMPONENT: Textarea
// shadcn/ui-aligned API: forwardRef, label, error, ...props.
// Multi-line counterpart to <Input>. Same border / focus / error
// behavior; resizes vertically; min-height controlled via `rows`.
// ============================================================

'use client';

import { forwardRef, useId } from 'react';
import { cva } from 'class-variance-authority';
import { cn, spaceVars } from './lib/utils';

const textareaVariants = cva(
  [
    'block w-full box-border resize-y',
    'border border-solid',
    'rounded-[var(--space-radius-none)]',
    '[font-family:var(--space-font-sans)]',
    'text-[length:var(--space-text-md)]',
    'text-[color:var(--space-text-primary)]',
    'bg-[color:var(--space-surface-raised)]',
    'px-[var(--space-3)] py-[var(--space-2)]',
    'leading-[1.5]',
    'outline-none',
    'transition-[border-color,box-shadow] duration-150 ease-out',
    'placeholder:text-[color:var(--space-text-muted)]',
    'disabled:opacity-[0.4] disabled:cursor-not-allowed disabled:resize-none',
  ],
  {
    variants: {
      state: {
        default: [
          'border-[color:var(--space-border-base)]',
          'hover:border-[color:var(--space-border-bright)]',
          'focus:border-[color:var(--space-accent-dim)]',
          'focus:shadow-[0_0_0_1px_var(--space-accent-dim),0_0_12px_var(--space-accent-glow)]',
        ],
        error: [
          'border-[color:var(--space-fault)]',
          'focus:border-[color:var(--space-fault)]',
          'focus:shadow-[0_0_0_1px_var(--space-fault),0_0_12px_var(--space-fault-ring)]',
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
  const id = idProp ?? `space-textarea-${reactId}`;
  const errorId = error ? `${id}-error` : undefined;
  const state = error ? 'error' : 'default';

  return (
    <div
      className={cn('flex flex-col gap-[var(--space-2)]', wrapperClassName)}
      style={{ ...spaceVars(), ...style }}
    >
      {label ? (
        <label
          htmlFor={id}
          className={cn(
            '[font-family:var(--space-font-mono)]',
            'text-[length:var(--space-text-xs)]',
            'font-[number:var(--space-weight-medium)]',
            'uppercase [letter-spacing:var(--space-tracking-wider)]',
            'text-[color:var(--space-text-secondary)]',
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
            '[font-family:var(--space-font-mono)]',
            'text-[length:var(--space-text-xs)]',
            'text-[color:var(--space-fault)]',
            'uppercase [letter-spacing:var(--space-tracking-wide)]',
          )}
        >
          {error}
        </span>
      ) : null}
    </div>
  );
});

export { textareaVariants };
