import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/slide-deck/index.tsx\`. Export a named function \`SlideDeck\`. Single file, \`'use client'\`, no \`any\`.

A swipeable editorial card deck — 4 cards always mounted in a layered stack. The top 3 are visible (y-offset + scale gives depth). Swiping forward flies the top card out left and reveals the one behind it. Swiping backward slides the new card in from the right, on top.

## Slides
\`\`\`ts
const SLIDES = [
  { id:0, num:'01', label:'Opportunity', title:'Define the\\nProblem Space',
    accent:'#E55A2B', bg:'#111111', textPrimary:'#FFFFFF', textMuted:'rgba(255,255,255,0.35)', shape:'circle' },
  { id:1, num:'02', label:'Strategy',    title:'Discover\\nDirection',
    accent:'#E55A2B', bg:'#F0EDEA', textPrimary:'#111111', textMuted:'rgba(0,0,0,0.35)',       shape:'square' },
  { id:2, num:'03', label:'Execution',   title:'Design &\\nDeliver',
    accent:'#111111', bg:'#E55A2B', textPrimary:'#FFFFFF', textMuted:'rgba(255,255,255,0.5)',  shape:'line'   },
  { id:3, num:'04', label:'Metrics',     title:'Measure\\nImpact',
    accent:'#E55A2B', bg:'#2A2A2A', textPrimary:'#F0EDEA', textMuted:'rgba(240,237,234,0.4)', shape:'triangle' },
]
\`\`\`

## Stack model
CARD_W=260, CARD_H=300, border-radius 20.
\`\`\`ts
const STACK = [
  { x:0, y:0,  scale:1.000, opacity:1 },   // front
  { x:0, y:11, scale:0.962, opacity:1 },   // second
  { x:0, y:20, scale:0.926, opacity:1 },   // third
]
const OFFSCREEN = { x:0, y:30, scale:0.88, opacity:0 }
\`\`\`
offset = (slide.id - current + 4) % 4. Cards at offset 0/1/2 use STACK; offset 3 uses OFFSCREEN.

## Navigation state
- \`exitInfo: { slideId, xTarget } | null\` — forward only: departed card flies to xTarget (-380)
- \`enterFromRight: number | null\` — backward only: entering card's id

Forward (dir=1): set exitInfo (xTarget:-380). The card at offset 3 (SLIDES.length-1) with matching slideId is isExiting=true → animTarget {x:-380,y:0,scale:0.88,opacity:0}, zIndex 15.

Backward (dir=-1): set enterFromRight to newIdx's slideId. The card becoming offset 0 gets key \`\${id}-right\` and initial \`{x:380,opacity:0,scale:0.88,y:0}\` so Framer Motion starts it off-screen right. Give it zIndex 20 (highest). No exitInfo — the old front card just springs back to STACK[1].

Clear both with onAnimationComplete using functional setState.

## Per-card render
\`\`\`ts
const isExiting = exitInfo?.slideId === slide.id && offset === SLIDES.length - 1
const isEnteringFromRight = enterFromRight === slide.id && offset === 0

const animTarget = isExiting
  ? { x: exitInfo!.xTarget, y: 0, scale: 0.88, opacity: 0 }
  : offset <= 2 ? STACK[offset] : OFFSCREEN

const zIndex = isEnteringFromRight ? 20 : isExiting ? 15
  : offset === 0 ? 10 : offset === 1 ? 6 : offset === 2 ? 2 : 0
\`\`\`
Spring: stiffness 300, damping 28. Drag x-axis on offset-0 card only, dragElastic 0.5, dismiss at |offset.x|>60 or |velocity|>400.

## Card content layout
Padding 24px 28px 28px, flex column, space-between.
- Top row: label (10px, 700, 0.12em tracking, uppercase, textMuted) — slide counter "XX / 04" (11px, 700, textMuted)
- Bottom: big slide number (88px, 900, lineHeight 0.85, -0.05em tracking, accent colour) then title (26px, 800, lineHeight 1.15, -0.03em, pre-line, textPrimary)

## Geometric decorations (ShapeDecor component)
- circle: div, 128×128, border-radius 50%, border 2px solid accent, opacity 0.15, position right:-32 top:-32
- square: div, 60×60, border 2px solid accent, rotate 15deg, opacity 0.25, right:20 top:30
- line: two vertical divs (w:2 opacity:0.1 right:28, w:1 opacity:0.06 right:38), full height, bg primary
- triangle: SVG 126×112, viewBox "0 0 180 160", polygon points "90,12 172,148 8,148", stroke primary sw:2 strokeLinejoin round, opacity 0.2, right:-24 top:-18

## Navigation
Dot indicators only (no arrows). motion.button per slide: height 6, animate width 6→24 (active), bg #E55A2B active / rgba(255,255,255,0.18) or rgba(0,0,0,0.15) inactive, spring stiffness 400 damping 30.

## Theme detection
isDark via MutationObserver on document.documentElement class. Affects: dot inactive colour, card box-shadow.
Container: \`className="flex h-full w-full flex-col items-center justify-center bg-sand-100 dark:bg-sand-950"\`.`,

  GPT: `React + Framer Motion editorial slide deck. Single file, 'use client'. TypeScript strict, no any.

## Data
\`\`\`ts
const SLIDES = [
  {id:0,num:'01',label:'Opportunity',title:'Define the\\nProblem Space',accent:'#E55A2B',bg:'#111111',textPrimary:'#FFFFFF',textMuted:'rgba(255,255,255,0.35)',shape:'circle'},
  {id:1,num:'02',label:'Strategy',title:'Discover\\nDirection',accent:'#E55A2B',bg:'#F0EDEA',textPrimary:'#111111',textMuted:'rgba(0,0,0,0.35)',shape:'square'},
  {id:2,num:'03',label:'Execution',title:'Design &\\nDeliver',accent:'#111111',bg:'#E55A2B',textPrimary:'#FFFFFF',textMuted:'rgba(255,255,255,0.5)',shape:'line'},
  {id:3,num:'04',label:'Metrics',title:'Measure\\nImpact',accent:'#E55A2B',bg:'#2A2A2A',textPrimary:'#F0EDEA',textMuted:'rgba(240,237,234,0.4)',shape:'triangle'},
]
const CARD_W=260, CARD_H=300
const STACK=[{x:0,y:0,scale:1,opacity:1},{x:0,y:11,scale:0.962,opacity:1},{x:0,y:20,scale:0.926,opacity:1}]
const OFFSCREEN={x:0,y:30,scale:0.88,opacity:0}
\`\`\`

## State
current(0), direction(1|-1), exitInfo:{slideId,xTarget}|null, enterFromRight:number|null

## goTo(newIdx, dir)
dir>0: setExitInfo({slideId:SLIDES[current].id, xTarget:-380}), setEnterFromRight(null)
dir<0: setExitInfo(null), setEnterFromRight(SLIDES[newIdx].id)
setDirection(dir), setCurrent(newIdx)

## Per-card animation
offset=(slide.id-current+4)%4
isExiting = exitInfo?.slideId===slide.id && offset===3
isEnteringFromRight = enterFromRight===slide.id && offset===0
animTarget = isExiting ? {x:exitInfo.xTarget,y:0,scale:0.88,opacity:0} : offset<=2 ? STACK[offset] : OFFSCREEN
zIndex = isEnteringFromRight?20 : isExiting?15 : offset===0?10 : offset===1?6 : offset===2?2 : 0

key: isEnteringFromRight ? \`\${slide.id}-right\` : slide.id
initial: isEnteringFromRight ? {x:380,opacity:0,scale:0.88,y:0} : false
transition: {type:'spring',stiffness:300,damping:28}
onAnimationComplete: clear exitInfo/enterFromRight via functional setState if slideId matches

## Drag (offset===0 only)
drag='x', dragElastic=0.5, dragConstraints={left:0,right:0}
onDragEnd: offset.x<-60||velocity.x<-400 → navigate(1); offset.x>60||velocity.x>400 → navigate(-1)

## Card layout
padding:'24px 28px 28px', flexDirection:'column', justifyContent:'space-between'
Top: label(10px,700,0.12em tracking,uppercase,textMuted) + counter "XX / 04"(11px,700,textMuted)
Bottom: num(88px,900,lh:0.85,-0.05em,accent) stacked above title(26px,800,lh:1.15,-0.03em,pre-line,textPrimary)

## ShapeDecor
circle: div 128×128, borderRadius:50%, border:2px solid accent, opacity:0.15, right:-32 top:-32
square: div 60×60, border:2px solid accent, transform:rotate(15deg), opacity:0.25, right:20 top:30
line: two absolute divs full-height bg primary (w:2 opacity:0.1 right:28), (w:1 opacity:0.06 right:38)
triangle: <svg width=126 height=112 viewBox="0 0 180 160" fill="none" right:-24 top:-18 opacity:0.2>
  <polygon points="90,12 172,148 8,148" stroke={primary} strokeWidth=2 strokeLinejoin="round"/>

## Navigation
Dot row only (no arrows). marginTop:32. motion.button×4: height:6, animate.width 6→24(active), bg #E55A2B active, rgba inactive. Spring stiffness:400 damping:30.

## isDark
MutationObserver on document.documentElement watching 'class'. Affects dot bg + card boxShadow.`,

  Gemini: `Implement a React client component named SlideDeck as a single TypeScript file. Complete the full implementation in one response. Do not truncate.

## Required imports — use exactly these, no substitutions
'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

DO NOT use AnimatePresence. DO NOT use useMotionValue. DO NOT add any imports not listed above.

## Concept
Four editorial presentation cards in a persistent layered stack. All 4 cards are always mounted. The top 3 are visible through y-offset and scale. Swiping forward: the front card flies out to x:-380. Swiping backward: the new card slides in from x:380 on top of the existing stack (highest z-index). Dot indicators below.

## Types
\`\`\`ts
interface Slide { id:number; num:string; label:string; title:string; accent:string; bg:string; textPrimary:string; textMuted:string; shape:string }
interface StackPos { x:number; y:number; scale:number; opacity:number }
\`\`\`

## Constants
\`\`\`ts
const SLIDES: Slide[] = [
  {id:0,num:'01',label:'Opportunity',title:'Define the\\nProblem Space',accent:'#E55A2B',bg:'#111111',textPrimary:'#FFFFFF',textMuted:'rgba(255,255,255,0.35)',shape:'circle'},
  {id:1,num:'02',label:'Strategy',title:'Discover\\nDirection',accent:'#E55A2B',bg:'#F0EDEA',textPrimary:'#111111',textMuted:'rgba(0,0,0,0.35)',shape:'square'},
  {id:2,num:'03',label:'Execution',title:'Design &\\nDeliver',accent:'#111111',bg:'#E55A2B',textPrimary:'#FFFFFF',textMuted:'rgba(255,255,255,0.5)',shape:'line'},
  {id:3,num:'04',label:'Metrics',title:'Measure\\nImpact',accent:'#E55A2B',bg:'#2A2A2A',textPrimary:'#F0EDEA',textMuted:'rgba(240,237,234,0.4)',shape:'triangle'},
]
const CARD_W = 260
const CARD_H = 300
const STACK: StackPos[] = [
  {x:0, y:0,  scale:1.000, opacity:1},
  {x:0, y:11, scale:0.962, opacity:1},
  {x:0, y:20, scale:0.926, opacity:1},
]
const OFFSCREEN: StackPos = {x:0, y:30, scale:0.88, opacity:0}
\`\`\`

## State
current=0, direction:1|-1=1, exitInfo:{slideId:number;xTarget:number}|null=null, enterFromRight:number|null=null, isDark=true

## goTo callback (deps: [current])
\`\`\`ts
if (dir > 0) { setExitInfo({slideId:SLIDES[current].id, xTarget:-380}); setEnterFromRight(null) }
else          { setExitInfo(null); setEnterFromRight(SLIDES[newIdx].id) }
setDirection(dir)
setCurrent(newIdx)
\`\`\`

## Per-card calculation
\`\`\`ts
const offset = (slide.id - current + SLIDES.length) % SLIDES.length
const isExiting = exitInfo?.slideId === slide.id && offset === SLIDES.length - 1
const isEnteringFromRight = enterFromRight === slide.id && offset === 0
const animTarget = isExiting
  ? {x:exitInfo!.xTarget, y:0, scale:0.88, opacity:0}
  : offset <= 2 ? STACK[offset] : OFFSCREEN
const zIndex = isEnteringFromRight ? 20 : isExiting ? 15
  : offset===0 ? 10 : offset===1 ? 6 : offset===2 ? 2 : 0
\`\`\`

## motion.div props
key: isEnteringFromRight ? \`\${slide.id}-right\` : slide.id
initial: isEnteringFromRight ? {x:380, opacity:0, scale:0.88, y:0} : false
animate: animTarget
transition: {type:'spring', stiffness:300, damping:28}
onAnimationComplete: setExitInfo(p => p?.slideId===slide.id ? null : p); setEnterFromRight(p => p===slide.id ? null : p)
drag: offset===0 ? 'x' : false — dragConstraints {left:0,right:0} — dragElastic 0.5
onDragEnd (offset===0 only): if info.offset.x<-60||info.velocity.x<-400 → navigate(1); else if >60||>400 → navigate(-1)

## Card content
padding '24px 28px 28px', flex column, space-between
- Top: label (10px 700 0.12em uppercase textMuted) | counter "XX / 04" (11px 700 textMuted)
- Bottom: num div (88px 900 lh:0.85 -0.05em accent) then title (26px 800 lh:1.15 -0.03em pre-line textPrimary)

## ShapeDecor function
circle:   <div style={{position:'absolute',right:-32,top:-32,width:128,height:128,borderRadius:'50%',border:\`2px solid \${accent}\`,opacity:0.15}} />
square:   <div style={{position:'absolute',right:20,top:30,width:60,height:60,border:\`2px solid \${accent}\`,transform:'rotate(15deg)',opacity:0.25}} />
line:     two absolute divs full-height — {right:28,width:2,background:primary,opacity:0.1} and {right:38,width:1,background:primary,opacity:0.06}
triangle: <svg style={{position:'absolute',right:-24,top:-18,width:126,height:112,opacity:0.2}} viewBox="0 0 180 160" fill="none">
            <polygon points="90,12 172,148 8,148" stroke={primary} strokeWidth="2" strokeLinejoin="round"/>
          </svg>

## isDark detection
useEffect with containerRef, MutationObserver on document.documentElement watching 'class'. Affects dot inactive colour and card boxShadow.

## JSX structure
<div ref={containerRef} className="flex h-full w-full flex-col items-center justify-center bg-sand-100 dark:bg-sand-950">
  <div style={{position:'relative',width:CARD_W,height:CARD_H,overflow:'visible'}}>
    {SLIDES.map(slide => <motion.div key={...} ...> <ShapeDecor .../> <content/> </motion.div>)}
  </div>
  <div style={{display:'flex',gap:6,marginTop:32}}>
    {SLIDES.map((s,i) => <motion.button animate={{width: i===current?24:6}} .../>)}
  </div>
</div>`,

  V0: `Create a swipeable editorial card deck with 4 slides. The deck looks like a real physical stack — you can always see 3 cards layered behind each other with a slight y-offset and scale, giving a sense of depth.

The 4 slides each have a bold, distinct look:
1. Near-black background, white text, orange accent — "Define the Problem Space" — decorative circle outline in the top-right corner
2. Off-white background, dark text, orange accent — "Discover Direction" — small rotated square outline
3. Solid orange background, dark accent — "Design & Deliver" — two subtle vertical lines on the right
4. Dark charcoal (#2A2A2A) background, off-white text — "Measure Impact" — a large stroke-only triangle in the top-right

Each card (260×300, rounded corners) shows: a small uppercase category label top-left, a "01 / 04" counter top-right, and at the bottom a massive slide number (~88px, bold, accent colour) stacked above a 2-line bold title.

**Swiping forward (left):** the front card flies off to the left, and the stack shifts forward — the second card becomes the new front with a smooth spring. **Swiping backward (right):** the new card slides in from the right side, on top of the current stack, like placing a card on top of a deck.

Below the stack, show only animated dot indicators (no arrow buttons). The active dot stretches wider (6px → 24px) in orange. Users can also drag the card sideways — flick it far enough and it navigates.

Use Framer Motion with spring stiffness 300 and damping 28. Support light and dark mode — the container background changes, and the inactive dots adapt.`,
}
