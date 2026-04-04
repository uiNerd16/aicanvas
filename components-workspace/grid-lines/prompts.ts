import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create an interactive canvas component called "Grid Lines" for Next.js using Tailwind CSS and a raw HTML canvas (no Framer Motion needed — this is a canvas animation).

The component fills its container with a grid of tiny square dots spaced 20px apart. Thin lines connect every dot to its immediate horizontal and vertical neighbours, forming a full grid. The whole thing is interactive: hovering illuminates a circular zone of radius 160px around the cursor. Dots and lines inside that zone glow brighter, falling off with a smooth Gaussian-like curve. Dots outside the zone sit at a low resting opacity.

A small travelling particle rides along every illuminated grid segment. It moves from one dot to the next in a continuous loop — visible for the first 80% of its journey then invisible for the remaining 20%, creating a blink-like rhythm. The particle moves faster when the segment is brighter.

Draw order: lines first, then particles on top of lines, then dots on top of everything — so lit dots always look crisp above the glow.

The component supports two themes: dark (near-black background #110F0C, white dots/lines/particles) and light (warm cream background #F5F1EA, dark dots/lines/particles). It reads the theme from the nearest [data-card-theme] ancestor or falls back to the <html> class. A centered label reads "Grid Lines" with a smaller subtitle "hover to illuminate".`,

  Bolt: `Build a React component using a canvas render loop (requestAnimationFrame) that renders an interactive illuminated grid. No external animation libraries needed for the canvas — just a plain useEffect with RAF.

Component structure:
- containerRef on the root div, canvasRef on the canvas element, mouseRef for mouse position
- isDarkRef (useRef) updated by a MutationObserver watching [data-card-theme] ancestor or <html> for class changes
- ResizeObserver on canvas.parentElement to call build() on resize

Grid construction (build()):
- SPACING = 20px, add 2 extra cols/rows so dots bleed off all edges
- Centre the grid with offset: ox = (cw % SPACING) / 2, oy = (ch % SPACING) / 2
- Build a 2D grid array of Dot objects { x, y, b } for easy neighbour lookup
- From the grid, push { a, b, phase: Math.random() } segments for every horizontal and vertical pair

Frame loop (draw order: lines → particles → dots):
1. Update each dot's brightness b toward a target: target = pow(1 - dist/RADIUS, 1.5) when inside RADIUS=160, else 0. Attack 0.16, release 0.07.
2. For each segment: lineA = lineRestA + (PEAK_A - lineRestA) * segB where segB = (a.b + b.b) / 2. Draw 0.5px line. If segB > 0.06: advance phase += 0.018 * (0.3 + segB), modulo 1. If phase < 0.8, draw a 1.5×1.5 px particle at position lerp(a, b, phase/0.8) with opacity segB * 0.9.
3. Draw each dot as a square: size = 1 + b*1.2, alpha = baseA + (PEAK_A - baseA) * b.

Constants: SPACING=20, RADIUS=160, BASE_A=0.13, PEAK_A=0.92, LINE_A_DARK=0.07, LINE_A_LIGHT=0.12.
Dark: dotRGB='255,255,255', baseA=0.13. Light: dotRGB='28,25,22', baseA=0.25.
Background: dark=#110F0C, light=#F5F1EA.`,

  Lovable: `I'd love a component that feels like peering at a circuit board through a magnifying glass — a dense grid of glowing nodes connected by thin wires, with little sparks of light racing along the connections wherever your cursor moves.

Picture a dark near-black canvas filled edge-to-edge with a tight grid of tiny square dots, each connected to its neighbours above, below, left, and right by hairline lines. Most of the grid sits quietly at almost-invisible opacity. When you move your mouse, a soft circular glow blooms outward from your cursor — dots closest to your cursor light up brightest, fading smoothly to nothing at the edges of the halo.

The magical part: every lit connection gets a tiny travelling particle riding along it. The particle slides from one node to the next, disappears briefly at the end, then loops again — like an electron pulse in a circuit. Particles move faster when their segment is more intensely lit, so the busiest part of the grid near your cursor almost crackles with activity.

The component works beautifully in both dark mode (warm black background, white-tinted dots and lines) and light mode (warm cream background, near-black dots and lines). A soft centered label floats in the middle: "Grid Lines" with a whisper of "hover to illuminate" beneath.`,

  'Claude Code': `Create \`components-workspace/grid-lines/index.tsx\`. Export named function \`GridLines\`. Add \`'use client'\` at the top.

Constants:
\`\`\`ts
const SPACING      = 20
const RADIUS       = 160
const BASE_A       = 0.13
const PEAK_A       = 0.92
const LINE_A_DARK  = 0.07
const LINE_A_LIGHT = 0.12
\`\`\`

Types:
\`\`\`ts
type Dot     = { x: number; y: number; b: number }
type Segment = { a: Dot; b: Dot; phase: number }
\`\`\`

Refs: containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>, mouseRef<{x,y}|null>, isDarkRef<boolean> (default true), plus useState isDark for background color.

Theme detection (useEffect):
- el.closest('[data-card-theme]') — if found check .classList.contains('dark'), else check document.documentElement.classList.contains('dark')
- MutationObserver on documentElement AND on the card wrapper (if present), attributeFilter: ['class']

Canvas useEffect — local vars: dots: Dot[], hSegs: Segment[], vSegs: Segment[], animId, alive, cw, ch.

build():
- Read canvas.getBoundingClientRect() for cw/ch. Set canvas.width/height with devicePixelRatio. ctx.setTransform(dpr,0,0,dpr,0,0).
- cols = floor(cw/SPACING)+2, rows = floor(ch/SPACING)+2, ox = (cw%SPACING)/2, oy = (ch%SPACING)/2
- Build grid[r][c] = Dot objects. Push all dots to flat array. Then build hSegs (c+1 < cols) and vSegs (r+1 < rows) with phase: Math.random().

frame():
1. Update dot brightness: tgt = dist2 < r2 ? pow(1 - sqrt(dist2)/RADIUS, 1.5) : 0. b += (tgt>b ? 0.16 : 0.07)*(tgt-b). Zero out if b < 0.004.
2. allSegs = [...hSegs, ...vSegs]. For each: segB = (a.b+b.b)/2. lineA = lineRestA + (PEAK_A-lineRestA)*segB. Draw 0.5px stroke from a to b. If segB > 0.06: phase = (phase + 0.018*(0.3+segB)) % 1. If phase < 0.8: t = phase/0.8; px = a.x+(b.x-a.x)*t; py = a.y+(b.y-a.y)*t; draw 1.5×1.5 fillRect at (px-0.75, py-0.75) with alpha = segB*0.9.
3. For each dot: alpha = baseA+(PEAK_A-baseA)*d.b; sz = 1+d.b*1.2; fillRect(d.x-sz/2, d.y-sz/2, sz, sz).

Call build() then frame(). ResizeObserver on canvas.parentElement! calls build(). Cleanup: alive=false, cancelAnimationFrame, ro.disconnect().

Mouse handlers on root div: onMouseMove updates mouseRef to canvas-relative coords; onMouseLeave sets mouseRef.current=null. Same for onTouchMove/onTouchEnd.

Root div: className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
Canvas: className="absolute inset-0" style={{ width:'100%', height:'100%' }}
Centered label overlay (pointer-events-none): "Grid Lines" at fontSize 22 fontWeight 700 and "hover to illuminate" at fontSize 11 fontWeight 600 uppercase letterSpacing 0.12em. Colors: dark rgba(255,255,255,0.45)/rgba(255,255,255,0.18), light rgba(28,25,22,0.45)/rgba(28,25,22,0.22).`,

  Cursor: `File: \`components-workspace/grid-lines/index.tsx\`
- \`'use client'\`; export \`GridLines()\`
- Canvas-based RAF animation, no Framer Motion

Constants: SPACING=20, RADIUS=160, BASE_A=0.13, PEAK_A=0.92, LINE_A_DARK=0.07, LINE_A_LIGHT=0.12
Types: \`Dot = {x,y,b}\`, \`Segment = {a:Dot, b:Dot, phase:number}\`

Refs: containerRef, canvasRef, mouseRef<{x,y}|null>, isDarkRef<boolean>

Theme detection:
- Check \`el.closest('[data-card-theme]')\` for .dark class, fallback to document.documentElement
- MutationObserver on both documentElement + card wrapper, attributeFilter: ['class']

build():
- DPR-scaled canvas; cols=floor(cw/SPACING)+2, rows=floor(ch/SPACING)+2
- ox=(cw%SPACING)/2, oy=(ch%SPACING)/2 — centre the grid
- Build 2D grid[][]=Dot, flat dots[], hSegs (right neighbour) + vSegs (down neighbour), phase=Math.random()

frame() — draw order: lines → particles → dots:
1. Dot brightness: tgt=dist2<r2 ? pow(1-sqrt(dist2)/RADIUS,1.5) : 0; b+=(tgt>b?0.16:0.07)*(tgt-b); zero if <0.004
2. allSegs=[...hSegs,...vSegs]; segB=(a.b+b.b)/2; lineA=lineRestA+(PEAK_A-lineRestA)*segB; 0.5px stroke a→b
   - if segB>0.06: phase=(phase+0.018*(0.3+segB))%1
   - if phase<0.8: t=phase/0.8; draw 1.5×1.5px particle at lerp(a,b,t), alpha=segB*0.9
3. Dots: sz=1+b*1.2; alpha=baseA+(PEAK_A-baseA)*b; fillRect centered on dot

ResizeObserver on canvas.parentElement → build(); cleanup: alive=false, cancelAnimationFrame, disconnect
Mouse/touch handlers → canvas-relative coords in mouseRef; leave/end → null

Root: \`relative h-full w-full overflow-hidden\`, bg=#110F0C dark / #F5F1EA light
Canvas: \`absolute inset-0\` 100%×100%
Label overlay (pointer-events-none, centered): "Grid Lines" 22px 700wt + "hover to illuminate" 11px 600wt uppercase`,
}
