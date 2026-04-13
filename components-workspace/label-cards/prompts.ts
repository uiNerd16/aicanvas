import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Build a "Label Cards" component in React + Framer Motion ('use client', single file).

Five 16:9 label cards (base 300×169px) scattered at random angles across the canvas. Each card has a bold solid-colour background. Tap any card to spring it to centre; tap again to release. All cards stay fully visible at all times — no fading.

**Card data (5 entries):**
| title | sub1 | sub2 | since | bg | fg |
|---|---|---|---|---|---|
| Mobile Apps | Native iOS & Android | Interaction Design | 2023 | #5CAD60 | #162217 |
| Web Design | React & Next.js | Frontend Systems | 2021 | #EDD540 | #241F05 |
| Branding | Visual Identity | Brand Strategy | 2020 | #1C2E8A | #E8EDF8 |
| Editorial | Magazine & Print | Typography Systems | 2022 | #D43C3C | #FAE8E8 |
| Motion | Animation & Micro-UX | Interaction Patterns | 2023 | #E08030 | #2A1A06 |

Idle scatter positions (applied as Framer Motion x/y):
Cards 0–4: {x:-82,y:-70,r:-11}, {x:-48,y:66,r:9}, {x:12,y:-14,r:-4}, {x:68,y:62,r:14}, {x:84,y:-86,r:18}

**Card anatomy (top→bottom, 16:9 ratio):**
- Title row: ✳ glyph (weight 900) + bold title left; "Since YYYY" uppercase right (both in \`fg\` colour)
- 1px divider (fg, 22% opacity)
- Body: sub1 (weight 600) stacked above sub2 (weight 400, 60% opacity)
- Bottom bar: barcode left + logo mark right

**Barcode:** 28 thin vertical \`div\` bars, widths from pattern \`[1,2,1,1,3,1,2,1,1,3,1,1,2,1,2,1,3,1,1,2,1,3,1,2,1,1,2,1]\` × 1.5px each, 80% opacity, 1.2px gap.

**Logo mark:** 28px circle (fg border 1.5px) with "AI" text inside; "CANVAS" label below at 6.5px.

**Mobile-responsive scaling:**
Use ResizeObserver to measure container width. Derive:
\`\`\`ts
const cardW = Math.min(300, Math.floor(containerW / 1.56))
const cardH = Math.round(cardW * 9 / 16)
const scale = cardW / 300
\`\`\`
Multiply ALL px values (font sizes, padding, gap, border widths, scatter offsets) by \`scale\`.

**Animation:**
- Idle → selected: spring { stiffness: 340, damping: 28 }, animate to x:0, y:0, rotate:0, scale:1.05, zIndex:10
- Selected → idle: spring { stiffness: 240, damping: 24 }
- No hover effects — cards only respond to click/tap
- Hint text "tap a card to focus" fades out (opacity 0) when any card is selected

Container: \`className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-100 dark:bg-sand-950"\` with a subtle 28px dot-grid background pattern.`,

  GPT: `React + Framer Motion label card scatter. Single file, 'use client'.

CONSTANTS:
BASE_CARD_W=300, BASE_CARD_H=169
BAR_PATTERN=[1,2,1,1,3,1,2,1,1,3,1,1,2,1,2,1,3,1,1,2,1,3,1,2,1,1,2,1]
SPRING_SCATTER={type:'spring',stiffness:240,damping:24}
SPRING_FOCUS={type:'spring',stiffness:340,damping:28}

CARDS (id, title, sub1, sub2, since, bg, fg, idle:{x,y,rotate}):
0: 'Mobile Apps','Native iOS & Android','Interaction Design','2023','#5CAD60','#162217',{x:-82,y:-70,rotate:-11}
1: 'Web Design','React & Next.js','Frontend Systems','2021','#EDD540','#241F05',{x:-48,y:66,rotate:9}
2: 'Branding','Visual Identity','Brand Strategy','2020','#1C2E8A','#E8EDF8',{x:12,y:-14,rotate:-4}
3: 'Editorial','Magazine & Print','Typography Systems','2022','#D43C3C','#FAE8E8',{x:68,y:62,rotate:14}
4: 'Motion','Animation & Micro-UX','Interaction Patterns','2023','#E08030','#2A1A06',{x:84,y:-86,rotate:18}

STATE: selected:number|null, containerW:number (default 480)

RESPONSIVE SCALING (ResizeObserver on containerRef):
  cardW = Math.min(300, Math.floor(containerW / 1.56))
  cardH = Math.round(cardW * 9/16)
  scale = cardW / 300
All px values (fontSize, padding, gap, borderWidth, barcode widths, scatter x/y) multiply by scale.

CARD (motion.div, position:absolute):
  style: width=cardW, height=cardH, borderRadius=10*scale, background=card.bg, boxShadow='0 10px 36px rgba(0,0,0,0.32)'
  animate idle:   {x:idle.x*scale, y:idle.y*scale, rotate:idle.rotate, scale:1, zIndex:2, opacity:1}
  animate selected: {x:0, y:0, rotate:0, scale:1.05, zIndex:10, opacity:1}
  No whileHover — click/tap only
  onClick: toggle selected

CARD INTERIOR (padding: 12s 14s 11s, flex column, full height, box-sizing:border-box):
  Row 1: flex justify-between align-center, mb=9s
    Left: ✳ (16s/900/fg/op0.9) + title (18s/800/fg/-0.025em)
    Right: "Since YYYY" (9s/600/fg/op0.5/0.08em tracking/uppercase)
  Divider: 1px/fg/op0.22, mb=9s
  Body: flex-1, flex-col, justify-between
    Subtitles: sub1 (11.5s/600/fg/1.35lh) + sub2 (11s/400/fg/op0.6/mt=3s)
    Bottom row: justify-between align-end
      Barcode: flex row, height=28s, gap=1.2s, bars from BAR_PATTERN × 1.5s width, bg=fg, op0.8
      LogoMark: col, gap=3s, circle (28s/1.5s border/fg/op0.85) with "AI" (7.5s/800), "CANVAS" below (6.5s/700/0.12em/uppercase/op0.7)

where 's' = value * scale

HINT: motion.p, position:absolute bottom:20, fontSize:11, animate opacity:0 when selected≠null (duration:0.3)
ROOT: className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-100 dark:bg-sand-950"
Dot-grid bg: radial-gradient 1px dots, 28px grid, opacity 0.04 dark / 0.05 light.
Theme detection via MutationObserver on document.documentElement + data-card-theme ancestor.`,

  Gemini: `Build a React component called LabelCards. Start with 'use client'. Single file.

Required imports:
- useRef, useState, useEffect from 'react'
- motion from 'framer-motion'

No icon library needed.

FIVE cards, each a wide 16:9 label card scattered at a different angle. Data:
const CARDS = [
  {id:0, title:'Mobile Apps',  sub1:'Native iOS & Android',  sub2:'Interaction Design',   since:'2023', bg:'#5CAD60', fg:'#162217', idle:{x:-82,y:-70,rotate:-11}},
  {id:1, title:'Web Design',   sub1:'React & Next.js',       sub2:'Frontend Systems',     since:'2021', bg:'#EDD540', fg:'#241F05', idle:{x:-48,y:66, rotate:9}},
  {id:2, title:'Branding',     sub1:'Visual Identity',       sub2:'Brand Strategy',       since:'2020', bg:'#1C2E8A', fg:'#E8EDF8', idle:{x:12, y:-14,rotate:-4}},
  {id:3, title:'Editorial',    sub1:'Magazine & Print',      sub2:'Typography Systems',   since:'2022', bg:'#D43C3C', fg:'#FAE8E8', idle:{x:68, y:62, rotate:14}},
  {id:4, title:'Motion',       sub1:'Animation & Micro-UX', sub2:'Interaction Patterns', since:'2023', bg:'#E08030', fg:'#2A1A06', idle:{x:84, y:-86,rotate:18}},
]

RESPONSIVE SIZING: Use a ResizeObserver (inside a single useEffect that also does theme detection) to measure the container element. Update a containerW state (default 480). Then compute:
  cardW = Math.min(300, Math.floor(containerW / 1.56))
  cardH = Math.round(cardW * 9 / 16)
  scale = cardW / 300

All sizes below are BASE values — multiply each by scale before using.

CARD LAYOUT (each motion.div, position:absolute, width=cardW, height=cardH):
1. Title row (flex, justify-between, align-center, mb=9):
   Left: ✳ character (fontSize=16, weight=900, opacity=0.9) + space + title (fontSize=18, weight=800, letterSpacing=-0.025em)
   Right: "Since " + since (fontSize=9, weight=600, opacity=0.5, letterSpacing=0.08em, uppercase)
2. Horizontal rule: height=1, background=fg, opacity=0.22, mb=9
3. Body section (flex:1, flex-col, justify-between):
   Top: sub1 paragraph (fontSize=11.5, weight=600) then sub2 paragraph (fontSize=11, weight=400, opacity=0.6, mt=3)
   Bottom row (justify-between, align-end):
     Barcode: div row, height=28, gap=1.2. Map array [1,2,1,1,3,1,2,1,1,3,1,1,2,1,2,1,3,1,1,2,1,3,1,2,1,1,2,1] → each item is a div of width=item*1.5, background=fg, opacity=0.8
     Logo mark: column, gap=3. Circle div (width=28, height=28, borderRadius=50%, border=1.5px solid fg, opacity=0.85, flex-center) containing "AI" span (fontSize=7.5, weight=800). Below: "CANVAS" span (fontSize=6.5, weight=700, letterSpacing=0.12em, uppercase, opacity=0.7)

INTERACTIONS:
- useState selected (number|null). Click any card → toggle (null if already selected).
- Idle animate: {x:idle.x*scale, y:idle.y*scale, rotate:idle.rotate, scale:1, zIndex:2, opacity:1}, spring {stiffness:240,damping:24}
- Selected animate: {x:0, y:0, rotate:0, scale:1.05, zIndex:10, opacity:1}, spring {stiffness:340,damping:28}
- No hover effects — click/tap only

ROOT div: className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-100 dark:bg-sand-950"
Dot grid bg div (position:absolute, inset:0): backgroundImage radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px), backgroundSize 28px 28px (swap to rgba(0,0,0,0.05) in light mode).
Hint text (motion.p, position:absolute, bottom:20, fontSize:11, letterSpacing:0.05em): "tap a card to focus", animate opacity:0 when selected !== null.`,

  V0: `Create a component called Label Cards: five colourful 16:9 label cards scattered across a dark canvas at different angles, like physical stickers dropped on a table.

Each card has a bold solid background — green, yellow, navy, red, and orange. The text on each card is a dark or light colour chosen to contrast with its background.

Card layout (landscape, roughly 300×169px):
- Top row: a ✳ asterisk symbol + bold category title on the left; "Since YYYY" small uppercase label on the right
- A thin horizontal divider line
- Two lines of smaller text: a bold line and a lighter descriptive line below it
- Bottom: a barcode graphic (rows of thin vertical bars of varying widths) on the left; a small circle logo mark with "AI / CANVAS" text on the right

The five cards are:
1. Green — Mobile Apps / Native iOS & Android / Interaction Design / Since 2023
2. Yellow — Web Design / React & Next.js / Frontend Systems / Since 2021
3. Navy — Branding / Visual Identity / Brand Strategy / Since 2020
4. Red — Editorial / Magazine & Print / Typography Systems / Since 2022
5. Orange — Motion / Animation & Micro-UX / Interaction Patterns / Since 2023

Interaction: tap any card to spring it to the centre of the canvas — it straightens and scales up slightly. The other four cards stay exactly where they are at full opacity. Tap the focused card again to return it to its scattered position. There are no hover effects — cards only respond to tap/click. Show a faint "tap a card to focus" hint at the bottom that disappears when a card is active.

The component must be fully responsive: on narrow screens the cards should scale down proportionally so nothing overflows.

Use framer-motion spring animations throughout. Background: subtle dot grid pattern.`,
}
