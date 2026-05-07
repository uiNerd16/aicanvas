# Andromeda — Brain

The third pillar of the Andromeda design system, alongside `tokens.ts` (values) and `components/` (code). Read this file before touching any Andromeda component, example, or template. If a rule here conflicts with code, fix the code — this file is the source of truth for design intent.

Updates land here the moment a new rule is discovered. Never let the same correction happen twice.

---

## Identity

Andromeda is a sci-fi / blueprint design system for engineering dashboards, mission-critical UIs, and tools that look at live data. Near-monochrome, hairline borders, transparent surfaces. Color is reserved for measurement and primary action — never decoration. JetBrains Mono throughout, uppercase tracking for UI labels, sentence case for buttons.

Built for designers, developers, and teams who want a system, not a stylesheet — so people (and AI agents) extending it produce output that fits, on the first try.

Three pillars in this folder:

- **`tokens.ts`** — values (colors, spacing, radius, typography, motion)
- **`components/`** — structure (how each piece is composed in code)
- **`rules.md`** (this file) + per-component **`<Component>.rules.md`** — judgment (when to use what, why, recipes, anti-patterns)

Tokens give the values. Components give the patterns. The brain tells you which combinations are right.

---

## How to read this

Rules are tagged by severity. When constraints conflict, higher severity wins.

- `must` — non-negotiable. Code violating a `must` rule is wrong and must be fixed.
- `should` — strong preference with rare exceptions. Deviation needs explicit reason.
- `may` — sensible default; alternatives acceptable when context warrants.

Untagged rules default to `should`. When two `must` rules conflict, ask the user — don't pick.

This file is the **system-wide brain** — rules that apply across components. Component-specific rules live alongside the source as `<Component>.rules.md` files (e.g. `components/Button.rules.md`). When extending a component, read both.

---

## Color philosophy

Andromeda is a near-monochrome system. Color is reserved for meaning, never decoration.

### When color IS used

- Live measurements: clocks, telemetry values, deltas, volume readings
- Active state markers: nav-item indicator dot, badge dot, breadcrumb
- Status of importance where the meaning IS the color: `Live`, `Online`, `Fault`, `Warning`
- Threshold crossings on charts (red for negative move, accent for positive)

### When color is NEVER used (`must`)

- Page titles, section titles, card titles
- Button text — text is always `text.primary`, the meaning lives in the background
- Badge text — same rule, the colored bg + variant dot carry the meaning
- Body copy and descriptions
- Chart line strokes — use `text.primary` at full opacity
- Chart area fills — use `text.primary` at 0.12 → 0 opacity
- Decorative scanlines, glows, or sweeps that don't communicate state

### Hierarchy of greys

`text.primary` (#F2F2F2) → `text.secondary` (#A8A8A8) → `text.muted` (#7A7A7A) → `text.faint` (#5A5A5A)

Use the lightest weight that still reads at the intended distance. Default body copy is `text.secondary`. Tight UI labels are `text.muted`. Decorative or peripheral text is `text.faint`.

### The accent stops

| Stop | Hex | Used for |
|---|---|---|
| `accent-100` | brightest pastel | reserved — currently unused |
| `accent-200` | bright | button borders, MA(5) line |
| `accent-300` | mid | active nav text, timer, delta arrow, indicator dot |
| `accent-400` | base | button bg, badge bg variant, last-price flag |
| `accent-500` | deep | accent badge bg, focus ring, gradient peak |

When unsure, prefer `accent-300` — it's the system's signal color.

---

## Composition recipes

These are the canonical compositions Andromeda was built to produce. When the user asks to "build a dashboard section" or "show a row of stats", match the request to a recipe rather than inventing one. Each recipe references components and tokens by name; the source-of-truth implementations live in the four templates (`examples/<template>/`).

### Recipe 1 — Stat Card Row

Use for: KPI grids, mission summary, telemetry overview.

- Wrap in `<Card>` with `<PanelHeader>` (uppercase title, optional right-side controls)
- Inside: row of 3-5 `<StatTile>` components, equal flex share
- Tiles share borders edge-to-edge with `marginLeft: -1` so the seam is a single 1px line
- Each tile: code label (top-right, `text.faint`), big numeric value (count-up animation), delta arrow + percentage
- Gap between Card content and StatTile row: `tokens.spacing[3]` inset

Reference: `examples/mission-control/sections/OverviewSection.tsx`

### Recipe 2 — Chart Panel

Use for: telemetry plots, threshold charts, time-series displays.

- `<Card>` with `<PanelHeader>` (title + optional `<SegmentedControl>` for chart type / period right-side)
- Body: SVG plot area + Y-axis label gutter (right, 72px wide) + X-axis row (24px tall)
- Single series ink: `text.primary`. Multi-series: see Charts section for series-color hierarchy.
- Cursor: `border.bright` dashed. Tooltip values: `text.primary`. Grid lines: `border.subtle` dashed `2 4`.
- No glow, no decorative gradient on the plot.

Reference: `examples/mission-control/AltitudeChart.tsx` (single), `examples/exchange-terminal/` (multi-series)

### Recipe 3 — Detail Panel (nested)

Use for: any nested content region with a label and body inside an outer panel.

- `<Card>` with `<CardHeader>` + `<CardContent>` + optional `<CardFooter>`
- Distinguish from a `PanelHeader` panel: CardHeader is the QUIETER hierarchy (a labeled subdivision); PanelHeader is LOUDER (a section of the page). Don't mix.
- Corner markers as the frame; no perimeter stroke.
- Section dividers between header/body/footer use the 12px inset rule.

Reference: `examples/mission-control/SystemStatus.tsx`

### Recipe 4 — Bento Dashboard Layout

Use for: multi-panel screens where seams must align across columns.

- CSS Grid (NOT nested flex): `gridTemplateColumns`, `gridTemplateRows`, `gap: tokens.spacing[3]`
- `gridTemplateRows: 'minmax(220px, auto) 1fr'` — sensible minimum, flexible growth
- Each panel: `display: flex; flex-direction: column; justify-content: space-between` so headline pins top, viz pins bottom
- See "Bento grid alignment" rule in Layout section for full pattern + anti-pattern

Reference: `examples/mission-control/index.tsx`

### Recipe 5 — Form Row

Use for: input + action layouts (search bars, range filters, command bars).

- Single horizontal row, all elements share size token (`md` default → 32px)
- Elements: `<Input>` + optionally `<DateRangePicker>` + primary `<Button variant="default">` + secondary `<Button variant="outline">`
- Lock button height to `tokens.spacing[8]` if it grows from icon content (icons render taller than text)
- One primary action per row. Secondary buttons stay outline.
- Gap between elements: `tokens.spacing[3]`

Reference: `examples/exchange-terminal/` filter row

---

## Buttons

| Variant | Background | Border | Text |
|---|---|---|---|
| `default` | `accent-400` | `accent-200` | `text.primary` |
| `outline` | `surface.raised` | `border.base` | `text.primary` |
| `ghost` | transparent | transparent | `text.secondary` |
| `destructive` | `red-500` | `red-400` | `text.primary` |
| `link` | transparent | transparent | `text.primary` |

- Default size in examples: `md`. Use `sm` only for dense legend rows or overflow chips.
- Hover lifts the border one stop and adds an 8px short-radius glow tinted in the bg color.
- `must` — No glow on `outline`, `ghost`, or `link` variants.

---

## Badges

- `must` — Text is always `text.primary` on every variant. Background carries the meaning.
- The blinking 4×4 dot at the start of the badge takes the variant color, not the text.

| Variant | Background | Dot color |
|---|---|---|
| `default` | `surface.active` | `text.muted` |
| `accent` | `accent-500` | `accent-300` |
| `warning` | `orange-500` | `orange-300` |
| `fault` | `red-500` | `red-300` |
| `subtle` | `surface.overlay` | `text.faint` |
| `outline` | transparent + `border.bright` | `text.primary` |

Default bg `surface.active` (#232325) is intentionally lighter than `surface.raised` so the badge separates from the card it sits on.

---

## Charts

### Single-series

- Line stroke: `text.primary` (white)
- Area fill: linear gradient from `text.primary` at 0.12 opacity → 0 opacity
- Active dot on hover: `text.primary` fill, `border.base` stroke, r=4
- The variant prop only changes the BADGE in the chart header — the chart ink stays neutral

### Multi-series

When a chart shows 2+ comparable series, color CAN carry series identity. Apply this hierarchy:

- Baseline / planned series (the "what was expected"): `text.primary`
- Live / measured / actual series (the "what is happening"): `accent.300`
- Peripheral / context series (the "what's also there but not the focus"): `text.faint`
- Threshold / warning series (the "limit you don't want to cross"): `red-300` dashed

The active dot for each series matches its line color so the user can identify which series they're hovering. Tooltip values stay `text.primary` regardless — the row label carries the series identity in the tooltip.

`should` — If a chart needs more than 4 series, the chart is doing too much — split into stacked charts or use small multiples. Don't reach for a 5-color palette.

### Both

- Cursor (hover crosshair): `border.bright` dashed
- Tooltip value: `text.primary`
- Grid lines: `border.subtle`, dashed `2 4`, horizontal only by default
- Axis text: `text.muted`
- `must` — No glow on any chart element

Chart ink is neutral by default because the chart itself is the data. Color enters only when it carries semantic meaning that the eye must distinguish at a glance.

---

## Progress bars

- 30 segments, each a 6×16 rectangle, all skewed `skewX(-12deg)` into parallelograms
- `must` — No glow on filled or empty segments
- Filled: variant color (`accent-400` / `orange-400` / `red-400`) bg + matching border
- Empty: `surface.overlay` bg, `border.subtle` border
- Fill animation: stagger in groups of 3, 120ms cascade, 400ms transition
- Label / value row above the bar uses mono uppercase, `text.secondary` label + `text.primary` value

---

## Stat tiles

- `must` — No scanline, no sweep, no shimmer on mount — count-up animation only
- Delta arrow: `accent-300` on positive, `red-300` on negative, `text.muted` on neutral
- Code label (e.g. `TLM-01`) sits in the top-right corner in `text.faint`
- Tiles share borders edge-to-edge with `marginLeft: -1` so the seam is a single 1px line

---

## Nav items

- Active: text `accent-300`, 4×4 right-edge indicator dot in `accent-300` with `accent-500` glow
- Inactive: `text.secondary`, hover → `text.primary` + `surface.hover` bg
- Mono labels by default; pass `mono={false}` for sans labels in non-system contexts
- `must` — No background fill on the active state — the indicator dot is the signal

---

## Cards

- Default: `surface.raised` bg, no perimeter stroke, corner markers as the frame
- Glow: `gradient.accentSweep` bg, `accent-500` border, corner markers
- The accentSweep gradient is a barely-visible teal whisper — if it reads as a colored card it's too strong
- CardHeader, CardContent, CardFooter use consistent padding from `tokens.spacing` — never override

## PanelHeader vs CardHeader

Two header components, deliberately different:

| | PanelHeader | CardHeader |
|---|---|---|
| Title style | sentence-case mono, `size.xl`, `weight.semibold`, `tracking.tight` | uppercase mono, `size.sm`, `weight.medium`, `tracking.wider` |
| Padding | `spacing[4] spacing[5]` | `spacing[3]` all sides |
| Use | top of a top-level dashboard panel | top of a nested Card composition |

`must` — Don't mix them. A panel that sits as a top-level dashboard cell takes a PanelHeader; a Card embedded inside a layout takes a CardHeader. The two visual weights signal the hierarchy: a panel header is a louder "this is a section of the page", a card header is a quieter "this is a labeled subdivision".

## Section dividers — always inset by spacing[3]

`must` — Every horizontal divider that separates two regions inside a panel — between a PanelHeader and the body, between a tab strip and a filter row, between a body and a footer — is inset by **`spacing[3]` (12px)** from each side. The divider never touches the panel edges; it stops short so the corner-marker frame reads as the panel's container, and the inset reads as a lighter, more deliberate split.

The pattern (sibling absolutely-positioned span on a `position: relative` parent):

```jsx
<div style={{ position: 'relative', /* …content padding… */ }}>
  {content}
  <span aria-hidden style={{
    position: 'absolute',
    left: tokens.spacing[3],
    right: tokens.spacing[3],
    bottom: 0,            // or top: 0 for an upper divider
    height: '1px',
    background: tokens.color.border.subtle,
    pointerEvents: 'none',
  }} />
</div>
```

`PanelHeader`, `CardHeader`, `CardFooter`, `RadarChart`, and the `Table` primitive already render this for you. Inline strips inside example blocks must wear the same inset — extract a tiny `InsetDivider` helper at the top of the file rather than reaching for `borderBottom: 1px solid border.subtle`.

**Tables are no exception.** Column header underlines and row separators are also inset by 12px. Because TR borders don't render under `border-collapse: collapse`, the Table primitive draws the line via a `linear-gradient` background-image with transparent stops at each end — the visible result is identical to other inset dividers, just delivered through a different mechanism.

---

## Layout

### Size consistency in a row

`must` — When two or more sized components sit on the same horizontal row (button + avatar, button + chip, button + icon-button, input + button, etc.), they MUST share the same size token: all `sm`, all `md`, or all `lg`. Mixing sizes in a row breaks the eye's baseline and makes the row look misaligned even if individual components are correct.

The size tokens map to these heights:
- `sm` → 24px (avatar sm, icon-button sm baseline)
- `md` → 32px (avatar md, icon-button md, default button row)
- `lg` → 40px (avatar lg, primary actions, hero rows)

A button with an icon may visually grow taller than its text-only counterpart because the icon (18px at md) is taller than the text content. When this happens and the row contains another component that doesn't grow, lock the button height with `style={{ height: tokens.spacing[N] }}` matching the row's size token (e.g. `tokens.spacing[8]` = 32px for md). Don't bump the avatar to compensate — the row's size dictates the components, not the other way around.

### Visualisation slot consistency

When a panel has a row of cells where each cell ends in a small visualisation (sparkline, bar grid, threshold bar, micro-chart, etc.), every visualisation must render into the same fixed-height slot, anchored to the same baseline. Otherwise the cells look unevenly weighted — one cell's chart pins lower or floats higher than its neighbours, breaking the grid rhythm.

The pattern:

```jsx
const VIZ_HEIGHT = 40; // shared by every viz in this panel

<BarGrid />         // height: 40px, alignItems: flex-end
<ThresholdBar />    // height: 40px, justify-content: space-between
<Sparkline />       // height: 40px
```

Inside the cell, use `justify-content: space-between` so the headline value pins to the top and the visualisation pins to the bottom of the cell. The cell itself stretches to the row height (set via `flex: 1` on the cells row inside the panel), so the visual baseline is always the same y-coordinate across cells.

If one viz is naturally smaller (e.g. a 12px gradient bar), pad it inside the slot rather than shrinking the slot — every cell's bottom edge must hit the same line.

### Bento grid alignment

When two or more panels sit in a multi-column, multi-row grid (a "bento layout"), every seam between panels must line up across columns. The user's eye reads the corner markers as a continuous frame — if a left panel ends at y=240 and the right panel ends at y=260, the divide looks broken even if individual panels are perfect.

The reliable pattern is CSS Grid, not nested flex:

```jsx
<main style={{
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gridTemplateRows: 'minmax(220px, auto) 1fr',
  gap: tokens.spacing[3],
}}>
  <TopLeft />
  <TopRight />
  <BottomLeft />
  <BottomRight />
</main>
```

Why grid wins:
- `gridTemplateRows` sizes both top panels to the same height, both bottom panels to the same height — the seam is computed from the row, not the cells
- `minmax(Npx, auto)` gives a sensible minimum while letting the row grow if content exceeds it
- Items stretch to fill their cell by default — no extra wiring needed

Inside each panel, give the content row `flex: 1` and the cell `display: flex; flex-direction: column; justify-content: space-between` so the headline value pins to the top and the visualization pins to the bottom. When the grid stretches the panel to its row height, the content distributes evenly instead of leaving a gap underneath.

`must` — Anti-pattern: parallel flex columns. `<flex-col><A/><B/></flex-col><flex-col><C/><D/></flex-col>` does NOT guarantee A and C share a height — they're sized independently per column. Use grid.

### Content insets in panels

Every panel that carries corner markers needs at least `8px` of clearance between content and the panel edge. The markers are `12×12px` — content placed at offset 0 will visually collide with the L-shape.

Define `PANEL_INSET = 8` (or use `tokens.spacing[2]`) at the top of any composition file and use it for left/right offsets on inline content (legends, axis labels, overlay chips).

### Chart axes

- Y-axis labels: render outside the SVG plot area, in an absolute-positioned label gutter on the right. Standard width: 72px.
- X-axis labels: NEVER use index 0 or N-1 with `translateX(-50%)`. The first/last label will clip on the parent `overflow: hidden`. Two acceptable patterns:
  - Anchor first label with `left: 0`, last with `right: 0`, no translate
  - Inset the indices to `[2, N/2, N-3]` so even centered labels have breathing room
- `must` — Use `vectorEffect="non-scaling-stroke"` on every SVG line drawn under `preserveAspectRatio="none"` — without it strokes distort with the viewBox.

### Stacked panel sections

When a panel has stacked regions (header / content / axis), use flex with explicit basis values:

```jsx
<div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
  <Header />                                          {/* fixed */}
  <div style={{ flex: '1 1 0', minHeight: 0 }}>...    {/* flexible */}
  <div style={{ flex: '0 0 24px' }}>...               {/* fixed */}
</div>
```

`overflow: hidden` belongs on the flex container, not on arbitrary children — clipping should happen at section boundaries.

### Tables — checkbox/text alignment

When a table has a leading checkbox column, the checkbox top edge and the first text line of the same row must sit on the same Y. Two-line cells (e.g. team name over an ID sub-line) must not push the checkbox to the row's vertical centre, where it ends up between the lines.

The recipe:

- `verticalAlign: 'top'` on every header `<th>` AND every body `<td>` in the table — including the checkbox cell, the text columns, and the right-aligned numeric column. Mixing `middle` (header) with `top` (rows) causes a visible 4–8px offset between the header checkbox and the first row checkbox.
- `padding-top: spacing[3]` matched on every cell, so each cell's content top sits at the same offset from its row top.
- `lineHeight: 1` on the first text line of each cell, plus an explicit `height: '16px'` matching the checkbox box. This pins the text top to the checkbox top regardless of font metrics.
- For stacked content (primary line + sub-line), the sub-line goes under with its own `lineHeight: 1`. Use a `gap` of 4px so the descender clearance reads as deliberate.

Result: every row reads as a single horizontal grid line aligned with the header.

### Absolute-positioned overlays

When a legend, label, or chip sits over a chart area, give the chart explicit `top` clearance equal to (legend height + `spacing[2]`). The legend and the bars must never share pixels.

For a volume strip below a candle chart with a `VOL` legend on top:
```
volume area = LEGEND_H (28px) + bars (flex) + X_AXIS_H (24px)
```

---

## Interaction states

Every interactive element (button, menu item, nav, segment, dropdown trigger) should cover four distinct states. Missing one creates a "dead" feeling — the user clicks and nothing acknowledges them, or hovers and the affordance isn't visible.

| State          | Trigger                          | Visual                                                        |
|----------------|----------------------------------|---------------------------------------------------------------|
| **default**    | none                             | base color/background                                         |
| **hover**      | cursor over (pointer devices)    | one step lighter bg (`surface.hover`), text → `text.primary`  |
| **pressed**    | mouse-down / `:active`           | one step darker still (`surface.active`)                      |
| **selected**   | persistent state (radio/toggle)  | matches pressed bg + medium font weight                       |
| **focus**      | keyboard navigation              | inner 1px `accent.400` ring — never the default browser ring  |

**Stateful triggers** (a button that opens a menu, drawer, or popover) need a fifth state: a "sticky pressed" look while the popover is open. Pattern:

```jsx
<IconButton
  data-state={open ? 'open' : 'closed'}
  style={open ? { background: tokens.color.surface.active, color: tokens.color.text.primary } : undefined}
/>
```

Without this, the user clicks the button, the menu opens beside it, but the button itself looks idle — the visual conversation is broken.

For dropdown / context-menu items, both `:hover` and `:active` should be defined explicitly. `:hover` is the daily affordance; `:active` is the click acknowledgement (it flashes for ~80ms during the click). The brief flash matters even if the menu closes immediately afterwards — without it, fast clicks feel unresponsive.

### Date-range pickers — anchor-then-confirm

A range picker has two clicks per selection. The first sets an **anchor** that stays fixed; hovering any other day previews the in-between band; the second click commits the range. There is no "Apply" button — the second click IS the apply.

Rules that fall out of this pattern:

- The anchor never moves while the user explores. Hovering left of the anchor doesn't flip the anchor; the picker just renders the preview as `{ start: hover, end: anchor }` so the band is always drawn left-to-right correctly.
- The committed `value` only changes on the second click. Mid-selection state (`anchor`, `hover`) is internal — never call `onChange` while the user is still picking, or downstream consumers will see a half-formed range.
- The panel does NOT close on commit. The user often wants to verify the range in the same view, or pick a different one without re-opening — closing on click feels like the picker is fighting the user. The next click on any day starts a fresh selection (anchor reset). The panel dismisses only on click-outside or ESC.
- ESC and click-outside cancel any in-progress selection (no `onChange` fires) AND close the panel. The previously committed range is preserved on cancel.
- On open, jump the visible month to the current `value.start` so the user sees their existing selection in context.

### Calendars — accent is a measurement, not decoration

Selected dates fill with `accent-500` + `accent-100` text — the **fill** is the value the user picked. In-between days do NOT fill; they wear a 1px `accent-400` border on transparent — the **outline** is the band defined by the two endpoints. The visual contrast between filled endpoints and outlined middle keeps the eye anchored on the chosen dates rather than drowning the whole range in colour. Today's marker is a 1px `border.bright` outline with no fill — today is a *reference*, not a *measurement*, so it stays neutral.

| Cell role | Background | Text | Border |
|---|---|---|---|
| Selected start/end | `accent-500` | `accent-100` | transparent |
| In-range | transparent | `text.secondary` | `accent-400` |
| Today (unselected) | transparent | `text.secondary` | `border.bright` |
| Default (in month) | transparent | `text.secondary` | transparent |
| Out of month | transparent | `text.faint` | transparent |

Selected text takes `accent-100` because the value IS the colour at that single cell — that's one of the few places accent on text is allowed. In-range cells stay `text.secondary`: the border carries the band meaning, the text shouldn't double up. Do not extend filled-cell text colouring to non-measurement controls.

### Inline-styles vs cva for components with derived state

Most Andromeda primitives use cva + Tailwind arbitrary classes (`Button`, `IconButton`, `Avatar`). That works for components with a finite `variant × size` matrix. For components whose visual state is *derived* from props at render time (a calendar cell that's simultaneously "in this month", "selected", "in range", "today", and possibly "hovered" — eight or more independent flags), inline styles + direct `tokens.ts` references are the right tool. Forcing every combination through cva variants explodes the variant table and makes the component harder to read than the inline-style version.

The rule: **finite × discrete = cva. Derived × continuous = inline styles.**

Both flavours are 100% token-driven, which is what matters. Don't use one tool to score consistency points against the other.

### Popovers (date-pickers, menus, comboboxes)

Floating panels triggered from a chip or button:

- The trigger sits in a `position: relative` wrapper; the panel is `position: absolute` below at `top: calc(100% + spacing[2])`. No portals — the popover stays inside the trigger's stacking context so dismiss-on-outside-click works with a single ref.
- Backgrounds are solid: `surface.raised` for the panel, never alpha. The drop shadow (`0 8px 32px surface.base`) is the only depth cue.
- The panel always carries `<CornerMarkers />`. Popovers are not a separate visual language — they're part of the system, so they wear the system's frame.
- The trigger gets `data-state="open"` while the panel is mounted, with a one-step-darker background (`surface.hover`) so the row reads as "pressed and held" — matches the "Stateful triggers" rule above.
- ESC and document `mousedown` outside the wrapper close the panel. Listeners are attached only while open and removed on close — never as session-wide globals.
- The CaretDown indicator rotates 180° on open. 140ms ease. The rotation is the only animation needed to communicate the state change; no fade-in for the panel itself unless the system later adds one consistently across all popovers.

### Hover on inline-styled controls

Many Andromeda controls are built with `style={{ background: 'transparent', color: tokens.color.text.X }}` on the element itself, plus a sibling `<style>` block with class-based `:hover` / `:active` rules. Inline styles beat any non-`!important` class rule, so the visual states silently never fire — the user clicks but the element looks idle.

The fix is mechanical, not architectural: every hover/active/selected/focus declaration in those `<style>` blocks must carry `!important`. Examples already corrected:

- `PanelMenu` — hover, active, and `[data-selected]` rules
- `DateRangePicker` — `.adp-day` hover (default / inrange / selected) and `.adp-nav` hover

The "feels working" tell: the *icon* colour seems to change on hover but the *background* doesn't lift. That's because Phosphor SVGs inherit `currentColor` and the rule's `color: ... !important` is the one declaration the dev remembered to mark important.

If you build a new component that mixes inline styles + class hover, mark every reactive declaration `!important` from the start. Don't wait for the bug report.

### Invisible inputs over visual proxies (form controls)

When an interactive form control is built with an invisible native `<input>` overlaying a styled visual proxy (Checkbox, Radio, Toggle), the input MUST sit on top in z-order — otherwise the visual swallows the click and the control hovers but never toggles.

If both the input and the proxy are positioned (e.g. `absolute` + `relative`), CSS paints them in tree order: the proxy, declared second, paints on top. Pin the input above with an explicit `z-10` (or any value > the proxy's). Hover state will look like it works because hover styles live on the proxy — that's the tell that the wiring is in fact broken.

---

## Motion

Andromeda is 90% still. The few elements that move are signaling something — a measurement updating, a state changing, a user action acknowledged. Motion that doesn't carry meaning is decoration; decoration drains the system's authority.

### Motion philosophy

- `must` — Movement signals data movement or interaction acknowledgement. Never decorative.
- `must` — Decorative animations forbidden: shimmer, sweep, scanline, pulsing glow, idle bounce. The list isn't exhaustive — when unsure, ask "what does this animation tell the user?" If the answer is "it looks cool", remove it.
- `should` — When two animations would happen simultaneously on the same screen, prefer staggering them by a small offset. Simultaneous motion competes for attention.

### Tempo (token-driven)

`must` — Reach for `tokens.motion` rather than hardcoding ms / cubic-bezier. The system's tempo is part of its identity, and ad-hoc values silently drift.

The five durations and four easings are:

| Token | Value | Use |
|---|---|---|
| `tokens.motion.duration.fast` | 80ms | Click acknowledgement, focus ring, button press |
| `tokens.motion.duration.normal` | 140ms | Hover state, popover caret rotation, default |
| `tokens.motion.duration.slow` | 200ms | Stateful trigger reveals — drawer slide, menu open |
| `tokens.motion.duration.cascade` | 400ms | Each element's cascade entrance + ProgressBar segment fill |
| `tokens.motion.duration.countup` | 800ms | StatTile count-up |
| `tokens.motion.easing.standard` | accelerate-decelerate | Default for unspecified motion |
| `tokens.motion.easing.out` | ease-out | Entrances, hover-in, settle-into-final-state |
| `tokens.motion.easing.in` | ease-in | Exits, hover-out, leaving-the-field |
| `tokens.motion.easing.sharp` | ease-in-out | Symmetric state flips |
| `tokens.motion.stagger.cascade` | 60ms | Sibling-to-sibling delay in entrance cascades |
| `tokens.motion.stagger.progressBar` | 120ms | ProgressBar segment fill (tighter, segments are visually adjacent) |

Components reference these tokens directly (`tokens.motion.duration.fast`); templates and inline styles reach the same values via the CSS vars exposed by `andromedaVars()` (`var(--andromeda-duration-fast)`, `var(--andromeda-easing-out)`, etc.).

State changes (data update, badge variant flip) should be instant or `fast` (80ms) — never `normal` or longer. The user wants to see the new value, not the animation.

### Approved motion patterns

- **StatTile count-up** — number tweens to its value over ~800ms with ease-out. No shimmer, no scanline, no sweep on mount.
- **ProgressBar segment fill** — staggered cascade, 120ms apart, 400ms each, total ~600-800ms for a full bar.
- **IconButton press** — `active:scale(0.97)` for the click moment.
- **Caret rotation on Popover open** — 140ms ease, 0° → 180°.
- **Drawer / Sheet slide** — 200ms ease-out.

### Forbidden motion patterns

- `must` — No glow on ProgressBar segments (animated or static)
- `must` — No shimmer on Card / StatTile / PanelHeader
- `must` — No idle bounce, breathing, or pulse on any element that isn't communicating live state
- `should` — No transition on text color when the surrounding context didn't change (e.g. don't tween hover text color over 300ms — use ~80ms or no transition)

### Reduced motion

`should` — Honor `prefers-reduced-motion: reduce`. For approved motion patterns: collapse cascades to instant, keep state-feedback flashes (they're feedback, not decoration), drop entrance animations.

### Implementation — framer-motion is the runtime

`must` — Andromeda's motion runtime is framer-motion (already a project dependency, no install). Pure CSS transitions are still acceptable for trivial cases (a single transition on hover bg color), but anything involving cascade choreography, gesture-driven interaction, mount/unmount transitions, or spring physics goes through framer-motion.

The bridge between tokens and framer-motion lives in `components/lib/motion.ts`. Three primitives, all token-grounded:

- **`useCascadeProps(index)`** — returns `{ initial, animate, transition }` for an element entering via the staggered top-to-bottom cascade. Spread onto a `motion.X` element. Honours `prefers-reduced-motion` automatically. Crosses parent boundaries via the explicit `index` arg, so use this when the cascade spans Sidebar → Header → content rows in different DOM subtrees.
- **`cascadeContainer` + `cascadeItem` variants** — alternative for when the staggered children share one parent (a single panel revealing its rows). Use `staggerChildren`-style orchestration. Don't mix with `useCascadeProps` in the same cascade.
- **`useReducedMotion`** — re-exported from framer-motion. Use in any motion that should opt out for users who set the OS preference.

When an element participates in motion (cascade, hover physics, exit animation), its root MUST be a `motion.X` element. Pattern: `<motion.aside>` / `<motion.header>` / `<motion.div>`. The component accepts a `motionProps` prop that the parent can spread onto the motion root:

```jsx
// In the component:
<motion.aside {...(motionProps ?? {})} style={...}>...</motion.aside>

// In the parent:
const sidebarMotion = useCascadeProps(0);
<Sidebar motionProps={sidebarMotion} />
```

This keeps motion concerns out of the component's internal layout — the component still owns its `style`, the parent owns the motion choreography, and there's no wrapper div that breaks flex chains.

For interaction feedback (hover lifts, press states), use framer-motion's `whileHover` / `whileTap` declaratively. They respect `prefers-reduced-motion` automatically and compose with the existing `cva` variants without fighting them.

For mount/unmount transitions (Drawer slide-out, Popover dismiss), wrap the conditional render in `<AnimatePresence>` with `exit` props on the motion element. This is what replaces the manual `setTimeout` patterns scattered through some components today.

### Cascade vs internal motion — a deliberate split

Andromeda's motion has two layers, deliberately distinct:

- **Outer cascade** — the page composing itself on first load. Sidebar slides in, then header, then sections cascade top-to-bottom. Triggered on mount via `useCascadeProps(index)`. After ~860ms everything is at rest in its final position. The cascade is decorative: it doesn't carry data meaning, it signals "the system is initialising".
- **Internal primitive motion** — count-ups, segment fills, scan reveals, live drift. Each animated primitive (`StatTile`, `ProgressBar`, etc.) gates its own animation behind `useInView` so it plays at the moment the user sees it, not at mount. These motions DO carry data meaning — the count-up is the value arriving, the fill cascade is the percentage materialising.

`must` — The cascade is mount-triggered, not scroll-triggered. Sliding sections into empty viewport space as the user scrolls down feels broken — the page reads "incomplete and slowly arriving" rather than "alive". By the time the user starts scrolling, every section should already be at rest in its final place; only the *internal* animations of those sections fire on view-entry.

`must` — Internal primitive motion is scroll-triggered, not mount-triggered. A status panel below the fold animating on mount means the user never sees it; by the time they scroll there, the bars are already filled. Each animated primitive gates itself on `useInView`.

### Row-by-row stagger inside tables and logs

`should` — Any list of stacked rows separated by dividers (table body, log feed, comments thread, notification list) gets a row-stagger reveal when its container scrolls into view. Each row fades in (opacity only — no transform), 40ms apart, 350ms per row. Tighter than the section cascade because rows are smaller visual elements.

`must` — Row-reveal animation is opacity-only, never `transform: translateY`. Transforms on `<motion.tr>` interact poorly with table layout — sub-pixel reflow, brief horizontal scrollbar flashes when the table sits inside an `overflow-x: auto` container. The fade alone carries the reveal; the stagger timing does the rest.

Use the `rowContainer` + `rowItem` variants pair from `components/lib/motion.ts`:

```jsx
import { motion } from 'framer-motion';
import { rowContainer, rowItem } from '../../components/lib/motion';

<motion.tbody
  variants={rowContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  {items.map(item => (
    <motion.tr key={item.id} variants={rowItem}>
      {/* row cells */}
    </motion.tr>
  ))}
</motion.tbody>
```

The variants live in tokens (`tokens.motion.duration.row` = 350ms, `tokens.motion.stagger.row` = 40ms) so all tables and logs share the same tempo. Don't redefine row timing inline — keep the system consistent.

When the row is a non-table list (CommsLog, NotificationList, etc.), use `motion.div` for both container and item with the same variants. The pattern is the same, only the element changes.

### Scroll-aware mount-time animations

`must` — Any component with a one-shot mount-time animation (count-up, segment-fill cascade, fade-in) MUST gate that animation behind viewport intersection. Otherwise components below the fold burn their reveal off-screen and the user never sees the motion.

The pattern, using framer-motion's `useInView` hook:

```jsx
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const internalRef = useRef(null);
const inView = useInView(internalRef, { once: true, amount: 0.3 });

useEffect(() => {
  if (!inView) return;        // wait for the user to actually see it
  // kick off the animation — RAF, setTimeout, setState, etc.
}, [inView]);

return <div ref={internalRef}>...</div>;
```

`once: true` — animate the first time the element enters view, then never again. Re-entering the viewport (scroll up, scroll down) doesn't re-trigger.

`amount: 0.3` — wait until 30% of the element is visible. Higher than the cascade's `0.15` because the internal animation is the "main event" of that component; we want the user clearly looking at it. The cascade can be more eager because it's just the section establishing itself.

When forwarding refs, use a setRefs helper that fans out to both the internal ref and the consumer's outerRef:

```jsx
const setRefs = (node) => {
  internalRef.current = node;
  if (typeof outerRef === 'function') outerRef(node);
  else if (outerRef) outerRef.current = node;
};
```

Components currently scroll-aware: `ProgressBar` (segment fill), `StatTile` (count-up + live drift), `RadarChart` (scan reveal). New animated primitives must follow the same pattern — adding a fresh component with mount-only animation is a regression.

The result for templates: any component using these primitives gets correct scroll choreography automatically. A new template that drops in a row of `<StatTile>` cards followed by a `<ProgressBar>` row inherits scroll-triggered count-ups and scroll-triggered fills with no extra wiring.

`must` — Never hardcode ms / cubic-bezier in framer-motion `transition` props. Read from `tokens.motion`:

```jsx
import { tokens } from '../../tokens';

transition={{
  duration: parseInt(tokens.motion.duration.cascade) / 1000,  // framer-motion uses seconds
  ease: [0, 0, 0.2, 1],                                       // tokens.motion.easing.out
  delay: index * (parseInt(tokens.motion.stagger.cascade) / 1000),
}}
```

Or just use `useCascadeProps(index)` and let the helper do the parsing.

---

## Sensible defaults

When unsure, these are the safe choices. Each can be overridden with reason; without reason, default.

| Question | Default | When to deviate |
|---|---|---|
| Component size in a row | `md` (32px height) | `sm` for dense legend rows / overflow chips; `lg` for primary actions in hero rows |
| Button variant | `outline` | `default` for primary action (one per region); `destructive` for irreversible; `ghost`/`link` for de-emphasised secondary |
| Body text color | `text.secondary` | `text.primary` for headlines + key values; `text.muted` for tight UI labels; `text.faint` for peripheral / decorative |
| Accent stop | `accent-300` | `accent-200` for borders/lines; `accent-400` for solid fills; `accent-500` for badge bg + focus ring |
| Card variant | base (`surface.raised`) | glow variant only for cards that highlight a live measurement |
| Chart series ink | `text.primary` (single) | See "Multi-series" rule for color hierarchy |
| Padding around panel content | `tokens.spacing[2]` (8px) clearance from corner markers | Larger only when the panel feels cramped |
| Gap between siblings in a row | `tokens.spacing[3]` (12px) | `spacing[2]` for tight legends; `spacing[4]` for relaxed forms |
| Section divider inset | `tokens.spacing[3]` from each side — never edge-to-edge | Never deviate |
| Animation duration | `~140ms` ease-out | `~80ms` for click feedback; `~200ms` for stateful trigger reveals |

---

## Decision trees

Pick the right component when two could plausibly fit. These are the most common branches.

### "I want to show a number"

- Standalone metric, ≥ 2 lines (label + value): **`<StatTile>`**
- Inline status or label with text: **`<Badge>`**
- Number with delta vs baseline: **`<StatTile>`** (with arrow)
- Number inside a Table row: plain text, right-aligned, mono
- Number that IS a measurement (live value): the value gets accent text color; everything else stays `text.primary`

### "I want a labeled section"

- Top-level dashboard panel: **`<Card>` + `<PanelHeader>`** (uppercase, `size.xl`, `tracking.tight`, `spacing[4] spacing[5]` padding)
- Nested sub-region inside a panel: **`<Card>` + `<CardHeader>`** (uppercase, `size.sm`, `tracking.wider`, `spacing[3]` all sides)
- Single-line label with right-side action: PanelHeader (with action slot)
- Two visual weights signal hierarchy. Don't mix.

### "I want a button"

- Primary action, one per region: `variant="default"` (accent fill, glow on hover)
- Secondary actions: `variant="outline"` (transparent + border)
- Tertiary / dismissive: `variant="ghost"` (no border, no fill, hover lightens)
- Irreversible (delete, abort, dispatch): `variant="destructive"` (red fill)
- Inline link-style action: `variant="link"` (underlined, no chrome)
- When unsure: `outline`. Outline is the safe wallpaper of the system.

### "I want a list of items"

- Navigation: **`<NavItem>`** with mono labels, indicator dot for active
- Selectable options: **`<PanelMenu>`** or **`<Radio>` group** depending on cardinality
- Tabular data: **`<Table>`** (with checkbox column if multi-select)
- Status grid: row of **`<StatTile>`** or row of **`<Badge>`** depending on payload

---

## Voice & copy

Token-driven typography is half the system's identity; copy convention is the other half.

- `must` — UI labels (panel titles, badge text, code labels): mono, uppercase, `tracking.wider`. Examples: `MISSION CONTROL`, `TLM-01`, `BEARING`.
- `should` — CTAs and actionable buttons: sentence case (e.g. *"Install"*, *"Launch sequence"*) — slightly more human than uppercase commands, used in places where the system is asking the user to act.
- `must` — Body copy (descriptions, paragraphs, multi-line text): normal case, sentence case, `text.secondary`, normal letter-spacing.
- `should` — No exclamation marks. The system is calm.
- `should` — Code labels (TLM-01, EXG-04, etc.) live in `text.faint`. They are reference, not measurement.

---

## Anti-patterns — never

`must`-severity. Each is a real mistake that's been made and corrected.

- Don't put accent color on text that is not a measurement
- Don't add glow to ProgressBar segments or Stat tiles
- Don't use raw px or hex values in any component or example — every value comes from `tokens.ts`
- Don't import from `examples/` into `components/`. Data flows the other way.
- Don't promote a DS component to a homepage standalone speculatively — promotion is a per-component user decision
- Don't position content at offset 0 inside a panel with corner markers
- Don't use `translateX(-50%)` on the first or last X-axis label
- Don't strip `@ts-nocheck` partially — all-or-nothing per file
- Don't import `meridian/` tokens or components into `andromeda/`, or vice versa
- Don't add a `// New` badge to any component (system retired 2026-04-19)
- Don't comment WHAT the code does — names handle that. Comments only explain non-obvious WHY.
- Don't mix `<PanelHeader>` and `<CardHeader>` in the same hierarchy level
- Don't use parallel flex columns where seam-alignment matters — use CSS Grid
- Don't add a transition on text color over 300ms — use ~80ms or no transition

---

## Promoting an inline pattern to a component

The promotion bar is **two real consumers**, not one. A sub-component that lives inline in a single example is interesting; a sub-component that's been re-implemented twice in independent examples is a real pattern. Promote the second time, not the first.

PanelHeader is the single intentional exception so far: two near-identical inline copies inside one block (`CapacityPanel` and `RequestsPanel`). The collapse to one component reduced obvious duplication and the API immediately had two consumers to road-test against. If the "two copies in one block" shortcut becomes a habit, push back — usually the right answer is to leave the duplication and wait.

What to do when you spot a candidate but the bar isn't met yet:

1. Leave it inline. Resist the urge.
2. Note it (mentally, in a PR comment, or in a follow-up plan file).
3. The next example you build, watch for the pattern. If you reach for the same shape, *now* promote — and let the second consumer shape the API, not the first.

`should` — Speculative promotion is the most common way design-system components grow brittle: APIs that fit one site, then need to be widened or forked the second time they're used.

---

## When in doubt

If a value isn't in `tokens.ts`, the question is: should this become a token, or should the design adapt? Default to adapting. Adding a token is a deliberate change to the system and propagates everywhere — it's not a one-off escape hatch.

If a behavior contradicts a rule in this file but the user asks for it explicitly, follow the user. After the change lands, update this file so the new rule is the canonical one.

---

## How this file is maintained

`must` — Every session that touches Andromeda should leave this file at least as accurate as it found it. When a correction lands ("don't use accent on titles", "no glow on progress bars", "first X-axis label clips at offset 0"), the rule goes in immediately — not after the session, not in a future cleanup pass. Now.

The file is read at the start of every Andromeda session. Length is fine; redundancy is not. If a rule is implied by another rule, collapse them.

For corrections that apply to a single component, write to that component's `<Component>.rules.md` file (e.g. `components/Button.rules.md`). For corrections that span components or change system-wide intent, write here.

The companion skill `andromeda-design-system` (`.claude/skills/andromeda-design-system/SKILL.md`) points at this file. As long as this file stays current, the skill stays current — the skill doesn't duplicate content, it just routes attention here.
