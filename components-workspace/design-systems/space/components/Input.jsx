// ============================================================
// COMPONENT: Input
// shadcn/ui-aligned API: className, ref, ...props passthrough.
// label + optional left icon + error state.
// Border transitions border.base → border.bright on focus.
// Error state recolors border + ring + helper text in fault.
// ============================================================

'use client';

import { forwardRef, useId } from 'react';
import { cva } from 'class-variance-authority';
import { cn, spaceVars } from './lib/utils';

const inputVariants = cva(
  [
    'block w-full box-border',
    'border border-solid',
    'rounded-[var(--space-radius-none)]',
    '[font-family:var(--space-font-sans)]',
    'text-[length:var(--space-text-md)]',
    'text-[color:var(--space-text-primary)]',
    'bg-[color:var(--space-surface-raised)]',
    'outline-none',
    'transition-[border-color,box-shadow] duration-150 ease-out',
    'placeholder:text-[color:var(--space-text-muted)]',
    'disabled:opacity-[0.4] disabled:cursor-not-allowed',
  ],
  {
    variants: {
      hasIcon: {
        true:  'pl-[32px] pr-[var(--space-3)] py-[9px]',
        false: 'px-[var(--space-3)] py-[9px]',
      },
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
    defaultVariants: {
      hasIcon: false,
      state: 'default',
    },
  },
);

/**
 * @typedef {object} InputProps
 * @property {string} [label] Uppercase mono label rendered above the field.
 * @property {React.ComponentType<{ size?: number, strokeWidth?: number }>} [icon] Optional left icon.
 * @property {string} [error] When set, switches the field into the error state and renders the message.
 * @property {string} [className] Class name forwarded to the <input> element.
 * @property {string} [wrapperClassName] Class name forwarded to the outer wrapper.
 */

/** @type {React.ForwardRefExoticComponent<InputProps & React.InputHTMLAttributes<HTMLInputElement>>} */
export const Input = forwardRef(function Input(
  {
    className,
    wrapperClassName,
    label,
    icon: Icon,
    error,
    id: idProp,
    style,
    disabled,
    ...props
  },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `space-input-${reactId}`;
  const errorId = error ? `${id}-error` : undefined;
  const hasIcon = Boolean(Icon);
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

      <div className="relative">
        {Icon ? (
          <div
            aria-hidden="true"
            className={cn(
              'absolute left-[var(--space-3)] top-1/2 -translate-y-1/2',
              'flex items-center pointer-events-none',
              'text-[color:var(--space-text-muted)]',
            )}
          >
            <Icon size={20} strokeWidth={1.5} />
          </div>
        ) : null}

        <input
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          disabled={disabled}
          className={cn(inputVariants({ hasIcon, state }), className)}
          {...props}
        />
      </div>

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

export { inputVariants };
