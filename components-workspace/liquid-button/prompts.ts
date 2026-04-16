import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

Create a React client component named \`LiquidButton\`: a CTA button with an organic liquid blob clipped inside it. At rest the blob slowly oscillates; on hover it surges and expands to fill most of the button. Label sits above the blob.

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

Root: flex h-full w-full items-center justify-center bg-[#E8E8DF] dark:bg-[#1A1A19]. Wrap in motion.div with initial {opacity:0,y:18} animate {opacity:1,y:0} duration 0.55 easeOut.

motion.button: relative overflow-hidden, width/height/borderRadius from constants, 1.5px border, background=c.bg. boxShadow on hover: '0 6px 28px rgba(125,141,65,0.28), 0 1px 4px rgba(0,0,0,0.18)', else '0 2px 8px rgba(0,0,0,0.12)'. whileTap scale 0.97, spring 350/28.

Inside: SVG absolute inset-0, viewBox 0 0 200 56, pointerEvents none. defs > clipPath with unique id (useId) containing a rect 0,0,200,56 rx=14. g clipPath=url(#id) with 3 motion.ellipse:
1. Glow blob: fill=blob, fillOpacity 0.22, filter 'blur(10px)', animate to REST+18rx/+10ry keyframes idle or HOVER_RX+18/HOVER_RY+10 on hover.
2. Main blob: fill=blob, fillOpacity hover ? 0.92 : 0.78 (css transition 0.3s), animate REST keyframes or hover values.
3. Specular: fill '#fff', idle cx keyframes [REST_CX-14, -18, -10, -14] cy [REST_CY-7,-10,-5,-7] rx=18 ry=5 opacity 0.22. Hover cx=HOVER_CX-18 cy=HOVER_CY-10 rx=28 ry=8 opacity 0.35.

Label: motion.span relative z-10 flex h-full items-center justify-center font-sans text-sm font-semibold tracking-wider. animate color c.labelHover on hover else c.label, duration 0.22. Text: "Get Started".

## Typography
- Font: project default sans-serif
- Sizes: 14px
- Weights: 600`,

  'Lovable': `Create a React client component named \`LiquidButton\`: a CTA button with an organic liquid blob clipped inside it. At rest the blob slowly oscillates; on hover it surges and expands to fill most of the button. Label sits above the blob.

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

Root: flex h-full w-full items-center justify-center bg-[#E8E8DF] dark:bg-[#1A1A19]. Wrap in motion.div with initial {opacity:0,y:18} animate {opacity:1,y:0} duration 0.55 easeOut.

motion.button: relative overflow-hidden, width/height/borderRadius from constants, 1.5px border, background=c.bg. boxShadow on hover: '0 6px 28px rgba(125,141,65,0.28), 0 1px 4px rgba(0,0,0,0.18)', else '0 2px 8px rgba(0,0,0,0.12)'. whileTap scale 0.97, spring 350/28.

Inside: SVG absolute inset-0, viewBox 0 0 200 56, pointerEvents none. defs > clipPath with unique id (useId) containing a rect 0,0,200,56 rx=14. g clipPath=url(#id) with 3 motion.ellipse:
1. Glow blob: fill=blob, fillOpacity 0.22, filter 'blur(10px)', animate to REST+18rx/+10ry keyframes idle or HOVER_RX+18/HOVER_RY+10 on hover.
2. Main blob: fill=blob, fillOpacity hover ? 0.92 : 0.78 (css transition 0.3s), animate REST keyframes or hover values.
3. Specular: fill '#fff', idle cx keyframes [REST_CX-14, -18, -10, -14] cy [REST_CY-7,-10,-5,-7] rx=18 ry=5 opacity 0.22. Hover cx=HOVER_CX-18 cy=HOVER_CY-10 rx=28 ry=8 opacity 0.35.

Label: motion.span relative z-10 flex h-full items-center justify-center font-sans text-sm font-semibold tracking-wider. animate color c.labelHover on hover else c.label, duration 0.22. Text: "Get Started".

## Typography
- Font: project default sans-serif
- Sizes: 14px
- Weights: 600`,

  'V0': `Create a React client component named \`LiquidButton\`: a CTA button with an organic liquid blob clipped inside it. At rest the blob slowly oscillates; on hover it surges and expands to fill most of the button. Label sits above the blob.

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

Root: flex h-full w-full items-center justify-center bg-[#E8E8DF] dark:bg-[#1A1A19]. Wrap in motion.div with initial {opacity:0,y:18} animate {opacity:1,y:0} duration 0.55 easeOut.

motion.button: relative overflow-hidden, width/height/borderRadius from constants, 1.5px border, background=c.bg. boxShadow on hover: '0 6px 28px rgba(125,141,65,0.28), 0 1px 4px rgba(0,0,0,0.18)', else '0 2px 8px rgba(0,0,0,0.12)'. whileTap scale 0.97, spring 350/28.

Inside: SVG absolute inset-0, viewBox 0 0 200 56, pointerEvents none. defs > clipPath with unique id (useId) containing a rect 0,0,200,56 rx=14. g clipPath=url(#id) with 3 motion.ellipse:
1. Glow blob: fill=blob, fillOpacity 0.22, filter 'blur(10px)', animate to REST+18rx/+10ry keyframes idle or HOVER_RX+18/HOVER_RY+10 on hover.
2. Main blob: fill=blob, fillOpacity hover ? 0.92 : 0.78 (css transition 0.3s), animate REST keyframes or hover values.
3. Specular: fill '#fff', idle cx keyframes [REST_CX-14, -18, -10, -14] cy [REST_CY-7,-10,-5,-7] rx=18 ry=5 opacity 0.22. Hover cx=HOVER_CX-18 cy=HOVER_CY-10 rx=28 ry=8 opacity 0.35.

Label: motion.span relative z-10 flex h-full items-center justify-center font-sans text-sm font-semibold tracking-wider. animate color c.labelHover on hover else c.label, duration 0.22. Text: "Get Started".

## Typography
- Font: project default sans-serif
- Sizes: 14px
- Weights: 600`,
}
