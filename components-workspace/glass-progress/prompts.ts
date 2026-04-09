import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassProgress\` — a floating glass panel containing four animated progress bars over an ethereal orange flower background, with a circular refresh button below that replays the animation.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks or utility functions (one inner \`GlassProgressBar\` subcomponent is OK). 'use client' at the top. No 'any' types.

## Background
Full-bleed \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`, \`opacity-60 object-cover absolute inset-0\`, over \`bg-sand-950\`.

## Bars (label, value %, color, gradient, delay ms)
1. Storage  72  #3A86FF  "#3A86FF, #2962FF"  200
2. Upload   45  #FF5C8A  "#FF5C8A, #FF1744"  400
3. Battery  88  #06D6A0  "#06D6A0, #00BFA5"  600
4. Memory   30  #FFBE0B  "#FFBE0B, #FF9800"  800

On mount (and on replay) set all values to 0, then for each bar schedule \`setTimeout(() => setValues(i) = bar.value, bar.delay)\`. Clear all timeouts on cleanup.

## Glass panel
\`rounded-3xl\`, background \`rgba(255,255,255,0.06)\`, border \`1px solid rgba(255,255,255,0.1)\`, shadow \`0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`. Separate non-animating blur layer (absolute inset-0 z-[-1] rounded-3xl) with \`backdrop-filter: blur(24px) saturate(1.8)\` (+Webkit). Top-edge highlight: absolute left-8 right-8 top-0 h-[1px] \`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)\`. Panel entrance: \`initial { scale: 0.92, y: 16 }\`, \`animate { scale: 1, y: 0 }\`, spring \`{ stiffness: 300, damping: 26 }\`. Inner padding \`px-6 py-6\`, bars stacked \`flex flex-col gap-5\`.

## Progress bar
Label row (\`mb-2 flex items-center justify-between px-1\`): left label \`text-[10px] font-semibold uppercase tracking-widest text-white/40\`; right percent \`text-[10px] font-semibold tabular-nums\` in color \`\${color}88\`. Track: \`relative h-2 w-full rounded-full overflow-hidden\` with the same glass panel style + inner blur layer. Fill: \`motion.div\` absolute bottom-0 left-0 top-0 rounded-full, \`background: linear-gradient(90deg, \${gradient})\`, \`filter: drop-shadow(0 0 \${glowSize}px \${color}\${glowAlpha})\` where \`glowSize = 4 + value * 0.08\` and \`glowAlpha = (40 + value * 0.4)\` as a 2-char hex. Initial \`{ width: '0%' }\`, animate \`{ width: \`\${value}%\`, opacity: [0.85, 1, 0.85] }\`, transition \`{ width: { type: 'spring', stiffness: 200, damping: 24 }, opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }\`. Percentage counter uses \`useSpring(0, { stiffness: 80, damping: 20 })\` driven to \`value\` via \`useEffect\`; read with \`useMotionValueEvent\` and \`Math.round\` into local state for display. Respect \`useReducedMotion()\` — fallback to 0.3s width transition with no pulse.

## Refresh button
Below panel, \`h-10 w-10 rounded-full\` glass (\`rgba(255,255,255,0.06)\` bg, \`1px solid rgba(255,255,255,0.1)\` border). \`whileHover { scale: 1.12, background: 'rgba(255,255,255,0.12)' }\`, \`whileTap { scale: 0.9, rotate: -90 }\`, spring \`{ stiffness: 400, damping: 20 }\`. Icon: Phosphor \`ArrowClockwise\` size 18 weight="regular" \`text-white/50\`. \`aria-label="Replay animation"\`. Click resets values to [0,0,0,0] and bumps a \`resetKey\` that re-runs the staggered \`setTimeout\` effect.

Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`. Use Manrope font.`,

  GPT: `Build a React client component named \`GlassProgress\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces for \`GlassProgress\` (no props). One inner subcomponent \`GlassProgressBar\` is allowed. Implement exactly what is specified — no more, no less.

## Constants
\`\`\`
const GLASS_BLUR = { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }
const GLASS_PANEL = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
}
const BG = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'
const BARS = [
  { label: 'Storage', value: 72, color: '#3A86FF', gradient: '#3A86FF, #2962FF', delay: 200 },
  { label: 'Upload',  value: 45, color: '#FF5C8A', gradient: '#FF5C8A, #FF1744', delay: 400 },
  { label: 'Battery', value: 88, color: '#06D6A0', gradient: '#06D6A0, #00BFA5', delay: 600 },
  { label: 'Memory',  value: 30, color: '#FFBE0B', gradient: '#FFBE0B, #FF9800', delay: 800 },
]
\`\`\`

## State
- \`values: number[]\` (length 4), init [0,0,0,0]
- \`resetKey: number\` init 0
- \`replay = () => { setValues([0,0,0,0]); setResetKey(k => k+1) }\`

## Mount effect (deps [resetKey])
For each bar index i: \`setTimeout(() => setValues(prev => { const n = [...prev]; n[i] = BARS[i].value; return n }), BARS[i].delay)\`. Collect timeouts; cleanup \`clearTimeout\` each.

## Framer Motion
- Panel: initial \`{ scale: 0.92, y: 16 }\`, animate \`{ scale: 1, y: 0 }\`, transition \`{ type: 'spring', stiffness: 300, damping: 26 }\`.
- Refresh button: \`whileHover { scale: 1.12, background: 'rgba(255,255,255,0.12)' }\`, \`whileTap { scale: 0.9, rotate: -90 }\`, transition \`{ type: 'spring', stiffness: 400, damping: 20 }\`.
- Per-bar fill (inside \`GlassProgressBar\`): \`initial { width: '0%' }\`, \`animate { width: \`\${value}%\`, opacity: [0.85, 1, 0.85] }\`, transition \`{ width: { type: 'spring', stiffness: 200, damping: 24 }, opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }\`. If \`useReducedMotion()\` is true, drop the opacity pulse and use \`{ duration: 0.3 }\` for width.
- Percent counter: \`const spring = useSpring(0, { stiffness: 80, damping: 20 })\`; \`useEffect(() => spring.set(value), [value])\`; \`useMotionValueEvent(spring, 'change', v => setDisplay(Math.round(v)))\`.

## Glow math
\`const glowAlpha = Math.round(40 + value * 0.4).toString(16).padStart(2, '0')\`
\`const glowSize = 4 + value * 0.08\`
\`filter: drop-shadow(0 0 \${glowSize}px \${color}\${glowAlpha})\`

## JSX structure
Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`.
  \`<img src={BG} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />\`
  Column wrapper: \`relative flex w-full max-w-[340px] flex-col items-center gap-4 px-4\`.
    \`motion.div\` panel: \`relative isolate w-full overflow-hidden rounded-3xl\` with GLASS_PANEL style.
      Non-animating blur div: \`pointer-events-none absolute inset-0 z-[-1] rounded-3xl\` with GLASS_BLUR.
      Top-edge highlight div: \`absolute left-8 right-8 top-0 h-[1px]\` background \`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)\`.
      Bars stack: \`flex flex-col gap-5 px-6 py-6\` → 4× \`<GlassProgressBar />\`.
    Refresh: \`motion.button\` \`flex h-10 w-10 items-center justify-center rounded-full cursor-pointer\` background \`rgba(255,255,255,0.06)\` border \`1px solid rgba(255,255,255,0.1)\`. Inside: \`<ArrowClockwise size={18} weight="regular" className="text-white/50" />\` from \`@phosphor-icons/react\`. \`aria-label="Replay animation"\`.

## GlassProgressBar JSX
Outer \`div.w-full\`. Label row \`mb-2 flex items-center justify-between px-1\`: label span \`text-[10px] font-semibold uppercase tracking-widest text-white/40\`; percent span \`text-[10px] font-semibold tabular-nums\` style color \`\${color}88\`, text \`{display}%\`. Track: \`relative h-2 w-full overflow-hidden rounded-full\` with GLASS_PANEL. Inner non-animating blur div \`pointer-events-none absolute inset-0 rounded-full\` GLASS_BLUR. Fill \`motion.div\` \`absolute bottom-0 left-0 top-0 rounded-full\` with gradient/filter above.`,

  Gemini: `Implement a React client component named \`GlassProgress\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, useSpring, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { ArrowClockwise } from '@phosphor-icons/react'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or \`useProgress\`. Do NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX — call them at the top of the component function. \`ArrowClockwise\` must be imported with \`weight="regular"\` usage.

## Constants (module-level)
\`\`\`
const GLASS_BLUR = {
  backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
} as const
const GLASS_PANEL = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
} as const
const BACKGROUND_IMAGE = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'
interface BarConfig { label: string; value: number; color: string; gradient: string; delay: number }
const BARS: BarConfig[] = [
  { label: 'Storage', value: 72, color: '#3A86FF', gradient: '#3A86FF, #2962FF', delay: 200 },
  { label: 'Upload',  value: 45, color: '#FF5C8A', gradient: '#FF5C8A, #FF1744', delay: 400 },
  { label: 'Battery', value: 88, color: '#06D6A0', gradient: '#06D6A0, #00BFA5', delay: 600 },
  { label: 'Memory',  value: 30, color: '#FFBE0B', gradient: '#FFBE0B, #FF9800', delay: 800 },
]
\`\`\`

## Inner component \`GlassProgressBar\`
Props: \`{ value: number; color: string; gradient: string; label?: string; animated?: boolean }\`.
- \`const prefersReduced = useReducedMotion()\`
- \`const springValue = useSpring(0, { stiffness: 80, damping: 20 })\`
- \`const [displayPercent, setDisplayPercent] = useState(0)\`
- \`useEffect(() => { springValue.set(value) }, [value, springValue])\`
- \`useMotionValueEvent(springValue, 'change', (latest) => setDisplayPercent(Math.round(latest)))\`
- \`const glowAlpha = Math.round(40 + value * 0.4).toString(16).padStart(2, '0')\`
- \`const glowSize = 4 + value * 0.08\`
- \`const fillTransition = prefersReduced ? { duration: 0.3 } : { type: 'spring' as const, stiffness: 200, damping: 24 }\`
- \`const pulseAnimate = animated && !prefersReduced ? { width: \\\`\${value}%\\\`, opacity: [0.85, 1, 0.85] } : { width: \\\`\${value}%\\\` }\`
- \`const pulseTransition = animated && !prefersReduced ? { width: fillTransition, opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const } } : fillTransition\`

JSX: \`div.w-full\`. Label row \`mb-2 flex items-center justify-between px-1\` — label \`text-[10px] font-semibold uppercase tracking-widest text-white/40\` and percent \`text-[10px] font-semibold tabular-nums\` with color \`\${color}88\`, text \`\${displayPercent}%\`. Track \`relative h-2 w-full overflow-hidden rounded-full\` style \`{ ...GLASS_PANEL }\`. Blur layer \`pointer-events-none absolute inset-0 rounded-full\` style \`GLASS_BLUR\`. Fill \`motion.div absolute bottom-0 left-0 top-0 rounded-full\` style \`{ background: linear-gradient(90deg, gradient), filter: drop-shadow(0 0 glowSize px color glowAlpha) }\`, initial \`{ width: '0%' }\`, animate \`pulseAnimate\`, transition \`pulseTransition\`.

## Outer component \`GlassProgress\` (exported)
State: \`values: number[]\` init \`[0,0,0,0]\`, \`resetKey: number\` init 0. \`replay = useCallback(() => { setValues([0,0,0,0]); setResetKey(k => k+1) }, [])\`. \`useEffect\` deps \`[resetKey]\`: for each bar schedule \`setTimeout(() => setValues(prev => { const next = [...prev]; next[i] = BARS[i].value; return next }), BARS[i].delay)\`. Cleanup: clear all timeouts.

JSX: root \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`. \`<img src={BACKGROUND_IMAGE} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />\`. Column \`relative flex w-full max-w-[340px] flex-col items-center gap-4 px-4\`. Panel \`motion.div\`: initial \`{ scale: 0.92, y: 16 }\`, animate \`{ scale: 1, y: 0 }\`, transition \`{ type: 'spring', stiffness: 300, damping: 26 }\`, className \`relative isolate w-full overflow-hidden rounded-3xl\`, style \`{ ...GLASS_PANEL }\`. Inside: blur layer \`pointer-events-none absolute inset-0 z-[-1] rounded-3xl\` style \`GLASS_BLUR\`; top-edge highlight \`absolute left-8 right-8 top-0 h-[1px]\` style \`{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }\`; bars stack \`flex flex-col gap-5 px-6 py-6\` with 4× \`<GlassProgressBar label={bar.label} value={values[i]} color={bar.color} gradient={bar.gradient} animated />\`. Below panel: \`motion.button onClick={replay}\` \`whileHover={{ scale: 1.12, background: 'rgba(255,255,255,0.12)' }}\` \`whileTap={{ scale: 0.9, rotate: -90 }}\` \`transition={{ type: 'spring', stiffness: 400, damping: 20 }}\` className \`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full\`, style \`{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }\`, \`aria-label="Replay animation"\`. Inside: \`<ArrowClockwise size={18} weight="regular" className="text-white/50" />\`.

Font \`font-sans\` (Manrope).`,

  V0: `Create a \`GlassProgress\` component — a floating glass panel over an ethereal orange flower photo showing four animated progress bars, with a circular refresh button below that replays the animation.

Background: \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`, \`object-cover opacity-60\`, full-bleed over \`bg-sand-950\`.

The glass panel is \`rounded-3xl\`, very subtle white (6-10% alpha) with a 1px white border, a soft top-edge highlight, and \`backdrop-blur(24px) saturate(1.8)\` for real frosted glass. The panel enters with a gentle spring scale-up. Inside, four rows stack with ~20px gap, each row showing a small uppercase label on the left ("Storage", "Upload", "Battery", "Memory") and a colored percentage counter on the right that counts up as the bar fills.

Each track is a tiny 8px-tall rounded glass strip. The fill is a horizontal linear gradient tinted to the bar's color (Storage blue #3A86FF→#2962FF at 72%, Upload pink #FF5C8A→#FF1744 at 45%, Battery green #06D6A0→#00BFA5 at 88%, Memory yellow #FFBE0B→#FF9800 at 30%). The fill has a colored drop-shadow glow that intensifies with higher values, and a slow opacity pulse that makes the fill "breathe" while animating. The percentage counter next to each label animates up using a spring so it feels natural, not linear.

On mount the bars start at 0 and fill in sequence: 200ms / 400ms / 600ms / 800ms staggered. Below the panel is a 40px circular glass refresh button with a Phosphor \`ArrowClockwise\` icon (weight="regular", text-white/50). Hovering the button scales it 1.12× and warms its background slightly; clicking spins it -90° and replays the whole animation from zero.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'). Respect \`useReducedMotion()\` — skip the pulse and use a 0.3s width transition when reduced motion is preferred.`,
}
