---
name: creative-3d-components
version: "1.0"
description: Opinionated creative skill for building stunning 3D, particle, and generative visual components. Use when building any Three.js, Canvas, WebGL, or visually complex component. Provides specific visual recipes, mathematical patterns, and creative direction — not API docs.
---

# Creative 3D & Visual Components

You are a creative technologist building visual components that belong on Awwwards. This skill gives you specific recipes and creative direction — not API documentation.

## Creative Philosophy

### What makes a component "wow"

1. **One hero effect, perfectly executed** — don't combine 5 techniques badly. Pick one (glass refraction, particle morphing, procedural noise) and make it flawless.
2. **Organic motion > mechanical motion** — nature doesn't move linearly. Use sine waves, noise, springs. Nothing should move at constant speed.
3. **Depth and atmosphere** — fog, bloom, depth-of-field, ambient occlusion. A scene without atmosphere looks like a tech demo.
4. **Light tells the story** — a single dramatic light source beats 4 flat ones. Rim lighting creates silhouettes. Backlight creates mystery.
5. **Restraint in color** — 2-3 colors max. One dominant, one accent, one for depth. Monochromatic + one warm accent is almost always stunning.

### The "screenshot test"

If someone paused the animation at any random frame, would that single frame look beautiful as a still image? If yes, the component is good. If it only looks good in motion, the design needs work.

---

## This Project's Patterns

Components in this project use **raw Three.js** (not React Three Fiber) and **Canvas 2D API**. Follow these established patterns:

### Three.js in React (the project way)

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function MyComponent() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Dynamic import Three.js
    let alive = true
    import('three').then((THREE) => {
      if (!alive) return

      const W = container.clientWidth || 500
      const H = container.clientHeight || 500

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100)
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      container.appendChild(renderer.domElement)

      let raf: number
      const loop = () => {
        raf = requestAnimationFrame(loop)
        // animate here
        renderer.render(scene, camera)
      }
      loop()

      // CLEANUP — non-negotiable
      return () => {
        cancelAnimationFrame(raf)
        renderer.dispose()
        container.removeChild(renderer.domElement)
      }
    })

    return () => { alive = false }
  }, [])

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center bg-sand-950" />
  )
}
```

### Canvas 2D pattern (for 2D generative/particle work)

```tsx
const canvasRef = useRef<HTMLCanvasElement>(null)

useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  // Set canvas size from container, not hardcoded
  // Use RAF loop with cleanup
}, [])
```

---

## Visual Recipes

### Glass / Crystal

The most requested "wow" effect. Key: **transmission + environment + caustics feel**.

```js
// MeshPhysicalMaterial is the ONLY material that does glass properly
const glass = new THREE.MeshPhysicalMaterial({
  transmission: 1,        // fully transparent
  roughness: 0.05,        // almost perfectly smooth
  thickness: 0.5,         // refraction depth
  ior: 1.5,               // glass index of refraction (1.0 = air, 1.5 = glass, 2.4 = diamond)
  chromaticAberration: 0.03, // subtle rainbow edge (if using postprocessing)
  envMapIntensity: 1.5,   // pump up reflections
})

// CRITICAL: glass needs something to refract. Add an environment:
const pmremGenerator = new THREE.PMREMGenerator(renderer)
scene.environment = pmremGenerator.fromScene(
  new THREE.RoomEnvironment()  // or load an HDR
).texture
```

### Glow / Bloom

Bloom makes things feel alive. Two approaches:

**Approach 1: Fake bloom with sprites (lightweight, this project's preferred pattern)**
```js
// Draw a radial gradient on a small canvas → use as sprite texture
const size = 64
const canvas = document.createElement('canvas')
canvas.width = canvas.height = size
const ctx = canvas.getContext('2d')!
const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
grad.addColorStop(0, 'rgba(255,200,100,1)')
grad.addColorStop(0.3, 'rgba(255,200,100,0.4)')
grad.addColorStop(1, 'rgba(255,200,100,0)')
ctx.fillStyle = grad
ctx.fillRect(0, 0, size, size)
```

**Approach 2: Real postprocessing bloom (heavier, more cinematic)**
```js
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(W, H),
  0.8,   // strength — keep under 1.5 or it looks radioactive
  0.3,   // radius
  0.85   // threshold — higher = only bright things glow
))
// In loop: composer.render() instead of renderer.render()
```

### Particles That Feel Alive

Never use random velocity. Use **forces and fields**.

```js
// Instead of: particle.x += particle.vx (boring, mechanical)
// Use noise-based flow fields:

// Simplex noise position → velocity
const angle = noise3D(p.x * 0.01, p.y * 0.01, time * 0.001) * Math.PI * 2
p.vx += Math.cos(angle) * 0.02
p.vy += Math.sin(angle) * 0.02

// Add damping so particles don't fly off
p.vx *= 0.98
p.vy *= 0.98
```

**Particle count guidelines:**
- Canvas 2D sprites: 2,000-10,000 comfortable
- Three.js Points (BufferGeometry): 10,000-100,000
- GPU instanced meshes: 100,000+

### Liquid / Organic Surfaces

Use **simplex noise displacement** on a sphere or plane:

```js
const geo = new THREE.SphereGeometry(1, 128, 128) // high subdivision = smooth
const positions = geo.attributes.position
const original = positions.array.slice() // save original

function animate(time) {
  for (let i = 0; i < positions.count; i++) {
    const x = original[i * 3]
    const y = original[i * 3 + 1]
    const z = original[i * 3 + 2]

    // Displace along normal using 3D noise
    const displacement = 1 + 0.15 * noise3D(
      x * 2 + time * 0.001,
      y * 2 + time * 0.0007,
      z * 2 + time * 0.0012
    )
    positions.array[i * 3]     = x * displacement
    positions.array[i * 3 + 1] = y * displacement
    positions.array[i * 3 + 2] = z * displacement
  }
  positions.needsUpdate = true
  geo.computeVertexNormals() // recalculate lighting
}
```

### Wireframe with Depth

The project already does this well (torus-knot, sphere-lines). Key principles:
- **Depth-sorted segments** — closer lines are brighter/thicker
- **Alpha by depth** — back faces very dim (0.05-0.15), front faces brighter (0.3-0.6)
- **Line width variation** — thicker at equator, thinner at poles
- **Never fully opaque** — max alpha 0.6 keeps wireframes ethereal

---

## Mathematical Beauty

### Noise Functions

For organic, natural-feeling motion. If the project doesn't have a noise library, implement simplex noise or use this minimal approach:

```js
// Quick pseudo-noise (not true simplex, but fast and good enough for displacement)
function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return n - Math.floor(n)  // 0-1
}

// Better: use 'simplex-noise' package for true gradient noise
```

### Parametric Curves

For generating shapes mathematically (like the torus knot):

```js
// Lissajous curve (beautiful 3D figure-eight patterns)
x = Math.sin(a * t + deltaX)
y = Math.sin(b * t + deltaY)
z = Math.sin(c * t + deltaZ)

// Trefoil knot
x = Math.sin(t) + 2 * Math.sin(2 * t)
y = Math.cos(t) - 2 * Math.cos(2 * t)
z = -Math.sin(3 * t)

// Rose curve (on a sphere surface for beautiful line patterns)
r = Math.cos(k * theta)
```

### Spring Physics (for interaction response)

```js
// Damped spring — smooth, physical feel for hover/click response
const spring = {
  value: 0,
  target: 1,     // where it's going
  velocity: 0,
  stiffness: 180, // higher = snappier
  damping: 12,    // higher = less bouncy
}

function stepSpring(s, dt = 1/60) {
  const force = -s.stiffness * (s.value - s.target)
  const dampForce = -s.damping * s.velocity
  s.velocity += (force + dampForce) * dt
  s.value += s.velocity * dt
}
```

---

## Color Palettes That Work on Dark Backgrounds

Since component previews are always on `bg-sand-950` (#110F0C):

| Mood | Primary | Accent | Depth |
|---|---|---|---|
| Warm embers | `#FF6B35` | `#FFD700` | `#1A0A00` |
| Cool crystal | `#00D4FF` | `#7B68EE` | `#000D1A` |
| Toxic/neon | `#39FF14` | `#FF00FF` | `#001A00` |
| Minimal mono | `#FFFFFF` | `#666666` | `#0A0A0A` |
| Sunset | `#FF4500` | `#FF8C42` | `#1A0500` |
| Ocean depth | `#006994` | `#40E0D0` | `#001A2E` |
| Rose gold | `#B76E79` | `#F4C2C2` | `#1A0A0D` |

**Rule:** bright accent colors on dark backgrounds need to be used sparingly — 10-20% of the visual area. The rest is darkness and depth.

---

## Interaction Patterns

### Hover response (the minimum)

Every component should respond to hover. Even if subtle:
- Rotation speed change (idle: 0.003, hover: 0.012 — the project pattern)
- Color intensity shift
- Particle density increase
- Camera subtle zoom

### Mouse-follow (for premium feel)

```js
const mouse = { x: 0, y: 0 }
container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1   // -1 to 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1  // -1 to 1
})

// In animation loop — use mouse for subtle camera/light offset
camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05
camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05
camera.lookAt(scene.position)
```

---

## Anti-Patterns (Never Do These)

1. **Flat ambient-only lighting** — looks like a 2005 screensaver. Always add at least one directional light.
2. **Default MeshBasicMaterial** — has no lighting response. Use MeshStandardMaterial minimum.
3. **Random particle velocity** — looks like TV static. Use noise fields or forces.
4. **Constant rotation speed** — feels robotic. Add slight sine-wave variation.
5. **Pure white on dark** — too harsh. Use off-white (#E8E8E8) or tinted white.
6. **Ignoring cleanup** — dispose renderers, geometries, materials, textures. Memory leaks crash the page.
7. **Hardcoded canvas size** — always read from container. Components must flex.
