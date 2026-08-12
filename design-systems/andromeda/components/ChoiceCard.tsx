// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: ChoiceCard
// Selectable whole-surface card with a Radio, Checkbox, or Toggle
// as its native state and form control. ChoiceCardGroup adds the
// single-select contract for radio cards.
// ============================================================

'use client';

import { createContext, forwardRef, useContext, useId } from 'react';
import { Card, CardDescription, CardTitle } from './Card';
import { Checkbox } from './Checkbox';
import { Radio, RadioGroup } from './Radio';
import { Toggle } from './Toggle';
import { cn } from './lib/utils';

const CONTROL_BY_KIND = {
  radio: Radio,
  checkbox: Checkbox,
  toggle: Toggle,
};

const ChoiceCardGroupContext = createContext(false);

const CHOICE_CARD_STYLES = `
  .andromeda-choice-card:has(> [data-slot="choice-card-control"] input:checked) {
    /* Selected is a SURFACE, so the card takes the family tint. The
       nested control remains the solid state mark. */
    background-color: var(--andromeda-accent-alpha) !important;
    border-color: var(--andromeda-accent-500) !important;
  }

  .andromeda-choice-card:hover:not(:has(> [data-slot="choice-card-control"] input:checked)):not(:has(> [data-slot="choice-card-control"] input:disabled)),
  [data-force~="hover"] .andromeda-choice-card:not(:has(> [data-slot="choice-card-control"] input:checked)):not(:has(> [data-slot="choice-card-control"] input:disabled)) {
    background-color: var(--andromeda-surface-hover) !important;
    border-color: var(--andromeda-border-bright) !important;
  }

  .andromeda-choice-card:hover:has(> [data-slot="choice-card-control"] input:checked):not(:has(> [data-slot="choice-card-control"] input:disabled)),
  [data-force~="hover"] .andromeda-choice-card:has(> [data-slot="choice-card-control"] input:checked):not(:has(> [data-slot="choice-card-control"] input:disabled)) {
    border-color: var(--andromeda-accent-300) !important;
  }

  .andromeda-choice-card:has(> [data-slot="choice-card-control"] input:focus-visible),
  [data-force~="focus"] .andromeda-choice-card:not(:has(> [data-slot="choice-card-control"] input:disabled)) {
    outline: var(--andromeda-border-width, 1px) solid var(--andromeda-accent-400);
    outline-offset: var(--andromeda-border-width, 1px);
  }

  .andromeda-choice-card:has(> [data-slot="choice-card-control"] input:disabled) {
    cursor: not-allowed;
    opacity: var(--andromeda-opacity-disabled) !important;
  }

  /* The native input, not an onClick shim, owns the whole hit and focus area.
     Releasing the control's positioned wrapper makes the Card its containing
     block; the explicit edges also beat the coarse-pointer target expander. */
  .andromeda-choice-card > [data-slot="choice-card-control"] > div > span {
    position: static;
  }

  .andromeda-choice-card > [data-slot="choice-card-control"] > div > span > input {
    inset: calc(0px - var(--andromeda-border-width, 1px)) !important;
    width: calc(100% + var(--andromeda-border-width, 1px) + var(--andromeda-border-width, 1px)) !important;
    height: calc(100% + var(--andromeda-border-width, 1px) + var(--andromeda-border-width, 1px)) !important;
    transform: none !important;
  }

  /* ChoiceCard carries focus at card scale and never glows. Disabled opacity
     is also paid once by the card, rather than once more by the proxy. */
  .andromeda-choice-card .andromeda-choice-card-control-mark,
  .andromeda-choice-card .andromeda-choice-card-control-mark > span {
    box-shadow: none !important;
  }

  .andromeda-choice-card:has(> [data-slot="choice-card-control"] input:disabled) .andromeda-choice-card-control-mark {
    opacity: 1 !important;
  }
`;

/**
 * @typedef {object} ChoiceCardProps
 * @property {React.ReactNode} title Primary option name; display content only, with no nested interactive element.
 * @property {React.ReactNode} [description] Optional supporting line; display content only, with no nested interactive element.
 * @property {'radio'|'checkbox'|'toggle'} [control='radio'] Native control used as the state indicator.
 * @property {string} [value] Native input value; required for radio cards inside ChoiceCardGroup.
 * @property {boolean} [checked] Controlled checked state.
 * @property {boolean} [defaultChecked=false] Initial checked state in uncontrolled mode.
 * @property {(next: boolean) => void} [onCheckedChange] Called with the next checked state.
 * @property {'md'|'lg'} [size='md'] Size passed to the nested control.
 * @property {boolean} [disabled=false] Disables the native control and dims the whole card.
 * @property {string} [id] Native input id; auto-generated when omitted.
 * @property {string} [name] Native input name; a ChoiceCardGroup supplies this to radio cards.
 * @property {string} [className] Extra classes merged onto the Card root.
 * @property {React.CSSProperties} [style] Inline styles merged onto the Card root.
 */

/** @type {React.ForwardRefExoticComponent<ChoiceCardProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'|'className'|'style'|'title'|'type'|'size'|'onChange'>>} */
export const ChoiceCard = forwardRef(function ChoiceCard(
  {
    title,
    description,
    control = 'radio',
    value,
    checked,
    defaultChecked = false,
    onCheckedChange,
    size = 'md',
    disabled = false,
    id: idProp,
    name,
    className,
    style,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    ...props
  },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `andromeda-choice-card-${reactId}`;
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const hasDescription = description !== undefined && description !== null;
  const controlKind = CONTROL_BY_KIND[control] ? control : 'radio';
  const Control = CONTROL_BY_KIND[controlKind];
  const inChoiceCardGroup = useContext(ChoiceCardGroupContext);

  if (inChoiceCardGroup && controlKind !== 'radio') {
    throw new Error(
      'ChoiceCardGroup accepts only ChoiceCard elements with control="radio". Render checkbox and toggle cards independently.',
    );
  }

  return (
    <Card
      data-slot="choice-card"
      data-control={controlKind}
      className={cn(
        'andromeda-choice-card',
        'relative w-full flex-row items-center gap-[var(--andromeda-3)]',
        'bg-transparent',
        // ChoiceCard needs a continuous edge to map the hit area, while the
        // Card markers keep the family frame. `bordered` would suppress them.
        'border-[length:var(--andromeda-border-width,1px)] border-solid border-[color:var(--andromeda-border-base)]',
        'rounded-[var(--andromeda-radius-frame,0px)]',
        'px-[var(--andromeda-3)] py-[var(--andromeda-3)]',
        'cursor-pointer',
        'transition-[background-color,border-color,outline-color]',
        '[transition-duration:var(--andromeda-duration-normal)]',
        '[transition-timing-function:var(--andromeda-easing-out)]',
        className,
      )}
      style={style}
    >
      <div className="relative min-w-0 grow flex flex-col gap-[var(--andromeda-1)]">
        <CardTitle
          id={titleId}
          className={cn(
            '[font-family:var(--andromeda-font-sans)]',
            'normal-case [letter-spacing:var(--andromeda-tracking-normal)]',
          )}
        >
          {title}
        </CardTitle>
        {hasDescription ? (
          <CardDescription id={descriptionId}>{description}</CardDescription>
        ) : null}
      </div>

      <div data-slot="choice-card-control" className="shrink-0">
        <Control
          ref={ref}
          id={id}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          size={size}
          disabled={disabled}
          className="andromeda-choice-card-control-mark"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby ?? (ariaLabel ? undefined : titleId)}
          aria-describedby={ariaDescribedby ?? (hasDescription ? descriptionId : undefined)}
          {...props}
        />
      </div>

      <style>{CHOICE_CARD_STYLES}</style>
    </Card>
  );
});

ChoiceCard.displayName = 'ChoiceCard';

/**
 * @typedef {object} ChoiceCardGroupProps
 * @property {string} [name] Shared native name for the group's radio cards; auto-generated when omitted.
 * @property {string} [value] Selected value in controlled mode.
 * @property {string} [defaultValue] Initially selected value in uncontrolled mode.
 * @property {(next: string) => void} [onValueChange] Called with the newly selected value.
 * @property {boolean} [disabled=false] Disables every radio card in the group.
 * @property {React.ReactNode} [children] ChoiceCard elements using control="radio" and unique values.
 * @property {string} [className] Extra classes merged onto the radiogroup wrapper.
 * @property {React.CSSProperties} [style] Inline styles merged onto the radiogroup wrapper.
 * @property {'vertical'|'horizontal'} [aria-orientation='vertical'] Direction exposed to assistive technology; native radio arrow keys handle both axes.
 */

export function ChoiceCardGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  children,
  className,
  style,
  'aria-orientation': ariaOrientation = 'vertical',
  ...props
}) {
  return (
    // Native same-name radios own the roving focus: the selected card is the
    // Tab stop, and arrow keys move focus and selection without a second model.
    <ChoiceCardGroupContext.Provider value>
      <RadioGroup
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        className={cn('andromeda-choice-card-group w-full', className)}
        style={style}
        aria-orientation={ariaOrientation}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {children}
      </RadioGroup>
    </ChoiceCardGroupContext.Provider>
  );
}
