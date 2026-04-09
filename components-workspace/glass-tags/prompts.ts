import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassTags\` — a wrapped row of glass-morphism tag pills with individually colored selection states.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background: \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%203%20(1).png?updatedAt=1775226815629\`, \`object-cover opacity-60\`, over \`bg-sand-950\`.

Tags (label, color):
- Design #FF9A3C, Development #FFBE0B, Motion #FF6BF5, AI #FF7B54, 3D #DC5A28, Typography #FFD166, Branding #FF6680, iOS #FF9A3C, WebGL #FFBE0B, React #FF7B54, Figma #FF6BF5, Prototyping #FFD166

Container: \`relative flex w-full max-w-sm flex-wrap justify-center gap-2 px-4 sm:max-w-md sm:gap-3 sm:px-6\`.

Each tag: \`motion.button\` with per-tag \`selected\` and \`hovered\` state. Entrance \`initial { scale: 0.8, y: 12 }\` → \`animate { scale: 1, y: 0 }\`, spring \`{ stiffness: 260, damping: 20, delay: i * 0.04 }\`. \`whileHover { scale: 1.05 }\`, \`whileTap { scale: 0.94 }\`. Click toggles selected.

Pill: \`relative isolate cursor-pointer rounded-full px-4 py-2 sm:px-5 sm:py-2.5\`. Style depends on selected/hovered:
- Selected: \`background: linear-gradient(135deg, \${color}33, \${color}18)\`; \`border: 1px solid \${color}55\`; \`boxShadow: 0 4px 24px \${color}30, inset 0 1px 0 rgba(255,255,255,0.12)\`
- Hover (not selected): bg \`rgba(255,255,255,0.13)\`, border \`rgba(255,255,255,0.24)\`, shadow \`0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)\`
- Idle: bg \`rgba(255,255,255,0.08)\`, border \`rgba(255,255,255,0.12)\`, shadow \`0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)\`
- CSS transition: \`background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease\`

Separate non-animating blur layer (\`absolute inset-0 z-[-1] rounded-full\`): \`backdrop-filter: blur(24px) saturate(1.8)\`.

Selection glow (motion.div): absolute inset-0 rounded-full, \`background: radial-gradient(circle at center, \${color}, transparent 70%)\`, \`animate { opacity: selected ? 0.15 : 0 }\`, \`duration: 0.3\`.

Inner row: \`relative z-10 flex items-center gap-2\`. Fixed-width 14x14 slot containing two overlapping elements: a motion dot (2x2 centered, bg \`color\`) that scales to 0 and fades when selected, and when selected an \`<motion.svg>\` check icon that scales in with a spring \`{ stiffness: 500, damping: 25 }\` and draws the path (\`d="M3 7.5L5.5 10L11 4"\`) via \`pathLength\` 0 → 1, \`duration: 0.25, delay: 0.1\`, stroke = tag color, strokeWidth 2.

Label: \`text-xs font-semibold sm:text-sm\`, color \`rgba(255,255,255,0.5)\` → hover \`0.78\` → selected \`0.95\`, CSS transition color 0.2s.

Use Manrope font.`,

  GPT: `Build a React client component named \`GlassTags\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%203%20(1).png?updatedAt=1775226815629\`
Tags: \`[ { label:'Design', color:'#FF9A3C' }, { label:'Development', color:'#FFBE0B' }, { label:'Motion', color:'#FF6BF5' }, { label:'AI', color:'#FF7B54' }, { label:'3D', color:'#DC5A28' }, { label:'Typography', color:'#FFD166' }, { label:'Branding', color:'#FF6680' }, { label:'iOS', color:'#FF9A3C' }, { label:'WebGL', color:'#FFBE0B' }, { label:'React', color:'#FF7B54' }, { label:'Figma', color:'#FF6BF5' }, { label:'Prototyping', color:'#FFD166' } ]\`
\`GLASS_FILTER = 'blur(24px) saturate(1.8)'\`.

## Glass surface
Separate absolute \`z-[-1] rounded-full\` blur layer with \`backdrop-filter: blur(24px) saturate(1.8)\` (+ Webkit).
Idle: bg \`rgba(255,255,255,0.08)\`, border \`1px solid rgba(255,255,255,0.12)\`, shadow \`0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)\`.
Hover: bg \`rgba(255,255,255,0.13)\`, border \`1px solid rgba(255,255,255,0.24)\`, shadow \`0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)\`.
Selected: bg \`linear-gradient(135deg, \${color}33, \${color}18)\`, border \`1px solid \${color}55\`, shadow \`0 4px 24px \${color}30, inset 0 1px 0 rgba(255,255,255,0.12)\`.
CSS transition \`background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease\`.

## Framer Motion
- Entrance: \`initial { scale: 0.8, y: 12 }\`, \`animate { scale: 1, y: 0 }\`, \`{ type: 'spring', stiffness: 260, damping: 20, delay: index * 0.04 }\`.
- Tag: \`whileHover { scale: 1.05 }\`, \`whileTap { scale: 0.94 }\`.
- Selection glow: motion.div inset-0 radial-gradient, \`animate { opacity: selected ? 0.15 : 0 }\`, \`duration: 0.3\`.
- Dot: \`animate { scale: selected ? 0 : 1, opacity: selected ? 0 : hovered ? 0.8 : 0.5 }\`, \`{ type: 'spring', stiffness: 400, damping: 15 }\`.
- Check SVG: \`initial { scale: 0, opacity: 0 }\`, \`animate { scale: 1, opacity: 1 }\`, \`{ type: 'spring', stiffness: 500, damping: 25 }\`. Path \`pathLength 0 → 1\`, \`duration: 0.25, delay: 0.1\`.

## Hover state
Label color ramp: idle \`rgba(255,255,255,0.5)\`, hover \`0.78\`, selected \`0.95\`, CSS transition \`color 0.2s ease\`.

## JSX structure
- Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\` + background img \`opacity-60\`.
- Container: \`relative flex w-full max-w-sm flex-wrap justify-center gap-2 px-4 sm:max-w-md sm:gap-3 sm:px-6\`.
- Each tag: \`motion.button\` \`relative isolate cursor-pointer rounded-full px-4 py-2 sm:px-5 sm:py-2.5\`. Inside: blur layer div \`z-[-1]\`, glow \`motion.div\`, content row \`relative z-10 flex items-center gap-2\` containing a 14x14 slot (dot + check) and a label span.
- Check SVG: viewBox 0 0 14 14, \`<motion.path d="M3 7.5L5.5 10L11 4" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, delay: 0.1 }} />\`.

## Behavior
- Per-tag \`selected\` and \`hovered\` state in an inner component.
- Toggle selected on click.
- Font \`font-sans\` (Manrope). Fixed \`bg-sand-950\`.`,

  Gemini: `Implement a React client component named \`GlassTags\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or helpers not shown above. Do NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX.

## Phosphor icons
None. The check mark is an inline SVG with a motion path, not a Phosphor icon.

## Constants
- Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%203%20(1).png?updatedAt=1775226815629\`
- \`GLASS_FILTER = 'blur(24px) saturate(1.8)'\`
- \`TAGS\` array (12 entries, label + hex color): Design #FF9A3C, Development #FFBE0B, Motion #FF6BF5, AI #FF7B54, 3D #DC5A28, Typography #FFD166, Branding #FF6680, iOS #FF9A3C, WebGL #FFBE0B, React #FF7B54, Figma #FF6BF5, Prototyping #FFD166.

## Layout
Root \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`. Background \`<img>\` \`opacity-60 object-cover\`. Container \`relative flex w-full max-w-sm flex-wrap justify-center gap-2 px-4 sm:max-w-md sm:gap-3 sm:px-6\`.

## GlassTag component
Props: \`{ label: string, color: string, index: number }\`. State: \`selected\` (bool), \`hovered\` (bool).

\`motion.button\`:
- \`initial { scale: 0.8, y: 12 }\`, \`animate { scale: 1, y: 0 }\`
- \`transition { type: 'spring', stiffness: 260, damping: 20, delay: index * 0.04 }\`
- \`onClick={() => setSelected(s => !s)}\`
- \`onHoverStart\` / \`onHoverEnd\` toggle hovered
- \`whileHover { scale: 1.05 }\`
- \`whileTap { scale: 0.94 }\`
- className \`relative isolate cursor-pointer rounded-full px-4 py-2 sm:px-5 sm:py-2.5\`
- style (conditional on selected/hovered): background / border / boxShadow per spec, CSS \`transition: 'background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease'\`.

Inside:
1. Blur layer \`<div className="pointer-events-none absolute inset-0 z-[-1] rounded-full" style={{ backdropFilter: GLASS_FILTER, WebkitBackdropFilter: GLASS_FILTER }} />\`
2. Selection glow \`<motion.div className="absolute inset-0 rounded-full" animate={{ opacity: selected ? 0.15 : 0 }} transition={{ duration: 0.3 }} style={{ background: \`radial-gradient(circle at center, \${color}, transparent 70%)\` }} />\`
3. Content row \`relative z-10 flex items-center gap-2\`:
   - 14x14 slot \`relative h-3.5 w-3.5 shrink-0\`:
     - Dot: \`<motion.div animate={{ scale: selected ? 0 : 1, opacity: selected ? 0 : hovered ? 0.8 : 0.5 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} className="absolute inset-0 m-auto h-2 w-2 rounded-full" style={{ background: color }} />\`
     - If selected, \`<motion.svg width="14" height="14" viewBox="0 0 14 14" className="absolute inset-0" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>\` containing \`<motion.path d="M3 7.5L5.5 10L11 4" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, delay: 0.1 }} />\`
   - Label \`<span className="text-xs font-semibold sm:text-sm" style={{ color: selected ? 'rgba(255,255,255,0.95)' : hovered ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.5)', transition: 'color 0.2s ease' }}>{label}</span>\`

## Behavior
- Each tag manages its own selected + hovered state.
- Font \`font-sans\` (Manrope).
- Fixed dark background.`,

  V0: `Create a \`GlassTags\` component — a wrapped row of 12 glass-morphism tag pills that toggle on click, each with its own warm color.

Over a dreamy orange floral background, show a centered flex-wrap grid of rounded glass pills labeled Design, Development, Motion, AI, 3D, Typography, Branding, iOS, WebGL, React, Figma, Prototyping. Each pill has a frosted translucent white background with 24px backdrop blur and 1.8x saturation on a separate non-animating layer, a soft drop shadow, and a subtle top highlight. Each tag has a small colored dot on the left and a label that brightens from a dim gray to near-white as the tag goes from idle to hover to selected.

Clicking a tag selects it: the background becomes a diagonal tinted gradient in the tag's color, the border and outer shadow take the same color, a soft radial glow fades in behind, and the dot cross-fades with an SVG check mark that scales in with a spring and draws the check stroke using Framer Motion's \`pathLength\`. Tags stagger in on mount with a small delay per tag. Hovering scales tags up slightly; tapping scales them down. Use varied colors: #FF9A3C, #FFBE0B, #FF6BF5, #FF7B54, #DC5A28, #FFD166, #FF6680 — reused across the 12 tags.

Use Tailwind CSS and Framer Motion (no Phosphor icons — the check is an inline SVG). Manrope font. Center the tags over \`bg-sand-950\` with the background image at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%203%20(1).png\` at 60% opacity.`,
}
