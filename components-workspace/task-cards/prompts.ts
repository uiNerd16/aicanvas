import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

Build a swipeable task/project card stack in React + Framer Motion (single file, 'use client').

Stack of 4 dark cards, each uniquely coloured:
- Card 1: bg #130D2B, accent #8B6CF6 (violet) — "Brand Overhaul" / Design / In Progress / Apr 18
- Card 2: bg #200A0A, accent #F07070 (coral)  — "Product Launch" / Marketing / In Review / Apr 25
- Card 3: bg #071B1B, accent #50C8C8 (cyan)   — "API Migration" / Engineering / Blocked / Apr 30
- Card 4: bg #1A1500, accent #D4A830 (gold)   — "Q2 Metrics" / Analytics / Planning / May 5

Card anatomy (260×320px, border-radius 20):
- 4px top accent bar
- Category label (Phosphor Tag icon, uppercase, 10px, accent colour)
- Card number (e.g. "01") right-aligned, muted
- Title (28px, weight 800, -0.03em letter-spacing)
- Description (~50 words)
- Status badge (5px dot + label, pill shape, accent bg at 10% opacity, accent border at 25% opacity)
- Due date (Phosphor Clock icon + text, muted, bottom right)

Slot system (index 0 = front):
SLOTS = [
  { x: 0, y: 0, rotate: 0, scale: 1, z: 4 },
  { x: 8, y: -10, rotate: 3, scale: 0.96, z: 3 },
  { x: 16, y: -20, rotate: 6, scale: 0.92, z: 2 },
  { x: 24, y: -30, rotate: 9, scale: 0.88, z: 1 },
]

Order state: order[slotIndex] = cardId. Cycling: setOrder(prev => [...prev.slice(1), prev[0]]).

Swipe interaction (front card only): drag="x", dragConstraints={{ left:0, right:0 }}, dragElastic=0.6. Dismiss when |offset.x|>80 or |velocity.x|>400. Exit animation: fly off-screen (±480px, y+100, rotate ±22°, scale 0.85, opacity 0, 420ms ease-in). Snap returning card with duration:0 + double-rAF guard. Spring: stiffness 280, damping 26.

Below the deck: arrow buttons (32px circles, muted border) + animated dot indicators (5px → 20px width for active dot, accent colour). Light mode: use lighter card backgrounds + same accent at reduced value.

## Typography
- Font: project default sans-serif
- Sizes: 10px, 12px, 20px
- Weights: 600, 700, 800`,

  'Lovable': `Build a swipeable task/project card stack in React + Framer Motion (single file, 'use client').

Stack of 4 dark cards, each uniquely coloured:
- Card 1: bg #130D2B, accent #8B6CF6 (violet) — "Brand Overhaul" / Design / In Progress / Apr 18
- Card 2: bg #200A0A, accent #F07070 (coral)  — "Product Launch" / Marketing / In Review / Apr 25
- Card 3: bg #071B1B, accent #50C8C8 (cyan)   — "API Migration" / Engineering / Blocked / Apr 30
- Card 4: bg #1A1500, accent #D4A830 (gold)   — "Q2 Metrics" / Analytics / Planning / May 5

Card anatomy (260×320px, border-radius 20):
- 4px top accent bar
- Category label (Phosphor Tag icon, uppercase, 10px, accent colour)
- Card number (e.g. "01") right-aligned, muted
- Title (28px, weight 800, -0.03em letter-spacing)
- Description (~50 words)
- Status badge (5px dot + label, pill shape, accent bg at 10% opacity, accent border at 25% opacity)
- Due date (Phosphor Clock icon + text, muted, bottom right)

Slot system (index 0 = front):
SLOTS = [
  { x: 0, y: 0, rotate: 0, scale: 1, z: 4 },
  { x: 8, y: -10, rotate: 3, scale: 0.96, z: 3 },
  { x: 16, y: -20, rotate: 6, scale: 0.92, z: 2 },
  { x: 24, y: -30, rotate: 9, scale: 0.88, z: 1 },
]

Order state: order[slotIndex] = cardId. Cycling: setOrder(prev => [...prev.slice(1), prev[0]]).

Swipe interaction (front card only): drag="x", dragConstraints={{ left:0, right:0 }}, dragElastic=0.6. Dismiss when |offset.x|>80 or |velocity.x|>400. Exit animation: fly off-screen (±480px, y+100, rotate ±22°, scale 0.85, opacity 0, 420ms ease-in). Snap returning card with duration:0 + double-rAF guard. Spring: stiffness 280, damping 26.

Below the deck: arrow buttons (32px circles, muted border) + animated dot indicators (5px → 20px width for active dot, accent colour). Light mode: use lighter card backgrounds + same accent at reduced value.

## Typography
- Font: project default sans-serif
- Sizes: 10px, 12px, 20px
- Weights: 600, 700, 800`,

  'V0': `Build a swipeable task/project card stack in React + Framer Motion (single file, 'use client').

Stack of 4 dark cards, each uniquely coloured:
- Card 1: bg #130D2B, accent #8B6CF6 (violet) — "Brand Overhaul" / Design / In Progress / Apr 18
- Card 2: bg #200A0A, accent #F07070 (coral)  — "Product Launch" / Marketing / In Review / Apr 25
- Card 3: bg #071B1B, accent #50C8C8 (cyan)   — "API Migration" / Engineering / Blocked / Apr 30
- Card 4: bg #1A1500, accent #D4A830 (gold)   — "Q2 Metrics" / Analytics / Planning / May 5

Card anatomy (260×320px, border-radius 20):
- 4px top accent bar
- Category label (Phosphor Tag icon, uppercase, 10px, accent colour)
- Card number (e.g. "01") right-aligned, muted
- Title (28px, weight 800, -0.03em letter-spacing)
- Description (~50 words)
- Status badge (5px dot + label, pill shape, accent bg at 10% opacity, accent border at 25% opacity)
- Due date (Phosphor Clock icon + text, muted, bottom right)

Slot system (index 0 = front):
SLOTS = [
  { x: 0, y: 0, rotate: 0, scale: 1, z: 4 },
  { x: 8, y: -10, rotate: 3, scale: 0.96, z: 3 },
  { x: 16, y: -20, rotate: 6, scale: 0.92, z: 2 },
  { x: 24, y: -30, rotate: 9, scale: 0.88, z: 1 },
]

Order state: order[slotIndex] = cardId. Cycling: setOrder(prev => [...prev.slice(1), prev[0]]).

Swipe interaction (front card only): drag="x", dragConstraints={{ left:0, right:0 }}, dragElastic=0.6. Dismiss when |offset.x|>80 or |velocity.x|>400. Exit animation: fly off-screen (±480px, y+100, rotate ±22°, scale 0.85, opacity 0, 420ms ease-in). Snap returning card with duration:0 + double-rAF guard. Spring: stiffness 280, damping 26.

Below the deck: arrow buttons (32px circles, muted border) + animated dot indicators (5px → 20px width for active dot, accent colour). Light mode: use lighter card backgrounds + same accent at reduced value.

## Typography
- Font: project default sans-serif
- Sizes: 10px, 12px, 20px
- Weights: 600, 700, 800`,
}
