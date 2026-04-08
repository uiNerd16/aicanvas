import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/glass-navbar/index.tsx:

\`\`\`ts
'use client'
// Named export: GlassNavbar
// Imports: useState from react, motion + AnimatePresence from framer-motion, List + X from @phosphor-icons/react
\`\`\`

STATE: active (number|null, default null — no item selected on load), hovered (number|null), menuOpen (boolean)

CONSTANTS:
\`\`\`ts
const NAV_ITEMS = ['Products', 'About', 'Blog']

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
}

const ctaStyle = {
  background: 'linear-gradient(135deg, rgba(255,160,50,0.75), rgba(220,60,40,0.6))',
  border: '1px solid rgba(255,180,80,0.25)',
  boxShadow: '0 2px 16px rgba(220,80,30,0.4)',
}
\`\`\`

LAYOUT:
Root div: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950
  Background img: absolute inset-0 h-full w-full object-cover opacity-60 pointer-events-none
  Column wrapper: relative flex w-[calc(100%-2rem)] max-w-[720px] flex-col

NAVBAR (motion.nav):
  rounded-full px-2 py-2, w-full, flex items-center gap-1, style=glassStyle
  Entrance: initial y:-40 opacity:0 → animate y:0 opacity:1, spring stiffness:200 damping:24

  LOGO (left): flex items-center gap-2 px-3
    Spinning square: motion.div h-6 w-6 rounded-lg, gradient #FF6BF5→#FFBE0B
      animate: rotate:[0,360], transition: duration:20 repeat:Infinity ease:linear
    "Studio": text-sm font-semibold text-white/90

  flex-1 spacer (pushes right group to far right)

  DESKTOP NAV (hidden sm:flex, items-center gap-1):
    Each NAV_ITEM → motion.button, relative, rounded-full px-5 py-2, text-sm font-medium
      color: active===i || hovered===i ? rgba(255,255,255,0.95) : rgba(255,255,255,0.5)
      onHoverStart/End sets hovered, onClick sets active
      whileTap scale:0.97

      Active pill: render when active===i
        motion.div layoutId="glass-nav-active", absolute inset-0 rounded-full
        style: bg rgba(255,255,255,0.12), border rgba(255,255,255,0.1)
        transition: spring stiffness:400 damping:30

      // No hover background — text color alone changes on hover (white/95 vs white/50)

      span relative z-10 for text

    Get Started: motion.button ml-2 rounded-full px-5 py-2 text-sm font-semibold text-white
      style: ctaStyle
      whileHover: scale:1.04 + brighter gradient + stronger shadow
      whileTap: scale:0.96
      transition: duration:0.25 ease:[0.25,0.1,0.25,1]

  MOBILE HAMBURGER (flex sm:hidden, mr-2):
    motion.button rounded-full p-2 cursor-pointer, bg rgba(255,255,255,0.08), onClick toggles menuOpen
    AnimatePresence mode="wait": swap List↔X icons with rotate±90 + fade, duration:0.15

MOBILE DROPDOWN (below nav, sm:hidden):
  AnimatePresence wrapping motion.div
  mt-2 rounded-2xl p-2 flex flex-col gap-1, style=glassStyle
  initial/exit: opacity:0 y:-8 scale:0.97 | animate: opacity:1 y:0 scale:1
  transition: duration:0.22 ease:[0.25,0.1,0.25,1]

  NAV_ITEMS as plain buttons: rounded-full px-5 py-2.5 text-sm font-medium
    active item: bg rgba(255,255,255,0.1), color white/95; else transparent, white/55
    onClick: setActive(i) + setMenuOpen(false)

  Get Started: rounded-full px-5 py-2.5 text-sm font-semibold text-white, style=ctaStyle`,

  V0: `Create a responsive frosted-glass navigation bar component.

**Layout**
- Full-width pill-shaped navbar (max 720px, centered)
- Left: spinning gradient logo square (pink→yellow, rounded-lg, 24×24px, rotates 360° on loop) + "Studio" label
- Right (desktop): nav links + "Get Started" CTA button — all grouped together on the right
- An invisible spacer between logo and nav links creates the gap

**Nav links:** Products, About, Blog
- Default state: nothing selected (active = null). The logo IS the home — clicking it deselects all links.
- Pill-shaped buttons (rounded-full)
- Inactive: white/50 opacity text; active or hovered: white/95
- Active state: semi-transparent white pill background slides under the active item using Framer Motion layoutId ("glass-nav-active"), spring physics
- Hover state: text brightens to white/95 only — no background pill

**Get Started button**
- Gradient: orange→red — linear-gradient(135deg, rgba(255,160,50,0.75), rgba(220,60,40,0.6))
- Glow shadow: 0 2px 16px rgba(220,80,30,0.4)
- On hover: brightens to rgba(255,180,80,0.9)→rgba(235,75,45,0.8), stronger glow
- Scale 1.04 on hover, 0.96 on tap

**Glass style (apply to navbar pill and mobile dropdown)**
- background: rgba(255,255,255,0.08)
- backdropFilter: blur(24px) saturate(1.8)
- border: 1px solid rgba(255,255,255,0.12)
- boxShadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)
- border-radius: 9999px (pill)

**Responsive / mobile (below sm breakpoint)**
- Hide nav links and CTA, show a hamburger icon button (rounded-full, glass background)
- Hamburger toggles a dropdown below the navbar (rounded-2xl, same glass style)
- Dropdown lists nav items vertically + Get Started at the bottom
- Hamburger icon animates between ☰ and ✕ with a rotate+fade transition

**Entrance animation:** navbar slides in from y:-40, opacity 0 → y:0, opacity:1 — spring stiffness 200, damping 24

**Background:** full-bleed image behind everything, opacity-60`,
}
