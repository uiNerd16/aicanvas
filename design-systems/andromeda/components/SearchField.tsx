// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: SearchField
// Command-bar-style search input with an optional ⌘-K shortcut chip.
// Five states: idle, hover, focus (selected), text-inactive (placeholder),
// text-active (typed). All values resolve through tokens.ts — see
// the Andromeda interaction-states rules for the model.
// ============================================================

'use client';

import { forwardRef, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { tokens } from '../tokens';

// Leading glyph per rung, off tokens.iconSize. Was a hardcoded 14, which is on
// neither the icon scale nor the control ladder. sm deliberately stays 12 rather
// than dropping to 10: Input runs this same 12/16/20 ladder at the same rungs,
// so a SearchField sitting beside an Input has to show the same glyph, and 10 is
// not on tokens.iconSize at all. The 1px the sm glyph rides into the padding is
// how every Andromeda field icon behaves: padInset is the TEXT inset, and md/lg
// ride into it by 2px and 3px without anyone calling it a defect.
const ICON_FOR_SIZE = { sm: tokens.iconSize.xs, md: tokens.iconSize.sm, lg: tokens.iconSize.lg };

// Which characters get the symbol treatment. The stack and the optical step-up
// that go with them live in tokens.typography.fontSymbol / symbolScale.
const MODIFIER_GLYPHS = /([⌘⌥⇧⌃⏎⌫⎋])/;

// The shortcut chip is a keycap, so its type comes off the TYPE SCALE and its
// height falls out of that type plus its own padding. It is deliberately not
// derived from whatever vertical space the field has left over: deriving it
// that way once produced 6px type at sm, below the 10px floor of
// typography.size and past the point of being readable.
// Resulting heights against the field's content box (rung height less its two
// borders): sm 16 in 22, md 18 in 30, lg 22 in 38. Slack every rung.
const CHIP_FOR_SIZE = {
  sm: { text: tokens.typography.size.xs, padY: '2px', padX: '4px' },
  md: { text: tokens.typography.size.xs, padY: '3px', padX: '6px' },
  lg: { text: tokens.typography.size.sm, padY: '4px', padX: '8px' },
};

// Guard the rung lookups: `size` arrives from a caller and both maps are read
// straight into style values, so an unrecognised string would throw and take
// the subtree down rather than degrade.
const SIZES = { sm: true, md: true, lg: true };

/**
 * @typedef {object} SearchFieldProps
 * @property {'sm'|'md'|'lg'} [size='md'] Rung on the shared control ladder: 24, 32 or 40px tall. Matches Button, IconButton and Input at the same value.
 * @property {string} [placeholder='Search anything'] Text shown when empty. Defaults to "Search anything".
 * @property {string|null} [shortcut='⌘ K'] Keyboard shortcut chip. Pass null to hide. Defaults to "⌘ K".
 * @property {React.ComponentType<{ size?: number, weight?: string, color?: string, style?: React.CSSProperties }>} [icon=MagnifyingGlass] Phosphor-style leading icon. Defaults to MagnifyingGlass. Pass null to hide.
 * @property {string} [value] Controlled value.
 * @property {string} [defaultValue] Uncontrolled initial value.
 * @property {(next: string) => void} [onValueChange] Called when typed value changes.
 * @property {string} [ariaLabel] Accessible label for the input. Defaults to placeholder.
 * @property {string} [className] Class name forwarded to the outer wrapper.
 * @property {React.CSSProperties} [style] Style merged into the outer wrapper (lets the parent set width).
 * @property {boolean} [disabled] Disables the field: dims it to the disabled opacity, shows a not-allowed cursor, and disables the underlying input.
 */

/** @type {React.ForwardRefExoticComponent<SearchFieldProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'>>} */
export const SearchField = forwardRef(function SearchField(
  {
    size = 'md',
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
  const rung = tokens.control[SIZES[size] ? size : 'md'];
  const chip = CHIP_FOR_SIZE[CHIP_FOR_SIZE[size] ? size : 'md'];
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const hasText = (value ?? '').length > 0;

  const [isHover, setIsHover] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  // State cascade: focus (selected) > hover > idle. Var-with-fallback so a
  // theme override (e.g. a blue accent) reaches the focus border, matching
  // the focus ring below — not a baked literal that stays the old accent.
  const borderColor = isFocus
    ? 'var(--andromeda-accent-400, #109380)'
    : isHover
    ? 'var(--andromeda-border-bright, #5B5B5C)'
    : 'var(--andromeda-border-base, #3E3E3F)';

  const background = isHover && !isFocus
    ? 'var(--andromeda-surface-hover, #1C1C1D)'
    : 'var(--andromeda-surface-raised, #141415)';

  const boxShadow = isFocus
    ? '0 0 0 var(--andromeda-border-width, 1px) var(--andromeda-accent-400, #109380), 0 0 var(--andromeda-glow, 8px) var(--andromeda-accent-500, #126059)'
    : 'none';

  // Icon brightens when the user engages — focus or typed.
  const iconColor = isFocus || hasText
    ? 'var(--andromeda-text-primary, #F5F5F5)'
    : 'var(--andromeda-text-muted, #9A9A9A)';

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
        // padInset again, not a flat spacing step: the field already insets its
        // content by padInset on all four sides, so an 8px gap made the space
        // between icon and text disagree with the space above them at every
        // rung (8 against 6 at sm, 8 against 9 at md, 8 against 12 at lg, the
        // "space between icon and text is too large" report). One number for
        // every horizontal space in the field.
        gap: rung.padInset,
        width: '100%',
        // border-box so the horizontal padding stays INSIDE the 100% width —
        // without it a full-width field overflows its container by the padding
        // and forces horizontal page scroll on a phone. It also keeps the 1px
        // border inside the ladder height below.
        boxSizing: 'border-box',
        // Height is the rung, not a padding sum, so this field agrees with a
        // Button of the same size to the pixel. See tokens.control.
        height: rung.height,
        // padInset, not padX: this is a FIELD, so its glyphs sit left-aligned
        // against the border and an inset wider at the sides than above reads
        // as broken. Same inset Input takes at this rung.
        //
        // Horizontal ONLY. The height above is already pinned and the children
        // are centred, so the text lands padInset off the top by itself. Adding
        // real vertical padding here does nothing visible and costs 2*padInset
        // of content band, which is what forced the shortcut chip below the
        // type scale last time this was tried.
        padding: `0 ${rung.padInset}`,
        border: `${tokens.border.thin} ${borderColor}`,
        borderRadius: tokens.radius.frame,
        background,
        boxShadow,
        opacity: disabled ? 'var(--andromeda-opacity-disabled, 0.4)' : 1,
        cursor: disabled ? 'not-allowed' : 'text',
        transition: [
          `border-color ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
          `background-color ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
          `box-shadow ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
        ].join(', '),
        ...style,
      }}
    >
      {Icon ? (
        <Icon
          size={ICON_FOR_SIZE[size]}
          weight="regular"
          style={{
            flexShrink: 0,
            // Phosphor renders fill="currentColor"; CSS color lets the var resolve.
            color: iconColor,
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
              fontSize: rung.text,
              // padInset only equals the vertical gap while the line box is the
              // text itself; a leading of `normal` would eat the difference.
              lineHeight: tokens.typography.lineHeight.none,
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
          onBlur={() => {
            setIsFocus(false);
            setIsHover(false);
          }}
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
            fontSize: rung.text,
            // Deliberately NOT pinned to leading 1, unlike the placeholder span
            // beside it. This input has no height and no padding, so its content
            // box is its line box: pin the leading to 1 and the box collapses to
            // the font size, while JetBrains Mono's descender reaches 1.32em.
            // The browser clips the inner editor to that box, so the tails of
            // g y p q j get cut off the moment anyone types them. The overlay
            // can be pinned because it is absolutely positioned and centred.
            color: tokens.color.text.primary,
            letterSpacing: tokens.typography.tracking.wide,
            caretColor: 'var(--andromeda-accent-400, #109380)',
          }}
        />
      </div>

      {shortcut ? (
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            // The space in "⌘ K", stated rather than inherited from a text
            // node. The split below hands the ⌘ and the " K" to separate flex
            // items, and leading white space at the start of an anonymous flex
            // item's line box is stripped, so the literal space never rendered
            // and the pair read as "⌘K". One spacing step is roughly one mono
            // space at every rung.
            gap: tokens.spacing[1],
            boxSizing: 'border-box',
            // No height: the chip is exactly its type plus its own padding, so
            // it cannot be squeezed by a retuned padInset. See CHIP_FOR_SIZE.
            fontSize: chip.text,
            lineHeight: tokens.typography.lineHeight.none,
            padding: `${chip.padY} ${chip.padX}`,
            fontFamily: tokens.typography.fontMono,
            color: tokens.color.text.faint,
            border: `${tokens.border.thin} ${tokens.color.border.subtle}`,
            borderRadius: tokens.radius.frame,
            textTransform: 'uppercase',
            // wider, not widest: two glyphs at 0.22em read as two unrelated
            // characters sharing a box rather than one keycap.
            letterSpacing: tokens.typography.tracking.wider,
            whiteSpace: 'nowrap',
          }}
        >
          {shortcut
            .split(MODIFIER_GLYPHS)
            // Drop the empty leading part and the white space the split carries
            // into " K". The gap above is what separates the pieces now, so no
            // piece has to survive flex's white-space stripping to be spaced.
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part, i) =>
              MODIFIER_GLYPHS.test(part) ? (
                <span
                  key={i}
                  style={{
                    fontFamily: tokens.typography.fontSymbol,
                    fontSize: `${tokens.typography.symbolScale}em`,
                    // Divide the scale back out. line-height is unitless, so it
                    // multiplies the span's OWN font-size: without this the
                    // stepped-up glyph makes a 1.25em line box inside a 1em
                    // content box and crosses the chip's hairline. The reciprocal
                    // returns the line box to 1em of the chip while the glyph
                    // keeps its size.
                    lineHeight: 1 / tokens.typography.symbolScale,
                  }}
                >
                  {part}
                </span>
              ) : (
                part
              ),
            )}
        </span>
      ) : null}
    </div>
  );
});

export default SearchField;
