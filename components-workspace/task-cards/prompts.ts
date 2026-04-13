import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Build a swipeable task/project card stack in React + Framer Motion (single file, 'use client').

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

Below the deck: arrow buttons (32px circles, muted border) + animated dot indicators (5px → 20px width for active dot, accent colour). Light mode: use lighter card backgrounds + same accent at reduced value.`,

  GPT: `React + Framer Motion swipeable project card stack. Single file, 'use client'.

CONSTANTS:
CARD_W=260, CARD_H=320
SLOTS=[
  {x:0,y:0,rotate:0,scale:1,z:4},        // front
  {x:8,y:-10,rotate:3,scale:0.96,z:3},
  {x:16,y:-20,rotate:6,scale:0.92,z:2},
  {x:24,y:-30,rotate:9,scale:0.88,z:1},  // back
]
SPRING={type:'spring',stiffness:280,damping:26}

TASKS array (4 items): {id, number:'01'–'04', title, category, status, due, description, accent, bg, bgLight, accentLight}
Values:
0: bg#130D2B accent#8B6CF6  bgLight#EFECFB accentLight#6B4EE6  "Brand Overhaul" Design "In Progress" "Apr 18"
1: bg#200A0A accent#F07070  bgLight#FBEDEC accentLight#D94D4D  "Product Launch" Marketing "In Review" "Apr 25"
2: bg#071B1B accent#50C8C8  bgLight#E8F8F8 accentLight#1A9C9C  "API Migration" Engineering "Blocked" "Apr 30"
3: bg#1A1500 accent#D4A830  bgLight#FBF5E0 accentLight#A07A10  "Q2 Metrics" Analytics "Planning" "May 5"

STATE: order[slotIndex]=cardId (useState([0,1,2,3])), exiting:{id,dir}|null, returning:Set<number>, dismissing:useRef(false), dragDelta:useRef(0)

DISMISS LOGIC (useCallback):
1. Guard dismissing.current
2. Set exiting state
3. setTimeout 420ms: setReturning(add frontId), setOrder(rotate left), setExiting(null)
4. Double rAF: remove from returning, unset dismissing

CARD (position:absolute, left/top:50%, marginLeft:-130, marginTop:-160):
- animate=isExiting?{x:±480,y:100,rotate:±22,scale:0.85,opacity:0}:{x:slot.x,y:slot.y,rotate:slot.rotate,scale:slot.scale,opacity:1}
- transition=isExiting?{duration:0.42,ease:[0.4,0,0.2,1]}:isReturning?{duration:0}:SPRING
- drag=isFront&&!dismissing.current?'x':false
- top 4px accent bar
- content: category (Phosphor Tag icon, 10px uppercase, accent), number (11px muted right), title (28px 800 -0.03em), description (13px 0.45 opacity), status badge (5px dot + label, accent at 18% bg + 40% border), due date (Phosphor Clock 12px)

BELOW DECK: ArrowLeft/ArrowRight buttons (32px circles) + dot indicators (motion.div, 5px→20px width, accent bg, spring 400/30). Theme detection via MutationObserver on document.documentElement and data-card-theme ancestor.`,

  Gemini: `Build a React component called TaskCards using Framer Motion. File must start with 'use client'.

Imports needed:
- useRef, useState, useCallback, useEffect from 'react'
- motion from 'framer-motion'
- Clock, Tag, ArrowLeft, ArrowRight from '@phosphor-icons/react'

Theme detection: use a useIsDark(ref) hook that sets up a MutationObserver watching document.documentElement for class changes. Check el.closest('[data-card-theme]') first, then fall back to document.documentElement. Default isDark=true.

Data: TASKS array with 4 items. Each has: id(0-3), number('01'-'04'), title, category, status, due, description, accent(dark hex), bg(dark hex), bgLight(light hex), accentLight(light hex).
Cards: Brand Overhaul/Design/In Progress/Apr18 (accent #8B6CF6), Product Launch/Marketing/In Review/Apr25 (accent #F07070), API Migration/Engineering/Blocked/Apr30 (accent #50C8C8), Q2 Metrics/Analytics/Planning/May5 (accent #D4A830).

CARD_W=260, CARD_H=320. Root className="flex h-full w-full flex-col items-center justify-center bg-sand-100 dark:bg-sand-950".

Card stack: position:absolute cards centered (left:50%, top:50%, marginLeft:-130, marginTop:-160). SLOTS array has 4 entries indexed 0(front)–3(back), each {x,y,rotate,scale,z}: front={0,0,0,1,4}, then offset by 8px X / 10px Y / 3deg rotation / 0.04 scale per slot back.

Order state: useState([0,1,2,3]). orderRef stays in sync via useEffect. dismiss() useCallback with dismissing guard ref. Exit: card flies to ±480px X, 100px Y, ±22deg rotate, scale 0.85, opacity 0, duration 0.42s. Returning card: transition duration:0. Double-rAF pattern to re-enable.

Each card: motion.div with drag="x" (front only), dragConstraints={{left:0,right:0}}, dragElastic=0.6. Threshold: |offset.x|>80 or |velocity.x|>400. Spring: stiffness:280, damping:26.

Card interior: 4px top accent bar, then padding 18px 20px. Category (Tag icon + uppercase label, accent colour), number (muted right-aligned). Title 28px/800/-0.03em. Description 13px muted. Status badge (dot + label in pill, accent bg 18%, accent border 40%). Due date (Clock icon + text, muted).

Below: ArrowLeft/ArrowRight buttons (32px circles with muted borders) + 4 dot indicators (motion.div animated width 5→20px for active, spring 400/30). Hint text below: "swipe to cycle".`,

  V0: `Create an interactive task card stack component where 4 project cards are stacked with a slight offset — each card peeks out behind the one in front with a small rotation and vertical shift.

The 4 cards each have a unique dark background and accent color:
- Violet: "Brand Overhaul" project with Design / In Progress / Apr 18
- Coral: "Product Launch" with Marketing / In Review / Apr 25
- Cyan: "API Migration" with Engineering / Blocked / Apr 30
- Gold: "Q2 Metrics" with Analytics / Planning / May 5

Each card has: a colored top accent bar (4px), a category tag with icon, a bold project title (~28px), a short description, a status pill (colored dot + label), and a due date with clock icon.

Users can swipe the front card left or right to send it to the back — the next card smoothly comes forward. There are also left/right arrow buttons below the deck. Below the arrows, show 4 animated dots where the active one stretches to 20px wide.

Cards should animate with spring physics when cycling. Use framer-motion for all motion.`,
}
