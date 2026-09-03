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
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { tokens } from '../tokens';
import { andromedaVars, themeColor } from './lib/utils';

// Layout effect on the client (measure + correct before paint, no flash),
// plain effect on the server (avoids the useLayoutEffect SSR warning).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Keep the clamped tooltip this far (token) clear of either viewport edge.
const EDGE_INSET = parseInt(tokens.spacing[2], 10); // 8px

const ms = (v: string) => parseInt(v, 10) / 1000;
const ENTER_TX: Transition = { duration: ms(tokens.motion.duration.normal), ease: [0, 0, 0.2, 1] }; // easing.out
const EXIT_TX: Transition  = { duration: ms(tokens.motion.duration.fast),   ease: [0.4, 0, 1, 1] }; // easing.in

/**
 * @typedef {object} TooltipProps
 * @property {React.ReactNode} label     Content shown in the tooltip.
 * @property {'top'|'bottom'} [position='top']
 * @property {React.ReactNode} children  The trigger element.
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

export type TooltipProps = ComponentPropsWithoutRef<'div'> & {
  label: ReactNode;
  position?: 'top' | 'bottom';
};

/** @type {React.ForwardRefExoticComponent<TooltipProps & React.HTMLAttributes<HTMLDivElement>>} */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { label, position = 'top', children, className, style, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  // Horizontal correction (px) applied on top of the -50% centre transform so a
  // centred-but-clamped label on a trigger near a screen edge stays inside the
  // viewport instead of overflowing it and forcing horizontal page scroll. 0 in
  // the common (mid-screen) case; measured only while visible.
  const [shiftX, setShiftX] = useState(0);
  const floatRef = useRef<HTMLDivElement | null>(null);

  const floatStyle =
    position === 'bottom'
      ? { top: `calc(100% + ${tokens.spacing[2]})` }
      : { bottom: `calc(100% + ${tokens.spacing[2]})` };

  // Edge-clamp: a tooltip centred on a trigger near a screen edge would
  // overflow it and force horizontal page scroll, so it is nudged back inside
  // by a viewport inset. The correction is folded into framer's `x` (framer
  // owns the transform, we never mutate node.style.transform out from under
  // it), which means it lands on framer's own render frame, not synchronously.
  //
  // So the correction must NEVER be measured off the floating box's own rect.
  // A layout effect that sets state re-renders before the browser yields a
  // frame, so the shift is still unpainted on the next pass: the box measures
  // exactly where it did before, the same correction is added again, and it
  // compounds until React kills the tree at its update-depth limit. That is a
  // hard crash, and it fires on every hover of a trigger that needs a clamp.
  //
  // The host wrapper's rect is never transformed, and offsetWidth is a layout
  // box that transforms cannot touch. Centre plus half-width is all a centred
  // box's edges are, so the result reads only layout, comes out identical on
  // every pass, and keeps `shiftX` out of the deps. resize re-measures too.
  useIsomorphicLayoutEffect(() => {
    if (!visible || !label) {
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
      style={{ ...andromedaVars(), position: 'relative', display: 'inline-flex', ...style }}
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
              background: themeColor.surface.overlay,
              border: `${tokens.border.thin} ${themeColor.border.base}`,
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: themeColor.text.secondary,
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
