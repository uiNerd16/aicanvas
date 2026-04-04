import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create an "Emoji Burst" button component. When clicked, it explodes emojis outward in all directions like confetti, each flying with a random angle, distance, rotation, and fade.

The button is a wide pill shape (fully rounded corners), with a gradient background that changes on each click. There are 5 emoji sets that cycle through: Party (🎉🎊🥳🎈), Boom (🔥💥⚡☄️), Yum (🍕🍔🌮🍣), Cute (🐱🐶🐼🦄), and Love (❤️💜💙💖). Each set has its own gradient color and glow shadow.

On each click, 18 emoji particles burst outward simultaneously from the button center. They all fire at the same instant (no stagger — that's the pop), but each has a slightly different duration (0.55–0.80s) for organic variety. Each particle:
- Starts at scale 0 (invisible), pops to scale 1.25, then shrinks to 0.55 as it fades
- Follows a slight upward arc to the midpoint, then continues to the final position
- Rotates randomly up to ±320°
- Fades out in the second half of its flight

The easing is split per segment: a fast explosive ease-out for the pop phase (first 20%), then linear drift for the fade phase. The button label transitions between sets with a blur+slide animation using AnimatePresence.

Works in both light mode (bg-sand-100) and dark mode (bg-sand-950).`,

  Bolt: `Build an EmojiBurst button component with these exact specs:

EMOJI SETS (cycle on each click):
\`\`\`
{ label: 'Party!', emojis: ['🎉','🎊','🥳','🎈','🎁','✨','🌟','🪅'], bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', shadow: 'rgba(139,92,246,0.5)' }
{ label: 'Boom!',  emojis: ['🔥','💥','⚡','🌪️','💫','⭐','🌈','☄️'], bg: 'linear-gradient(135deg,#F97316,#DC2626)', shadow: 'rgba(249,115,22,0.5)'  }
{ label: 'Yum!',  emojis: ['🍕','🍔','🌮','🍣','🍩','🧁','🍦','🍇'], bg: 'linear-gradient(135deg,#22C55E,#16A34A)', shadow: 'rgba(34,197,94,0.5)'   }
{ label: 'Cute!', emojis: ['🐱','🐶','🐼','🦊','🦄','🐸','🐧','🐨'], bg: 'linear-gradient(135deg,#06B6D4,#0284C7)', shadow: 'rgba(6,182,212,0.5)'   }
{ label: 'Love!', emojis: ['❤️','💜','💙','💚','💛','🧡','💖','💝'], bg: 'linear-gradient(135deg,#EC4899,#BE185D)', shadow: 'rgba(236,72,153,0.5)'  }
\`\`\`

PARTICLE (18 per burst, all fire simultaneously):
- Angle: evenly spaced (i/18 * 2π) + jitter (±10% of slice)
- Distance: 85–180px random
- Rotation: ±320° random
- Size: 1.4–2.3rem random
- Duration: 0.55–0.80s random (organic variation without stagger)

PARTICLE ANIMATION (Framer Motion keyframes):
\`\`\`
initial: { x:0, y:0, scale:0, opacity:1, rotate:0 }
animate: {
  x: [0, tx*0.5, tx],
  y: [0, ty*0.5 - lift, ty],   // lift = 18 + |cos(angle)|*22
  scale: [0, 1.25, 0.55],
  opacity: [1, 1, 0],
  rotate: [0, rotation*0.5, rotation],
}
transition: {
  duration: particle.duration,
  ease: [[0.08, 0.82, 0.17, 1], 'linear'],  // fast pop → linear drift
  times: [0, 0.2, 1],
}
\`\`\`

BUTTON: rounded-full, px-14 py-4, gradient bg + glow shadow, whileTap scale:0.88, whileHover scale:1.06, spring stiffness:420 damping:18. Label transitions with AnimatePresence mode="wait", blur+y slide, spring duration:0.35 bounce:0.

GUARD: isPopping flag prevents stacking. Cleanup at 850ms.`,

  Lovable: `I want a delightful emoji confetti button. When you click it, emojis explode outward in all directions like a party popper went off.

Here's what makes it special:
- 18 emojis burst out simultaneously (all at once — the instant pop is the whole point)
- Each emoji flies a different distance, spins differently, and arrives at a slightly different time — so it looks organic, not mechanical
- The emojis follow a subtle arc (like real thrown objects), not perfectly straight lines
- They scale up from nothing with a little overshoot, then shrink and fade as they travel

There are 5 emoji themes that cycle with each click: Party, Boom, Yum (food), Cute (animals), Love. The button itself changes gradient color to match the current theme. The button label also animates between themes with a blur-slide transition.

The button is a wide pill shape with a gradient and colored glow shadow. It should feel great to spam-click — each click switches to the next theme and fires a new burst.

Works in both light and dark backgrounds.`,

  'Claude Code': `Create components-workspace/emoji-burst/index.tsx:

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

  Cursor: `Build components-workspace/emoji-burst/index.tsx — an emoji confetti button.

Named export: EmojiBurst. 'use client' at top.

Core concept: clicking fires 18 emoji particles simultaneously from the button center. All fire at the same instant (no per-particle delay) — the instant pop is the effect. Organic feel comes from each particle having a unique duration (0.55–0.80s), not from staggering.

Data:
\`\`\`ts
const SETS = [
  { label:'Party!', emojis:[...], bg:'linear-gradient(135deg,#8B5CF6,#6D28D9)', shadow:'rgba(139,92,246,0.5)' },
  // + Boom, Yum, Cute, Love
]
\`\`\`

Particle generation (18 per click):
- angle = (i/18)*Math.PI*2 + jitter
- distance = 85 + rand*95
- rotation = (rand-0.5)*640
- size = 1.4 + rand*0.9 (rem)
- duration = 0.55 + rand*0.25

Particle animation (critical — this is what makes it feel good):
\`\`\`ts
// lift varies by angle so arc is most visible on horizontal paths
const lift = 18 + Math.abs(Math.cos(p.angle)) * 22

initial={{ x:0, y:0, scale:0, opacity:1, rotate:0 }}
animate={{
  x:[0, tx*0.5, tx],
  y:[0, ty*0.5 - lift, ty],
  scale:[0, 1.25, 0.55],
  opacity:[1, 1, 0],
  rotate:[0, rotation*0.5, rotation],
}}
transition={{
  duration: p.duration,
  ease: [[0.08, 0.82, 0.17, 1], 'linear'],
  times: [0, 0.2, 1],
}}
\`\`\`

Button: rounded-full px-14 py-4, inline gradient+shadow style (dynamic per set), whileTap scale:0.88 whileHover scale:1.06, spring 420/18.

Label: AnimatePresence mode="wait", key=setIdx, blur(4px)+y slide in/out.

isPopping guard prevents burst stacking. Cleanup via setTimeout at 850ms.

Root div: bg-sand-100 dark:bg-sand-950, h-full w-full flex centered.`,
}
