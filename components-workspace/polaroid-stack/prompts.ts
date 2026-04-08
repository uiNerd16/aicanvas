import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `File: components-workspace/polaroid-stack/index.tsx
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
}
