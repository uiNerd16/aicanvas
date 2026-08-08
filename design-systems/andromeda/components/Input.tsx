// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
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
import { cn, andromedaVars } from './lib/utils';
import { tokens } from '../tokens';

// Per-rung values the cva classes cannot express: the left icon has to shrink
// with the field, and the text has to clear it. Padding-left is the rung's own
// padX twice over plus the glyph, so the gap left of the caret matches the gap
// right of it.
const ICON_FOR_SIZE = { sm: tokens.iconSize.xs, md: tokens.iconSize.sm, lg: tokens.iconSize.lg };

const inputVariants = cva(
  [
    'block w-full box-border',
    'border-[length:var(--andromeda-border-width,1px)] border-solid',
    'rounded-[var(--andromeda-radius-frame,0px)]',
    '[font-family:var(--andromeda-font-sans)]',
    'text-[color:var(--andromeda-text-primary)]',
    'bg-[color:var(--andromeda-surface-raised)]',
    'outline-none',
    'transition-[border-color,box-shadow] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
    'placeholder:text-[color:var(--andromeda-text-muted)]',
    'disabled:opacity-[var(--andromeda-opacity-disabled)] disabled:cursor-not-allowed',
  ],
  {
    variants: {
      // Height, horizontal padding and text step together on the shared control
      // ladder (tokens.control), so a field and a Button of the same size line
      // up in a row with no props. This replaced a single off-grid 9px vertical
      // padding that put the field at ~37px, on neither rung of the ladder.
      size: {
        sm: 'h-[var(--andromeda-control-sm)] px-[var(--andromeda-3)] text-[length:var(--andromeda-text-xs)]',
        md: 'h-[var(--andromeda-control-md)] px-[var(--andromeda-4)] text-[length:var(--andromeda-text-sm)]',
        lg: 'h-[var(--andromeda-control-lg)] px-[var(--andromeda-5)] text-[length:var(--andromeda-text-md)]',
      },
      state: {
        default: [
          'border-[color:var(--andromeda-border-base)]',
          'hover:border-[color:var(--andromeda-border-bright)]',
          'focus:border-[color:var(--andromeda-accent-400)]',
          'focus-visible:shadow-[0_0_0_1px_var(--andromeda-accent-400),0_0_8px_var(--andromeda-accent-500)]',
        ],
        error: [
          'border-[color:var(--andromeda-red-300)]',
          'focus:border-[color:var(--andromeda-red-300)]',
          'focus-visible:shadow-[0_0_0_1px_var(--andromeda-red-300),0_0_8px_var(--andromeda-red-400)]',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  },
);

/**
 * @typedef {object} InputProps
 * @property {string} [label] Uppercase mono label rendered above the field.
 * @property {'sm'|'md'|'lg'} [size='md'] Rung on the shared control ladder: 24, 32 or 40px tall. Matches Button and IconButton at the same value, so a field and a button in one row align without further styling.
 * @property {React.ComponentType<{ size?: number, strokeWidth?: number }>} [icon] Optional left icon. Its glyph scales with `size` (12, 16, 20px).
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
    size = 'md',
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
  const id = idProp ?? `andromeda-input-${reactId}`;
  const errorId = error ? `${id}-error` : undefined;
  const state = error ? 'error' : 'default';
  const padX = tokens.control[size].padX;
  const iconPx = ICON_FOR_SIZE[size];

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

      <div className="relative">
        {Icon ? (
          <div
            aria-hidden="true"
            style={{ left: padX }}
            className={cn(
              'absolute top-1/2 -translate-y-1/2',
              'flex items-center pointer-events-none',
              'text-[color:var(--andromeda-text-muted)]',
            )}
          >
            <Icon size={iconPx} weight="regular" />
          </div>
        ) : null}

        <input
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          disabled={disabled}
          style={Icon ? { paddingLeft: `calc(${padX} * 2 + ${iconPx}px)` } : undefined}
          className={cn(inputVariants({ size, state }), className)}
          {...props}
        />
      </div>

      {error ? (
        <span
          id={errorId}
          role="alert"
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

export { inputVariants };
