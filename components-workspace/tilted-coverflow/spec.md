# Tilted Coverflow

**Slug:** `tilted-coverflow`
**design-system:** `standalone`

## Description
A breathing 3D cover-flow fan that holds seven graffiti and street-art photos. Side cards tilt inward toward a focused center, every card drifts on its own slow loop, and the focused caption fades in word by word. Drag, click, or use the arrow keys to rotate any card to center.

## Visual
- 7 vertical cards (4:5 aspect) in a single horizontal fan. All cards share one base width (`clamp(160px, 17vw, 220px)`); visual size comes from a Framer Motion `scale` gradient by |offset|: `[1.00, 0.88, 0.76, 0.64]`.
- Side cards rotate on the Y-axis to face the focused center: `rotateY = -offset * ROTATION_PER_STEP` (14° per step, so ±42° at the outer edges).
- A constant 30px visible gap between adjacent cards (`GAP_PX`), computed by walking outward from center and accumulating `(scale_prev/2 + scale_curr/2) * baseWidth + GAP_PX` per step. Cards never overlap.
- Outer cards drop slightly along Y (`ARC_Y = 8 * |offset|`) for a subtle smile-down arc.
- Each card is rounded `[20px]`, clipped, with a 1px ring (`ring-1 ring-black/10 dark:ring-white/10`) and a soft drop shadow; the focused card carries a stronger shadow.
- Caption block sits flush to the bottom of every card: full-width, centered Manrope medium in white over a multi-stop black gradient (`linear-gradient(to top, rgba(0,0,0,0.78) 0%, 0.55 35%, 0.18 70%, 0 100%)`) covering the bottom two-thirds of the card. No border, no pill, no blur. Subtle text-shadow for legibility.
- Container: `bg-[#E8E8DF] dark:bg-[#1A1A19]` (sand-100 / sand-950 equivalents in raw hex per the standalone-no-tokens rule).
- Perspective: `1400px` on the row container; each card uses `transformStyle: preserve-3d`.

## Slides
Seven street-art / graffiti photos sourced from Unsplash:

| id | Caption | Photo |
|----|---|---|
| 0 | Alley Sentinel | photo-1550532422-378e93ec379c |
| 1 | Sticker Riot | photo-1700222720939-60f0e91d691d |
| 2 | Quiet Vandals | photo-1597355797858-35ffba85673c |
| 3 | Soft Beast | photo-1612486524816-d7aaa8ac7bd6 |
| 4 | City Gaze | photo-1644424428722-b6f950e4b22d |
| 5 | Loud Letters | photo-1581010105372-caf9ed5ab50f |
| 6 | Color Crash | photo-1589236095092-1f7ea6f09cdd |

## Behaviour
- **Circular wrap.** Every offset is normalised via `visibleOffset(cardIndex, focus, total)` into the range `-3..+3`, so 3 left + 1 center + 3 right are always visible regardless of focus position. Cards re-enter from the opposite edge as you step through.
- **Drag.** `drag="x"` with `dragConstraints={{ left: 0, right: 0 }}`. On release, snap by ±1 if `|offset| > 80px` or `|velocity| > 500`. One swipe = one card.
- **Click.** Click any non-focused card to make it the focus.
- **Keys.** Arrow keys ←/→ step focus by ±1, looping at both ends.
- **Entrance stagger.** On mount, every card animates from `{ opacity: 0, scale: 0.45, y: 70 }` to its fan position. Delay = `(HALF - |offset|) * 0.09s`, so outer cards land first and the focus card lands last. Mount uses a bouncier spring (`stiffness: 180, damping: 18`); after mount, the runtime spring (`stiffness: 240, damping: 30`) takes over.
- **Breathing.** Each card runs an idle loop on its inner visual layer: `y: [0, -12, 0, 10, 0]`, `rotate: [0, 1.5, 0, -1.5, 0]`, duration `7 + slide.id * 0.6` seconds, `repeat: Infinity`, `ease: easeInOut`. Out of phase per card so the fan looks alive.
- **Caption choreography.** When focus changes, the new focused card's caption renders word-by-word: each word is a `motion.span` keyed by `${focus}-${i}`, with `initial={{ opacity: 0, y: 8 }}` → `animate={{ opacity: 1, y: 0 }}`, `delay: i * 0.06s`, `duration: 0.42s`, ease `[0.2, 0.65, 0.3, 1]`. Non-focused cards render plain spans, no flicker.
- **Dot indicator + hint.** A row of 7 dots below the fan, active dot wider and brighter. One-line hint underneath: "drag, click, or use the arrow keys".

## Mobile
- Below 640px (`matchMedia('(min-width: 640px)')` flips `maxSide` from 3 to 1), only the focus card and one neighbour on each side render (3 visible total). All other cards are hidden (`opacity: 0` + no pointer events).
- Breathing and word-by-word caption animation still apply to the visible cards.

## Three-layer DOM (per card)
1. **Outer `motion.button`** — owns positioning + fan transforms (`x`, `y`, `rotateY`, `scale`), the click target, `aria-label`, `transformStyle: preserve-3d`. Sized by `w-[clamp(160px,17vw,220px)] aspect-[4/5]`. No visual chrome.
2. **Middle `motion.div`** — owns the visible card (`rounded-[20px] overflow-hidden ring boxShadow`) AND the breathing transforms (`y`, `rotate`). Fills the outer button (`h-full w-full`). Breathing moves the entire card unit so no parent background is ever exposed.
3. **Inner content** — image (`absolute inset-0 w-full h-full object-cover`), gradient overlay, and caption block. Inner content always fully fills the middle card, so the image is congruent with the card edges.

## Tech notes
- `'use client'`. `// npm install framer-motion`. Single default export `TiltedCoverflow`.
- Single root `<div>` with `flex min-h-screen w-full items-center justify-center bg-[#E8E8DF] dark:bg-[#1A1A19] px-4`. No `min-h-screen` on any inner element.
- `ResizeObserver` on the first card's untransformed bounding box measures the actual base width for `buildXPositions`. `matchMedia` listener flips the mobile threshold.
- All effects clean up (RAF, observers, listeners).
- TypeScript strict, no `any`. Framer Motion for all motion.
- No sand-* / olive-* tokens inside the component. Raw hex values only.
- No em-dashes anywhere.
