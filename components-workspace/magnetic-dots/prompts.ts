import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/magnetic-dots/index.tsx\`. Export a named function \`MagneticDots\`.

## File header
\`\`\`
'use client'
import { useEffect, useRef } from 'react'
\`\`\`

## Constants
- SPACING = 22 (grid gap in px)
- DOT_RADIUS = 1.5 (canvas arc radius)
- INFLUENCE_R = 160 (magnetic pull radius in px)
- SPRING_K = 0.12 (spring stiffness)
- DAMPING = 0.75 (per-frame velocity multiplier reduction; apply as vx *= (1 - 0.75))
- MAG_STRENGTH = 28 (peak displacement in px)
- LERP_FACTOR = 0.06 (hoverStr lerp speed)

## Dot type
\`\`\`ts
type Dot = { restX: number; restY: number; x: number; y: number; vx: number; vy: number }
\`\`\`

## Refs
- containerRef: HTMLDivElement
- canvasRef: HTMLCanvasElement
- mouseRef: { x: number; y: number } | null
- hoverStrRef: number (starts 0)
- isDarkRef: boolean (starts true)

## Theme detection (useEffect)
1. Find el.closest('[data-card-theme]'), check classList.contains('dark')
2. Fall back to document.documentElement.classList.contains('dark')
3. Set isDarkRef.current and update containerRef.current.style.background (#110F0C dark, #F5F1EA light)
4. MutationObserver on documentElement AND cardWrapper (if found); cleanup on unmount

## Physics loop (useEffect)
### build()
- Read canvas.getBoundingClientRect() for cw/ch, set canvas.width/height × dpr, ctx.setTransform(dpr,0,0,dpr,0,0)
- Grid: cols = ceil(cw/SPACING)+1, rows = ceil(ch/SPACING)+1, ox = (cw%SPACING)/2, oy = (ch%SPACING)/2
- Build dots array. Preserve existing dot positions by keying on restX,restY if rebuilding.

### frame() — runs every RAF
1. Lerp: hoverStrRef.current += (targetStr - hoverStrRef.current) * LERP_FACTOR
   (targetStr = mouseRef.current !== null ? 1 : 0)
2. ctx.clearRect(0, 0, cw, ch)
3. Set ctx.fillStyle = isDarkRef ? 'rgba(255,255,255,0.5)' : 'rgba(28,25,22,0.4)'
4. For each dot:
   a. If hStr > 0.001 and dist² < INFLUENCE_R²:
      t = 1 - dist/INFLUENCE_R
      force = t² × MAG_STRENGTH × hStr
      vx += (-dx/dist) × force; vy += (-dy/dist) × force
   b. vx += (restX - x) × SPRING_K
   c. vy += (restY - y) × SPRING_K
   d. vx *= (1 - DAMPING); vy *= (1 - DAMPING)
   e. x += vx; y += vy
   f. ctx.beginPath(); ctx.arc(x, y, DOT_RADIUS, 0, Math.PI*2); ctx.fill()

### Cleanup
cancelAnimationFrame(animId); ResizeObserver.disconnect(); alive = false guard

## JSX
\`\`\`tsx
<div ref={containerRef} className="relative h-full w-full overflow-hidden"
  style={{ background: '#110F0C' }}
  onMouseMove={...} onMouseLeave={...} onTouchMove={...} onTouchEnd={...}>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width:'100%', height:'100%' }} />
</div>
\`\`\``,
}
