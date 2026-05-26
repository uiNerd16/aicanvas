# Scatter Pile

**Slug:** `scatter-pile`
**design-system:** `standalone`

## Description
A loose pile of five cards with mixed aspect ratios, two landscape and three portrait, fanned around a focused center. Click any card to bring it to the front, drag the focused card sideways to cycle, or use the arrow keys to step. The whole pile breathes softly when idle. Same interaction language as `tilted-coverflow`, different geometry, a moodboard pile instead of a horizontal fan.

## Visual
- 5 cards rendered absolute around a center anchor in a single stage (`relative perspective: 1400px`). Slot 0 is the focused front card; slots 1-4 scatter behind.
- Slot positions (focused at index 0, hand-tuned scatter behind):

  | slot | x    | y   | rotate | scale | zIndex |
  |------|------|-----|--------|-------|--------|
  | 0    |   0  |  0  |  1.5°  | 1.00  | 50     |
  | 1    |  160 | -30 |  12°   | 0.90  | 40     |
  | 2    | -150 | -10 | -14°   | 0.89  | 30     |
  | 3    |   90 |  70 |  8°    | 0.86  | 20     |
  | 4    | -110 |  60 | -9°    | 0.84  | 10     |

- Mixed aspect ratios assigned per cardId (NOT per slot, the orientation travels with the card):

  | id | orientation | aspect | content                                          |
  |----|-------------|--------|--------------------------------------------------|
  | 0  | portrait    | 4:5    | two-line title (top) + photo (bottom)            |
  | 1  | landscape   | 16:10  | photo only                                       |
  | 2  | portrait    | 4:5    | two-line title (top) + photo (bottom)            |
  | 3  | landscape   | 16:10  | photo only                                       |
  | 4  | portrait    | 4:5    | two-line title (top) + photo (bottom)            |

- Card dimensions:
  - Landscape: width `clamp(220px, 28vw, 320px)`, aspect 16/10.
  - Portrait: width `clamp(160px, 20vw, 220px)`, aspect 4/5.
- Each card is a polaroid-style print: rounded `[18px]`, white `bg-white dark:bg-[#F5F5F0]` padding around the image (10px on all sides; portrait cards use 10px top / 10px sides / 14px bottom to balance the title strip above), `ring-1 ring-black/8 dark:ring-white/12`, and a layered drop shadow:
  `box-shadow: 0 12px 28px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.12)` (focused: `0 24px 48px rgba(0,0,0,0.28), 0 6px 14px rgba(0,0,0,0.16)`).
- Portrait cards: title only (no byline). Sits ABOVE the image inside the polaroid frame. Manrope semibold, 15px, `line-height: 1.3`, `letter-spacing: -0.01em`, color `#1a1a19`, left-aligned. The title is clamped to exactly 2 lines via `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden` with a `min-height: 2.6em` so every portrait card reserves the same vertical space and the polaroid frames stay visually consistent. Title block padding: `14px 12px 8px 12px` (a bit more breathing room on top than bottom; sides match the polaroid horizontal padding).
- Image content area is rounded `[10px]` and clipped, sitting flush inside the polaroid padding below the title strip (portrait) or as the sole content (landscape).
- Container chrome: `bg-[#E8E8DF] dark:bg-[#1A1A19]` (sand-100 / sand-950 equivalents in raw hex per the standalone-no-tokens rule).
- Light mode card body stays warm-white (`#FFFFFF`); dark mode card body shifts to a slightly creamy off-white (`#F5F5F0`) so prints still read as paper against the deep background.

## Cards (data)
Five curated Unsplash photos plus editorial titles for the portrait cards. Titles are written to break cleanly into two roughly-balanced lines at the portrait card width.

| id | orientation | Title (portrait only)        | Photo (Unsplash slug)            |
|----|-------------|------------------------------|----------------------------------|
| 0  | portrait    | Quiet weekends in Hokkaido   | photo-1555169062-013468b47731    |
| 1  | landscape   |                              | photo-1602491453631-e2a5ad90a131 |
| 2  | portrait    | Letters from a quiet town    | photo-1658289929355-e87b9c4e9c47 |
| 3  | landscape   |                              | photo-1704265586326-6b8d7569e62c |
| 4  | portrait    | Field notes on attention     | photo-1617910879258-2aff8026515d |

## Behaviour
- **Slot-based order.** State is an order array, `order[slotIndex] = cardId`. Slot 0 is always the focused front. Click or arrow keys mutate the order; cards spring into their new slots.
- **Click.** Click any non-focused card (i.e. any card whose current slot index is > 0) to focus it. The clicked card moves to slot 0, and the rest reshuffle by rotating the order array so that focus lands first and the previous order trails behind.
- **Drag.** Only the focused card is draggable: `drag="x"` with `dragConstraints={{ left: 0, right: 0 }}` and `dragElastic={0.6}`. On release, cycle by ±1 if `|info.offset.x| > 80` or `|info.velocity.x| > 400`. Direction is right → next, left → previous. A `dragDelta` ref separates taps from drags (< 8px → click, ≥ 8px → drag).
- **Keys.** Arrow keys ←/→ step focus by ±1, looping at both ends. Keyboard listener attached to `window` while the stage is mounted; cleaned up on unmount.
- **Entrance stagger.** On mount each card animates from `{ opacity: 0, scale: 0.5, y: 60 }` to its slot. Delay = `(slotIndex) * 0.08s` so the focused card lands last (the back card lands first). Mount uses a slightly bouncier spring (`stiffness: 200, damping: 22`); after mount, the runtime spring (`stiffness: 280, damping: 26`) takes over.
- **Breathing.** Each card runs an idle loop on its inner visual layer (NOT the outer positioning layer, so slot transforms stay clean):
  - `y: [0, -8, 0, 6, 0]`, `rotate: [0, 1, 0, -1, 0]`
  - duration `7 + cardId * 0.6` seconds (7.0s / 7.6s / 8.2s)
  - `repeat: Infinity`, `ease: easeInOut`
  - out of phase per card so the pile feels alive but not synced.
- **Focused card** has the breathing amplitude doubled (`y: [0, -14, 0, 10, 0]`, `rotate: [0, 1.5, 0, -1.5, 0]`) so it feels more present without disrupting the layout.
- **Dot indicator + hint.** Below the pile: a row of 5 dots, active dot wider (20px) and brighter; one-line hint underneath: "drag, click, or use the arrow keys".

## Mobile
- Below 640px (`matchMedia('(min-width: 640px)')`), tighten the scatter:
  - x offsets clamp to ±90px (slot 1) and ±85px (slot 2); ±55px (slots 3 and 4)
  - y offsets: slot 1 `-15px`, slot 2 `20px`; slot 3 `35px`, slot 4 `25px`
  - rotations soften (slot 0: `1°`, slot 1: `6°`, slot 2: `-7°`, slot 3: `4°`, slot 4: `-4.5°`)
  - scales lift slightly so the back cards stay legible (slot 1: 0.92, slot 2: 0.91, slot 3: 0.88, slot 4: 0.87)
  - landscape width clamp(200px, 60vw, 260px), portrait width clamp(130px, 42vw, 180px)
- All 5 cards still render, the visual pile is the point.
- Touch drag works via Framer Motion (`dragElastic={0.6}` for comfortable resistance).
- Tap = focus; touch-and-drag past threshold = cycle. Drag detection uses pointer events (no `:hover` dependency).
- Dot tap target extended via padding to ≥ 24px even though dots render at 5px tall.

## Three-layer DOM (per card)
1. **Outer `motion.button`** — positioning-only frame. Owns slot transforms (`x`, `y`, `rotate`, `scale`), `zIndex`, click target, `onPointerDown`/`onClick`, `aria-label`, and drag handlers when focused. NO `background-color`, NO `ring`, NO `boxShadow`, NO padding, the outer node is invisible chrome. Sized by `w-[clamp(...)]` only; height is `auto` so the footprint matches the breathing layer exactly. `transformOrigin` defaults to center.
2. **Middle `motion.div`** — owns the **breathing loop** (`y` and `rotate` keyframes) AND the polaroid chrome: `backgroundColor: #FFFFFF` for the paper, `ring-1 ring-black/[0.08] dark:ring-white/[0.12]`, layered `boxShadow`, padding (`10px 10px 14px 10px` for portrait, `10px` for landscape), and a `dark:bg-[#F5F5F0]` paper-color overlay span. Fills the outer button (`w-full`, height auto from content). Because the breathing transform is applied here, the white frame, drop shadow, title strip (portrait), and image all move together as a single rigid unit. `transformOrigin` defaults to center. The breathing transition (`duration`, `ease: easeInOut`, `repeat: Infinity`) is independent of the outer slot spring, so slot transitions and idle breathing run on separate motion elements.
3. **Inner content** — portrait cards render in this order: title strip first (`padding: 14px 12px 8px 12px`, 2-line clamp, `min-height: 2.6em`), then image well below. Landscape cards render the image well only, no text. Image well is rounded `[10px]`, clipped, `aspect-[16/10]` for landscape and `aspect-[4/5]` for portrait, with the `<img>` as `absolute inset-0 w-full h-full object-cover`.

## Tech notes
- `'use client'`. `// npm install framer-motion`. Single default export `ScatterPile`.
- Single root `<div>` with `flex min-h-screen w-full items-center justify-center bg-[#E8E8DF] dark:bg-[#1A1A19] px-4`. No `min-h-screen` on any inner element.
- Slot-based pattern from `skills/card-stack-pattern.md`. `orderRef` kept in sync for stable callbacks. No `dismissing` guard needed, cycling is reversible by design (no card ever leaves the pile).
- `matchMedia` listener flips the mobile slot table. Cleaned up on unmount.
- All effects clean up (matchMedia, keydown).
- TypeScript strict, no `any`. Framer Motion for all motion.
- No `sand-*` / `olive-*` tokens inside the component. Raw hex values only.
- No em-dashes anywhere in user-visible copy (titles, hint).
- Photos sourced from Unsplash via `https://images.unsplash.com/<slug>?...&w=...&q=80`, pre-sized via Unsplash params (no Next.js Image).
