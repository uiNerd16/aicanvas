import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a full-size canvas component called SilkLines. It draws dense vertical lines that undulate like draped silk fabric — a slow, large-amplitude sine wave with a phase offset per column that creates a cloth-fold bunching effect.

How it works:
- Draw only vertical lines (no horizontal, no grid), one per column, spaced SPACING=8px apart
- For each line, sample points every 4px vertically (ROW_STEP=4) for smooth curves
- Displace each point horizontally: wx = AMP * sin(ry * FREQ_Y + rx * FREQ_X + t)
  - FREQ_Y=0.015 curves each individual line (~1.5 waves from top to bottom)
  - FREQ_X=0.006 adds a small phase offset per column, creating the fold/bunching where lines compress together and spread apart
  - AMP=44px, t advances by 0.003 per frame (very slow drift)
- Lines: 0.8px stroke, opacity 0.55 on dark (#110F0C) and 0.75 on light (#F5F1EA)
- On hover: Gaussian repulsion pushes lines away from cursor (LOCAL_AMP=58px, radius=220px). Also boost global amplitude by 1.3× for deeper folds. Ease in/out smoothly.
- Support dark and light mode. Show centred label "Silk Lines" and hint "hover to fold".
- Use requestAnimationFrame, cancel on unmount, ResizeObserver to rebuild on resize.`,

  Bolt: `Build a React canvas component (SilkLines) that renders animated vertical lines like draped silk.

Technical spec:
- Canvas fills 100% of parent; use devicePixelRatio for crisp rendering
- Lines: cols = Math.ceil(cw/SPACING)+2 columns, SPACING=8px, ox=(cw%SPACING)/2 (centred)
- Sample points: ROW_STEP=4px, rows=Math.ceil(ch/ROW_STEP)+1
- Animation: t += 0.003 per RAF frame
- X-displacement per point (rx, ry):
    wx = amp * sin(ry * FREQ_Y + rx * FREQ_X + t)
    FREQ_Y=0.015, FREQ_X=0.006, base AMP=44
- Global hover amplitude: amp = AMP * (1 + hoverStr * HOVER_BOOST), HOVER_BOOST=1.3
  hoverStr lerps toward 1 when mouse present (×0.018), toward 0 on leave (×0.010)
- Cursor repulsion (Gaussian, both X and Y):
    push = LOCAL_AMP * exp(-dist² / (LOCAL_RADIUS²*0.5))   LOCAL_AMP=58, LOCAL_RADIUS=220
    px=(dx/dist)*push, py=(dy/dist)*push  (skip if dist²>LOCAL_RADIUS²*4)
- Draw order: per column c → beginPath → moveTo(rx+wx+px, ry+py) at r=0 → lineTo each r → stroke
- strokeStyle: rgba(255,255,255,0.55) dark / rgba(28,25,22,0.75) light, lineWidth=0.8
- Theme: isDarkRef + MutationObserver on document.documentElement + [data-card-theme] wrapper
- Cleanup: cancelAnimationFrame + ResizeObserver.disconnect`,

  Lovable: `I want a canvas background component called SilkLines that looks like a piece of draped silk fabric — dense vertical lines that slowly wave and fold.

The effect: imagine hundreds of thin vertical strings hanging from ceiling to floor. They all gently sway with a smooth sine wave, but each string is slightly out of phase with its neighbour. This creates regions where the strings bunch together tightly (like a fold in fabric) and regions where they spread apart. The whole thing drifts slowly, like silk in a gentle breeze.

Technical details:
- Lines are spaced 8px apart, drawn as smooth curves sampled every 4px
- The wave is a sine function: displacement = 44px × sin(y×0.015 + x×0.006 + time)
- Time advances by 0.003 per frame — very slow
- Lines are semi-transparent (55% dark / 75% light), 0.8px thick

When you hover, the lines part away from your cursor like fabric being pushed aside. The whole canvas also responds — all waves grow deeper (1.3× amplitude) creating more dramatic folds. The effect eases in and out smoothly.

Support dark (#110F0C) and light (#F5F1EA) themes. Show a centred "Silk Lines" label and "hover to fold" hint.`,

  'Claude Code': `Create components-workspace/silk-lines/index.tsx — a 'use client' React component rendering animated vertical silk-fabric lines on <canvas>.

Constants:
  SPACING=8, ROW_STEP=4, AMP=44
  FREQ_Y=0.015, FREQ_X=0.006
  HOVER_BOOST=1.3, LOCAL_AMP=58, LOCAL_RADIUS=220
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
    For each col c (0..cols-1):
      rx = ox + c*SPACING
      beginPath
      For each row r (0..rows):
        ry = r * ROW_STEP
        wx = amp * sin(ry*FREQ_Y + rx*FREQ_X + t)
        Gaussian repulsion: push=LOCAL_AMP*exp(-dist²/(LOCAL_RADIUS²*0.5)), guard dist²<LOCAL_RADIUS²*4
        px=(dx/dist)*push, py=(dy/dist)*push
        r===0 ? moveTo(rx+wx+px, ry+py) : lineTo(rx+wx+px, ry+py)
      stroke()
    strokeStyle=rgba(dotRGB,lineA), lineWidth=0.8
    requestAnimationFrame(frame)

  ResizeObserver on canvas.parentElement; cleanup cancels RAF + disconnects RO.

JSX: outer div containerRef, bg=#110F0C dark/#F5F1EA light, mouse/touch handlers updating mouseRef.
  canvas absolute inset-0 100%×100%.
  Centred label: "Silk Lines" (22px 700) + "hover to fold" hint (11px 600 uppercase).
  Export: export function SilkLines(). No 'any'.`,

  Cursor: `// components-workspace/silk-lines/index.tsx
// Vertical lines with sine-wave X-displacement — draped silk cloth effect

'use client'

/**
 * CONSTANTS
 * SPACING      = 8     // line spacing (px)
 * ROW_STEP     = 4     // sample point interval per line (px)
 * AMP          = 44    // wave amplitude (px)
 * FREQ_Y       = 0.015 // frequency along Y — curves each line
 * FREQ_X       = 0.006 // phase offset per column — creates fold/bunching
 * HOVER_BOOST  = 1.3   // amplitude multiplier on hover
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
 *           wx = amp * sin(ry*FREQ_Y + rx*FREQ_X + t)
 *           Gaussian repulsion: push=LOCAL_AMP*exp(-dist²/(LOCAL_RADIUS²×0.5)), skip if dist²>LOCAL_RADIUS²×4
 *           px=(dx/dist)*push, py=(dy/dist)*push
 *           moveTo/lineTo(rx+wx+px, ry+py)
 *         stroke()
 *       strokeStyle=rgba(255,255,255|28,25,22, lineA), lineWidth=0.8
 *       RAF → frame
 *     ResizeObserver → build; cleanup: cancelAnimationFrame + RO.disconnect
 *
 * JSX:
 *   <div ref=containerRef style={{background: isDark?'#110F0C':'#F5F1EA'}} mouse/touch handlers>
 *     <canvas ref=canvasRef absolute inset-0 100%×100% />
 *     <div pointer-events-none centered>
 *       <span>"Silk Lines" 22px 700</span>
 *       <span>"hover to fold" 11px 600 uppercase</span>
 *     </div>
 *   </div>
 *
 * Export: export function SilkLines()
 * No 'any'. No dark: Tailwind variants inside (fixed dark bg = sand-950).
 */
`,
}
