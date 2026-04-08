import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a full-size canvas component called DistortionGrid. It draws a 2D grid of horizontal and vertical lines that continuously distort with large sweeping waves. Hovering pushes the grid outward from the cursor and amplifies the waves across the entire canvas.

How it works:
- Place grid control points every SPACING=32px across the canvas (centred with fractional offsets so the grid is always centred)
- Each frame, displace every point using layered low-frequency sine/cosine waves based on its rest position and a slowly advancing time value (t += 0.002 per frame — very slow)
- Two layered waves drive horizontal displacement and another two drive vertical displacement (WAVE_FREQ=0.007, ~900px wavelength → only 1–2 visible undulations across the canvas at any moment)
- Cursor repulsion: when the cursor is near a point, push that point AWAY from the cursor with a Gaussian falloff (LOCAL_AMP=60px peak, LOCAL_RADIUS=260px). Skip the math entirely if dist² > LOCAL_RADIUS²×4 for performance.
- Global hover boost: when the cursor is anywhere on the canvas, lerp a hoverStr value toward 1 (×0.018 per frame), and toward 0 on leave (×0.010). Multiply the base amplitude by (1 + hoverStr × HOVER_BOOST=1.5) so the entire canvas's waves grow ~2.5× when hovered.
- Draw all horizontal lines by connecting displaced points across each row (one beginPath per row), then all vertical lines by connecting displaced points down each column (one beginPath per col)
- Lines: 0.5px stroke, opacity 0.55 on dark (#110F0C background) or 0.75 on light (#F5F1EA background)
- Support dark and light mode. Show a centred label "Distortion Grid" and a small hint "hover to warp"
- Use requestAnimationFrame, cancel on unmount, ResizeObserver to rebuild on resize`,

  Bolt: `Build a React canvas component (DistortionGrid) that renders a 2D grid distorted by layered sweeping waves and cursor repulsion.

Technical spec:
- Canvas fills 100% of parent; set canvas.width/height using devicePixelRatio for crisp rendering
- Grid: cols = floor(cw/SPACING)+2, rows = floor(ch/SPACING)+2, SPACING=32, ox=(cw%SPACING)/2, oy=(ch%SPACING)/2
- Animation: t += 0.002 per RAF frame (very slow)
- Global hover lerp: hoverStr += ((hasHover?1:0) - hoverStr) * (hasHover?0.018:0.010)
- Amplitude: amp = BASE_AMP * (1 + hoverStr * HOVER_BOOST)   BASE_AMP=30, HOVER_BOOST=1.5
- Displacement per point at rest position (rx, ry):
    wx = amp * (sin(rx*WAVE_FREQ + t) + sin(ry*WAVE_FREQ*0.6 + t*1.3)*0.55)
    wy = amp * (cos(ry*WAVE_FREQ*0.8 + t*1.15) + cos(rx*WAVE_FREQ*0.5 + t*0.75)*0.55)
  WAVE_FREQ=0.007 (low — only 1–2 visible undulations)
- Cursor repulsion (Gaussian, away from cursor):
    push = LOCAL_AMP * exp(-dist² / (LOCAL_RADIUS²*0.5))   LOCAL_AMP=60, LOCAL_RADIUS=260
    px = (dx/dist)*push, py = (dy/dist)*push   (dx=rx-mx, dy=ry-my; skip if dist² > LOCAL_RADIUS²*4)
- Final point: (rx + wx + px, ry + wy + py)
- Rendering: ctx.strokeStyle = rgba(255,255,255,0.55) dark / rgba(28,25,22,0.75) light, lineWidth=0.5
  Draw H-lines per row (beginPath → moveTo displaced(0,r) → lineTo displaced(c,r) for c=1..cols-1) then V-lines per col (beginPath → moveTo displaced(c,0) → lineTo displaced(c,r) for r=1..rows-1)
- Theme: isDarkRef + MutationObserver on document.documentElement + [data-card-theme] wrapper
- Cleanup: cancelAnimationFrame + ResizeObserver.disconnect`,

  Lovable: `I want an animated canvas background called DistortionGrid. Imagine a grid of thin lines drifting through long, sweeping waves — only 1 or 2 undulations visible across the whole canvas at any moment, like watching the surface of slow water from above. When you hover, two things happen at once: the entire field's waves grow ~2.5× deeper, AND the lines closest to your cursor are pushed outward, leaving a calm void around the pointer.

The grid is made of horizontal and vertical lines drawn through control points spaced 32px apart. Each point oscillates with overlapping low-frequency sine waves (the animation advances very slowly — t += 0.002 per frame). When you move your mouse over the canvas, points within a 260px radius are pushed AWAY from the cursor with a Gaussian falloff, peaking at 60px of displacement at the centre. At the same time, the global wave amplitude lerps from its resting value of 30 up to 75 (×2.5).

Style: thin semi-transparent lines (0.5px stroke, 0.55 alpha on dark, 0.75 on light), very dark background (#110F0C) in dark mode and warm off-white (#F5F1EA) in light mode. Both modes should look elegant. Show a centred "Distortion Grid" label and "hover to warp" hint.

Wire up mouse/touch events so mobile users also see the warp effect. The grid should rebuild itself if the container is resized.`,

  'Claude Code': `Create components-workspace/distortion-grid/index.tsx — a 'use client' React component that renders an animated distorted grid on a <canvas>.

Constants:
  SPACING=32, BASE_AMP=30, WAVE_FREQ=0.007
  HOVER_BOOST=1.5, LOCAL_AMP=60, LOCAL_RADIUS=260
  LINE_A_DARK=0.55, LINE_A_LIGHT=0.75

Refs: containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>, mouseRef<{x,y}|null>, isDarkRef<boolean>
State: isDark (boolean, default true)

Theme detection (useEffect):
  Check el.closest('[data-card-theme]') first, then document.documentElement for .dark class.
  MutationObserver on both; update isDarkRef.current and setIsDark.

Canvas useEffect (runs once):
  let cols, rows, cw, ch, ox, oy: number
  let t=0, animId=0, alive=true, hoverStr=0

  build(): read getBoundingClientRect, set canvas.width/height with dpr, ctx.setTransform(dpr,...),
    cols=floor(cw/SPACING)+2, rows=floor(ch/SPACING)+2, ox=(cw%SPACING)/2, oy=(ch%SPACING)/2

  frame():
    t += 0.002
    hoverStr lerp: += ((hasHover?1:0) - hoverStr) * (hasHover?0.018:0.010)
    amp = BASE_AMP * (1 + hoverStr * HOVER_BOOST)
    strokeStyle = rgba(dotRGB, lineA), lineWidth = 0.5

    displaced(c, r): [number, number]
      rx = ox + c*SPACING
      ry = oy + r*SPACING
      wx = amp * (sin(rx*WAVE_FREQ + t) + sin(ry*WAVE_FREQ*0.6 + t*1.3)*0.55)
      wy = amp * (cos(ry*WAVE_FREQ*0.8 + t*1.15) + cos(rx*WAVE_FREQ*0.5 + t*0.75)*0.55)
      dx = rx - mx, dy = ry - my, dist² = dx² + dy²
      if dist² < LOCAL_RADIUS²*4:
        push = LOCAL_AMP * exp(-dist²/(LOCAL_RADIUS²*0.5))
        dist = sqrt(dist²) || 1
        px = (dx/dist)*push, py = (dy/dist)*push
      else px=py=0
      return [rx+wx+px, ry+wy+py]

    Draw H-lines: for each row r → beginPath → moveTo displaced(0,r) → lineTo displaced(c,r) c=1..cols-1 → stroke
    Draw V-lines: for each col c → beginPath → moveTo displaced(c,0) → lineTo displaced(c,r) r=1..rows-1 → stroke
    requestAnimationFrame(frame)

  ResizeObserver on canvas.parentElement → build; cleanup: cancelAnimationFrame + RO.disconnect.

JSX: outer div with containerRef, bg=#110F0C dark / #F5F1EA light, onMouseMove/Leave/TouchMove/End updating mouseRef.
  canvas absolute inset-0 100% width/height.
  Centred label overlay: "Distortion Grid" (22px 700 weight) + "hover to warp" hint (11px 600 uppercase).
  No 'any' types. Export: export function DistortionGrid()`,

  Cursor: `// components-workspace/distortion-grid/index.tsx
// Animated distorted grid — H+V lines through displaced control points, with cursor repulsion + global hover boost

'use client'

/**
 * CONSTANTS
 * SPACING      = 32    // grid point interval (px)
 * BASE_AMP     = 30    // resting wave amplitude (px)
 * WAVE_FREQ    = 0.007 // low frequency → ~900px wavelength (1–2 visible undulations)
 * HOVER_BOOST  = 1.5   // amplitude multiplier on full hover (waves grow ~2.5×)
 * LOCAL_AMP    = 60    // cursor repulsion peak (px) — pushes lines AWAY
 * LOCAL_RADIUS = 260   // Gaussian repulsion radius (px)
 * LINE_A_DARK  = 0.55
 * LINE_A_LIGHT = 0.75
 *
 * ARCHITECTURE
 * - useRef: containerRef (div), canvasRef (canvas), mouseRef ({x,y}|null), isDarkRef (bool)
 * - useState: isDark for background/label colors
 * - Theme useEffect: MutationObserver checks [data-card-theme] wrapper then <html class="dark">
 * - Canvas useEffect (once):
 *     Variables: cols, rows, cw, ch, ox, oy, t=0, animId, alive=true, hoverStr=0
 *     build(): resize canvas with dpr, recompute cols/rows/ox/oy
 *     frame():
 *       t += 0.002
 *       hoverStr lerp: attack 0.018, release 0.010
 *       amp = BASE_AMP * (1 + hoverStr * HOVER_BOOST)
 *       displaced(c,r) → [x,y]: rest pos + layered low-freq sine waves + Gaussian cursor repulsion
 *         wx = amp*(sin(rx*WAVE_FREQ + t) + sin(ry*WAVE_FREQ*0.6 + t*1.3)*0.55)
 *         wy = amp*(cos(ry*WAVE_FREQ*0.8 + t*1.15) + cos(rx*WAVE_FREQ*0.5 + t*0.75)*0.55)
 *         push = LOCAL_AMP*exp(-dist²/(LOCAL_RADIUS²*0.5)), skip if dist²>LOCAL_RADIUS²*4
 *         px = (dx/dist)*push, py = (dy/dist)*push    // AWAY from cursor
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
 *       <span>"Distortion Grid" 22px 700</span>
 *       <span>"hover to warp" 11px 600 uppercase</span>
 *     </div>
 *   </div>
 *
 * Export: export function DistortionGrid()
 * No 'any'. No dark: Tailwind variants inside (fixed dark bg is always sand-950).
 */
`,
}
