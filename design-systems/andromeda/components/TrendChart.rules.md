# TrendChart — component rules

The canonical multi-series time-series chart: one component that renders as line, area, or bar with a built-in mode toggle, custom tooltip, and toggleable legend. Built on recharts.

## When to use

- `should` — Any time-over-x comparison of 1–4 series (allocation vs usage, telemetry, altitude). It replaces the per-example bespoke charts — reach for TrendChart before hand-rolling another AreaChart/BarChart.
- `should` — For a single radial/multi-axis comparison use `RadarChart`; for a 1-D level use `ProgressBar` / `HeatGrid`. TrendChart is specifically time-series / categorical-x.

## Colour — follow the hierarchy, don't reach for a palette

- `must` — Series colour comes from `role`, mapping to the rules.md "Charts · Multi-series" hierarchy: `baseline` → `text.primary` (white, the planned/expected line), `live` → `accent.300` (the measured/actual signal — the ONE accent series), `context` → `text.faint` (peripheral), `threshold` → `red.300` rendered dashed (a limit you don't want to cross).
- `must` — Exactly one `live` (accent) series per chart. Accent is the live measurement; if two series are accent the eye can't tell which is the signal.
- `must` — No glow on any chart element (line, area fill, bar, dot). The accent gradient fill tops out at 0.12 opacity.
- `should` — Don't pass explicit `color` to escape the hierarchy. If a chart "needs" a 5th colour it's doing too much — split it (rules.md caps charts at 4 series). `color` exists for genuine one-offs, not to recolour the standard roles (e.g. orange/red for plain series reads as warning/fault, which those series are not).

## Composition

- `must` — TrendChart renders the chart content only (header + plot + legend), NOT the panel frame. Wrap it in a `Card` or a `surface.raised` + `<CornerMarkers />` panel, the same way `RadarChart` is composed. Don't double-frame.
- `may` — `footerSlot` takes custom controls (e.g. a "vs previous period" Toggle) on the right of the legend row.
- `may` — `modes` controls which views the toggle offers (`['area','bar']` default). A single-mode chart omits the toggle.

## Motion

- `must` — The draw is gated on `useInView`: a left-to-right clip reveal (the line materialising across time), token-timed (`duration.cascade`), once. recharts' own series animation is disabled so it doesn't compete. Honour `prefers-reduced-motion` (render fully drawn, no reveal).

## Accessibility

- `should` — Legend chips are real buttons with `aria-pressed` for show/hide. The recharts SVG is decorative-by-default; pass a meaningful `title`, and for a data-critical chart provide an adjacent text/table alternative (recharts SVGs are not screen-reader legible on their own).
