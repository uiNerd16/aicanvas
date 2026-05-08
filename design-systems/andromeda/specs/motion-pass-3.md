Component: motion-pass-3
Slug: motion-pass-3
design-system: andromeda
Description: Active-indicator slide via layoutId across selection surfaces, AnimatePresence on Drawer + Tooltip, and a selection edge bar on RequestsTable rows.

## A — Active indicator slide via layoutId

The system gets one shared "active marker" idiom: a `motion.span` with a stable `layoutId` rendered only on the active item. Framer auto-animates it between sibling positions when the active value changes.

- **SegmentedControl** — replace manual ResizeObserver + offsetLeft/offsetWidth + raw `220ms cubic-bezier(...)` with a `layoutId="andromeda-segmented-indicator"` motion.span. The slide is no longer linear; it's framer's spring/tween between layouts and respects reduced motion.
- **NavItem** — the 4×4 active dot becomes `motion.span` with `layoutId="andromeda-navitem-indicator"`. Sliding requires consumer wrap the list in `<LayoutGroup>`; document this in rules.md.
- **RequestsTable filter pills** — `FilterTab` gets a layoutId background; the surface.active fill slides between tabs as activeFilter changes.

Transition: `tokens.motion.duration.slow` + `tokens.motion.easing.standard`. Reduced motion: framer makes the layout transition instant when honored.

## B — AnimatePresence on overlays

- **Drawer** — replace the manual `mounted/visible/setTimeout(240ms)` choreography with `<AnimatePresence>`-wrapped backdrop + panel. Backdrop fades opacity 0↔1 over `duration.slow`; panel slides in from its `side` over `duration.slow` + `easing.out` (entrance) / `easing.in` (exit). No more raw `duration-200`/`duration-240` strings.
- **Tooltip** — wrap the conditional render in `<AnimatePresence>`. Enter: opacity 0→1 + y 4px→0 over `duration.normal` + `easing.out`. Exit: reverse, `easing.in`.

PanelMenu and DateRangePicker share the popover pattern; document the recommended treatment in rules.md but don't refactor here — they're anchored-positioned and need more care than the spec budgets.

## C — Selection edge bar on RequestsTable rows

When a row is selected (Checkbox checked), a 2px vertical bar slides in from the row's left edge in `accent.300`. Implementation: absolute-positioned `motion.span` inside the `<motion.tr>`; framer animates `scaleX` (origin-left) 0↔1 over `duration.normal` + `easing.out`. Off when row deselected, framer plays exit. Reduced motion → no transition, just toggle visibility.

## Tech notes
- LayoutGroup pattern documented in rules.md; mission-control sidebar wrapped to demo NavItem slide.
- All durations/easings reference `tokens.motion.*` — no raw values
- @ts-nocheck headers stay
- Brain (rules.md) gets:
  - "Active indicator pattern — layoutId across siblings" (system-wide rule)
  - "Overlay enter/exit — AnimatePresence over setTimeout" (system-wide rule, replaces earlier Drawer-as-anti-pattern note)
  - "Selection edge bar" (table row pattern under Tables)

## Acceptance
- SegmentedControl indicator slides smoothly between segments (no measurement code)
- NavItem dot slides between sidebar items when wrapped in LayoutGroup
- RequestsTable filter pill fill slides between tabs
- Drawer opens/closes via AnimatePresence; no setTimeout in component
- Tooltip enter/exit fades over `duration.normal`
- Selecting/deselecting a request row reveals/hides a 2px accent bar from the left
- Reduced motion turns all of it off (framer-managed)

Status: approved 2026-05-08
