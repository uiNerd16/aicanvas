import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassTabBar\` — a glass-morphism pill tab bar with five icon-and-label tabs and a sliding active glow.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background: \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866\`, \`object-cover opacity-60\`, over \`bg-sand-950\`.

Tabs (Phosphor, \`weight="regular"\`):
- \`House\` / "Home" / #3A86FF
- \`Compass\` / "Explore" / #FF7B54
- \`PlusCircle\` / "Create" / #06D6A0
- \`ChatCircle\` / "Messages" / #FF5C8A
- \`User\` / "Profile" / #B388FF

Pill container: \`motion.div\` \`relative isolate flex w-[380px] items-center justify-around rounded-full px-5 py-2.5\` —
- \`background: rgba(255,255,255,0.07)\`
- \`border: 1px solid rgba(255,255,255,0.11)\`
- \`boxShadow: 0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)\`
- Separate non-animating blur layer (\`absolute inset-0 z-[-1] rounded-full\`): \`backdrop-filter: blur(24px) saturate(1.8)\`
- Entrance \`initial { y: 20 }\` → \`animate { y: 0 }\`, spring \`{ stiffness: 200, damping: 24 }\`.

Each tab: \`motion.button\` \`relative flex cursor-pointer flex-col items-center gap-px px-3 py-1\`, \`whileTap { scale: 0.85 }\`, state: \`hovered\` per index + global \`active\` index.

Active background: a \`motion.div layoutId="tab-glow"\` that slides between tabs via spring \`{ stiffness: 350, damping: 30 }\`:
- Middle tabs: \`-inset-x-3\`
- First tab (i===0): \`-left-5 -right-3\`
- Last tab (i===TABS.length-1): \`-left-3 -right-5\`
- \`-inset-y-1 rounded-full\`, \`background: rgba(255,255,255,0.1)\`, \`border: 1px solid rgba(255,255,255,0.08)\`

Edge tabs' inner content is shifted \`translateX(-4px)\` (first) or \`translateX(4px)\` (last) so it stays centered inside the asymmetric glow.

Icon: wrapped in a bare \`motion.div\` (no background or border) that animates \`{ scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }\` via spring \`{ stiffness: 400, damping: 20 }\`. Icon size 20, color: active → \`tab.color\`, hovered → \`rgba(255,255,255,0.7)\`, idle → \`rgba(255,255,255,0.32)\` (CSS transition).

Label under icon: \`text-[10px] font-medium\`, same color ramp as icon.

Use Manrope font.`,

  GPT: `Build a React client component named \`GlassTabBar\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866\`
Tabs (in order):
1. House / "Home" / #3A86FF
2. Compass / "Explore" / #FF7B54
3. PlusCircle / "Create" / #06D6A0
4. ChatCircle / "Messages" / #FF5C8A
5. User / "Profile" / #B388FF

## Glass surface
\`background: rgba(255,255,255,0.07)\`, \`border: 1px solid rgba(255,255,255,0.11)\`, \`boxShadow: 0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)\`. Blur on separate \`absolute inset-0 z-[-1] rounded-full\` div: \`backdrop-filter: blur(24px) saturate(1.8)\` (+ Webkit).

## Framer Motion
- Bar entrance \`initial { y: 20 }\`, \`animate { y: 0 }\`, \`{ type: 'spring', stiffness: 200, damping: 24 }\`.
- Active glow: \`motion.div layoutId="tab-glow"\` \`{ type: 'spring', stiffness: 350, damping: 30 }\`.
- Icon tile: \`animate { scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }\`, \`{ type: 'spring', stiffness: 400, damping: 20 }\`.
- \`whileTap { scale: 0.85 }\` on the tab button.

## Hover state
- Icon + label color: active \`tab.color\`, hovered \`rgba(255,255,255,0.7)\`, idle \`rgba(255,255,255,0.32)\` — CSS \`transition: color 0.2s ease\`.
- Hover state applies only when not active.

## JSX structure
- Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\` + background img \`opacity-60\`.
- Pill: \`motion.div relative isolate flex w-[380px] items-center justify-around rounded-full px-5 py-2.5\` + glass style. Separate \`z-[-1]\` absolute blur layer.
- Each tab: \`motion.button key={tab.label} relative flex cursor-pointer flex-col items-center gap-px px-3 py-1\` \`whileTap={{ scale: 0.85 }}\` \`onClick\` sets active, \`onHoverStart/End\` toggles \`hovered\` state (\`number | null\`).
- If active, render \`<motion.div layoutId="tab-glow">\` absolute with asymmetric insets for edge tabs: i===0 → \`-left-5 -right-3\`, i===last → \`-left-3 -right-5\`, middle → \`-inset-x-3\`; all \`-inset-y-1 rounded-full\`, bg \`rgba(255,255,255,0.1)\`, border \`rgba(255,255,255,0.08)\`.
- Content wrapper \`relative z-10 flex flex-col items-center gap-px\`: transform \`translateX(-4px)\` on first tab, \`translateX(4px)\` on last, undefined otherwise.
- Icon wrapped in bare \`motion.div\` (no container styles). Icon size 20 \`weight="regular"\`.
- Label span \`text-[10px] font-medium\` below icon.

## Behavior
- State: \`active\` (number, init 0), \`hovered\` (number | null).
- \`isHover = hovered === i && !isActive\`.
- Phosphor: House, Compass, PlusCircle, ChatCircle, User.
- Font \`font-sans\` (Manrope). Fixed \`bg-sand-950\`.`,

  Gemini: `Implement a React client component named \`GlassTabBar\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { House, Compass, PlusCircle, ChatCircle, User } from '@phosphor-icons/react'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or helpers not shown above. Do NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX.

## Phosphor icons (weight="regular", size 20)
\`House\`, \`Compass\`, \`PlusCircle\`, \`ChatCircle\`, \`User\`.

## Constants
- Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866\`
- \`TABS = [{ icon: House, label: 'Home', color: '#3A86FF' }, { icon: Compass, label: 'Explore', color: '#FF7B54' }, { icon: PlusCircle, label: 'Create', color: '#06D6A0' }, { icon: ChatCircle, label: 'Messages', color: '#FF5C8A' }, { icon: User, label: 'Profile', color: '#B388FF' }]\`

## Layout
Root \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`. Background \`<img>\` \`opacity-60 object-cover\`.

## Pill container
\`motion.div\` \`relative isolate flex w-[380px] items-center justify-around rounded-full px-5 py-2.5\`. Style:
- \`background: rgba(255,255,255,0.07)\`
- \`border: 1px solid rgba(255,255,255,0.11)\`
- \`boxShadow: 0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)\`

Entrance: \`initial { y: 20 }\`, \`animate { y: 0 }\`, \`transition: { type: 'spring', stiffness: 200, damping: 24 }\`.

Blur layer child: \`pointer-events-none absolute inset-0 z-[-1] rounded-full\` with \`backdrop-filter: blur(24px) saturate(1.8)\` (+ Webkit).

## Tabs
State: \`const [active, setActive] = useState(0)\`, \`const [hovered, setHovered] = useState<number | null>(null)\`.

Map TABS to \`motion.button\`:
- \`onClick={() => setActive(i)}\`
- \`onHoverStart={() => setHovered(i)}\`, \`onHoverEnd={() => setHovered(null)}\`
- \`className="relative flex cursor-pointer flex-col items-center gap-px px-3 py-1"\`
- \`whileTap={{ scale: 0.85 }}\`

Compute \`isActive = active === i\`, \`isHover = hovered === i && !isActive\`.

Inside, if \`isActive\` render \`<motion.div layoutId="tab-glow">\` with className built from: first tab \`-left-5 -right-3\`, last tab \`-left-3 -right-5\`, else \`-inset-x-3\`; always add \`absolute -inset-y-1 rounded-full\`. Style \`background: rgba(255,255,255,0.1)\`, \`border: 1px solid rgba(255,255,255,0.08)\`. Transition \`{ type: 'spring', stiffness: 350, damping: 30 }\`.

Content wrapper: \`relative z-10 flex flex-col items-center gap-px\` with inline \`transform\`: first → \`translateX(-4px)\`, last → \`translateX(4px)\`, else undefined.

Icon: bare \`motion.div\` (no background, border, or fixed size) with \`animate { scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }\`, \`{ type: 'spring', stiffness: 400, damping: 20 }\`. Inside: \`<Icon size={20} weight="regular" style={{ color: isActive ? tab.color : isHover ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.32)', transition: 'color 0.2s ease' }} />\`.

Label: \`<span className="text-[10px] font-medium" style={{ color: ..., transition: 'color 0.2s ease' }}>{tab.label}</span>\` (same color ramp).

## Behavior
- Font \`font-sans\` (Manrope).
- Fixed dark background.`,

  V0: `Create a \`GlassTabBar\` component — a floating 380px wide glass-morphism pill tab bar with five icon tabs and a sliding active glow.

Over a dreamy orange floral background, show a translucent white pill with a soft drop shadow and 24px backdrop blur on a separate non-animating layer. Inside, five evenly-spaced tabs using Phosphor icons (weight='regular'): Home (blue House #3A86FF), Explore (orange Compass #FF7B54), Create (green PlusCircle #06D6A0), Messages (pink ChatCircle #FF5C8A), Profile (purple User #B388FF). Each tab shows the icon directly (no container box) above a tiny 10px label.

The active tab has a frosted highlight pill behind it that slides between tabs using Framer Motion \`layoutId\` with a spring — for first and last tabs the glow extends slightly toward the bar edges so it's never clipped. The active icon and label take the tab's accent color; the active icon also scales up ~1.15x and nudges up by 1px. Hovering a non-active tab brightens the icon and label to white/70. Tapping scales the tab down slightly.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'). Manrope font. Center the bar over \`bg-sand-950\` with the background image at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png\` at 60% opacity.`,
}
