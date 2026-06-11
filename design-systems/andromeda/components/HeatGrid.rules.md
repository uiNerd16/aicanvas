# HeatGrid — component rules

A 2-D matrix fill gauge. Cells fill from the bottom-centre outward in a widening pyramid as `value` (0–100) rises; intensity ramps dim→bright toward the wave front. It is the 2-D cousin of `ProgressBar`.

## When to use

- `should` — Reach for HeatGrid when a single level (risk, capacity, saturation) wants more visual weight than a `ProgressBar` bar and reads naturally as a "filling matrix". One value, one gauge.
- `should` — Use `ProgressBar` instead for inline/list contexts, tight rows, or when several levels sit together (bars stack and compare; matrices don't). HeatGrid is a feature gauge, not a list primitive.
- `must` — One `value` per HeatGrid. It is a gauge, not a heatmap of independent cells — the cells are a single measurement rendered as a shape, never per-cell data.

## Colour & intensity

- `must` — Accent is allowed here because the fill IS a measurement (the same `rules.md` "colour is for meaning" exception that covers ProgressBar and charts). Empty cells are `surface.overlay` with a `border.subtle` edge; filled cells use the accent ramp `accent-500` (dim base) → `accent-400` (mid) → `accent-300` (bright frontier), each with the next-lighter stop as its border.
- `must` — No glow on cells. The accent ramp carries the depth; a glow would be decoration. (Matches the ProgressBar "no glow on segments" rule.)
- `should` — The optional percentage readout is `accent-300` (it is the measurement spelled out), mono, `size.3xl`, `weight.medium`, tabular-nums.

## Motion

- `must` — The fill animation is gated on `useInView` (plays when scrolled into view, once), token-timed (`duration.cascade`), and cascades base-first / centre-out via `stagger.progressbar`. Never a mount-only animation — that's a regression against the scroll-aware-primitives rule.
- `must` — Honour `prefers-reduced-motion`: render fully filled immediately, no transition, no stagger.

## Geometry

- `may` — `cols`/`rows`/`cellSize`/`gap` are configurable; defaults (7×5, 22px, 3px) match the canonical service-order gauge. `cellSize`/`gap` are component-geometry px constants (like ProgressBar's segment dimensions), not design tokens — keep them small and square so the matrix reads as a grid, not blocks.

## Accessibility

- `must` — The root is `role="meter"` with `aria-valuemin=0 / aria-valuemax=100 / aria-valuenow={value}` and an `aria-label` (defaults to "Fill level"; pass a meaningful `label`). The grid cells and the readout are `aria-hidden` — the meter role carries the value to assistive tech.

## Composition

- `may` — In an example/template you can set `showValue={false}` and render your own animated readout beside it (the service-order SlaPanel does this with a count-up). The built-in readout is for standalone / showcase use.
