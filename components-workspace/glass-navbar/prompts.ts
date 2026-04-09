import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassNavbar\` — a responsive frosted-glass pill navbar with layoutId active highlight, warm gradient CTA, and a mobile hamburger dropdown.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background image (absolute inset-0 object-cover opacity-60 pointer-events-none):
\`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866\`

Constants:
- NAV_ITEMS = ['Products', 'About', 'Blog']
- glassStyle = { background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', boxShadow:'0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' }
- glassBlur  = { backdropFilter:'blur(24px) saturate(1.8)', WebkitBackdropFilter:'blur(24px) saturate(1.8)' } — applied on a separate child layer (so the spinning logo doesn't repaint the blur every frame)
- ctaStyle = { background:'linear-gradient(135deg, rgba(255,160,50,0.75), rgba(220,60,40,0.6))', border:'1px solid rgba(255,180,80,0.25)', boxShadow:'0 2px 16px rgba(220,80,30,0.4)' }
- ctaHoverStyle = { background:'linear-gradient(135deg, rgba(255,180,80,0.9), rgba(235,75,45,0.8))', boxShadow:'0 4px 24px rgba(220,80,30,0.6)' }

State: active (number|null, default null — nothing selected), hovered (number|null), menuOpen (boolean).

Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950. Background <img>. Column wrapper: relative flex w-[calc(100%-2rem)] max-w-[720px] flex-col.

NAVBAR motion.nav: initial {y:-40} animate {y:0} transition {type:'spring', stiffness:200, damping:24}. className "relative isolate flex w-full items-center gap-1 rounded-full px-2 py-2". Style=glassStyle. Separate blur child (absolute inset-0 z-[-1] rounded-full glassBlur).

Logo div (flex items-center gap-2 px-3 cursor-pointer, onClick setActive(null)): spinning motion.div h-6 w-6 rounded-lg, background 'linear-gradient(135deg, #FF6BF5, #FFBE0B)', animate {rotate:[0,360]} transition {duration:20, repeat:Infinity, ease:'linear'}. Text: <span className="text-sm font-semibold text-white/90">Studio</span>.

flex-1 spacer.

Desktop group (hidden items-center gap-1 sm:flex): each NAV_ITEM → motion.button relative cursor-pointer rounded-full px-5 py-2 text-sm font-medium. Style color: (active===i || hovered===i) ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)'. onHoverStart/End sets hovered. onClick sets active. whileTap {scale:0.97}. If active===i, render motion.div layoutId="glass-nav-active" absolute inset-0 rounded-full, style bg 'rgba(255,255,255,0.12)' border '1px solid rgba(255,255,255,0.1)', transition {type:'spring', stiffness:400, damping:30}. Label span: relative z-10. (No hover background — text color change only.)

"Get Started" motion.button (ml-2 rounded-full px-5 py-2 text-sm font-semibold text-white cursor-pointer): style=ctaStyle. whileHover {scale:1.04, ...ctaHoverStyle}. whileTap {scale:0.96}. transition {duration:0.25, ease:[0.25,0.1,0.25,1]}.

MOBILE hamburger motion.button (mr-2 flex cursor-pointer items-center justify-center rounded-full p-2 text-white/70 sm:hidden): style bg 'rgba(255,255,255,0.08)'. onClick toggles menuOpen. whileTap {scale:0.9}. Inside AnimatePresence mode="wait" initial={false}: menuOpen ? motion.span key="x" initial {rotate:-90, opacity:0} animate {rotate:0, opacity:1} exit {rotate:90, opacity:0} {duration:0.15} with <X size={18} weight="bold" /> : motion.span key="menu" initial {rotate:90, opacity:0} animate {rotate:0, opacity:1} exit {rotate:-90, opacity:0} with <List size={18} weight="bold" />.

MOBILE DROPDOWN: AnimatePresence wrapping motion.div (mt-2 relative isolate flex flex-col gap-1 rounded-2xl p-2 sm:hidden, style=glassStyle + blur layer inside). initial {opacity:0, y:-8, scale:0.97} animate {opacity:1, y:0, scale:1} exit {opacity:0, y:-8, scale:0.97} transition {duration:0.22, ease:[0.25,0.1,0.25,1]}. NAV_ITEMS map → plain buttons rounded-full px-5 py-2.5 text-left text-sm font-medium cursor-pointer. Style color: active===i? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)'; bg: active===i? 'rgba(255,255,255,0.1)' : 'transparent'. onClick setActive(i)+setMenuOpen(false). Final Get Started button mt-1 rounded-full px-5 py-2.5 text-sm font-semibold text-white, style=ctaStyle, onClick setMenuOpen(false).

Imports: useState from react; motion, AnimatePresence from framer-motion; List, X from @phosphor-icons/react.`,

  GPT: `Build a React client component named \`GlassNavbar\`. Single file. TypeScript strict, no \`any\`. 'use client' at top. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
NAV_ITEMS = ['Products', 'About', 'Blog']
Background URL: https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866

## Glass surface
- glassStyle: { background:'rgba(255, 255, 255, 0.08)', border:'1px solid rgba(255, 255, 255, 0.12)', boxShadow:'0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }
- glassBlur (separate non-animating child div z-[-1]): { backdropFilter:'blur(24px) saturate(1.8)', WebkitBackdropFilter:'blur(24px) saturate(1.8)' }
- ctaStyle: { background:'linear-gradient(135deg, rgba(255, 160, 50, 0.75), rgba(220, 60, 40, 0.6))', border:'1px solid rgba(255, 180, 80, 0.25)', boxShadow:'0 2px 16px rgba(220, 80, 30, 0.4)' }
- ctaHoverStyle: { background:'linear-gradient(135deg, rgba(255, 180, 80, 0.9), rgba(235, 75, 45, 0.8))', boxShadow:'0 4px 24px rgba(220, 80, 30, 0.6)' }

## State
active: number|null (default null), hovered: number|null, menuOpen: boolean. Logo click resets active to null.

## Framer Motion
- Nav motion.nav: initial {y:-40} animate {y:0} transition {type:'spring', stiffness:200, damping:24}.
- Logo spinner: animate {rotate:[0,360]} transition {duration:20, repeat:Infinity, ease:'linear'}. Background: 'linear-gradient(135deg, #FF6BF5, #FFBE0B)'. Size h-6 w-6 rounded-lg.
- Active pill: motion.div layoutId="glass-nav-active" absolute inset-0 rounded-full, transition {type:'spring', stiffness:400, damping:30}. Style bg rgba(255,255,255,0.12) border 1px rgba(255,255,255,0.1).
- CTA: whileHover {scale:1.04, ...ctaHoverStyle} whileTap {scale:0.96} transition {duration:0.25, ease:[0.25,0.1,0.25,1]}.
- Hamburger icon swap: AnimatePresence mode="wait" initial={false}, motion.span with rotate ±90 and opacity, {duration:0.15}.
- Mobile dropdown: initial {opacity:0, y:-8, scale:0.97} animate {opacity:1, y:0, scale:1} exit {opacity:0, y:-8, scale:0.97} transition {duration:0.22, ease:[0.25,0.1,0.25,1]}.

## Hover state
- Nav link text color: (active===i || hovered===i) ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)'. NO hover background — only text color changes. Active item gets a sliding white/12 pill via layoutId.
- CTA brightens + deepens glow on hover.

## JSX structure
Root div: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950. Background <img>. Column wrapper: relative flex w-[calc(100%-2rem)] max-w-[720px] flex-col.

motion.nav (rounded-full px-2 py-2, style=glassStyle, isolate):
  - blur layer child
  - Logo div (flex items-center gap-2 px-3 cursor-pointer, onClick setActive(null)): spinning square + <span className="text-sm font-semibold text-white/90">Studio</span>
  - Spacer <div className="flex-1" />
  - Desktop group (<div className="hidden items-center gap-1 sm:flex">): 3 link buttons + CTA. Link buttons use onHoverStart/onHoverEnd to set hovered. Label wrapped in span relative z-10 so it sits over the pill.
  - Mobile hamburger motion.button (sm:hidden, mr-2, p-2 rounded-full bg rgba(255,255,255,0.08), text-white/70): AnimatePresence icon swap List ↔ X.

Mobile dropdown AnimatePresence: motion.div mt-2 rounded-2xl p-2 flex flex-col gap-1 sm:hidden, style=glassStyle + blur layer. NAV_ITEMS as plain <button> rounded-full px-5 py-2.5 text-sm font-medium text-left; active: bg rgba(255,255,255,0.1) color white/95; inactive: transparent color white/55. Final CTA button mt-1 with ctaStyle.

Icons from @phosphor-icons/react: List, X (weight="bold" for both inside the hamburger swap).`,

  Gemini: `Implement a React client component named \`GlassNavbar\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'

## API guardrails
USE only the hooks listed. DO NOT invent \`useLayoutId\`, \`useActive\`, or helpers not shown. Framer Motion layoutId is a string prop on <motion.div>, not a hook — use layoutId="glass-nav-active" directly. Do not import from 'motion/react' — use 'framer-motion'. Icons must be spelled exactly: List, X with weight="bold" inside the hamburger. No \`any\` types. No props on GlassNavbar.

## Constants
const NAV_ITEMS = ['Products', 'About', 'Blog']
const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866'
const glassStyle = { background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }
const glassBlur  = { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }
const ctaStyle = { background: 'linear-gradient(135deg, rgba(255, 160, 50, 0.75), rgba(220, 60, 40, 0.6))', border: '1px solid rgba(255, 180, 80, 0.25)', boxShadow: '0 2px 16px rgba(220, 80, 30, 0.4)' }
const ctaHoverStyle = { background: 'linear-gradient(135deg, rgba(255, 180, 80, 0.9), rgba(235, 75, 45, 0.8))', boxShadow: '0 4px 24px rgba(220, 80, 30, 0.6)' }

## State
const [active, setActive] = useState<number | null>(null)
const [hovered, setHovered] = useState<number | null>(null)
const [menuOpen, setMenuOpen] = useState(false)

## Layout
Root:
<div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">
  <img src={BACKGROUND} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />
  <div className="relative flex w-[calc(100%-2rem)] max-w-[720px] flex-col">

    {/* Navbar */}
    <motion.nav initial={{ y: -40 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }} className="relative isolate flex w-full items-center gap-1 rounded-full px-2 py-2" style={glassStyle}>
      <div className="pointer-events-none absolute inset-0 z-[-1] rounded-full" style={glassBlur} />
      <div className="flex cursor-pointer items-center gap-2 px-3" onClick={() => setActive(null)}>
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="h-6 w-6 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF6BF5, #FFBE0B)' }} />
        <span className="text-sm font-semibold text-white/90">Studio</span>
      </div>
      <div className="flex-1" />

      {/* Desktop */}
      <div className="hidden items-center gap-1 sm:flex">
        {NAV_ITEMS.map((item, i) => (
          <motion.button key={item} onClick={() => setActive(i)} onHoverStart={() => setHovered(i)} onHoverEnd={() => setHovered(null)} className="relative cursor-pointer rounded-full px-5 py-2 text-sm font-medium" style={{ color: active === i || hovered === i ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)' }} whileTap={{ scale: 0.97 }}>
            {active === i && (
              <motion.div layoutId="glass-nav-active" className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.1)' }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10">{item}</span>
          </motion.button>
        ))}
        <motion.button whileHover={{ scale: 1.04, ...ctaHoverStyle }} whileTap={{ scale: 0.96 }} className="ml-2 cursor-pointer rounded-full px-5 py-2 text-sm font-semibold text-white" style={ctaStyle} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}>Get Started</motion.button>
      </div>

      {/* Hamburger */}
      <motion.button className="mr-2 flex cursor-pointer items-center justify-center rounded-full p-2 text-white/70 sm:hidden" onClick={() => setMenuOpen(v => !v)} whileTap={{ scale: 0.9 }} style={{ background: 'rgba(255,255,255,0.08)' }}>
        <AnimatePresence mode="wait" initial={false}>
          {menuOpen
            ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate:  90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={18} weight="bold" /></motion.span>
            : <motion.span key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><List size={18} weight="bold" /></motion.span>}
        </AnimatePresence>
      </motion.button>
    </motion.nav>

    {/* Mobile dropdown */}
    <AnimatePresence>
      {menuOpen && (
        <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }} className="relative isolate mt-2 flex flex-col gap-1 rounded-2xl p-2 sm:hidden" style={glassStyle}>
          <div className="pointer-events-none absolute inset-0 z-[-1] rounded-2xl" style={glassBlur} />
          {NAV_ITEMS.map((item, i) => (
            <button key={item} onClick={() => { setActive(i); setMenuOpen(false) }} className="cursor-pointer rounded-full px-5 py-2.5 text-left text-sm font-medium" style={{ color: active === i ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)', background: active === i ? 'rgba(255,255,255,0.1)' : 'transparent' }}>{item}</button>
          ))}
          <button onClick={() => setMenuOpen(false)} className="mt-1 cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={ctaStyle}>Get Started</button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</div>

Named export \`GlassNavbar\`. No props. Always dark.`,

  V0: `Create a GlassNavbar component — a responsive frosted-glass pill navigation bar floating over a dreamy orange flower background (opacity 60).

The bar is a pill (rounded-full, max-width 720px, centered) with a real 24px backdrop blur at 1.8 saturation, a semi-transparent white fill (~8%), a fine white border, and a subtle 32px drop shadow with inset top highlight. It slides down from above on mount with a spring.

Left side: a small 24×24 rounded-lg gradient square that slowly spins 360° on a 20-second loop (pink #FF6BF5 → yellow #FFBE0B), next to a "Studio" label in semibold white/90. Clicking the logo deselects any active nav item.

Right side (desktop, sm and up): nav links Products, About, Blog as pill buttons. Inactive text is white/50, hovered or active is white/95. The active item has a semi-transparent white pill sliding beneath it via Framer Motion layoutId "glass-nav-active" with spring physics. No background on hover — only the text color brightens.

After the links, a "Get Started" CTA pill button with a warm 135° orange-to-red gradient (rgba(255,160,50,0.75) → rgba(220,60,40,0.6)), amber border, and a soft glow shadow. On hover it brightens and the glow deepens; it scales 1.04 on hover and 0.96 on tap.

Below the sm breakpoint, hide the links + CTA and show a small hamburger icon button (rounded-full, faint white background). Tapping it toggles a dropdown card directly below the navbar — same glass styling (rounded-2xl), listing the nav items vertically plus a final Get Started button. The hamburger icon swaps between List and X using AnimatePresence with rotate+fade.

The default state has no item selected (active = null). Initial state shows no pill highlight until you click an item.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular' by default; hamburger uses weight='bold'): List, X.`,
}
