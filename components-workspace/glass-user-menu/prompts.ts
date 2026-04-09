import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassUserMenu\` — a glass user-menu trigger over an ethereal orange flower background that opens a frosted glass dropdown grouped into Account, Workspace, and a Log Out row.

Write this as a single self-contained React client component. Inline everything. One inner \`MenuItem\` and one inner \`LogOutItem\` subcomponent are OK. 'use client' at the top. No 'any' types.

## Background
\`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`, \`object-cover opacity-60\` over \`bg-sand-950\`. Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`. Wrapper: \`relative flex flex-col items-center px-4\` with \`marginTop: -150\` so the menu opens downward without clipping.

## Data
- USER: \`{ name: 'Jennifer Rivera', email: 'jennifer@studio.io', initials: 'JR' }\`
- MENU_GROUPS:
  - Account: Profile (User icon, #3A86FF), Settings (Gear icon, #B388FF)
  - Workspace: Team (Users icon, #06D6A0), Billing (CreditCard icon, #FFBE0B)
- Log Out row at the bottom: SignOut icon, color #FF5A5A, label "Log Out"

## Glass tokens (inline as constants)
\`glassPanel = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)' }\`
\`glassPanelBlur = { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }\`
\`ACTIVE_GLOW = '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1.5px rgba(255,160,50,0.5), 0 0 20px rgba(255,160,50,0.12)'\`

## Trigger
\`motion.button\` \`relative isolate flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5\` with \`glassPanel\` style and a separate non-animating blur layer (absolute inset-0 z-[-1] rounded-2xl). \`whileHover { scale: 1.02 }\`, \`whileTap { scale: 0.97 }\`. Animate \`boxShadow\` between \`glassPanel.boxShadow\` and \`ACTIVE_GLOW\` based on \`open\`, spring \`{ stiffness: 300, damping: 26 }\`. Inside: 32×32 circular avatar \`background: linear-gradient(135deg, #FF7B54, #FF6BF5)\` containing initials in white text-xs font-bold; name span \`text-sm font-semibold text-white/80\`; CaretDown icon (\`@phosphor-icons/react\`, size 18 weight="regular", \`text-white/40\`) in a \`motion.div\` that animates rotate 0 → 180 on open with spring \`{ stiffness: 400, damping: 28 }\`. Click toggles \`open\`.

## Dropdown
\`AnimatePresence\` around a \`motion.div\` rendered when \`open\`. \`absolute isolate top-full mt-2 w-[min(256px,calc(100vw-32px))] rounded-2xl p-2\` with \`glassPanel\` style and \`transformOrigin: 'top center'\`. Initial \`{ opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }\`, animate to \`{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }\`, exit reverse, transition spring \`{ stiffness: 350, damping: 28 }\`. Non-animating blur layer inside (\`pointer-events-none absolute inset-0 z-[-1] rounded-2xl\`). Top-edge highlight: \`absolute left-6 right-6 top-0 h-[1px]\` background \`linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)\`.

For each group: \`<p className="mb-0.5 px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">{group.label}</p>\`, then map items to \`<MenuItem />\`. After Account+Workspace, render a divider \`mx-2 my-1.5 h-[1px]\` background \`rgba(255,255,255,0.07)\`, then \`<LogOutItem />\`.

## MenuItem
Outer \`motion.div\` \`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5\` with \`minHeight: 44\`. Initial \`{ opacity: 0 }\`, animate \`{ opacity: 1 }\`, transition \`{ duration: 0.15, delay: 0.06 + index * 0.04 }\`. Track \`hovered\` per item with \`onMouseEnter/Leave\`. Inside: \`motion.button\` \`flex min-w-0 flex-1 cursor-pointer items-center gap-2.5\` with \`transformOrigin: 'left center'\`, animate \`{ x: hovered ? 3 : 0, scale: hovered ? 1.08 : 1 }\`, \`whileTap { scale: 0.90 }\`, transition spring \`{ stiffness: 320, damping: 20 }\`. Children: 32×32 \`rounded-xl\` icon badge \`background: \${color}18\`, \`border: 1px solid \${color}22\`, containing the icon at size 16 weight="regular" with \`color\` style; label span \`text-sm font-medium\` with color \`rgba(255,255,255,0.95)\` when hovered else \`rgba(255,255,255,0.70)\`, transition \`color 0.15s\`.

## LogOutItem
Same shape as MenuItem but red: badge background \`#FF5A5A18\` border \`#FF5A5A22\`, SignOut icon color \`#FF5A5A\`, label color \`rgba(255,90,90,0.95)\` hovered or \`rgba(255,90,90,0.70)\` idle.

## Outside-click close
Wrap dropdown in a \`ref\` div. \`useEffect\` while open: add \`mousedown\` and \`touchstart\` document listeners; if \`!ref.current.contains(target)\` set \`open = false\`. Cleanup removes both. No 'any' types — type the listener event as \`MouseEvent | TouchEvent\`.

Use Manrope font.`,

  GPT: `Build a React client component named \`GlassUserMenu\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces for the exported component (no props). Two inner subcomponents \`MenuItem\` and \`LogOutItem\` are allowed. Implement exactly what is specified — no more, no less.

## Constants
\`\`\`
const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'
const USER = { name: 'Jennifer Rivera', email: 'jennifer@studio.io', initials: 'JR' }
const MENU_GROUPS = [
  { label: 'Account',   items: [
    { icon: User, label: 'Profile',  color: '#3A86FF' },
    { icon: Gear, label: 'Settings', color: '#B388FF' },
  ]},
  { label: 'Workspace', items: [
    { icon: Users,      label: 'Team',    color: '#06D6A0' },
    { icon: CreditCard, label: 'Billing', color: '#FFBE0B' },
  ]},
]
const glassPanel = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
}
const glassPanelBlur = {
  backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
}
const ACTIVE_GLOW = '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1.5px rgba(255,160,50,0.5), 0 0 20px rgba(255,160,50,0.12)'
\`\`\`

## Phosphor icons
\`import { User, Gear, SignOut, Users, CreditCard, CaretDown } from '@phosphor-icons/react'\` — all rendered with \`weight="regular"\`.

## State
- \`open: boolean\` (default false)
- \`ref = useRef<HTMLDivElement>(null)\` on the wrapper
- Per-item \`hovered: boolean\` inside MenuItem/LogOutItem

## Outside-click effect (deps [open])
If \`!open\` return. Add \`mousedown\` and \`touchstart\` listeners on \`document\` typed as \`(MouseEvent | TouchEvent) => void\`; if \`ref.current && !ref.current.contains(e.target as Node)\` then \`setOpen(false)\`. Cleanup removes both listeners.

## Framer Motion
- Trigger: \`whileHover { scale: 1.02 }\`, \`whileTap { scale: 0.97 }\`, \`animate { boxShadow: open ? ACTIVE_GLOW : glassPanel.boxShadow }\`, transition \`{ type: 'spring', stiffness: 300, damping: 26 }\`.
- CaretDown wrapper: \`animate { rotate: open ? 180 : 0 }\`, \`{ type: 'spring', stiffness: 400, damping: 28 }\`.
- Dropdown panel: \`initial { opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }\`, \`animate { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }\`, \`exit { opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }\`, transition \`{ type: 'spring', stiffness: 350, damping: 28 }\`. Wrap with \`<AnimatePresence>\`.
- MenuItem outer: \`initial { opacity: 0 }\`, \`animate { opacity: 1 }\`, transition \`{ duration: 0.15, delay: 0.06 + index * 0.04 }\`.
- MenuItem inner button: \`animate { x: hovered ? 3 : 0, scale: hovered ? 1.08 : 1 }\`, \`whileTap { scale: 0.90 }\`, transition \`{ type: 'spring', stiffness: 320, damping: 20 }\`.

## JSX structure
Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`.
\`<img src={BACKGROUND} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />\`
Wrapper \`<div ref={ref} className="relative flex flex-col items-center px-4" style={{ marginTop: -150 }}>\`.

Trigger \`motion.button\` \`relative isolate flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5\` style \`{ background: glassPanel.background, border: glassPanel.border }\`. Non-animating blur \`<div className="pointer-events-none absolute inset-0 z-[-1] rounded-2xl" style={glassPanelBlur} />\`. Avatar 32×32 \`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white\` style \`{ background: 'linear-gradient(135deg, #FF7B54, #FF6BF5)' }\`. Name span \`text-sm font-semibold text-white/80\` text \`{USER.name}\`. CaretDown wrapped in \`motion.div\`, \`size={18} weight="regular" className="text-white/40"\`.

Dropdown \`<AnimatePresence>\` then \`motion.div\` className \`absolute isolate top-full mt-2 w-[min(256px,calc(100vw-32px))] rounded-2xl p-2\` style \`{ ...glassPanel, transformOrigin: 'top center' }\`. Inside: blur layer \`pointer-events-none absolute inset-0 z-[-1] rounded-2xl\` style \`glassPanelBlur\`; top-edge highlight \`absolute left-6 right-6 top-0 h-[1px]\` background \`linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)\`. Walk a single \`itemIndex\` counter through groups; for each group render \`<p className="mb-0.5 px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">{group.label}</p>\` then map items to \`<MenuItem icon={item.icon} label={item.label} color={item.color} index={itemIndex++} />\`. After all groups: divider \`<div className="mx-2 my-1.5 h-[1px]" style={{ background: 'rgba(255,255,255,0.07)' }} />\` then \`<LogOutItem index={itemIndex} />\`.

## MenuItem JSX
Outer \`motion.div className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5" style={{ minHeight: 44, background: 'transparent' }}\`. Inner \`motion.button className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5" style={{ background: 'transparent', transformOrigin: 'left center' }}\`. Badge \`flex shrink-0 items-center justify-center rounded-xl\` style \`{ width: 32, height: 32, background: \\\`\${color}18\\\`, border: \\\`1px solid \${color}22\\\` }\` containing the icon \`size={16} weight="regular" style={{ color }}\`. Label span \`text-sm font-medium\` style \`{ color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.70)', transition: 'color 0.15s' }\`.

## LogOutItem JSX
Same as MenuItem with red palette: badge \`background: '#FF5A5A18'\` \`border: '1px solid #FF5A5A22'\`, SignOut icon \`style={{ color: '#FF5A5A' }}\`, label color \`hovered ? 'rgba(255,90,90,0.95)' : 'rgba(255,90,90,0.70)'\`, label text \`Log Out\`.

Font \`font-sans\` (Manrope).`,

  Gemini: `Implement a React client component named \`GlassUserMenu\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Gear, SignOut, Users, CreditCard, CaretDown } from '@phosphor-icons/react'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or helpers not shown above. Do NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX. Phosphor icons must be rendered with \`weight="regular"\`.

## Constants
\`\`\`
const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'
const USER = { name: 'Jennifer Rivera', email: 'jennifer@studio.io', initials: 'JR' }
const MENU_GROUPS = [
  { label: 'Account',   items: [
    { icon: User, label: 'Profile',  color: '#3A86FF' },
    { icon: Gear, label: 'Settings', color: '#B388FF' },
  ]},
  { label: 'Workspace', items: [
    { icon: Users,      label: 'Team',    color: '#06D6A0' },
    { icon: CreditCard, label: 'Billing', color: '#FFBE0B' },
  ]},
]
const glassPanel = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
}
const glassPanelBlur = {
  backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
}
const ACTIVE_GLOW = '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1.5px rgba(255,160,50,0.5), 0 0 20px rgba(255,160,50,0.12)'
\`\`\`

## Inner: MenuItem
Props: \`{ icon: typeof User; label: string; color: string; index: number }\`. Local state \`hovered\` (bool). JSX is \`motion.div\` outer (initial \`{ opacity: 0 }\`, animate \`{ opacity: 1 }\`, transition \`{ duration: 0.15, delay: 0.06 + index * 0.04 }\`, \`onMouseEnter / onMouseLeave\` toggling \`hovered\`, className \`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5\`, style \`{ minHeight: 44, background: 'transparent' }\`) wrapping a \`motion.button\` (animate \`{ x: hovered ? 3 : 0, scale: hovered ? 1.08 : 1 }\`, \`whileTap { scale: 0.90 }\`, transition spring \`{ stiffness: 320, damping: 20 }\`, className \`flex min-w-0 flex-1 cursor-pointer items-center gap-2.5\`, style \`{ background: 'transparent', transformOrigin: 'left center' }\`). Inside the button: badge div \`flex shrink-0 items-center justify-center rounded-xl\` style \`{ width: 32, height: 32, background: \\\`\${color}18\\\`, border: \\\`1px solid \${color}22\\\` }\` containing the Icon at size 16 weight="regular" style \`{ color }\`. Then label span \`text-sm font-medium\` style \`{ color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.70)', transition: 'color 0.15s' }\` text \`{label}\`.

## Inner: LogOutItem
Same shape as MenuItem with hardcoded SignOut icon, badge background \`'#FF5A5A18'\`, border \`'1px solid #FF5A5A22'\`, icon color \`'#FF5A5A'\`, label colors \`'rgba(255,90,90,0.95)'\` (hovered) / \`'rgba(255,90,90,0.70)'\` (idle), label text \`'Log Out'\`. Takes single prop \`{ index: number }\`.

## Outer: GlassUserMenu (exported)
State: \`open: boolean\` (default false). \`const ref = useRef<HTMLDivElement>(null)\`.

\`useEffect\` deps \`[open]\`: if \`!open\` return. Define \`const handler = (e: MouseEvent | TouchEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }\`. \`document.addEventListener('mousedown', handler)\` and \`document.addEventListener('touchstart', handler)\`. Cleanup removes both.

\`let itemIndex = 0\` (mutable counter walked through groups for stagger).

JSX root: \`<div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">\`. Background image \`<img src={BACKGROUND} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />\`. Wrapper \`<div ref={ref} className="relative flex flex-col items-center px-4" style={{ marginTop: -150 }}>\`.

Trigger: \`<motion.button onClick={() => setOpen(v => !v)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} animate={{ boxShadow: open ? ACTIVE_GLOW : glassPanel.boxShadow }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="relative isolate flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5" style={{ background: glassPanel.background, border: glassPanel.border }}>\`. Inside: blur \`<div className="pointer-events-none absolute inset-0 z-[-1] rounded-2xl" style={glassPanelBlur} />\`; avatar \`<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF7B54, #FF6BF5)' }}>{USER.initials}</div>\`; name \`<span className="text-sm font-semibold text-white/80">{USER.name}</span>\`; rotating CaretDown \`<motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}><CaretDown size={18} weight="regular" className="text-white/40" /></motion.div>\`.

Dropdown: \`<AnimatePresence>{open && (<motion.div initial={{ opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }} animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }} transition={{ type: 'spring', stiffness: 350, damping: 28 }} className="absolute isolate top-full mt-2 w-[min(256px,calc(100vw-32px))] rounded-2xl p-2" style={{ ...glassPanel, transformOrigin: 'top center' }}>...</motion.div>)}</AnimatePresence>\`. Inside dropdown: blur layer \`<div className="pointer-events-none absolute inset-0 z-[-1] rounded-2xl" style={glassPanelBlur} />\`; top-edge highlight \`<div className="absolute left-6 right-6 top-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />\`. For each group: \`<div key={group.label} className="mb-1"><p className="mb-0.5 px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">{group.label}</p>\` then map items \`<MenuItem icon={item.icon} label={item.label} color={item.color} index={itemIndex++} />\`. After all groups: divider \`<div className="mx-2 my-1.5 h-[1px]" style={{ background: 'rgba(255,255,255,0.07)' }} />\` then \`<LogOutItem index={itemIndex} />\`.

Font \`font-sans\` (Manrope).`,

  V0: `Create a \`GlassUserMenu\` component — a glass user-menu trigger placed centrally over an ethereal orange flower photo, opening a frosted glass dropdown grouped into Account, Workspace, and a destructive Log Out row.

Background: \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`, \`object-cover opacity-60\`, full-bleed over \`bg-sand-950\`. Center the trigger but with a negative top margin (~-150px) so the dropdown opens downward without clipping.

Trigger: a \`rounded-2xl\` glass pill (\`bg-white/8\`, 1px white border, \`backdrop-blur(24px) saturate(1.8)\`). Inside: a 32px circular avatar with a warm gradient background (\`linear-gradient(135deg, #FF7B54, #FF6BF5)\`) showing the initials "JR" in white bold text, the name "Jennifer Rivera" in semibold white-on-glass, and a Phosphor \`CaretDown\` icon at the end. The trigger gets a warm orange ambient glow (\`box-shadow: 0 0 0 1.5px rgba(255,160,50,0.5), 0 0 20px rgba(255,160,50,0.12)\`) when the menu is open. The CaretDown rotates 180° on open with a snappy spring.

Dropdown: a \`rounded-2xl\` frosted glass panel ~256px wide that springs into view with a scale + blur entrance (initial scale 0.95, y -8, blur 4px → animate scale 1, y 0, blur 0). It contains two groups with tiny uppercase white/25 group labels:

- **Account** — Profile (Phosphor User, #3A86FF), Settings (Phosphor Gear, #B388FF)
- **Workspace** — Team (Phosphor Users, #06D6A0), Billing (Phosphor CreditCard, #FFBE0B)

Each row has a 32×32 \`rounded-xl\` icon badge tinted to that row's color (~10% alpha background, ~15% alpha border), the icon in the row's accent color, and a white/70 label that brightens to white/95 on hover. On hover the entire icon+label group nudges 3px right and scales to 1.08 with a spring.

After the two groups, a thin white/7 divider, then a Log Out row using the same shape but with Phosphor SignOut, color \`#FF5A5A\`, and red-tinted label colors. Clicking outside the menu closes it (mousedown + touchstart listeners on document).

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular').`,
}
