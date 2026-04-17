import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

Create a React client component named \`DangerStripes\`: three yellow caution-tape stripes crossing over each other on a near-black background. Each stripe has repeating bold text. On hover, the stripes shake with random jitter. On click, the shaking intensifies. On mouse leave, the shaking decays smoothly.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types. Do not use any design tokens or theme variables — use raw hex values only.

Imports: useCallback, useEffect, useRef from 'react'; motion from 'framer-motion'.

Constants:
- STRIPE_TEXT = 'WORK IN PROGRESS  •  DO NOT CLICK OR HOVER  •  DANGER' (use \\u00A0 for non-breaking spaces around bullets)
- STRIPES array: 3 objects each with rotate (number) and top (string percentage)
  - { rotate: -20, top: '40%' }
  - { rotate: 12, top: '47%' }
  - { rotate: -8, top: '54%' }

Sub-component RepeatingText:
- Repeats STRIPE_TEXT + ' • ' 10 times into a single string
- Renders in a whitespace-nowrap div
- Text: text-sm on mobile, text-base on sm+, font-black (weight 900), tracking-widest, text-black, uppercase

Helper: random(min, max) returns Math.random() * (max - min) + min

Main component DangerStripes:
- Refs: rafRef (number, 0), hoveringRef (boolean, false), clickedRef (boolean, false), intensityRef (number, 0), stripesRef (array of HTMLDivElement | null)
- No useState for animation — all animation state in refs for performance

animateStripes (useCallback, no deps):
- If hovering or clicked: lerp intensityRef toward target (clicked ? 3 : 1) with factor 0.15
- Else: decay intensityRef by multiplying 0.92 each frame
- When intensity < 0.005 and not hovering/clicked: reset all stripe transforms to just rotate(baseDeg), clear rafRef, return
- Otherwise: for each stripe, compute random jitter:
  - tx = random(-18, 18) * intensity
  - ty = random(-10, 10) * intensity
  - skewX = random(-6, 6) * intensity
  - scale = 1 + random(-0.04, 0.04) * intensity
  - Apply: el.style.transform = \`rotate(\${base}deg) translate(\${tx}px, \${ty}px) skewX(\${skewX}deg) scale(\${sc})\`
- Schedule next frame via requestAnimationFrame

Cleanup effect: cancel RAF on unmount.

startLoop: if rafRef is 0, start the RAF loop.
triggerHover: set hoveringRef true, call startLoop.
triggerClick: set clickedRef true, call startLoop, setTimeout 500ms to set clickedRef false.
triggerLeave: set hoveringRef false (loop continues with decay).

Root element: div, className "flex min-h-screen w-full items-center justify-center", style background #0a0a0a.
Inner container: div, className "relative h-full w-full overflow-hidden select-none", style minHeight 100vh.

Each stripe: motion.div with ref stored in stripesRef array.
- className: "absolute left-[-40%] flex h-[44px] w-[180%] items-center overflow-hidden sm:h-[52px]"
- style:
  - top: stripe.top
  - background: linear-gradient(180deg, #FFE44D 0%, #FFD600 50%, #E6BF00 100%)
  - boxShadow: '0 4px 24px rgba(0,0,0,0.8), 0 1px 8px rgba(0,0,0,0.6)'
  - willChange: 'transform'
  - cursor: 'pointer'
- Framer Motion entrance: initial { x: alternating -300/300 per index, opacity: 0, rotate: stripe.rotate }, animate { x: 0, opacity: 1, rotate: stripe.rotate }, transition { duration: 0.6, delay: i * 0.12, ease: 'easeOut' }
- Event handlers: onMouseEnter=triggerHover, onMouseLeave=triggerLeave, onClick=triggerClick, onTouchStart=triggerHover, onTouchEnd triggers click then leave after 600ms
- Children: <RepeatingText />`,

  'Lovable': `Create a React client component named \`DangerStripes\`: three yellow caution-tape stripes crossing over each other on a near-black background. Each stripe has repeating bold text. On hover, the stripes shake with random jitter. On click, the shaking intensifies. On mouse leave, the shaking decays smoothly.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types. Do not use any design tokens or theme variables — use raw hex values only.

Imports: useCallback, useEffect, useRef from 'react'; motion from 'framer-motion'.

Constants:
- STRIPE_TEXT = 'WORK IN PROGRESS  •  DO NOT CLICK OR HOVER  •  DANGER' (use \\u00A0 for non-breaking spaces around bullets)
- STRIPES array: 3 objects each with rotate (number) and top (string percentage)
  - { rotate: -20, top: '40%' }
  - { rotate: 12, top: '47%' }
  - { rotate: -8, top: '54%' }

Sub-component RepeatingText:
- Repeats STRIPE_TEXT + ' • ' 10 times into a single string
- Renders in a whitespace-nowrap div
- Text: text-sm on mobile, text-base on sm+, font-black (weight 900), tracking-widest, text-black, uppercase

Helper: random(min, max) returns Math.random() * (max - min) + min

Main component DangerStripes:
- Refs: rafRef (number, 0), hoveringRef (boolean, false), clickedRef (boolean, false), intensityRef (number, 0), stripesRef (array of HTMLDivElement | null)
- No useState for animation — all animation state in refs for performance

animateStripes (useCallback, no deps):
- If hovering or clicked: lerp intensityRef toward target (clicked ? 3 : 1) with factor 0.15
- Else: decay intensityRef by multiplying 0.92 each frame
- When intensity < 0.005 and not hovering/clicked: reset all stripe transforms to just rotate(baseDeg), clear rafRef, return
- Otherwise: for each stripe, compute random jitter:
  - tx = random(-18, 18) * intensity
  - ty = random(-10, 10) * intensity
  - skewX = random(-6, 6) * intensity
  - scale = 1 + random(-0.04, 0.04) * intensity
  - Apply: el.style.transform = \`rotate(\${base}deg) translate(\${tx}px, \${ty}px) skewX(\${skewX}deg) scale(\${sc})\`
- Schedule next frame via requestAnimationFrame

Cleanup effect: cancel RAF on unmount.

startLoop: if rafRef is 0, start the RAF loop.
triggerHover: set hoveringRef true, call startLoop.
triggerClick: set clickedRef true, call startLoop, setTimeout 500ms to set clickedRef false.
triggerLeave: set hoveringRef false (loop continues with decay).

Root element: div, className "flex min-h-screen w-full items-center justify-center", style background #0a0a0a.
Inner container: div, className "relative h-full w-full overflow-hidden select-none", style minHeight 100vh.

Each stripe: motion.div with ref stored in stripesRef array.
- className: "absolute left-[-40%] flex h-[44px] w-[180%] items-center overflow-hidden sm:h-[52px]"
- style:
  - top: stripe.top
  - background: linear-gradient(180deg, #FFE44D 0%, #FFD600 50%, #E6BF00 100%)
  - boxShadow: '0 4px 24px rgba(0,0,0,0.8), 0 1px 8px rgba(0,0,0,0.6)'
  - willChange: 'transform'
  - cursor: 'pointer'
- Framer Motion entrance: initial { x: alternating -300/300 per index, opacity: 0, rotate: stripe.rotate }, animate { x: 0, opacity: 1, rotate: stripe.rotate }, transition { duration: 0.6, delay: i * 0.12, ease: 'easeOut' }
- Event handlers: onMouseEnter=triggerHover, onMouseLeave=triggerLeave, onClick=triggerClick, onTouchStart=triggerHover, onTouchEnd triggers click then leave after 600ms
- Children: <RepeatingText />`,

  'V0': `Create a React client component named \`DangerStripes\`: three yellow caution-tape stripes crossing over each other on a near-black background. Each stripe has repeating bold text. On hover, the stripes shake with random jitter. On click, the shaking intensifies. On mouse leave, the shaking decays smoothly.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types. Do not use any design tokens or theme variables — use raw hex values only.

Imports: useCallback, useEffect, useRef from 'react'; motion from 'framer-motion'.

Constants:
- STRIPE_TEXT = 'WORK IN PROGRESS  •  DO NOT CLICK OR HOVER  •  DANGER' (use \\u00A0 for non-breaking spaces around bullets)
- STRIPES array: 3 objects each with rotate (number) and top (string percentage)
  - { rotate: -20, top: '40%' }
  - { rotate: 12, top: '47%' }
  - { rotate: -8, top: '54%' }

Sub-component RepeatingText:
- Repeats STRIPE_TEXT + ' • ' 10 times into a single string
- Renders in a whitespace-nowrap div
- Text: text-sm on mobile, text-base on sm+, font-black (weight 900), tracking-widest, text-black, uppercase

Helper: random(min, max) returns Math.random() * (max - min) + min

Main component DangerStripes:
- Refs: rafRef (number, 0), hoveringRef (boolean, false), clickedRef (boolean, false), intensityRef (number, 0), stripesRef (array of HTMLDivElement | null)
- No useState for animation — all animation state in refs for performance

animateStripes (useCallback, no deps):
- If hovering or clicked: lerp intensityRef toward target (clicked ? 3 : 1) with factor 0.15
- Else: decay intensityRef by multiplying 0.92 each frame
- When intensity < 0.005 and not hovering/clicked: reset all stripe transforms to just rotate(baseDeg), clear rafRef, return
- Otherwise: for each stripe, compute random jitter:
  - tx = random(-18, 18) * intensity
  - ty = random(-10, 10) * intensity
  - skewX = random(-6, 6) * intensity
  - scale = 1 + random(-0.04, 0.04) * intensity
  - Apply: el.style.transform = \`rotate(\${base}deg) translate(\${tx}px, \${ty}px) skewX(\${skewX}deg) scale(\${sc})\`
- Schedule next frame via requestAnimationFrame

Cleanup effect: cancel RAF on unmount.

startLoop: if rafRef is 0, start the RAF loop.
triggerHover: set hoveringRef true, call startLoop.
triggerClick: set clickedRef true, call startLoop, setTimeout 500ms to set clickedRef false.
triggerLeave: set hoveringRef false (loop continues with decay).

Root element: div, className "flex min-h-screen w-full items-center justify-center", style background #0a0a0a.
Inner container: div, className "relative h-full w-full overflow-hidden select-none", style minHeight 100vh.

Each stripe: motion.div with ref stored in stripesRef array.
- className: "absolute left-[-40%] flex h-[44px] w-[180%] items-center overflow-hidden sm:h-[52px]"
- style:
  - top: stripe.top
  - background: linear-gradient(180deg, #FFE44D 0%, #FFD600 50%, #E6BF00 100%)
  - boxShadow: '0 4px 24px rgba(0,0,0,0.8), 0 1px 8px rgba(0,0,0,0.6)'
  - willChange: 'transform'
  - cursor: 'pointer'
- Framer Motion entrance: initial { x: alternating -300/300 per index, opacity: 0, rotate: stripe.rotate }, animate { x: 0, opacity: 1, rotate: stripe.rotate }, transition { duration: 0.6, delay: i * 0.12, ease: 'easeOut' }
- Event handlers: onMouseEnter=triggerHover, onMouseLeave=triggerLeave, onClick=triggerClick, onTouchStart=triggerHover, onTouchEnd triggers click then leave after 600ms
- Children: <RepeatingText />`,
}
