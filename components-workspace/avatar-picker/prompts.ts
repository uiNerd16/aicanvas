import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/avatar-picker/index.tsx\`. Export a named function \`AvatarPicker\`.

**Layout:** Full-container flex column, centered, gap-8. bg-sand-100 dark:bg-sand-950. Four sections top-to-bottom: uppercase label ("MEET THE CREW"), card stack, dots indicator, action row.

**Card stack:** 4 portrait cards (174×218px, radius 20) stacked with absolute positioning, all centered via \`left:50% top:50% marginLeft:-87 marginTop:-109\`. Slot layout (index = front→back):
  - 0: x:0, y:0, rotate:1.5°, scale:1, zIndex:4
  - 1: x:52, y:-8, rotate:8°, scale:0.92, zIndex:3
  - 2: x:-46, y:-4, rotate:-9°, scale:0.90, zIndex:2
  - 3: x:4, y:26, rotate:3.5°, scale:0.86, zIndex:1

**State:** \`order: number[]\` tracks which photo ID is at each slot. \`selectedId: number | null\`. \`exiting: { id, dir } | null\`. \`returning: Set<number>\` for instant (duration:0) snap-back.

**Drag to dismiss (front card only):** \`drag="x"\` with \`dragConstraints={{ left:0, right:0 }}\`, \`dragElastic:0.6\`. On release: if \`Math.abs(offset.x) > 80\` or \`Math.abs(velocity.x) > 400\`, trigger dismiss. Exit animation: x:±460, y:150, rotate:±22°, scale:0.85, opacity:0, duration:0.4, ease:[0.4,0,0.2,1]. After 420ms: move front to back (setOrder), snap-return with duration:0, then two RAFs to re-enable spring.

**Tap to select (front card only):** If drag delta < 8px on click, toggle selectedId. Show teal ring (\`border: 2.5px solid #2DD4BF\`) and checkmark badge (24px circle, bg #2DD4BF, Check icon size 13, color #0f2e2b).

**Spring config:** stiffness:280, damping:26.

**Dots:** Row of 4 dots. Active dot: width:20, opacity:1. Inactive: width:5, opacity:0.28. Height:5, radius:3. Spring stiffness:400, damping:30. bg-sand-900 dark:bg-white.

**Action row:** height:34. If selectedId !== null: teal pill button (\`bg:#2DD4BF, radius:20, padding:7px 18px\`) with checkmark + "[Name] Selected" text (color #0f2e2b, uppercase, 11px, weight 700). Clicking deselects. If null: "swipe to browse" hint text. Both animate in with opacity/y spring.

**Photos:** 4 Unsplash portrait URLs (w=400&h=500&fit=crop). Names: Capt. Vroom (Asteroid Hugger), Zork (Zero-G Chef), Dronk (Space Surfer), Gloop (Nebula Napper).

**Theme:** Detect via MutationObserver on \`document.documentElement.classList\`. Use \`useRef\` for order (stable in callbacks), \`useRef\` for dismissing guard (prevents double-dismiss).`,

  GPT: `Build a React component \`AvatarPicker\` in a single file using Framer Motion. Full spec:

LAYOUT: flex column, centered, h-full w-full, bg-sand-100 dark:bg-sand-950, gap:32px. Sections: label → card stack → dots → action row.

CARD STACK — 4 portrait cards, 174×218px, borderRadius:20, overflow:hidden, position:absolute, centered with negative margins.
Slot positions (slot 0 = front):
  slot 0: {x:0,   y:0,   rotate:1.5,  scale:1,    zIndex:4}
  slot 1: {x:52,  y:-8,  rotate:8,    scale:0.92, zIndex:3}
  slot 2: {x:-46, y:-4,  rotate:-9,   scale:0.90, zIndex:2}
  slot 3: {x:4,   y:26,  rotate:3.5,  scale:0.86, zIndex:1}

STATE:
- order: number[] — array of photo IDs, index = slot position
- selectedId: number | null
- exiting: {id: number, dir: 'left'|'right'} | null
- returning: Set<number> — IDs currently snapping back (transition duration:0)
- dismissing ref (boolean guard prevents double-trigger)
- orderRef — mirrors order for use in stable callbacks

DISMISS LOGIC:
1. Front card only gets drag="x", dragConstraints={left:0,right:0}, dragElastic:0.6
2. onDragEnd: if |offset.x|>80 OR |velocity.x|>400, call dismiss(dir)
3. dismiss(): set exiting state → after 420ms: move order[0] to end of array, add to returning set (instant transition), clear exiting → two requestAnimationFrames to remove from returning set and clear dismissing guard

EXIT ANIMATION: x:±460, y:150, rotate:±22, scale:0.85, opacity:0
Transition: {duration:0.4, ease:[0.4,0,0.2,1]}

NORMAL TRANSITION: spring {stiffness:280, damping:26}
RETURNING TRANSITION: {duration:0} — instant snap

TAP TO SELECT: onClick fires only if front card AND dragDelta ref < 8px. Toggles selectedId.

SELECTED CARD VISUAL:
- Teal border ring: position:absolute, inset:0, border:2.5px solid #2DD4BF, borderRadius:20, pointerEvents:none
- Checkmark badge: 24px circle, bg:#2DD4BF, bottom-right of name gradient, Check icon size:13 color:#0f2e2b
- Both: motion.div with initial={scale:0,opacity:0} animate={scale:1,opacity:1}

DOTS INDICATOR: 4 dots, spring stiffness:400 damping:30
Active: width:20, opacity:1. Inactive: width:5, opacity:0.28. height:5, borderRadius:3.

ACTION ROW: height:34, centered.
If selectedId !== null: AnimatePresence key="confirmed" → teal pill {bg:#2DD4BF, borderRadius:20, padding:"7px 18px"} + Check(13) + "[Name] Selected" uppercase 11px 700. Click deselects.
If null: AnimatePresence key="hint" → "swipe to browse" 11px muted text.

PHOTOS (4 Unsplash portrait crops w=400 h=500):
  Capt. Vroom — Asteroid Hugger
  Zork — Zero-G Chef
  Dronk — Space Surfer
  Gloop — Nebula Napper

THEME: MutationObserver on html classList for dark class. Use isDark state for labelColor (rgba(255,255,255,0.35) dark / #1a1a18 light).`,

  Gemini: `Create a React component called AvatarPicker. Use these exact imports:
\`\`\`
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from '@phosphor-icons/react'
\`\`\`
Add 'use client' as the very first line.

ROOT ELEMENT: \`<div className="relative flex h-full w-full select-none flex-col items-center justify-center gap-8 bg-sand-100 dark:bg-sand-950">\`

CONSTANTS:
\`\`\`
const CARD_W = 174
const CARD_H = 218
const RADIUS = 20
const SPRING = { type: 'spring', stiffness: 280, damping: 26 }
const SLOTS = [
  { x: 0,   y: 0,   rotate: 1.5,  scale: 1,    z: 4 },
  { x: 52,  y: -8,  rotate: 8,    scale: 0.92, z: 3 },
  { x: -46, y: -4,  rotate: -9,   scale: 0.90, z: 2 },
  { x: 4,   y: 26,  rotate: 3.5,  scale: 0.86, z: 1 },
]
\`\`\`

STATE HOOKS (use exactly these):
\`\`\`
const [order, setOrder] = useState<number[]>([0, 1, 2, 3])
const [selectedId, setSelectedId] = useState<number | null>(null)
const [exiting, setExiting] = useState<{ id: number; dir: 'left' | 'right' } | null>(null)
const [returning, setReturning] = useState<Set<number>>(new Set())
const orderRef = useRef(order)
const dismissing = useRef(false)
const dragDelta = useRef(0)
\`\`\`

THEME DETECTION: useEffect with MutationObserver watching document.documentElement classList for 'dark'. setIsDark(document.documentElement.classList.contains('dark')). Cleanup: obs.disconnect().

DISMISS (useCallback, stable):
1. Guard: if dismissing.current return
2. Set dismissing.current = true
3. Get frontId = orderRef.current[0], setExiting({id: frontId, dir})
4. setTimeout 420ms: add frontId to returning set, setOrder (slice(1) + [slice(0)[0]]), setExiting(null)
5. Two nested requestAnimationFrames: remove from returning, set dismissing.current = false

CARD MOTION PROPS for front card: drag="x", dragConstraints={{left:0,right:0}}, dragElastic={0.6}, onDragStart resets dragDelta.current=0, onDrag sets dragDelta.current=info.offset.x, onDragEnd: if |offset.x|>80 or |velocity.x|>400 call dismiss.

CARD TRANSITION: if isExiting → {duration:0.4, ease:[0.4,0,0.2,1]}. If isReturning → {duration:0}. Otherwise SPRING.

CARD TAP: onClick only if isFront and Math.abs(dragDelta.current) < 8. Toggle selectedId.

DOTS: map PHOTOS, animate width (20 if front, 5 otherwise) and opacity (1 if front, 0.28 otherwise). Spring stiffness:400 damping:30. className="bg-sand-900 dark:bg-white", height:5, borderRadius:3.

ACTION ROW: AnimatePresence mode="wait". If selectedId !== null render key="confirmed" motion.button (teal pill). Else render key="hint" motion.p with "swipe to browse".

PHOTOS array with 4 entries: id, name, role, url (Unsplash portrait crops).`,

  V0: `Create a swipeable portrait card stack for introducing a team. It's called "Meet the Crew."

There are 4 portrait photo cards stacked on top of each other, slightly fanned out with soft rotations — the front card is centered, the ones behind it peek out to the sides and back. The cards are 174×218px with rounded corners.

The front card is draggable left or right. Flick it far enough and it flies off screen with a rotation, then snaps back to the bottom of the stack. Tapping the front card (without dragging) selects that crew member — a teal ring appears around the card and a checkmark badge shows in the corner.

Below the cards are 4 dots indicating which card is at the front — the active dot is wider (pill shape).

At the bottom is a small action row. When no one is selected, it shows "swipe to browse" in muted text. When someone is selected, it shows a teal pill button with their name and a checkmark.

The whole thing sits on a dark background (bg-sand-950) and should also look great in light mode.

Use Next.js with Tailwind CSS and Framer Motion for all animations. Spring animations throughout — the card transitions back into the stack feel physical and bouncy. The dismiss animation is a smooth arc off-screen.

Photos: 4 Unsplash portrait crops. Crew names: Capt. Vroom (Asteroid Hugger), Zork (Zero-G Chef), Dronk (Space Surfer), Gloop (Nebula Napper). Teal accent color: #2DD4BF.`,
}
