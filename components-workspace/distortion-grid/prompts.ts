import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/distortion-grid/index.tsx — a 'use client' React component that renders an animated distorted grid on a <canvas>.

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
}
