# Diamond Grid

## Brief
Component: Diamond Grid
Slug: diamond-grid
Description: A faint canvas grid of diamonds. Seeded sparks send light outward until fronts meet.

## Visual
- Full-bleed canvas; a square grid rotated 45° around the viewport center (affine transform built from `Math.SQRT1_2`) so the lattice reads as diamonds
- Cell size `clamp(min(W, H) * 0.113, 65, 124)`px; grid origin and column/row coverage reseeded from `seed` on every rebuild so the rotated field always overflows the viewport
- Resting grid: 1px hairlines at opacity `line * 0.2`, plus a small 4-point star (radius 3.3, inner 0.68) at every intersection at opacity `line * 0.55`
- Dark: #000000 ground, white ink, `lighter` composite (overlapping rays add up). Light: #FAF8F5 ground, near-black ink, `source-over` composite — dualTheme
- A broad top-left-to-bottom-right linear alpha mask (12-stop gradient) keeps a diagonal band through the center fully visible and fades the other two corners to nothing
- Non-interactive: no pointer response, no visible text or controls; root is `role="img"` with a descriptive `aria-label`, the canvas itself is `aria-hidden`

## Behaviour
- 34 seeded ignition events per loop; every position and timing value comes from one `mulberry32(seed)` generator, so a given seed always plays the same 64s sequence
- Event start times: gaps of 1200-2600ms (every third event) or 3600-6800ms otherwise, summed and rescaled so cumulative starts span exactly one 64000ms loop
- Each event picks a grid intersection inside the visible diagonal band (positions below the mask threshold are rejected); roughly every third event lands near the previous one along a shared row or column
- Per event: 25000-32000ms lifetime, decay starts 10500-15000ms in, travel 3200-4100ms and reach 2.5-3.75 cells (together set the ease-out span), plus a phase offset for a slow sine flicker
- Level envelope: smoothstep attack over 900ms, holds at full, then smoothstep decay from decayStart to the event's end
- Light travels outward from the ignition along all four grid axes, each ray independently clamped at the grid edge, as one continuous cubic ease-out over the event's whole life — never eased per grid cell, so a front never stalls at a crossing
- Each ray draws a wide soft glow, a thin hot core, and a small leading dot; the ignition point also draws a cached 4-point star sprite that fades in over its first ~1800ms
- The loop wraps seamlessly: elapsed time advances modulo 64000ms and an event's age wraps by +64000ms when negative, so events that straddle the loop boundary keep animating without a cut
- `prefers-reduced-motion`: animation stops and a single populated frame renders at a fixed point (27000ms into the loop)
- Runs only while the host intersects the viewport and the tab is visible (IntersectionObserver + visibilitychange); idle otherwise

## Tech notes
- Zero dependencies beyond React — one visible canvas plus four cached offscreen canvases (resting layer, live layer, diagonal mask, star sprite); the mask, star sprite and resting grid rebuild only on resize or theme change, never per frame
- `seed` prop (default 1337) is the component's only input; it drives grid placement, ignition node selection, and every per-event timing range
- Theme read wrapper-first: closest `[data-card-theme]` ancestor, falling back to `document.documentElement.classList.contains('dark')`; a MutationObserver watches both the wrapper and `<html>` (mistake #009 pattern)
- ResizeObserver on the host, 120ms debounce, skips rebuilds when width, height and DPR are unchanged; DPR capped at 2
- No `// npm install` line — the component imports nothing beyond `react`
