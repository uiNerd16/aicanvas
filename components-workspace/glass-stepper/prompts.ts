import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassStepper\` — three frosted glass stepper pills (Quantity, Guests, Volume) with animated number transitions.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background: \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`, \`object-cover opacity-60\`, over \`bg-sand-950\`.

Three steppers side by side (wrap on mobile) with \`gap-5 px-4\`:
- "Quantity", min 0, max 10, step 1, initial 0, color #3A86FF, gradient "#3A86FF, #2962FF"
- "Guests",   min 1, max 8,  step 1, initial 1, color #FF5C8A, gradient "#FF5C8A, #FF1744"
- "Volume",   min 0, max 100, step 5, initial 50, color #06D6A0, gradient "#06D6A0, #00BFA5"

Each field: width 132px, flex-col.
- Label header row (\`mb-2 flex items-baseline justify-between px-1\`): label \`text-[10px] font-semibold uppercase tracking-widest text-white/40\`, value readout \`text-[10px] font-semibold tabular-nums\` color \`\${color}88\`, showing \`{value} / {max}\`.

Pill: \`relative isolate overflow-hidden rounded-2xl\` with glass —
- \`background: rgba(255,255,255,0.08)\`
- \`border: 1px solid rgba(255,255,255,0.1)\`
- \`boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`
- Separate \`z-[-1] rounded-2xl\` blur layer: \`backdrop-filter: blur(24px) saturate(1.8)\`
- Top edge highlight (\`absolute left-4 right-4 top-0 h-[1px]\` \`linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)\`)

Content row: \`relative z-10 flex items-stretch justify-between p-2\`.

Minus/Plus buttons: Phosphor \`Minus\`/\`Plus\` size 16 \`weight="regular"\`. 36px wide rounded-xl. Enabled: bg \`\${color}18\`, border \`\${color}22\`. Disabled (at min/max): bg \`\${color}0a\`, border \`\${color}0a\`, opacity 0.4, pointer-events none, icon color \`rgba(255,255,255,0.3)\`. \`whileHover { scale: 1.08 }\`, \`whileTap { scale: 0.88 }\`, spring \`{ stiffness: 300, damping: 20 }\` (skip when disabled or \`prefersReduced\`).

Number display: width 36, \`flex items-center justify-center overflow-hidden\`. Use \`AnimatePresence mode="popLayout" initial={false}\` with \`key={value}\` and a \`directionRef\` (1 for increment, -1 for decrement). Enter \`{ opacity: 0, y: direction * 24, scale: 0.5 }\`, animate \`{ opacity: 1, y: 0, scale: 1 }\`, exit \`{ opacity: 0, y: direction * -24, scale: 1.4 }\`, spring \`{ stiffness: 260, damping: 18 }\`. Text is \`text-base font-bold tabular-nums\` with a gradient clipped to text: \`linear-gradient(135deg, \${gradient})\`, \`WebkitBackgroundClip: 'text'\`, \`WebkitTextFillColor: 'transparent'\`.

Respect \`useReducedMotion\`: slideOffset becomes 0, and the enter/exit use \`duration: 0.15\`.

Use Manrope font.`,

  GPT: `Build a React client component named \`GlassStepper\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`
Fields:
1. "Quantity" min:0 max:10 step:1 initial:0 color:#3A86FF gradient:"#3A86FF, #2962FF"
2. "Guests"   min:1 max:8  step:1 initial:1 color:#FF5C8A gradient:"#FF5C8A, #FF1744"
3. "Volume"   min:0 max:100 step:5 initial:50 color:#06D6A0 gradient:"#06D6A0, #00BFA5"

## Glass surface
\`background: rgba(255,255,255,0.08)\`, \`border: 1px solid rgba(255,255,255,0.1)\`, \`boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`.
Absolute \`z-[-1]\` blur layer: \`backdrop-filter: blur(24px) saturate(1.8)\` (+ Webkit). Top highlight \`absolute left-4 right-4 top-0 h-[1px]\` with \`linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)\`.

## Framer Motion
- Buttons: \`whileHover { scale: 1.08 }\`, \`whileTap { scale: 0.88 }\`, \`{ type: 'spring', stiffness: 300, damping: 20 }\`; skip when disabled or \`prefersReduced\`.
- Number swap: \`AnimatePresence mode="popLayout" initial={false}\`, key=value. direction tracked in a ref (1 for +, -1 for -). \`initial { opacity:0, y: direction * 24, scale: 0.5 }\`, \`animate { opacity:1, y:0, scale:1 }\`, \`exit { opacity:0, y: direction * -24, scale: 1.4 }\`, \`{ type: 'spring', stiffness: 260, damping: 18 }\`. Reduced: \`{ duration: 0.15 }\` and slideOffset 0.

## Hover state
Disabled button: \`\${color}0a\` bg + border, opacity 0.4, pointer-events:'none'; icon \`rgba(255,255,255,0.3)\`.
Enabled button: bg \`\${color}18\`, border \`\${color}22\`, icon tinted to \`color\`.

## JSX structure
- Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\` + background img \`opacity-60\`.
- Container: \`relative z-10 flex flex-wrap items-start justify-center gap-5 px-4\` with three \`<GlassStepperField>\` children.
- Field: \`flex w-[132px] flex-col\`. Header row: label \`text-[10px] font-semibold uppercase tracking-widest text-white/40\`, value \`text-[10px] font-semibold tabular-nums\` color \`\${color}88\`, content \`{value} / {max}\`.
- Pill: \`relative isolate overflow-hidden rounded-2xl\` + glass style. Absolute \`z-[-1]\` blur layer. Top edge highlight div.
- Row: \`relative z-10 flex items-stretch justify-between p-2\` containing Minus button (36px wide rounded-xl) + number display div (width 36, overflow-hidden, flex-center) + Plus button.
- Phosphor: \`Minus\` / \`Plus\` size 16 \`weight="regular"\`.
- Number: motion.span \`text-base font-bold tabular-nums\` with gradient-clipped text via \`background: linear-gradient(135deg, \${gradient})\`, \`WebkitBackgroundClip:'text'\`, \`WebkitTextFillColor:'transparent'\`, \`backgroundClip:'text'\`.

## Behavior
- \`increment()\`: if atMax return; set directionRef=1; \`Math.min(prev+step, max)\`.
- \`decrement()\`: if atMin return; set directionRef=-1; \`Math.max(prev-step, min)\`.
- atMin = value <= min; atMax = value >= max.
- Respect \`useReducedMotion\` via \`prefersReduced\` flag.
- Font \`font-sans\` (Manrope). Fixed \`bg-sand-950\`.`,

  Gemini: `Implement a React client component named \`GlassStepper\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Minus, Plus } from '@phosphor-icons/react'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or helpers not shown above. Do NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX.

## Phosphor icons
\`Minus\` and \`Plus\`, both size 16, \`weight="regular"\`.

## Constants
- \`BACKGROUND_IMAGE = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'\`
- \`glassPanel\`: bg \`rgba(255,255,255,0.08)\`, border \`1px solid rgba(255,255,255,0.1)\`, shadow \`0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`
- \`glassBlur\`: \`backdrop-filter: blur(24px) saturate(1.8)\` (+ Webkit)
- \`BUTTON_SPRING = { type: 'spring' as const, stiffness: 300, damping: 20 }\`

## Layout
Root \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\` with \`<img>\` \`opacity-60 object-cover\`. Container \`relative z-10 flex flex-wrap items-start justify-center gap-5 px-4\`.

Render three \`<GlassStepperField>\`:
1. label="Quantity", min:0, max:10, step:1, initialValue:0, color:"#3A86FF", gradient:"#3A86FF, #2962FF"
2. label="Guests", min:1, max:8, step:1, initialValue:1, color:"#FF5C8A", gradient:"#FF5C8A, #FF1744"
3. label="Volume", min:0, max:100, step:5, initialValue:50, color:"#06D6A0", gradient:"#06D6A0, #00BFA5"

## GlassStepperField
Props: \`{ min?: number, max?: number, step?: number, initialValue?: number, label?: string, color: string, gradient: string }\`.
State: \`value\` (number, init to initialValue ?? min). Ref: \`directionRef = useRef<1 | -1>(1)\`. \`const prefersReduced = useReducedMotion()\`.

\`atMin = value <= min\`, \`atMax = value >= max\`. \`slideOffset = prefersReduced ? 0 : 24\`. \`direction = directionRef.current\`.

Wrapper \`flex w-[132px] flex-col\`. Header (if label): \`mb-2 flex items-baseline justify-between px-1\` — label \`font-sans text-[10px] font-semibold uppercase tracking-widest text-white/40\`; value \`font-sans text-[10px] font-semibold tabular-nums\` color \`\${color}88\` text \`{value} / {max}\`.

Pill: \`relative isolate overflow-hidden rounded-2xl\` style=glassPanel. Blur layer \`pointer-events-none absolute inset-0 z-[-1] rounded-2xl\` style=glassBlur. Top edge highlight \`absolute left-4 right-4 top-0 z-10 h-[1px]\` \`linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)\`.

Row \`relative z-10 flex items-stretch justify-between p-2\`.

Minus button (motion.button):
- \`onClick={decrement}\`
- \`whileHover\` / \`whileTap\` conditional: undefined when \`atMin || prefersReduced\`, else \`{ scale: 1.08 }\` / \`{ scale: 0.88 }\`
- \`transition={BUTTON_SPRING}\`
- \`disabled={atMin}\`, \`aria-label="Decrease"\`
- \`className="flex cursor-pointer items-center justify-center rounded-xl"\`
- style: \`width: 36\`, \`background: \${color}\${atMin ? '0a' : '18'}\`, \`border: 1px solid \${color}\${atMin ? '0a' : '22'}\`, \`opacity: atMin ? 0.4 : 1\`, \`pointerEvents: atMin ? 'none' : 'auto'\`, \`outline: 'none'\`
- Contains \`<Minus size={16} weight="regular" style={{ color: atMin ? 'rgba(255,255,255,0.3)' : color }} />\`

Number display: \`flex items-center justify-center overflow-hidden\` \`style={{ width: 36 }}\`. \`<AnimatePresence mode="popLayout" initial={false}>\` contains \`<motion.span key={value}>\` with:
- \`initial { opacity: 0, y: direction * slideOffset, scale: 0.5 }\`
- \`animate { opacity: 1, y: 0, scale: 1 }\`
- \`exit { opacity: 0, y: direction * -slideOffset, scale: 1.4 }\`
- \`transition: prefersReduced ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: 18 }\`
- className \`font-sans text-base font-bold tabular-nums\`
- style \`background: linear-gradient(135deg, \${gradient})\`, \`WebkitBackgroundClip: 'text'\`, \`WebkitTextFillColor: 'transparent'\`, \`backgroundClip: 'text'\`
- children: \`{value}\`

Plus button: same as Minus but \`onClick={increment}\`, \`disabled={atMax}\`, uses \`atMax\` in styling, contains \`<Plus />\`.

## Behavior
- \`increment\`: if atMax return; \`directionRef.current = 1\`; \`setValue(prev => Math.min(prev + step, max))\`.
- \`decrement\`: if atMin return; \`directionRef.current = -1\`; \`setValue(prev => Math.max(prev - step, min))\`.
- Fixed dark background.`,

  V0: `Create a \`GlassStepper\` component — three frosted glass stepper pills labeled Quantity, Guests, and Volume over a dreamy orange floral background.

Each stepper is a 132px-wide column: a small uppercase caption on the left, a tinted "value / max" counter on the right, and below them a rounded glass pill containing a minus button, a gradient number in the middle, and a plus button. The pills use a translucent white glass surface with 24px backdrop blur and 1.8x saturation on a separate non-animating layer, a soft drop shadow, and a subtle top highlight.

Use Phosphor \`Minus\` and \`Plus\` icons (weight='regular'), each inside a 36px tinted rounded-xl button. Quantity is blue #3A86FF (0–10, step 1, start 0), Guests is pink #FF5C8A (1–8, step 1, start 1), and Volume is green #06D6A0 (0–100, step 5, start 50). Buttons scale up on hover and down on tap with a snappy spring; at min/max they fade out and become non-interactive. The number in the middle is bold, gradient-clipped in the stepper's color pair, and swaps with an \`AnimatePresence popLayout\` transition where the old digit slides up (or down) and scales 1.4x while the new one drops in from below (or above) and scales up from 0.5.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'). Manrope font. Center the steppers over \`bg-sand-950\` with the background image at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png\` at 60% opacity.`,
}
