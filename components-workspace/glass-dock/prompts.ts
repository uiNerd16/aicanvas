import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
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

  Bolt: `Create a macOS dock component with magnetic zoom and notification-style tinted icon badges in React + Framer Motion.

ICONS (from @phosphor-icons/react, weight="regular"):
Sun, Heart, MusicNote, Coffee, Leaf, Star, Moon, Flame, Cloud

DOCK_ITEMS array:
{ icon: Sun, color: '#FFBE0B', label: 'Energy' },
{ icon: Heart, color: '#FF5C8A', label: 'Love' },
{ icon: MusicNote, color: '#FF7B54', label: 'Joy' },
{ icon: Coffee, color: '#C9A96E', label: 'Comfort' },
{ icon: Leaf, color: '#06D6A0', label: 'Nature' },
{ icon: Star, color: '#FFBE0B', label: 'Dreams' },
{ icon: Moon, color: '#B388FF', label: 'Rest' },
{ icon: Flame, color: '#FF5C8A', label: 'Passion' },
{ icon: Cloud, color: '#3A86FF', label: 'Peace' },

ICON STYLE — notification-style tinted badge (NOT squircle, NOT gradient):
- borderRadius: 12 (rounded-xl)
- background: \`\${color}18\` (icon color at ~9% alpha)
- border: \`1px solid \${color}22\` (icon color at ~13% alpha)
- Icon rendered at size 22, weight="regular", style={{ color }}
- No gloss overlay, no drop-shadow, no clip-path

MAGNIFICATION: useMotionValue for mouseX (screen clientX). Each DockItem uses useTransform to compute distance from icon center to mouse, maps [0, 120px] → [ICON_SIZE*1.55, ICON_SIZE]. Wrap in useSpring({ stiffness: 300, damping: 22, mass: 0.5 }). Y lifts upward proportionally. The width, height, y, background, border, and borderRadius are all set via motion.div style prop so they animate with magnification.

DOCK SHELL: rounded-3xl pill, background rgba(255,255,255,0.06), backdropFilter blur(24px) saturate(1.8), border rgba(255,255,255,0.1).

TOOLTIP: absolute -top-10, frosted glass, opacity-0 group-hover:opacity-100.

Entrance: staggered spring animation, delay: index * 0.04s. whileTap: scale 0.82.`,

  Lovable: `Make a beautiful emotional dock component inspired by macOS design.

It should look like a floating glass bar at the bottom of the screen containing 9 icons, each one representing a human emotion or feeling: Energy (sun), Love (heart), Joy (music note), Comfort (coffee), Nature (leaf), Dreams (star), Rest (moon), Passion (flame), Peace (cloud).

Each icon should:
- Have its own warm color matching its emotion
- Use a notification-style badge look — a softly rounded square with a very faint tinted background in the icon's color, a whisper-thin matching border, and the icon itself rendered in full color. Think of how iOS notification badges feel — clean, minimal, and elegant.
- Magnify and lift up when you hover near them, with the closest icon scaling the most (like a real macOS dock)
- Show a small tooltip with the emotion name on hover

The dock itself should be a frosted glass pill. Everything should animate smoothly with spring physics — the magnification should feel bouncy and alive.

Use Framer Motion and Phosphor icons.`,

  'Claude Code': `Build a GlassDock React component ('use client') with magnetic zoom and notification-style tinted icon badges.

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

  Cursor: `File: \`components-workspace/glass-dock/index.tsx\`
- Export \`GlassDock\` ('use client')
- Icons from @phosphor-icons/react: Sun, Heart, MusicNote, Coffee, Leaf, Star, Moon, Flame, Cloud — all weight="regular"

CONSTANTS:
- ICON_SIZE = 44, MAG_RANGE = 120, MAG_SCALE = 1.55
- 9 items: Sun/#FFBE0B/Energy, Heart/#FF5C8A/Love, MusicNote/#FF7B54/Joy, Coffee/#C9A96E/Comfort, Leaf/#06D6A0/Nature, Star/#FFBE0B/Dreams, Moon/#B388FF/Rest, Flame/#FF5C8A/Passion, Cloud/#3A86FF/Peace

ICON APPEARANCE — notification-style tinted badge:
- All via motion.div style prop (NOT className): width/height from MotionValue, y from MotionValue
- background: \`\${color}18\` (color at ~9% alpha)
- border: \`1px solid \${color}22\` (color at ~13% alpha)
- borderRadius: 12
- NO clip-path, NO gradients, NO gloss overlay, NO drop-shadow
- Phosphor icon: size=22, weight="regular", style={{ color }}
- whileTap: { scale: 0.82 }

MAGNETIC ZOOM:
- Parent: mouseX = useMotionValue(-200), set via onMouseMove e.clientX, reset -200 onMouseLeave
- DockItem: ref on container, useTransform mouseX → distance from icon center (getBoundingClientRect)
- Map distance [0, 120] → size [ICON_SIZE*1.55, ICON_SIZE]
- useSpring(rawSize, { stiffness: 300, damping: 22, mass: 0.5 })
- y: useTransform size [44, 68.2] → [0, -12]

TOOLTIP:
- absolute -top-10, pointer-events-none, rounded-lg px-3 py-1.5
- bg rgba(255,255,255,0.1), backdropFilter blur(16px), border rgba(255,255,255,0.1)
- opacity-0 group-hover:opacity-100, transition opacity 0.15s

DOCK PILL:
- motion.div, rounded-3xl, items-end gap-2 px-4 pb-3 pt-3
- bg rgba(255,255,255,0.06), border rgba(255,255,255,0.1)
- boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)
- Separate blur layer: absolute inset-0 z-[-1], backdropFilter blur(24px) saturate(1.8)
- Entrance spring: y 50→0, stiffness 180, damping 20

ROOT: h-full w-full relative, bg-sand-950, items-end pb-8, bg img opacity-60
ITEM ENTRANCE: staggered spring, delay index*0.04, y 20→0, stiffness 200 damping 18`,
}
