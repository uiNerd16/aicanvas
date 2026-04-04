import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create an interactive X Grid background component in React. It fills its container with a grid of × marks drawn on an HTML canvas. When you hover over the canvas, the × marks near your cursor light up with a smooth, organic glow that fades out as you move away.

The grid uses 20px spacing between each × mark centre. The hover influence radius is 130px. Each × has a resting opacity of 0.13 and peaks at 0.92 when fully illuminated.

Each × mark is drawn with canvas stroke operations: two diagonal lines crossing at the mark's centre. At rest, each arm is 3px long and the stroke is 1px wide. When lit, the arm grows to 4.5px and the stroke reaches 1.8px. The animation uses a fast attack (lerp factor 0.16) and a slow release (0.07) so the effect feels fluid.

The component detects dark/light mode by checking for a [data-card-theme] wrapper element first, then falls back to the document's class. In dark mode the background is #110F0C and marks are white. In light mode the background is #F5F1EA and marks are #1C1916.

A centred label overlay shows "X Grid" (22px, bold) and "hover to illuminate" (11px, uppercase, wide tracking) in semi-transparent text. Touch events are supported alongside mouse events.`,

  Bolt: `Build a React component called XGrid that renders an interactive canvas-based × mark grid.

Setup:
- 'use client' directive
- useRef for canvas, container, mouse position, and isDark (for sync-safe canvas reads)
- useState + MutationObserver for theme detection via [data-card-theme] attribute, falling back to document.documentElement
- ResizeObserver on canvas.parentElement to rebuild the grid on resize

Grid config:
- SPACING = 20px, RADIUS = 130px, BASE_A = 0.13, PEAK_A = 0.92

Mark rendering (per × in the rAF loop):
  const arm = 3 + d.b * 1.5   // 3px resting, 4.5px fully lit
  const sw  = 1 + d.b * 0.8   // 1px resting, 1.8px fully lit
  const alpha = BASE_A + (PEAK_A - BASE_A) * d.b
  ctx.strokeStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
  ctx.lineWidth = sw
  ctx.beginPath()
  ctx.moveTo(d.x - arm, d.y - arm)
  ctx.lineTo(d.x + arm, d.y + arm)
  ctx.moveTo(d.x + arm, d.y - arm)
  ctx.lineTo(d.x - arm, d.y + arm)
  ctx.stroke()

Reset ctx.lineWidth = 1 at the top of each frame before the mark loop.

Brightness lerp:
  d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b)
  if (d.b < 0.004) d.b = 0

DPR: use ctx.setTransform(dpr, 0, 0, dpr, 0, 0) after resizing.

Backgrounds: dark → #110F0C, light → #F5F1EA. Mark color: dark → '255,255,255', light → '28,25,22'.

Label overlay (pointer-events-none, centered): "X Grid" at 22px/700 weight and "hover to illuminate" at 11px/600/uppercase/0.12em tracking. Both semi-transparent matching the theme.

Export as: export function XGrid()`,

  Lovable: `I want an interactive canvas component where the background is covered in a grid of tiny × marks that light up as you move your mouse over them.

Each × should glow brighter and grow slightly as my cursor passes nearby — like illuminating a field of crosses. The effect should feel smooth: fast to light up, slow to fade back.

Design details:
- Grid spacing: 20px between each × centre
- Hover radius: 130px — marks inside this circle respond to the cursor
- At rest: each × is faint (opacity 0.13) with 3px arms and 1px stroke
- When lit: opacity rises to 0.92, arms extend to 4.5px, stroke thickens to 1.8px
- Animation: quick attack (lerp 0.16), gentle release (0.07)

Theme-aware: dark mode uses a near-black background (#110F0C) with white marks; light mode uses an off-white background (#F5F1EA) with near-black marks (#1C1916). Theme is read from a [data-card-theme] class wrapper if present, otherwise from the document.

A subtle centered label reads "X Grid" with a smaller "hover to illuminate" hint below it — both in semi-transparent text that matches the current theme.

The component should also work on touch devices.`,

  'Claude Code': `Create components-workspace/x-grid/index.tsx with 'use client' at the top.

Export: export function XGrid()

Constants:
  const SPACING = 20
  const RADIUS  = 130
  const BASE_A  = 0.13
  const PEAK_A  = 0.92

Refs: containerRef (div), canvasRef (canvas), mouseRef ({ x, y } | null), isDarkRef (boolean, init true)
State: isDark (boolean, init true)

Theme effect (runs once):
  - el.closest('[data-card-theme]') → check .dark class → setIsDark + isDarkRef.current
  - MutationObserver on document.documentElement { attributes, attributeFilter: ['class'] }
  - Also observe cardWrapper if found
  - Cleanup: observer.disconnect()

Canvas effect (runs once):
  type Mark = { x: number; y: number; b: number }

  build():
    - dpr = window.devicePixelRatio || 1
    - getBoundingClientRect → cw, ch
    - canvas.width/height = Math.round(cw/ch * dpr)
    - ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    - Populate marks: offset centred grid, SPACING gap

  frame():
    - Guard: if (!alive) return
    - ctx.clearRect(0, 0, cw, ch)
    - ctx.lineWidth = 1  ← reset before loop
    - mx/my from mouseRef (-99999 if null)
    - r2 = RADIUS * RADIUS
    - dotRGB: isDarkRef.current ? '255,255,255' : '28,25,22'
    - For each mark d:
        dist2 = squared distance to mouse
        tgt = dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2) / RADIUS, 1.5) : 0
        d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b)
        if (d.b < 0.004) d.b = 0
        arm = 3 + d.b * 1.5
        sw  = 1 + d.b * 0.8
        baseA = isDarkRef.current ? BASE_A : 0.25
        alpha = baseA + (PEAK_A - baseA) * d.b
        ctx.strokeStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
        ctx.lineWidth = sw
        ctx.beginPath()
        ctx.moveTo(d.x - arm, d.y - arm)
        ctx.lineTo(d.x + arm, d.y + arm)
        ctx.moveTo(d.x + arm, d.y - arm)
        ctx.lineTo(d.x - arm, d.y + arm)
        ctx.stroke()
    - animId = requestAnimationFrame(frame)

  ResizeObserver on canvas.parentElement!
  Cleanup: alive = false, cancelAnimationFrame, ro.disconnect()

updateMouse(clientX, clientY): subtract canvas getBoundingClientRect() left/top

JSX:
  - Root div: ref={containerRef}, relative h-full w-full overflow-hidden, style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
  - Events: onMouseMove, onMouseLeave (null), onTouchMove (touches[0]), onTouchEnd (null)
  - Canvas: ref={canvasRef}, absolute inset-0, style width/height 100%
  - Label div: pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2
      "X Grid" — 22px, 700, letterSpacing -0.02em
      "hover to illuminate" — 11px, 600, uppercase, letterSpacing 0.12em
  - Label colors: dark → rgba(255,255,255,0.45) / rgba(255,255,255,0.18), light → rgba(28,25,22,0.45) / rgba(28,25,22,0.22)

No any types. No TypeScript errors.`,

  Cursor: `Implement XGrid in components-workspace/x-grid/index.tsx — a canvas-based interactive × mark grid, identical in structure to an InteractiveDotGrid but replacing filled squares with stroked × marks.

Key differences from a dot grid:
1. Drawing: instead of ctx.fillRect, draw two crossing diagonal lines per mark:
     ctx.lineWidth = sw          // sw = 1 + d.b * 0.8
     ctx.beginPath()
     ctx.moveTo(d.x - arm, d.y - arm)   // arm = 3 + d.b * 1.5
     ctx.lineTo(d.x + arm, d.y + arm)
     ctx.moveTo(d.x + arm, d.y - arm)
     ctx.lineTo(d.x - arm, d.y + arm)
     ctx.stroke()
2. Reset ctx.lineWidth = 1 at the start of every frame (before the mark loop)
3. Use ctx.strokeStyle instead of ctx.fillStyle
4. Label reads "X Grid"

Everything else is identical:
- SPACING=20, RADIUS=130, BASE_A=0.13, PEAK_A=0.92
- isDarkRef pattern for theme-safe canvas reads
- Theme detection: [data-card-theme] wrapper → document.documentElement, MutationObserver
- Brightness lerp: fast attack 0.16, slow release 0.07; clamp < 0.004 to 0
- DPR: ctx.setTransform after canvas resize
- ResizeObserver on canvas.parentElement!
- Background: #110F0C dark / #F5F1EA light
- Mark color: '255,255,255' dark / '28,25,22' light
- Touch support: onTouchMove / onTouchEnd
- Label overlay: centered, pointer-events-none, semi-transparent

Export: export function XGrid()
No any types.`,
}
