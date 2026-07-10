'use client'

import { useEffect, useRef } from 'react'

const MODEL_URL = '/models/brain.glb'

// The four brain sections, each lit its own colour and carrying a label that
// orbits WITH the brain (the light + the label anchor are children of the
// model, so they rotate together — the purple region is always "Index", etc.).
const ZONES = [
  { label: 'Index', dir: [0.25, 0.85, 0.35], hex: '#a78bfa' }, // purple, top
  { label: 'Foundations', dir: [-0.92, 0.12, 0.28], hex: '#38bdf8' }, // cyan, left
  { label: 'Components', dir: [0.92, 0.04, 0.3], hex: '#fb923c' }, // orange, right
  { label: 'Skills', dir: [0.08, -0.5, 0.82], hex: '#a3e635' }, // lime, front-bottom
]

// Low-poly brain for the reader's Brain Index landing: a solid faceted mesh lit
// by the four coloured zone lights above, slowly auto-rotating, with labels
// projected to screen each frame so they track their region. Client-only
// Three.js (nothing on the server); the reader only mounts for premium users.
export function BrainRender({ height = 400 }: { height?: number }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let alive = true
    let raf = 0
    let renderer: any
    let scene: any
    let camera: any
    let model: any
    const anchors: any[] = []
    let onResize = () => {}

    // Label DOM (imperative so it lives beside the canvas and updates per frame).
    const labels = ZONES.map((z) => {
      const el = document.createElement('div')
      el.textContent = z.label
      el.style.cssText =
        `position:absolute;left:0;top:0;transform:translate(-50%,-50%);` +
        `font-family:var(--font-jetbrains-mono),'JetBrains Mono',monospace;font-size:12px;` +
        `letter-spacing:0.04em;white-space:nowrap;pointer-events:none;color:${z.hex};` +
        `text-shadow:0 0 10px rgba(0,0,0,0.9);opacity:0;transition:opacity .2s;will-change:transform,opacity`
      host.appendChild(el)
      return el
    })

    ;(async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      if (!alive) return

      let W = host.clientWidth || 600
      const H = height
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      host.appendChild(renderer.domElement)

      scene = new THREE.Scene()
      scene.add(new THREE.AmbientLight(0xffffff, 0.32))
      const keyL = new THREE.DirectionalLight(0xdfe6ff, 0.3)
      keyL.position.set(2, 3, 4)
      scene.add(keyL)

      camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 100)
      camera.position.set(0, 0.1, 2.9)

      new GLTFLoader().load(MODEL_URL, (gltf: any) => {
        if (!alive) return
        model = gltf.scene
        // Normalize to unit radius + recenter (Poly models are off-origin / arbitrary scale).
        model.updateWorldMatrix(true, true)
        let sph = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere())
        model.scale.setScalar(1 / (sph.radius || 1))
        model.updateWorldMatrix(true, true)
        sph = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere())
        model.position.sub(sph.center)
        model.traverse((o: any) => {
          if (o.isMesh) {
            o.material = new THREE.MeshStandardMaterial({
              color: 0x26262b,
              metalness: 0.2,
              roughness: 0.55,
              flatShading: true,
            })
          }
        })
        scene.add(model)

        // Colored zone lights + label anchors, parented to the model so they
        // rotate WITH it (colour stays on its region, label tracks it).
        for (const z of ZONES) {
          const d = new THREE.Vector3(z.dir[0], z.dir[1], z.dir[2]).normalize()
          const light = new THREE.PointLight(new THREE.Color(z.hex), 5.5, 3.2, 2)
          light.position.copy(d).multiplyScalar(1.15)
          model.add(light)
          const anchor = new THREE.Object3D()
          anchor.position.copy(d).multiplyScalar(1.4)
          model.add(anchor)
          anchors.push(anchor)
        }
      })

      onResize = () => {
        if (!renderer) return
        W = host.clientWidth || 600
        renderer.setSize(W, H)
        camera.aspect = W / H
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      const v = new THREE.Vector3()
      const loop = () => {
        if (!alive) return
        raf = requestAnimationFrame(loop)
        if (model) model.rotation.y += 0.0035
        for (let i = 0; i < anchors.length; i++) {
          anchors[i].getWorldPosition(v)
          const p = v.clone().project(camera)
          const sx = (p.x * 0.5 + 0.5) * W
          const sy = (-p.y * 0.5 + 0.5) * H
          labels[i].style.transform = `translate(-50%,-50%) translate(${sx}px,${sy}px)`
          labels[i].style.opacity = p.z > 1 ? '0' : '0.92' // fade when the region is behind
        }
        renderer.render(scene, camera)
      }
      loop()
    })().catch(() => {})

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      for (const el of labels) el.remove()
      // forceContextLoss releases the WebGL context (browser cap ~16) — dispose alone leaks it.
      try {
        try {
          renderer?.forceContextLoss()
        } catch {}
        renderer?.dispose()
        if (renderer?.domElement && host.contains(renderer.domElement)) host.removeChild(renderer.domElement)
      } catch {}
    }
  }, [height])

  return <div ref={hostRef} style={{ position: 'relative', width: '100%', height, pointerEvents: 'none' }} aria-hidden />
}
