import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/particle-constellation/index.tsx\`. Export a named function \`ParticleConstellation\`.

First line: \`'use client'\`

Imports: \`useEffect, useRef\` from 'react'. No Framer Motion needed — animation is pure canvas + RAF.

Constants:
- PARTICLE_COUNT = 80
- MAX_SPEED = 0.4 (px per frame)
- PARTICLE_RADIUS = 2
- MAX_DIST = 120 (px — max distance to draw a line)
- REPEL_RADIUS = 150 (px — cursor repulsion radius)
- REPEL_STRENGTH = 0.06

Types:
\`\`\`ts
interface Particle { x: number; y: number; vx: number; vy: number }
interface Theme { bg: string; particleColor: string; lineColorBase: string }
\`\`\`

Theme constants:
- DARK_THEME: bg '#110F0C', particleColor 'rgba(255,255,255,0.8)', lineColorBase '255,255,255'
- LIGHT_THEME: bg '#F5F1EA', particleColor 'rgba(28,25,22,0.7)', lineColorBase '28,25,22'

Theme detection function \`detectTheme(el: HTMLElement): Theme\`:
1. \`el.closest('[data-card-theme]')\` → read \`dataset.cardTheme\`, return LIGHT_THEME if 'light'
2. Fallback: \`document.documentElement.classList.contains('dark')\` → return DARK_THEME
3. Default: LIGHT_THEME

Factory \`makeParticles(width, height): Particle[]\` — returns PARTICLE_COUNT particles with random x/y and random vx/vy in range [-MAX_SPEED, MAX_SPEED].

Refs used:
- \`canvasRef: useRef<HTMLCanvasElement>(null)\`
- \`containerRef: useRef<HTMLDivElement>(null)\`
- \`mouseRef: useRef<{ x: number; y: number } | null>(null)\`
- \`particlesRef: useRef<Particle[]>([])\`
- \`rafRef: useRef<number>(0)\`

useEffect setup:
1. Get canvas and container, get 2D context
2. \`alive = true\`, \`theme = detectTheme(container)\`
3. \`resize()\` function: sets canvas.width/height to container dimensions, calls makeParticles, updates theme
4. Call resize(), attach ResizeObserver on container
5. Attach MutationObserver: observe \`[data-card-theme]\` wrapper (attributes: data-card-theme, class) + document.documentElement (attribute: class) → update theme
6. Start RAF loop

RAF tick algorithm:
1. Fill canvas with theme.bg
2. For each particle:
   a. If mouse not null and dist < REPEL_RADIUS: add force \`(dx/dist) * (REPEL_RADIUS-dist)/REPEL_RADIUS * REPEL_STRENGTH\` to vx, vy
   b. Clamp speed to MAX_SPEED
   c. Move: p.x += p.vx, p.y += p.vy
   d. Toroidal wrap: if p.x < 0: p.x += W; if p.x > W: p.x -= W; same for y
3. For i in 0..N, j in i+1..N: if dist(i,j) < MAX_DIST, draw line with strokeStyle \`rgba(\${theme.lineColorBase},\${alpha.toFixed(3)})\` where alpha = (1 - dist/MAX_DIST) * 0.4, lineWidth 0.8
4. For each particle: draw filled arc radius PARTICLE_RADIUS, fillStyle = theme.particleColor

Mouse events on container: mousemove → update mouseRef with canvas-relative coords via getBoundingClientRect; mouseleave → set mouseRef.current = null

Cleanup: cancelAnimationFrame, resizeObserver.disconnect(), mutationObserver.disconnect(), remove event listeners

Root JSX:
\`\`\`tsx
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: '#110F0C' }}>
  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
</div>
\`\`\`

No Tailwind dark: variants inside this component. No useState — all animation state in refs.`,
}
