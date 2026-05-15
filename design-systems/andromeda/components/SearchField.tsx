// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: SearchField
// Command-bar-style search input with an optional ⌘-K shortcut chip.
// Five states: idle, hover, focus (selected), text-inactive (placeholder),
// text-active (typed). All values resolve through tokens.ts — see
// design-systems/andromeda/rules.md → Interaction states for the model.
// ============================================================

'use client';

import { forwardRef, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { tokens } from '../tokens';
import { CornerMarkers } from './CornerMarkers';

/**
 * @typedef {object} SearchFieldProps
 * @property {string} [placeholder] Text shown when empty. Defaults to "Search anything".
 * @property {string|null} [shortcut] Keyboard shortcut chip. Pass null to hide. Defaults to "⌘ K".
 * @property {React.ComponentType<{ size?: number, weight?: string, color?: string, style?: React.CSSProperties }>} [icon] Phosphor-style leading icon. Defaults to MagnifyingGlass. Pass null to hide.
 * @property {string} [value] Controlled value.
 * @property {string} [defaultValue] Uncontrolled initial value.
 * @property {(next: string) => void} [onValueChange] Called when typed value changes.
 * @property {string} [ariaLabel] Accessible label for the input. Defaults to placeholder.
 * @property {string} [className] Class name forwarded to the outer wrapper.
 * @property {React.CSSProperties} [style] Style merged into the outer wrapper (lets the parent set width).
 */

/** @type {React.ForwardRefExoticComponent<SearchFieldProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'>>} */
export const SearchField = forwardRef(function SearchField(
  {
    placeholder = 'Search anything',
    shortcut = '⌘ K',
    icon: Icon = MagnifyingGlass,
    value: controlledValue,
    defaultValue = '',
    onValueChange,
    ariaLabel,
    className,
    style,
    disabled,
    ...rest
  },
  ref,
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const hasText = (value ?? '').length > 0;

  const [isHover, setIsHover] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  // State cascade: focus (selected) > hover > idle.
  const borderColor = isFocus
    ? tokens.color.accent[400]
    : isHover
    ? tokens.color.border.bright
    : tokens.color.border.base;

  const background = isHover && !isFocus
    ? tokens.color.surface.hover
    : tokens.color.surface.raised;

  const boxShadow = isFocus
    ? `0 0 0 1px ${tokens.color.accent[400]}, 0 0 8px ${tokens.color.accent[500]}`
    : 'none';

  // Icon brightens when the user engages — focus or typed.
  const iconColor = isFocus || hasText
    ? tokens.color.text.primary
    : tokens.color.text.muted;

  const handleChange = (e) => {
    const next = e.target.value;
    if (!isControlled) setUncontrolledValue(next);
    onValueChange?.(next);
  };

  return (
    <div
      className={className}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[3],
        width: '100%',
        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
        border: `${tokens.border.thin} ${borderColor}`,
        background,
        boxShadow,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
        transition: [
          `border-color ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
          `background-color ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
          `box-shadow ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
        ].join(', '),
        ...style,
      }}
    >
      <CornerMarkers size={4} offset={2} />

      {Icon ? (
        <Icon
          size={14}
          weight="regular"
          color={iconColor}
          style={{
            flexShrink: 0,
            transition: `color ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
          }}
        />
      ) : null}

      {/* Input + placeholder overlay. The overlay avoids the ::placeholder
          pseudo, which can't be set via inline styles. */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {!hasText ? (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.md,
              color: tokens.color.text.muted,
              letterSpacing: tokens.typography.tracking.wide,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {placeholder}
          </span>
        ) : null}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          aria-label={ariaLabel ?? placeholder}
          disabled={disabled}
          {...rest}
          style={{
            display: 'block',
            width: '100%',
            padding: 0,
            margin: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.primary,
            letterSpacing: tokens.typography.tracking.wide,
            caretColor: tokens.color.accent[400],
          }}
        />
      </div>

      {shortcut ? (
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.faint,
            padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
            border: `${tokens.border.thin} ${tokens.color.border.subtle}`,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}
        >
          {shortcut}
        </span>
      ) : null}
    </div>
  );
});

export default SearchField;
