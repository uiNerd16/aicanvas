import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a full-size canvas component called WaveLines. It draws dense vertical lines that ripple across the canvas as a slow, layered sine wave — a calm primary wave plus a faster secondary wave create organic, breathing motion. Hover sends the lines into extreme waves and parts them away from the cursor.

How it works:
- Draw only vertical lines (no horizontal, no grid), one per column, spaced SPACING=32px apart
- For each line, sample points every ROW_STEP=4px vertically and connect them with quadratic curves through midpoints for buttery-smooth strokes
- Two layered sine waves drive horizontal displacement:
    wx = amp * sin(ry * FREQ_Y + rx * FREQ_X + t)
       + amp * 0.38 * sin(ry * FREQ_Y * 1.6 + rx * FREQ_X * 1.4 + t * 1.5 + 1.1)
- A small Y drift makes the lines breathe instead of just slide:
    wy = amp * 0.12 * cos(rx * FREQ_X * 0.9 + ry * FREQ_Y * 0.4 + t * 0.8)
- Constants: AMP=18, FREQ_Y=0.015, FREQ_X=0.006, t advances by 0.003 per frame (very slow)
- Stroke: 0.8px wide, opacity 0.55 on dark (#110F0C) and 0.75 on light (#F5F1EA)
- On hover: Gaussian cursor repulsion (LOCAL_AMP=58, radius=220), AND global amplitude boost of HOVER_BOOST=5× — the entire canvas erupts into deep waves. Ease in/out smoothly (attack 0.018, release 0.010).
- Support dark and light mode. Show centred label "Wave Lines" and hint "hover to fold".
- Use requestAnimationFrame, cancel on unmount, ResizeObserver to rebuild on resize.`,

  Bolt: `Build a React canvas component (WaveLines) that renders animated vertical lines rippling like a deep wave field.

Technical spec:
- Canvas fills 100% of parent; use devicePixelRatio for crisp rendering
- Lines: cols = Math.ceil(cw/SPACING)+2 columns, SPACING=32px, ox=(cw%SPACING)/2 (centred)
- Sample points: ROW_STEP=4px, rows=Math.ceil(ch/ROW_STEP)+1
- Animation: t += 0.003 per RAF frame
- X-displacement per point (rx, ry):
    wx = amp * sin(ry * FREQ_Y + rx * FREQ_X + t)
       + amp * 0.38 * sin(ry * FREQ_Y * 1.6 + rx * FREQ_X * 1.4 + t * 1.5 + 1.1)
    FREQ_Y=0.015, FREQ_X=0.006, base AMP=18
- Y-drift per point (subtle breathing):
    wy = amp * 0.12 * cos(rx * FREQ_X * 0.9 + ry * FREQ_Y * 0.4 + t * 0.8)
- Global hover amplitude: amp = AMP * (1 + hoverStr * HOVER_BOOST), HOVER_BOOST=5.0
  hoverStr lerps toward 1 when mouse present (×0.018), toward 0 on leave (×0.010)
- Cursor repulsion (Gaussian, both X and Y):
    push = LOCAL_AMP * exp(-dist² / (LOCAL_RADIUS²*0.5))   LOCAL_AMP=58, LOCAL_RADIUS=220
    px=(dx/dist)*push, py=(dy/dist)*push  (skip if dist²>LOCAL_RADIUS²*4)
- Draw smoothing: per column c → beginPath → moveTo first point → for each next point use quadraticCurveTo(prevX, prevY, midX, midY) where midX=(prevX+x)/2, midY=(prevY+y)/2 → final lineTo to last point → stroke
- strokeStyle: rgba(255,255,255,0.55) dark / rgba(28,25,22,0.75) light, lineWidth=0.8
- Theme: isDarkRef + MutationObserver on document.documentElement + [data-card-theme] wrapper
- Cleanup: cancelAnimationFrame + ResizeObserver.disconnect`,

  Lovable: `I want a canvas background component called WaveLines that looks like a deep wave field — dense vertical lines that slowly ripple and bunch.

The effect: imagine hundreds of thin vertical strands across the canvas. They all gently sway as a smooth sine wave, with each strand slightly out of phase with its neighbour. A second, faster wave layers on top of the first, and a tiny vertical drift makes the lines breathe instead of just slide. Together they produce regions where the strands compress together and regions where they spread apart, drifting slowly across the whole canvas.

When you hover, two things happen at once: the lines part away from your cursor like ripples being pushed aside, AND the entire canvas erupts — every wave grows ~5× deeper, turning the calm field into dramatic rolling waves. The effect eases in and out smoothly.

Technical details:
- Lines are spaced 32px apart, drawn as smooth curves sampled every 4px and connected with quadratic curves through midpoints
- Primary wave: displacement = 18px × sin(y×0.015 + x×0.006 + time)
- Secondary wave at 38% amplitude with shifted frequencies for organic beating
- Tiny Y-drift at 12% amplitude so the lines breathe vertically
- Time advances by 0.003 per frame — very slow
- Lines are semi-transparent (55% dark / 75% light), 0.8px thick

Support dark (#110F0C) and light (#F5F1EA) themes. Show a centred "Wave Lines" label and "hover to fold" hint.`,

  'Claude Code': `Create components-workspace/wave-lines/index.tsx — a 'use client' React component rendering animated vertical wave lines on <canvas>.

Constants:
  SPACING=32, ROW_STEP=4, AMP=18
  FREQ_Y=0.015, FREQ_X=0.006
  HOVER_BOOST=5.0, LOCAL_AMP=58, LOCAL_RADIUS=220
  LINE_A_DARK=0.55, LINE_A_LIGHT=0.75

Refs: containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>, mouseRef<{x,y}|null>, isDarkRef<boolean>
State: isDark (boolean, default true)

Theme detection (useEffect):
  Check el.closest('[data-card-theme]') first, then document.documentElement for .dark class.
  MutationObserver on both; update isDarkRef.current and setIsDark.

Canvas useEffect (runs once):
  let cols, rows, cw, ch, ox: number
  let t=0, animId=0, alive=true, hoverStr=0

  build(): getBoundingClientRect → set canvas dims with dpr, ctx.setTransform(dpr,...)
    cols=Math.ceil(cw/SPACING)+2, rows=Math.ceil(ch/ROW_STEP)+1, ox=(cw%SPACING)/2

  frame():
    t += 0.003
    hoverStr lerp: += ((hasHover?1:0) - hoverStr) * (hasHover?0.018:0.010)
    amp = AMP * (1 + hoverStr * HOVER_BOOST)
    strokeStyle=rgba(dotRGB,lineA), lineWidth=0.8
    For each col c (0..cols-1):
      rx = ox + c*SPACING
      beginPath()
      let prevX=0, prevY=0
      For each row r (0..rows):
        ry = r * ROW_STEP
        wx = amp * sin(ry*FREQ_Y + rx*FREQ_X + t)
           + amp * 0.38 * sin(ry*FREQ_Y*1.6 + rx*FREQ_X*1.4 + t*1.5 + 1.1)
        wy = amp * 0.12 * cos(rx*FREQ_X*0.9 + ry*FREQ_Y*0.4 + t*0.8)
        Gaussian repulsion: push=LOCAL_AMP*exp(-dist²/(LOCAL_RADIUS²*0.5)), guard dist²<LOCAL_RADIUS²*4
        px=(dx/dist)*push, py=(dy/dist)*push
        x = rx+wx+px, y = ry+wy+py
        r===0 ? moveTo(x,y) : quadraticCurveTo(prevX, prevY, (prevX+x)/2, (prevY+y)/2)
        prevX=x, prevY=y
      lineTo(prevX, prevY)
      stroke()
    requestAnimationFrame(frame)

  ResizeObserver on canvas.parentElement; cleanup cancels RAF + disconnects RO.

JSX: outer div containerRef, bg=#110F0C dark/#F5F1EA light, mouse/touch handlers updating mouseRef.
  canvas absolute inset-0 100%×100%.
  Centred label: "Wave Lines" (22px 700) + "hover to fold" hint (11px 600 uppercase).
  Export: export function WaveLines(). No 'any'.`,

  Cursor: `// components-workspace/wave-lines/index.tsx
// Vertical lines with layered sine-wave displacement — deep wave field effect

'use client'

/**
 * CONSTANTS
 * SPACING      = 32    // line spacing (px)
 * ROW_STEP     = 4     // sample point interval per line (px)
 * AMP          = 18    // resting wave amplitude (px)
 * FREQ_Y       = 0.015 // frequency along Y — curves each line
 * FREQ_X       = 0.006 // phase offset per column — creates ripple/bunching
 * HOVER_BOOST  = 5.0   // amplitude multiplier on hover (extreme waves)
 * LOCAL_AMP    = 58    // cursor repulsion peak (px)
 * LOCAL_RADIUS = 220   // repulsion radius (px)
 * LINE_A_DARK  = 0.55
 * LINE_A_LIGHT = 0.75
 *
 * ARCHITECTURE
 * - Refs: containerRef (div), canvasRef (canvas), mouseRef ({x,y}|null), isDarkRef (bool)
 * - State: isDark — drives bg and label colors only
 * - Theme useEffect: MutationObserver on [data-card-theme] wrapper + <html class="dark">
 * - Canvas useEffect (once):
 *     Vars: cols, rows, cw, ch, ox, t=0, animId, alive=true, hoverStr=0
 *     build(): resize canvas with dpr, cols=ceil(cw/SPACING)+2, rows=ceil(ch/ROW_STEP)+1, ox=(cw%SPACING)/2
 *     frame():
 *       t += 0.003
 *       hoverStr lerp: attack 0.018, release 0.010
 *       amp = AMP * (1 + hoverStr * HOVER_BOOST)
 *       For each col c: rx = ox + c*SPACING
 *         beginPath()
 *         For each row r: ry = r*ROW_STEP
 *           wx = amp*sin(ry*FREQ_Y + rx*FREQ_X + t)
 *              + amp*0.38*sin(ry*FREQ_Y*1.6 + rx*FREQ_X*1.4 + t*1.5 + 1.1)
 *           wy = amp*0.12*cos(rx*FREQ_X*0.9 + ry*FREQ_Y*0.4 + t*0.8)
 *           Gaussian repulsion: push=LOCAL_AMP*exp(-dist²/(LOCAL_RADIUS²×0.5)), skip if dist²>LOCAL_RADIUS²×4
 *           px=(dx/dist)*push, py=(dy/dist)*push
 *           x=rx+wx+px, y=ry+wy+py
 *           r===0 ? moveTo(x,y) : quadraticCurveTo(prevX,prevY,(prevX+x)/2,(prevY+y)/2)
 *           prevX=x, prevY=y
 *         lineTo(prevX, prevY)
 *         stroke()
 *       strokeStyle=rgba(255,255,255|28,25,22, lineA), lineWidth=0.8
 *       RAF → frame
 *     ResizeObserver → build; cleanup: cancelAnimationFrame + RO.disconnect
 *
 * JSX:
 *   <div ref=containerRef style={{background: isDark?'#110F0C':'#F5F1EA'}} mouse/touch handlers>
 *     <canvas ref=canvasRef absolute inset-0 100%×100% />
 *     <div pointer-events-none centered>
 *       <span>"Wave Lines" 22px 700</span>
 *       <span>"hover to fold" 11px 600 uppercase</span>
 *     </div>
 *   </div>
 *
 * Export: export function WaveLines()
 * No 'any'. No dark: Tailwind variants inside (fixed dark bg = sand-950).
 */
`,
}