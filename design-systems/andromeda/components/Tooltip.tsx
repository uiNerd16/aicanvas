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

import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../tokens';

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
  // Horizontal correction (px) applied on top of the -50% centre transform so a
  // centred-but-clamped label on a trigger near a screen edge stays inside the
  // viewport instead of overflowing it and forcing horizontal page scroll. 0 in
  // the common (mid-screen) case; measured only while visible.
  const [shiftX, setShiftX] = useState(0);
  const floatRef = useRef(null);

  const floatStyle =
    position === 'bottom'
      ? { top: `calc(100% + ${tokens.spacing[2]})` }
      : { bottom: `calc(100% + ${tokens.spacing[2]})` };

  // Edge-clamp: once the centred tooltip is in the DOM, measure its rect and
  // nudge it back on-screen if either edge has crossed the viewport inset.
  // The correction is folded into framer's `x` (so framer owns the transform —
  // we never mutate node.style.transform out from under it) and computed
  // INCREMENTALLY from the rect as currently rendered: the new shift is the
  // current shift adjusted by however far the box still pokes past an edge.
  // `shiftX` is a dep, so after each correction the effect re-measures the
  // now-shifted box; once it's in-bounds `next === shiftX` and the loop stops
  // (one reflow in practice). resize re-measures too.
  useIsomorphicLayoutEffect(() => {
    if (!visible || !label) {
      if (shiftX !== 0) setShiftX(0);
      return undefined;
    }
    const measure = () => {
      const node = floatRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      let next = shiftX;
      if (rect.left < EDGE_INSET) {
        next = shiftX + (EDGE_INSET - rect.left); // push right
      } else if (rect.right > window.innerWidth - EDGE_INSET) {
        next = shiftX - (rect.right - (window.innerWidth - EDGE_INSET)); // push left
      }
      if (next !== shiftX) setShiftX(next);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [visible, label, position, shiftX]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      {...props}
    >
      {children}

      <AnimatePresence>
        {visible && label ? (
          <motion.div
            ref={floatRef}
            role="tooltip"
            initial={{ opacity: 0, y: position === 'bottom' ? -4 : 4 }}
            animate={{ opacity: 1, y: 0, transition: ENTER_TX }}
            exit={{ opacity: 0, y: position === 'bottom' ? -4 : 4, transition: EXIT_TX }}
            style={{
              position: 'absolute',
              ...floatStyle,
              // Centre horizontally — left:50% positions the box's left edge,
              // the -50% transform shifts it back by half its own width. shiftX
              // (px, measured) is the viewport-edge correction folded into the
              // same framer-owned `x` transform, so an edge-anchored trigger
              // can't push the box off-screen and force horizontal page scroll.
              left: '50%',
              x: `calc(-50% + ${shiftX}px)`,
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
