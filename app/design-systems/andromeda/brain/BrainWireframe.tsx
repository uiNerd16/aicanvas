'use client'

import { useEffect, useRef } from 'react'

const MODEL_URL = '/models/brain.glb'
const ACCENT = 0xa8b94d

// A small wireframe brain for the reader's Brain Index landing — a stripped-down
// cousin of BrainStoryV4's scene: just the brain in the story's Wireframe
// material, slowly auto-rotating, transparent background. Client-only Three.js
// (runs in an effect, nothing on the server); the reader only mounts for premium
// users. Reuses the same /models/brain.glb asset the story ships.
export function BrainWireframe({ height = 200 }: { height?: number }) {
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
    let onResize = () => {}

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
      scene.add(new THREE.AmbientLight(0xffffff, 0.4))
      const key = new THREE.DirectionalLight(0xeaf2ff, 0.9)
      key.position.set(2, 3, 4)
      scene.add(key)

      camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 100)
      camera.position.set(0, 0.1, 3)

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
              color: ACCENT,
              wireframe: true,
              emissive: new THREE.Color(ACCENT),
              emissiveIntensity: 0.6,
              metalness: 0,
              roughness: 1,
            })
          }
        })
        scene.add(model)
      })

      onResize = () => {
        if (!renderer) return
        W = host.clientWidth || 600
        renderer.setSize(W, H)
        camera.aspect = W / H
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      const loop = () => {
        if (!alive) return
        raf = requestAnimationFrame(loop)
        if (model) model.rotation.y += 0.004
        renderer.render(scene, camera)
      }
      loop()
    })().catch(() => {})

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
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

  return <div ref={hostRef} style={{ width: '100%', height, pointerEvents: 'none' }} aria-hidden />
}
