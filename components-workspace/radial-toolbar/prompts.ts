import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `File: components-workspace/radial-toolbar/index.tsx
Export: \`export function RadialToolbar()\`

## Geometry
\`\`\`ts
const CX=110, CY=110, R_IN=34, R_OUT=104, R_ICON=71, GAP=2.5
const toRad = (deg: number) => (deg - 90) * (Math.PI / 180)

function wedgePath(startDeg: number, endDeg: number): string {
  const s = toRad(startDeg + GAP), e = toRad(endDeg - GAP)
  // compute (x1,y1) on R_IN at s, (x2,y2) on R_OUT at s,
  // (x3,y3) on R_OUT at e, (x4,y4) on R_IN at e
  // return: M x1 y1 L x2 y2 A R_OUT R_OUT 0 0 1 x3 y3 L x4 y4 A R_IN R_IN 0 0 0 x1 y1 Z
}

function iconXY(midDeg: number) { /* R_ICON at midDeg */ }
\`\`\`

## Tools (type uses PhosphorIcon from '@phosphor-icons/react')
8 tools: bold/TextBolder, italic/TextItalic, underline/TextUnderline, link/LinkSimple,
strike/TextStrikethrough, color/Palette, align/TextAlignLeft, copy/Clipboard

## State: open(bool), hoveredId(string|null), activeId(string|null)

## JSX structure
Root: div.relative.flex.h-full.w-full.items-center.justify-center.bg-zinc-950

AnimatePresence mode="wait":
  key="trigger": motion.button white 56×56 rounded-full, spring(400,26) scale in/out, List icon
  key="menu": motion.div relative 220×220, spring(320,26) scale in/out, containing:
    1. svg.absolute.inset-0 220×220:
       8× motion.path(wedge) initial opacity:0 animate opacity:1 delay i*0.03
       style.fill: CSS transition between #f4f4f5/#e4e4e7/#d4d4d8
       onMouseEnter/Leave→hoveredId, onClick→toggleActiveId
    2. 8× motion.div for icons, pointerEvents:none
       position: left:x-12 top:y-12, size 24×24
       spring(450,22) scale+opacity, delay i*0.03+0.05
       PhosphorIcon size=17 weight="duotone" color active=#7c3aed else #27272a
    3. motion.button center: absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
       56×56 white rounded-full zIndex:10 spring scale delay:0.08, onClick→close

AnimatePresence tooltip below menu: top calc(50%+130px), zinc-400 text-xs`,

  V0: `Create a RadialToolbar component — a circular radial menu for text editing that works in two states.

Collapsed state: a single white circular button (56×56px) with a hamburger/list icon centered on a dark background. Clicking it opens the radial menu.

Expanded state: a 220×220px circular wheel divided into 8 equal pie slices (45° each). Each slice is a light grey wedge shape with a small angular gap between slices so the dark background shows through as separators. In the center is a white circular close button (56px) with an X icon. Clicking any wedge activates it (icon turns violet), clicking again deactivates. Clicking the center X collapses back to the trigger button.

The 8 text editing tools (placed clockwise from top): Bold, Italic, Underline, Link, Strikethrough, Color, Align, Copy — each with its corresponding icon centered in its wedge.

Hover behavior: wedge fill darkens slightly, a tooltip label appears below the wheel.
Active behavior: wedge fill changes to zinc-300, icon color changes to violet-600.

Animations (all Framer Motion):
- Trigger button: spring scale in/out
- Wheel: spring scale from 0→1 on open, 1→0 on close
- Each wedge: stagger opacity fade-in (30ms per wedge)
- Each icon: stagger scale + opacity spring (offset 50ms after wedge)
- Center button: spring scale with 80ms delay

Use @phosphor-icons/react with weight="duotone" for all icons. Dark background (bg-zinc-950).`,
}
