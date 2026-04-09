import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassSlider\` — a frosted glass Display panel with four gradient-filled sliders.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background: full-bleed \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`, \`object-cover opacity-60\`, over \`bg-sand-950\`.

Panel: \`w-[calc(100%-32px)] max-w-[360px]\` \`rounded-3xl px-7 py-8\` \`flex-col gap-7\`, glass —
- \`background: rgba(255,255,255,0.08)\`
- \`border: 1px solid rgba(255,255,255,0.1)\`
- \`boxShadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)\`
- Separate non-animating blur layer (\`z-[-1] rounded-3xl\`): \`backdrop-filter: blur(24px) saturate(1.8)\`
- Top edge highlight: \`absolute left-7 right-7 top-0 h-[1px]\` \`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)\`
- Entrance: \`initial { y: 20, scale: 0.96 }\` → \`animate { y: 0, scale: 1 }\`, spring \`{ stiffness: 200, damping: 22 }\`.

Header: "Display" \`text-base font-semibold text-white/80\`.

Sliders array (label, defaultValue, colorA, colorB):
- "Brightness", 72, #5B8FF9, #A78BFA
- "Contrast",   45, #FF6BF5, #FF6680
- "Warmth",     60, #FF7B54, #FFBE0B
- "Saturation", 55, #06D6A0, #5B8FF9

Each Slider: entrance \`{ opacity:0, y:12 }\` → \`{ opacity:1, y:0 }\`, spring \`{ stiffness: 200, damping: 22, delay: 0.08 + i * 0.06 }\`.

Label row: \`flex justify-between\`. Label span animates color \`rgba(255,255,255,0.5)\` → \`0.85\` on hover, \`duration: 0.2\`. Value span \`font-mono text-sm font-semibold\`, color = interpolated gradient color at current position.

Track: 5px tall \`rounded-full w-full touch-none\`. Background \`rgba(255,255,255,0.08)\` → \`0.14\` on hover (CSS transition). Fill div: \`width: \${value}%\`, \`linear-gradient(90deg, \${colorA}, \${colorB})\`, on hover gets a \`drop-shadow(0 0 4px \${thumbColor}88)\`.

Thumb: centered on \`left: \${value}%\`, 44x44 tap target (touch-friendly), contains a 18x18 white circle with boxShadow \`0 0 0 2.5px \${thumbColor}, 0 2px 10px \${thumbColor}66\`. Scale driven by \`useSpring(useTransform(isDragging, [0,1], [1, 1.3]), { stiffness: 400, damping: 20 })\` where \`isDragging\` is a \`useMotionValue(0)\` set to 1 on pointer down.

Color interpolation: a \`lerpHex(a, b, t)\` helper parses two hex strings and linearly interpolates the channels, returning a hex string. Use it to compute \`thumbColor = lerpHex(colorA, colorB, value/100)\`.

Drag handling: on \`onPointerDown\` on the track, preventDefault, set isDragging=1, compute value from \`(clientX - rect.left) / rect.width\` clamped 0–1, rounded to 0–100. Add \`pointermove\` and \`pointerup\` listeners on window; pointerup resets isDragging=0 and removes listeners.

Use Manrope font.`,

  GPT: `Build a React client component named \`GlassSlider\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`
Sliders: \`[{ label:'Brightness', defaultValue:72, colorA:'#5B8FF9', colorB:'#A78BFA' }, { label:'Contrast', defaultValue:45, colorA:'#FF6BF5', colorB:'#FF6680' }, { label:'Warmth', defaultValue:60, colorA:'#FF7B54', colorB:'#FFBE0B' }, { label:'Saturation', defaultValue:55, colorA:'#06D6A0', colorB:'#5B8FF9' }]\`
Header text: "Display".

## Glass surface
\`background: rgba(255,255,255,0.08)\`, \`border: 1px solid rgba(255,255,255,0.1)\`, \`boxShadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)\`.
Blur on separate \`absolute inset-0 z-[-1] rounded-3xl\` div: \`backdrop-filter: blur(24px) saturate(1.8)\` (+ Webkit). Top highlight: \`absolute left-7 right-7 top-0 h-[1px]\` \`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)\`.

## Framer Motion
- Panel entrance: \`initial { y:20, scale:0.96 }\` → \`{ y:0, scale:1 }\`, spring \`{ stiffness: 200, damping: 22 }\`.
- Row entrance: \`initial { opacity:0, y:12 }\` → \`{ opacity:1, y:0 }\`, spring \`{ stiffness: 200, damping: 22, delay: 0.08 + i * 0.06 }\`.
- Label color: \`animate { color: hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)' }\`, \`duration: 0.2\`.
- Thumb scale: \`useMotionValue(0)\` \`isDragging\` → \`useTransform([0,1],[1,1.3])\` → \`useSpring(..., { stiffness: 400, damping: 20 })\`. Apply via \`style={{ scale }}\`.

## Hover state
- Track bg: \`rgba(255,255,255,0.08)\` → \`0.14\` on hover (CSS \`transition: background 0.2s ease\`).
- Fill filter on hover: \`drop-shadow(0 0 4px \${thumbColor}88)\`.

## JSX structure
- Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\` + background img \`opacity-60\`.
- Panel: \`motion.div\` \`relative isolate flex w-[calc(100%-32px)] max-w-[360px] flex-col gap-7 rounded-3xl px-7 py-8\` + glass style. Blur layer div absolute behind. Top edge highlight div.
- \`<h3>Display</h3>\` \`text-base font-semibold text-white/80\`.
- Each slider row: \`flex flex-col gap-[14px]\`. Header row: motion label span, value span \`font-mono text-sm font-semibold\` in \`thumbColor\`.
- Track: \`ref\`, \`relative h-[5px] w-full cursor-pointer rounded-full touch-none\`, \`onPointerDown\`. Inside: fill div \`absolute left-0 top-0 h-full rounded-full\` with gradient + width% + conditional drop-shadow. Thumb: \`motion.div\` \`absolute top-1/2 flex h-[44px] w-[44px] -translate-x-1/2 -translate-y-1/2 items-center justify-center\`, \`style={{ left: \`\${value}%\`, scale: thumbScale }}\`. Inside: 18×18 \`bg-white rounded-full\` with \`boxShadow: 0 0 0 2.5px \${thumbColor}, 0 2px 10px \${thumbColor}66\`.

## Drag behavior
- \`handlePointerDown(e)\`: preventDefault, \`isDragging.set(1)\`; compute clamped value \`(clientX - rect.left) / rect.width\` → round to 0–100 via setValue.
- Register window \`pointermove\` (update value) and \`pointerup\` (set isDragging=0, remove listeners).
- \`lerpHex(a,b,t)\` helper: parse \`#rrggbb\` pairs, lerp channels, rebuild \`#\` string padded to 2 hex chars.
- Compute \`thumbColor = lerpHex(colorA, colorB, value/100)\` each render.

## Behavior
- Use \`useState\` for value and hovered; \`useRef\` for track element.
- Font: \`font-sans\` (Manrope). Fixed \`bg-sand-950\`. No props.`,

  Gemini: `Implement a React client component named \`GlassSlider\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or helpers not shown above. Do NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX — declare at the top of the component.

## Phosphor icons
None — this component uses no icons.

## Constants
- Background image: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`
- Sliders: \`[ { label:'Brightness', defaultValue:72, colorA:'#5B8FF9', colorB:'#A78BFA' }, { label:'Contrast', defaultValue:45, colorA:'#FF6BF5', colorB:'#FF6680' }, { label:'Warmth', defaultValue:60, colorA:'#FF7B54', colorB:'#FFBE0B' }, { label:'Saturation', defaultValue:55, colorA:'#06D6A0', colorB:'#5B8FF9' } ]\`

## Layout
Root \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\` with \`<img>\` (\`object-cover opacity-60\`).

## Panel
\`motion.div\` \`relative isolate flex w-[calc(100%-32px)] max-w-[360px] flex-col gap-7 rounded-3xl px-7 py-8\`.
- \`background: rgba(255,255,255,0.08)\`
- \`border: 1px solid rgba(255,255,255,0.1)\`
- \`boxShadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)\`
- Absolute blur layer child: \`pointer-events-none absolute inset-0 z-[-1] rounded-3xl\` with \`backdrop-filter: blur(24px) saturate(1.8)\` (+ Webkit)
- Top edge highlight: \`absolute left-7 right-7 top-0 h-[1px]\` \`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)\`
- Entrance \`initial { y:20, scale:0.96 }\` → \`animate { y:0, scale:1 }\`, \`{ type: 'spring', stiffness: 200, damping: 22 }\`

Header: \`<h3 className="text-base font-semibold text-white/80">Display</h3>\`.

## Slider component
For each slider: a sub-component receiving label, defaultValue, colorA, colorB, delay (= \`0.08 + i*0.06\`). State: \`value\` (number), \`hovered\` (bool). Refs: \`trackRef\`. MotionValues: \`isDragging = useMotionValue(0)\`; \`thumbScale = useSpring(useTransform(isDragging, [0,1], [1, 1.3]), { stiffness: 400, damping: 20 })\`.

Compute \`thumbColor = lerpHex(colorA, colorB, value/100)\` where \`lerpHex\` parses two 6-char hex strings (strip \`#\`, parse r/g/b as int base 16), lerps channels, and returns \`'#' + padded hex channels\`.

Row container \`motion.div\` \`flex flex-col gap-[14px]\`, enter \`{ opacity:0, y:12 }\` → \`{ opacity:1, y:0 }\`, spring \`{ stiffness: 200, damping: 22, delay }\`. \`onMouseEnter/Leave\` toggle \`hovered\`.

Label row: \`flex items-center justify-between\`. Motion label span \`text-sm font-medium\` animates \`color\` between \`rgba(255,255,255,0.5)\` and \`0.85\`, \`duration: 0.2\`. Value span \`font-mono text-sm font-semibold\` color \`thumbColor\`.

Track: \`div ref={trackRef} onPointerDown={handlePointerDown}\` \`relative h-[5px] w-full cursor-pointer rounded-full touch-none\`, \`background: hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)'\`, \`transition: 'background 0.2s ease'\`. Fill \`absolute left-0 top-0 h-full rounded-full\`, \`width: \${value}%\`, \`background: linear-gradient(90deg, \${colorA}, \${colorB})\`, \`filter: hovered ? 'drop-shadow(0 0 4px \${thumbColor}88)' : 'none'\`, \`transition: 'filter 0.2s ease'\`. Thumb \`motion.div\` \`absolute top-1/2 flex h-[44px] w-[44px] -translate-x-1/2 -translate-y-1/2 items-center justify-center\` \`style={{ left: \${value}% , scale: thumbScale }}\`. Inside: \`h-[18px] w-[18px] rounded-full bg-white\` with \`boxShadow: 0 0 0 2.5px \${thumbColor}, 0 2px 10px \${thumbColor}66\`.

## handlePointerDown
\`e.preventDefault()\`; \`isDragging.set(1)\`; read rect from \`trackRef.current\`; compute value from \`(clientX - rect.left) / rect.width\` clamped \`[0,1]\` * 100 rounded. Add window listeners \`pointermove\` (updates value) and \`pointerup\` (sets \`isDragging.set(0)\` and removes both listeners).

## Behavior
- Font \`font-sans\` (Manrope).
- Fixed dark background; no theme branching.`,

  V0: `Create a \`GlassSlider\` component — a frosted glass "Display" panel with four colorful gradient sliders.

Over a dreamy orange floral background, show a translucent rounded-3xl glass card with a subtle top highlight and 24px backdrop blur. The header reads "Display". Below it stack four rows, each a slider: Brightness (blue→purple), Contrast (pink→coral), Warmth (orange→yellow), Saturation (green→blue). Each row has a muted label on the left and a monospace percent value on the right tinted with the slider's current gradient color.

The track is a thin 5px rounded pill; the filled portion uses a horizontal gradient between the slider's two colors. The thumb is a small 18px white circle with a 2.5px ring in the current gradient color and a soft colored glow — it scales up ~1.3x while dragging via a Framer Motion spring. Hovering a row brightens the label and track and adds a soft drop-shadow glow to the fill. Dragging uses pointer events for smooth real-time updates. Compute the thumb color by linearly interpolating between the two gradient hexes based on the current value.

Use Tailwind CSS and Framer Motion. Manrope font. Center the panel over \`bg-sand-950\` with the background image at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png\` at 60% opacity. Keep the backdrop blur on a separate non-animating layer.`,
}
