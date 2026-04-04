import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a live digital clock component called NeonClock that shows the current time in HH:MM:SS format with a stunning neon glow effect.

The clock should feel like a real neon tube sign — bright cyan digits that bleed light into the darkness around them. The background is always deep black (#110F0C). The font should be large, bold, and monospace (Courier New or similar) with a color of #e0ffff.

Apply a multi-layered CSS text-shadow for the neon glow effect using inline styles — white inner core blending out to wide cyan halos. Every second, when the digits change, trigger a very quick flicker (opacity dips to about 55% for 80ms) across the entire display, making it feel like a real neon tube. The colons between digit groups should share a similar but slightly dimmer glow.

When the user hovers over the clock, the glow should intensify noticeably — the cyan halos spread wider and brighter — and a soft ambient floor glow (a blurred ellipse at the bottom) should also grow slightly.

Use Framer Motion for the flicker animation and the per-digit-group entrance on change. Use React useState and useEffect with a 1000ms setInterval to update the time. Clean up the interval on unmount.

The component should scale fluidly — no hardcoded pixel widths — and fill its container. Overall vibe: moody, cinematic, retro-futuristic.`,

  Bolt: `Build a React component called NeonClock using Framer Motion that displays a live clock in HH:MM:SS format with a neon glow aesthetic.

Stack: React, Tailwind CSS, Framer Motion.

Key implementation details:

State: useState for { hh, mm, ss } strings (zero-padded). useEffect with setInterval(1000ms) to update. Clean up interval on unmount.

Styling: Large monospace font (Courier New), color #e0ffff, always-dark background (#110F0C). Apply neon glow via inline textShadow:
- Normal: '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0ff, 0 0 82px #0ff, 0 0 92px #0ff, 0 0 102px #0ff'
- Hover:  '0 0 7px #fff, 0 0 14px #fff, 0 0 28px #fff, 0 0 56px #0ff, 0 0 100px #0ff, 0 0 130px #0ff, 0 0 160px #0ff, 0 0 200px #0ff'

Hover state: useState boolean, applied via onMouseEnter/onMouseLeave on the outer wrapper. Switches between normal and hover glow strings.

Flicker animation: Each second, when seconds value changes, set a flickering boolean true for 80ms then false. Use Framer Motion animate to drop the whole display opacity to 0.55 and back. Colons also dim to 0.4 during flicker.

Per-digit-group animation: Wrap HH, MM, SS each in AnimatePresence + motion.span with key={value}. On mount: opacity 0.4 → 1, duration 0.15s easeOut.

Ambient floor glow: An absolutely-positioned blurred ellipse below the digits (radial-gradient cyan, filter blur 18px) that grows slightly on hover using Framer Motion animate.

Font size: clamp(2.5rem, 10vw, 5rem). No hardcoded widths.`,

  Lovable: `I'd love a component that feels like a glowing neon sign in a dark, rainy alley — the kind you'd see in a cyberpunk film or a late-night diner from the future.

The clock shows HH:MM:SS in large, bold monospace characters. The digits glow cyan — not a flat digital glow, but the deep, layered radiance of real neon tubing: a bright white-hot core that bleeds outward into wide cyan halos.

Every second as the digits change, the whole display flickers ever so briefly — a tiny stutter of light, like a tube momentarily losing charge. It's subtle but alive. The colons between the digit groups pulse with the same dimmer glow.

When you hover over it, the glow intensifies and spreads wider, and a soft cyan haze blooms below the digits on the floor — like light spilling onto a wet surface.

The background is always deep, warm black. No labels, no decorations — just the time, glowing in the dark. It feels cinematic, moody, and a little bit dangerous.

Use Framer Motion for all animations — the flicker, the digit transitions, the hover bloom. Make it feel alive, not mechanical.`,

  'Claude Code': `Create \`components-workspace/neon-clock/index.tsx\`. Export a named function \`NeonClock\`.

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

  Cursor: `File: \`components-workspace/neon-clock/index.tsx\`

- Export \`NeonClock\` ('use client', named function)
- Root: \`className="flex h-full w-full items-center justify-center bg-sand-950"\`, position relative, onMouseEnter/Leave toggle \`hovered\` boolean state

**Clock state**
- \`time: { hh, mm, ss }\` — zero-padded strings from new Date()
- \`hovered: boolean\`
- \`flickering: boolean\` — true for 80ms on each second tick when ss changes; track prevSs via useRef
- useEffect: setInterval 1000ms → update time, compare prevSs, trigger flicker; cleanup on unmount

**Glow constants (inline textShadow — Tailwind cannot do multi-layer)**
- \`GLOW_NORMAL\`: \`'0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0ff, 0 0 82px #0ff, 0 0 92px #0ff, 0 0 102px #0ff'\`
- \`GLOW_HOVER\`: add extra layers out to 200px spread
- \`COLON_GLOW\`: shorter version, 5 layers up to 60px

**Clock display (motion.div)**
- animate \`opacity: flickering ? 0.55 : 1\`, transition duration 0.06 linear
- font: Courier New monospace, clamp(2.5rem,10vw,5rem), weight 700, color #e0ffff, letterSpacing 0.08em
- Children: DigitGroup(hh) → ColonSep → DigitGroup(mm) → ColonSep → DigitGroup(ss)
- Pass glow = hovered ? GLOW_HOVER : GLOW_NORMAL

**DigitGroup({ value, glow })**
- AnimatePresence mode="wait" initial={false}
- motion.span key={value}: initial opacity 0.4, animate 1, exit 0.4, duration 0.15 easeOut
- textShadow: glow, fontVariantNumeric tabular-nums

**ColonSep({ glow, blink })**
- motion.span animate opacity: blink ? 0.4 : 1, duration 0.06
- color #b0ffff, marginInline 0.06em, textShadow: glow

**Ambient floor glow**
- motion.div, position absolute, bottom 18%, width 55%, height 40, borderRadius 50%
- background: radial-gradient cyan→transparent, filter blur(18px), pointerEvents none
- animate: opacity hovered?0.35:0.18, scaleX hovered?1.2:1, transition duration 0.5 easeOut

**TypeScript**: all props typed, no any`,
}
