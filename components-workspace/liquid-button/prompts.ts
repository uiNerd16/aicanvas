import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`LiquidButton\`: a CTA button with an organic liquid blob clipped inside it. At rest the blob slowly oscillates; on hover it surges and expands to fill most of the button. Label sits above the blob.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Stack: React + framer-motion. Use useState, useRef, useEffect, useId. Import { motion } from 'framer-motion'.

Constants (exact):
- BUTTON_W=200, BUTTON_H=56, RX=14
- Rest blob: REST_CX=100, REST_CY=33.6, REST_RX=84, REST_RY=15.68
- Hover blob: HOVER_CX=100, HOVER_CY=26.88, HOVER_RX=144, HOVER_RY=39.2
- Idle wobble: D_RX=6, D_RY=3, D_CY=3, D_CX=4

Palettes:
DARK { bg:'#110F0C', border:'#4A453F', label:'#FAF7F2', labelHover:'#110F0C', blob:'#7D8D41' }
LIGHT { bg:'#F5F1EA', border:'#DDD8CE', label:'#1C1916', labelHover:'#110F0C', blob:'#7D8D41' }

Theme detection: useEffect watches closest [data-card-theme] ancestor and falls back to document.documentElement.classList.contains('dark'). MutationObserver on both, cleanup on unmount.

Transitions:
- IDLE: { duration:4, repeat:Infinity, repeatType:'mirror', ease:'easeInOut' } — arrays of 4 keyframes for cx/cy/rx/ry
- HOVER: { type:'spring', stiffness:90, damping:14 }

Root: flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950. Wrap in motion.div with initial {opacity:0,y:18} animate {opacity:1,y:0} duration 0.55 easeOut.

motion.button: relative overflow-hidden, width/height/borderRadius from constants, 1.5px border, background=c.bg. boxShadow on hover: '0 6px 28px rgba(125,141,65,0.28), 0 1px 4px rgba(0,0,0,0.18)', else '0 2px 8px rgba(0,0,0,0.12)'. whileTap scale 0.97, spring 350/28.

Inside: SVG absolute inset-0, viewBox 0 0 200 56, pointerEvents none. defs > clipPath with unique id (useId) containing a rect 0,0,200,56 rx=14. g clipPath=url(#id) with 3 motion.ellipse:
1. Glow blob: fill=blob, fillOpacity 0.22, filter 'blur(10px)', animate to REST+18rx/+10ry keyframes idle or HOVER_RX+18/HOVER_RY+10 on hover.
2. Main blob: fill=blob, fillOpacity hover ? 0.92 : 0.78 (css transition 0.3s), animate REST keyframes or hover values.
3. Specular: fill '#fff', idle cx keyframes [REST_CX-14, -18, -10, -14] cy [REST_CY-7,-10,-5,-7] rx=18 ry=5 opacity 0.22. Hover cx=HOVER_CX-18 cy=HOVER_CY-10 rx=28 ry=8 opacity 0.35.

Label: motion.span relative z-10 flex h-full items-center justify-center font-sans text-sm font-semibold tracking-wider. animate color c.labelHover on hover else c.label, duration 0.22. Text: "Get Started".`,

  GPT: `Build a React client component named \`LiquidButton\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Imports
'use client'
import { useState, useRef, useEffect, useId } from 'react'
import { motion } from 'framer-motion'

## Constants
BUTTON_W=200, BUTTON_H=56, RX=14
REST_CX=100, REST_CY=33.6, REST_RX=84, REST_RY=15.68
HOVER_CX=100, HOVER_CY=26.88, HOVER_RX=144, HOVER_RY=39.2
D_RX=6, D_RY=3, D_CY=3, D_CX=4

DARK = { bg:'#110F0C', border:'#4A453F', label:'#FAF7F2', labelHover:'#110F0C', blob:'#7D8D41' }
LIGHT = { bg:'#F5F1EA', border:'#DDD8CE', label:'#1C1916', labelHover:'#110F0C', blob:'#7D8D41' }

IDLE_TRANSITION = { duration:4, repeat:Infinity, repeatType:'mirror', ease:'easeInOut' }
HOVER_TRANSITION = { type:'spring', stiffness:90, damping:14 }

## State
- isDark (default true)
- isHovered (default false)
- containerRef on wrapper div
- clipId = \`lbclip-\${useId()}\`

## Theme detection effect
function check(): card = el.closest('[data-card-theme]'); setIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'))
MutationObserver on documentElement and cardWrapper (if exists) attributeFilter ['class']. Cleanup: observer.disconnect().

## Blob animate objects
mainBlobAnimate: hover -> {cx:HOVER_CX, cy:HOVER_CY, rx:HOVER_RX, ry:HOVER_RY, transition:HOVER_TRANSITION}
  idle -> cx:[REST_CX, REST_CX-D_CX, REST_CX+D_CX, REST_CX], cy same pattern w D_CY, rx:[REST_RX, +D_RX, -D_RX, REST_RX], ry:[REST_RY, -D_RY, +D_RY, REST_RY], transition:IDLE_TRANSITION

glowBlobAnimate: same keyframe pattern but radii use REST_RX+18 and REST_RY+10; hover uses HOVER_RX+18, HOVER_RY+10.

specularAnimate: hover -> {cx:HOVER_CX-18, cy:HOVER_CY-10, rx:28, ry:8, opacity:0.35, HOVER_TRANSITION}
  idle -> cx:[REST_CX-14, REST_CX-18, REST_CX-10, REST_CX-14], cy:[REST_CY-7, REST_CY-10, REST_CY-5, REST_CY-7], rx:18, ry:5, opacity:0.22, IDLE_TRANSITION.

## JSX structure
<div ref=containerRef className="flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950">
  <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.55,ease:'easeOut'}}>
    <motion.button onMouseEnter/Leave setIsHovered, whileTap={{scale:0.97}} transition spring 350/28,
      className="relative cursor-pointer overflow-hidden font-sans"
      style={{ width:200, height:56, borderRadius:14, border:\`1.5px solid \${c.border}\`, background:c.bg,
        boxShadow: isHovered ? '0 6px 28px rgba(125,141,65,0.28), 0 1px 4px rgba(0,0,0,0.18)' : '0 2px 8px rgba(0,0,0,0.12)',
        transition:'box-shadow 0.35s ease' }}>
      <svg aria-hidden viewBox="0 0 200 56" width=200 height=56 className="absolute inset-0" style={{pointerEvents:'none'}}>
        <defs><clipPath id={clipId}><rect x=0 y=0 width=200 height=56 rx=14 ry=14/></clipPath></defs>
        <g clipPath={\`url(#\${clipId})\`}>
          <motion.ellipse animate={glowBlobAnimate} fill={c.blob} fillOpacity={0.22} style={{filter:'blur(10px)'}}/>
          <motion.ellipse animate={mainBlobAnimate} fill={c.blob} fillOpacity={isHovered?0.92:0.78} style={{transition:'fill-opacity 0.3s ease'}}/>
          <motion.ellipse animate={specularAnimate} fill="#fff"/>
        </g>
      </svg>
      <motion.span className="relative z-10 flex h-full items-center justify-center font-sans text-sm font-semibold tracking-wider" animate={{color:isHovered?c.labelHover:c.label}} transition={{duration:0.22}}>Get Started</motion.span>
    </motion.button>
  </motion.div>
</div>`,

  Gemini: `Implement a React client component named \`LiquidButton\` as a single TypeScript file. It is a CTA with an organic liquid blob clipped inside; idle blob oscillates slowly, hover surges it to fill the button.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useRef, useEffect, useId } from 'react'
import { motion } from 'framer-motion'

USE these hooks and no others. DO NOT invent hooks not shown above. Only use motion.div, motion.button, motion.span, motion.ellipse from framer-motion.

## Constants (copy verbatim)
const BUTTON_W = 200, BUTTON_H = 56, RX = 14
const REST_CX = 100, REST_CY = 33.6, REST_RX = 84, REST_RY = 15.68
const HOVER_CX = 100, HOVER_CY = 26.88, HOVER_RX = 144, HOVER_RY = 39.2
const D_RX = 6, D_RY = 3, D_CY = 3, D_CX = 4
const DARK = { bg:'#110F0C', border:'#4A453F', label:'#FAF7F2', labelHover:'#110F0C', blob:'#7D8D41' }
const LIGHT = { bg:'#F5F1EA', border:'#DDD8CE', label:'#1C1916', labelHover:'#110F0C', blob:'#7D8D41' }
const IDLE_TRANSITION = { duration:4, repeat:Infinity, repeatType:'mirror' as const, ease:'easeInOut' as const }
const HOVER_TRANSITION = { type:'spring' as const, stiffness:90, damping:14 }

## State
- const containerRef = useRef<HTMLDivElement>(null)
- const [isDark, setIsDark] = useState(true)
- const [isHovered, setIsHovered] = useState(false)
- const uid = useId(); const clipId = \`lbclip-\${uid}\`

## Theme detection effect
useEffect once: el=containerRef.current; if null return. function check() { const card = el.closest('[data-card-theme]'); setIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark')) }. Call check(). const observer = new MutationObserver(check). observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']}). If cardWrapper found, observe it too. return () => observer.disconnect().

## Animate objects (compute each render)
mainBlobAnimate = isHovered
  ? { cx:HOVER_CX, cy:HOVER_CY, rx:HOVER_RX, ry:HOVER_RY, transition:HOVER_TRANSITION }
  : { cx:[REST_CX,REST_CX-D_CX,REST_CX+D_CX,REST_CX], cy:[REST_CY,REST_CY-D_CY,REST_CY+D_CY,REST_CY], rx:[REST_RX,REST_RX+D_RX,REST_RX-D_RX,REST_RX], ry:[REST_RY,REST_RY-D_RY,REST_RY+D_RY,REST_RY], transition:IDLE_TRANSITION }

glowBlobAnimate: hover -> same cx/cy as main hover plus rx:HOVER_RX+18, ry:HOVER_RY+10. Idle -> same cx/cy arrays; rx:[REST_RX+18,REST_RX+18+D_RX,REST_RX+18-D_RX,REST_RX+18]; ry:[REST_RY+10,REST_RY+10-D_RY,REST_RY+10+D_RY,REST_RY+10].

specularAnimate: hover -> {cx:HOVER_CX-18, cy:HOVER_CY-10, rx:28, ry:8, opacity:0.35, transition:HOVER_TRANSITION}. Idle -> {cx:[REST_CX-14,REST_CX-18,REST_CX-10,REST_CX-14], cy:[REST_CY-7,REST_CY-10,REST_CY-5,REST_CY-7], rx:18, ry:5, opacity:0.22, transition:IDLE_TRANSITION}.

const c = isDark ? DARK : LIGHT

## JSX
Outer <div ref={containerRef} className="flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950">.
Inside <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.55,ease:'easeOut'}}>.
<motion.button onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} whileTap={{scale:0.97}} transition={{type:'spring',stiffness:350,damping:28}} className="relative cursor-pointer overflow-hidden font-sans" style={{width:BUTTON_W, height:BUTTON_H, borderRadius:RX, border:\`1.5px solid \${c.border}\`, background:c.bg, boxShadow:isHovered?'0 6px 28px rgba(125,141,65,0.28), 0 1px 4px rgba(0,0,0,0.18)':'0 2px 8px rgba(0,0,0,0.12)', transition:'box-shadow 0.35s ease'}}>

Inside button: <svg aria-hidden="true" viewBox="0 0 200 56" width={200} height={56} className="absolute inset-0" style={{pointerEvents:'none'}}><defs><clipPath id={clipId}><rect x="0" y="0" width={200} height={56} rx={14} ry={14}/></clipPath></defs><g clipPath={\`url(#\${clipId})\`}>... three motion.ellipse as defined above ...</g></svg>

Label: <motion.span className="relative z-10 flex h-full items-center justify-center font-sans text-sm font-semibold tracking-wider" animate={{color:isHovered?c.labelHover:c.label}} transition={{duration:0.22}}>Get Started</motion.span>

Main ellipse fillOpacity is isHovered?0.92:0.78 with style={{transition:'fill-opacity 0.3s ease'}}. Glow ellipse fill={c.blob} fillOpacity={0.22} style={{filter:'blur(10px)'}}. Specular fill="#fff".`,

  V0: `Create a React client component named \`LiquidButton\`. Single file, TypeScript, \`'use client'\` at the top. Use \`useState\`, \`useRef\`, \`useEffect\`, and \`useId\` from React, plus \`motion\` from \`framer-motion\`. The component fills its parent (\`h-full w-full\`) and supports both light and dark themes.

## The visual
A single CTA button — fixed 200×56 pixels, 14px rounded corners — sitting centred in its container. Inside the button lives an organic, olive-green liquid blob, clipped to the button's rounded shape so it can never spill out. At rest the blob is a wide, flat ellipse parked in the lower half of the button, very slowly breathing: centre drifts side-to-side by a few pixels, radii wobble gently. On hover it surges upward and outward in a soft spring, swelling to nearly fill the button interior. Label text sits above the liquid on the z-axis, reading exactly \`Get Started\` — 14px, semibold, letter-spacing wider than normal (roughly the Tailwind \`tracking-wider\` value).

The button casts a subtle shadow at rest and a warm, olive-tinted halo on hover. It scales down to 0.97 on press with a stiff spring. The whole thing fades in from 18px below with a 0.55s ease-out entrance.

## Theme
Detect theme by checking \`.closest('[data-card-theme]')\` for a \`.dark\` class, falling back to \`document.documentElement.classList.contains('dark')\`. Track it with \`useState isDark\` and watch for changes with a \`MutationObserver\` on both \`documentElement\` and the card wrapper (if present), listening for class attribute changes. Disconnect on unmount.

The two palettes (copy exactly):
- **Dark**: background \`#110F0C\`, border \`#4A453F\`, label \`#FAF7F2\`, label-on-hover \`#110F0C\`, blob \`#7D8D41\` (olive).
- **Light**: background \`#F5F1EA\`, border \`#DDD8CE\`, label \`#1C1916\`, label-on-hover \`#110F0C\`, blob \`#7D8D41\` (same olive — only the surface changes).

The blob stays olive in both modes. Notice the label colour flips to the near-black \`#110F0C\` on hover in both themes — this gives the text good contrast against the bright blob once it has filled the button.

## Geometry constants
- Button: \`BUTTON_W = 200\`, \`BUTTON_H = 56\`, corner radius \`RX = 14\`.
- Rest blob ellipse (the lazy puddle): \`REST_CX = 100\`, \`REST_CY = 33.6\`, \`REST_RX = 84\`, \`REST_RY = 15.68\`.
- Hover blob ellipse (the surge): \`HOVER_CX = 100\`, \`HOVER_CY = 26.88\`, \`HOVER_RX = 144\`, \`HOVER_RY = 39.2\`.
- Idle wobble deltas: \`D_RX = 6\`, \`D_RY = 3\`, \`D_CX = 4\`, \`D_CY = 3\`.

## Animation timing
- Idle oscillation: \`{ duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }\` — a gentle 4-second breath, mirrored so it never snaps.
- Hover surge: \`{ type: 'spring', stiffness: 90, damping: 14 }\` — soft and slightly bouncy, like liquid settling.
- Press scale: spring \`{ stiffness: 350, damping: 28 }\` — snappy tap feedback.
- Label colour crossfade: 0.22s.
- Entrance: 0.55s ease-out, fades up 18px.

## Structure
Outer wrapper is \`<div ref={containerRef} className="flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950">\`. Inside it, a \`motion.div\` handles the entrance. Inside that, a \`motion.button\` with \`onMouseEnter\`/\`onMouseLeave\` flipping \`isHovered\`, \`whileTap={{ scale: 0.97 }}\`, and inline style carrying width, height, borderRadius, 1.5px solid border, background, and a box-shadow that switches between:
- Rest: \`0 2px 8px rgba(0,0,0,0.12)\`
- Hover: \`0 6px 28px rgba(125,141,65,0.28), 0 1px 4px rgba(0,0,0,0.18)\`

Also set \`transition: 'box-shadow 0.35s ease'\` in the same inline style so the shadow crossfades smoothly. Tailwind classes on the button: \`relative cursor-pointer overflow-hidden font-sans\`.

## The liquid layer (SVG)
Inside the button, an absolute-positioned \`<svg>\` filling \`inset-0\` with \`viewBox="0 0 200 56"\`, width 200, height 56, \`aria-hidden="true"\`, \`pointerEvents: 'none'\`. In \`<defs>\` put a \`<clipPath>\` with a unique id built from \`useId()\` (so multiple instances don't collide), containing a \`<rect>\` sized 200×56 with \`rx=14 ry=14\` — this matches the button's rounded corners exactly. Everything that follows is wrapped in a \`<g clipPath={\`url(#\${clipId})\`}>\` so the blob can go wild without spilling.

Inside that group, three stacked \`motion.ellipse\` elements — order matters, back to front:

1. **Diffuse glow** — \`fill={c.blob}\`, \`fillOpacity={0.22}\`, \`style={{ filter: 'blur(10px)' }}\`. This is the soft halo. Its radii are the blob's radii plus 18 horizontal and 10 vertical, so it always reads as a wider, softer ghost behind the main shape. At rest it wobbles on the same timing as the main blob. On hover its target is \`rx: HOVER_RX + 18\`, \`ry: HOVER_RY + 10\`, same centre as the main blob's hover position.

2. **Main solid blob** — \`fill={c.blob}\` (that olive \`#7D8D41\`), \`fillOpacity={isHovered ? 0.92 : 0.78}\`, with \`style={{ transition: 'fill-opacity 0.3s ease' }}\` so the opacity bump crossfades. At rest, animate four-keyframe arrays for cx/cy/rx/ry that mirror between the rest values and rest ± the wobble deltas (e.g. \`cx: [REST_CX, REST_CX - D_CX, REST_CX + D_CX, REST_CX]\`). On hover, snap the animate target to the hover geometry with the spring transition.

3. **Specular highlight** — \`fill="#fff"\`. This is the tiny glint on the blob's upper-left. At rest, cx drifts through \`[REST_CX-14, REST_CX-18, REST_CX-10, REST_CX-14]\` and cy through \`[REST_CY-7, REST_CY-10, REST_CY-5, REST_CY-7]\`, with fixed \`rx: 18\`, \`ry: 5\`, \`opacity: 0.22\`. On hover it jumps to \`cx: HOVER_CX - 18\`, \`cy: HOVER_CY - 10\`, \`rx: 28\`, \`ry: 8\`, \`opacity: 0.35\`, same spring transition.

Build each of these as an \`animate\` object you compute every render by branching on \`isHovered\`. This is simpler than variants and avoids TypeScript friction with SVG attribute types.

## Label
A \`motion.span\` after the SVG, classes \`relative z-10 flex h-full items-center justify-center font-sans text-sm font-semibold tracking-wider\`. The \`z-10\` is critical — it keeps the text above the liquid. Animate \`color\` between \`c.label\` and \`c.labelHover\` based on \`isHovered\` with a 0.22s transition. The exact text is \`Get Started\` (capital G, capital S, one space).

## Interaction
Hover state lives in a single \`useState isHovered\` toggled by \`onMouseEnter\`/\`onMouseLeave\` on the button. No mouse-tracking — the liquid reacts to hover state, not cursor position.

The finished piece should feel tactile and a little playful: at rest it's a quiet button with something alive inside it, and on hover that something swells up to meet you.`,
}
