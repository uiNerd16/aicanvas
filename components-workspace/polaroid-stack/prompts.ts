import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a PolaroidStack component: 5 white polaroid-style photo cards stacked in a casual pile with random rotations. Each card has a colorful gradient inside (like a photo) and a handwritten-style label at the bottom.

Default state: cards are stacked on top of each other with slight random rotations (-12° to +14°) and tiny x/y offsets so it looks like a real pile of photos.

Click anywhere to fan the cards out in a beautiful arc. They spread horizontally — the middle card stays roughly centered, the edge cards drop slightly lower creating a semicircular arc shape. Cards spread to x positions of about -160px to +160px. Click again to collapse back to a stack.

When the cards are fanned out, hovering over any individual card gently lifts it upward and scales it slightly.

The 5 cards:
- Sunset: coral-to-orange gradient (#FF6B6B → #FF8E53)
- Ocean: teal-to-cyan gradient (#14B8A6 → #67E8F9)
- Dream: violet-to-lavender gradient (#8B5CF6 → #C4B5FD)
- Golden: amber-to-yellow gradient (#F59E0B → #FDE68A)
- Mist: slate gradient (#64748B → #CBD5E1)

Use Framer Motion spring animations (stiffness 280, damping 22) with a stagger delay of 60ms per card when fanning out. The cards fan left-to-right, and stack right-to-left.

Style details: white polaroid frame (110×140px), 8px padding on top and sides, larger bottom strip for the label. Use the Caveat font from Google Fonts for the handwritten labels. Load it with an @import in a style tag. Dark background (bg-zinc-950). Drop shadow on each card, enhanced on hover.`,

  Bolt: `Build a React + TypeScript component called PolaroidStack using Framer Motion. No external image files — use CSS gradients for the photo areas.

## Card data
\`\`\`ts
const CARDS = [
  { id: 0, label: 'Sunset',  from: '#FF6B6B', to: '#FF8E53' },
  { id: 1, label: 'Ocean',   from: '#14B8A6', to: '#67E8F9' },
  { id: 2, label: 'Dream',   from: '#8B5CF6', to: '#C4B5FD' },
  { id: 3, label: 'Golden',  from: '#F59E0B', to: '#FDE68A' },
  { id: 4, label: 'Mist',    from: '#64748B', to: '#CBD5E1' },
]
\`\`\`

## Position tables
\`\`\`ts
const STACKED = [
  { x: -6, y:  2, rotate: -12 },
  { x:  3, y: -4, rotate:  -5 },
  { x:  1, y:  1, rotate:   2 },
  { x: -4, y:  3, rotate:   8 },
  { x:  5, y: -2, rotate:  14 },
]
const FANNED = [
  { x: -160, y: 30, rotate: -22 },
  { x:  -80, y:  8, rotate: -11 },
  { x:    0, y: -4, rotate:   0 },
  { x:   80, y:  8, rotate:  11 },
  { x:  160, y: 30, rotate:  22 },
]
\`\`\`

## State: \`fanned: boolean\`, \`hoveredId: number | null\`

## Layout
- Root: \`flex h-full w-full items-center justify-center bg-zinc-950 relative cursor-pointer\`
- Stage div: \`position: relative; width: 460px; height: 220px\`
- Each card: TWO nested motion.divs
  1. Outer: handles fan/stack position. \`absolute left-1/2 top-1/2\`. animate \`{ x: pos.x - 55, y: pos.y - 70, rotate }\`. Spring stiffness 280 damping 22. Delay: \`fanned ? i*0.06 : (4-i)*0.05\`. zIndex via \`style\`.
  2. Inner: handles hover lift only. animate \`{ y: isHovered ? -18 : 0, scale: isHovered ? 1.07 : 1 }\`. Spring stiffness 420 damping 26. onHoverStart/End update hoveredId (only when fanned).

## Card DOM (inside inner motion.div)
White div 110×140px, flex column, padding 8px top/sides, 0 bottom.
- Gradient div: height 93px, \`background: linear-gradient(135deg, from, to)\`
- Label div: flex 1, centered. \`<p>\` with Caveat font, 16px, weight 600, zinc-700 color.

## Extras
- Load Caveat: \`<style>@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap');</style>\`
- Box shadow: enhanced on hover (via CSS transition, not Framer Motion)
- Click handler on root: toggle fanned + reset hoveredId
- Animated hint text at bottom-6 using motion.p with key prop for fade transition`,

  Lovable: `I want a charming PolaroidStack component that feels like reaching into a box of old vacation photos! ✨

Picture this: 5 polaroid photos casually tossed in a pile, each slightly rotated at different angles so they look authentic. When you click anywhere, they fan out beautifully like a hand of playing cards — the middle card stays level while the ones at the edges dip slightly, creating a natural arc shape. Hover over any fanned-out card and it pops forward toward you. Click again and they happily collapse back into their pile.

Each photo has a gorgeous gradient fill and a cute handwritten label below it (using the Caveat font from Google Fonts):
🌅 Sunset — warm coral to orange
🌊 Ocean — cool teal to cyan
💜 Dream — dreamy violet to lavender
✨ Golden — rich amber to soft yellow
🌫️ Mist — moody slate to light steel

The animations should feel springy and organic — not robotic. Use Framer Motion spring physics (stiffness 280, damping 22) and stagger each card by 60ms as they fan out, so they seem to spread one by one. When stacking back, they collapse in reverse order.

Style details:
- White polaroid frames with rounded corners and drop shadows
- The shadow gets deeper and more dramatic when you hover a card
- Dark background (zinc-950) so the white frames really pop
- Tiny hint text at the bottom that says "click to fan out" / "click to stack"

The whole thing should feel tactile and satisfying — like actually handling photographs!`,

  'Claude Code': `File: components-workspace/polaroid-stack/index.tsx
Export: \`export function PolaroidStack()\`

## Constants
\`\`\`ts
const CARD_W = 110, CARD_H = 140

const CARDS = [
  { id: 0, label: 'Sunset',  from: '#FF6B6B', to: '#FF8E53' },
  { id: 1, label: 'Ocean',   from: '#14B8A6', to: '#67E8F9' },
  { id: 2, label: 'Dream',   from: '#8B5CF6', to: '#C4B5FD' },
  { id: 3, label: 'Golden',  from: '#F59E0B', to: '#FDE68A' },
  { id: 4, label: 'Mist',    from: '#64748B', to: '#CBD5E1' },
]

const STACKED: Pos[] = [
  { x: -6, y:  2, rotate: -12 }, { x:  3, y: -4, rotate:  -5 },
  { x:  1, y:  1, rotate:   2 }, { x: -4, y:  3, rotate:   8 },
  { x:  5, y: -2, rotate:  14 },
]

const FANNED: Pos[] = [
  { x: -160, y: 30, rotate: -22 }, { x: -80, y: 8, rotate: -11 },
  { x:    0, y: -4, rotate:   0 }, { x:  80, y: 8, rotate:  11 },
  { x:  160, y: 30, rotate:  22 },
]
\`\`\`

## State
\`\`\`ts
const [fanned, setFanned] = useState(false)
const [hoveredId, setHoveredId] = useState<number | null>(null)
\`\`\`

## Root JSX
\`\`\`
<>
  <style>{@import Caveat from Google Fonts}</style>
  <div class="relative flex h-full w-full cursor-pointer select-none items-center justify-center bg-zinc-950"
       onClick={() => { setFanned(f => !f); setHoveredId(null) }}>
    <div class="relative" style={width:460, height:220}>
      {CARDS.map((card, i) => ...)}
    </div>
    <motion.p key={String(fanned)} ... bottom hint />
  </div>
</>
\`\`\`

## Per-card render (two nested motion.divs)
**Outer motion.div** — position/rotation with stagger:
- className: "absolute left-1/2 top-1/2"
- animate: { x: pos.x - CARD_W/2, y: pos.y - CARD_H/2, rotate: pos.rotate }
- style: { zIndex: isHovered ? 20 : i }
- transition: { type:'spring', stiffness:280, damping:22, delay: fanned ? i*0.06 : (4-i)*0.05 }

**Inner motion.div** — hover lift only, no delay:
- animate: { y: isHovered ? -18 : 0, scale: isHovered ? 1.07 : 1 }
- transition: { type:'spring', stiffness:420, damping:26 }
- onHoverStart: () => { if (fanned) setHoveredId(card.id) }
- onHoverEnd: () => setHoveredId(null)

## Polaroid DOM (inside inner motion.div)
White div 110×140px, flex-col, padding 8px top/sides:
1. Gradient div: height 93px, background linear-gradient(135deg, from, to)
2. Label wrapper: flex-1 centered → <p> fontFamily Caveat 16px weight 600 color #3f3f46

boxShadow on white div: enhanced on hover (CSS transition, not Framer Motion).

## Hint text
motion.p at absolute bottom-6, text-xs text-zinc-500. key={String(fanned)} for fade re-mount. pointerEvents: none.`,

  Cursor: `// components-workspace/polaroid-stack/index.tsx
// 'use client' — Framer Motion + TypeScript

// CARD_W=110, CARD_H=140
// 5 cards: Sunset(coral), Ocean(teal), Dream(violet), Golden(amber), Mist(slate)

// STACKED positions (slight scatter):
// [{x:-6,y:2,rot:-12},{x:3,y:-4,rot:-5},{x:1,y:1,rot:2},{x:-4,y:3,rot:8},{x:5,y:-2,rot:14}]

// FANNED arc positions:
// [{x:-160,y:30,rot:-22},{x:-80,y:8,rot:-11},{x:0,y:-4,rot:0},{x:80,y:8,rot:11},{x:160,y:30,rot:22}]

// State: fanned(bool), hoveredId(number|null)
// onClick on root: toggle fanned + reset hoveredId

// Each card = TWO nested motion.divs:
// 1. Outer: animate({x: pos.x-55, y: pos.y-70, rotate})
//    spring(280,22) + delay: fanned ? i*0.06 : (4-i)*0.05
//    style.zIndex = isHovered ? 20 : i
// 2. Inner: animate({y: isHovered?-18:0, scale: isHovered?1.07:1})
//    spring(420,26), no delay
//    onHoverStart/End → setHoveredId (only when fanned)

// Card DOM: white div flex-col 110×140, padding 8px top/sides
//   → gradient div (height 93, linear-gradient 135deg from/to)
//   → label area flex-1 centered: <p> Caveat font 16px w600 zinc-700

// Load Caveat: <style>@import Google Fonts Caveat 400;600</style>
// boxShadow on white card: CSS transition (not Framer), enhanced on hover
// Hint text: motion.p bottom-6 zinc-500, key=String(fanned) for fade`,
}
