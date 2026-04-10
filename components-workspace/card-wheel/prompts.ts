import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  V0: `Create an animated card wheel component where 8 credit/debit cards are arranged in a rotating pinwheel layout.

Layout and physics:
- 8 cards (148×93px each) placed at radius 118px from the center
- Cards rotate continuously as a wheel — one full revolution every 22 seconds using linear easing
- Each card's face counter-rotates so text always stays upright while the wheel spins

Card design (each card has a unique color):
- Card 0: bg #F0EFE9, dark text — Visa Debit •••• 4829
- Card 1: bg #1E40AF, white text — Mastercard Credit •••• 7741
- Card 2: bg #93C5E8, dark text — Amex Debit •••• 3344
- Card 3: bg #F5C100, dark text — Discover Credit •••• 5512
- Card 4: bg #E84826, white text — JCB Credit •••• 0091
- Card 5: bg #14532D, white text — UnionPay Debit •••• 6673
- Card 6: bg #84CC16, dark text — Maestro Debit •••• 8820
- Card 7: bg #27272A, white text — MIR Credit •••• 2255

Card layout (each card):
- Top row: golden EMV chip (26×20px) on the left, payment network icon scaled to 75% on the right
- Middle: spacer flex-1
- Bottom row: "•••• XXXX" in monospace 11px on the left, "DEBIT" or "CREDIT" in 8px uppercase on the right
- Rounded corners 14px, box shadow, subtle top-edge gradient highlight

Payment network icons: use inline SVGs (no external icon library has these):
- Visa: italic serif "VISA" in #1A1F71
- Mastercard: overlapping red/orange circles with FF5F00 overlap
- Amex: blue rect badge with "AMEX" text
- Discover: "DISCOVER" text + orange circle
- UnionPay: split red/blue rect
- JCB: three colored squares (blue/red/green)
- Maestro: overlapping red/blue circles
- MIR: green rect with "МИР" text

Interactions:
- Hover any card: lift up 14px, scale 1.05 with spring transition
- Click a card: toggle selected state — lifts 18px, scale 1.08 (spring stiffness 360 damping 22)
- Background adapts to dark/light theme (dark: #0F0F0E, light: #EEECEA)

Show a hint text at the bottom: "hover · click to pop"`,

  Claude: `Create \`components-workspace/card-wheel/index.tsx\` — a spinning credit card wheel using Framer Motion.

\`\`\`ts
// Constants
const CARD_W  = 148
const CARD_H  = 93
const RADIUS  = 118
const N_CARDS = 8
\`\`\`

**CardData interface:**
\`\`\`ts
interface CardData {
  id: number
  network: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unionpay' | 'jcb' | 'maestro' | 'mir'
  type: 'DEBIT' | 'CREDIT'
  lastFour: string
  bg: string
  textColor: string
  mutedColor: string
}
\`\`\`

**8 cards (id 0–7):**
\`{ id:0, network:'visa', type:'DEBIT', lastFour:'4829', bg:'#F0EFE9', textColor:'#1a1a18', mutedColor:'rgba(26,26,24,0.45)' }\`
\`{ id:1, network:'mastercard', type:'CREDIT', lastFour:'7741', bg:'#1E40AF', textColor:'#ffffff', mutedColor:'rgba(255,255,255,0.55)' }\`
\`{ id:2, network:'amex', type:'DEBIT', lastFour:'3344', bg:'#93C5E8', textColor:'#0a2540', mutedColor:'rgba(10,37,64,0.55)' }\`
\`{ id:3, network:'discover', type:'CREDIT', lastFour:'5512', bg:'#F5C100', textColor:'#1a1000', mutedColor:'rgba(26,16,0,0.55)' }\`
\`{ id:4, network:'jcb', type:'CREDIT', lastFour:'0091', bg:'#E84826', textColor:'#ffffff', mutedColor:'rgba(255,255,255,0.55)' }\`
\`{ id:5, network:'unionpay', type:'DEBIT', lastFour:'6673', bg:'#14532D', textColor:'#ffffff', mutedColor:'rgba(255,255,255,0.55)' }\`
\`{ id:6, network:'maestro', type:'DEBIT', lastFour:'8820', bg:'#84CC16', textColor:'#1a2a00', mutedColor:'rgba(26,42,0,0.55)' }\`
\`{ id:7, network:'mir', type:'CREDIT', lastFour:'2255', bg:'#27272A', textColor:'#ffffff', mutedColor:'rgba(255,255,255,0.45)' }\`

**CardSpoke subcomponent** (required — call useTransform at component top level, never inside .map()):
\`\`\`tsx
function CardSpoke({ card, index, wheelRotation, isSelected, isHovered, onHover, onSelect }) {
  const orbitalAngle  = useTransform(wheelRotation, r => r + index * (360 / N_CARDS))
  const counterRotate = useTransform(wheelRotation, r => -(r + index * (360 / N_CARDS)))
  // Layer 1: position absolute, left: 50%, top: 50%, marginLeft: -CARD_W/2, marginTop: -CARD_H/2, rotate: orbitalAngle, y: -RADIUS
  // Layer 2: animate selected lift, whileHover lift, onClick toggle
  // Layer 3: rotate: counterRotate, borderRadius: 14, background: card.bg, overflow: hidden
}
\`\`\`

**Spin loop in CardWheel:**
\`\`\`ts
const wheelRotation = useMotionValue(0)
useEffect(() => {
  let alive = true
  async function spin() {
    while (alive) {
      await animate(wheelRotation, wheelRotation.get() + 360, { duration: 22, ease: 'linear' })
    }
  }
  spin()
  return () => { alive = false }
}, [wheelRotation])
\`\`\`

**Inline SVG icons** — one function per network (no external library): Visa (italic serif "VISA"), Mastercard (overlapping circles), Amex (blue rect), Discover (text + orange circle), UnionPay (split rects), JCB (three squares), Maestro (overlapping circles), MIR (green badge with "МИР").

**isDark detection** via MutationObserver on document.documentElement class changes.

**Backgrounds:** dark = \`#0F0F0E\`, light = \`#EEECEA\`

Bottom hint: \`"hover · click to pop"\``,

  GPT: `Build a Framer Motion card wheel in React/TypeScript.

Architecture:
- \`useMotionValue(0)\` for wheelRotation, animated with an \`alive\`-guard async loop: \`animate(wheelRotation, current + 360, { duration: 22, ease: 'linear' })\`
- \`CardSpoke\` subcomponent per card (required for React hooks rules — hooks can't be in .map())
  - \`orbitalAngle = useTransform(wheelRotation, r => r + i * 45)\`
  - \`counterRotate = useTransform(wheelRotation, r => -(r + i * 45))\`
  - 3-layer structure: orbital div → hover-lift div → face counter-rotation div
- 8 CardData entries, each with bg, textColor, mutedColor, network, type, lastFour

Card internals (148×93px, borderRadius 14):
- Top: golden chip (26×20px) left, network icon at 0.75 scale right
- Bottom: "•••• {lastFour}" monospace 11px, "{DEBIT|CREDIT}" 8px uppercase

Interaction:
- \`whileHover={{ y: -14, scale: 1.05 }}\`
- Click toggles selectedId; selected = \`animate({ y: -18, scale: 1.08 })\`
- Spring: stiffness 360, damping 22

Inline SVG icons for all 8 payment networks (no npm icons package has these).

isDark via MutationObserver watching \`document.documentElement\` classList.

Colors: dark bg \`#0F0F0E\`, light bg \`#EEECEA\`.`,

  Gemini: `Design an interactive spinning card wheel animation with 8 credit/debit cards arranged in a radial layout like a clock face.

The wheel spins slowly and continuously (one revolution every 22 seconds). Each card stays upright as the wheel rotates — the face counter-rotates to cancel the orbital rotation.

Cards:
- 8 cards, each 148×93px, placed at radius 118px from center
- Unique background colors: cream, navy blue, light blue, yellow, red, dark green, lime, charcoal
- Each shows a golden EMV chip, a payment network logo (Visa/Mastercard/Amex/Discover/UnionPay/JCB/Maestro/MIR), a masked card number "•••• XXXX", and a DEBIT or CREDIT label

Hover behavior: card lifts 14px and scales up slightly with a spring animation
Click behavior: toggles a "selected" state — lifts higher (18px) with a larger scale

Build inline SVG icons for all 8 networks — no external libraries needed.
Show a small hint at the bottom: "hover · click to pop"`,
}
