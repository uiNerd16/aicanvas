import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a canvas-based interactive component called MagneticDots. It shows a dense grid of small circular dots filling the entire space. When the cursor hovers over the canvas, the dots nearest to it get magnetically pulled toward the pointer — the closest ones move the most. When the cursor leaves, each dot springs back to its original position with a satisfying elastic bounce. There are no labels or text — it's purely a tactile, physical-feeling field of dots responding to the pointer.

Use Next.js with Tailwind CSS. Render on an HTML canvas (no SVG). The dots sit in a grid with about 22px spacing and have a radius of 1.5px. On dark backgrounds the dots are white at 50% opacity; on light backgrounds they're near-black at 40% opacity. The background should respond to the site's dark/light theme by reading the nearest [data-card-theme] element's class.

The magnetic pull radius is about 160px — only dots within that radius get attracted. The pull is strongest at the centre and fades smoothly toward the edge. When the cursor leaves, each dot returns to its grid position with a spring that slightly overshoots before settling.`,

  Bolt: `Build a React component called MagneticDots using an HTML canvas and requestAnimationFrame physics. No Framer Motion needed — all animation happens in the render loop.

Component structure:
- Root div: full width/height, overflow hidden, inline background style (dark: #110F0C, light: #F5F1EA)
- Canvas fills the root via absolute inset-0
- Theme detection: read closest [data-card-theme] classList for 'dark'; observe with MutationObserver; also watch document.documentElement
- Mouse position tracked in a ref; canvas-local coords via getBoundingClientRect

Dot data (per dot): restX, restY, x, y, vx, vy
Grid: spacing = 22px, offset-centred, dot radius = 1.5px
Dot fill: dark → rgba(255,255,255,0.5), light → rgba(28,25,22,0.4)

Per-frame physics:
1. Lerp hoverStr (0↔1) toward target (1 if mouse present, 0 if not) at factor 0.06
2. For each dot within 160px of the mouse: compute t = 1 - dist/160, apply pull force = t² × 28 × hoverStr toward cursor
3. Apply spring: vx += (restX - x) × 0.12; vy += (restY - y) × 0.12
4. Apply damping: vx *= 0.25; vy *= 0.25 (i.e. multiply by 1 - 0.75)
5. Integrate: x += vx; y += vy
6. Draw dot at (x, y)

Cleanup: cancel RAF, disconnect ResizeObserver on unmount.`,

  Lovable: `I'd love a component that feels like a magnetic force field made of tiny dots. Imagine a dark canvas covered edge-to-edge in a quiet grid of small white dots, barely visible, at rest. The moment you move your cursor across them, the dots nearest to your pointer begin pulling toward it — like iron filings clustering around a magnet. The closest ones rush in dramatically, while the ones at the edge of the field barely twitch. When you pull your pointer away, every dot bounces back to its home with a satisfying little wobble — that elastic snap that makes it feel genuinely physical.

The whole piece is completely wordless. No labels, no UI. Just this living, breathing field of dots that responds to your presence. In dark mode the dots glow softly white. In light mode they're subtle and ink-dark. The magnetic influence reaches about 160px around the cursor and fades gracefully at the boundary. The spring-back has a slight overshoot that makes the return feel alive rather than mechanical.`,

  'Claude Code': `Create \`components-workspace/magnetic-dots/index.tsx\`. Export a named function \`MagneticDots\`.

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

  Cursor: `File: \`components-workspace/magnetic-dots/index.tsx\`
Export: \`MagneticDots\` ('use client')

## Constants
- SPACING=22, DOT_RADIUS=1.5, INFLUENCE_R=160
- SPRING_K=0.12, DAMPING=0.75, MAG_STRENGTH=28, LERP_FACTOR=0.06

## Types
- \`Dot: { restX, restY, x, y, vx, vy }\` — no React state, all in local loop vars

## Refs
- containerRef (div), canvasRef (canvas), mouseRef ({ x,y }|null), hoverStrRef (number=0), isDarkRef (bool)

## Theme effect
- el.closest('[data-card-theme]') → check .dark class; fallback: document.documentElement
- MutationObserver on both nodes, attributeFilter: ['class']
- Apply: isDarkRef.current = dark; containerRef.current.style.background = dark ? '#110F0C' : '#F5F1EA'

## Canvas effect (RAF loop)
build():
- dpr = devicePixelRatio; set canvas.width/height; ctx.setTransform(dpr,0,0,dpr,0,0)
- Grid with offset-centred ox/oy; cols=ceil(cw/SPACING)+1; rows same
- Dot array: {restX, restY, x=restX, y=restY, vx=0, vy=0}

frame() each tick:
1. hoverStrRef += (target - hoverStrRef) * LERP_FACTOR (target: 1 if mouse, else 0)
2. clearRect full canvas
3. fillStyle: dark→rgba(255,255,255,0.5) light→rgba(28,25,22,0.4)
4. Per dot:
   - if hStr>0.001 && dist²<INFLUENCE_R²: force=t²×28×hStr; vx+=(-dx/dist)×force; vy+=(-dy/dist)×force
   - vx+=(restX-x)×0.12; vy+=(restY-y)×0.12
   - vx*=0.25; vy*=0.25
   - x+=vx; y+=vy
   - arc(x,y,1.5,0,2π); fill()

Cleanup: cancelAnimationFrame; ResizeObserver.disconnect(); alive flag

## JSX
- Root: div ref=containerRef, className="relative h-full w-full overflow-hidden", style background
- Canvas: absolute inset-0, width/height 100%
- Mouse events: onMouseMove→update mouseRef; onMouseLeave→mouseRef=null; touch equivalent`,
}
