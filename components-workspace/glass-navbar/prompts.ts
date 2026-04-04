import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
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

  Bolt: `Build a GlassNavbar component with these exact specs:

STRUCTURE:
\`\`\`
<div> // full container, relative, overflow-hidden, bg behind image
  <img /> // background, absolute inset-0, object-cover, opacity-60
  <div> // w-[calc(100%-2rem)] max-w-[720px] flex flex-col (navbar + dropdown column)
    <nav> // the pill navbar
    <div> // mobile dropdown (AnimatePresence)
  </div>
</div>
\`\`\`

GLASS STYLE (reuse for nav + dropdown):
\`\`\`js
{
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
}
\`\`\`

NAV PILL: rounded-full, flex, items-center, gap-1, px-2 py-2, w-full
Entrance: motion.nav, initial y:-40 opacity:0, animate y:0 opacity:1, spring stiffness:200 damping:24

LOGO (left):
- motion.div spinning square: h-6 w-6 rounded-lg, gradient #FF6BF5→#FFBE0B, animate rotate:[0,360], duration:20s repeat:Infinity ease:linear
- "Studio" text: text-sm font-semibold text-white/90
- Logo div is clickable: onClick → setActive(null) (home = no link selected)
- flex-1 spacer after logo pushes nav items right

NAV ITEMS (desktop, hidden sm:flex):
const NAV_ITEMS = ['Products', 'About', 'Blog']
// active starts as null — no item selected by default
- motion.button, rounded-full px-5 py-2, text-sm font-medium
- color: active/hovered → rgba(255,255,255,0.95), else rgba(255,255,255,0.5)
- Active: <motion.div layoutId="glass-nav-active" className="absolute inset-0 rounded-full" style={{background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.1)'}} transition={{type:'spring',stiffness:400,damping:30}} />
- Hover (when not active): <motion.div layoutId="glass-nav-hover" className="absolute inset-0 rounded-full" style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.06)'}} transition={{type:'tween',duration:0.35,ease:[0.25,0.1,0.25,1]}} />

GET STARTED (desktop):
ml-2, rounded-full px-5 py-2, text-sm font-semibold text-white
style: { background:'linear-gradient(135deg,rgba(255,160,50,0.75),rgba(220,60,40,0.6))', border:'1px solid rgba(255,180,80,0.25)', boxShadow:'0 2px 16px rgba(220,80,30,0.4)' }
whileHover: { scale:1.04, background:'linear-gradient(135deg,rgba(255,180,80,0.9),rgba(235,75,45,0.8))', boxShadow:'0 4px 24px rgba(220,80,30,0.6)' }
whileTap: scale:0.96
transition: duration:0.25 ease:[0.25,0.1,0.25,1]

MOBILE (sm:hidden):
- Hamburger button: rounded-full p-2, background rgba(255,255,255,0.08), toggles menuOpen state
- Icon swaps List↔X with AnimatePresence mode="wait", rotate±90 + fade, duration:0.15
- Dropdown: AnimatePresence, motion.div mt-2 rounded-2xl p-2 flex-col gap-1 same glassStyle
  - initial/exit: opacity:0 y:-8 scale:0.97 → animate: opacity:1 y:0 scale:1
  - transition: duration:0.22 ease:[0.25,0.1,0.25,1]
  - Nav items as plain buttons, active item gets rgba(255,255,255,0.1) bg
  - Get Started button same gradient style at bottom`,

  Lovable: `I want a beautiful frosted-glass navigation bar with a pill shape and smooth animations.

Here's the design:

**Overall shape:** A wide pill-shaped navbar (max 720px wide) with a glass/frosted effect — semi-transparent white background with a strong blur behind it, a subtle white border, and a soft shadow.

**Left side — Logo:**
A small square logo icon that slowly spins (full 360° rotation, 20 second loop), with a pink-to-yellow gradient. Next to it, the text "Studio" in white. There's a big gap between the logo and the nav links — the logo stays left, everything else pushes right.

**Right side — Navigation + CTA:**
Three links: Products, About, Blog — followed by a "Get Started" button.

The nav links have a clever hover effect: when you hover between them, a frosted pill slides smoothly from one to the next (like a liquid transition). The active link has its own pill that also slides when you click. The two pills are independent — hover and active never interfere.

The "Get Started" button has a warm orange-to-red gradient with a glow, and brightens on hover.

**Mobile:** On small screens, hide the nav links and show a hamburger icon instead. Clicking it opens a dropdown below the navbar (same glass style, rounded corners) with the links stacked vertically and Get Started at the bottom. The hamburger icon animates to an X when open.

**Feel:** Premium, glassy, smooth. The navbar floats in from above on load with a spring animation.`,

  'Claude Code': `Create components-workspace/glass-navbar/index.tsx:

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

  Cursor: `Build components-workspace/glass-navbar/index.tsx — a responsive frosted-glass navbar.

Named export: GlassNavbar. 'use client' at top.
Imports: useState, motion, AnimatePresence, List + X from @phosphor-icons/react.

---

SHARED STYLES (define as constants):
\`\`\`ts
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

---

ROOT STRUCTURE:
\`\`\`
div.relative.flex.h-full.w-full.items-center.justify-center.overflow-hidden.bg-sand-950
  img (bg, absolute, inset-0, object-cover, opacity-60)
  div.relative.flex.w-[calc(100%-2rem)].max-w-[720px].flex-col  ← column: nav + dropdown
    motion.nav (navbar pill)
    AnimatePresence → motion.div (mobile dropdown)
\`\`\`

---

NAVBAR PILL (motion.nav):
Classes: flex w-full items-center gap-1 rounded-full px-2 py-2
Style: glassStyle
Entrance: initial={y:-40,opacity:0} animate={y:0,opacity:1} spring stiffness:200 damping:24

Inside (left→right):
1. Logo group (flex items-center gap-2 px-3):
   - motion.div: h-6 w-6 rounded-lg, bg gradient(#FF6BF5,#FFBE0B), animate rotate:[0,360] 20s loop
   - span "Studio": text-sm font-semibold text-white/90

2. div.flex-1  ← pushes everything right

3. Desktop group (hidden sm:flex items-center gap-1):
   - 3 nav buttons (Products/About/Blog):
     motion.button relative rounded-full px-5 py-2 text-sm font-medium
     Text color: active/hovered=white/95, else white/50
     Active pill inside (absolute inset-0 rounded-full):
       "glass-nav-active" — spring 400/30, bg rgba(255,255,255,0.12) — renders when active===i
     Hover: text color only (white/95), no background pill

   - Get Started: motion.button ml-2 rounded-full px-5 py-2 text-sm font-semibold text-white
     style: ctaStyle
     whileHover: {scale:1.04, brighter gradient, stronger glow}
     whileTap: scale:0.96

4. Mobile hamburger (flex sm:hidden mr-2):
   motion.button rounded-full p-2, bg rgba(255,255,255,0.08), onClick toggles menuOpen
   AnimatePresence mode="wait": List ↔ X with rotate 90°+fade, duration 0.15s

---

MOBILE DROPDOWN (below nav):
AnimatePresence → motion.div when menuOpen && sm:hidden
Classes: mt-2 rounded-2xl p-2 flex flex-col gap-1
Style: glassStyle
Animation: opacity+y(-8)+scale(0.97) in/out, duration 0.22s ease:[0.25,0.1,0.25,1]

Contents:
- plain button per nav item: rounded-full px-5 py-2.5 text-sm font-medium
  active: bg rgba(255,255,255,0.1) text-white/95 | else transparent text-white/55
  onClick: setActive(i) + setMenuOpen(false)
- Get Started button: same ctaStyle, rounded-full, closes menu on click`,
}
