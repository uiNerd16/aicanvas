# Flip Calendar — Spec

**Component:** FlipCalendar
**Slug:** `flip-calendar`
**Description:** A desk-calendar widget showing dates 1–31 with a flip-clock page-turn animation between numbers.

## Visual

- Compact card resembling a tear-off desk calendar — rounded corners, slight drop shadow
- Two-tone face: top half slightly darker blue, bottom half lighter blue (inspired by Google Calendar icon)
- Large bold date number centered, white text
- Two small decorative binding rings/dots at the top
- Prev / Next controls to advance through dates

## Behaviour

- Clicking next/prev triggers a flip animation — the current date "folds away" like a page being torn off
- Classic flip-clock split: top half folds down (rotateX 0→90°), new top snaps in (-90→0°)
- Bottom half mirrors: current bottom folds up, new bottom reveals
- Smooth ease-in-out ~300–400ms per flip
- Loops: after 31 → back to 1, before 1 → back to 31
- Direction-aware: next flips forward, prev flips backward

## Tech notes

- Framer Motion `motion.div` with `rotateX` and `transformPerspective` / `perspective` for 3D flip
- Split card into top and bottom halves using `overflow: hidden` on each half
- Top half shows the top portion of the number; bottom half shows the bottom portion
- Colors:
  - Top half: `#4A90D9` (darker blue)
  - Bottom half: `#5BA3E8` (lighter blue)
  - Text: white
  - Rings: light grey/white
- Light/dark mode: dark mode deepens blues slightly (`#3a78c4` / `#4a8fd4`), light mode keeps bright blues
- Root: `flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950`
