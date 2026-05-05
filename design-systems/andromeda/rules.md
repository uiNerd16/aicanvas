# Andromeda — Brain

The third pillar of the Andromeda design system, alongside `tokens.ts` (values) and `components/` (code). Read this file before touching any Andromeda component, example, or block. If a rule here conflicts with code, fix the code — this file is the source of truth for design intent.

Updates land here the moment a new rule is discovered. Never let the same correction happen twice.

---

## Color philosophy

Andromeda is a near-monochrome system. Color is reserved for meaning, never decoration.

### When color IS used

- Live measurements: clocks, telemetry values, deltas, volume readings
- Active state markers: nav-item indicator dot, badge dot, breadcrumb
- Status of importance where the meaning IS the color: `Live`, `Online`, `Fault`, `Warning`
- Threshold crossings on charts (red for negative move, accent for positive)

### When color is NEVER used

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
- No glow on `outline`, `ghost`, or `link` variants.

---

## Badges

- Text is always `text.primary` on every variant. Background carries the meaning.
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

If a chart needs more than 4 series, the chart is doing too much — split into stacked charts or use small multiples. Don't reach for a 5-color palette.

### Both

- Cursor (hover crosshair): `border.bright` dashed
- Tooltip value: `text.primary`
- Grid lines: `border.subtle`, dashed `2 4`, horizontal only by default
- Axis text: `text.muted`
- No glow on any chart element

Chart ink is neutral by default because the chart itself is the data. Color enters only when it carries semantic meaning that the eye must distinguish at a glance.

---

## Progress bars

- 30 segments, each a 6×16 rectangle, all skewed `skewX(-12deg)` into parallelograms
- No glow on filled or empty segments
- Filled: variant color (`accent-400` / `orange-400` / `red-400`) bg + matching border
- Empty: `surface.overlay` bg, `border.subtle` border
- Fill animation: stagger in groups of 3, 120ms cascade, 400ms transition
- Label / value row above the bar uses mono uppercase, `text.secondary` label + `text.primary` value

---

## Stat tiles

- No scanline, no sweep, no shimmer on mount — count-up animation only
- Delta arrow: `accent-300` on positive, `red-300` on negative, `text.muted` on neutral
- Code label (e.g. `TLM-01`) sits in the top-right corner in `text.faint`
- Tiles share borders edge-to-edge with `marginLeft: -1` so the seam is a single 1px line

---

## Nav items

- Active: text `accent-300`, 4×4 right-edge indicator dot in `accent-300` with `accent-500` glow
- Inactive: `text.secondary`, hover → `text.primary` + `surface.hover` bg
- Mono labels by default; pass `mono={false}` for sans labels in non-system contexts
- No background fill on the active state — the indicator dot is the signal

---

## Cards

- Default: `surface.raised` bg, no perimeter stroke, corner markers as the frame
- Glow: `gradient.accentSweep` bg, `accent-500` border, corner markers
- The accentSweep gradient is a barely-visible teal whisper — if it reads as a colored card it's too strong
- CardHeader, CardContent, CardFooter use consistent padding from `tokens.spacing` — never override

---

## Layout

### Size consistency in a row

When two or more sized components sit on the same horizontal row (button + avatar, button + chip, button + icon-button, input + button, etc.), they MUST share the same size token: all `sm`, all `md`, or all `lg`. Mixing sizes in a row breaks the eye's baseline and makes the row look misaligned even if individual components are correct.

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

Anti-pattern: parallel flex columns. `<flex-col><A/><B/></flex-col><flex-col><C/><D/></flex-col>` does NOT guarantee A and C share a height — they're sized independently per column. Use grid.

### Content insets in panels

Every panel that carries corner markers needs at least `8px` of clearance between content and the panel edge. The markers are `12×12px` — content placed at offset 0 will visually collide with the L-shape.

Define `PANEL_INSET = 8` (or use `tokens.spacing[2]`) at the top of any composition file and use it for left/right offsets on inline content (legends, axis labels, overlay chips).

### Chart axes

- Y-axis labels: render outside the SVG plot area, in an absolute-positioned label gutter on the right. Standard width: 72px.
- X-axis labels: NEVER use index 0 or N-1 with `translateX(-50%)`. The first/last label will clip on the parent `overflow: hidden`. Two acceptable patterns:
  - Anchor first label with `left: 0`, last with `right: 0`, no translate
  - Inset the indices to `[2, N/2, N-3]` so even centered labels have breathing room
- Use `vectorEffect="non-scaling-stroke"` on every SVG line drawn under `preserveAspectRatio="none"` — without it strokes distort with the viewBox.

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

## Anti-patterns — never

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

---

## When in doubt

If a value isn't in `tokens.ts`, the question is: should this become a token, or should the design adapt? Default to adapting. Adding a token is a deliberate change to the system and propagates everywhere — it's not a one-off escape hatch.

If a behavior contradicts a rule in this file but the user asks for it explicitly, follow the user. After the change lands, update this file so the new rule is the canonical one.

---

## How this file is maintained

Every session that touches Andromeda should leave this file at least as accurate as it found it. When a correction lands ("don't use accent on titles", "no glow on progress bars", "first X-axis label clips at offset 0"), the rule goes in immediately — not after the session, not in a future cleanup pass. Now.

The file is read at the start of every Andromeda session. Length is fine; redundancy is not. If a rule is implied by another rule, collapse them.
