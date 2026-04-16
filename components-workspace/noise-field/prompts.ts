import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

Create a React client component named \`NoiseField\`.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A grid of tiny arrow glyphs on a canvas. Each arrow points toward the cursor (with organic wobble and distance-based lerp speed) and fades in proximity-based opacity. When the cursor leaves, arrows drift back to a noise flow. No overlay text.

## Constants
- GRID_SPACING = 24
- SHAFT_LEN = 8 (half shaft)
- HEAD_SIZE = 4 (arrowhead branch length)
- DECAY_DIST = 320 (px, proximity decay)
- LERP_FAST = 0.12, LERP_MIN = 0.006, IDLE_LERP = 0.010
- WOBBLE_AMP = 0.18 rad, WOBBLE_FREQ = 0.7

## Arrow
interface Arrow { gx: number; gy: number; angle: number; phase: number }

## Helpers (inline)
- flowAngle(gx,gy,t) = sin(gx*0.007 + t)*PI + cos(gy*0.007 + t*0.6)*PI
- lerpAngle(cur, target, speed): wrap diff to (-PI,PI], return cur + diff*speed

## Build grid (and on resize)
For gx from GRID_SPACING/2 to W step GRID_SPACING, gy from GRID_SPACING/2 to H step GRID_SPACING, push { gx, gy, angle: existing?.angle ?? flowAngle(gx,gy,t), phase: existing?.phase ?? Math.random()*2PI }. Preserve existing state via Map keyed \`gx,gy\`.

## Canvas setup
Use container.clientWidth/Height; canvas.width = w*dpr, canvas.height = h*dpr, style.width = \`\${w}px\`, style.height = \`\${h}px\`; ctx.setTransform(dpr,0,0,dpr,0,0).

## Per frame (t starts 0, t += 0.004 each frame)
Fill bg: dark '#110F0C' / light '#F5F1EA'. ctx.lineCap='round', lineJoin='round'.

For each arrow:
- If mouse present:
  - dx=mouse.x-gx, dy=mouse.y-gy, dist=sqrt(dx²+dy²)
  - proximityFactor = exp(-dist/DECAY_DIST)
  - wobble = WOBBLE_AMP * (1 - proximityFactor*0.7) * sin(t*WOBBLE_FREQ + phase)
  - targetAngle = atan2(dy,dx) + wobble
  - speed = LERP_FAST*proximityFactor + LERP_MIN
  - arrow.angle = lerpAngle(arrow.angle, targetAngle, speed)
- Else:
  - noiseAngle = flowAngle(gx,gy,t) + WOBBLE_AMP*0.5*sin(t*WOBBLE_FREQ*0.8 + phase)
  - arrow.angle = lerpAngle(arrow.angle, noiseAngle, IDLE_LERP)

- alpha: if mouse: proximity = exp(-(dx²+dy²)/(200*200)); alpha = dark ? 0.06 + proximity*0.84 : 0.05 + proximity*0.75. Else: alpha = dark ? 0.18 : 0.15.
- color = dark ? rgba(255,255,255,alpha) : rgba(28,25,22,alpha)
- tipX = gx + cos*SHAFT_LEN, tipY = gy + sin*SHAFT_LEN, tailX = gx - cos*SHAFT_LEN, tailY = gy - sin*SHAFT_LEN
- Shaft: lineWidth 1.2, moveTo tail → lineTo tip, stroke
- Arrowhead: headAngle = PI - PI/5 (144°), lineWidth 1.0, two branches from tip at angles ± headAngle length HEAD_SIZE, stroke

## Theme detection
useState isDark + isDarkRef. Check closest('[data-card-theme]') class 'dark' or documentElement fallback. MutationObserver on both.

## Mouse tracking
On canvas: mousemove → mouseRef = { x: clientX - rect.left, y: clientY - rect.top }. mouseleave → null.

## JSX
div ref containerRef relative h-full w-full overflow-hidden, inline bg per theme. Canvas absolute inset-0.

Cleanup: cancelAnimationFrame, ro.disconnect, remove listeners, observer.disconnect.

## Typography
- Font: project default sans-serif`,

  'Lovable': `Create a React client component named \`NoiseField\`.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A grid of tiny arrow glyphs on a canvas. Each arrow points toward the cursor (with organic wobble and distance-based lerp speed) and fades in proximity-based opacity. When the cursor leaves, arrows drift back to a noise flow. No overlay text.

## Constants
- GRID_SPACING = 24
- SHAFT_LEN = 8 (half shaft)
- HEAD_SIZE = 4 (arrowhead branch length)
- DECAY_DIST = 320 (px, proximity decay)
- LERP_FAST = 0.12, LERP_MIN = 0.006, IDLE_LERP = 0.010
- WOBBLE_AMP = 0.18 rad, WOBBLE_FREQ = 0.7

## Arrow
interface Arrow { gx: number; gy: number; angle: number; phase: number }

## Helpers (inline)
- flowAngle(gx,gy,t) = sin(gx*0.007 + t)*PI + cos(gy*0.007 + t*0.6)*PI
- lerpAngle(cur, target, speed): wrap diff to (-PI,PI], return cur + diff*speed

## Build grid (and on resize)
For gx from GRID_SPACING/2 to W step GRID_SPACING, gy from GRID_SPACING/2 to H step GRID_SPACING, push { gx, gy, angle: existing?.angle ?? flowAngle(gx,gy,t), phase: existing?.phase ?? Math.random()*2PI }. Preserve existing state via Map keyed \`gx,gy\`.

## Canvas setup
Use container.clientWidth/Height; canvas.width = w*dpr, canvas.height = h*dpr, style.width = \`\${w}px\`, style.height = \`\${h}px\`; ctx.setTransform(dpr,0,0,dpr,0,0).

## Per frame (t starts 0, t += 0.004 each frame)
Fill bg: dark '#110F0C' / light '#F5F1EA'. ctx.lineCap='round', lineJoin='round'.

For each arrow:
- If mouse present:
  - dx=mouse.x-gx, dy=mouse.y-gy, dist=sqrt(dx²+dy²)
  - proximityFactor = exp(-dist/DECAY_DIST)
  - wobble = WOBBLE_AMP * (1 - proximityFactor*0.7) * sin(t*WOBBLE_FREQ + phase)
  - targetAngle = atan2(dy,dx) + wobble
  - speed = LERP_FAST*proximityFactor + LERP_MIN
  - arrow.angle = lerpAngle(arrow.angle, targetAngle, speed)
- Else:
  - noiseAngle = flowAngle(gx,gy,t) + WOBBLE_AMP*0.5*sin(t*WOBBLE_FREQ*0.8 + phase)
  - arrow.angle = lerpAngle(arrow.angle, noiseAngle, IDLE_LERP)

- alpha: if mouse: proximity = exp(-(dx²+dy²)/(200*200)); alpha = dark ? 0.06 + proximity*0.84 : 0.05 + proximity*0.75. Else: alpha = dark ? 0.18 : 0.15.
- color = dark ? rgba(255,255,255,alpha) : rgba(28,25,22,alpha)
- tipX = gx + cos*SHAFT_LEN, tipY = gy + sin*SHAFT_LEN, tailX = gx - cos*SHAFT_LEN, tailY = gy - sin*SHAFT_LEN
- Shaft: lineWidth 1.2, moveTo tail → lineTo tip, stroke
- Arrowhead: headAngle = PI - PI/5 (144°), lineWidth 1.0, two branches from tip at angles ± headAngle length HEAD_SIZE, stroke

## Theme detection
useState isDark + isDarkRef. Check closest('[data-card-theme]') class 'dark' or documentElement fallback. MutationObserver on both.

## Mouse tracking
On canvas: mousemove → mouseRef = { x: clientX - rect.left, y: clientY - rect.top }. mouseleave → null.

## JSX
div ref containerRef relative h-full w-full overflow-hidden, inline bg per theme. Canvas absolute inset-0.

Cleanup: cancelAnimationFrame, ro.disconnect, remove listeners, observer.disconnect.

## Typography
- Font: project default sans-serif`,

  'V0': `Create a React client component named \`NoiseField\`.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A grid of tiny arrow glyphs on a canvas. Each arrow points toward the cursor (with organic wobble and distance-based lerp speed) and fades in proximity-based opacity. When the cursor leaves, arrows drift back to a noise flow. No overlay text.

## Constants
- GRID_SPACING = 24
- SHAFT_LEN = 8 (half shaft)
- HEAD_SIZE = 4 (arrowhead branch length)
- DECAY_DIST = 320 (px, proximity decay)
- LERP_FAST = 0.12, LERP_MIN = 0.006, IDLE_LERP = 0.010
- WOBBLE_AMP = 0.18 rad, WOBBLE_FREQ = 0.7

## Arrow
interface Arrow { gx: number; gy: number; angle: number; phase: number }

## Helpers (inline)
- flowAngle(gx,gy,t) = sin(gx*0.007 + t)*PI + cos(gy*0.007 + t*0.6)*PI
- lerpAngle(cur, target, speed): wrap diff to (-PI,PI], return cur + diff*speed

## Build grid (and on resize)
For gx from GRID_SPACING/2 to W step GRID_SPACING, gy from GRID_SPACING/2 to H step GRID_SPACING, push { gx, gy, angle: existing?.angle ?? flowAngle(gx,gy,t), phase: existing?.phase ?? Math.random()*2PI }. Preserve existing state via Map keyed \`gx,gy\`.

## Canvas setup
Use container.clientWidth/Height; canvas.width = w*dpr, canvas.height = h*dpr, style.width = \`\${w}px\`, style.height = \`\${h}px\`; ctx.setTransform(dpr,0,0,dpr,0,0).

## Per frame (t starts 0, t += 0.004 each frame)
Fill bg: dark '#110F0C' / light '#F5F1EA'. ctx.lineCap='round', lineJoin='round'.

For each arrow:
- If mouse present:
  - dx=mouse.x-gx, dy=mouse.y-gy, dist=sqrt(dx²+dy²)
  - proximityFactor = exp(-dist/DECAY_DIST)
  - wobble = WOBBLE_AMP * (1 - proximityFactor*0.7) * sin(t*WOBBLE_FREQ + phase)
  - targetAngle = atan2(dy,dx) + wobble
  - speed = LERP_FAST*proximityFactor + LERP_MIN
  - arrow.angle = lerpAngle(arrow.angle, targetAngle, speed)
- Else:
  - noiseAngle = flowAngle(gx,gy,t) + WOBBLE_AMP*0.5*sin(t*WOBBLE_FREQ*0.8 + phase)
  - arrow.angle = lerpAngle(arrow.angle, noiseAngle, IDLE_LERP)

- alpha: if mouse: proximity = exp(-(dx²+dy²)/(200*200)); alpha = dark ? 0.06 + proximity*0.84 : 0.05 + proximity*0.75. Else: alpha = dark ? 0.18 : 0.15.
- color = dark ? rgba(255,255,255,alpha) : rgba(28,25,22,alpha)
- tipX = gx + cos*SHAFT_LEN, tipY = gy + sin*SHAFT_LEN, tailX = gx - cos*SHAFT_LEN, tailY = gy - sin*SHAFT_LEN
- Shaft: lineWidth 1.2, moveTo tail → lineTo tip, stroke
- Arrowhead: headAngle = PI - PI/5 (144°), lineWidth 1.0, two branches from tip at angles ± headAngle length HEAD_SIZE, stroke

## Theme detection
useState isDark + isDarkRef. Check closest('[data-card-theme]') class 'dark' or documentElement fallback. MutationObserver on both.

## Mouse tracking
On canvas: mousemove → mouseRef = { x: clientX - rect.left, y: clientY - rect.top }. mouseleave → null.

## JSX
div ref containerRef relative h-full w-full overflow-hidden, inline bg per theme. Canvas absolute inset-0.

Cleanup: cancelAnimationFrame, ro.disconnect, remove listeners, observer.disconnect.

## Typography
- Font: project default sans-serif`,
}
