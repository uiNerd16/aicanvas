import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
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

  Bolt: `Create GlassStepper React component — three glassmorphism numeric steppers in a row.

STEPPER CONFIGS:
[
  { label: 'Quantity', min: 0, max: 10, step: 1, initialValue: 0, color: '#3A86FF', gradient: '#3A86FF, #2962FF' },
  { label: 'Guests', min: 1, max: 8, step: 1, initialValue: 1, color: '#FF5C8A', gradient: '#FF5C8A, #FF1744' },
  { label: 'Volume', min: 0, max: 100, step: 5, initialValue: 50, color: '#06D6A0', gradient: '#06D6A0, #00BFA5' },
]

GLASS STYLE (two consts for perf):
glassPanel: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }
glassBlur (separate static div z-[-1], isolate parent): { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: same }

STEPPER FIELD (w-[132px]):
- Label row: mb-2, label text-[10px] uppercase tracking-widest white/40, value/max readout in \`\${color}88\` tabular-nums
- Glass pill: relative isolate rounded-2xl, top edge highlight 1px gradient line
- Buttons: 36x36, rounded-xl, notification-style tinted bg \`\${color}18\`, border \`1px solid \${color}22\`. Icon (Minus/Plus 16px) in accent color. Disabled: opacity 0.4, tint \`\${color}0a\`
- Number: AnimatePresence mode="popLayout", spring stiffness:260 damping:18. Enter: opacity 0, y direction*24, scale 0.5. Exit: opacity 0, y direction*-24, scale 1.4. Gradient text via background-clip.
- BUTTON_SPRING: stiffness:300 damping:20, whileHover scale:1.08, whileTap scale:0.88

REDUCED MOTION: useReducedMotion() — springs become duration:0.15, slideOffset becomes 0.

Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950. Background img absolute inset-0 opacity-60.`,

  Lovable: `Build a beautiful glassmorphism numeric stepper component with three compact steppers arranged side by side.

Each stepper is a frosted glass pill (132px wide) with a minus button, a number in the center, and a plus button. Above each pill is a tiny uppercase label and a value/max readout.

The three steppers are:
- Quantity (blue) — 0 to 10
- Guests (pink) — 1 to 8
- Volume (green) — 0 to 100, stepping by 5

The glass effect uses the standard family style: subtle white background at 8% opacity, thin white border, deep shadow with an inset top highlight. The blur filter sits on a separate non-animating layer behind the content for performance.

Each pill has a delicate highlight line along the top edge — a gradient that fades from transparent to white and back.

The plus/minus buttons use notification-style tinted fills — the accent color at very low opacity for the background with a matching tinted border. The icons render in the full accent color. When a button is disabled (at min or max), it fades out gracefully.

The number in the center animates with a satisfying spring flip — new numbers slide in from above or below depending on direction, scaling up from small, while the old number scales up and fades out. The numbers display as gradient text matching each stepper's color.

Everything sits on a dark background with an atmospheric orange flower image at 60% opacity.

Supports reduced motion — all springs become instant transitions.

Use Framer Motion and Phosphor icons (Minus, Plus — weight "regular", 16px).`,

  'Claude Code': `Build GlassStepper component ('use client') — three glassmorphism numeric steppers.

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

  Cursor: `Implement GlassStepper with these exact specs:

STRUCTURE:
Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950
Background img: absolute inset-0 object-cover opacity-60
Steppers wrapper: relative z-10 flex flex-wrap items-start justify-center gap-5 px-4

GLASS STYLE (two consts for perf):
glassBlur (static div z-[-1], isolate parent): backdropFilter blur(24px) saturate(1.8)
glassPanel: bg rgba(255,255,255,0.08), border 1px solid rgba(255,255,255,0.1),
  boxShadow 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)

BUTTON_SPRING: { type: 'spring', stiffness: 300, damping: 20 }

THREE STEPPERS:
- Quantity: min 0, max 10, step 1, init 0, color #3A86FF, gradient #3A86FF,#2962FF
- Guests: min 1, max 8, step 1, init 1, color #FF5C8A, gradient #FF5C8A,#FF1744
- Volume: min 0, max 100, step 5, init 50, color #06D6A0, gradient #06D6A0,#00BFA5

GlassStepperField (w-[132px]):
State: [value, setValue] init from initialValue ?? min
directionRef = useRef<1|-1>(1) — tracks last increment/decrement direction

LABEL ROW: mb-2 flex items-baseline justify-between px-1
- Left: text-[10px] uppercase tracking-widest font-semibold white/40
- Right: text-[10px] font-semibold tabular-nums, color \`\${color}88\`, shows "value / max"

GLASS PILL: relative isolate overflow-hidden rounded-2xl style={glassPanel}
- Blur layer: absolute inset-0 z-[-1] rounded-2xl style={glassBlur}
- Top highlight: absolute left-4 right-4 top-0 z-10 h-[1px]
  bg linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)

CONTENT ROW: relative z-10 flex items-stretch justify-between p-2

MINUS/PLUS BUTTONS (motion.button):
- 36px wide, rounded-xl, outline none, cursor-pointer
- Notification-style tinted: bg \`\${color}18\`, border \`1px solid \${color}22\`
- Disabled (atMin/atMax): bg \`\${color}0a\`, border \`\${color}0a\`, opacity 0.4, pointerEvents none
- Icon: Minus/Plus size 16 weight "regular", style color: disabled ? rgba(255,255,255,0.3) : color
- whileHover scale 1.08 (skip if disabled), whileTap scale 0.88, transition BUTTON_SPRING

NUMBER DISPLAY: 36px wide div, flex items-center justify-center overflow-hidden
- AnimatePresence mode="popLayout" initial={false}
- motion.span key={value}:
  initial: opacity 0, y direction*slideOffset, scale 0.5
  animate: opacity 1, y 0, scale 1
  exit: opacity 0, y direction*-slideOffset, scale 1.4
  transition: spring stiffness 260 damping 18
  slideOffset: prefersReduced ? 0 : 24
- className: text-base font-bold tabular-nums
- Gradient text: background linear-gradient(135deg, gradient), backgroundClip text,
  WebkitBackgroundClip text, WebkitTextFillColor transparent

REDUCED MOTION: useReducedMotion() — slideOffset=0, number spring → duration 0.15
Button whileHover/whileTap skipped when prefersReduced`,
}
