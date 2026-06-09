# Product Card Deck

**Slug:** `product-card-deck`
**design-system:** `standalone`

## Description
A draggable stack of product cards you flick through one at a time. The top card
leans toward your drag, then spins away with momentum to reveal the next, and the
deck loops endlessly. Built for browsing a small catalogue like a deck of cards.

## Visual
- A straight stack of square-ish product cards. Slot 0 is the crisp top card;
  three cards peek behind it (y offset, scale-down, slight dim) for depth.
- Each card is two stacked containers inside one rounded `#D3DDEE` card: a picture
  on top, and a clean caption strip below holding the product name and a dark
  pill "Shop" button. One card (the mural) is image-only, with no caption.
- Heavier drop shadow on the top card.

## Behaviour
- Grab the top card and drag. It tilts toward the horizontal drag (drag-tilt,
  capped at about plus or minus 18 degrees).
- On release:
  - **Flick** (release speed > 500px/s OR dragged > 130px) -> the card sails off
    in the flick direction with momentum (normalized velocity * 1500), spinning
    and fading as it leaves. A slow-but-far drag falls back to the offset
    direction.
  - **Weak drag** -> springs back to the top slot.
- The deck then advances: the card behind rises into the top slot (same element,
  no hand-off) and a fresh card slides in at the back. Endless loop.
- The Shop pill has hover (scale up + lighten) and press (scale down + black)
  states; pressing it never starts a drag.

## Mobile
- Pointer/touch drag (mouse + touch). `touchAction: none` on the top card only so
  a flick does not scroll the page.
- Sized with `clamp()` (220-300px wide); holds from 320px up.

## Tech notes
- Framer Motion. Each card owns its own motion values (x, y, scale, opacity);
  `rotate = useTransform(x, ...)`. `AnimatePresence` + `usePresence` drive a manual
  fly-off exit. The deck advances via a `{ key, content }` array that drops the top
  and appends a new card at the back (content mod `CARDS.length`).
- `// npm install framer-motion`
