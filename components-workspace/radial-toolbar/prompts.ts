import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
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

  Bolt: `Build a React + TypeScript component called RadialToolbar using Framer Motion and @phosphor-icons/react.

## Geometry constants
\`\`\`ts
const CX = 110, CY = 110   // SVG center
const R_IN  = 34            // inner radius (center button hole)
const R_OUT = 104           // outer edge
const R_ICON = 71           // icon placement radius
const GAP   = 2.5           // degrees gap on each side of each wedge
\`\`\`

## Tools (8 items, 45° each)
Bold, Italic, Underline, Link, Strikethrough, Color, Align, Copy
Icons from @phosphor-icons/react: TextBolder, TextItalic, TextUnderline, LinkSimple, TextStrikethrough, Palette, TextAlignLeft, Clipboard

## wedgePath(startDeg, endDeg) function
Convert each angle to radians with (deg - 90) * PI/180.
Use GAP offset. Compute 4 corner points on R_IN and R_OUT arcs.
Return SVG path string: M → L → A (outer arc, sweep-flag 1) → L → A (inner arc, sweep-flag 0) → Z

## State: open(bool), hoveredId(string|null), activeId(string|null)

## Layout
- Root: flex h-full w-full items-center justify-center bg-zinc-950 relative
- AnimatePresence mode="wait" between trigger and menu

Trigger (key="trigger"): white button 56×56 rounded-full, spring scale in/out, List icon
Menu (key="menu"): relative div 220×220, spring scale in/out

Inside menu:
1. SVG 220×220 absolute inset-0: 8 motion.path wedges
   - initial opacity:0, animate opacity:1, stagger delay i*0.03
   - fill: active=#d4d4d8, hovered=#e4e4e7, default=#f4f4f5 (CSS transition)
   - onMouseEnter/Leave → hoveredId; onClick → toggleActiveId
2. 8 icon divs, pointerEvents:none, positioned at iconXY(i*45+22.5)
   - spring scale+opacity, delay i*0.03+0.05
   - icon color: active=#7c3aed, default=#27272a
3. Center button: 56px white circle, zIndex 10, spring scale delay 0.08s, onClick closes

Tooltip: AnimatePresence span below menu (top: calc(50% + 130px)), fades in on hover`,

  Lovable: `I'd love a RadialToolbar component that feels like a magical text editor floating menu! ✨

Here's the experience: you see a clean white circular button sitting on a dark background. Click it, and it blooms open into a beautiful circular wheel — 8 pie-slice wedges arranged around a central close button, each containing a text editing icon.

The wheel should feel alive: the wedges fade in with a slight stagger (so they appear one by one), and the icons pop in with a springy scale animation. It should feel like a flower blooming open.

The 8 tools are for text editing: Bold, Italic, Underline, Link, Strikethrough, Color/palette, Text Alignment, and Copy. Each lives in its own wedge slice.

Interactions:
- Hovering a wedge: it gets slightly darker with a smooth transition, and a label tooltip appears below the wheel
- Clicking a wedge: it turns active (deeper grey), and the icon color turns violet to show it's selected. Click again to deactivate.
- The center has an X button — clicking it collapses the whole wheel back into the single trigger button with a satisfying spring animation

Style: white/zinc wedges on dark zinc-950 background. Small gaps between wedges let the dark bg show through like dividing lines. Use @phosphor-icons/react with duotone weight. Framer Motion for all animations.`,

  'Claude Code': `File: components-workspace/radial-toolbar/index.tsx
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

  Cursor: `// components-workspace/radial-toolbar/index.tsx
// RadialToolbar — circular radial menu for text editing
// 'use client' + Framer Motion + @phosphor-icons/react + TypeScript

// SVG circle 220×220, center (110,110)
// R_IN=34, R_OUT=104, R_ICON=71, GAP=2.5deg per edge
// 8 wedges × 45° each, stagger open/close animations

// State: open(bool), hoveredId(string|null), activeId(string|null)

// wedgePath(startDeg, endDeg): SVG donut-wedge path string
//   toRad = (deg-90)*PI/180, apply GAP offset
//   corners: (R_IN@start), (R_OUT@start), (R_OUT@end), (R_IN@end)
//   path: M→L→Arc(R_OUT,sweep=1)→L→Arc(R_IN,sweep=0)→Z

// iconXY(midDeg): {x,y} at R_ICON from center

// TOOLS: 8 items with id, label, Icon (PhosphorIcon type)
//   TextBolder,TextItalic,TextUnderline,LinkSimple,
//   TextStrikethrough,Palette,TextAlignLeft,Clipboard

// AnimatePresence mode="wait":
//   trigger = white button 56×56, List icon, spring(400,26)
//   menu = div 220×220 spring(320,26) containing:
//     SVG: 8 motion.path wedges, opacity stagger i*0.03
//          fill changes via CSS transition (not Framer Motion)
//          hover=#e4e4e7, active=#d4d4d8, default=#f4f4f5
//     Icons: 8 motion.div pointerEvents:none, spring scale+opacity i*0.03+0.05
//            active icon color=#7c3aed, default=#27272a
//     Center X: motion.button 56px white, spring delay:0.08, onClick→close

// Tooltip: AnimatePresence span at top:calc(50%+130px) for hoveredId label`,
}
