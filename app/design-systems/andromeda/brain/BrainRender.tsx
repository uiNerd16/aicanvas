'use client'

import { useEffect, useRef } from 'react'

const MODEL_URL = '/models/brain.glb'

// The four brain sections, each lit its own colour and carrying a label that
// orbits WITH the brain. Light + label anchor live in a RIG group alongside the
// model (NOT parented to the scaled model — that collapses them to the centre),
// so they sit at true world radius and rotate together with the brain.
const ZONES = [
  { label: 'Index', dir: [0.2, 0.9, 0.3], hex: '#a78bfa' }, // purple, top
  { label: 'Foundations', dir: [-0.9, 0.1, 0.32], hex: '#38bdf8' }, // cyan, left
  { label: 'Components', dir: [0.9, 0.06, 0.32], hex: '#fb923c' }, // orange, right
  { label: 'Skills', dir: [0.1, -0.5, 0.86], hex: '#a3e635' }, // lime, front-bottom
]

// Low-poly zone brain for the reader's Brain Index landing: a faceted mesh lit
// by an environment plus the four coloured zone lights, slowly auto-rotating,
// with labels projected to screen each frame so they track their region.
// Client-only Three.js; the reader only mounts for premium users.
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
    let pmrem: any
    let rig: any
    const anchors: any[] = []
    let onResize = () => {}

    const labels = ZONES.map((z) => {
      const el = document.createElement('div')
      el.textContent = z.label
      el.style.cssText =
        `position:absolute;left:0;top:0;transform:translate(-50%,-50%);` +
        `font-family:var(--font-jetbrains-mono),'JetBrains Mono',monospace;font-size:13px;font-weight:500;` +
        `letter-spacing:0.04em;white-space:nowrap;pointer-events:none;color:${z.hex};` +
        `text-shadow:0 0 12px rgba(0,0,0,0.95);opacity:0;transition:opacity .2s;will-change:transform,opacity`
      host.appendChild(el)
      return el
    })

    ;(async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
      if (!alive) return

      let W = host.clientWidth || 600
      const H = height
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      host.appendChild(renderer.domElement)

      scene = new THREE.Scene()
      pmrem = new THREE.PMREMGenerator(renderer)
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      // @ts-ignore r183 scene intensity
      scene.environmentIntensity = 0.35
      scene.add(new THREE.AmbientLight(0xffffff, 0.12))

      camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 100)
      camera.position.set(0, 0.1, 2.8)

      new GLTFLoader().load(MODEL_URL, (gltf: any) => {
        if (!alive) return
        const model = gltf.scene
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
              color: 0x373738,
              metalness: 0.15,
              roughness: 0.55,
              envMapIntensity: 0.5,
              flatShading: true,
            })
          }
        })

        // Rig: model + zone lights + label anchors, all at WORLD scale, rotated
        // together so each colour stays on its region and its label tracks it.
        rig = new THREE.Group()
        rig.add(model)
        for (const z of ZONES) {
          const d = new THREE.Vector3(z.dir[0], z.dir[1], z.dir[2]).normalize()
          const light = new THREE.PointLight(new THREE.Color(z.hex), 3, 2.4, 2)
          light.position.copy(d).multiplyScalar(1.2)
          rig.add(light)
          const anchor = new THREE.Object3D()
          anchor.position.copy(d).multiplyScalar(1.32)
          rig.add(anchor)
          anchors.push(anchor)
        }
        scene.add(rig)
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
        if (rig) rig.rotation.y += 0.0035
        for (let i = 0; i < anchors.length; i++) {
          anchors[i].getWorldPosition(v)
          const p = v.clone().project(camera)
          const sx = (p.x * 0.5 + 0.5) * W
          const sy = (-p.y * 0.5 + 0.5) * H
          labels[i].style.transform = `translate(-50%,-50%) translate(${sx}px,${sy}px)`
          labels[i].style.opacity = p.z > 1 ? '0' : '0.95' // fade when the region is behind
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
        pmrem?.dispose()
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
