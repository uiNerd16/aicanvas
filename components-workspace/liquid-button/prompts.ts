import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a "LiquidButton" component — a CTA button that has a living, liquid blob inside it, clipped to the button's shape.

At rest the blob is a wide, flat olive-green ellipse sitting in the lower half of the button. It slowly sloshes around: gently stretching and contracting horizontally and vertically, drifting up and down a little — like a real liquid responding to gravity. The motion is calm and hypnotic, looping forever.

When you hover, the liquid suddenly surges. The blob rapidly expands upward and outward to fill almost the entire button interior, as if the liquid is rising under pressure. The label text swaps from a neutral colour to dark text so it reads clearly against the olive background.

The button has a rounded rectangle shape (border-radius ~14 px), a soft 1.5 px border, and a subtle drop shadow that intensifies on hover. The blob is clipped to the rounded rect so it never bleeds outside the button edge.

A small bright specular ellipse sits at the top of the blob to simulate a highlight glinting off the liquid surface. It moves with the blob.

Use Next.js, Tailwind CSS, and Framer Motion. Support both light and dark mode — the surface and border colours adapt, but the olive blob stays consistent in both themes.`,

  Bolt: `Build a React component called LiquidButton using Framer Motion and Tailwind CSS. It is a CTA button with an SVG liquid blob inside, clipped to the button's rounded rect shape.

Layout:
- Root: \`flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950\`
- Button: fixed size 200 × 56 px, border-radius 14 px, border 1.5 px, position relative, overflow hidden
- Label: absolute centre, z-index 10, font-sans font-semibold text-sm tracking-wider

SVG blob (absolute, fills button, pointer-events none):
- viewBox "0 0 200 56"
- clipPath: rounded rect rx=14, same dimensions as button
- Three ellipse layers inside the clip group:
  1. Diffuse glow: same shape as main blob + 18 px wider / 10 px taller, fill olive-500, fillOpacity 0.22, CSS blur 10 px
  2. Main blob: fill olive-500 (#7D8D41), fillOpacity 0.78 at rest / 0.92 on hover
  3. Specular highlight: small white ellipse near blob top, opacity ~0.22

Blob at-rest geometry: cx=100, cy=33.6, rx=84, ry=15.68
Blob hover geometry: cx=100, cy=26.88, rx=144, ry=39.2

Animations (Framer Motion variants on each ellipse):
- idle: keyframe arrays for cx, cy, rx, ry — 4 s loop, repeatType "mirror", easeInOut — the blob gently oscillates ±6 rx, ±3 ry, ±3 cy, and drifts ±4 cx
- hovered: spring to hover geometry — stiffness 90, damping 14

Hover state:
- Track with useState isHovered; toggle on mouse enter/leave
- Label colour transitions to #110F0C on hover (dark text on olive)
- Box-shadow intensifies on hover: 0 6px 28px rgba(125,141,65,0.28)

Theme detection:
- Check closest('[data-card-theme]') first, then document.documentElement for '.dark' class
- Use MutationObserver to track changes; clean up on unmount

Also add a whileTap scale 0.97 spring on the button element (stiffness 350, damping 28).`,

  Lovable: `I'd love a button that feels genuinely alive — like there's a small pocket of liquid olive-green fluid trapped inside a rounded glass pill, slowly sloshing around while it waits for me to click it.

At rest, the liquid sits calmly in the lower third of the button, gently stretching wider, then narrowing, bobbing up and down slightly — like it responds to microscopic vibrations. It's mesmerising and oddly satisfying to watch. The button itself looks clean and minimal: a subtle border, a soft background, "Get Started" in a clean sans-serif font centered above the liquid.

The moment you hover, everything changes. The liquid surges upward, rapidly filling almost the entire button interior like a wave crashing. The text colour shifts so it's perfectly readable against the now-rich olive background. It feels like pressing a real button — organic, physical, responsive.

There's a tiny specular white highlight that rides the top of the blob, like light glinting off a water surface. When you click, there's a gentle press-down feedback.

The aesthetic is warm and botanical — that deep muted olive green (#7D8D41) feels earthy and sophisticated, not garish. It works equally well on a light cream background and a deep almost-black dark background. The button shape is a friendly rounded rectangle, not too round, just comfortably curved.

Built with React, Tailwind CSS, and Framer Motion. The liquid animation should feel heavy and fluid, not bouncy or cartoon-like — more like mercury than a rubber ball.`,

  'Claude Code': `Create \`components-workspace/liquid-button/index.tsx\`. Export a named function \`LiquidButton\`.

First line: \`'use client'\`

Root element: \`<div ref={containerRef} className="flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950">\`

--- Constants ---

BUTTON_W = 200, BUTTON_H = 56  (px — logical SVG units)
RX = 14  (corner radius)

Blob rest:   cx=100, cy=33.6,  rx=84,   ry=15.68
Blob hover:  cx=100, cy=26.88, rx=144,  ry=39.2
Idle deltas: IDLE_RX_DELTA=6, IDLE_RY_DELTA=3, IDLE_CY_DELTA=3

DARK  = { bg:'#110F0C', border:'#4A453F', label:'#FAF7F2', labelHover:'#110F0C', blob:'#7D8D41' }
LIGHT = { bg:'#F5F1EA', border:'#DDD8CE', label:'#1C1916', labelHover:'#110F0C', blob:'#7D8D41' }

--- State ---

- isDark: boolean (useState(true)) — controls colour set
- isHovered: boolean (useState(false)) — controls blob variant

--- Theme detection (useEffect) ---

Check closest('[data-card-theme]') for '.dark', fallback to document.documentElement.
Use MutationObserver watching 'class' on both elements. Return observer.disconnect().

--- SVG structure ---

Render an <svg aria-hidden viewBox="0 0 200 56" width=200 height=56> positioned absolute over the button (pointer-events:none).

Inside <defs>: a <clipPath id={useId()-derived}>  containing a <rect x=0 y=0 width=200 height=56 rx=14>.

Inside a <g clipPath="url(#clipId)">:
  1. Diffuse ellipse: same variants, rx+18/ry+10, fillOpacity 0.22, CSS filter blur(10px)
  2. Main ellipse: variants below, fillOpacity 0.78 rest / 0.92 hover
  3. Specular ellipse: small white ellipse, rest cx=86/cy=26.6/rx=18/ry=5, hover cx=82/cy=16.88/rx=28/ry=8

--- Framer Motion blob variants (applied to <motion.ellipse>) ---

idle:
  cx: [100, 96, 104, 100]
  cy: [33.6, 30.6, 36.6, 33.6]
  rx: [84, 90, 78, 84]
  ry: [15.68, 12.68, 18.68, 15.68]
  transition: { duration:4, repeat:Infinity, repeatType:'mirror', ease:'easeInOut' }

hovered:
  cx: 100, cy: 26.88, rx: 144, ry: 39.2
  transition: { type:'spring', stiffness:90, damping:14 }

Animate prop: isHovered ? 'hovered' : 'idle'
Set initial cx/cy/rx/ry to rest values on each ellipse element.

--- Button wrapper ---

<motion.button> with:
- position relative, overflow hidden, cursor-pointer
- width=200, height=56, borderRadius=14, border 1.5px solid c.border, background c.bg
- boxShadow: hover → '0 6px 28px rgba(125,141,65,0.28), 0 1px 4px rgba(0,0,0,0.18)', rest → '0 2px 8px rgba(0,0,0,0.12)'
- CSS transition on box-shadow: 0.35s ease
- whileTap={{ scale:0.97 }}, transition spring stiffness 350 damping 28
- onMouseEnter/onMouseLeave toggle isHovered

--- Label ---

<motion.span> z-10 relative, animate={{ color: isHovered ? c.labelHover : c.label }}, transition duration 0.22.
Text: "Get Started", font-sans text-sm font-semibold tracking-wider

--- Entrance ---

Wrap button in <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55, ease:'easeOut' }}>

TypeScript: no \`any\`, useId() for clip path IDs, import type {useId} from 'react'.`,

  Cursor: `File: \`components-workspace/liquid-button/index.tsx\`
- \`'use client'\`, export \`LiquidButton\`
- Root: \`flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950\`

Constants:
- BUTTON_W=200, BUTTON_H=56, RX=14
- Blob rest: cx=100 cy=33.6 rx=84 ry=15.68
- Blob hover: cx=100 cy=26.88 rx=144 ry=39.2
- DARK={ bg:'#110F0C', border:'#4A453F', label:'#FAF7F2', labelHover:'#110F0C', blob:'#7D8D41' }
- LIGHT={ bg:'#F5F1EA', border:'#DDD8CE', label:'#1C1916', labelHover:'#110F0C', blob:'#7D8D41' }

Theme detection:
- useEffect + MutationObserver watching closest('[data-card-theme]') then <html> for .dark class
- setIsDark(boolean), cleanup observer.disconnect()

SVG blob (absolute, pointer-events none, viewBox "0 0 200 56"):
- <defs><clipPath id={useId()}><rect rx=14 matching button dims></clipPath></defs>
- Three <motion.ellipse> layers inside <g clipPath>:
  1. Glow: rest shape +18rx +10ry, fillOpacity 0.22, filter blur(10px)
  2. Main: fillOpacity 0.78/0.92, variants below
  3. Specular: white ellipse, small, tracks blob top

Framer Motion variants on each ellipse:
- idle: cx/cy/rx/ry keyframe arrays, 4s repeat:Infinity repeatType:'mirror' easeInOut
  cx:[100,96,104,100] cy:[33.6,30.6,36.6,33.6] rx:[84,90,78,84] ry:[15.68,12.68,18.68,15.68]
- hovered: spring stiffness:90 damping:14 → cx=100 cy=26.88 rx=144 ry=39.2
- animate={isHovered?'hovered':'idle'}

Button:
- motion.button, 200×56, borderRadius=14, border 1.5px, overflow hidden, relative
- whileTap scale:0.97 spring stiffness:350 damping:28
- boxShadow transitions rest→hover (rgba olive glow)

Label:
- motion.span z-10, text-sm font-sans font-semibold tracking-wider
- animate color: rest→c.label, hover→c.labelHover (transition 0.22s)
- Text: "Get Started"

Entrance: motion.div opacity 0→1, y 18→0, 0.55s easeOut`,
}
