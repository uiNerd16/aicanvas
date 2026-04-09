import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassToggle\` — a glass Preferences panel with five iOS-style toggle rows, each animating its track color and thumb position with Framer Motion springs.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background: \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png\`, \`object-cover opacity-60\`, over \`bg-sand-950\`.

Panel: 320px wide, \`rounded-3xl px-7 py-7 flex-col gap-5\`, glass —
- \`background: rgba(255,255,255,0.06)\`
- \`border: 1px solid rgba(255,255,255,0.1)\`
- \`boxShadow: 0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)\`
- Separate \`z-[-1] rounded-3xl\` blur layer: \`backdrop-filter: blur(24px) saturate(1.6)\`
- Top edge highlight (\`absolute left-7 right-7 top-0 h-[1px]\` \`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)\`)
- Entrance \`initial { y:20, scale:0.96 }\` → \`{ y:0, scale:1 }\`, spring \`{ stiffness: 200, damping: 22 }\`.

Header: \`<h3 className="text-base font-semibold text-white/80">Preferences</h3>\`.

Toggles (label, defaultOn, color, delay):
- "Dark Mode", true, #FF6BF5, 0.1
- "Notifications", true, #06D6A0, 0.15
- "Auto-Update", false, #FFBE0B, 0.2
- "Analytics", false, #FF7B54, 0.25
- "Haptic Feedback", true, #3A86FF, 0.3

Between each toggle row place a thin divider: \`h-[1px] w-full bg rgba(255,255,255,0.06)\`.

Each Toggle row: \`motion.div flex items-center justify-between\`, entrance \`{ opacity:0, x:-16 }\` → \`{ opacity:1, x:0 }\`, spring \`{ stiffness: 200, damping: 22, delay }\`.

Left column: label \`text-sm font-medium text-white/60\`; below it a small state text \`text-[11px]\` — "On" when on (color = toggle color), "Off" when off (color \`rgba(255,255,255,0.25)\`, opacity 0.5).

Right: button 56x32 \`rounded-full\`, whileTap scale 0.95.
- Use a \`useSpring(defaultOn ? 1 : 0, { stiffness: 300, damping: 22 })\` progress motion value, updated in a \`useEffect\` when \`on\` changes.
- \`useTransform(progress, [0,1], ['rgba(255,255,255,0.08)', '\${color}44'])\` → track background (motion value, cast string).
- \`useTransform(progress, [0,1], ['rgba(255,255,255,0.1)', '\${color}55'])\` → track border color.
- \`useTransform(progress, [0,1], [2, 26])\` → thumb x.
- \`useTransform(progress, [0,1], ['0 2px 8px rgba(0,0,0,0.3)', '0 2px 16px \${color}44'])\` → thumb shadow.
- When on, extra box-shadow \`0 0 20px \${color}15, inset 0 1px 2px rgba(0,0,0,0.1)\`; when off, \`inset 0 1px 2px rgba(0,0,0,0.2)\`.

Thumb: \`absolute top-1/2 h-6 w-6 rounded-full\`, \`y: '-50%'\`, x from motion value. Background when on: \`linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))\`; off: \`linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5))\`. Inside thumb, a 2px inset div with \`linear-gradient(180deg, rgba(255,255,255,0.5), transparent 60%)\` as a highlight.

Glow behind thumb (motion.div inset-0 rounded-full): \`animate { opacity: on ? 0.3 : 0 }\`, \`background: radial-gradient(circle at 75% 50%, \${color}, transparent 70%)\`.

Use Manrope font.`,

  GPT: `Build a React client component named \`GlassToggle\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png\`
Header: "Preferences".
Toggles (label, defaultOn, color, delay):
- "Dark Mode", true, #FF6BF5, 0.1
- "Notifications", true, #06D6A0, 0.15
- "Auto-Update", false, #FFBE0B, 0.2
- "Analytics", false, #FF7B54, 0.25
- "Haptic Feedback", true, #3A86FF, 0.3

## Glass surface
Panel: \`background: rgba(255,255,255,0.06)\`, \`border: 1px solid rgba(255,255,255,0.1)\`, \`boxShadow: 0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)\`. Separate \`z-[-1] rounded-3xl\` blur layer: \`backdrop-filter: blur(24px) saturate(1.6)\` (+ Webkit). Top edge highlight \`absolute left-7 right-7 top-0 h-[1px]\` with \`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)\`.

## Framer Motion
- Panel entrance: \`initial { y:20, scale:0.96 }\` → \`{ y:0, scale:1 }\`, spring \`{ stiffness: 200, damping: 22 }\`.
- Row entrance: \`initial { opacity:0, x:-16 }\` → \`{ opacity:1, x:0 }\`, spring \`{ stiffness: 200, damping: 22, delay }\`.
- Track state: \`const progress = useSpring(defaultOn ? 1 : 0, { stiffness: 300, damping: 22 })\`; \`useEffect(() => progress.set(on ? 1 : 0), [on, progress])\`.
- Transforms: trackBg, trackBorder, thumbX \`[0,1] → [2, 26]\`, thumbShadow.
- Button: \`whileTap { scale: 0.95 }\`.
- State text: \`animate { opacity: on ? 1 : 0.5 }\`.

## Hover state
No per-row hover. Only the tap scale on the button and the progress-driven color/position updates.

## JSX structure
- Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\` + background img \`opacity-60\`.
- Panel: \`motion.div relative isolate flex w-[320px] flex-col gap-5 rounded-3xl px-7 py-7\` + glass style. Absolute \`z-[-1]\` blur layer. Top edge highlight.
- \`<h3>Preferences</h3>\` \`text-base font-semibold text-white/80\`.
- Five \`<Toggle>\` rows interleaved with dividers \`h-[1px] w-full bg rgba(255,255,255,0.06)\`.
- Toggle row: \`motion.div flex items-center justify-between\`. Left column \`flex flex-col\` with label + state text. Right: \`motion.button relative h-8 w-14 cursor-pointer rounded-full p-0\`, style uses motion-value track bg / border (cast string), inline boxShadow string. Inside: glow motion.div, thumb motion.div (absolute top-1/2 h-6 w-6 rounded-full) with motion x + thumbShadow; inner highlight div \`absolute inset-[2px] rounded-full\` with \`linear-gradient(180deg, rgba(255,255,255,0.5), transparent 60%)\`.

## Behavior
- State: \`on\` per row with \`useState(defaultOn)\`.
- Thumb x range [2, 26]; thumb size 24; track 56x32.
- Font \`font-sans\` (Manrope). Fixed \`bg-sand-950\`. No icons.`,

  Gemini: `Implement a React client component named \`GlassToggle\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or helpers not shown above. Do NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX — declare at top of the Toggle component.

## Phosphor icons
None — this component uses no icons.

## Constants
- Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png\`
- Panel glass: bg \`rgba(255,255,255,0.06)\`, border \`1px solid rgba(255,255,255,0.1)\`, shadow \`0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)\`
- Blur layer: \`backdrop-filter: blur(24px) saturate(1.6)\` (+ Webkit)

## Layout
Root \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`. Background \`<img opacity-60 object-cover>\`.

## Panel
\`motion.div\` \`relative isolate flex w-[320px] flex-col gap-5 rounded-3xl px-7 py-7\`, style=glass. Entrance \`initial { y:20, scale:0.96 }\` → \`animate { y:0, scale:1 }\`, \`transition { type: 'spring', stiffness: 200, damping: 22 }\`. Children: absolute blur layer \`pointer-events-none absolute inset-0 z-[-1] rounded-3xl\` with \`backdropFilter: blur(24px) saturate(1.6)\` (+ Webkit). Top edge highlight \`absolute left-7 right-7 top-0 h-[1px]\` with \`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)\`. Header \`<h3 className="text-base font-semibold text-white/80">Preferences</h3>\`.

Then five Toggle rows interleaved with dividers \`<div className="h-[1px] w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />\`.

Toggles (label, defaultOn, color, delay):
1. "Dark Mode", true, "#FF6BF5", 0.1
2. "Notifications", true, "#06D6A0", 0.15
3. "Auto-Update", false, "#FFBE0B", 0.2
4. "Analytics", false, "#FF7B54", 0.25
5. "Haptic Feedback", true, "#3A86FF", 0.3

## Toggle component
Props: \`{ label: string, defaultOn?: boolean, color: string, delay: number }\`.
State: \`const [on, setOn] = useState(defaultOn ?? false)\`.
Motion values:
\`\`\`
const progress = useSpring(defaultOn ? 1 : 0, { stiffness: 300, damping: 22 })
useEffect(() => { progress.set(on ? 1 : 0) }, [on, progress])
const trackBg = useTransform(progress, [0, 1], ['rgba(255,255,255,0.08)', \`\${color}44\`])
const trackBorder = useTransform(progress, [0, 1], ['rgba(255,255,255,0.1)', \`\${color}55\`])
const thumbX = useTransform(progress, [0, 1], [2, 26])
const thumbShadow = useTransform(progress, [0, 1], ['0 2px 8px rgba(0,0,0,0.3)', \`0 2px 16px \${color}44\`])
\`\`\`

Wrapper \`motion.div flex items-center justify-between\`, enter \`{ opacity:0, x:-16 }\` → \`{ opacity:1, x:0 }\`, \`{ type: 'spring', stiffness: 200, damping: 22, delay }\`.

Left column \`flex flex-col\`:
- Label \`text-sm font-medium text-white/60\`.
- State \`motion.span animate={{ opacity: on ? 1 : 0.5 }} className="text-[11px]" style={{ color: on ? color : 'rgba(255,255,255,0.25)' }}\` text \`{on ? 'On' : 'Off'}\`.

Button \`motion.button onClick={() => setOn(!on)}\` \`className="relative h-8 w-14 cursor-pointer rounded-full p-0"\` \`style={{ background: trackBg as unknown as string, border: '1px solid', borderColor: trackBorder as unknown as string, boxShadow: on ? \`0 0 20px \${color}15, inset 0 1px 2px rgba(0,0,0,0.1)\` : 'inset 0 1px 2px rgba(0,0,0,0.2)' }}\` \`whileTap={{ scale: 0.95 }}\`.

Inside:
- Glow \`motion.div className="absolute inset-0 rounded-full" animate={{ opacity: on ? 0.3 : 0 }} style={{ background: \`radial-gradient(circle at 75% 50%, \${color}, transparent 70%)\` }}\`.
- Thumb \`motion.div className="absolute top-1/2 h-6 w-6 rounded-full" style={{ x: thumbX, y: '-50%', background: on ? 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))' : 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5))', boxShadow: thumbShadow }}\`.
- Inner thumb highlight \`<div className="absolute inset-[2px] rounded-full" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 60%)' }} />\`.

## Behavior
- Font \`font-sans\` (Manrope).
- Fixed dark background. No props, no icons.`,

  V0: `Create a \`GlassToggle\` component — a frosted glass "Preferences" panel with five iOS-style animated toggles.

Over a dreamy orange floral background, show a 320px wide translucent white rounded-3xl glass card with a soft inset top highlight and 24px backdrop blur with 1.6x saturation on a separate non-animating layer. The header reads "Preferences". Below it stack five toggle rows separated by faint dividers: Dark Mode (on, pink #FF6BF5), Notifications (on, green #06D6A0), Auto-Update (off, yellow #FFBE0B), Analytics (off, orange #FF7B54), Haptic Feedback (on, blue #3A86FF).

Each row has a muted label on the left with a small "On"/"Off" state line under it (tinted in the toggle's color when on). On the right is an iOS-style pill toggle (56×32) with a white circular thumb (24px) that has an inner highlight gradient. Flipping a toggle springs the thumb from left to right, cross-fades the track background and border from neutral glass to a tinted color, and grows a radial glow behind the thumb. The thumb's drop shadow also warms up to a colored glow. Use Framer Motion \`useSpring\` with \`useTransform\` to drive all these from a single 0→1 progress motion value. The button also scales down slightly on tap.

Use Tailwind CSS and Framer Motion (no icons). Manrope font. Center the panel over \`bg-sand-950\` with the background image at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png\` at 60% opacity.`,
}
