// ============================================================
// COMPONENT: CornerMarkers
// shadcn/ui-aligned API: forwardRef, className, ...props.
// Defining motif of Space — four L-shaped brackets that hug
// each corner of the nearest position:relative ancestor.
// Geometry comes from `tokens.marker.{size,offset,borderWidth}`.
// Color defaults to `tokens.color.border.bright` — every bracket
// in the system uses this same value so the motif stays consistent.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { cn } from './lib/utils';
import { tokens } from '../tokens';

/**
 * @typedef {object} CornerMarkersProps
 * @property {number} [size]        px square the bracket lives inside; defaults to tokens.marker.size
 * @property {number} [offset]      px inset from the corner; defaults to tokens.marker.offset
 * @property {number} [borderWidth] px stroke thickness; defaults to tokens.marker.borderWidth
 * @property {string} [color]       any CSS color; defaults to tokens.color.border.bright
 * @property {string} [className]
 */

/** @type {React.ForwardRefExoticComponent<CornerMarkersProps & React.HTMLAttributes<HTMLDivElement>>} */
export const CornerMarkers = forwardRef(function CornerMarkers(
  { size, offset, borderWidth, color, className, ...props },
  ref,
) {
  const s  = size        ?? tokens.marker.size;
  const o  = offset      ?? tokens.marker.offset;
  const bw = borderWidth ?? tokens.marker.borderWidth;
  const c  = color       ?? tokens.color.border.bright;

  // Each marker is an L-shape: only the two borders that meet at its corner.
  const positions = [
    { key: 'tl', top:    o, left:  o },
    { key: 'tr', top:    o, right: o },
    { key: 'bl', bottom: o, left:  o },
    { key: 'br', bottom: o, right: o },
  ];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="corner-markers"
      className={cn('contents', className)}
      {...props}
    >
      {positions.map(({ key, ...coords }) => (
        <span
          key={key}
          className="absolute pointer-events-none"
          style={{
            width:             `${s}px`,
            height:            `${s}px`,
            borderStyle:       'solid',
            borderColor:       c,
            borderTopWidth:    key.startsWith('t') ? bw : 0,
            borderBottomWidth: key.startsWith('b') ? bw : 0,
            borderLeftWidth:   key.endsWith('l')   ? bw : 0,
            borderRightWidth:  key.endsWith('r')   ? bw : 0,
            ...coords,
          }}
        />
      ))}
    </div>
  );
});
