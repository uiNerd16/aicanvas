# Card — rules

Component-specific brain for `Card.tsx` (and the slot components: `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription`). Read alongside `design-systems/andromeda/rules.md` (system-wide rules) before extending or composing.

Severity tags follow the same convention: `must` / `should` / `may`.

---

## What a Card is

A Card in Andromeda is a content region framed by corner markers, sitting on `surface.raised` with no perimeter stroke. Corner markers ARE the frame — the card doesn't need a border because the four L-shaped marks at the corners already define the rectangle.

`must` — The corner-marker frame is non-negotiable. Don't replace it with a border, a glow, or a drop shadow.

## Variants

| Variant | Background | Border | Use |
|---|---|---|---|
| `base` (default) | `surface.raised` | none (corner markers only) | Every Card unless there's a specific reason for `glow` |
| `glow` | `gradient.accentSweep` | `accent-500` border | Cards that highlight a live measurement or the most-active region of the page |

`should` — Default to `base`. The glow variant is reserved for one card per screen at most — if every card glows, none does.

`must` — The accentSweep gradient on `glow` is intentionally a barely-visible teal whisper. If the card reads as "a colored card", the gradient is too strong — the rule is the eye should see "this card has presence" not "this card is teal".

## Slot structure

```jsx
<Card>
  <CardHeader>
    <CardTitle>Section title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* body */}
  </CardContent>
  <CardFooter>
    {/* optional bottom actions or summary */}
  </CardFooter>
</Card>
```

`must` — CardHeader, CardContent, CardFooter use consistent padding from `tokens.spacing` — never override. The padding is part of the system's rhythm; tweaking it on one Card means breaking visual continuity with every other Card.

`should` — Use the slot components even when their padding feels too generous for your specific use. Tighter padding is a sign the content needs different chrome — consider a `<PanelHeader>` panel instead, or no Card at all.

## CardHeader vs PanelHeader

This is the most common decision point and the most common mistake. Two header components, deliberately different:

| | PanelHeader | CardHeader |
|---|---|---|
| Title style | sentence-case mono, `size.xl`, `weight.semibold`, `tracking.tight` | uppercase mono, `size.sm`, `weight.medium`, `tracking.wider` |
| Padding | `spacing[4] spacing[5]` | `spacing[3]` all sides |
| Use | top of a top-level dashboard panel | top of a nested Card composition |

`must` — Don't mix them. PanelHeader is the LOUDER hierarchy ("this is a section of the page"); CardHeader is the QUIETER ("this is a labeled subdivision"). Mixing them on the same level breaks the page's visual rhythm.

Decision: if the Card sits as a top-level cell in a dashboard grid, use `<PanelHeader>` (and the Card behaves as a "panel"). If the Card sits inside another Card or panel as a nested region, use `<CardHeader>`.

## Section dividers

`must` — Every divider inside a Card (between header and body, between body and footer) is inset by `tokens.spacing[3]` (12px) from each side. Never edge-to-edge.

The slot components already render this for you. If you build a custom divider strip inline, replicate the pattern (sibling absolutely-positioned span on a `position: relative` parent) — see "Section dividers — always inset by spacing[3]" in the system-wide rules for the canonical snippet.

## Content insets

`must` — At least 8px (`tokens.spacing[2]`) of clearance between content and the Card edge. Corner markers are 12×12px — content placed at offset 0 visually collides with the L-shape.

For inline content (legends, axis labels, overlay chips) placed via absolute positioning inside a Card, define `PANEL_INSET = 8` at the top of the file and use it consistently for left/right offsets.

## Composition with charts and stats

The two most common Card recipes are documented in the system-wide rules:

- **Chart Panel** (Recipe 2 in `rules.md`) — Card + PanelHeader + SVG plot. Y-axis gutter, X-axis row, no glow on plot elements.
- **Stat Card Row** (Recipe 1 in `rules.md`) — Card + PanelHeader + row of StatTiles sharing 1px borders edge-to-edge.

When extending a Card to hold a new content type, check those recipes first. If the new content fits one of them, follow the pattern.

## Bento grid alignment

When two or more Cards sit in a multi-column, multi-row dashboard grid, every seam between Cards must line up across columns.

`must` — Use CSS Grid (NOT nested flex). The grid's row sizing is what guarantees seam alignment. See "Bento grid alignment" in the system-wide rules for the canonical pattern.

`must` — Anti-pattern: parallel flex columns. Parallel flex columns size their children independently per column, so a left Card and a right Card on the same row may end at different y-coordinates. The seam looks broken even when individual Cards are perfect.

## Anti-patterns

- `must` — Don't add a perimeter stroke to a Card. Corner markers are the frame.
- `must` — Don't add a drop shadow to a Card. Andromeda is flat — depth is signaled by surface tokens (`surface.base` < `surface.raised` < `surface.overlay`), not by shadows.
- `must` — Don't add a glow to a base Card. Glow is a variant; if you need glow, use the `glow` variant.
- `must` — Don't override the slot padding (`CardHeader`, `CardContent`, `CardFooter`).
- `must` — Don't mix `<PanelHeader>` and `<CardHeader>` on the same hierarchy level.
- `should` — Don't put a Card inside a Card more than 2 levels deep. If you need a third level, the design has too much chrome — consider flattening with dividers and headings instead.
- `should` — Don't put a Card on top of a non-`surface.base` background. The system assumes Cards sit on the page's base surface; on other backgrounds the corner markers may visually conflict with the surrounding chrome.

## Adjacent components

- **PanelHeader** — used at the top of a Card when the Card is a top-level panel. See "CardHeader vs PanelHeader" above.
- **CornerMarkers** — automatically rendered by `Card`. Don't render separately unless you're building a custom container that explicitly wants the markers without the Card chrome.
- **StatTile, RadarChart, Table** — common content inside Cards. Each has its own rules file once written.

## When the user corrects a Card decision

Write the rule back here, in this file, in the relevant section above. If the rule applies to multiple components (e.g. a divider rule that applies to Card AND custom panels), write it to the system-wide `rules.md` instead.
