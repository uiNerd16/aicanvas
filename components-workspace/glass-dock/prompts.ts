import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassDock\` — a macOS-style frosted glass dock with distance-based magnification, notification-style tinted icon badges, and frosted tooltips.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background image (absolute inset-0 object-cover opacity-60 pointer-events-none):
\`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866\`

Constants:
- ICON_SIZE = 44
- MAG_RANGE = 120
- MAG_SCALE = 1.55

DOCK_ITEMS (icon, label, color):
Sun #FFBE0B "Energy" · Heart #FF5C8A "Love" · MusicNote #FF7B54 "Joy" · Coffee #C9A96E "Comfort" · Leaf #06D6A0 "Nature" · Star #FFBE0B "Dreams" · Moon #B388FF "Rest" · Flame #FF5C8A "Passion" · Cloud #3A86FF "Peace".

Root: div relative flex h-full w-full items-center justify-end overflow-hidden bg-sand-950 pb-8. Background <img>.

GlassDock: const mouseX = useMotionValue(-200). Dock motion.div:
- initial {y:50}, animate {y:0}, transition {type:'spring', stiffness:180, damping:20}
- onMouseMove: mouseX.set(e.clientX); onMouseLeave: mouseX.set(-200)
- className "relative isolate mx-auto flex items-end gap-2 rounded-3xl px-4 pb-3 pt-3"
- style: background 'rgba(255,255,255,0.06)', border '1px solid rgba(255,255,255,0.1)', boxShadow '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
- Separate blur layer: pointer-events-none absolute inset-0 z-[-1] rounded-3xl, style { backdropFilter:'blur(24px) saturate(1.8)', WebkitBackdropFilter same } — non-animating layer so magnification frames don't re-blur.
- Map DOCK_ITEMS to DockItem.

DockItem props: { icon: Icon, color, label, mouseX, index }.
- ref = useRef<HTMLDivElement>(null)
- distance = useTransform(mouseX, mx => { el=ref.current; if(!el||mx<0) return 200; const rect=el.getBoundingClientRect(); const center=rect.left+rect.width/2; return Math.abs(mx-center) })
- rawSize = useTransform(distance, [0, MAG_RANGE], [ICON_SIZE*MAG_SCALE, ICON_SIZE])
- size = useSpring(rawSize, { stiffness:300, damping:22, mass:0.5 })
- y = useTransform(size, [ICON_SIZE, ICON_SIZE*MAG_SCALE], [0, -12])

Outer motion.div: className "group relative flex cursor-pointer flex-col items-center", entrance initial {opacity:0, y:20} animate {opacity:1, y:0}, transition {type:'spring', stiffness:200, damping:18, delay: index*0.04}.

Tooltip motion.div: className "pointer-events-none absolute -top-10 rounded-lg px-3 py-1.5 text-xs font-medium text-white/90 opacity-0 group-hover:opacity-100", style background 'rgba(255,255,255,0.1)', backdropFilter 'blur(16px)', border '1px solid rgba(255,255,255,0.1)', transition 'opacity 0.15s'.

Icon badge motion.div (notification-style tinted — NOT gradient, NOT gloss, NOT squircle): style {width:size, height:size, y, background: \`\${color}18\`, border: \`1px solid \${color}22\`, borderRadius:12}, whileTap {scale:0.82}, className "flex items-center justify-center". Inside: <Icon size={22} weight="regular" style={{color}} />.

Imports: useRef from react; motion, useMotionValue, useSpring, useTransform from framer-motion; Sun, Heart, MusicNote, Coffee, Leaf, Star, Moon, Flame, Cloud from @phosphor-icons/react (all weight="regular").`,

  GPT: `Build a React client component named \`GlassDock\`. Single file. TypeScript strict, no \`any\`. 'use client' at top. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background URL: https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866
Constants: ICON_SIZE = 44, MAG_RANGE = 120, MAG_SCALE = 1.55.

DOCK_ITEMS (9 entries, in order): Sun/#FFBE0B/"Energy", Heart/#FF5C8A/"Love", MusicNote/#FF7B54/"Joy", Coffee/#C9A96E/"Comfort", Leaf/#06D6A0/"Nature", Star/#FFBE0B/"Dreams", Moon/#B388FF/"Rest", Flame/#FF5C8A/"Passion", Cloud/#3A86FF/"Peace".

## Glass surface (dock pill)
- background: rgba(255, 255, 255, 0.06)
- border: 1px solid rgba(255, 255, 255, 0.1)
- boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
- className: "relative isolate mx-auto flex items-end gap-2 rounded-3xl px-4 pb-3 pt-3"
- Blur layer separate (non-animating): absolute inset-0 z-[-1] rounded-3xl, backdrop-filter blur(24px) saturate(1.8).

## Framer Motion (DockItem)
- ref = useRef<HTMLDivElement>(null)
- distance = useTransform(mouseX, (mx: number) => { const el = ref.current; if (!el || mx < 0) return 200; const rect = el.getBoundingClientRect(); const center = rect.left + rect.width/2; return Math.abs(mx - center); })
- rawSize = useTransform(distance, [0, MAG_RANGE], [ICON_SIZE * MAG_SCALE, ICON_SIZE])
- size = useSpring(rawSize, { stiffness: 300, damping: 22, mass: 0.5 })
- y = useTransform(size, [ICON_SIZE, ICON_SIZE * MAG_SCALE], [0, -12])
- Outer motion.div: entrance initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{type:'spring', stiffness:200, damping:18, delay:index*0.04}}
- Dock motion.div: initial={{y:50}} animate={{y:0}} transition={{type:'spring', stiffness:180, damping:20}}

## Hover state
- Dock onMouseMove: mouseX.set(e.clientX). onMouseLeave: mouseX.set(-200). Parent's mouseX = useMotionValue(-200).
- Icon badge whileTap={{scale:0.82}}.
- Tooltip: .group .opacity-0 group-hover:opacity-100, transition 'opacity 0.15s'.

## JSX structure
Root div: relative flex h-full w-full items-center justify-end overflow-hidden bg-sand-950 pb-8. Background img absolute inset-0 object-cover opacity-60 pointer-events-none. Dock motion.div (centered via mx-auto, items-end to allow icons to lift upward). 9 DockItems mapped with {...item, mouseX, index}.

DockItem tree:
- <motion.div className="group relative flex cursor-pointer flex-col items-center" ref={ref} ...entrance>
  - Tooltip motion.div (-top-10, pointer-events-none, text-xs font-medium text-white/90, opacity-0 group-hover:opacity-100, bg rgba(255,255,255,0.1), backdropFilter blur(16px), border rgba(255,255,255,0.1)): {label}
  - Icon badge motion.div (notification-style tinted — NOT a gradient, NOT gloss, NOT squircle clip-path): style={{ width:size, height:size, y, background:\`\${color}18\`, border:\`1px solid \${color}22\`, borderRadius:12 }} whileTap={{scale:0.82}} className="flex items-center justify-center"
    - <Icon size={22} weight="regular" style={{ color }} />

Imports (framer-motion): motion, useMotionValue, useSpring, useTransform. Icons from @phosphor-icons/react (all weight="regular"): Sun, Heart, MusicNote, Coffee, Leaf, Star, Moon, Flame, Cloud.`,

  Gemini: `Implement a React client component named \`GlassDock\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Sun, Heart, MusicNote, Coffee, Leaf, Star, Moon, Flame, Cloud } from '@phosphor-icons/react'

## API guardrails
USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useMagnify\`, or helpers not shown. Do NOT call \`useMotionValue()\`, \`useTransform()\`, or \`useSpring()\` inline inside JSX — call them at the top of the component function (parent's mouseX) and at the top of the inner DockItem function. Phosphor icons must be spelled exactly as imported; use \`weight="regular"\`. \`MusicNote\` is one word, no space/hyphen. Do not use \`useAnimate\` or imperative animate() calls.

## Constants (module scope)
const DOCK_ITEMS = [
  { icon: Sun,       color: '#FFBE0B', label: 'Energy' },
  { icon: Heart,     color: '#FF5C8A', label: 'Love' },
  { icon: MusicNote, color: '#FF7B54', label: 'Joy' },
  { icon: Coffee,    color: '#C9A96E', label: 'Comfort' },
  { icon: Leaf,      color: '#06D6A0', label: 'Nature' },
  { icon: Star,      color: '#FFBE0B', label: 'Dreams' },
  { icon: Moon,      color: '#B388FF', label: 'Rest' },
  { icon: Flame,     color: '#FF5C8A', label: 'Passion' },
  { icon: Cloud,     color: '#3A86FF', label: 'Peace' },
]
const ICON_SIZE = 44
const MAG_RANGE = 120
const MAG_SCALE = 1.55
const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866'

## DockItem (inner component)
Props: { icon: typeof Sun, color: string, label: string, mouseX: ReturnType<typeof useMotionValue<number>>, index: number }.
Top of function:
- const ref = useRef<HTMLDivElement>(null)
- const distance = useTransform(mouseX, (mx: number) => { const el = ref.current; if (!el || mx < 0) return 200; const rect = el.getBoundingClientRect(); const center = rect.left + rect.width / 2; return Math.abs(mx - center) })
- const rawSize = useTransform(distance, [0, MAG_RANGE], [ICON_SIZE * MAG_SCALE, ICON_SIZE])
- const size = useSpring(rawSize, { stiffness: 300, damping: 22, mass: 0.5 })
- const y = useTransform(size, [ICON_SIZE, ICON_SIZE * MAG_SCALE], [0, -12])

Return:
<motion.div ref={ref} className="group relative flex cursor-pointer flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 18, delay: index * 0.04 }}>
  Tooltip:
  <motion.div className="pointer-events-none absolute -top-10 rounded-lg px-3 py-1.5 text-xs font-medium text-white/90 opacity-0 group-hover:opacity-100" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'opacity 0.15s' }}>{label}</motion.div>
  Icon badge (notification-style tinted):
  <motion.div style={{ width: size, height: size, y, background: \`\${color}18\`, border: \`1px solid \${color}22\`, borderRadius: 12 }} whileTap={{ scale: 0.82 }} className="flex items-center justify-center">
    <Icon size={22} weight="regular" style={{ color }} />
  </motion.div>
</motion.div>

## GlassDock (export)
const mouseX = useMotionValue(-200).
Root:
<div className="relative flex h-full w-full items-center justify-end overflow-hidden bg-sand-950 pb-8">
  <img src={BACKGROUND} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />
  <motion.div initial={{ y: 50 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }} onMouseMove={(e) => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(-200)} className="relative isolate mx-auto flex items-end gap-2 rounded-3xl px-4 pb-3 pt-3" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)' }}>
    <div className="pointer-events-none absolute inset-0 z-[-1] rounded-3xl" style={{ backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }} />
    {DOCK_ITEMS.map((item, i) => <DockItem key={item.label} {...item} mouseX={mouseX} index={i} />)}
  </motion.div>
</div>

No \`any\`. No props on GlassDock. Always dark.`,

  V0: `Create a GlassDock component — a macOS-style frosted-glass dock floating at the bottom of a dark scene with an ethereal orange flower background image (opacity 60).

The dock is a pill-shaped glass container (rounded-3xl, soft white tint at ~6%, 1px white/10 border, deep 40px ambient shadow with an inset top highlight, real 24px backdrop blur with 1.8 saturation applied on a separate non-animating layer so magnification stays smooth).

Inside are 9 emotion-themed icons, each rendered as a notification-style tinted badge: a rounded-xl box (borderRadius 12) with the icon's accent color at very low opacity for the background (~9%), a matching faint border (~13%), and the Phosphor icon in the full accent color. No gradients, no gloss overlays, no squircles, no drop shadows — clean tinted chips.

Items in order: Sun (Energy, amber #FFBE0B), Heart (Love, pink #FF5C8A), MusicNote (Joy, orange #FF7B54), Coffee (Comfort, tan #C9A96E), Leaf (Nature, teal #06D6A0), Star (Dreams, amber #FFBE0B), Moon (Rest, violet #B388FF), Flame (Passion, pink #FF5C8A), Cloud (Peace, blue #3A86FF).

On hover, icons magnify with distance-based scaling — the nearest icon grows up to 1.55× its base size (44px) and lifts upward ~12px, neighbors scale proportionally, all with a springy feel. Magnification falls off over ~120px from the cursor. When hovered, a frosted-glass tooltip label appears above each icon (-top-10, small rounded-lg pill with blur-16, white/10 background).

The entire dock slides in from below with a spring on mount, and each icon staggers in (delay = index × 40ms). Tap shrinks icons slightly (0.82).

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular').`,
}
