import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/glass-sidebar/index.tsx\`. Export a named function \`GlassSidebar\`.

**File header**
\`\`\`
'use client'
\`\`\`

**Imports**
- React: useState, useEffect
- Framer Motion: motion, useSpring, AnimatePresence
- @phosphor-icons/react: House, MagnifyingGlass, Folders, Bell, ChartLine, Gear, User, ArrowRight, ArrowLeft

**Constants**
\`\`\`ts
const COLLAPSED_WIDTH = 64
const EXPANDED_WIDTH = 220
const ICON_TILE_SIZE = 44
const TOGGLE_BUTTON_HEIGHT = 36
\`\`\`

**NAV_ITEMS array (as const)**
\`\`\`ts
[
  { icon: House,           label: 'Home',          color: '#3A86FF' },
  { icon: MagnifyingGlass, label: 'Search',        color: '#B388FF' },
  { icon: Folders,         label: 'Projects',      color: '#FFBE0B' },
  { icon: Bell,            label: 'Notifications', color: '#FF5C8A' },
  { icon: ChartLine,       label: 'Analytics',     color: '#06D6A0' },
  { icon: Gear,            label: 'Settings',      color: '#C9A96E' },
  { icon: User,            label: 'Profile',       color: '#FF7B54' },
]
\`\`\`

**GLASS_BLUR_STYLE (as const)** — separated so the blur layer is non-animating
- backdropFilter: 'blur(24px) saturate(1.8)'
- WebkitBackdropFilter: 'blur(24px) saturate(1.8)'

**GLASS_STYLE (as const)**
- background: 'rgba(255,255,255,0.06)'
- border: '1px solid rgba(255,255,255,0.1)'
- boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'

**NavItemRow sub-component** — props: item, index (number), isActive (boolean), isOpen (boolean), onActivate (() => void)
- Local useState: hovered (boolean)
- useEffect: reset hovered to false when isOpen changes (prevents tooltip sticking on toggle)
- Tooltip (AnimatePresence): render only when !isOpen && hovered. Glass pill, positioned absolute left-[calc(100%+10px)] z-50. Animate: initial {opacity:0, x:-6} → animate {opacity:1, x:0} → exit {opacity:0, x:-6}, duration 0.15s
- motion.button with explicit animate prop (NOT whileHover):
  - animate.scale: hovered ? (isOpen ? 1.08 : 1.15) : 1
  - animate.x: hovered ? (isOpen ? 0 : 3) : 0
  - whileTap: scale 0.90
  - transition: spring stiffness 320, damping 20
- Icon tile: 44×44px div, rounded-xl (no clipPath). Notification-style tinted badge:
  - Inactive: background \${color}18, border 1px solid \${color}22
  - Active: background \${color}28, border 1px solid \${color}44
  - CSS transition on background and border-color (0.2s)
- Icon component: size=20, weight="regular", style={{ color: item.color }} (full accent color, not white)
- Label (AnimatePresence): render only when isOpen. motion.span initial {opacity:0, x:-8} → animate {opacity:1, x:0, transition:{duration:0.18, ease:'easeOut', delay: 0.18 + index*0.03}} → exit {opacity:0, x:-6, transition:{duration:0.08, ease:'easeIn', delay:0}}. Color: isActive ? item.color : 'rgba(255,255,255,0.75)'

**GlassSidebar main component**
- State: isOpen (boolean, default false), activeIndex (number, default 0)
- widthSpring = useSpring(COLLAPSED_WIDTH, { stiffness: 280, damping: 26 })
- toggle(): flips isOpen, calls widthSpring.set(next ? EXPANDED_WIDTH : COLLAPSED_WIDTH)
- Root div: className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950"
- Background img: absolute inset-0 h-full w-full object-cover opacity-60, src=https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png, alt=""
- Anchor div: style={{width: EXPANDED_WIDTH}}, className="flex items-center justify-start"
  - motion.div sidebar: style={{width: widthSpring, ...GLASS_STYLE}}, initial {x:-20}, animate {x:0}, transition spring stiffness 200 damping 22 delay 0.1, className="relative isolate flex h-auto flex-col items-center gap-2 overflow-visible rounded-3xl px-2.5 py-3"
    - Blur layer: absolute inset-0 z-[-1] rounded-3xl div with GLASS_BLUR_STYLE (non-animating, so blur isn't recalculated every spring frame)
    - Nav items loop (gap-1.5 flex-col)
    - Divider: 1px height, background rgba(255,255,255,0.1)
    - Toggle button: motion.button whileHover scale 1.08, whileTap scale 0.90, spring stiffness 300 damping 20. Size: ICON_TILE_SIZE wide × TOGGLE_BUTTON_HEIGHT tall. Background rgba(255,255,255,0.08), border rgba(255,255,255,0.12). AnimatePresence mode="wait" for arrow swap: ArrowLeft when open (key="left": initial rotate 90, animate rotate 0, exit rotate -90), ArrowRight when closed (key="right": initial rotate -90, animate rotate 0, exit rotate 90). Duration 0.18s each.`,

  V0: `Create a glassmorphism sidebar navigation component called GlassSidebar. It has two states: collapsed (about 64px wide, icons only) and expanded (about 220px wide, icons plus text labels side by side).

The sidebar lives on the left side of a dark preview area. The background shows an ethereal pink flower image (https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png) at 60% opacity over a very dark background. The sidebar itself is a frosted glass panel — semi-transparent white with a strong backdrop blur — floating over that image.

There are 7 navigation items, each with a rounded icon tile (rounded-xl corners) in its own colour: Home in blue, Search in soft purple, Projects in amber, Notifications in pink-red, Analytics in teal, Settings in warm gold, and Profile in coral-orange. Each tile is a notification-style tinted badge — a very faint tint of the icon's colour as the background (about 9% opacity) with a subtle matching border (about 13% opacity). The icon itself is rendered in its full accent colour. The active item gets a slightly stronger tint and border. No gradients, no gloss, no drop-shadows — just clean, flat tinted badges.

At the bottom there's a small toggle button. When collapsed it shows a right-pointing arrow; when expanded it shows a left-pointing arrow. The arrows rotate in on entry and out on exit with a 90° spin animation. Clicking it smoothly springs the sidebar width open or closed — the motion feels physical and momentum-driven, not linear.

When expanding, the text labels slide and fade in with a gentle stagger — each one slightly after the previous. When collapsing, they disappear instantly so the sidebar snaps shut cleanly.

Hovering a nav item in collapsed mode scales it up more and nudges it slightly to the right — a subtle nudge that invites a click. In expanded mode, hover just scales it gently. When collapsed and hovering, a small glass tooltip pill appears to the right of the icon showing the item's label.

Use Next.js, Tailwind CSS, and Framer Motion. Icons come from @phosphor-icons/react.`,
}
