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
    'border-[length:var(--andromeda-border-width,1px)] border-solid',
    'rounded-[var(--andromeda-radius-frame,0px)]',
    '[font-family:var(--andromeda-font-sans)]',
    'text-[color:var(--andromeda-text-primary)]',
    'bg-[color:var(--andromeda-surface-raised)]',
    // Arbitrary-property form, not leading-*: tailwind-merge puts leading-* and
    // text-[length:*] in conflicting groups, so the leading-* that used to sit
    // here was deleted by the size variant's text-[length:*] and the field ran
    // at the font's normal leading (~1.32 for JetBrains Mono) instead of 1.5.
    '[line-height:var(--andromeda-leading-normal,1.5)]',
    'outline-none',
    'transition-[border-color,box-shadow] [transition-duration:var(--andromeda-duration-normal)] [transition-timing-function:var(--andromeda-easing-out)]',
    'placeholder:text-[color:var(--andromeda-text-muted)]',
    'disabled:opacity-[var(--andromeda-opacity-disabled)] disabled:cursor-not-allowed disabled:resize-none',
  ],
  {
    variants: {
      // Same rung names as every other control, but a textarea's height belongs
      // to `rows`, so the ladder governs padding and text size only. Padding is
      // the ladder's field inset (padInset), equal on all four sides, so an `sm`
      // textarea and an `sm` Input stacked above it hold their text at the same
      // distance from the border. Sides used to be padX (12/16/20) against a
      // narrower top, which read as broken in a left-aligned field.
      // The leading is 1.5 from the base classes, because pinning it to 1 the
      // way Input does would collide the lines of a multi-line field. So here
      // the vertical inset is padInset as real padding, not the leftover half
      // of a pinned height: same number, different mechanism.
      // That 1.5 only started applying once the base class moved to the
      // [line-height:...] form above. Until then tailwind-merge stripped it and
      // every textarea rendered at the font's ~1.32 normal leading.
      // Combined effect of that leading and the padding move, measured at
      // rows=4 as 2*border + 2*pad + rows*text*leading:
      //   sm 70.8 -> 74.0 (+3.2), md 81.4 -> 92.0 (+10.6), lg 99.9 -> 110.0 (+10.1)
      // All six call sites are demos and showcase, none in examples or
      // templates, and two sit inside a scrolling DrawerBody, so nothing
      // fixed-height breaks.
      // Type follows the size step (2026-08-11): sm 12, md 14, lg 16, matching
      // an Input at the same rung. It was one rung low (10 / 12 / 14). Nothing
      // here is pinned, so at rows=4 the field simply grows with its type:
      //   sm 74 -> 88, md 92 -> 104, lg 110 -> 120.
      size: {
        sm: 'p-[var(--andromeda-inset-sm)] text-[length:var(--andromeda-text-sm)]',
        md: 'p-[var(--andromeda-inset-md)] text-[length:var(--andromeda-text-md)]',
        lg: 'p-[var(--andromeda-inset-lg)] text-[length:var(--andromeda-text-lg)]',
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
          // The typed value carries the fault with the border and the label.
          // The message below stays neutral: red marks WHAT is wrong, the
          // message only explains it, and two reds compete for the same job.
          'text-[color:var(--andromeda-red-300)]',
          'focus:border-[color:var(--andromeda-red-300)]',
          'focus-visible:shadow-[0_0_0_1px_var(--andromeda-red-300),0_0_8px_var(--andromeda-red-400)]',
        ],
      },
    },
    defaultVariants: { size: 'md', state: 'default' },
  },
);

/**
 * @typedef {object} TextareaProps
 * @property {string} [label]            Uppercase mono label rendered above the field.
 * @property {'sm'|'md'|'lg'} [size='md'] Rung on the shared control ladder. Sets padding and text size to match an Input of the same size; the height still comes from `rows`.
 * @property {string} [error]            When set, switches the field into the error state.
 * @property {number} [rows=4]           Number of visible text lines; sets the field's initial and minimum height.
 * @property {string} [className]        Forwarded to the <textarea>.
 * @property {string} [wrapperClassName] Forwarded to the outer wrapper.
 */

/** @type {React.ForwardRefExoticComponent<TextareaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>} */
export const Textarea = forwardRef(function Textarea(
  {
    className,
    wrapperClassName,
    label,
    size = 'md',
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
      data-size={size}
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
            error
              ? 'text-[color:var(--andromeda-red-300)]'
              : 'text-[color:var(--andromeda-text-secondary)]',
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
        className={cn(textareaVariants({ size, state }), className)}
        {...props}
      />

      {error ? (
        <span
          id={errorId}
          role="alert"
          className={cn(
            '[font-family:var(--andromeda-font-mono)]',
            // 12px, same floor as the label: an error message is the most
            // important text in the field, never the smallest.
            'text-[length:var(--andromeda-text-sm)]',
            // Neutral on purpose. The label, border and value already carry the
            // fault in red; this line is the explanation, and painting it red
            // too made the whole field one undifferentiated alarm.
            'text-[color:var(--andromeda-text-secondary)]',
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
