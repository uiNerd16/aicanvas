import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/liquid-button/index.tsx\`. Export a named function \`LiquidButton\`.

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
}
