import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassModal\` — a frosted-glass upgrade modal centered on a dark scene, with staggered entrance, warm amber accents, and an animated close button.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background image (absolute inset-0 object-cover opacity-60 pointer-events-none):
\`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866\`

Root: div relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950.

Modal card (motion.div):
- initial {scale:0.9, y:16}, animate {scale:1, y:0}, transition {type:'spring', stiffness:350, damping:28}
- className "relative isolate w-[340px] overflow-hidden rounded-3xl"
- style: background 'rgba(255,255,255,0.08)', border '1px solid rgba(255,255,255,0.12)', boxShadow '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)'
- Separate blur layer (non-animating): pointer-events-none absolute inset-0 z-[-1] rounded-3xl, backdropFilter 'blur(40px) saturate(1.8)' + WebkitBackdropFilter.
- Top highlight: absolute left-8 right-8 top-0 h-[1px], background 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)'.

Close button (motion.button): absolute right-4 top-4 z-10 h-8 w-8 rounded-full, bg 'rgba(255,255,255,0.08)', border '1px solid rgba(255,255,255,0.08)'.
- whileHover { scale:1.15, rotate:90 }
- whileTap {scale:0.9}, transition {duration:0.2, ease:[0.25,0.1,0.25,1]}
- X icon size={14} weight="regular" className="text-white/60"

Content container: flex flex-col items-center px-8 pb-8 pt-10.

1) Icon badge (motion.div) — notification-style tinted: className "mb-5 flex h-16 w-16 items-center justify-center rounded-xl", style background '#FFA03218' border '1px solid #FFA03222'. Entrance: initial {scale:0, rotate:-20}, animate {scale:1, rotate:0}, transition {type:'spring', stiffness:300, damping:18, delay:0.15}. Child: <ShieldCheck size={28} weight="regular" style={{color:'#FFA032'}} />.

2) Heading motion.h2: "Upgrade to Pro", className "mb-2 text-lg font-semibold text-white/90", initial {opacity:0, y:8} animate {opacity:1, y:0} transition {delay:0.2}.

3) Description motion.p: "Unlock premium components, priority support, and early access to new features." className "mb-6 text-center text-sm leading-relaxed text-white/40", initial {opacity:0, y:8}, transition {delay:0.25}.

4) Features motion.div wrapper initial {opacity:0} animate {opacity:1} transition {delay:0.3} className "mb-6 flex w-full flex-col gap-3". Items ['Unlimited components', 'Source code access', 'Priority support']. Each motion.div: initial {opacity:0, x:-12}, animate {opacity:1, x:0}, transition {delay:0.35 + i*0.08}, className "flex items-center gap-3". Badge: h-5 w-5 rounded-full flex centered, bg 'rgba(255,155,50,0.18)'. Check icon size={10} weight="regular" color 'rgba(255,155,50,1)'. Label: span text-sm text-white/60.

5) Buttons flex flex-col gap-2 w-full.
Primary motion.button ("Upgrade Now") className "w-full cursor-pointer rounded-full py-3 text-sm font-semibold text-white":
- style: background 'linear-gradient(135deg, rgba(255,160,50,0.75), rgba(220,60,40,0.6))', border '1px solid rgba(255,180,80,0.25)', boxShadow '0 2px 16px rgba(220,80,30,0.4)'
- whileHover {scale:1.04, background:'linear-gradient(135deg, rgba(255,180,80,0.9), rgba(235,75,45,0.8))', boxShadow:'0 4px 24px rgba(220,80,30,0.6)'}
- whileTap {scale:0.96}, transition {duration:0.25, ease:[0.25,0.1,0.25,1]}
Ghost motion.button ("Maybe Later") className "w-full cursor-pointer rounded-full py-3 text-sm font-medium text-white/50":
- style: bg 'rgba(255,255,255,0.06)', border '1px solid rgba(255,255,255,0.1)'
- whileHover {scale:1.04, background:'rgba(255,255,255,0.1)'}, whileTap {scale:0.96}, same ease.

Imports: motion from framer-motion; X, Check, ShieldCheck from @phosphor-icons/react (weight="regular").`,

  GPT: `Build a React client component named \`GlassModal\`. Single file. TypeScript strict, no \`any\`. 'use client' at top. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background URL: https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866
Headline: "Upgrade to Pro"
Description: "Unlock premium components, priority support, and early access to new features."
Features: ['Unlimited components', 'Source code access', 'Priority support']
Primary button: "Upgrade Now"
Ghost button: "Maybe Later"

## Glass surface
- width: 340px, rounded-3xl, overflow-hidden, isolate
- background: rgba(255, 255, 255, 0.08)
- border: 1px solid rgba(255, 255, 255, 0.12)
- boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)'
- backdrop-filter on separate child: blur(40px) saturate(1.8) (+ WebkitBackdropFilter). absolute inset-0 z-[-1] rounded-3xl, pointer-events-none.
- Top highlight: absolute left-8 right-8 top-0 h-[1px] linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent).

## Framer Motion
- Modal entrance: initial {scale:0.9, y:16}, animate {scale:1, y:0}, transition {type:'spring', stiffness:350, damping:28}.
- Close button: whileHover {scale:1.15, rotate:90}, whileTap {scale:0.9}, transition {duration:0.2, ease:[0.25,0.1,0.25,1]}.
- Icon badge: initial {scale:0, rotate:-20}, animate {scale:1, rotate:0}, {type:'spring', stiffness:300, damping:18, delay:0.15}.
- Heading: initial {opacity:0, y:8} animate {opacity:1, y:0} transition {delay:0.2}.
- Description: same but delay:0.25.
- Features wrapper: initial {opacity:0} animate {opacity:1} transition {delay:0.3}.
- Each feature item: initial {opacity:0, x:-12} animate {opacity:1, x:0} transition {delay:0.35 + i*0.08}.
- Primary button: whileHover {scale:1.04, background:'linear-gradient(135deg, rgba(255,180,80,0.9), rgba(235,75,45,0.8))', boxShadow:'0 4px 24px rgba(220,80,30,0.6)'}, whileTap {scale:0.96}, transition {duration:0.25, ease:[0.25,0.1,0.25,1]}.
- Ghost button: whileHover {scale:1.04, background:'rgba(255,255,255,0.1)'}, whileTap {scale:0.96}, same ease.

## Hover state
Close button scales up and rotates 90° on hover (no color change). Primary button brightens and deepens its drop shadow. Ghost button lifts to white/10 background.

## JSX structure
Root div: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950. Background <img>.

Modal motion.div (w-[340px] rounded-3xl isolate overflow-hidden) → blur layer → top highlight → close button (absolute right-4 top-4 z-10 h-8 w-8 rounded-full, bg rgba(255,255,255,0.08), border rgba(255,255,255,0.08); <X size={14} weight="regular" className="text-white/60" />) → content column (flex flex-col items-center px-8 pb-8 pt-10):
1. Icon badge (notification-style, NOT gradient): "mb-5 flex h-16 w-16 items-center justify-center rounded-xl", style background '#FFA03218' border '1px solid #FFA03222'. <ShieldCheck size={28} weight="regular" style={{color:'#FFA032'}} />
2. <motion.h2 className="mb-2 text-lg font-semibold text-white/90">
3. <motion.p className="mb-6 text-center text-sm leading-relaxed text-white/40">
4. Features motion.div "mb-6 flex w-full flex-col gap-3" → each item row: 5x5 rounded-full flex centered bg rgba(255,155,50,0.18), <Check size={10} weight="regular" style={{color:'rgba(255,155,50,1)'}}/>; label text-sm text-white/60
5. Buttons column (flex flex-col gap-2 w-full):
   - Primary motion.button "w-full cursor-pointer rounded-full py-3 text-sm font-semibold text-white", style background 'linear-gradient(135deg, rgba(255,160,50,0.75), rgba(220,60,40,0.6))', border '1px solid rgba(255,180,80,0.25)', boxShadow '0 2px 16px rgba(220,80,30,0.4)'
   - Ghost motion.button "w-full cursor-pointer rounded-full py-3 text-sm font-medium text-white/50", style background 'rgba(255,255,255,0.06)', border '1px solid rgba(255,255,255,0.1)'

Icons from @phosphor-icons/react (weight="regular"): X, Check, ShieldCheck.`,

  Gemini: `Implement a React client component named \`GlassModal\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { motion } from 'framer-motion'
import { X, Check, ShieldCheck } from '@phosphor-icons/react'

## API guardrails
USE only \`motion\` from framer-motion. DO NOT import or invent \`useAnimate\`, \`useSpring\`, \`Dialog\`, etc. Icons must be spelled exactly: X, Check, ShieldCheck with weight="regular". No \`any\` types. No props on GlassModal. Always dark; do not add light-mode variants.

## Copy
Heading: "Upgrade to Pro"
Description: "Unlock premium components, priority support, and early access to new features."
Features: ['Unlimited components', 'Source code access', 'Priority support']
Buttons: "Upgrade Now" (primary), "Maybe Later" (ghost)
Background URL: https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866

## Root
<div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">
  <img src={BACKGROUND} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />
  <motion.div initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 350, damping: 28 }} className="relative isolate w-[340px] overflow-hidden rounded-3xl" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
    <div className="pointer-events-none absolute inset-0 z-[-1] rounded-3xl" style={{ backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)' }} />
    <div className="absolute left-8 right-8 top-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />

    {/* Close button */}
    <motion.button whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }} className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <X size={14} weight="regular" className="text-white/60" />
    </motion.button>

    <div className="flex flex-col items-center px-8 pb-8 pt-10">
      {/* Icon badge — notification-style tinted */}
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }} className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl" style={{ background: '#FFA03218', border: '1px solid #FFA03222' }}>
        <ShieldCheck size={28} weight="regular" style={{ color: '#FFA032' }} />
      </motion.div>

      <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-2 text-lg font-semibold text-white/90">Upgrade to Pro</motion.h2>

      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6 text-center text-sm leading-relaxed text-white/40">Unlock premium components, priority support, and early access to new features.</motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 flex w-full flex-col gap-3">
        {['Unlimited components','Source code access','Priority support'].map((feature, i) => (
          <motion.div key={feature} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.08 }} className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: 'rgba(255, 155, 50, 0.18)' }}>
              <Check size={10} weight="regular" style={{ color: 'rgba(255, 155, 50, 1)' }} />
            </div>
            <span className="text-sm text-white/60">{feature}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex w-full flex-col gap-2">
        <motion.button whileHover={{ scale: 1.04, background: 'linear-gradient(135deg, rgba(255, 180, 80, 0.9), rgba(235, 75, 45, 0.8))', boxShadow: '0 4px 24px rgba(220, 80, 30, 0.6)' }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }} className="w-full cursor-pointer rounded-full py-3 text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, rgba(255, 160, 50, 0.75), rgba(220, 60, 40, 0.6))', border: '1px solid rgba(255, 180, 80, 0.25)', boxShadow: '0 2px 16px rgba(220, 80, 30, 0.4)' }}>Upgrade Now</motion.button>
        <motion.button whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }} className="w-full cursor-pointer rounded-full py-3 text-sm font-medium text-white/50" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>Maybe Later</motion.button>
      </div>
    </div>
  </motion.div>
</div>

Named export: \`GlassModal\`. No props.`,

  V0: `Create a GlassModal component — a centered frosted-glass upgrade modal floating over a dark scene with an ethereal orange flower background image (opacity 60).

The modal is a 340px-wide rounded-3xl glass card with a real 40px backdrop blur (saturation 1.8), a semi-transparent white fill (~8%), a thin 1px white border, and a deep 24px drop shadow plus subtle inset top highlight. A fine gradient highlight line runs across the top edge. It enters with a spring pop (scale 0.9 → 1, y 16 → 0).

Top-right corner: a small circular close button (X icon) with a neutral glass fill. On hover it rotates 90° and scales up slightly (no color change).

Center column (top to bottom):
- A notification-style icon badge: 64×64 rounded-xl box with background color #FFA032 at low opacity (roughly 9%) and a matching faint border (roughly 13%), containing a ShieldCheck icon in solid #FFA032. It enters with a spring pop from scale 0 and a slight rotation.
- Bold heading "Upgrade to Pro" in white/90.
- Muted description paragraph in white/40: "Unlock premium components, priority support, and early access to new features."
- Three feature bullets, each a small round amber check badge + label: "Unlimited components", "Source code access", "Priority support". The checkmarks use the same warm amber tint.
- A primary "Upgrade Now" pill button with a 135° warm orange → red gradient (roughly rgba(255,160,50,0.75) to rgba(220,60,40,0.6)), matching amber border, and a soft glowing drop shadow. On hover it brightens and the glow deepens; taps it down slightly.
- A subtle "Maybe Later" ghost pill button in white/50 with a near-transparent glass fill.

Text and features fade/slide in with staggered delays (heading 0.2s, description 0.25s, feature row starts at 0.35s with 0.08s stagger). Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'): ShieldCheck, X, Check.`,
}
