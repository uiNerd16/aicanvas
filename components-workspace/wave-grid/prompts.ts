import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a full-size canvas component called WaveGrid. It draws a 2D grid of lines that continuously wave and warp toward the cursor.

How it works:
- Place grid control points every 32px across the canvas (centered with fractional offsets so the grid is always centred)
- Each frame, displace every point using layered sine/cosine waves based on its rest position and a slowly advancing time value (increment by 0.008 per frame)
- When the cursor is near a point, add a Gaussian pull that attracts the point toward the cursor (max 24px pull, 180px radius, falls off with exp(-dist² / (radius² × 0.5)))
- Draw all horizontal lines by connecting displaced points across each row, then all vertical lines by connecting displaced points down each column
- Lines are thin (0.5px), semi-transparent white on dark (#110F0C background) or semi-transparent near-black on light (#F5F1EA background)
- Support dark and light mode. Show a centred label "Wave Grid" and a small hint "hover to warp"
- Use requestAnimationFrame, cancel it on unmount, use ResizeObserver to rebuild the grid when the container resizes`,

  Bolt: `Build a React canvas component (WaveGrid) that renders an animated warped grid.

Technical spec:
- Canvas fills 100% of parent; set canvas.width/height using devicePixelRatio for crisp rendering
- Grid: control points every SPACING=32px, centred with ox=(cw%SPACING)/2, oy=(ch%SPACING)/2
- Animation: increment t by 0.008 each RAF frame
- Displacement per point (rx, ry):
    wx = BASE_AMP*(sin(rx*0.04+t) + sin(ry*0.025+t*1.4)*0.6)
    wy = BASE_AMP*(cos(ry*0.04+t*1.2) + cos(rx*0.03+t*0.8)*0.6)
  where BASE_AMP=5
- Cursor pull (Gaussian):
    pull = HOVER_AMP * exp(-dist² / (RADIUS²*0.5))   // HOVER_AMP=24, RADIUS=180
    px = -(dx/dist)*pull,  py = -(dy/dist)*pull
  (skip if dist² > RADIUS²*4 for perf)
- Rendering: ctx.strokeStyle = rgba(r,g,b,lineA) with lineA=0.18 dark / 0.28 light, lineWidth=0.5
  Draw H-lines per row (ctx.beginPath → moveTo displaced(0,r) → lineTo displaced(c,r) for c=1..cols) then V-lines per col
- Theme: isDarkRef + MutationObserver on document.documentElement + [data-card-theme] wrapper
- Cleanup: cancelAnimationFrame + ResizeObserver.disconnect`,

  Lovable: `I want an animated canvas background called WaveGrid. Imagine a grid of lines that breathe and ripple like fabric in a gentle breeze — and when you hover, the grid is pulled toward your cursor like a magnetic field.

The grid is made of horizontal and vertical lines drawn through control points spaced 32px apart. Each point oscillates slightly using overlapping sine waves (the animation advances slowly over time). When you move your mouse over the canvas, the nearest grid points are pulled toward your cursor with a smooth Gaussian falloff — the effect peaks at 24px displacement and fades out over a 180px radius.

Style: thin semi-transparent lines (0.5px stroke), very dark background (#110F0C) in dark mode and warm off-white (#F5F1EA) in light mode. Both modes should look elegant. Show a centred "Wave Grid" label and "hover to warp" hint.

Wire up mouse/touch events so mobile users also see the warp effect. The grid should rebuild itself if the container is resized.`,

  'Claude Code': `Create components-workspace/wave-grid/index.tsx — a 'use client' React component that renders an animated warped grid on a <canvas>.

Constants:
  SPACING=32, BASE_AMP=5, HOVER_AMP=24, RADIUS=180
  LINE_A_DARK=0.18, LINE_A_LIGHT=0.28

Refs: containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>, mouseRef<{x,y}|null>, isDarkRef<boolean>
State: isDark (boolean, default true)

Theme detection (useEffect):
  Check el.closest('[data-card-theme]') first, then document.documentElement for .dark class.
  MutationObserver on both; update isDarkRef.current and setIsDark.

Canvas useEffect (runs once):
  let cols, rows, cw, ch, ox, oy: number
  let t=0, animId=0, alive=true

  build(): read getBoundingClientRect, set canvas.width/height with dpr, ctx.setTransform(dpr,...),
    compute cols=floor(cw/SPACING)+2, rows=floor(ch/SPACING)+2, ox=(cw%SPACING)/2, oy=(ch%SPACING)/2

  frame():
    t += 0.008; clearRect
    displaced(c,r): [number,number] — rest pos (ox+c*SPACING, oy+r*SPACING) + layered sine offsets + Gaussian cursor pull
      wx = BASE_AMP*(sin(rx*0.04+t) + sin(ry*0.025+t*1.4)*0.6)
      wy = BASE_AMP*(cos(ry*0.04+t*1.2) + cos(rx*0.03+t*0.8)*0.6)
      pull = HOVER_AMP*exp(-dist²/(RADIUS²*0.5)), guard dist²<RADIUS²*4
    Draw H-lines: for each row r, beginPath → moveTo displaced(0,r) → lineTo displaced(c,r) c=1..cols-1 → stroke
    Draw V-lines: for each col c, beginPath → moveTo displaced(c,0) → lineTo displaced(c,r) r=1..rows-1 → stroke
    strokeStyle=rgba(dotRGB, lineA), lineWidth=0.5
    requestAnimationFrame(frame)

  ResizeObserver on canvas.parentElement calls build; cleanup cancels RAF and disconnects RO.

JSX: outer div with containerRef, bg=#110F0C dark / #F5F1EA light, onMouseMove/Leave/TouchMove/End updating mouseRef.
  canvas absolute inset-0 100% width/height.
  Centred label overlay: "Wave Grid" (22px 700 weight) + "hover to warp" hint (11px 600 uppercase).
  No 'any' types. Export: export function WaveGrid()`,

  Cursor: `// components-workspace/wave-grid/index.tsx
// Animated warped grid — horizontal + vertical lines through displaced control points

'use client'

/**
 * CONSTANTS
 * SPACING      = 32   // grid point interval (px)
 * BASE_AMP     = 5    // passive wave amplitude (px)
 * HOVER_AMP    = 24   // cursor pull peak (px)
 * RADIUS       = 180  // Gaussian influence radius (px)
 * LINE_A_DARK  = 0.18
 * LINE_A_LIGHT = 0.28
 *
 * ARCHITECTURE
 * - useRef: containerRef (div), canvasRef (canvas), mouseRef ({x,y}|null), isDarkRef (bool)
 * - useState: isDark for background/label colors
 * - Theme useEffect: MutationObserver checks [data-card-theme] wrapper then <html class="dark">
 * - Canvas useEffect (once):
 *     Variables: cols, rows, cw, ch, ox, oy, t=0, animId, alive=true
 *     build(): resize canvas with dpr, recompute cols/rows/ox/oy
 *     frame():
 *       t += 0.008
 *       displaced(c,r) → [x,y]: rest pos + sine waves + Gaussian cursor pull
 *         wx = BASE_AMP*(sin(rx*0.04+t) + sin(ry*0.025+t*1.4)*0.6)
 *         wy = BASE_AMP*(cos(ry*0.04+t*1.2) + cos(rx*0.03+t*0.8)*0.6)
 *         pull = HOVER_AMP*exp(-dist²/(RADIUS²*0.5)), skip if dist²>RADIUS²*4
 *       H-lines: per row r → beginPath, moveTo displaced(0,r), lineTo displaced(c,r) for c=1..cols-1, stroke
 *       V-lines: per col c → beginPath, moveTo displaced(c,0), lineTo displaced(c,r) for r=1..rows-1, stroke
 *       strokeStyle = rgba(255,255,255|28,25,22, lineA), lineWidth = 0.5
 *       RAF → frame
 *     ResizeObserver → build; cleanup: cancelAnimationFrame + RO.disconnect
 *
 * JSX:
 *   <div ref=containerRef style={{background: isDark ? '#110F0C' : '#F5F1EA'}} mouse/touch handlers>
 *     <canvas ref=canvasRef absolute inset-0 100%×100% />
 *     <div pointer-events-none centered>
 *       <span>"Wave Grid" 22px 700</span>
 *       <span>"hover to warp" 11px 600 uppercase</span>
 *     </div>
 *   </div>
 *
 * Export: export function WaveGrid()
 * No 'any'. No dark: Tailwind variants inside (fixed dark bg is always sand-950).
 */
`,
}
