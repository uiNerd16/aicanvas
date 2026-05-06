// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Tooltip
// Wraps any child and shows a floating label on hover.
// Positioned above by default; pass position="bottom" to flip.
// Sharp corners, surface.overlay background — no arrow, no portal.
// Uses inline hover state (onMouseEnter/Leave) so it works without
// a class-based stylesheet.
// ============================================================

'use client';

import { forwardRef, useState } from 'react';
import { tokens } from '../tokens';

/**
 * @typedef {object} TooltipProps
 * @property {string} label              Text shown in the tooltip.
 * @property {'top'|'bottom'} [position='top']
 * @property {React.ReactNode} children  The trigger element.
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<TooltipProps & React.HTMLAttributes<HTMLDivElement>>} */
export const Tooltip = forwardRef(function Tooltip(
  { label, position = 'top', children, className, style, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);

  const floatStyle =
    position === 'bottom'
      ? { top: `calc(100% + ${tokens.spacing[2]})` }
      : { bottom: `calc(100% + ${tokens.spacing[2]})` };

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      {...props}
    >
      {children}

      {visible && label ? (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            ...floatStyle,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 100,
            padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
            background: tokens.color.surface.overlay,
            border: `${tokens.border.thin} ${tokens.color.border.base}`,
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.secondary,
            letterSpacing: tokens.typography.tracking.wider,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
});
