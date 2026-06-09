# Interactive Card Stack

**Slug:** `interactive-card-stack`
**design-system:** `standalone`

## Description
A loose pile of five photo cards with mixed aspect ratios, two landscape and three portrait, scattered around a focused center. Click any back card to bring it to the front, drag the focused card sideways to cycle, or use the arrow keys (while focus is inside the widget). The whole pile breathes softly when idle, unless the user prefers reduced motion. Same interaction language as `tilted-coverflow`, different geometry: a moodboard pile instead of a horizontal fan.

## Visual
- 5 cards rendered absolute around a center anchor in a single stage (`relative perspective: 1400px`). Slot 0 is the focused front card; slots 1-4 scatter behind. The stage is `overflow-hidden` so the rotated, offset cards never spill past the container or trigger a horizontal page scrollbar.
- Slot positions (focused at index 0, hand-tuned scatter behind):

  | slot | x    | y   | rotate | scale | zIndex |
  |------|------|-----|--------|-------|--------|
  | 0    |   0  |  0  |  1.5   | 1.00  | 50     |
  | 1    |  160 | -30 |  12    | 0.90  | 40     |
  | 2    | -150 | -10 | -14    | 0.89  | 30     |
  | 3    |   90 |  70 |  8     | 0.86  | 20     |
  | 4    | -110 |  60 | -9     | 0.84  | 10     |

- Mixed aspect ratios assigned per cardId (NOT per slot, the orientation travels with the card). Every card renders a title strip above the image:

  | id | orientation | aspect | content                       |
  |----|-------------|--------|-------------------------------|
  | 0  | portrait    | 4:5    | title (top) + photo (bottom)  |
  | 1  | landscape   | 16:10  | title (top) + photo (bottom)  |
  | 2  | portrait    | 4:5    | title (top) + photo (bottom)  |
  | 3  | landscape   | 16:10  | title (top) + photo (bottom)  |
  | 4  | portrait    | 4:5    | title (top) + photo (bottom)  |

- Card dimensions:
  - Landscape: width `clamp(220px, 28vw, 320px)`, aspect 16/10.
  - Portrait: width `clamp(160px, 20vw, 220px)`, aspect 4/5.
- Each card is a polaroid-style print: rounded `[18px]`, white paper (`#FFFFFF`, dark mode `#F5F5F0`), uniform `10px` padding on all sides, `ring-1 ring-black/8 dark:ring-white/12`, and a layered drop shadow: `0 12px 28px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.12)` (focused: `0 24px 48px rgba(0,0,0,0.28), 0 6px 14px rgba(0,0,0,0.16)`).
- Title strip (every card): Manrope semibold, 15px, `line-height: 1.3`, `letter-spacing: -0.01em`, color `#1a1a19`, left-aligned. Clamped to 2 lines (`-webkit-box` / `-webkit-line-clamp: 2` / `-webkit-box-orient: vertical` / `overflow: hidden`) with `min-height: 2.6em` so every card reserves the same vertical space. The title also has `padding-right: 34px` to reserve room for the open button so the title never reflows when the button appears. Title block padding: `14px 12px 8px 12px`.
- Image well is rounded `[10px]`, clipped, sitting below the title strip.
- Container chrome: `bg-[#E8E8DF] dark:bg-[#1A1A19]` (sand-100 / sand-950 equivalents in raw hex per the standalone-no-tokens rule).

## Cards (data)
Five birds, each titled with its common name. The title is the card's accessible name; because the title is a visible caption, the `<img>` `alt=""` is empty (decorative) so screen readers do not announce the name twice. Photos are hosted on ImageKit, pre-cropped to each card's aspect ratio and compressed as JPEG. The `Card` interface also has an optional `href`; the demo cards leave it unset (so the top-right chip is decorative), and a developer can set it per card to make the chip a real link.

| id | orientation | Title                | Image (ImageKit `/aitoolkit/interactive-card-stack/`) |
|----|-------------|----------------------|---------------------------------------------|
| 0  | portrait    | Scarlet macaw        | scarlet-macaw-rainforest-branch.jpg         |
| 1  | landscape   | Toco toucan          | toco-toucan-rainforest-canopy.jpg           |
| 2  | portrait    | Blue and gold macaw  | blue-and-gold-macaw-jungle-perch.jpg        |
| 3  | landscape   | Green-headed tanager | green-headed-tanager-mossy-branch.jpg       |
| 4  | portrait    | Northern mockingbird | northern-mockingbird-autumn-woodland.jpg    |

## Behaviour
- **Slot-based order.** State is an order array, `order[slotIndex] = cardId`. Slot 0 is always the focused front. Click, drag, and arrow keys mutate the order; cards spring into their new slots. The array is never mutated, every change returns a new array.
- **Click.** Click any non-focused card to focus it. The clicked card moves to slot 0 and the rest reshuffle. The focused card has no click action (it is dragged, not clicked).
- **Drag.** Only the focused card is draggable: `drag="x"`, `dragConstraints={{ left: 0, right: 0 }}`, `dragElastic={0.6}`. On release, cycle by 1 if `|info.offset.x| > 80` or `|info.velocity.x| > 400`. A leftward drag (negative offset) advances to the next card; a rightward drag goes to the previous card. A `dragDelta` ref separates taps from drags (< 8px is a tap).
- **z-index.** Each card's `zIndex` follows its slot directly. A flicked card drops behind the others the instant it is released and slides under them as it travels to the rear, so there is no late, visible z-index swap.
- **Keys.** ArrowLeft / ArrowRight cycle focus, but the `window` keydown handler is SCOPED: it only acts when `containerRef.current.contains(document.activeElement)`, and otherwise does not `preventDefault`. The component never hijacks the host page's arrow keys.
- **Entrance stagger.** On mount each card animates from `{ opacity: 0, scale: 0.5, y: 60 }` to its slot, delay `slotIndex * 0.08s` (focused lands last). Mount uses a bouncier spring (`stiffness: 200, damping: 22`); after mount the runtime spring (`stiffness: 280, damping: 26`) takes over. Skipped entirely under reduced motion (`initial={false}`).
- **Breathing.** Each card runs an idle loop on its inner (breathing) layer:
  - rest cards: `y: [0, -8, 0, 6, 0]`, `rotate: [0, 1, 0, -1, 0]`; focused card: `y: [0, -14, 0, 10, 0]`, `rotate: [0, 1.5, 0, -1.5, 0]` (more present).
  - duration `7 + cardId * 0.6` seconds (7.0s / 7.6s / 8.2s / 8.8s / 9.4s for ids 0-4), `repeat: Infinity`, `ease: easeInOut`, out of phase per card.
- **Reduced motion.** When `useReducedMotion()` is true, the breathing loop is disabled (amplitude 0, `duration: 0`) and the entrance is skipped (`initial={false}`), so motion-sensitive users get a static pile.
- **Dot indicator + hint.** Below the pile: a row of 5 dots (each a 24x24 button wrapping a small pill), active dot wider (20px) and brighter, labelled by bird name with `aria-current`. One-line hint underneath: "drag, click, or use the arrow keys" at `text-sm`.

## Accessibility
- **Stage** is `role="group"` with `aria-label="Interactive card stack"` and `aria-describedby="ics-hint"` (the hint line).
- **Cards.** Only non-focused cards are `role="button"` (labelled `Show <title>`) and activatable by click / Enter / Space. The focused card has no fake action: it is a labelled, draggable region (`<title>, current...`), `tabIndex={0}` so focus stays put across reorders, but no `role="button"`.
- **Open control.** The top-right chip is the seam for a per-card link. If a card sets the optional `href`, the chip is a real `<a>` link (opens in a new tab, focusable, labelled, with the focus ring); otherwise it is a decorative `aria-hidden` `motion.span` with no action. The demo cards set no `href`, so pressing the chip does nothing (it is a placeholder affordance for developers to wire their own links). Rendered ONLY on the focused card, so there are never hidden, focusable controls behind the front.
- **Focus ring.** Every interactive control carries a visible `focus-visible` outline in the olive accent (`#A8B94D`).
- **Live region.** A visually-hidden `aria-live="polite"` element announces the front-card change.
- **Images** are decorative (`alt=""`) because the visible title names them; the focused image loads `eager` / `fetchPriority="high"` (it is the LCP hero), the rest `lazy` / `low`.

## Mobile
- Below 640px (`matchMedia('(min-width: 640px)')`), tighten the scatter:
  - x offsets soften (slot 1 +90, slot 2 -85, slots 3/4 +/-55), y offsets soften, rotations soften, scales lift so back cards stay legible.
  - landscape width `clamp(200px, 60vw, 260px)`, portrait width `clamp(130px, 42vw, 180px)`.
- All 5 cards still render; the stage clips overflow so nothing spills horizontally at 320px.
- Touch drag via Framer Motion (`dragElastic={0.6}`). Tap focuses a back card; drag past threshold cycles. No `:hover` dependency.
- Dots are full 24x24 hit targets (WCAG 2.5.8) around the small visible pill.

## Three-layer DOM (per card)
1. **Outer `motion.div`** is the positioning frame and the accessibility surface. It owns slot transforms (`x`, `y`, `rotate`, `scale`), `zIndex` (straight from the slot), `tabIndex`, the conditional `role="button"` / handlers (non-focused only), and drag handlers (focused only). It is a `div` (not a `button`) so the nested chip can be a valid link. No background, ring, shadow, or padding.
2. **Middle `motion.div`** owns the breathing loop (`y` and `rotate` keyframes) AND the polaroid chrome: `backgroundColor: #FFFFFF`, `ring-1 ring-black/[0.08] dark:ring-white/[0.12]`, layered `boxShadow`, uniform `10px` padding, and a `dark:bg-[#F5F5F0]` paper overlay span. Breathing runs on a separate transition from the slot spring.
3. **Inner content** is the title strip (relative container, `<p>` 2-line clamp with reserved right padding, plus the focused-only top-right chip absolutely positioned, a link when the card has `href` else a decorative affordance) then the image well (`aspect-[16/10]` landscape, `aspect-[4/5]` portrait, `<img>` `absolute inset-0 w-full h-full object-cover`, `alt=""`).

## Tech notes
- `'use client'`. `// npm install framer-motion`. Single default export `InteractiveCardStack`.
- Single root `<div>` with `flex min-h-screen w-full items-center justify-center bg-[#E8E8DF] dark:bg-[#1A1A19] px-4`. No `min-h-screen` on any inner element.
- Slot-based pattern from `skills/card-stack-pattern.md`. No `dismissing` guard, cycling is reversible by design (no card ever leaves the pile).
- Refs: `containerRef` (scopes the arrow keys), `dragDelta` (tap vs drag). Constants (springs, breathing keyframes, shadows, RING, TITLE_STYLE, CHIP_STYLE/CHIP_POSITION, the shared `OpenChip` element) are hoisted to module scope for stable identity.
- All effects clean up (matchMedia listener, keydown listener).
- TypeScript strict, no `any`. Framer Motion for all motion. `useReducedMotion` gates the perpetual animation.
- No `sand-*` / `olive-*` tokens inside the component. Raw hex values only.
- No em-dashes anywhere in user-visible copy (titles, hint).
- Photos hosted on ImageKit at `https://ik.imagekit.io/aitoolkit/interactive-card-stack/<name>.jpg`, pre-cropped to each card's aspect ratio and compressed as JPEG, with SEO-descriptive filenames. Rendered with a plain `<img>` (no Next.js Image).
