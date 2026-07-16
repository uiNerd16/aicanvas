'use client'

// ============================================================
// Andromeda Brain — story page V4 (Three.js firefly · the brain).
// Same choreography as V3, but the hero is an actual BRAIN. A
// firefly circles it; hover the scene and the camera chases the
// firefly; floating labels light up as it passes. The firefly is
// procedural (this model has no animation) and carries a teal
// point light, so the brain lights up where it flies. On-brand
// dark-metal + teal treatment.
//
// Model: low-poly "Brain" by Poly by Google, CC BY 3.0 (via Poly
// Pizza) — geometry-only, re-materialed here. Asset lives in
// /public/models/brain.glb (git-excluded; keep the on-page credit
// if this ships). Label text derives from BRAIN_TEASER (real
// folder, names only — never brain CONTENT). Safe for free/anon.
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Rotate3d } from 'lucide-react'
import { ArrowRight, Fire, Target, Gauge, Check, X as XIcon, Asterisk } from '@phosphor-icons/react'
import { buttonClasses } from '@/app/components/buttonClasses'
import { usePremiumStatus } from '@/app/components/billing/usePremiumStatus'
import { HeaderSocials } from '@/app/components/HeaderSocials'
import { SiteFooter } from '@/app/components/SiteFooter'
import { BRAIN_TEASER } from '@/app/lib/andromeda-brain-teaser.generated'

// AI Canvas site palette: sand neutrals + olive accent, Manrope + mono fonts.
const C = { base: '#0E0E0F', node: '#9B9B9E', reason: '#B7B7BA', bright: '#F4F4FA', accent: '#DAE4A0', accentBtn: '#A8B94D', muted: '#7B7B7D' }
const SANS = "var(--font-sans), 'Manrope', system-ui, sans-serif"
const MONO = "var(--font-mono, var(--font-jetbrains-mono)), 'Geist Mono', monospace"
const MODEL_URL = '/models/brain.glb'

const FND: readonly string[] = BRAIN_TEASER.sections.find((s) => s.id === 'foundations')?.files ?? []
const CMP: readonly string[] = BRAIN_TEASER.sections.find((s) => s.id === 'component-rules')?.files ?? []
const SK: readonly string[] = BRAIN_TEASER.sections.find((s) => s.id === 'skills')?.files ?? []
const take = (arr: readonly string[], n: number) => { const step = Math.max(1, Math.floor(arr.length / n)); const o: string[] = []; for (let i = 0; i < arr.length && o.length < n; i += step) o.push(arr[i]); return o }
const LABELS: string[] = [
  ...take(FND, 6), ...take(CMP, 12),
  'color is measurement', 'one frame per surface', 'must · should · may', 'movement signals data',
]

// Bigger, higher-hierarchy "hero" labels — the headline concepts of the brain.
const HERO_LABELS = ['Foundations', 'Component', 'Rules', 'Design Intent', 'tokens']

function mulberry32(seed: number) { return function () { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }

// Material presets the user can flip through live. `make(T)` builds a fresh
// material from the (dynamically imported) three module; `pulse` = teal emissive breathing.
// Activation zones — distinct-colored regions that light up like a functional brain map.
// Directions are in the normalized brain's unit space (left/right, frontal/occipital, etc.).
const ZONES: { dir: [number, number, number]; color: number }[] = [
  { dir: [-0.5, 0.25, 0.6], color: 0xff7a2f },   // L frontal — amber
  { dir: [0.5, 0.25, 0.6], color: 0x35d0ff },    // R frontal — cyan
  { dir: [-0.78, -0.08, 0.05], color: 0xff4f9a },// L temporal — magenta
  { dir: [0.78, -0.08, 0.05], color: 0x4f7bff }, // R temporal — blue
  { dir: [-0.4, 0.66, -0.1], color: 0x8ce04a },  // L parietal — lime
  { dir: [0.4, 0.66, -0.1], color: 0xffd23f },   // R parietal — gold
  { dir: [0.0, 0.16, -0.78], color: 0x22d3b8 },  // occipital — teal
  { dir: [0.0, -0.5, -0.55], color: 0xb06cff },  // cerebellum — violet
]

const MATERIALS: { name: string; pulse?: boolean; zones?: boolean; make: (T: any) => any }[] = [
  { name: 'Sand zones', zones: true, make: (T) => new T.MeshStandardMaterial({ color: 0x373738, metalness: 0.15, roughness: 0.6, envMapIntensity: 0.5 }) },
  { name: 'Gunmetal', pulse: true, make: (T) => new T.MeshStandardMaterial({ color: 0x191d20, metalness: 0.6, roughness: 0.42, emissive: new T.Color(C.accent), emissiveIntensity: 0.12, envMapIntensity: 0.85 }) },
  { name: 'Glass', make: (T) => new T.MeshPhysicalMaterial({ color: new T.Color(C.accent), transmission: 1, thickness: 0.8, roughness: 0.06, ior: 1.4, metalness: 0, transparent: true, envMapIntensity: 1.2, attenuationColor: new T.Color(C.accent), attenuationDistance: 1.4 }) },
  { name: 'Chrome', make: (T) => new T.MeshStandardMaterial({ color: 0xdfe6e9, metalness: 1, roughness: 0.14, envMapIntensity: 1.5 }) },
  { name: 'Wireframe', pulse: true, make: (T) => new T.MeshStandardMaterial({ color: new T.Color(C.accentBtn), wireframe: true, emissive: new T.Color(C.accentBtn), emissiveIntensity: 0.6, metalness: 0, roughness: 1 }) },
  { name: 'Iridescent', make: (T) => new T.MeshPhysicalMaterial({ color: 0x0b0f12, metalness: 0.9, roughness: 0.3, iridescence: 1, iridescenceIOR: 1.3, envMapIntensity: 1.1 }) },
]
// Default appearance of the brain on load.
const DEFAULT_MATERIAL = Math.max(0, MATERIALS.findIndex((m) => m.name === 'Wireframe'))

// ── editorial copy helpers ──────────────────────────────────────────────────
// sand tokens: sand-900 #1B1B1C surface, sand-800 #2D2D2E border
const PANEL: React.CSSProperties = { background: 'transparent', border: '1px solid #2D2D2E', borderRadius: 16, padding: '24px 28px' }
// Smaller sibling of PANEL — the solid-surface card treatment reused by the
// bento side tiles and the "How it works" benefit cards.
const PANEL_SOLID: React.CSSProperties = { background: '#1B1B1C', border: '1px solid #2D2D2E', borderRadius: 12, padding: 20 }
function Chip({ children }: { children: React.ReactNode }) {
  return <span style={{ fontFamily: MONO, fontSize: 12, color: C.reason, background: '#1B1B1C', border: '1px solid #2D2D2E', borderRadius: 6, padding: '3px 9px', whiteSpace: 'nowrap', display: 'inline-block' }}>{children}</span>
}
const STRUCTURE = [
  { label: 'Foundations', count: FND.length, sample: FND.slice(0, 6) },
  { label: 'Component rules', count: CMP.length, sample: CMP.slice(0, 8) },
  { label: 'Skills', count: SK.length, sample: SK.slice(0, 2) },
].filter((g) => g.count > 0)
const BENEFITS = [
  { label: 'Faster', icon: <Fire weight="regular" size={18} />, body: 'On-brand work from the first prompt, not the fifth attempt.' },
  { label: 'Accurate', icon: <Target weight="regular" size={18} />, body: "Builds on the rules and components that already exist, instead of a random AI's best guess." },
  { label: 'Efficient', icon: <Gauge weight="regular" size={18} />, body: 'Your agent already knows the rules and the look, so it skips the testing and exploring that would otherwise burn tokens.' },
]

// Classic workflow pains (left) vs what an AI-native system delivers (right).
// Right-side claims stay to what Andromeda + the Brain actually ship — code,
// tokens, and machine-readable rules. No Figma-to-code bridge is implied.
const COMPARE = [
  { classic: 'Documentation nobody reads, if it exists at all', native: 'Rules written down in a form your agent reads' },
  { classic: 'Designers in Figma, developers in code, intent lost in the handoff', native: 'No handoff: the system is already code and tokens' },
  { classic: 'Weeks from a mock-up to a production-ready screen', native: 'On-brand screens from the system on the first prompt' },
  { classic: 'New screens drift off-brand as the team grows', native: 'New work builds against the same rules, so it holds' },
  { classic: 'Every change is another Figma to code round trip', native: 'Change a token, and everything built on it follows' },
]

// Section separator: the AI Canvas wire mark, three across, like the homepage divider.
function WireDivider() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 64, margin: '48px 0' }} aria-hidden>
      {[0, 1, 2].map((i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src="/ai-canvas-wire.svg" alt="" width={28} height={24} />
      ))}
    </div>
  )
}

// Scroll-reveal wrapper — same recipe as the site's Section component on
// /pricing and /about (fade + rise on first entry, once: true). Kept local
// since this page styles with inline style objects, not Tailwind className.
function Section({ children, style, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={style}
    >
      {children}
    </motion.section>
  )
}

// Card-level reveal — smaller offset/duration than Section, matching the
// site's PlanCard sibling-stagger recipe (explicit delay = base + i * step).
function BenefitCard({ benefit, delay }: { benefit: (typeof BENEFITS)[number]; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ display: 'flex', flexDirection: 'column', ...PANEL_SOLID }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', width: 32, height: 32, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: '#2D2D2E', color: C.reason }}>
          {benefit.icon}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.bright }}>{benefit.label}</span>
      </div>
      <p style={{ flex: 1, fontSize: 14, color: C.node, lineHeight: 1.625, margin: 0 }}>{benefit.body}</p>
    </motion.div>
  )
}

export function BrainStoryV4() {
  const hostRef = useRef<HTMLDivElement>(null)
  const labelEls = useRef<(HTMLDivElement | null)[]>([])
  const heroEls = useRef<(HTMLDivElement | null)[]>([])
  // smoothed (eased) screen positions, parallel to labelEls/heroEls — lazily
  // seeded on the first frame each label is seen, see the render loop.
  const labelSmooth = useRef<Array<{ x: number; y: number } | undefined>>([])
  const heroSmooth = useRef<Array<{ x: number; y: number } | undefined>>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadProgress, setLoadProgress] = useState(0)
  const [matIndex, setMatIndex] = useState(DEFAULT_MATERIAL)

  // Premium subscribers already have the brain — re-label the CTA into the
  // viewer instead of pitching an upgrade. Treat the in-flight 'unknown' state
  // as open (NOT not-premium) so a paying customer is never flashed an upgrade
  // pitch while entitlement loads or if the API errors — same tri-state rule as
  // TemplateChrome/TopAuthPill. Anon/free derive to 'not-premium' synchronously,
  // and /explore is server-gated, so this never grants a free user access.
  const canOpen = usePremiumStatus() !== 'not-premium'
  const ctaLabel = canOpen ? 'Read the Brain' : 'Get the Brain with Premium'
  const ctaHref = canOpen ? '/design-systems/andromeda/brain/explore' : '/pricing'
  const matIndexRef = useRef(DEFAULT_MATERIAL)
  const applyRef = useRef<(i: number) => void>(() => {})
  const chooseMat = (i: number) => { matIndexRef.current = i; setMatIndex(i); applyRef.current(i) }

  // label positions spread over the WHOLE sphere around the brain (top, bottom, left, right,
  // front, back) via an even golden-angle spiral + a little jitter and varied distance.
  const dirs = useMemo(() => {
    const rnd = mulberry32(0x51a7)
    const n = LABELS.length
    const GA = Math.PI * (3 - Math.sqrt(5))
    return LABELS.map((_, i) => {
      const y = 1 - ((i + 0.5) / n) * 2            // +1 .. -1 (top to bottom)
      const rad = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = GA * i + rnd() * 0.7
      const dist = 1.02 + rnd() * 0.34             // float out around the brain
      return [Math.cos(theta) * rad * dist, y * dist, Math.sin(theta) * rad * dist] as [number, number, number]
    })
  }, [])

  // hero labels sit on their own wider ring so they read as the headline tier
  const heroDirs = useMemo(() => {
    const rnd = mulberry32(0x2b1d)
    const n = HERO_LABELS.length
    const GA = Math.PI * (3 - Math.sqrt(5))
    return HERO_LABELS.map((_, i) => {
      const y = 1 - ((i + 0.5) / n) * 2
      const rad = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = GA * i + 1.2 + rnd() * 0.5
      const dist = 1.42 + rnd() * 0.22
      return [Math.cos(theta) * rad * dist, y * dist, Math.sin(theta) * rad * dist] as [number, number, number]
    })
  }, [])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let alive = true, raf = 0
    let renderer: any, scene: any, camera: any, pmrem: any
    let onResize = () => {}
    let cleanupInput = () => {}

    ;(async () => {
      const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/environments/RoomEnvironment.js'),
      ])
      if (!alive) return

      // one-time, mount-only constrained-device/connection check — a lower
      // static pixel-ratio cap for slow connections or low core counts. Not a
      // live watchdog: decided once here and never revisited.
      const conn = (navigator as any).connection
      const isConstrained = conn?.saveData || ['slow-2g', '2g', '3g'].includes(conn?.effectiveType) || (navigator.hardwareConcurrency ?? 8) <= 4

      let W = host.clientWidth || 800, H = host.clientHeight || 600
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
      renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isConstrained ? 1 : 1.5))
      renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1
      host.appendChild(renderer.domElement)

      scene = new THREE.Scene(); scene.background = new THREE.Color(C.base)

      // kick the GLTF fetch off as early as correctness allows — right after
      // scene exists (onLoad only needs scene.add(model) + THREE + the state
      // below), BEFORE the GPU-bound PMREM/env-map generation and lights/camera
      // setup that used to run first and delay the fetch for no reason.
      let firefly: any = null, flyLight: any = null, brainRoot: any = null, radius = 1, ready = false
      let zonesActive = false, zoneGroup: any = null
      const brainMeshes: any[] = [], zoneItems: any[] = []

      const loader = new GLTFLoader()
      loader.load(MODEL_URL, (gltf: any) => {
        if (!alive) return
        const model = gltf.scene
        model.traverse((o: any) => { if (o.isMesh) brainMeshes.push(o) })
        scene.add(model)
        // Poly models are often authored off-origin and at arbitrary scale.
        // Update world matrices first, then normalize to unit radius + recenter,
        // so the camera framing is reliable regardless of the source model.
        model.updateWorldMatrix(true, true)
        let mbox = new THREE.Box3().setFromObject(model)
        let msph = mbox.getBoundingSphere(new THREE.Sphere())
        model.scale.setScalar(1 / (msph.radius || 1))
        model.updateWorldMatrix(true, true)
        mbox = new THREE.Box3().setFromObject(model)
        msph = mbox.getBoundingSphere(new THREE.Sphere())
        model.position.sub(msph.center)
        radius = 1
        brainRoot = model

        const applyMaterial = (i: number) => {
          const preset = MATERIALS[i] || MATERIALS[0]
          zonesActive = !!preset.zones
          for (const mesh of brainMeshes) { const mat = preset.make(THREE); mat.userData.pulse = !!preset.pulse; mesh.material = mat }
        }
        applyMaterial(matIndexRef.current)
        applyRef.current = applyMaterial

        // procedural firefly (the brain model has none) — a teal bulb that carries its own light
        firefly = new THREE.Group()
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.03, 16, 16), new THREE.MeshBasicMaterial({ color: C.accent }))
        flyLight = new THREE.PointLight(new THREE.Color(C.accent), 7, radius * 3.2, 2)
        firefly.add(bulb, flyLight)
        scene.add(firefly)

        // activation zones: per-region colored point light ONLY. We see the coloured light
        // reflected on the brain, never a visible spot/source. Rotated to match the brain.
        zoneGroup = new THREE.Group()
        ZONES.forEach((z, k) => {
          const dir = new THREE.Vector3(z.dir[0], z.dir[1], z.dir[2])
          const light = new THREE.PointLight(new THREE.Color(z.color), 0, 1.9, 2)
          light.position.copy(dir).multiplyScalar(1.2)
          zoneGroup.add(light)
          zoneItems.push({ light, phase: k * 1.3, freq: 0.45 + (k % 5) * 0.13 })
        })
        zoneGroup.visible = false
        scene.add(zoneGroup)

        ready = true; setStatus('ready')
        // the render loop only starts once there's something to actually
        // render — no more compositing an empty scene while the asset streams in.
        loop()
      }, (event: ProgressEvent) => {
        if (alive && event.total) setLoadProgress(Math.round((event.loaded / event.total) * 100))
      }, () => { if (alive) setStatus('error') })

      pmrem = new THREE.PMREMGenerator(renderer)
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      // @ts-ignore r183 scene intensity
      scene.environmentIntensity = 0.4
      scene.add(new THREE.AmbientLight(0xffffff, 0.16))
      const key = new THREE.DirectionalLight(0xeaf2ff, 1.25); key.position.set(3, 4, 5); scene.add(key)
      const rim = new THREE.DirectionalLight(new THREE.Color(C.accent), 0.9); rim.position.set(-4, 1, -3); scene.add(rim)

      camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 100)
      camera.position.set(0, 0.3, 3)

      onResize = () => {
        W = host.clientWidth || W; H = host.clientHeight || H
        renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      // drag-to-spin state (replaces the old hover-to-chase). Idle is untouched.
      const spin = { active: false, lastX: 0, lastY: 0, rotX: 0, rotY: 0, velY: 0 }
      const onDown = (e: PointerEvent) => {
        spin.active = true; spin.lastX = e.clientX; spin.lastY = e.clientY; spin.velY = 0
        try { host.setPointerCapture(e.pointerId) } catch {}
        host.style.cursor = 'grabbing'
      }
      const onMove = (e: PointerEvent) => {
        if (!spin.active) return
        const dx = e.clientX - spin.lastX, dy = e.clientY - spin.lastY
        spin.lastX = e.clientX; spin.lastY = e.clientY
        spin.velY = dx * 0.006
        spin.rotY += spin.velY
        spin.rotX = Math.max(-0.7, Math.min(0.7, spin.rotX + dy * 0.006))
      }
      const onUp = () => { spin.active = false; host.style.cursor = 'grab' }
      host.addEventListener('pointerdown', onDown)
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      cleanupInput = () => {
        host.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }

      const clock = new THREE.Clock()
      let runningT = 0
      const flyPos = new THREE.Vector3(), wp = new THREE.Vector3(), projScratch = new THREE.Vector3()
      const spinEuler = new THREE.Euler(), spinQuat = new THREE.Quaternion()

      const loop = () => {
        raf = requestAnimationFrame(loop)
        // cap dt so a CPU stall / backgrounded tab pauses motion instead of
        // teleporting it; a real clock instead of a frame-count assumption is
        // what keeps drag inertia and label positions deterministic in time.
        const dt = Math.min(clock.getDelta(), 1 / 30)
        runningT += dt
        const t = runningT
        const transitionDuration = spin.active ? '0ms' : '90ms, 140ms'

        if (ready) {
          const R = radius
          // organic (non-linear) firefly flight around the brain
          const a1 = t * 0.62, a2 = t * 0.37
          flyPos.set(
            Math.cos(a1) * R * 0.98 + Math.sin(a2 * 1.3) * R * 0.16,
            Math.sin(a1 * 0.8) * R * 0.42 + Math.cos(t * 0.9) * R * 0.12 + R * 0.12,
            Math.sin(a1) * R * 0.98 + Math.cos(a2 * 0.7) * R * 0.16,
          )
          if (firefly) firefly.position.copy(flyPos)
          if (flyLight) flyLight.intensity = 6 + Math.sin(t * 6) * 1.5
          for (const mesh of brainMeshes) { const mat = mesh.material; if (mat?.userData?.pulse) mat.emissiveIntensity = 0.1 + 0.05 * Math.sin(t * 1.4) }

          // camera: the idle orbit only (the default state — unchanged)
          const orb = t * 0.12, d = R * 2.6
          camera.position.set(Math.sin(orb) * d, R * 0.35, Math.cos(orb) * d)
          camera.lookAt(0, R * 0.05, 0)

          // drag-to-spin the brain, with release inertia (decay rate is per
          // real second via dt * 60, not per frame — same feel at any fps)
          if (!spin.active) { spin.rotY += spin.velY; spin.velY *= Math.pow(0.94, dt * 60) }
          if (brainRoot) brainRoot.rotation.set(spin.rotX, spin.rotY, 0)
          spinQuat.setFromEuler(spinEuler.set(spin.rotX, spin.rotY, 0))
          const activity = Math.min(1, Math.abs(spin.velY) * 34 + (spin.active ? 0.7 : 0))

          // activation zones: colored spots that pulse on/off across regions, spinning with the brain
          if (zoneGroup) {
            zoneGroup.visible = zonesActive
            if (zonesActive) {
              zoneGroup.rotation.set(spin.rotX, spin.rotY, 0)
              for (const zi of zoneItems) {
                const act = Math.pow(0.5 + 0.5 * Math.sin(t * zi.freq + zi.phase), 2.4)
                zi.light.intensity = act * 5.5
              }
            }
          }

          // labels: rotate WITH the brain (dragging carries them past the firefly), light up near it
          const ease = 1 - Math.exp(-18 * dt)
          for (let i = 0; i < dirs.length; i++) {
            const el = labelEls.current[i]; if (!el) continue
            wp.set(dirs[i][0], dirs[i][1], dirs[i][2]).multiplyScalar(R).applyQuaternion(spinQuat)
            const near = 1 - Math.min(1, wp.distanceTo(flyPos) / (R * 0.9))
            projScratch.copy(wp).project(camera)
            const behind = projScratch.z > 1
            const targetX = Math.max(70, Math.min(W - 70, (projScratch.x * 0.5 + 0.5) * W)), targetY = (-projScratch.y * 0.5 + 0.5) * H
            let sm = labelSmooth.current[i]
            if (!sm) { sm = { x: targetX, y: targetY }; labelSmooth.current[i] = sm }
            sm.x += (targetX - sm.x) * ease; sm.y += (targetY - sm.y) * ease
            const op = behind ? 0 : Math.min(1, 0.12 + 0.88 * near * near + activity * 0.5)
            el.style.transform = `translate(-50%,-50%) translate(${Math.round(sm.x)}px,${Math.round(sm.y)}px) scale(${0.9 + near * 0.25})`
            el.style.opacity = String(op)
            el.style.color = near > 0.55 ? C.accent : C.node
            el.style.transitionDuration = transitionDuration
          }

          // hero labels — bigger, brighter, always fairly present
          for (let i = 0; i < heroDirs.length; i++) {
            const el = heroEls.current[i]; if (!el) continue
            wp.set(heroDirs[i][0], heroDirs[i][1], heroDirs[i][2]).multiplyScalar(R).applyQuaternion(spinQuat)
            const near = 1 - Math.min(1, wp.distanceTo(flyPos) / (R * 1.1))
            projScratch.copy(wp).project(camera)
            const behind = projScratch.z > 1
            const targetX = Math.max(110, Math.min(W - 110, (projScratch.x * 0.5 + 0.5) * W)), targetY = (-projScratch.y * 0.5 + 0.5) * H
            let sm = heroSmooth.current[i]
            if (!sm) { sm = { x: targetX, y: targetY }; heroSmooth.current[i] = sm }
            sm.x += (targetX - sm.x) * ease; sm.y += (targetY - sm.y) * ease
            const op = behind ? 0 : Math.min(1, 0.42 + 0.58 * near + activity * 0.4)
            el.style.transform = `translate(-50%,-50%) translate(${Math.round(sm.x)}px,${Math.round(sm.y)}px) scale(${0.96 + near * 0.14})`
            el.style.opacity = String(op)
            el.style.color = near > 0.5 ? C.accent : C.bright
            el.style.transitionDuration = transitionDuration
          }
        }
        renderer.render(scene, camera)
      }
      // first loop() call now happens inside the GLTF onLoad callback above,
      // once ready — see the "ready = true" line.
    })().catch(() => { if (alive) setStatus('error') })

    return () => {
      alive = false; cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); cleanupInput()
      // forceContextLoss releases the actual WebGL context (browsers cap ~16);
      // dispose() alone leaks it, so repeated mounts of the story would run out.
      try { pmrem?.dispose(); try { renderer?.forceContextLoss() } catch {} renderer?.dispose(); if (renderer?.domElement && host.contains(renderer.domElement)) host.removeChild(renderer.domElement) } catch {}
    }
  }, [dirs])

  const total = BRAIN_TEASER.totalFiles, foundationsN = FND.length, rulesN = CMP.length, skillsN = SK.length
  const STATS = [
    { n: foundationsN, label: 'foundations' },
    { n: rulesN, label: 'component rules' },
    { n: skillsN, label: 'skills' },
    { n: total, label: 'files of design intent' },
  ].filter((s) => s.n > 0)

  return (
    <div style={{ minHeight: '100vh', background: C.base, display: 'flex', flexDirection: 'column' }}>
      {/* top tab — left-aligned breadcrumb (Andromeda -> overview, current page
          in olive), consistent with the content pages' breadcrumb pattern. */}
      <header className="sticky top-0 z-50 hidden h-14 items-center justify-between gap-4 border-b border-sand-800 bg-sand-950 px-6 md:flex">
        <nav aria-label="Breadcrumb" className="min-w-0 truncate text-sm font-semibold">
          <Link href="/design-systems/andromeda" className="text-sand-400 transition-colors hover:text-sand-100">
            Andromeda
          </Link>
          <span className="mx-1 text-sand-600">/</span>
          <span className="text-olive-500">Andromeda Brain</span>
        </nav>
        <div className="flex items-center justify-end">
          <HeaderSocials />
        </div>
      </header>

      {/* 3D hero — centered, top */}
      <div style={{ position: 'relative', height: '64vh', minHeight: 420 }}>
        <div
          ref={hostRef}
          style={{ position: 'absolute', inset: 0, cursor: 'grab', touchAction: 'pan-y' }}
        />
        {/* appearance stepper — vertical ticks on the right, centered with the
            brain. No labels (the material name shows as a native tooltip on
            hover); each tick steps the brain's look. */}
        <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          {MATERIALS.map((mm, i) => (
            <button
              key={mm.name}
              onClick={() => chooseMat(i)}
              title={mm.name}
              aria-label={`Appearance: ${mm.name}`}
              aria-pressed={i === matIndex}
              style={{ display: 'block', cursor: 'pointer', background: 'transparent', border: 'none', padding: '12px 8px', lineHeight: 0 }}
            >
              <span
                style={{
                  display: 'block',
                  height: 2,
                  width: i === matIndex ? 30 : 16,
                  borderRadius: 2,
                  background: i === matIndex ? C.accentBtn : C.node,
                  opacity: i === matIndex ? 1 : 0.5,
                  transition: 'width .2s ease, background .2s ease, opacity .2s ease',
                }}
              />
            </button>
          ))}
        </div>
        {/* floating labels layer */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {LABELS.map((txt, i) => (
            <div
              key={txt}
              ref={(el) => { labelEls.current[i] = el }}
              style={{ position: 'absolute', top: 0, left: 0, opacity: 0, fontFamily: MONO, fontSize: 12, letterSpacing: '0.02em', color: C.node, whiteSpace: 'nowrap', textShadow: '0 0 8px rgba(0,0,0,0.9)', willChange: 'transform,opacity', transition: 'transform 90ms linear, opacity 140ms linear' }}
            >
              {txt}
            </div>
          ))}
        </div>
        {/* hero labels layer (bigger / higher hierarchy) */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {HERO_LABELS.map((txt, i) => (
            <div
              key={txt}
              ref={(el) => { heroEls.current[i] = el }}
              style={{ position: 'absolute', top: 0, left: 0, opacity: 0, fontFamily: SANS, fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: C.bright, whiteSpace: 'nowrap', textShadow: '0 0 14px rgba(0,0,0,0.95)', willChange: 'transform,opacity', transition: 'transform 90ms linear, opacity 140ms linear' }}
            >
              {txt}
            </div>
          ))}
        </div>
        {status !== 'ready' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>
            {status === 'error' ? 'Scene unavailable' : loadProgress > 0 ? `Loading the brain… ${loadProgress}%` : 'Loading the brain…'}
          </div>
        )}
        {/* drag affordance: a static rotate-3d icon (olive) */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <Rotate3d size={26} color={C.accent} strokeWidth={1.5} />
        </div>
      </div>

      {/* ── Hero caption (centered) — homepage hero sizes: h1 text-2xl sm:text-4xl, sub text-base ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', fontFamily: SANS, padding: '28px 24px 0' }}>
        <h1 style={{ fontSize: 'clamp(24px,4.5vw,36px)', color: C.bright, fontWeight: 800, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>
          The Andromeda <span style={{ color: C.accentBtn }}>Brain</span>
        </h1>
        <p style={{ fontSize: 16, color: C.node, maxWidth: 576, lineHeight: 1.625, margin: '16px 0 0', fontWeight: 400 }}>
          Tokens and components are the pieces. The Brain is the judgment that assembles them: every rule, foundation, and skill your AI agent reads, so what it builds already matches the system instead of a guess.
        </p>
        {/* two CTAs, same hierarchy as the homepage hero (primary olive + outline). Premium
            branch: the gate routes premium users to the brain viewer when this becomes the real page. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <Link href={ctaHref} className={buttonClasses({ variant: 'primary', size: 'lg' })}>
            {ctaLabel}
            <ArrowRight weight="regular" size={14} />
          </Link>
          <Link href="/design-systems/andromeda" className={buttonClasses({ variant: 'outline', size: 'lg' })}>
            Explore Andromeda
          </Link>
        </div>
      </div>

      {/* 3-icon wire divider directly below the hero */}
      <WireDivider />

      {/* ── Editorial sections (left-aligned, framed panels). max-w-4xl (896) + sm:px-6, matches the homepage content column. ── */}
      <div style={{ width: '100%', maxWidth: 896, margin: '0 auto', padding: '8px 24px 8px', fontFamily: SANS }}>

        {/* Why it exists — the system is built to grow */}
        <Section>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>Why it exists</p>
          <h2 style={{ fontSize: 20, color: C.bright, fontWeight: 700, letterSpacing: '-0.01em', margin: '6px 0 0' }}>
            Built to grow, not to freeze
          </h2>
          <style>{`
            .why-bento {
              display: grid;
              grid-template-columns: repeat(24, minmax(0, 1fr));
              grid-template-areas:
                "grow grow grow grow grow grow grow grow grow grow beyond beyond beyond beyond beyond beyond beyond beyond beyond beyond beyond beyond beyond beyond"
                "grow grow grow grow grow grow grow grow grow grow experiment experiment experiment experiment experiment experiment experiment trust trust trust trust trust trust trust";
              gap: 14px;
              margin-top: 24px;
            }
            .why-bento-grow { grid-area: grow; }
            .why-bento-beyond { grid-area: beyond; }
            .why-bento-experiment { grid-area: experiment; }
            .why-bento-trust { grid-area: trust; }
            @media (max-width: 720px) {
              .why-bento {
                grid-template-columns: 1fr;
                grid-template-areas: none;
              }
              .why-bento-grow,
              .why-bento-beyond,
              .why-bento-experiment,
              .why-bento-trust { grid-area: auto; }
            }
          `}</style>

          <div className="why-bento">
            <div className="why-bento-grow" style={{ ...PANEL, minHeight: 236, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.accentBtn }}>01 · Built to evolve</span>
              <div style={{ marginTop: 40 }}>
                <p style={{ fontSize: 'clamp(24px,3.5vw,34px)', color: C.bright, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.08, margin: 0 }}>
                  A system that grows with the work.
                </p>
                <p style={{ fontSize: 14, color: C.node, lineHeight: 1.625, margin: '16px 0 0' }}>
                  Most design systems hand you a fixed kit and stop. The Brain is built the other way: to grow, not freeze.
                </p>
              </div>
            </div>

            <div className="why-bento-beyond" style={{ ...PANEL_SOLID }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.accentBtn }}>02 · Go beyond</span>
              <h3 style={{ fontSize: 18, color: C.bright, fontWeight: 700, letterSpacing: '-0.01em', margin: '16px 0 0' }}>Past the screens that already exist</h3>
              <p style={{ fontSize: 14, color: C.node, lineHeight: 1.625, margin: '10px 0 0' }}>
                Because the rules are written down, your agent can create new work that is still unmistakably Andromeda.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
                <Chip>Compose layouts</Chip>
                <Chip>Extend patterns</Chip>
                <Chip>Explore components</Chip>
              </div>
            </div>

            <div className="why-bento-experiment" style={{ ...PANEL_SOLID, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.accentBtn }}>03 · Experiment fast</span>
              <p style={{ fontSize: 20, color: C.bright, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25, margin: 0 }}>
                Try an idea.<br />Push it further.
              </p>
            </div>

            <div className="why-bento-trust" style={{ ...PANEL_SOLID, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.accentBtn }}>Built on the rules</span>
              <p style={{ fontSize: 14, color: C.reason, lineHeight: 1.625, margin: '24px 0 0' }}>
                Trust that what comes back belongs to the system because it was built against the same rules.
              </p>
            </div>
          </div>
        </Section>

        {/* What it is */}
        <Section style={{ marginTop: 60 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>The design brain</p>
          <h2 style={{ fontSize: 20, color: C.bright, fontWeight: 700, letterSpacing: '-0.01em', margin: '6px 0 0' }}>
            The taste lives in the system, not the prompt
          </h2>
          <p style={{ fontSize: 16, color: C.node, lineHeight: 1.7, margin: '16px 0 0' }}>
            Andromeda already gives you <Chip>tokens</Chip> and <Chip>components</Chip>. The Brain adds the part usually{' '}
            <strong style={{ color: C.bright, fontWeight: 600 }}>trapped in a designer&apos;s head, or buried in documentation nobody reads</strong>: when a color carries meaning, how motion should behave, what every state owes the user. It writes that reasoning down in a form{' '}
            <strong style={{ color: C.bright, fontWeight: 600 }}>an agent actually reads</strong>, so your tools build to it instead of guessing, and the screens come out on-brand the first time.
          </p>

          <div style={{ ...PANEL, marginTop: 28 }}>
            {STRUCTURE.map((g, gi) => (
              <div key={g.label} style={{ marginTop: gi === 0 ? 0 : 20, paddingTop: gi === 0 ? 0 : 20, borderTop: gi === 0 ? 'none' : '1px solid #2D2D2E' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>{g.label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: C.accent, fontWeight: 700 }}>{g.count}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {g.sample.map((name) => <Chip key={name}>{name}</Chip>)}
                  {g.count > g.sample.length && <Chip>+{g.count - g.sample.length} more</Chip>}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Classic vs AI-native — the workflow contrast */}
        <Section style={{ marginTop: 60 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>The difference</p>
          <h2 style={{ fontSize: 20, color: C.bright, fontWeight: 700, letterSpacing: '-0.01em', margin: '6px 0 0' }}>
            Where the classic workflow leaks
          </h2>
          <p style={{ fontSize: 16, color: C.node, lineHeight: 1.7, margin: '16px 0 24px' }}>
            The classic workflow loses time and intent at every step from Figma to production. When the system is already code and tokens, those steps disappear.
          </p>

          <style>{`
            .cmp-grid { display: grid; grid-template-columns: 1fr 1fr; }
            .cmp-cell { padding: 14px 18px; display: flex; gap: 10px; align-items: flex-start; }
            @media (max-width: 600px) {
              .cmp-grid { grid-template-columns: 1fr; }
              .cmp-left { border-right: none !important; }
            }
          `}</style>
          <div style={{ border: '1px solid #2D2D2E', borderRadius: 16, overflow: 'hidden' }}>
            <div className="cmp-grid">
              <div className="cmp-cell cmp-left" style={{ borderRight: '1px solid #2D2D2E', borderBottom: '1px solid #2D2D2E', fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>
                Classic design system
              </div>
              <div className="cmp-cell" style={{ borderBottom: '1px solid #2D2D2E', background: 'rgba(168,185,77,0.05)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.accentBtn }}>
                AI-native design system
              </div>
            </div>
            {COMPARE.map((row, i) => (
              <div key={i} className="cmp-grid">
                <div className="cmp-cell cmp-left" style={{ borderRight: '1px solid #2D2D2E', borderTop: i === 0 ? 'none' : '1px solid #2D2D2E' }}>
                  <XIcon weight="regular" size={15} color={C.muted} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: C.node, lineHeight: 1.5 }}>{row.classic}</span>
                </div>
                <div className="cmp-cell" style={{ borderTop: i === 0 ? 'none' : '1px solid #2D2D2E', background: 'rgba(168,185,77,0.05)' }}>
                  <Check weight="regular" size={15} color={C.accentBtn} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: C.bright, lineHeight: 1.5 }}>{row.native}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, border: '1px solid #2D2D2E', borderRadius: 16, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(168,185,77,0.05)' }}>
            <Asterisk weight="regular" size={16} color={C.accentBtn} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: C.accentBtn, lineHeight: 1.5 }}>
              The agent builds fast and accurate. You stay in the loop, and you decide what ships.
            </span>
          </div>
        </Section>

        {/* How it works */}
        <Section style={{ marginTop: 60 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>How it works</p>
          <h2 style={{ fontSize: 20, color: C.bright, fontWeight: 700, letterSpacing: '-0.01em', margin: '6px 0 0' }}>
            One reader. Every benefit is yours.
          </h2>
          <p style={{ fontSize: 16, color: C.node, lineHeight: 1.7, margin: '16px 0 0' }}>
            The Brain is written for your AI agent to read. The agent follows the rules, and you get the results: on-brand UI without the guesswork.
          </p>
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
            {BENEFITS.map((benefit, i) => (
              <BenefitCard key={benefit.label} benefit={benefit} delay={0.1 + i * 0.08} />
            ))}
          </div>
        </Section>

        {/* Closing: by the numbers */}
        <Section style={{ marginTop: 60, marginBottom: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontFamily: MONO, fontSize: 14 }}>
            {STATS.map((s, i) => (
              <span key={s.label} style={{ display: 'contents' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span style={{ color: C.accent, fontWeight: 700 }}>{s.n}</span>
                  <span style={{ color: C.muted, marginLeft: 6 }}>{s.label}</span>
                </span>
                {i < STATS.length - 1 && <span style={{ color: C.muted, margin: '0 12px' }}>·</span>}
              </span>
            ))}
          </div>
          <Link href={ctaHref} className={buttonClasses({ variant: 'primary', size: 'lg' })} style={{ marginTop: 24 }}>
            {ctaLabel}
            <ArrowRight weight="regular" size={14} />
          </Link>
        </Section>
      </div>

      {/* footer, consistent with the content pages */}
      <div style={{ width: '100%', maxWidth: 896, margin: '0 auto', padding: '0 24px 24px', fontFamily: SANS }}>
        <SiteFooter />
      </div>
    </div>
  )
}
