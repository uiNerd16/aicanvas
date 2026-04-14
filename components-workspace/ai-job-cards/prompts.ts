import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Build an AI Job Cards component in a single 'use client' TypeScript file.

## What it is
Three stacked card columns — one each for Anthropic, Perplexity, and Google. Each column is a stack of 3 overlapping job cards. The front card is fully visible; the middle and back cards peek below it like a fan. Drag or swipe the front card up or down to cycle to the next card in that column.

## Layout
- Rose-pink outer bg (#F9D4D1 light / #0d0d0c dark), padding: clamp(16px, 5%, 40px)
- Row of 3 stacks on wide screens, single column when container width < 480px (ResizeObserver)
- Stacks max-width 760px

## Card anatomy (top → bottom)
1. Rate badge ($120/hr) left — BookmarkSimple icon (phosphor) top-right, click to toggle filled/outline + scale-pop spring
2. Job title (bold 20px, up to 2 lines, maxWidth 72%) — vertical pagination dots column on the right
3. Divider
4. Brand logo (24px inline SVG) + company + role label — dark pill "View" button

## Stack constants
\`\`\`ts
const CARD_H = 234
const PEEK   = 20
const SLOTS = [
  { y: 0,        scale: 1,    z: 3 },
  { y: PEEK,     scale: 0.96, z: 2 },
  { y: PEEK * 2, scale: 0.92, z: 1 },
]
\`\`\`

## Cycle animation
- Front card exits: y: ±160, scale: 0.88, opacity: 0 over 380ms ease [0.4,0,0.2,1]
- Other cards spring into new slots: stiffness 280, damping 26
- Exiting card instantly returns to back slot (duration: 0) then snaps to position
- direction tracked in a ref: swipe up → exit to top, swipe down → exit to bottom

## Interaction
- Front card has drag="y" with dragElastic: 0.2, dragConstraints top/bottom: 0
- Trigger cycle if |offset.y| > 60 OR |velocity.y| > 400
- Pagination dots button (top-right of title row) also cycles on click
- Hover lift: front card y - 4, spring stiffness 300, damping 24

## Card colours (theme-aware)
- Card bg: #1e1e1c (dark) / #F7F7EF (light)
- Title: #F5F5F0 / #141412; Rate: 55% opacity; Divider: 8% opacity
- Bookmark filled = #e05c6a; dot active = #E5E5E0 (dark) / #2a2a28 (light)
- View button: dark pill in light, light pill in dark

## Brand logos (inline SVG — no external libs)
- Anthropic: Claude anthropic spiral, fill #d97757
- Perplexity: Bootstrap Icons P star mark, fill white (dark) / #1C1C1C (light)
- Google: Gemini 4-pointed star with gradient #4893FC → #969DFF → #BD99FE

## Borders
- 1px solid at 10% opacity of the brand colour
- Anthropic: #d97757, Perplexity: #FFFFFF dark / #1C1C1C light, Google: #4893FC

## Theme detection
useIsDark hook uses MutationObserver on document.documentElement watching the 'class' attribute.

## Data (3 stacks × 3 cards each)
Anthropic: Prompt Engineer $120/hr, AI Safety Researcher $145/hr, Interpretability Lead $155/hr
Perplexity: Generative AI Lead $160/hr, ML Engineer $135/hr, Search AI Researcher $140/hr
Google: LLM Platform Engineer $130-160/hr, AI Research Scientist $150/hr, Multimodal AI Lead $165/hr

Inline everything. Single file. Use Framer Motion for all animation.`,

  GPT: `Build a TypeScript React component "AiJobCards" — single 'use client' file, no external icon libraries.

## Architecture
- Three StackData columns: Anthropic (claude logo), Perplexity, Google (gemini logo)
- Each column has 3 CardData items
- CardStack component manages order state [0,1,2], exitingId, exitDir ref, returningIds Set
- SingleCard renders the card visual, receives isDark + slot props

## Types
\`\`\`ts
interface CardData { rate: string; title: string; role: string }
interface StackData {
  logo: LogoKey
  company: string
  borderColor: string
  borderColorLight?: string
  cards: [CardData, CardData, CardData]
}
// LogoKey = 'claude' | 'openai' | 'gemini' | 'vercel' | 'mistral' | 'perplexity'
\`\`\`

## Stack constants
\`\`\`ts
const CARD_H = 234  // card height px
const PEEK   = 20   // back-card peek distance
const SLOTS = [
  { y: 0,       scale: 1,    z: 3 },  // front
  { y: 20,      scale: 0.96, z: 2 },  // middle
  { y: 40,      scale: 0.92, z: 1 },  // back
]
\`\`\`

## Cycle logic (CardStack)
\`\`\`ts
const cycle = useCallback((dir: 'up' | 'down' = 'up') => {
  if (dismissing.current) return
  dismissing.current = true
  exitDir.current = dir
  const frontId = orderRef.current[0]
  setExitingId(frontId)
  setTimeout(() => {
    setReturningIds(new Set([frontId]))
    setOrder(prev => [prev[1], prev[2], prev[0]])
    setExitingId(null)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setReturningIds(new Set())
      dismissing.current = false
    }))
  }, 380)
}, [])
\`\`\`

## Animation targets per card
\`\`\`ts
const animTarget = isExiting
  ? { y: exitDir.current === 'down' ? 160 : -160, scale: 0.88, opacity: 0 }
  : { y: slot.y, scale: slot.scale, opacity: 1 }
const animTransition = isExiting
  ? { duration: 0.38, ease: [0.4, 0, 0.2, 1] }
  : isReturning
    ? { duration: 0 }
    : { type: 'spring', stiffness: 280, damping: 26 }
\`\`\`

## Drag on front card only
\`\`\`ts
drag={isFront ? 'y' : false}
dragConstraints={{ top: 0, bottom: 0 }}
dragElastic={0.2}
onDragEnd={(_, info) => {
  if (Math.abs(info.offset.y) > 60 || Math.abs(info.velocity.y) > 400)
    cycle(info.offset.y > 0 ? 'down' : 'up')
}}
whileHover={isFront ? { y: slot.y - 4, transition: { type: 'spring', stiffness: 300, damping: 24 } } : {}}
\`\`\`

## Pagination dots (vertical, right side of title row)
3 dots in a column: active dot height=32px, inactive height=5px, width=5px always, borderRadius=3px
Active dot bg: #E5E5E0 dark / #2a2a28 light. Inactive: rgba(255,255,255,0.18) dark / rgba(0,0,0,0.15) light
Dots wrapped in motion.button that calls onCycle on click.

## Card borders
\`\`\`ts
const borderColor = isDark ? stack.borderColor : (stack.borderColorLight ?? stack.borderColor)
// border: \`1px solid \${borderColor}1A\`   (10% opacity via hex alpha)
\`\`\`
- Anthropic borderColor: '#d97757', Perplexity: '#FFFFFF' dark / '#1C1C1C' light (borderColorLight), Google: '#4893FC'

## Inline SVG logos
- ClaudeLogo: fill #d97757, complex spiral path, viewBox "0 0 1200 1200"
- GeminiLogo: 4-pointed star, linearGradient id="gemini-grad" #4893FC→#969DFF→#BD99FE, viewBox "0 0 65 65"
- PerplexityLogo: Bootstrap Icons P mark 16×16, fill white/dark based on isDark

## Card bg & theme colours
\`\`\`ts
cardBg      = isDark ? '#1e1e1c' : '#F7F7EF'
titleColor  = isDark ? '#F5F5F0' : '#141412'
btnBg       = isDark ? '#e8e8e0' : '#1a1a18'
btnText     = isDark ? '#1a1a18' : '#FFFFFF'
outerBg     = isDark ? '#0d0d0c' : '#F9D4D1'
shadowVal   = isDark ? '0 2px 12px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.07)'
\`\`\`

## Narrow layout
ResizeObserver on containerRef → setNarrow(width < 480)
If narrow: flexDirection: 'column', else 'row', gap: 16

## useIsDark hook
MutationObserver on document.documentElement, attributeFilter: ['class'], checks for '.dark'

## Card inner layout
\`\`\`
div (column, gap 0, height CARD_H, padding 18px 18px 16px, borderRadius 32, boxSizing border-box)
  ├── top row: rate label (12px 600wt) + BookmarkSimple icon (18px, phosphor, fill toggle rose #e05c6a)
  ├── title row: h3 (20px 800wt flex:1 maxWidth 72%) + dots column button (flexShrink:0)
  ├── divider (1px, 8% opacity)
  └── bottom row: logo (24px) + company+role column + View button pill (borderRadius 999)
\`\`\`

Generate the full single-file implementation.`,

  Gemini: `Create a React TypeScript component called AiJobCards. Use 'use client' at top. All imports must be explicit.

Required imports:
\`\`\`ts
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BookmarkSimple } from '@phosphor-icons/react'
\`\`\`

Do NOT import useTheme. Use this exact hook instead:
\`\`\`ts
function useIsDark(ref: React.RefObject<HTMLElement | null>) {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [ref])
  return isDark
}
\`\`\`

Use this exact data shape:
\`\`\`ts
interface CardData { rate: string; title: string; role: string }
interface StackData {
  logo: 'claude' | 'gemini' | 'perplexity'
  company: string
  borderColor: string
  borderColorLight?: string
  cards: [CardData, CardData, CardData]
}

const STACKS: StackData[] = [
  {
    logo: 'claude', company: 'Anthropic', borderColor: '#d97757',
    cards: [
      { rate: '$120/hr', title: 'Prompt Engineer',       role: 'AI Research'        },
      { rate: '$145/hr', title: 'AI Safety Researcher',  role: 'Safety & Alignment' },
      { rate: '$155/hr', title: 'Interpretability Lead', role: 'Research'           },
    ],
  },
  {
    logo: 'perplexity', company: 'Perplexity', borderColor: '#FFFFFF', borderColorLight: '#1C1C1C',
    cards: [
      { rate: '$160/hr', title: 'Generative AI Lead',    role: 'AI Platform'    },
      { rate: '$135/hr', title: 'ML Engineer',           role: 'Infrastructure' },
      { rate: '$140/hr', title: 'Search AI Researcher',  role: 'Research'       },
    ],
  },
  {
    logo: 'gemini', company: 'Google', borderColor: '#4893FC',
    cards: [
      { rate: '$130–160/hr', title: 'LLM Platform Engineer', role: 'Engineering' },
      { rate: '$150/hr',     title: 'AI Research Scientist', role: 'Research'    },
      { rate: '$165/hr',     title: 'Multimodal AI Lead',    role: 'DeepMind'    },
    ],
  },
]
\`\`\`

Stack animation constants:
\`\`\`ts
const CARD_H = 234
const PEEK = 20
const SLOTS = [
  { y: 0,  scale: 1,    z: 3 },
  { y: 20, scale: 0.96, z: 2 },
  { y: 40, scale: 0.92, z: 1 },
]
\`\`\`

CardStack uses these state variables: order [number,number,number], exitingId number|null, returningIds Set<number>, refs: exitDir 'up'|'down', dismissing boolean, orderRef.

Cycle function sets exitDir.current BEFORE setting exitingId. After 380ms timeout: setReturningIds, setOrder (rotate left: [b,c,a]), setExitingId(null), then double-rAF to clear returningIds and dismissing.

For each of the 3 cards in the stack, animTarget is:
- If exiting: y: exitDir==='down' ? 160 : -160, scale: 0.88, opacity: 0
- Otherwise: y: slot.y, scale: slot.scale, opacity: 1

Transition for exiting: duration 0.38, ease [0.4,0,0.2,1]
Transition for returning: duration 0
Otherwise: spring stiffness 280, damping 26

Front card has drag="y", dragConstraints top:0 bottom:0, dragElastic:0.2
Trigger cycle if |offset.y| > 60 OR |velocity.y| > 400
Front card hover: y: slot.y - 4, spring stiffness 300, damping 24

Card border: compute const borderColor = isDark ? stack.borderColor : (stack.borderColorLight ?? stack.borderColor), then use 10% hex alpha appended: borderColor + '1A'
Card bg: dark=#1e1e1c, light=#F7F7EF
Card borderRadius: 32, height: CARD_H, padding: '18px 18px 16px', boxSizing: 'border-box'
Outer bg: dark=#0d0d0c, light=#F9D4D1

Inline SVG logos:
- ClaudeLogo: fill #d97757, complex anthropic path, viewBox "0 0 1200 1200"
- GeminiLogo: 4-pointed star path, linearGradient from #4893FC to #BD99FE, viewBox "0 0 65 65"
- PerplexityLogo: Bootstrap Icons perplexity P mark, fill white (dark) / #1C1C1C (light), viewBox "0 0 16 16"

Pagination dots: vertical column of 3 circles, active one is 5×32px rounded pill (height transitions), inactive are 5×5px circles.

BookmarkSimple from @phosphor-icons/react: weight="fill" when saved, weight="regular" when not. Fill #e05c6a when saved. whileTap scale: 1.3.

View button: motion.button, whileHover scale:1.03, whileTap scale:0.97, spring 400/20.

Narrow layout: ResizeObserver on containerRef, setNarrow when width < 480. Row layout when wide, column when narrow.

Root element className: "flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950"`,

  V0: `Create an AI job cards component showing three columns of stacked cards — one column each for Anthropic, Perplexity, and Google.

Each column shows 3 cards stacked on top of each other. The second and third cards peek below the first card, scaled down slightly so you can see all three. You can swipe the front card up or down to cycle through the cards — the front card flies out in the direction of the swipe, and the next card springs into place.

**Card layout** (top to bottom):
- Small rate badge on the left (like "$120/hr") and a bookmark icon on the right that toggles saved state
- Big bold job title on the left, three vertical pagination dots on the right showing which card is in front
- Thin divider line
- Company logo (small, 24px) with company name and role label beside it, and a "View" pill button on the right

**Three columns of data:**
- Anthropic column: Prompt Engineer $120/hr, AI Safety Researcher $145/hr, Interpretability Lead $155/hr
- Perplexity column: Generative AI Lead $160/hr, ML Engineer $135/hr, Search AI Researcher $140/hr
- Google column: LLM Platform Engineer $130–160/hr, AI Research Scientist $150/hr, Multimodal AI Lead $165/hr

**Visual style:**
- Rose-pink background (#F9D4D1 in light mode, very dark #0d0d0c in dark mode)
- Cards are warm cream (#F7F7EF light / #1e1e1c dark), rounded corners (32px radius)
- Each column has a 1px branded border at 10% opacity: Anthropic = orange #d97757, Perplexity = white (dark mode) or dark (light mode), Google = blue #4893FC
- Logos are inline SVGs — Claude's orange anthropic mark, the Gemini gradient star, and Perplexity's P mark
- Active pagination dot is a tall pill (32px tall), inactive dots are small circles (5px)

**Interactions:**
- Drag/swipe front card up or down to cycle (threshold: 60px offset or 400px/s velocity)
- Click the pagination dots to cycle as well
- Hover lifts the front card 4px with a spring
- Bookmark button springs to 1.3× scale on tap, turns rose-pink when saved

**Responsive:** Single column stack on mobile (below 480px), three columns on wider screens.

Use Framer Motion for all animations. No external icon libraries — inline the SVG logos directly. Support light and dark mode.`,
}
