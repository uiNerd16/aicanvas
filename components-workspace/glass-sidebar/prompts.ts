import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassSidebar\` — a glass-morphism vertical sidebar that springs between a collapsed icon rail and an expanded label state.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background: full-bleed \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\`, \`object-cover opacity-60\`, over \`bg-sand-950\`.

Constants:
- \`COLLAPSED_WIDTH = 64\`, \`EXPANDED_WIDTH = 220\`
- \`ICON_TILE_SIZE = 44\`, \`TOGGLE_BUTTON_HEIGHT = 36\`

Nav items (Phosphor, \`weight="regular"\`):
- \`House\` / "Home" / #3A86FF
- \`MagnifyingGlass\` / "Search" / #B388FF
- \`Folders\` / "Projects" / #FFBE0B
- \`Bell\` / "Notifications" / #FF5C8A
- \`ChartLine\` / "Analytics" / #06D6A0
- \`Gear\` / "Settings" / #C9A96E
- \`User\` / "Profile" / #FF7B54

Panel: \`rounded-3xl px-2.5 py-3\`, glass —
- \`background: rgba(255,255,255,0.06)\`
- \`border: 1px solid rgba(255,255,255,0.1)\`
- \`boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`
- separate absolute \`z-[-1]\` blur layer: \`backdrop-filter: blur(24px) saturate(1.8)\`

Width is driven by a \`useSpring(COLLAPSED_WIDTH, { stiffness: 280, damping: 26 })\`. Entrance: \`initial { x: -20 }\` → \`animate { x: 0 }\`, spring \`{ stiffness: 200, damping: 22, delay: 0.1 }\`. Wrap the panel in a fixed-width \`EXPANDED_WIDTH\` container so it expands rightward from a stable left edge.

Each nav row:
- \`motion.button\` \`onClick\` sets active index; hover state local. \`animate { scale: hovered ? (isOpen ? 1.08 : 1.15) : 1, x: hovered ? (isOpen ? 0 : 3) : 0 }\`, \`whileTap { scale: 0.90 }\`, spring \`{ stiffness: 320, damping: 20 }\`.
- 44x44 tinted icon tile, \`rounded-xl\`. Active: bg \`\${color}28\`, border \`\${color}44\`. Inactive: bg \`\${color}18\`, border \`\${color}22\`. Icon size 20.
- Label (only when \`isOpen\`, \`AnimatePresence\`): \`text-sm font-semibold\`, color \`rgba(255,255,255,0.75)\` (or \`item.color\` when active). Enter \`{ opacity:0, x:-8 }\` → \`{ opacity:1, x:0 }\` with \`duration: 0.18, delay: 0.18 + index * 0.03\`, exit fast \`duration: 0.08\`.
- When collapsed + hovered, show a tooltip on the right (\`left-[calc(100%+10px)]\`): same glass + blur \`rounded-lg px-3 py-1.5 text-xs font-semibold text-white/90\`, fades \`{ opacity:0, x:-6 }\`.
- Reset \`hovered\` to false whenever \`isOpen\` changes to avoid stuck tooltips.

Divider: \`h-[1px]\` full-width \`rgba(255,255,255,0.1)\`.

Toggle button: 44x36 \`rounded-2xl\`, bg \`rgba(255,255,255,0.08)\`, border \`rgba(255,255,255,0.12)\`. Hover \`scale: 1.08\`, tap \`0.90\`, spring \`{ stiffness: 300, damping: 20 }\`. Contains \`AnimatePresence mode="wait"\`: \`ArrowRight\` (collapsed) or \`ArrowLeft\` (open), each spinning 90° on enter/exit with \`duration: 0.18\`. Container justifies center when collapsed, start (\`px-1\`) when open.

Clicking toggle flips \`isOpen\` and calls \`widthSpring.set(next ? EXPANDED_WIDTH : COLLAPSED_WIDTH)\`.

Use Manrope ('font-sans').`,

  GPT: `Build a React client component named \`GlassSidebar\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Constants: \`COLLAPSED_WIDTH = 64\`, \`EXPANDED_WIDTH = 220\`, \`ICON_TILE_SIZE = 44\`, \`TOGGLE_BUTTON_HEIGHT = 36\`.
Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\`.
Nav items: House "Home" #3A86FF, MagnifyingGlass "Search" #B388FF, Folders "Projects" #FFBE0B, Bell "Notifications" #FF5C8A, ChartLine "Analytics" #06D6A0, Gear "Settings" #C9A96E, User "Profile" #FF7B54.

## Glass surface
\`background: rgba(255,255,255,0.06)\`, \`border: 1px solid rgba(255,255,255,0.1)\`, \`boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`. Blur on separate \`z-[-1] rounded-3xl\` absolute div: \`backdrop-filter: blur(24px) saturate(1.8)\` (never animates).

## Framer Motion
- Width: \`useSpring(COLLAPSED_WIDTH, { stiffness: 280, damping: 26 })\`; toggle sets to expanded or collapsed.
- Panel entrance: \`initial { x: -20 }\`, \`animate { x: 0 }\`, \`{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }\`.
- Nav row: \`animate { scale: hovered ? (isOpen ? 1.08 : 1.15) : 1, x: hovered ? (isOpen ? 0 : 3) : 0 }\`, \`whileTap { scale: 0.90 }\`, \`{ type: 'spring', stiffness: 320, damping: 20 }\`.
- Label AnimatePresence: enter \`{ opacity: 1, x: 0 }\` with \`{ duration: 0.18, ease: 'easeOut', delay: 0.18 + index * 0.03 }\`, exit \`{ opacity: 0, x: -6 }\` \`{ duration: 0.08, ease: 'easeIn' }\`.
- Tooltip (collapsed+hovered only): \`{ opacity:0, x:-6 }\` ↔ \`{ opacity:1, x:0 }\`, \`duration: 0.15\`.
- Toggle arrow swap: \`AnimatePresence mode="wait"\` spinning 90° — \`{ opacity:0, rotate:90 }\` ↔ \`{ opacity:1, rotate:0 }\` ↔ \`{ opacity:0, rotate:-90 }\`, \`duration: 0.18\`.
- Toggle button: \`animate { scale: toggleHovered ? 1.08 : 1 }\`, \`whileTap { scale: 0.90 }\`, spring \`{ stiffness: 300, damping: 20 }\`.

## Hover state
Active tile: bg \`\${color}28\`, border \`\${color}44\`. Inactive: bg \`\${color}18\`, border \`\${color}22\` (transition background 0.2s, border-color 0.2s). Active label color \`item.color\`; inactive \`rgba(255,255,255,0.75)\`. Reset hover on \`isOpen\` change via \`useEffect\`.

## JSX structure
- Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\` + background \`<img opacity-60 object-cover>\`.
- Outer \`width: EXPANDED_WIDTH\` flex container \`justify-start\` (stable left edge).
- Panel: \`motion.div\` \`style={{ width: widthSpring, ...GLASS_STYLE }}\` \`relative isolate flex flex-col items-center gap-2 overflow-visible rounded-3xl px-2.5 py-3\`. Absolute \`z-[-1]\` blur layer.
- Nav list \`flex w-full flex-col gap-1.5\`. Each row: tooltip (when \`!isOpen && hovered\`) + \`motion.button\` with a 44×44 \`rounded-xl\` tinted tile (Phosphor icon size 20) and optional label span.
- Divider \`my-1 h-[1px] w-full\` \`rgba(255,255,255,0.1)\`.
- Toggle container: \`px-1\` + \`justify-start\` when open, else \`justify-center\`. 44×36 \`rounded-2xl\` button bg \`rgba(255,255,255,0.08)\` border \`rgba(255,255,255,0.12)\`, aria-label "Collapse sidebar"/"Expand sidebar". \`ArrowRight\`/\`ArrowLeft\` size 18 \`text-white/70\`.

## Behavior
- \`activeIndex\` state, \`isOpen\` state, \`toggleHovered\` state, per-row \`hovered\` state.
- Reset per-row hover on \`isOpen\` change.
- Use Phosphor: House, MagnifyingGlass, Folders, Bell, ChartLine, Gear, User, ArrowRight, ArrowLeft — all \`weight="regular"\`.
- Font: \`font-sans\` (Manrope).
- \`bg-sand-950\` fixed background; no theme branching.`,

  Gemini: `Implement a React client component named \`GlassSidebar\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState, useEffect } from 'react'
import { motion, useSpring, AnimatePresence } from 'framer-motion'
import { House, MagnifyingGlass, Folders, Bell, ChartLine, Gear, User, ArrowRight, ArrowLeft } from '@phosphor-icons/react'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or helpers not shown above. Do NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX.

## Phosphor icons (weight="regular")
Nav (size 20): House, MagnifyingGlass, Folders, Bell, ChartLine, Gear, User.
Toggle (size 18): ArrowRight, ArrowLeft.

## Constants
- \`COLLAPSED_WIDTH = 64\`
- \`EXPANDED_WIDTH = 220\`
- \`ICON_TILE_SIZE = 44\`
- \`TOGGLE_BUTTON_HEIGHT = 36\`
- Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\`
- Glass style: \`background: rgba(255,255,255,0.06)\`, \`border: 1px solid rgba(255,255,255,0.1)\`, \`boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`
- Glass blur (separate layer): \`backdrop-filter: blur(24px) saturate(1.8)\` (+ \`WebkitBackdropFilter\`)
- Nav items array \`[{ icon, label, color }]\`: House/Home/#3A86FF, MagnifyingGlass/Search/#B388FF, Folders/Projects/#FFBE0B, Bell/Notifications/#FF5C8A, ChartLine/Analytics/#06D6A0, Gear/Settings/#C9A96E, User/Profile/#FF7B54.

## Layout
Root \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\` with background image \`opacity-60 object-cover\`. Anchor container \`style={{ width: EXPANDED_WIDTH }}\` \`flex items-center justify-start\`.

## Panel
\`motion.div\` \`style={{ width: widthSpring, ...GLASS_STYLE }}\` \`relative isolate flex h-auto flex-col items-center gap-2 overflow-visible rounded-3xl px-2.5 py-3\`. Entrance \`initial { x: -20 }\`, \`animate { x: 0 }\`, spring \`{ stiffness: 200, damping: 22, delay: 0.1 }\`. Inside: absolute blur layer \`pointer-events-none absolute inset-0 z-[-1] rounded-3xl\`.

Width spring: \`const widthSpring = useSpring(COLLAPSED_WIDTH, { stiffness: 280, damping: 26 })\`. On toggle: \`widthSpring.set(next ? EXPANDED_WIDTH : COLLAPSED_WIDTH)\`.

## Nav row
For each \`(item, i)\`: \`relative flex w-full items-center\` wrapper.
- Tooltip (\`!isOpen && hovered\` only, AnimatePresence): \`left-[calc(100%+10px)] z-50 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-white/90\`, glass style + blur. Enter \`{ opacity:0, x:-6 }\` ↔ \`{ opacity:1, x:0 }\`, \`duration: 0.15\`.
- Button: \`motion.button\` \`flex w-full items-center gap-3 rounded-xl cursor-pointer justify-start\`, \`animate { scale: hovered ? (isOpen ? 1.08 : 1.15) : 1, x: hovered ? (isOpen ? 0 : 3) : 0 }\`, \`whileTap { scale: 0.90 }\`, spring \`{ stiffness: 320, damping: 20 }\`.
- Tile: 44×44 \`rounded-xl\` tinted: active \`\${color}28 / \${color}44\`, inactive \`\${color}18 / \${color}22\` with CSS transition. Icon size 20 tinted to \`item.color\`.
- Label: only when \`isOpen\`, AnimatePresence, \`text-sm font-semibold\`, color \`isActive ? item.color : 'rgba(255,255,255,0.75)'\`. Enter \`{ opacity:1, x:0, transition: { duration: 0.18, ease: 'easeOut', delay: 0.18 + index * 0.03 } }\`, exit \`{ opacity:0, x:-6, transition: { duration: 0.08, ease: 'easeIn' } }\`.
- \`useEffect(() => setHovered(false), [isOpen])\` to reset stuck hover.

## Divider
\`my-1 w-full h-[1px]\` \`rgba(255,255,255,0.1)\`.

## Toggle
Outer flex \`px-1 justify-start\` when open, \`justify-center\` otherwise. Button: 44×36 \`rounded-2xl\` \`rgba(255,255,255,0.08)\` border \`rgba(255,255,255,0.12)\`, \`animate { scale: toggleHovered ? 1.08 : 1 }\`, \`whileTap { scale: 0.90 }\`, spring \`{ stiffness: 300, damping: 20 }\`, aria-label "Collapse sidebar"/"Expand sidebar". \`AnimatePresence mode="wait" initial={false}\`: show \`ArrowLeft\` when open, \`ArrowRight\` when collapsed — each spinning \`{ opacity:0, rotate:±90 }\` ↔ \`{ opacity:1, rotate:0 }\`, \`duration: 0.18\`. Both arrows \`text-white/70\`.

## Behavior
- State: \`isOpen\`, \`activeIndex\`, \`toggleHovered\`.
- Font \`font-sans\` (Manrope). Fixed dark background.`,

  V0: `Create a \`GlassSidebar\` component — a vertical glass-morphism navigation rail that springs open from 64px to 220px wide.

Over a dreamy pink floral background sits a frosted translucent panel with rounded corners, a soft inset highlight, and 24px backdrop blur with 1.8x saturation. It shows a column of 44×44 tinted icon tiles (each a different pastel hue) for Home, Search, Projects, Notifications, Analytics, Settings, Profile — using Phosphor icons (weight='regular'). Below a thin divider there's a small rounded arrow button that toggles expand/collapse; the arrow spins 90° on swap.

When collapsed, hovering a tile scales it up slightly and nudges it right, and a small glass tooltip fades in to the right showing the label. When expanded, labels slide in from the left with a staggered delay after the panel widens. Active items get a brighter tinted background and the label takes the tile's accent color. Use a Framer Motion spring for the width so it feels physical — snappy but not bouncy. Keep the backdrop blur on a separate non-animating layer so it doesn't re-rasterize every frame.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'). Manrope font. Center the sidebar over \`bg-sand-950\` with the background image at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\` at 60% opacity.`,
}
