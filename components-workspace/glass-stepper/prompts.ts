import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Build GlassStepper component ('use client') — three glassmorphism numeric steppers.

CONFIGS:
- Quantity: min 0, max 10, step 1, init 0, color '#3A86FF', gradient '#3A86FF, #2962FF'
- Guests: min 1, max 8, step 1, init 1, color '#FF5C8A', gradient '#FF5C8A, #FF1744'
- Volume: min 0, max 100, step 5, init 50, color '#06D6A0', gradient '#06D6A0, #00BFA5'

GLASS STYLE (two consts — blur on separate static layer for perf):
glassBlur: { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: same }
glassPanel: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }

GlassStepperField (w-[132px], props: min, max, step, initialValue, label, color, gradient):
- State: [value, setValue], directionRef useRef<1|-1>(1)
- atMin = value <= min, atMax = value >= max
- increment/decrement: guard at limits, set directionRef, clamp value

LABEL ROW: mb-2 flex justify-between px-1
- Label: text-[10px] uppercase tracking-widest white/40
- Readout: text-[10px] tabular-nums \`\${color}88\`

GLASS PILL: relative isolate overflow-hidden rounded-2xl, style={glassPanel}
- Blur div: absolute inset-0 z-[-1] rounded-2xl, style={glassBlur}
- Top highlight: absolute left-4 right-4 top-0 h-[1px], gradient 90deg transparent→white/18%→transparent

BUTTONS (motion.button, 36x36 rounded-xl):
- Notification-style: bg \`\${color}18\`, border \`1px solid \${color}22\`
- Disabled: bg \`\${color}0a\`, border \`\${color}0a\`, opacity 0.4, pointerEvents none
- Icon: Minus/Plus size 16 weight "regular", color: atLimit ? 'rgba(255,255,255,0.3)' : color
- whileHover scale:1.08, whileTap scale:0.88, BUTTON_SPRING stiffness:300 damping:20

NUMBER DISPLAY (36px wide, overflow-hidden):
- AnimatePresence mode="popLayout" initial={false}
- motion.span key={value}:
  initial: opacity 0, y direction*24, scale 0.5
  animate: opacity 1, y 0, scale 1
  exit: opacity 0, y direction*-24, scale 1.4
  spring stiffness:260 damping:18
- Gradient text: background linear-gradient(135deg, \${gradient}), backgroundClip text, WebkitTextFillColor transparent
- text-base font-bold tabular-nums

REDUCED MOTION: useReducedMotion() — slideOffset 0, springs → duration 0.15

Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950
Background img: absolute inset-0 object-cover opacity-60
Steppers: flex flex-wrap gap-5 px-4`,

  V0: `Build a glassmorphism numeric stepper component showing three side-by-side steppers on a dark background with an atmospheric orange flower image at 60% opacity.

Each stepper is a compact 132px-wide glass pill with a label row above it and a minus/plus button on each side of a centered number display. The three steppers are:
- Quantity (blue #3A86FF, range 0–10, step 1)
- Guests (pink #FF5C8A, range 1–8, step 1)
- Volume (green #06D6A0, range 0–100, step 5)

Glass panel style: background rgba(255,255,255,0.08), border 1px solid rgba(255,255,255,0.1), boxShadow with 40px spread + inset top highlight. Blur on a separate static layer (blur 24px, saturate 1.8) using z-[-1] with isolate parent — never on the animated element.

Top edge highlight: a 1px horizontal line with gradient (transparent → white/18% → transparent).

Buttons use notification-style tinted backgrounds — the accent color at very low opacity (hex + "18") with a 1px border (hex + "22"). Icons (Minus/Plus, 16px, Phosphor weight "regular") render in the accent color. When disabled (at min/max), buttons fade to 40% opacity with near-invisible tint.

The number display uses AnimatePresence with popLayout mode. Numbers slide in/out vertically (24px offset) with scale animation (0.5 enter, 1.4 exit) using spring physics (stiffness 260, damping 18). The number text has a gradient fill matching each stepper's color pair.

Label row: 10px uppercase tracking-widest label on the left (white/40%), value/max readout on the right in the accent color at 53% opacity. Both use tabular-nums for alignment.

Support prefers-reduced-motion: replace all springs with duration 0.15 and skip the slide offset.

Use Framer Motion for all animations and Phosphor icons.`,
}
