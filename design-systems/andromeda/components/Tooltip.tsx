// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Tooltip
// Wraps any child and shows a floating label on hover.
// Positioned above by default; top | bottom | left | right.
// Sharp corners, surface.overlay background — no arrow, no portal.
// Uses inline hover state (onMouseEnter/Leave) so it works without
// a class-based stylesheet.
// ============================================================

'use client';

import { cloneElement, forwardRef, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../tokens';
import { useReducedMotion } from './lib/motion';

// Layout effect on the client (measure + correct before paint, no flash),
// plain effect on the server (avoids the useLayoutEffect SSR warning).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Keep the clamped tooltip this far (token) clear of either viewport edge.
const EDGE_INSET = parseInt(tokens.spacing[2], 10); // 8px

const ms = (v) => parseInt(v, 10) / 1000;
const ENTER_TX = { duration: ms(tokens.motion.duration.normal), ease: [0, 0, 0.2, 1] }; // easing.out
const EXIT_TX  = { duration: ms(tokens.motion.duration.fast),   ease: [0.4, 0, 1, 1] }; // easing.in

/**
 * @typedef {object} TooltipProps
 * @property {string} label              Text shown in the tooltip.
 * @property {'top'|'bottom'|'left'|'right'} [position='top'] Side of the trigger the label hangs off. `left`/`right` are for icon rails, where a label above the row would cover its neighbour.
 * @property {React.ReactNode} children  The trigger element.
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<TooltipProps & React.HTMLAttributes<HTMLDivElement>>} */
export const Tooltip = forwardRef(function Tooltip(
  {
    label,
    position = 'top',
    children,
    className,
    style,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();
  const reducedMotion = useReducedMotion();
  // Horizontal correction (px) applied on top of the -50% centre transform so a
  // centred-but-clamped label on a trigger near a screen edge stays inside the
  // viewport instead of overflowing it and forcing horizontal page scroll. 0 in
  // the common (mid-screen) case; measured only while visible.
  const [shiftX, setShiftX] = useState(0);
  const floatRef = useRef(null);

  // Side placements exist for icon rails, where a label above the row would
  // cover the row above it. They centre on the OTHER axis, so the two
  // orientations divide framer's transform between them rather than fighting
  // over it: a vertical tooltip centres with `x` and enters on `y`, a side one
  // centres with `y` and enters on `x`.
  const side = position === 'left' || position === 'right';

  const floatStyle = side
    ? {
        top: '50%',
        y: '-50%',
        ...(position === 'right'
          ? { left: `calc(100% + ${tokens.spacing[2]})` }
          : { right: `calc(100% + ${tokens.spacing[2]})` }),
      }
    : {
        // Centre horizontally — left:50% positions the box's left edge, the
        // -50% transform shifts it back by half its own width. shiftX (px,
        // measured) is the viewport-edge correction folded into the same
        // framer-owned `x` transform, so an edge-anchored trigger can't push
        // the box off-screen and force horizontal page scroll.
        left: '50%',
        x: `calc(-50% + ${shiftX}px)`,
        ...(position === 'bottom'
          ? { top: `calc(100% + ${tokens.spacing[2]})` }
          : { bottom: `calc(100% + ${tokens.spacing[2]})` }),
      };

  // 4px of travel on whichever axis the tooltip is NOT centred on.
  const enterFrom = reducedMotion
    ? {}
    : side
      ? { x: position === 'right' ? -4 : 4 }
      : { y: position === 'bottom' ? -4 : 4 };
  const enterTo = reducedMotion ? {} : side ? { x: 0 } : { y: 0 };
  const describedBy = [ariaDescribedBy, visible && label ? tooltipId : null].filter(Boolean).join(' ') || undefined;
  const trigger = isValidElement(children)
    ? cloneElement(children, {
        'aria-describedby': [children.props['aria-describedby'], describedBy].filter(Boolean).join(' ') || undefined,
      })
    : children;

  // Edge-clamp: work out where a centred label WOULD sit, and if that lands
  // past a viewport inset, fold the correction into framer's `x` (framer owns
  // the transform; we never mutate node.style.transform out from under it).
  //
  // Nothing here measures the float's own on-screen position, and that is the
  // whole design. Framer writes `x` on an animation frame, while React flushes
  // a setState made FROM a layout effect synchronously — re-rendering and
  // re-running this effect without ever yielding to the browser. So during such
  // a loop no frame fires, framer never paints the shift, and every pass
  // re-measures the same untransformed box. A formula that reads its own output
  // back through that rect therefore never converges; it adds the same
  // correction again and again until React kills it at its update-depth limit.
  // That is where "Maximum update depth exceeded" came from on hover of an icon
  // rail: a wide label centred on a narrow row at the window edge needs a clamp
  // every time, so it looped every time.
  //
  // Instead: the host's rect (never transformed) gives the centre, offsetWidth
  // (a layout box, immune to transforms) gives the width, and those two are all
  // a centred box's edges are. The result depends only on the layout, so it is
  // the same on every pass — no feedback, and `shiftX` stays out of the deps.
  useIsomorphicLayoutEffect(() => {
    // Side placements are not horizontally centred, so there is nothing for
    // this correction to correct — they hang off the trigger's own edge.
    if (side || !visible || !label) {
      setShiftX(0);
      return undefined;
    }
    const measure = () => {
      const node = floatRef.current;
      // The float is rendered directly inside the relative wrapper, so its
      // parent IS the element `left: 50%` is resolved against.
      const host = node?.parentElement;
      if (!node || !host) return;

      const hostRect = host.getBoundingClientRect();
      const centre = hostRect.left + hostRect.width / 2;
      const half = node.offsetWidth / 2;
      const limit = window.innerWidth - EDGE_INSET;

      let next = 0;
      if (centre - half < EDGE_INSET) next = EDGE_INSET - (centre - half);
      else if (centre + half > limit) next = limit - (centre + half);

      // React bails out of the re-render when the rounded value is unchanged,
      // which is what ends the pass.
      setShiftX(Math.round(next));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [visible, label, position]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      {...props}
      // The bubble is out of flow and its side is an inline offset no ancestor
      // rule can read — and it exists only while hovered or focused, so nothing
      // outside can key off the bubble itself at rest. The WRAPPER states the
      // direction instead, always, the same way UserMenuPanel states its own;
      // a page can then reserve room on the side this opens toward before
      // anything mounts. Its own attribute name, because a tooltip and a menu
      // ask for very different amounts of room. Paints nothing.
      data-tooltip-placement={position}
      aria-describedby={describedBy}
      onMouseEnter={(event) => { setVisible(true); onMouseEnter?.(event); }}
      onMouseLeave={(event) => { setVisible(false); onMouseLeave?.(event); }}
      onFocus={(event) => { setVisible(true); onFocus?.(event); }}
      onBlur={(event) => { setVisible(false); onBlur?.(event); }}
    >
      {trigger}

      <AnimatePresence>
        {visible && label ? (
          <motion.div
            ref={floatRef}
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, ...enterFrom }}
            animate={{ opacity: 1, ...enterTo, transition: ENTER_TX }}
            exit={{ opacity: 0, ...enterFrom, transition: EXIT_TX }}
            style={{
              position: 'absolute',
              ...floatStyle,
              pointerEvents: 'none',
              // Clamp to the viewport so a long centred label can't overflow a
              // screen edge and force horizontal page scroll on a phone. A
              // label that outgrows the clamp wraps (overflowWrap) rather than
              // pushing the document wider; short labels still sit on one line.
              maxWidth: `calc(100vw - ${tokens.spacing[4]})`,
              boxSizing: 'border-box',
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              textAlign: 'center',
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
});
