import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a glassmorphism sidebar navigation component called GlassSidebar. It has two states: collapsed (about 64px wide, icons only) and expanded (about 220px wide, icons plus text labels side by side).

The sidebar lives on the left side of a dark preview area. The background shows an ethereal pink flower image (https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png) at 60% opacity over a very dark background. The sidebar itself is a frosted glass panel — semi-transparent white with a strong backdrop blur — floating over that image.

There are 7 navigation items, each with a squircle (iOS-style rounded square) icon tile in its own colour: Home in blue, Search in soft purple, Projects in amber, Notifications in pink-red, Analytics in teal, Settings in warm gold, and Profile in coral-orange. Each tile has a subtle colour gradient and a top-half gloss shimmer. The active item gets a brighter gradient and a soft coloured glow.

At the bottom there's a small toggle button. When collapsed it shows a right-pointing arrow; when expanded it shows a left-pointing arrow. The arrows rotate in on entry and out on exit with a 90° spin animation. Clicking it smoothly springs the sidebar width open or closed — the motion feels physical and momentum-driven, not linear.

When expanding, the text labels slide and fade in with a gentle stagger — each one slightly after the previous. When collapsing, they disappear instantly so the sidebar snaps shut cleanly.

Hovering a nav item in collapsed mode scales it up more and nudges it slightly to the right — a subtle nudge that invites a click. In expanded mode, hover just scales it gently. When collapsed and hovering, a small glass tooltip pill appears to the right of the icon showing the item's label.

Use Next.js, Tailwind CSS, and Framer Motion. Icons come from @phosphor-icons/react.`,

  Bolt: `Build a React component called GlassSidebar using Framer Motion and Tailwind CSS.

**Layout**
- Full-height, full-width wrapper centred on bg-sand-950 with an absolute background image (https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png, opacity-60, object-cover).
- A fixed-width anchor div (220px) keeps the left edge stable. Inside it, a motion.div sidebar panel expands rightward only.
- The sidebar width is driven by a Framer Motion useSpring: collapsed = 64px, expanded = 220px, stiffness 280, damping 26.

**Glass style (applied to sidebar panel + tooltips)**
- background: rgba(255,255,255,0.06)
- backdropFilter: blur(24px) saturate(1.8)
- border: 1px solid rgba(255,255,255,0.1)
- boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)

**Nav items** — 7 items with Phosphor icons (weight="regular") and per-item hex colours:
House/#3A86FF, MagnifyingGlass/#B388FF, Folders/#FFBE0B, Bell/#FF5C8A, ChartLine/#06D6A0, Gear/#C9A96E, User/#FF7B54

**Icon tiles**
- Squircle clip-path via inline SVG clipPath with objectBoundingBox and path "M0.5 0C0.7413 0 0.8559 0 0.9227 0.0773C1 0.1441 1 0.2587 1 0.5C1 0.7413 1 0.8559 0.9227 0.9227C0.8559 1 0.7413 1 0.5 1C0.2587 1 0.1441 1 0.0773 0.9227C0 0.8559 0 0.7413 0 0.5C0 0.2587 0 0.1441 0.0773 0.0773C0.1441 0 0.2587 0 0.5 0Z"
- 44×44px tile; icon size 22px
- Active: gradient 145deg from color+ff to color+cc, drop-shadow glow color+88
- Inactive: gradient 145deg from color+cc to color+66, drop-shadow color+44
- Gloss overlay: linear-gradient 180deg rgba(255,255,255,0.28) 0% → rgba(255,255,255,0.04) 50% → transparent 50%

**Hover interaction** — use explicit animate prop driven by React useState (onMouseEnter/onMouseLeave), NOT whileHover, to prevent stuck states. Collapsed hover: scale 1.15 + x: 3. Expanded hover: scale 1.08 only. Spring: stiffness 320, damping 20.

**Labels** — AnimatePresence wraps each label. Enter: opacity 0→1, x -8→0, duration 0.18s easeOut, delay 0.18 + index×0.03s. Exit: opacity→0, x→-6, duration 0.08s easeIn instantly.

**Tooltips** — glass pill shown only when collapsed AND hovered. AnimatePresence: initial opacity 0 x -6, animate opacity 1 x 0, exit opacity 0 x -6, duration 0.15s.

**Toggle button** — ArrowRight/ArrowLeft icons swapped via AnimatePresence mode="wait". Each arrow: initial rotate ±90, animate rotate 0, exit rotate ∓90, duration 0.18s.

Reset hover state with useEffect on isOpen change to avoid stuck tooltips.`,

  Lovable: `I'd love a glassmorphism sidebar that feels like a piece of frosted glass floating in front of a lush, dreamy background. When it's closed it's just a slim strip of glowing icons — mysterious, minimal. When it opens it breathes outward to reveal the labels, like a window slowly sliding open.

The background is an ethereal pink flower photograph, softly dimmed, over a near-black canvas. The sidebar floats over it with that signature frosted-glass look: a hint of white through the blur, a delicate white border, a deep shadow below. It feels premium and calm.

Each of the 7 nav icons lives in its own squircle tile — those satisfying iOS-style rounded squares. Every icon has its own personality through colour: a calming blue for Home, soft purple for Search, warm amber for Projects, vibrant pink for Notifications, fresh teal for Analytics, earthy gold for Settings, and a warm coral for Profile. Each tile has a gloss catch at the top, like light reflecting off a slightly curved surface.

The active icon is a little bit brighter, a little bit glowing — it pulses with its own colour gently. Hovering any icon feels responsive and springy, like it's physically reacting to your cursor.

When the sidebar is collapsed, hovering an icon shows a small glass tooltip pill floating to the right — a gentle whisper of what the button does. When expanded, the labels slide in with a graceful stagger, each one arriving just after the previous, like dominoes in slow motion.

The toggle button at the bottom uses an arrow that spins into place as it switches direction — a tiny moment of delight in an otherwise serious UI.

Please use Framer Motion for all animations and @phosphor-icons/react for the icons.`,

  'Claude Code': `Create \`components-workspace/glass-sidebar/index.tsx\`. Export a named function \`GlassSidebar\`.

**File header**
\`\`\`
'use client'
\`\`\`

**Imports**
- React: useState, useEffect
- Framer Motion: motion, useSpring, AnimatePresence
- @phosphor-icons/react: House, MagnifyingGlass, Folders, Bell, ChartLine, Gear, User, ArrowRight, ArrowLeft

**Constants**
\`\`\`ts
const SQUIRCLE_PATH = 'M0.5 0C0.7413 0 0.8559 0 0.9227 0.0773C1 0.1441 1 0.2587 1 0.5C1 0.7413 1 0.8559 0.9227 0.9227C0.8559 1 0.7413 1 0.5 1C0.2587 1 0.1441 1 0.0773 0.9227C0 0.8559 0 0.7413 0 0.5C0 0.2587 0 0.1441 0.0773 0.0773C0.1441 0 0.2587 0 0.5 0Z'
const COLLAPSED_WIDTH = 64
const EXPANDED_WIDTH = 220
const ICON_TILE_SIZE = 44
const TOGGLE_BUTTON_HEIGHT = 36
\`\`\`

**NAV_ITEMS array (as const)**
\`\`\`ts
[
  { icon: House,           label: 'Home',          color: '#3A86FF' },
  { icon: MagnifyingGlass, label: 'Search',        color: '#B388FF' },
  { icon: Folders,         label: 'Projects',      color: '#FFBE0B' },
  { icon: Bell,            label: 'Notifications', color: '#FF5C8A' },
  { icon: ChartLine,       label: 'Analytics',     color: '#06D6A0' },
  { icon: Gear,            label: 'Settings',      color: '#C9A96E' },
  { icon: User,            label: 'Profile',       color: '#FF7B54' },
]
\`\`\`

**GLASS_STYLE object (as const)**
- background: 'rgba(255,255,255,0.06)'
- backdropFilter: 'blur(24px) saturate(1.8)'
- WebkitBackdropFilter: 'blur(24px) saturate(1.8)'
- border: '1px solid rgba(255,255,255,0.1)'
- boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'

**NavItemRow sub-component** — props: item, index (number), isActive (boolean), isOpen (boolean), onActivate (() => void)
- Local useState: hovered (boolean)
- useEffect: reset hovered to false when isOpen changes (prevents tooltip sticking on toggle)
- Tooltip (AnimatePresence): render only when !isOpen && hovered. Glass pill, positioned absolute left-[calc(100%+10px)] z-50. Animate: initial {opacity:0, x:-6} → animate {opacity:1, x:0} → exit {opacity:0, x:-6}, duration 0.15s
- motion.button with explicit animate prop (NOT whileHover):
  - animate.scale: hovered ? (isOpen ? 1.08 : 1.15) : 1
  - animate.x: hovered ? (isOpen ? 0 : 3) : 0
  - whileTap: scale 0.90
  - transition: spring stiffness 320, damping 20
- Icon tile: 44×44px div with clipPath='url(#squircle-sidebar)', inline gradient background (active: color+ff → color+cc at 145deg; inactive: color+cc → color+66 at 145deg), filter drop-shadow (active: color+88 at 10px; inactive: color+44 at 8px)
- Gloss overlay div inside tile: linear-gradient 180deg rgba(255,255,255,0.28) 0% → rgba(255,255,255,0.04) 50% → transparent 50%
- Icon component: size=22, weight="regular", className="text-white relative z-10"
- Label (AnimatePresence): render only when isOpen. motion.span initial {opacity:0, x:-8} → animate {opacity:1, x:0, transition:{duration:0.18, ease:'easeOut', delay: 0.18 + index*0.03}} → exit {opacity:0, x:-6, transition:{duration:0.08, ease:'easeIn', delay:0}}. Color: isActive ? item.color : 'rgba(255,255,255,0.75)'

**GlassSidebar main component**
- State: isOpen (boolean, default false), activeIndex (number, default 0)
- widthSpring = useSpring(COLLAPSED_WIDTH, { stiffness: 280, damping: 26 })
- toggle(): flips isOpen, calls widthSpring.set(next ? EXPANDED_WIDTH : COLLAPSED_WIDTH)
- Root div: className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950"
- SVG clip-path definition (zero-size, absolute): clipPath id="squircle-sidebar" clipPathUnits="objectBoundingBox" with SQUIRCLE_PATH
- Background img: absolute inset-0 h-full w-full object-cover opacity-60, src=https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png, alt=""
- Anchor div: style={{width: EXPANDED_WIDTH}}, className="flex items-center justify-start"
  - motion.div sidebar: style={{width: widthSpring, ...GLASS_STYLE}}, initial {{x:-20, opacity:0}}, animate {{x:0, opacity:1}}, transition spring stiffness 200 damping 22 delay 0.1, className="relative flex h-auto flex-col items-center gap-2 overflow-visible rounded-3xl px-2.5 py-3"
    - Nav items loop (gap-1.5 flex-col)
    - Divider: 1px height, background rgba(255,255,255,0.1)
    - Toggle button: motion.button whileHover scale 1.08, whileTap scale 0.90, spring stiffness 300 damping 20. Size: ICON_TILE_SIZE wide × TOGGLE_BUTTON_HEIGHT tall. Background rgba(255,255,255,0.08), border rgba(255,255,255,0.12). AnimatePresence mode="wait" for arrow swap: ArrowLeft when open (key="left": initial rotate 90, animate rotate 0, exit rotate -90), ArrowRight when closed (key="right": initial rotate -90, animate rotate 0, exit rotate 90). Duration 0.18s each.`,

  Cursor: `File: \`components-workspace/glass-sidebar/index.tsx\`

- Export \`GlassSidebar\` as named function, \`'use client'\` at top
- Imports: useState, useEffect from react; motion, useSpring, AnimatePresence from framer-motion; House, MagnifyingGlass, Folders, Bell, ChartLine, Gear, User, ArrowRight, ArrowLeft from @phosphor-icons/react

**Constants**
- SQUIRCLE_PATH: iOS squircle SVG path for objectBoundingBox clipPath — \`M0.5 0C0.7413 0 0.8559 0 0.9227 0.0773C1 0.1441 1 0.2587 1 0.5C1 0.7413 1 0.8559 0.9227 0.9227C0.8559 1 0.7413 1 0.5 1C0.2587 1 0.1441 1 0.0773 0.9227C0 0.8559 0 0.7413 0 0.5C0 0.2587 0 0.1441 0.0773 0.0773C0.1441 0 0.2587 0 0.5 0Z\`
- COLLAPSED_WIDTH = 64, EXPANDED_WIDTH = 220, ICON_TILE_SIZE = 44, TOGGLE_BUTTON_HEIGHT = 36
- NAV_ITEMS as const: [{icon: House, label: 'Home', color: '#3A86FF'}, {icon: MagnifyingGlass, label: 'Search', color: '#B388FF'}, {icon: Folders, label: 'Projects', color: '#FFBE0B'}, {icon: Bell, label: 'Notifications', color: '#FF5C8A'}, {icon: ChartLine, label: 'Analytics', color: '#06D6A0'}, {icon: Gear, label: 'Settings', color: '#C9A96E'}, {icon: User, label: 'Profile', color: '#FF7B54'}]
- GLASS_STYLE: {background:'rgba(255,255,255,0.06)', backdropFilter:'blur(24px) saturate(1.8)', WebkitBackdropFilter:'blur(24px) saturate(1.8)', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'}

**NavItemRow sub-component** — item, index, isActive, isOpen, onActivate props
- Local hover state via useState + onMouseEnter/onMouseLeave (NOT whileHover — prevents stuck state)
- useEffect: reset hover to false when isOpen changes
- Tooltip (AnimatePresence): only when !isOpen && hovered; glass pill absolute left-[calc(100%+10px)]; animate opacity+x, duration 0.15s
- motion.button: animate={{ scale: hovered ? (isOpen ? 1.08 : 1.15) : 1, x: hovered ? (isOpen ? 0 : 3) : 0 }}, whileTap scale 0.90; spring stiffness 320 damping 20
- Icon tile: 44×44 div, clipPath url(#squircle-sidebar); active gradient color+ff→color+cc, inactive color+cc→color+66 at 145deg; active drop-shadow color+88 10px, inactive color+44 4px; gloss overlay top half only
- Label (AnimatePresence, isOpen): enter opacity 0→1 x -8→0 delay 0.18+index*0.03s duration 0.18 easeOut; exit opacity→0 x→-6 duration 0.08 easeIn delay 0

**GlassSidebar**
- State: isOpen (false), activeIndex (0)
- widthSpring = useSpring(64, {stiffness:280, damping:26}); toggle() flips isOpen + sets spring to 220 or 64
- Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950
- Zero-size SVG defines clipPath id="squircle-sidebar" clipPathUnits="objectBoundingBox"
- Background img: absolute inset-0 object-cover opacity-60, src https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png
- Anchor div width=220 flex items-center justify-start
  - motion.div: style={{width:widthSpring, ...GLASS_STYLE}}, initial x:-20 opacity:0, animate x:0 opacity:1, spring stiffness 200 damping 22 delay 0.1, rounded-3xl overflow-visible
    - 7× NavItemRow
    - Divider: height 1 rgba(255,255,255,0.1)
    - Toggle motion.button: 44×36px, glass bg, whileHover scale 1.08, whileTap 0.90; spring stiffness 300 damping 20
      - AnimatePresence mode="wait": ArrowLeft key="left" (open) and ArrowRight key="right" (closed), each with initial/exit rotate ±90°, duration 0.18s`,
}
