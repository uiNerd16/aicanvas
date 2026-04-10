import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassCard\` — three frosted-glass feature cards with 3D mouse-tilt, rotating gradient border, and notification-style tinted icon badges over an orange-flower background.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background (absolute inset-0 object-cover opacity-60 pointer-events-none):
\`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133\`

CARDS (title, subtitle, color, gradient pair, cta, Icon):
1. Analytics — "Real-time metrics and insights for your application." — #5B8FF9 / '#5B8FF9, #A78BFA' — "View Dashboard" — ChartLineUp
2. Automation — "Streamline your workflows with intelligent triggers." — #FF6BF5 / '#FF6BF5, #FF6680' — "Create Workflow" — Lightning
3. Security — "Enterprise-grade protection for your data." — #FF7B54 / '#FF7B54, #FFBE0B' — "View Report" — ShieldCheck

Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950. Inside: background <img>, then a flex-wrap gap-6 px-6 row mapping cards.

Inner GlassCardItem (defined inline in same file):
- cardRef = useRef<HTMLDivElement>(null).
- mouseX, mouseY = useMotionValue(0.5) each.
- rotateX = useSpring(useTransform(mouseY, [0,1], [8,-8]), {stiffness:200, damping:20}).
- rotateY = useSpring(useTransform(mouseX, [0,1], [-8,8]), {stiffness:200, damping:20}).
- handleMouse: rect = cardRef.current!.getBoundingClientRect(); mouseX.set((e.clientX-rect.left)/rect.width); mouseY similar.
- handleLeave: reset both to 0.5.

Outer card motion.div: ref, onMouseMove, onMouseLeave, style {rotateX, rotateY, transformPerspective: 800}, className "relative w-64 cursor-pointer overflow-hidden rounded-3xl p-[1px]".

Inside:
(a) Rotating border motion.div: className "absolute inset-0 rounded-3xl opacity-30", style background \`linear-gradient(135deg, \${gradient}, transparent 60%)\`, animate {rotate:[0,360]}, transition {duration:20, repeat:Infinity, ease:'linear'}.
(b) Card body div className "relative rounded-3xl p-6", style: background 'rgba(255,255,255,0.08)', backdropFilter 'blur(24px) saturate(1.8)', WebkitBackdropFilter same, boxShadow '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)'.
  - Icon badge motion.div: mb-5 flex h-12 w-12 items-center justify-center rounded-xl, style {background: \`\${color}18\`, border: \`1px solid \${color}22\`}, whileHover {scale:1.1, rotate:5}, transition {type:'spring', stiffness:400, damping:15}. Child: <Icon size={22} weight="regular" style={{color}} />.
  - <h3 className="mb-2 text-base font-semibold text-white/90">{title}</h3>
  - <p className="mb-5 text-sm leading-relaxed text-white/40">{subtitle}</p>
  - CTA motion.button: whileHover {scale:1.03}, whileTap {scale:0.97}, className "flex w-full items-center justify-between rounded-2xl px-4 py-3". Style: background \`linear-gradient(135deg, \${color1}40, \${color2}28)\`, border \`1px solid \${color1}55\`, boxShadow \`0 2px 12px \${color1}25\`. onMouseEnter updates boxShadow to \`0 4px 20px \${color1}45\`; onMouseLeave back. Split gradient by ','. Inside: <span style={{color:'rgba(255,255,255,0.75)'}} text-sm font-semibold>{cta}</span> + <ArrowRight size={16} weight="regular" style={{color:'rgba(255,255,255,0.55)'}} />.
  - Top edge highlight div: absolute left-6 right-6 top-0 h-[1px] background "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)".

No entrance animation. Always dark. Icons from @phosphor-icons/react (weight="regular"): ChartLineUp, Lightning, ShieldCheck, ArrowRight. Imports: useRef from react; motion, useMotionValue, useTransform, useSpring from framer-motion.`,

  GPT: `Build a React client component named \`GlassCard\`. Single file. TypeScript strict, no \`any\`. 'use client' at top. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background URL: https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133

CARDS: Array of 3 objects { title, subtitle, color, gradient, cta, Icon }:
1. { title:'Analytics',  subtitle:'Real-time metrics and insights for your application.', color:'#5B8FF9', gradient:'#5B8FF9, #A78BFA', cta:'View Dashboard',  Icon: ChartLineUp }
2. { title:'Automation', subtitle:'Streamline your workflows with intelligent triggers.',  color:'#FF6BF5', gradient:'#FF6BF5, #FF6680', cta:'Create Workflow', Icon: Lightning }
3. { title:'Security',   subtitle:'Enterprise-grade protection for your data.',            color:'#FF7B54', gradient:'#FF7B54, #FFBE0B', cta:'View Report',      Icon: ShieldCheck }

## Glass surface (card body)
- background: rgba(255, 255, 255, 0.08)
- backdrop-filter: blur(24px) saturate(1.8) (+ WebkitBackdropFilter)
- boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
- rounded-3xl p-6
- Top edge highlight: absolute 1px div, left-6 right-6 top-0, linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)

## Framer Motion
Declare ALL motion values at the top of the inner GlassCardItem function (never inside JSX):
- cardRef = useRef<HTMLDivElement>(null)
- mouseX = useMotionValue(0.5); mouseY = useMotionValue(0.5)
- rotateX = useSpring(useTransform(mouseY, [0,1], [8,-8]), { stiffness: 200, damping: 20 })
- rotateY = useSpring(useTransform(mouseX, [0,1], [-8,8]), { stiffness: 200, damping: 20 })
- Rotating border: animate={{rotate:[0,360]}} transition={{duration:20, repeat:Infinity, ease:'linear'}}

## Hover state
- Outer card uses style {rotateX, rotateY, transformPerspective:800} — no wrapper transform.
- handleMouse reads cardRef.current.getBoundingClientRect() and sets mouseX/mouseY to normalized 0–1.
- handleLeave resets both to 0.5.
- Icon badge motion.div: whileHover {scale:1.1, rotate:5}, transition {type:'spring', stiffness:400, damping:15}.
- CTA motion.button: whileHover {scale:1.03}, whileTap {scale:0.97}; onMouseEnter upgrades boxShadow from \`0 2px 12px \${c1}25\` to \`0 4px 20px \${c1}45\`; onMouseLeave restores.

## JSX structure
Root div: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950. Background <img> absolute inset-0 object-cover opacity-60 pointer-events-none. Wrapper div relative flex flex-wrap items-center justify-center gap-6 px-6.

GlassCardItem props { title, subtitle, color, gradient, cta, Icon: import type { Icon } from '@phosphor-icons/react' }:
- Outer motion.div: ref={cardRef} onMouseMove={handleMouse} onMouseLeave={handleLeave} style={{rotateX, rotateY, transformPerspective:800}} className="relative w-64 cursor-pointer overflow-hidden rounded-3xl p-[1px]"
- Rotating border motion.div: "absolute inset-0 rounded-3xl opacity-30", style={{background: \`linear-gradient(135deg, \${gradient}, transparent 60%)\`}}, animate rotate loop
- Body div (glass): "relative rounded-3xl p-6" with styles above
  - Icon badge: "mb-5 flex h-12 w-12 items-center justify-center rounded-xl", style {background: \`\${color}18\`, border: \`1px solid \${color}22\`}; <Icon size={22} weight="regular" style={{color}} />
  - <h3 className="mb-2 text-base font-semibold text-white/90">{title}</h3>
  - <p className="mb-5 text-sm leading-relaxed text-white/40">{subtitle}</p>
  - CTA motion.button "flex w-full items-center justify-between rounded-2xl px-4 py-3", style background \`linear-gradient(135deg, \${c1}40, \${c2}28)\`, border \`1px solid \${c1}55\`, boxShadow \`0 2px 12px \${c1}25\`, transition 'box-shadow 0.2s ease'. Child: <span> in 'rgba(255,255,255,0.75)' and <ArrowRight size={16} weight="regular" style={{color:'rgba(255,255,255,0.55)'}} />.
  - Top highlight div.

No entrance animations. Always dark. Icons from @phosphor-icons/react (weight="regular"): ChartLineUp, Lightning, ShieldCheck, ArrowRight.`,

  Gemini: `Implement a React client component named \`GlassCard\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ChartLineUp, Lightning, ShieldCheck, ArrowRight } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

## API guardrails
USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, \`useParallax\`, or helpers not shown. Do NOT call \`useMotionValue()\`, \`useTransform()\`, or \`useSpring()\` inline inside JSX — call them at the top of the inner component function only. Phosphor icons must be written exactly: ChartLineUp, Lightning, ShieldCheck, ArrowRight with \`weight="regular"\`.

## Constants
const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'
const CARDS: { title: string; subtitle: string; color: string; gradient: string; cta: string; Icon: Icon }[] = [
  { title: 'Analytics',  subtitle: 'Real-time metrics and insights for your application.', color: '#5B8FF9', gradient: '#5B8FF9, #A78BFA', cta: 'View Dashboard',  Icon: ChartLineUp },
  { title: 'Automation', subtitle: 'Streamline your workflows with intelligent triggers.',  color: '#FF6BF5', gradient: '#FF6BF5, #FF6680', cta: 'Create Workflow', Icon: Lightning },
  { title: 'Security',   subtitle: 'Enterprise-grade protection for your data.',            color: '#FF7B54', gradient: '#FF7B54, #FFBE0B', cta: 'View Report',      Icon: ShieldCheck },
]

## Inner GlassCardItem component
Props: { title: string; subtitle: string; color: string; gradient: string; cta: string; Icon: Icon }.
Declare (at top of function):
- const cardRef = useRef<HTMLDivElement>(null)
- const mouseX = useMotionValue(0.5)
- const mouseY = useMotionValue(0.5)
- const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 20 })
- const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 })

Handlers:
- handleMouse(e: React.MouseEvent): el = cardRef.current; if(!el) return; rect = el.getBoundingClientRect(); mouseX.set((e.clientX-rect.left)/rect.width); mouseY.set((e.clientY-rect.top)/rect.height)
- handleLeave(): mouseX.set(0.5); mouseY.set(0.5)

## JSX
Outer card:
<motion.div ref={cardRef} onMouseMove={handleMouse} onMouseLeave={handleLeave} style={{ rotateX, rotateY, transformPerspective: 800 }} className="relative w-64 cursor-pointer overflow-hidden rounded-3xl p-[1px]">

Rotating border:
<motion.div className="absolute inset-0 rounded-3xl opacity-30" style={{ background: \`linear-gradient(135deg, \${gradient}, transparent 60%)\` }} animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />

Body:
<div className="relative rounded-3xl p-6" style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(24px) saturate(1.8)', WebkitBackdropFilter:'blur(24px) saturate(1.8)', boxShadow:'0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)' }}>
  Icon badge <motion.div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: \`\${color}18\`, border: \`1px solid \${color}22\` }} whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}><Icon size={22} weight="regular" style={{ color }} /></motion.div>
  <h3 className="mb-2 text-base font-semibold text-white/90">{title}</h3>
  <p className="mb-5 text-sm leading-relaxed text-white/40">{subtitle}</p>
  CTA <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex w-full items-center justify-between rounded-2xl px-4 py-3" style={{ background: \`linear-gradient(135deg, \${c1}40, \${c2}28)\`, border: \`1px solid \${c1}55\`, boxShadow: \`0 2px 12px \${c1}25\`, transition:'box-shadow 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.boxShadow = \`0 4px 20px \${c1}45\`} onMouseLeave={e => e.currentTarget.style.boxShadow = \`0 2px 12px \${c1}25\`}>
    <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>{cta}</span>
    <ArrowRight size={16} weight="regular" style={{ color: 'rgba(255,255,255,0.55)' }} />
  </motion.button>
  Top highlight: <div className="absolute left-6 right-6 top-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
</div>

Where c1 = gradient.split(',')[0] and c2 = gradient.split(',')[1]?.trim() ?? c1.

## Root
<div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">
  <img src={BACKGROUND} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />
  <div className="relative flex flex-wrap items-center justify-center gap-6 px-6">
    {CARDS.map(card => <GlassCardItem key={card.title} {...card} />)}
  </div>
</div>

No entrance animations. No dark: variants — always dark-themed. No \`any\` types.`,

  V0: `Create a GlassCard component — three floating frosted-glass feature cards side by side over a soft orange-flower background photo (opacity 60).

Each card is a rounded-3xl, 256px-wide glass panel with a real backdrop blur (24px, 1.8 saturation), a semi-transparent white fill (~8%), a deep drop shadow with inset top highlight, and a very thin 1px gradient highlight line along the top edge. Around each card runs a slowly rotating gradient border (the card's gradient pair at 30% opacity, spinning 360° over 20 seconds on loop).

Cards:
1. Analytics — accent #5B8FF9, gradient #5B8FF9 → #A78BFA, ChartLineUp icon, subtitle "Real-time metrics and insights for your application.", CTA "View Dashboard".
2. Automation — accent #FF6BF5, gradient #FF6BF5 → #FF6680, Lightning icon, subtitle "Streamline your workflows with intelligent triggers.", CTA "Create Workflow".
3. Security — accent #FF7B54, gradient #FF7B54 → #FFBE0B, ShieldCheck icon, subtitle "Enterprise-grade protection for your data.", CTA "View Report".

Each card shows a notification-style icon badge at the top: a 48×48 rounded-xl box with the accent color at ~9% opacity for the background and ~13% for the border, and the icon itself rendered in the full accent color (not white). On hover the badge scales to 1.1 and rotates 5° with a springy feel. Below the badge, a bold title in white/90, a muted subtitle in white/40, then a CTA button with a 135° gradient tint (first color at 40% → second color at 28%), matching colored border and glow shadow, and a right-arrow. The CTA text and arrow icon are white at 75% and 55% opacity respectively. The CTA glow intensifies and deepens on hover.

On mouse hover, the card tilts in 3D — up to ±8° on X and Y following cursor position, with spring physics.

No entrance animations — cards appear instantly. Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'): ChartLineUp, Lightning, ShieldCheck, ArrowRight.`,
}
