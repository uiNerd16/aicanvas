Component: motion-pass-2
Slug: motion-pass-2
design-system: andromeda
Description: Adds interaction motion to primitives, row enter/exit to tables, and an odometer digit-roll mode to StatTile.

## 1 — Interaction motion on primitives

- Button / IconButton
  - Hover: translateY(-1px) + 4% brightness, motion.duration.normal + easing.out
  - Press: scale(0.98), motion.duration.fast + easing.in
  - Focus ring: fade-in over motion.duration.fast (currently snaps)
  - Disabled: no motion
- Implementation: framer's motion.button with whileHover / whileTap / whileFocus
- Files: components/Button.tsx, components/IconButton.tsx

## 3 — Row insert/remove via AnimatePresence

- Wrap tbody rows in <AnimatePresence initial={false}>
- Enter: opacity 0→1 + height 0→auto, motion.duration.row + easing.out
- Exit: reverse, easing.in
- Files: VehiclesTable, RequestsTable, CommsLog (skip OrderBook — too dense)
- Caveat: border-collapse: collapse breaks TR borders; row-height animation must respect the existing gradient-border workaround. Fallback: opacity-only with a measured wrapper.

## 5 — HUD digit roll on StatTile

- StatTile gains liveRoll mode (existing live drift stays)
- On value change, diff char-by-char; only changed digits roll
- Each digit: previous translates up + fades, new enters from below, motion.duration.normal, easing.sharp
- font-variant-numeric: tabular-nums to lock width
- First mount fades in; no roll on initial render

## Tech notes

- All motion gated behind useReducedMotion
- Every duration/easing references tokens.motion.*; no raw values
- @ts-nocheck headers stay
- Brain (rules.md) gets two new entries: interaction motion contract + digit roll vs count-up vs drift decision tree
- No new deps

## Acceptance

- Button/IconButton: hover, press, focus visibly different from now
- Inserting/removing a row in any of the three tables animates
- StatTile in liveRoll mode rolls only the digits that changed; reduced-motion kills all of it
- grep for raw ms / cubic-bezier in components/ returns no new hits outside tokens.ts

Status: approved 2026-05-08
