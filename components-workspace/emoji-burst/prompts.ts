import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/emoji-burst/index.tsx:

\`\`\`
'use client'
export function EmojiBurst()
\`\`\`

SETS constant (5 items): Party/Boom/Yum/Cute/Love — each with label, emojis[], bg (gradient string), shadow (rgba string).

Particle interface: { id, emoji, angle, distance, rotation, size, duration }
- No delay field — all fire simultaneously

explode():
- isPopping guard
- 18 particles, evenly spaced angle (i/18 * 2π) + ±40% jitter per slice
- duration: 0.55 + Math.random()*0.25 per particle
- setTimeout cleanup at 850ms

EmojiParticle component:
- tx = cos(angle)*distance, ty = sin(angle)*distance
- lift = 18 + Math.abs(Math.cos(angle))*22
- motion.span, absolute, centered via translateX/Y '-50%' in style
- initial: { x:0, y:0, scale:0, opacity:1, rotate:0 }
- animate keyframes times:[0,0.2,1]:
  x:[0,tx*0.5,tx], y:[0,ty*0.5-lift,ty], scale:[0,1.25,0.55], opacity:[1,1,0], rotate:[0,rot*0.5,rot]
- transition: duration:p.duration, ease:[[0.08,0.82,0.17,1],'linear'] as never, times:[0,0.2,1]

Button: motion.button, rounded-full px-14 py-4, gradient+shadow via inline style
- whileTap scale:0.88, whileHover scale:1.06, spring stiffness:420 damping:18
- AnimatePresence mode="wait" around label span, key=setIdx
  - label: initial/exit blur(4px)+y±8, animate blur(0)+y:0, spring duration:0.35 bounce:0

Root: bg-sand-100 dark:bg-sand-950, h-full w-full centered`,
}
