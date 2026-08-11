// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: UserCard
// User card menu — the same popover as `UserMenu`, but the trigger
// is a wider card showing the user's avatar, name, and role
// alongside the CaretUpDown chevron. Designed for the bottom of a
// sidebar where there is room to spell the user identity out;
// reach for `UserMenu` instead when the trigger has to fit beside
// other top-bar controls.
//
// Defaults `placement="top"` and `align="stretch"` because the
// canonical home is a bottom-of-sidebar slot: the menu opens
// upward so it doesn't run off-screen and stretches to the card's
// width so the panel sits flush.
//
// Follows the same popover rules as `UserMenu` — see that file's
// header and the Andromeda interaction-states rules. Panel state + items rendering
// are reused from `./UserMenu` so the two components can never
// drift apart visually.
// ============================================================

'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CaretUpDown } from '@phosphor-icons/react';
import { tokens } from '../tokens';
import { Avatar } from './Avatar';
import { andromedaVars, easingArray } from './lib/utils';
import {
  CHEVRON_FOR_SIZE,
  UserMenuPanel,
  UserMenuStyles,
  useUserMenuPanel,
} from './UserMenu';

// Motion locals — same convention as Drawer / UserMenu: keep every
// duration + easing referenced to a token while adapting to the shape
// framer-motion expects (seconds + 4-tuple bezier).
const toSeconds = (ms) => parseInt(ms, 10) / 1000;
// framer boundary: derived from tokens, cannot follow runtime var overrides
const EASE_STANDARD = easingArray(tokens.motion.easing.standard);

// Card geometry per rung. The inset stays uniform on all four sides (the card
// is a labelled block, not a centred control) and steps one stop of the
// spacing scale per rung. Name and role share one size because they read as
// one identity lockup, and that size follows the size-step law: 12 / 14 / 16.
// The whole card is a button, so its name and role are interactive text, not
// metadata — they were sitting at 10px, which is what the legibility floor
// exists to prevent.
// The name takes the rung; the ROLE sits one rung below it and never goes under
// 12px. They used to share one size, which stopped working the moment the rung
// moved up: uppercase mono at wider tracking is a wide face, and "FLIGHT
// DIRECTOR" at 14px no longer fits the text column of a 224px card, so the role
// wrapped to two lines and the name truncated. A rung of separation also gives
// the lockup the hierarchy it was missing.
// Avatar rung per card rung. sm borrows md's 32px square: see the note at the
// Avatar call below.
const AVATAR_FOR_SIZE = { sm: 'md', md: 'md', lg: 'lg' };

const CARD_FOR_SIZE = {
  sm: { pad: tokens.spacing[2], gap: tokens.spacing[2], text: tokens.typography.size.sm, roleText: tokens.typography.size.sm },
  md: { pad: tokens.spacing[3], gap: tokens.spacing[3], text: tokens.typography.size.md, roleText: tokens.typography.size.sm },
  lg: { pad: tokens.spacing[4], gap: tokens.spacing[4], text: tokens.typography.size.lg, roleText: tokens.typography.size.md },
};

/**
 * @typedef {object} UserCardProps
 * @property {string} name Shown as the card's primary label and used for the avatar initials.
 * @property {string} [role]           Subtitle under the name (e.g. "Flight Director").
 * @property {string} [src] Optional avatar image URL; falls back to initials when absent.
 * @property {'online'|'caution'|'fault'|'offline'} [status] Presence status shown as a dot on the avatar. Passed verbatim to Avatar, whose enum this is; any other value renders no dot.
 * @property {'sm'|'md'|'lg'} [size='md'] Scales the whole card: avatar (24/32/40), inset, gap, name/role type and chevron. The popover rows are unaffected. Replaces the older `avatarSize` prop, which scaled only the avatar; a copy still passing `avatarSize` renders md.
 * @property {UserMenuItem[]} items Entries rendered in the popover menu.
 * @property {'top'|'bottom'} [placement='top'] Which side of the card the menu opens toward.
 * @property {'start'|'end'|'stretch'} [align='stretch'] How the panel aligns to the card; stretch matches its width.
 * @property {boolean} [defaultOpen=false] Render the menu pre-opened (showcases / docs). Outside-click and Escape still dismiss it.
 * @property {boolean} [staticOpen=false] Render pre-opened AND pinned; outside-click / Escape do not dismiss it. For showcases / docs where several popovers are shown open at once and one must not close the others.
 * @property {string} [ariaLabel='User menu'] Accessible label for the trigger button and menu.
 * @property {string} [className] Extra class names for the card's root element.
 * @property {React.CSSProperties} [style] Inline styles merged onto the card's root element.
 */

/** @type {React.ForwardRefExoticComponent<UserCardProps>} */
export const UserCard = forwardRef(function UserCard(
  {
    name,
    role,
    src,
    status,
    size = 'md',
    items,
    placement = 'top',
    align = 'stretch',
    defaultOpen = false,
    staticOpen = false,
    ariaLabel = 'User menu',
    className,
    style,
    ...props
  },
  ref,
) {
  // Resolve the rung once. `size` comes from a caller, so an unrecognised value
  // must fall back to md instead of throwing on `rung.pad` and taking the whole
  // subtree down. The same key feeds the chevron and the Avatar so all three
  // land on one rung. Same guard as PanelHeader.
  const sizeKey = CARD_FOR_SIZE[size] ? size : 'md';
  const rung = CARD_FOR_SIZE[sizeKey];
  const { open, wrapperRef, triggerProps, close } = useUserMenuPanel(defaultOpen, staticOpen);
  const [hover, setHover] = useState(false);
  const highlight = open || hover;

  return (
    <div
      ref={(node) => {
        wrapperRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="user-card"
      // The rung that actually rendered, after the default and the guard above.
      // A default never appears in props, so <UserCard /> is otherwise
      // un-inspectable. Mirrors UserMenu.
      data-size={sizeKey}
      className={className}
      style={{ ...andromedaVars(), position: 'relative', display: 'block', width: '100%', ...style }}
      {...props}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        {...triggerProps}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        style={{
          all: 'unset',
          boxSizing: 'border-box',
          position: 'relative',
          width: '100%',
          padding: rung.pad,
          display: 'flex',
          alignItems: 'center',
          gap: rung.gap,
          cursor: 'pointer',
          background: highlight ? tokens.color.surface.hover : 'transparent',
          transition: `background var(--andromeda-duration-fast, ${tokens.motion.duration.fast}) var(--andromeda-easing-standard, ${tokens.motion.easing.standard})`,
        }}
      >
        {/* The avatar is sized to the LOCKUP, not to the rung name. An sm card
            stacks a 12px name over a 12px role, so its block of text is around
            34px tall and a 24px avatar reads undersized beside it; md's 32px
            carries it. md and lg keep their own rungs, where the pairing
            already works. */}
        <Avatar name={name} src={src} status={status} size={AVATAR_FOR_SIZE[sizeKey]} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: rung.text,
              fontWeight: tokens.typography.weight.semibold,
              color: tokens.color.text.primary,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.wider,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </div>
          {role ? (
            <div
              style={{
                fontFamily: tokens.typography.fontMono,
                fontSize: rung.roleText,
                // secondary, not muted: the floor forbids muted at 12px, and
                // this line sits inside a button.
                color: tokens.color.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.tracking.wide,
                // Truncate like the name above. A role is one line of metadata;
                // wrapping it to two grows the card and breaks the row rhythm
                // of the sidebar it lives in.
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {role}
            </div>
          ) : null}
        </div>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{
            duration: toSeconds(tokens.motion.duration.normal),
            ease: EASE_STANDARD,
          }}
          style={{
            display: 'inline-flex',
            color: highlight ? tokens.color.text.secondary : tokens.color.text.faint,
            transition: `color var(--andromeda-duration-fast, ${tokens.motion.duration.fast}) var(--andromeda-easing-standard, ${tokens.motion.easing.standard})`,
          }}
        >
          <CaretUpDown size={CHEVRON_FOR_SIZE[sizeKey]} weight="regular" />
        </motion.span>
      </button>

      <UserMenuPanel
        open={open}
        items={items}
        placement={placement}
        align={align}
        ariaLabel={ariaLabel}
        onClose={close}
      />
      <UserMenuStyles />
    </div>
  );
});
