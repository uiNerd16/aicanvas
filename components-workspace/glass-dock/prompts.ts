import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Build a macOS-style glass dock with iOS squircle app icons and magnetic zoom animation.

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

Each icon uses an iOS continuous corner squircle shape (not regular border-radius) via an SVG clipPath with objectBoundingBox. The icon background is a gradient using the icon's color.

On hover, icons magnify with a spring animation (up to 1.55× scale, lifting upward). The magnification is distance-based — nearest icon scales most, neighbours scale proportionally. Show a frosted glass tooltip label on hover.

Icons animate in with a staggered spring entrance. Each icon has a gloss overlay (top half white gradient) and a drop shadow in the icon's color.

Use Framer Motion for all animations. Use Phosphor icons.`,

  Bolt: `Create a macOS dock component with magnetic zoom and iOS squircle icons in React + Framer Motion.

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

SQUIRCLE: Use SVG clipPath with clipPathUnits="objectBoundingBox" and this path:
M0.5 0C0.7413 0 0.8559 0 0.9227 0.0773C1 0.1441 1 0.2587 1 0.5C1 0.7413 1 0.8559 0.9227 0.9227C0.8559 1 0.7413 1 0.5 1C0.2587 1 0.1441 1 0.0773 0.9227C0 0.8559 0 0.7413 0 0.5C0 0.2587 0 0.1441 0.0773 0.0773C0.1441 0 0.2587 0 0.5 0Z
Apply via clipPath: 'url(#squircle)' on each icon div. Use filter: drop-shadow instead of box-shadow (box-shadow is clipped).

MAGNIFICATION: useMotionValue for mouseX (screen clientX). Each DockItem uses useTransform to compute distance from icon center to mouse, maps [0, 120px] → [ICON_SIZE*1.55, ICON_SIZE]. Wrap in useSpring({ stiffness: 300, damping: 22, mass: 0.5 }). Y lifts upward proportionally.

DOCK SHELL: rounded-3xl pill, background rgba(255,255,255,0.06), backdropFilter blur(24px), border rgba(255,255,255,0.1).

TOOLTIP: absolute -top-10, frosted glass, opacity-0 group-hover:opacity-100.

Entrance: staggered spring animation, delay: index * 0.04s.`,

  Lovable: `Make a beautiful emotional dock component inspired by macOS and iOS design.

It should look like a floating glass bar at the bottom of the screen containing 9 icons, each one representing a human emotion or feeling: Energy (sun), Love (heart), Joy (music note), Comfort (coffee), Nature (leaf), Dreams (star), Rest (moon), Passion (flame), Peace (cloud).

Each icon should:
- Have its own warm color matching its emotion
- Use Apple's special squircle shape (continuous corner curve, not regular rounded corners) — this is what makes iOS app icons feel so smooth
- Magnify and lift up when you hover near them, with the closest icon scaling the most (like a real macOS dock)
- Show a small tooltip with the emotion name on hover
- Have a glossy highlight on the top half

The dock itself should be a frosted glass pill. Everything should animate smoothly with spring physics.

Use Framer Motion and Phosphor icons.`,

  'Claude Code': `Build a GlassDock React component ('use client') with magnetic zoom, iOS squircle icons, and emotional icon set.

\`\`\`
CONSTANTS:
ICON_SIZE = 44
MAG_RANGE = 120   // px — magnification influence radius
MAG_SCALE = 1.55  // max scale multiplier

SQUIRCLE_PATH = 'M0.5 0C0.7413 0 0.8559 0 0.9227 0.0773C1 0.1441 1 0.2587 1 0.5C1 0.7413 1 0.8559 0.9227 0.9227C0.8559 1 0.7413 1 0.5 1C0.2587 1 0.1441 1 0.0773 0.9227C0 0.8559 0 0.7413 0 0.5C0 0.2587 0 0.1441 0.0773 0.0773C0.1441 0 0.2587 0 0.5 0Z'

DOCK_ITEMS: Sun/Energy/#FFBE0B, Heart/Love/#FF5C8A, MusicNote/Joy/#FF7B54,
Coffee/Comfort/#C9A96E, Leaf/Nature/#06D6A0, Star/Dreams/#FFBE0B,
Moon/Rest/#B388FF, Flame/Passion/#FF5C8A, Cloud/Peace/#3A86FF
\`\`\`

SQUIRCLE CLIP: Hidden SVG with \`<clipPath id="squircle" clipPathUnits="objectBoundingBox">\`. Apply via style clipPath: 'url(#squircle)'. Use filter drop-shadow (not box-shadow — it gets clipped).

MAGNIFICATION per DockItem:
- mouseX = useMotionValue(-200) in parent, passed as prop
- distance = useTransform(mouseX, mx => Math.abs(mx - iconCenterX))
- rawSize = useTransform(distance, [0, MAG_RANGE], [ICON_SIZE * MAG_SCALE, ICON_SIZE])
- size = useSpring(rawSize, { stiffness: 300, damping: 22, mass: 0.5 })
- y = useTransform(size, [ICON_SIZE, ICON_SIZE * MAG_SCALE], [0, -12])

ICON STYLE: background linear-gradient(145deg, color+dd, color+88), gloss overlay (top 50% white gradient), filter drop-shadow in icon color.

DOCK SHELL: onMouseMove sets mouseX to e.clientX, onMouseLeave sets -200. Glass pill: rgba(255,255,255,0.06) bg, blur(24px) backdrop, rgba(255,255,255,0.1) border.

TOOLTIP: absolute -top-10 frosted glass, opacity-0 → group-hover:opacity-100.

Entrance: staggered spring, delay index*0.04s. Root: h-full w-full bg-sand-950, dock at bottom center.`,

  Cursor: `Implement GlassDock component with these exact specs:

STRUCTURE:
- Root div: h-full w-full relative, dark bg, dock centered at bottom
- Hidden SVG defines #squircle clipPath (objectBoundingBox units) for iOS continuous corners
- Framer Motion dock pill at bottom with spring entrance (y: 50→0)
- 9 DockItem components inside

SQUIRCLE PATH (objectBoundingBox):
M0.5 0C0.7413 0 0.8559 0 0.9227 0.0773C1 0.1441 1 0.2587 1 0.5C1 0.7413 1 0.8559 0.9227 0.9227C0.8559 1 0.7413 1 0.5 1C0.2587 1 0.1441 1 0.0773 0.9227C0 0.8559 0 0.7413 0 0.5C0 0.2587 0 0.1441 0.0773 0.0773C0.1441 0 0.2587 0 0.5 0Z

ICONS (@phosphor-icons/react, weight="regular"):
Sun #FFBE0B, Heart #FF5C8A, MusicNote #FF7B54, Coffee #C9A96E, Leaf #06D6A0,
Star #FFBE0B, Moon #B388FF, Flame #FF5C8A, Cloud #3A86FF

MAGNETIC ZOOM:
- Parent: mouseX = useMotionValue(-200), set via onMouseMove e.clientX
- DockItem: useTransform mouseX → distance from icon center (getBoundingClientRect)
- Map distance [0,120] → size [ICON_SIZE*1.55, ICON_SIZE=44]
- useSpring(rawSize, {stiffness:300, damping:22, mass:0.5})
- y: useTransform size [44, 68.2] → [0, -12]

ICON APPEARANCE:
- clipPath: url(#squircle), NOT border-radius
- background: linear-gradient(145deg, color+dd, color+88)
- filter: drop-shadow(0 4px 12px color+55)  ← must use filter, not box-shadow
- Gloss: absolute inset-0, linear-gradient top 50% white→transparent

TOOLTIP: absolute -top-10, group-hover:opacity-100, frosted glass pill

DOCK PILL: rgba(255,255,255,0.06) bg, backdrop-filter blur(24px) saturate(1.8), border rgba(255,255,255,0.1), gap-2 px-4 py-3`,
}
