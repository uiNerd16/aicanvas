import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/wave-lines/index.tsx — a 'use client' React component rendering animated vertical wave lines on <canvas>.

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
}
