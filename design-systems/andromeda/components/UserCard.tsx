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
// header and rules.md → Popovers. Panel state + items rendering
// are reused from `./UserMenu` so the two components can never
// drift apart visually.
// ============================================================

'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CaretUpDown } from '@phosphor-icons/react';
import { tokens } from '../tokens';
import { Avatar } from './Avatar';
import { andromedaVars } from './lib/utils';
import {
  UserMenuPanel,
  UserMenuStyles,
  useUserMenuPanel,
} from './UserMenu';

// Motion locals — same convention as Drawer / UserMenu: keep every
// duration + easing referenced to a token while adapting to the shape
// framer-motion expects (seconds + 4-tuple bezier).
const toSeconds = (ms) => parseInt(ms, 10) / 1000;
const EASE_STANDARD = [0.4, 0, 0.2, 1]; // tokens.motion.easing.standard

/**
 * @typedef {object} UserCardProps
 * @property {string} name
 * @property {string} [role]           Subtitle under the name (e.g. "Flight Director").
 * @property {string} [src]
 * @property {'online'|'busy'|'away'|'offline'} [status]
 * @property {'sm'|'md'|'lg'} [avatarSize='md']
 * @property {UserMenuItem[]} items
 * @property {'top'|'bottom'} [placement='top']
 * @property {'start'|'end'|'stretch'} [align='stretch']
 * @property {boolean} [defaultOpen=false] Render the menu pre-opened (showcases / docs). Outside-click and Escape still dismiss it.
 * @property {string} [ariaLabel='User menu']
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<UserCardProps>} */
export const UserCard = forwardRef(function UserCard(
  {
    name,
    role,
    src,
    status,
    avatarSize = 'md',
    items,
    placement = 'top',
    align = 'stretch',
    defaultOpen = false,
    ariaLabel = 'User menu',
    className,
    style,
    ...props
  },
  ref,
) {
  const { open, wrapperRef, triggerProps, close } = useUserMenuPanel(defaultOpen);
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
          padding: tokens.spacing[3],
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[3],
          cursor: 'pointer',
          background: highlight ? tokens.color.surface.hover : 'transparent',
          transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
        }}
      >
        <Avatar name={name} src={src} status={status} size={avatarSize} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
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
                fontSize: tokens.typography.size.xs,
                color: tokens.color.text.muted,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.tracking.wide,
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
            transition: `color ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`,
          }}
        >
          <CaretUpDown size={14} weight="regular" />
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
