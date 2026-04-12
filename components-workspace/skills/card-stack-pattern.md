# Card Stack Pattern

Use this skill when building any component where multiple cards are stacked on top of each other with depth, rotation, or offset — and the user can interact to cycle, fan, dismiss, or select cards.

**Trigger examples:** "card stack", "swipeable cards", "deck of cards", "stacked cards", "fan out cards", "avatar picker", "card carousel", "swipe to browse".

---

## Core concept

A card stack is a set of N cards where each card occupies a **slot**. A slot defines visual position (x, y, rotate, scale, z). State is an **order array** — `order[slotIndex] = cardId`. Cycling means rotating the array, not moving DOM elements.

This pattern has three verified exemplars in this project:
- `components-workspace/avatar-picker/index.tsx` — swipe L/R to cycle, tap to select (4 cards)
- `components-workspace/floating-cards/index.tsx` — drag down to cycle, count-up on reveal (3 cards)
- `components-workspace/polaroid-stack/index.tsx` — click to fan/stack, hover to lift (5 cards, two modes)

Read the relevant exemplar before building. Don't reinvent — adapt.

---

## 1. Slot layout

Define an array of slot descriptors. Index 0 = front (most prominent), last index = back (most hidden).

```ts
const SLOTS = [
  { x: 0,   y: 0,   rotate: 1.5,  scale: 1,    z: 4 }, // front
  { x: 52,  y: -8,  rotate: 8,    scale: 0.92, z: 3 },
  { x: -46, y: -4,  rotate: -9,   scale: 0.90, z: 2 },
  { x: 4,   y: 26,  rotate: 3.5,  scale: 0.86, z: 1 }, // back
]
```

Tune values to fit the component's aesthetic:
- **Tight stack** (Travel Deck): small x/y offsets (±12px), slight rotations (±6°)
- **Loose fan** (Polaroid Stack): large x spread (±160px), large rotations (±22°)
- **Browsing stack** (Meet the Crew): medium offsets, visible peek of cards behind

All cards render at `position: absolute`, centered via `left: 50%; top: 50%; marginLeft: -CARD_W/2; marginTop: -CARD_H/2`. The slot offsets are applied via Framer Motion `animate={{ x, y, rotate, scale }}`.

---

## 2. Order state

```ts
// order[slotIndex] = cardId — index 0 is always the front slot
const [order, setOrder] = useState<number[]>([0, 1, 2, 3])
```

To find which slot a card occupies: `const slotIndex = order.indexOf(cardId)`.

To cycle the front card to the back: `setOrder(prev => [...prev.slice(1), prev[0]])`.

**Always keep a ref in sync** for use inside stable callbacks:
```ts
const orderRef = useRef(order)
useEffect(() => { orderRef.current = order }, [order])
```

---

## 3. Swipe-to-dismiss (drag cycling)

Used in: Meet the Crew, Travel Deck.

```ts
const SPRING = { type: 'spring' as const, stiffness: 280, damping: 26 }

// Dismissing guard — prevents double-trigger
const dismissing = useRef(false)
const dragDelta = useRef(0)

const dismiss = useCallback((dir: 'left' | 'right') => {
  if (dismissing.current) return
  dismissing.current = true

  const frontId = orderRef.current[0]
  setExiting({ id: frontId, dir })

  setTimeout(() => {
    // Snap card to back with instant transition
    setReturning(prev => new Set([...prev, frontId]))
    setOrder(prev => [...prev.slice(1), prev[0]])
    setExiting(null)

    // Two RAFs: first lets the snap render, second re-enables spring
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setReturning(prev => {
        const s = new Set(prev)
        s.delete(frontId)
        return s
      })
      dismissing.current = false
    }))
  }, 420) // match exit animation duration
}, [])
```

**Drag thresholds** — trigger dismiss when:
- `Math.abs(info.offset.x) > 80` — dragged far enough
- `Math.abs(info.velocity.x) > 400` — flicked fast enough

**Exit animation:**
```ts
// isExiting card
animate={{ x: dir === 'left' ? -460 : 460, y: 150, rotate: dir === 'left' ? -22 : 22, scale: 0.85, opacity: 0 }}
transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}

// isReturning card (snap back to back slot instantly)
transition={{ duration: 0 }}

// All other cards
transition={SPRING}
```

**Only the front card** gets `drag="x"`. Non-front cards: `drag={false}`.

---

## 4. Click-to-fan (two-mode stacks)

Used in: Polaroid Stack.

```ts
const [fanned, setFanned] = useState(false)
const toggle = () => setFanned(f => !f)

// Two slot arrays — stacked and fanned
const pos = fanned ? FANNED[i] : STACKED[i]
```

No order cycling needed — all cards stay in their positions. The `fanned` flag swaps between two SLOTS arrays and Framer Motion springs between them automatically.

---

## 5. Card anatomy

Every card in the stack:

```tsx
<motion.div
  key={card.id}
  style={{
    position: 'absolute',
    left: '50%', top: '50%',
    width: CARD_W, height: CARD_H,
    marginLeft: -CARD_W / 2, marginTop: -CARD_H / 2,
    zIndex: isExiting ? 10 : slot.z,
    borderRadius: RADIUS,
    overflow: 'hidden',
    cursor: isFront ? 'grab' : 'default',
  }}
  animate={isExiting ? exitTarget : { x: slot.x, y: slot.y, rotate: slot.rotate, scale: slot.scale, opacity: 1 }}
  transition={isExiting ? exitTransition : isReturning ? { duration: 0 } : SPRING}
  drag={isFront ? 'x' : false}
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.6}
  onDragStart={() => { dragDelta.current = 0 }}
  onDrag={(_, info) => { dragDelta.current = info.offset.x }}
  onDragEnd={(_, info) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
      dismiss(info.offset.x < 0 ? 'left' : 'right')
    }
  }}
  onClick={() => {
    if (isFront && Math.abs(dragDelta.current) < 8) handleSelect()
  }}
>
```

**dragDelta ref** separates taps from drags — a click only fires if the card barely moved (`< 8px`).

---

## 6. Visual feedback

### Dot indicator
```tsx
{cards.map(card => {
  const isCurrent = order[0] === card.id
  return (
    <motion.div
      key={card.id}
      className="bg-sand-900 dark:bg-white"
      animate={{ width: isCurrent ? 20 : 5, opacity: isCurrent ? 1 : 0.28 }}
      style={{ height: 5, borderRadius: 3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    />
  )
})}
```

### Action row
Show a hint label when idle, a confirmation button when something is selected. Use `AnimatePresence` with different `key` values so they cross-fade:
```tsx
<AnimatePresence mode="wait">
  {selectedId !== null
    ? <motion.button key="confirmed" ...>✓ {name} Selected</motion.button>
    : <motion.p key="hint" ...>swipe to browse</motion.p>
  }
</AnimatePresence>
```

---

## 7. Mobile requirements

Card stacks are inherently touch-friendly — Framer Motion's drag works on touch. Verify:

- `dragElastic={0.6}` gives enough resistance for both mouse and touch
- Tap-to-select (`onClick`) fires on mobile — no hover-only states on the front card
- Card dimensions use constants, not viewport units — make sure CARD_W fits within 300px containers (keep cards under 200px wide for narrow screens, or clamp with `Math.min(CARD_W, containerWidth * 0.6)`)
- Bottom feedback row (dots, action row) must have adequate tap target size (min 44px touch area for buttons)

---

## 8. Spring constants reference

| Feel | stiffness | damping | Use for |
|---|---|---|---|
| Snappy, responsive | 280 | 26 | Card cycling (Meet the Crew) |
| Quick dot indicator | 400 | 30 | Progress dots |
| Gentle arc fan | 200 | 22 | Polaroid fan-out |
| Soft lift on hover | 300 | 24 | Card lift on hover |

---

## 9. Common mistakes

- **Double-dismiss bug** — always use a `dismissing` ref guard. Without it, fast swipes trigger two cycles.
- **Stale order in callbacks** — always read `orderRef.current`, never `order` directly inside `useCallback`.
- **Forgetting `duration: 0` on snap-back** — without instant transition, the returned card visibly slides from off-screen to the back. The two-RAF pattern ensures the snap happens in the same paint cycle as the state update.
- **`drag` on non-front cards** — only the front card should be draggable. Set `drag={false}` on all others or they'll intercept pointer events.
- **Fixed card dimensions too large** — cards defined at 280px wide break on 320px screens. Keep CARD_W ≤ 200px or derive from container width.
