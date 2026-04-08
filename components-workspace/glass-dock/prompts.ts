import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Build a GlassDock React component ('use client') with magnetic zoom and notification-style tinted icon badges.

\`\`\`
CONSTANTS:
ICON_SIZE = 44
MAG_RANGE = 120   // px — magnification influence radius
MAG_SCALE = 1.55  // max scale multiplier

DOCK_ITEMS: Sun/Energy/#FFBE0B, Heart/Love/#FF5C8A, MusicNote/Joy/#FF7B54,
Coffee/Comfort/#C9A96E, Leaf/Nature/#06D6A0, Star/Dreams/#FFBE0B,
Moon/Rest/#B388FF, Flame/Passion/#FF5C8A, Cloud/Peace/#3A86FF
\`\`\`

ICON STYLE — notification-style tinted badge:
Each icon is a motion.div with these inline styles (all set via style prop, NOT className, so they animate with magnification):
- width: size (MotionValue), height: size (MotionValue)
- y: y (MotionValue — lifts on magnification)
- background: \`\${color}18\` (icon color at ~9% alpha)
- border: \`1px solid \${color}22\` (icon color at ~13% alpha)
- borderRadius: 12
NO squircle clip-path, NO gradient backgrounds, NO gloss overlays, NO drop-shadows.
Phosphor icon inside: size={22}, weight="regular", style={{ color }}

MAGNIFICATION per DockItem:
- mouseX = useMotionValue(-200) in parent, passed as prop
- distance = useTransform(mouseX, mx => { get el boundingRect, return Math.abs(mx - center) })
- rawSize = useTransform(distance, [0, MAG_RANGE], [ICON_SIZE * MAG_SCALE, ICON_SIZE])
- size = useSpring(rawSize, { stiffness: 300, damping: 22, mass: 0.5 })
- y = useTransform(size, [ICON_SIZE, ICON_SIZE * MAG_SCALE], [0, -12])
- whileTap: { scale: 0.82 }

DOCK SHELL: onMouseMove sets mouseX to e.clientX, onMouseLeave sets -200.
Glass pill: rgba(255,255,255,0.06) bg, border rgba(255,255,255,0.1).
Separate blur layer: pointer-events-none absolute inset-0 z-[-1] rounded-3xl, backdropFilter blur(24px) saturate(1.8), WebkitBackdropFilter same.
boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
Entrance: spring y 50→0, stiffness 180, damping 20.

TOOLTIP: absolute -top-10 frosted glass pill, pointer-events-none, opacity-0 group-hover:opacity-100.
background rgba(255,255,255,0.1), backdropFilter blur(16px), border rgba(255,255,255,0.1).

Entrance per item: staggered spring, delay index*0.04s, y 20→0. Root: h-full w-full bg-sand-950, dock at bottom center (items-end pb-8).`,

  V0: `Build a macOS-style glass dock with notification-style tinted icon badges and magnetic zoom animation.

The dock sits at the bottom center of a dark scene with a blurred background image. It has a frosted glass pill container (blur + semi-transparent white border).

Inside the dock are 9 app icons, each representing an emotion or feeling:
- Sun (Energy, amber #FFBE0B)
- Heart (Love, pink #FF5C8A)
- MusicNote (Joy, orange #FF7B54)
- Coffee (Comfort, tan #C9A96E)
- Leaf (Nature, teal #06D6A0)
- Star (Dreams, amber #FFBE0B)
- Moon (Rest, purple #B388FF)
- Flame (Passion, pink #FF5C8A)
- Cloud (Peace, blue #3A86FF)

Each icon uses a notification-style tinted badge: a rounded-xl box (borderRadius 12) with a very subtle tinted background using the icon's color at low opacity (color + "18"), a matching faint border (color + "22"), and the Phosphor icon rendered in the full accent color. No gradients, no gloss overlays, no drop shadows — just clean tinted badges.

On hover, icons magnify with a spring animation (up to 1.55x scale, lifting upward). The magnification is distance-based — nearest icon scales most, neighbours scale proportionally. Show a frosted glass tooltip label on hover.

Icons animate in with a staggered spring entrance. Use Framer Motion for all animations. Use Phosphor icons with weight="regular".`,
}
