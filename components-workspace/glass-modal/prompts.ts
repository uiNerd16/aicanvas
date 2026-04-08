import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/glass-modal/index.tsx\`. Export a named function \`GlassModal\` ('use client').

Icons: ShieldCheck, X, Check from @phosphor-icons/react, all weight="regular".

ROOT: div, h-full w-full, centered, bg-sand-950, overflow-hidden.
Background image: absolute inset-0, object-cover, opacity-60.

MODAL CARD (motion.div):
- Width: w-[340px], rounded-3xl, overflow-hidden, isolate
- Entrance: initial={{ scale: 0.9, y: 16 }}, animate={{ scale: 1, y: 0 }}, spring stiffness 350 damping 28
- Inline styles:
  background: rgba(255,255,255,0.08)
  border: 1px solid rgba(255,255,255,0.12)
  boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)'
- Blur layer: separate div, pointer-events-none absolute inset-0 z-[-1] rounded-3xl
  backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter same
- Top highlight: div absolute left-8 right-8 top-0 h-[1px]
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)'

CLOSE BUTTON (motion.button): absolute right-4 top-4 z-10, h-8 w-8 rounded-full
  bg: rgba(255,255,255,0.08), border: 1px solid rgba(255,255,255,0.08)
  X icon: size={14}, className="text-white/60"
  whileHover: { scale: 1.15, rotate: 90, background: 'rgba(255,155,50,0.2)', boxShadow: '0 0 14px rgba(255,140,40,0.45)', border: '1px solid rgba(255,180,80,0.3)' }
  whileTap: { scale: 0.9 }
  transition: duration 0.2, ease [0.25, 0.1, 0.25, 1]

MAIN ICON (motion.div) — notification-style tinted badge:
  h-16 w-16 (64x64), rounded-xl, flex centered, mb-5
  background: '#FFA03218'
  border: '1px solid #FFA03222'
  ShieldCheck: size={28}, style={{ color: '#FFA032' }}
  Entrance: initial={{ scale: 0, rotate: -20 }}, animate={{ scale: 1, rotate: 0 }}
  Spring: stiffness 300, damping 18, delay 0.15

HEADING (motion.h2): "Upgrade to Pro", text-lg font-semibold text-white/90, mb-2
  initial={{ opacity: 0, y: 8 }}, delay 0.2

DESCRIPTION (motion.p): text-sm text-white/40 text-center leading-relaxed, mb-6
  initial={{ opacity: 0, y: 8 }}, delay 0.25
  Text: "Unlock premium components, priority support, and early access to new features."

FEATURES (motion.div wrapper, delay 0.3):
  Three items: 'Unlimited components', 'Source code access', 'Priority support'
  Each (motion.div): initial={{ opacity: 0, x: -12 }}, delay 0.35 + i * 0.08
  Badge: div h-5 w-5 rounded-full, bg rgba(255,155,50,0.18), Check icon size={10} color rgba(255,155,50,1)
  Label: text-sm text-white/60

CTA BUTTON (motion.button): rounded-full py-3 w-full, text-sm font-semibold text-white
  background: 'linear-gradient(135deg, rgba(255,160,50,0.75), rgba(220,60,40,0.6))'
  border: '1px solid rgba(255,180,80,0.25)'
  boxShadow: '0 2px 16px rgba(220,80,30,0.4)'
  whileHover: { scale: 1.04, brighter gradient, boxShadow: '0 4px 24px rgba(220,80,30,0.6)' }
  whileTap: { scale: 0.96 }, transition duration 0.25

GHOST BUTTON (motion.button): rounded-full py-3 w-full, text-sm font-medium text-white/50
  background: rgba(255,255,255,0.06), border: 1px solid rgba(255,255,255,0.1)
  whileHover: { scale: 1.04, background: rgba(255,255,255,0.1) }
  whileTap: { scale: 0.96 }`,

  V0: `Create a frosted glass modal card called "Glass Modal" centered over a blurred background image on a dark scene (bg-sand-950).

The modal is a 340px-wide rounded-3xl card with a glass effect: semi-transparent white background (rgba 255,255,255,0.08), a subtle white border (rgba 255,255,255,0.12), heavy box-shadow, and a 40px backdrop blur with 1.8 saturation. A faint top-edge highlight line runs across the top.

Content from top to bottom:
1. A close button (X icon) in the top-right corner — small circle with semi-transparent bg. On hover it rotates 90 degrees, scales up, and glows warm orange.
2. A notification-style icon badge — 64x64 rounded-xl box with a tinted amber background (#FFA03218), a matching subtle border (#FFA03222), and a ShieldCheck icon in solid amber (#FFA032). It enters with a spring pop animation (scale from 0, slight rotation).
3. "Upgrade to Pro" heading in white.
4. A short description paragraph in muted white.
5. Three feature bullet points ("Unlimited components", "Source code access", "Priority support"), each with a small round checkmark badge using the same warm orange tint.
6. Two buttons: a gradient CTA "Upgrade Now" (warm orange-to-red gradient with glow) and a subtle "Maybe Later" ghost button.

All text and elements fade/slide in with staggered delays. Use Framer Motion for all animations. Use Phosphor icons (ShieldCheck, X, Check) with weight="regular".`,
}
