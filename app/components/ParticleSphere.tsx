'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 9000

/** Soft radial glow sprite drawn on a tiny canvas */
function makeSprite(): THREE.CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const half = size / 2
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
  grad.addColorStop(0.00, 'rgba(255,255,255,1.00)')
  grad.addColorStop(0.20, 'rgba(255,255,255,0.80)')
  grad.addColorStop(0.55, 'rgba(255,255,255,0.25)')
  grad.addColorStop(1.00, 'rgba(255,255,255,0.00)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

/** Map a normalised y value (-1 → +1) to an RGB triple */
function colorFromY(ny: number): [number, number, number] {
  if (ny >= 0) {
    // Upper hemisphere → warm gold / orange-white
    // ny=0 : deep amber  (1.0, 0.55, 0.02)
    // ny=1 : near-white  (1.0, 0.92, 0.65)
    return [1.0, 0.55 + ny * 0.37, 0.02 + ny * 0.63]
  } else {
    // Lower hemisphere → cool white / silver
    // ny=0  : dim silver (0.38, 0.38, 0.45)
    // ny=-1 : bright white (1.0, 1.0, 1.0)
    const d = -ny // 0 → 1 going toward south pole
    const v = 0.38 + d * 0.62
    return [v, v, v + (1 - d) * 0.07] // faint cool tint near equator
  }
}

export function ParticleSphere() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const W = container.clientWidth  || 500
    const H = container.clientHeight || 500

    // ── Scene / camera / renderer ──────────────────────────────────────────────
    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(52, W / H, 0.1, 100)
    camera.position.z = 2.9

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000)
    container.appendChild(renderer.domElement)

    // ── Particle geometry ──────────────────────────────────────────────────────
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors    = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Uniform-area distribution across a sphere surface
      const theta = Math.acos(2 * Math.random() - 1)   // 0 … π
      const phi   = 2 * Math.PI * Math.random()

      // Slight radial jitter so the sphere has a little volume / depth
      const r = 1.0 + (Math.random() - 0.5) * 0.14

      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.cos(theta)
      const z = r * Math.sin(theta) * Math.sin(phi)

      positions[i * 3]     = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const ny          = Math.max(-1, Math.min(1, y / r))
      const [cr, cg, cb] = colorFromY(ny)
      colors[i * 3]     = cr
      colors[i * 3 + 1] = cg
      colors[i * 3 + 2] = cb
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3))

    // ── Material ───────────────────────────────────────────────────────────────
    const sprite  = makeSprite()
    const mat     = new THREE.PointsMaterial({
      size:         0.032,
      map:          sprite,
      vertexColors: true,
      transparent:  true,
      depthWrite:   false,
      // Additive blending → overlapping particles glow like the reference image
      blending:     THREE.AdditiveBlending,
    })

    const mesh = new THREE.Points(geo, mat)
    // Tilt so the pole hot-spots appear offset, matching the reference image
    mesh.rotation.x = 0.28
    mesh.rotation.z = 0.08
    scene.add(mesh)

    // ── Animation loop ─────────────────────────────────────────────────────────
    let raf: number
    let t = 0

    function tick() {
      raf = requestAnimationFrame(tick)
      t += 0.004
      // Primary Y-axis rotation (horizontal spin)
      mesh.rotation.y = t
      // Gentle secondary wobble for organic feel
      mesh.rotation.z = 0.08 + Math.sin(t * 0.4) * 0.04
      renderer.render(scene, camera)
    }
    tick()

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf)
      geo.dispose()
      mat.dispose()
      sprite.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="h-full w-full" />
}
