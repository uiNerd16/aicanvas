import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create an animated canvas component called "ParticleConstellation". It shows about 80 small particles slowly drifting across a dark background, and whenever any two particles get close to each other, a thin fading line is drawn between them — like stars forming constellations. The constellation network is always shifting as the particles move.

When you hover over the canvas, particles near your cursor get gently pushed away, breaking apart the nearby constellations. Move the mouse away and the particles naturally drift back into new formations.

The aesthetic is minimal and meditative — no text, no labels, just the quiet motion of floating particles and the delicate web they form between them.

Visual details:
- Background: near-black (#110F0C) in dark mode, warm off-white (#F5F1EA) in light mode
- Particles: white at 80% opacity (dark), dark charcoal at 70% opacity (light), 2px radius
- Connection lines: same color as particles but semi-transparent, fading as particles get farther apart
- Particles wrap around canvas edges so they never disappear

Built with Next.js, Tailwind CSS, and an HTML5 Canvas — no external animation library needed for the particle simulation (use requestAnimationFrame directly). Supports both dark and light themes.`,

  Bolt: `Build a React component called ParticleConstellation using an HTML5 Canvas and requestAnimationFrame. No Three.js needed — pure 2D canvas.

Component structure:
- Root div: \`relative h-full w-full overflow-hidden\` with inline background color (theme-dependent)
- Canvas fills the container absolutely: \`absolute inset-0 h-full w-full\`
- 80 particles, each with \`{ x, y, vx, vy }\` (random velocity ±0.4px per frame)

Particle simulation (per frame):
1. Apply cursor repulsion: if mouse is within REPEL_RADIUS (150px), push particle away with force \`(REPEL_RADIUS - dist) / REPEL_RADIUS * 0.06\`
2. Clamp speed back to MAX_SPEED (0.4) after repulsion
3. Move by velocity, then toroidal-wrap at canvas edges

Drawing:
- Clear canvas with theme background each frame
- For each particle pair: if dist < MAX_DIST (120px), draw a line with \`alpha = (1 - dist / MAX_DIST) * 0.4\`
- Draw each particle as a filled circle (radius 2px)

Themes:
- Dark: bg #110F0C, particles rgba(255,255,255,0.8), lines rgba(255,255,255, alpha)
- Light: bg #F5F1EA, particles rgba(28,25,22,0.7), lines rgba(28,25,22, alpha)
- Detect via \`el.closest('[data-card-theme]')\` dataset, fallback to \`document.documentElement.classList.contains('dark')\`

Cleanup: cancel RAF, disconnect ResizeObserver and MutationObserver on unmount.
ResizeObserver: re-initialize particles on container resize.
MutationObserver: watch \`[data-card-theme]\` wrapper and \`document.documentElement\` for class changes to update theme.
Mouse: track position via mousemove on container, clear on mouseleave.`,

  Lovable: `I'd love a component that feels like staring up at a living night sky — a field of tiny particles drifting slowly through the dark, and whenever two of them wander close enough to each other, a delicate thread appears between them. The threads fade in gently and vanish as particles drift apart, creating an ever-shifting constellation that's never quite the same twice.

It should feel organic and meditative. There's no interaction asking for your attention — but when you move your cursor over it, the nearby particles sense your presence and drift softly away, like they're shy. The constellation breaks apart wherever you go, then reforms naturally in your wake.

The mood is quiet and cosmic — something you could stare at for minutes. The background is deep near-black in dark mode, switching to a warm cream in light mode. The particles glow softly in either theme.

No text, no labels, no UI — just motion and light and the quiet geometry that emerges between floating points. The particles wrap around the edges of the canvas so the field feels infinite.

Built with React and HTML5 Canvas, running smooth at 60fps.`,

  'Claude Code': `Create \`components-workspace/particle-constellation/index.tsx\`. Export a named function \`ParticleConstellation\`.

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

  Cursor: `File: \`components-workspace/particle-constellation/index.tsx\`
- \`'use client'\`, export \`ParticleConstellation\`
- Imports: \`useEffect, useRef\` from 'react'. No Framer Motion.

Constants:
- PARTICLE_COUNT=80, MAX_SPEED=0.4, PARTICLE_RADIUS=2
- MAX_DIST=120, REPEL_RADIUS=150, REPEL_STRENGTH=0.06

Types:
- \`Particle: { x, y, vx, vy: number }\`
- \`Theme: { bg, particleColor, lineColorBase: string }\`

Themes:
- DARK: bg '#110F0C', particle 'rgba(255,255,255,0.8)', line '255,255,255'
- LIGHT: bg '#F5F1EA', particle 'rgba(28,25,22,0.7)', line '28,25,22'

Theme detection (\`detectTheme(el)\`):
- Check \`el.closest('[data-card-theme]')?.dataset.cardTheme\` → 'light' → LIGHT
- Fallback: \`document.documentElement.classList.contains('dark')\` → DARK else LIGHT

Refs: canvasRef, containerRef, mouseRef (\`{x,y}|null\`), particlesRef, rafRef

useEffect:
1. resize(): canvas.width/height = container size, re-init particles, re-detect theme
2. ResizeObserver on container → resize()
3. MutationObserver: watch \`[data-card-theme]\` wrapper (attr: data-card-theme,class) + \`document.documentElement\` (attr: class) → re-detect theme
4. RAF tick:
   - Fill bg
   - Per particle: apply repulsion (if mouse within REPEL_RADIUS → force = (REPEL_RADIUS-dist)/REPEL_RADIUS * REPEL_STRENGTH), clamp speed to MAX_SPEED, move, toroidal wrap
   - Per pair (i,j): if dist < MAX_DIST → draw line, alpha=(1-dist/MAX_DIST)*0.4, lineWidth=0.8
   - Per particle: draw circle r=PARTICLE_RADIUS
5. mousemove → canvas-relative coords into mouseRef; mouseleave → mouseRef=null
6. Cleanup: cancelRAF, disconnect observers, remove listeners

JSX:
\`\`\`tsx
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: '#110F0C' }}>
  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
</div>
\`\`\`
No dark: variants. No useState. All state in refs.`,
}
