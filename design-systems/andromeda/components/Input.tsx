// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Input
// shadcn/ui-aligned API: className, ref, ...props passthrough.
// label + optional left icon + error state.
// Optional trailing icon mirrors the left slot and can become an input action.
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
// padInset twice over plus the glyph, so the space between icon and text is the
// same inset the field already carries on its four sides.
// The shared control-icon ladder, same as Button and IconButton: 16/18/20,
// which leaves 5 / 7 / 9px above and below the glyph inside the rung's content
// box (26 / 32 / 38). It was 12/16/20, i.e. 7 / 8 / 9.
const ICON_FOR_SIZE = { sm: tokens.iconSize.sm, md: tokens.iconSize.md, lg: tokens.iconSize.lg };

// `size` arrives from a caller and is read straight into a style value below,
// so an unrecognised string throws rather than degrades. Same guard the other
// sized components in this system carry.
const SIZES = { sm: true, md: true, lg: true };

const inputVariants = cva(
  [
    'block w-full box-border',
    'border-[length:var(--andromeda-border-width,1px)] border-solid',
    'rounded-[var(--andromeda-radius-frame,0px)]',
    '[font-family:var(--andromeda-font-sans)]',
    // Pins the line box to the font size so padInset, defined as
    // (height - 2*border - text) / 2, describes the real line box and not only
    // the em box inside it. It does NOT move pixels at the pinned rung heights:
    // a single-line input centres its em box in the fixed content box whatever
    // the line box measures, so md leaves the glyphs 9px off the frame at
    // leading 1 and at the font's 1.32 normal alike. What it buys is the
    // unpinned case, a consumer className dropping h-*, where the line box
    // alone would set the field height.
    // Arbitrary-property form, not leading-*: tailwind-merge puts leading-* and
    // text-[length:*] in conflicting groups, so the leading-* written here was
    // deleted by the size variant's text-[length:*] and never reached the DOM.
    '[line-height:var(--andromeda-leading-none,1)]',
    'text-[color:var(--andromeda-text-primary)]',
    'bg-[color:var(--andromeda-surface-raised)]',
    'outline-none',
    'transition-[border-color,box-shadow] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
    'placeholder:text-[color:var(--andromeda-text-muted)]',
    'disabled:opacity-[var(--andromeda-opacity-disabled)] disabled:cursor-not-allowed',
  ],
  {
    variants: {
      // Height, inset and text step together on the shared control ladder
      // (tokens.control), so a field and a Button of the same size line up in a
      // row with no props. The side value is the rung's padInset, not a
      // Button's wider padX: a field's text is left-aligned against the border,
      // so a side gap wider than the one the pinned height leaves above the
      // glyphs reads as broken. This replaced a single off-grid 9px vertical
      // padding that put the field at ~37px, on neither rung of the ladder.
      size: {
        // Type follows the size step (2026-08-11): sm 12, md 14, lg 16, the same
        // rungs tokens.control now carries, so padInset stays exactly
        // (height - 2*border - text) / 2. It was one rung low (10 / 12 / 14).
        sm: 'h-[var(--andromeda-control-sm)] px-[var(--andromeda-inset-sm)] text-[length:var(--andromeda-text-sm)]',
        md: 'h-[var(--andromeda-control-md)] px-[var(--andromeda-inset-md)] text-[length:var(--andromeda-text-md)]',
        lg: 'h-[var(--andromeda-control-lg)] px-[var(--andromeda-inset-lg)] text-[length:var(--andromeda-text-lg)]',
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
 * @property {'sm'|'md'|'lg'} [size='md'] Rung on the shared control ladder: 28, 34 or 40px tall. Matches Button and IconButton at the same value, so a field and a button in one row align without further styling.
 * @property {React.ComponentType<{ size?: number, strokeWidth?: number }>} [icon] Optional left icon. Its glyph scales with `size` (16, 18, 20px).
 * @property {React.ComponentType<{ size?: number, strokeWidth?: number }>} [trailingIcon] Optional right icon. Its glyph follows the same scale as `icon`.
 * @property {string} [trailingIconLabel] Accessible name for the trailing control. Required when `onTrailingIconClick` is set.
 * @property {(event: React.MouseEvent<HTMLButtonElement>) => void} [onTrailingIconClick] Turns `trailingIcon` into a focusable button rendered after the input in the tab order.
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
    trailingIcon: TrailingIcon,
    trailingIconLabel,
    onTrailingIconClick,
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
  const sizeKey = SIZES[size] ? size : 'md';
  const padInset = tokens.control[sizeKey].padInset;
  const iconPx = ICON_FOR_SIZE[sizeKey];
  // Each occupied edge owns the same clearance independently, so two icons do
  // not overwrite one another. The trailing formula is the leading formula
  // reflected: two rung insets plus the glyph keeps text out from under the
  // slot without introducing a second spacing scale.
  const inputStyle = {
    ...(Icon ? { paddingLeft: `calc(${padInset} * 2 + ${iconPx}px)` } : {}),
    ...(TrailingIcon ? { paddingRight: `calc(${padInset} * 2 + ${iconPx}px)` } : {}),
  };

  return (
    <div
      data-size={sizeKey}
      className={cn('flex flex-col gap-[var(--andromeda-2)]', wrapperClassName)}
      style={{ ...andromedaVars(), ...style }}
    >
      {label ? (
        <label
          htmlFor={id}
          className={cn(
            '[font-family:var(--andromeda-font-mono)]',
            // 12px at every rung, not 10: a field label is read, so it sits on
            // the legibility floor rather than below it (2026-08-11).
            'text-[length:var(--andromeda-text-sm)]',
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
            // The wrapper is the input's BORDER box, while padding-left below
            // measures from inside the border, so the icon has to add the
            // border back to sit the same inset off the frame as the text.
            style={{ left: `calc(var(--andromeda-border-width, 1px) + ${padInset})` }}
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
          style={Icon || TrailingIcon ? inputStyle : undefined}
          className={cn(inputVariants({ size: sizeKey, state }), className)}
          {...props}
        />

        {TrailingIcon ? (
          onTrailingIconClick ? (
            <button
              type="button"
              aria-label={trailingIconLabel}
              aria-controls={id}
              disabled={disabled}
              // Keep a pointer press from transferring focus out of the editor,
              // which preserves its caret while the action runs. The native
              // button remains keyboard-focusable after the input because only
              // the mouse focus step is cancelled, never its tab stop or click.
              onMouseDown={(event) => event.preventDefault()}
              onClick={onTrailingIconClick}
              style={{ right: `calc(var(--andromeda-border-width, 1px) + ${padInset})` }}
              className={cn(
                'absolute top-1/2 -translate-y-1/2',
                'inline-flex items-center justify-center',
                'm-0 border-0 p-0',
                'rounded-[var(--andromeda-radius-frame,0px)]',
                'bg-transparent text-[color:var(--andromeda-text-muted)]',
                'cursor-pointer',
                'transition-[color,box-shadow] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
                'motion-reduce:transition-none',
                'hover:text-[color:var(--andromeda-text-primary)]',
                'focus-visible:outline-none focus-visible:text-[color:var(--andromeda-text-primary)]',
                'focus-visible:shadow-[0_0_0_var(--andromeda-border-width,1px)_var(--andromeda-border-bright)]',
                'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[var(--andromeda-opacity-disabled)]',
              )}
            >
              <TrailingIcon size={iconPx} weight="regular" />
            </button>
          ) : (
            <div
              aria-hidden="true"
              // Same border-box correction as the left slot, reflected onto
              // the right edge so both glyphs sit on one inset line.
              style={{ right: `calc(var(--andromeda-border-width, 1px) + ${padInset})` }}
              className={cn(
                'absolute top-1/2 -translate-y-1/2',
                'flex items-center pointer-events-none',
                'text-[color:var(--andromeda-text-muted)]',
              )}
            >
              <TrailingIcon size={iconPx} weight="regular" />
            </div>
          )
        ) : null}
      </div>

      {error ? (
        <span
          id={errorId}
          role="alert"
          className={cn(
            '[font-family:var(--andromeda-font-mono)]',
            // 12px, same floor as the label: an error message is the most
            // important text in the field, never the smallest.
            'text-[length:var(--andromeda-text-sm)]',
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
