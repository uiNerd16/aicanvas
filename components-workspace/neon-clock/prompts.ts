import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/neon-clock/index.tsx\`. Export a named function \`NeonClock\`.

## Requirements

\`\`\`
'use client'
Imports: useState, useEffect, useRef from react; motion, AnimatePresence from framer-motion
\`\`\`

## Constants (inline styles — Tailwind cannot do multi-layer text-shadow)

\`\`\`
GLOW_NORMAL = '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0ff, 0 0 82px #0ff, 0 0 92px #0ff, 0 0 102px #0ff'
GLOW_HOVER  = '0 0 7px #fff, 0 0 14px #fff, 0 0 28px #fff, 0 0 56px #0ff, 0 0 100px #0ff, 0 0 130px #0ff, 0 0 160px #0ff, 0 0 200px #0ff'
COLON_GLOW  = '0 0 5px #fff, 0 0 8px #fff, 0 0 16px #0ff, 0 0 32px #0ff, 0 0 60px #0ff'
\`\`\`

## State
- \`time: { hh: string; mm: string; ss: string }\` — zero-padded integers from new Date()
- \`hovered: boolean\` — toggled by onMouseEnter/onMouseLeave on root div
- \`flickering: boolean\` — true for 80ms when ss changes each tick

## Clock effect
useEffect with setInterval(1000ms):
1. Get new time parts
2. Update \`time\` state
3. If new ss !== prevSs (track via useRef): set flickering=true, setTimeout 80ms to set false. Store prevSs ref.
4. Return clearInterval on unmount.

## Sub-component: DigitGroup({ value: string, glow: string })
- Wraps each two-digit group (hh, mm, ss)
- \`<AnimatePresence mode="wait" initial={false}>\`
- \`<motion.span key={value} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} exit={{ opacity: 0.4 }} transition={{ duration: 0.15, ease: 'easeOut' }}\`
- Apply glow via inline style textShadow
- fontVariantNumeric: 'tabular-nums'

## Sub-component: ColonSep({ glow: string, blink: boolean })
- \`<motion.span animate={{ opacity: blink ? 0.4 : 1 }} transition={{ duration: 0.06 }}\`
- marginInline: '0.06em', color: '#b0ffff', textShadow: glow

## Root layout
- Root: \`className="flex h-full w-full items-center justify-center bg-sand-950"\`
- position: relative (for the ambient glow child)
- onMouseEnter/Leave set hovered state

## Clock display wrapper (motion.div)
- animate={{ opacity: flickering ? 0.55 : 1 }}, transition: duration 0.06, ease linear
- fontFamily: "'Courier New', 'Lucida Console', monospace"
- fontSize: "clamp(2.5rem, 10vw, 5rem)"
- fontWeight: 700, letterSpacing: '0.08em', color: '#e0ffff', lineHeight: 1
- Children: DigitGroup(hh) ColonSep ColonSep(mm) ColonSep DigitGroup(ss)
- Pass glow = hovered ? GLOW_HOVER : GLOW_NORMAL to DigitGroups

## Ambient floor glow (position absolute)
- motion.div, pointerEvents: none
- position absolute, bottom '18%', width '55%', height 40, borderRadius '50%'
- background: 'radial-gradient(ellipse at center, #0ff 0%, transparent 70%)'
- filter: 'blur(18px)'
- animate={{ opacity: hovered ? 0.35 : 0.18, scaleX: hovered ? 1.2 : 1 }}
- transition: duration 0.5, ease easeOut

## TypeScript
- No any, no type assertions
- All component props typed via interface`,
}
