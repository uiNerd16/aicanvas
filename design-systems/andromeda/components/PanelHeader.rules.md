# PanelHeader — rules

Component-specific brain for `PanelHeader.tsx`. Read alongside `design-systems/andromeda/rules.md` (system-wide rules) before extending it.

Severity tags follow the same convention: `must` / `should` / `may`.

---

## What a PanelHeader is

The title row at the top of a top-level dashboard panel: a sentence-case mono title on the left, an optional `actions` slot on the right (typically `PanelMenu`, `IconButton`, or `Button`), and a bottom inset divider (`border.subtle`, inset `spacing[3]` from each edge — matches `CardHeader`). Distinct from `CardHeader`, which is uppercase widest-tracking mono for nested compositions inside a `Card`.

## Layout

`must` — **Title + actions stay on ONE row at every width.** The title sits left, a `flex:1` spacer pushes the actions slot to the right. The title carries `min-width:0` + `overflow:hidden` + `text-overflow:ellipsis` + `white-space:nowrap`, so a long title **truncates** rather than wrapping the actions down to their own line.

`must` — **Never wrap the row on mobile.** An earlier responsive pass wrapped the row below `md` (title to `flex-basis:100%`, actions onto a second line). That read as broken: the kebab dropped to the left edge under the title, and its menu then opened off the left edge of the screen. Panel titles are short by design ("Capacity", "Requests", "Vehicles") so one row always holds. Below `md` only the horizontal padding steps down one notch (`spacing[5]` → `spacing[4]`) for density — the single-row structure is unchanged.

`should` — If a consumer genuinely needs a long, non-truncating title, that's a composition choice (use a different header or a two-line layout deliberately), not a reason to make `PanelHeader` itself wrap.

## Actions slot

`should` — The actions slot is right-aligned and holds one primary affordance per panel (`PanelMenu` kebab is the common case). Because the row never wraps, the `PanelMenu` trigger stays anchored at the panel's right edge, so its (right-aligned) menu opens correctly beneath it and clamps inside the viewport on phones.
