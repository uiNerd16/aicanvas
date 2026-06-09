# Card Flick

**Slug:** `card-flick`
**design-system:** `standalone`

## Description
A stack of cards where you flick the top one off. It spins and sails away with
momentum, revealing the next card beneath. The deck loops endlessly.

## Visual
- A centered stack rendered as a slightly-messy deck: the top card is crisp and
  straight; three cards peek behind it with small x/y offsets, scale-downs, and
  gentle rotations so you read the pile's depth.
- Each card is a full-bleed photo with a bottom gradient scrim, an uppercase
  eyebrow, and a short title. Images are swappable.
- The top card carries a heavier drop shadow.

## Behaviour
- Grab the top card and drag in any direction. On release:
  - **Hard flick** (release speed > ~500px/s OR dragged > ~130px) -> the card
    flies off in the flick direction with spin proportional to the horizontal
    throw, fading and shrinking as it leaves the stage.
  - **Weak drag** -> springs back onto the top of the deck.
- When a card flies off, the deck advances: the next card springs to the top,
  the rest move up one slot, and a new card enters at the back. Endless.
- A far-but-slow drag still flies in the drag direction (velocity falls back to
  the offset vector).

## Mobile
- Pointer/touch drag (mouse + touch), no hover dependency; `touchAction: none`
  on the top card so a flick does not scroll the page.
- Stack and cards sized with `clamp()` (220-300px wide); holds from 320px up.

## Tech notes
- Framer Motion `drag` on the top card; `onDragEnd` reads `info.velocity` /
  `info.offset`. `AnimatePresence` with a `custom` velocity drives the fly-off
  exit variant. A sliding window `[index, index + VISIBLE)` over the data array
  with modulo gives the endless loop.
- `// npm install framer-motion`
