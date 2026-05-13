'use client'

// npm install three framer-motion

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import * as THREE from 'three'

// Inline theme reader — observes `.dark` on `<html>` and an optional
// `[data-card-theme]` ancestor (per-card override on the homepage grid).
// Kept inline so this file is self-contained when copy-pasted.
function useScopedTheme(ref: React.RefObject<HTMLElement | null>) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const readTheme = () => {
      const scope = element.closest('[data-card-theme]') as HTMLElement | null
      if (scope) {
        setTheme(scope.dataset.cardTheme === 'dark' ? 'dark' : 'light')
        return
      }
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }
    readTheme()
    const observers: MutationObserver[] = []
    let current: HTMLElement | null = element
    while (current) {
      const obs = new MutationObserver(readTheme)
      obs.observe(current, { attributes: true, attributeFilter: ['class', 'data-card-theme'] })
      observers.push(obs)
      current = current.parentElement
    }
    const htmlObs = new MutationObserver(readTheme)
    htmlObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    observers.push(htmlObs)
    return () => observers.forEach((o) => o.disconnect())
  }, [ref])
  return theme
}

// ─── Shaders ──────────────────────────────────────────────────────────────────

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uActive;        // 0..1 lerp toward "alert"
  uniform vec2  uLook;          // -1..1, current look direction (cursor or idle script)
  uniform float uReduce;        // 1 = motion allowed, 0 = motion frozen

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vLocalPos;       // original mesh position — for stable surface speckles
  varying vec3 vViewPos;        // view-space position — fragment derives the displaced normal from this

  // Classic 3D simplex noise — Ashima Arts / Stefan Gustavson, MIT.
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
              i.z+vec4(0.,i1.z,i2.z,1.))
            + i.y+vec4(0.,i1.y,i2.y,1.))
            + i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=1./7.;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vLocalPos = position;            // stable surface coord — speckles stick here
    vec3 pos  = position;
    float t   = uTime * uReduce;

    // Slow anisotropic stretch — orb morphs through ovoid orientations over time.
    float ax = sin(t * 0.27 + 0.0) * 0.16;
    float ay = sin(t * 0.19 + 1.7) * 0.20;
    float az = sin(t * 0.23 + 3.1) * 0.12;
    pos *= vec3(1.0 + ax, 1.0 + ay, 1.0 + az);

    // Two octaves — keep the surface glossier/smoother for the new aesthetic.
    float nLow = snoise(pos * 0.55 + vec3( t * 0.18,  t * 0.13, -t * 0.15));
    float nMid = snoise(pos * 1.45 + vec3(-t * 0.22,  t * 0.20,  t * 0.18));

    // Look direction biases the noise sample — the "face" bulges where it looks.
    vec3 lookDir = vec3(uLook, 0.55);
    float facing = clamp(dot(normalize(pos), normalize(lookDir)), 0.0, 1.0);
    float bulge  = pow(facing, 2.5) * (0.08 + uActive * 0.10);

    // Gentle breath — overall radial pulse, very slow.
    float breath = sin(t * 0.55) * 0.022;

    float amp = mix(0.20, 0.34, uActive);
    float displacement = (nLow * 0.66 + nMid * 0.34) * amp + bulge + breath;

    pos += normal * displacement;

    vec4 mv  = modelViewMatrix * vec4(pos, 1.0);
    vNormal  = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec3  uBase;
  uniform vec3  uRimA;     // cyan rim (upper-left light)
  uniform vec3  uRimB;     // magenta rim (lower-right light)
  uniform vec3  uSpeckA;   // electric pink speckle
  uniform vec3  uSpeckB;   // electric cyan speckle
  uniform float uActive;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vLocalPos;
  varying vec3 vViewPos;

  // Simplex 3D noise — same as vertex, needed for speckle sampling.
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
              i.z+vec4(0.,i1.z,i2.z,1.))
            + i.y+vec4(0.,i1.y,i2.y,1.))
            + i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=1./7.;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    // True surface normal derived from view-space position derivatives — picks
    // up the actual wrinkles/ridges from the displaced geometry instead of the
    // smooth icosahedron normal. Gives proper shadow-in-valley, highlight-on-
    // ridge shading.
    vec3 dx = dFdx(vViewPos);
    vec3 dy = dFdy(vViewPos);
    vec3 n  = normalize(cross(dx, dy));
    vec3 v  = normalize(-vViewPos);

    // Fresnel — bright at glancing angles, dark where the surface faces us.
    float fres = 1.0 - clamp(dot(n, v), 0.0, 1.0);

    // ── Diffuse 3D lighting on the body ───────────────────────────────────────
    // Two soft lights: warm-cyan key from upper-left-front, cool-magenta fill
    // from lower-right. Combined with derivative normal, this makes wrinkle
    // ridges catch light and valleys fall into shadow.
    vec3 keyDir  = normalize(vec3(-0.45,  0.70,  0.85));
    vec3 fillDir = normalize(vec3( 0.65, -0.35,  0.55));

    float diffKey  = max(0.0, dot(n, keyDir));
    float diffFill = max(0.0, dot(n, fillDir));

    // Ambient + key + fill — wrap the body in directional light so ridges and
    // valleys actually read as 3D.
    vec3 lit = uBase * (0.30 + diffKey * 0.95 + diffFill * 0.45);

    // ── Two-tone rim lights ──────────────────────────────────────────────────
    vec3 dirCyan    = normalize(vec3(-0.70,  0.55,  0.50));
    vec3 dirMagenta = normalize(vec3( 0.75, -0.30,  0.50));

    float cyanWrap    = max(0.0, dot(n, dirCyan));
    float magentaWrap = max(0.0, dot(n, dirMagenta));

    float rimCoreP = mix(2.2, 1.7, uActive);
    float rimCyan    = pow(cyanWrap,    1.3) * pow(fres, rimCoreP);
    float rimMagenta = pow(magentaWrap, 1.3) * pow(fres, rimCoreP);

    // ── Specular highlight on ridges ─────────────────────────────────────────
    // Blinn-half-vector style spec from the key light — puts a moving glint on
    // ridges that face the light, sells the glossy / wet quality.
    vec3 halfKey = normalize(keyDir + v);
    float specKey = pow(max(0.0, dot(n, halfKey)), 32.0) * 0.55;

    vec3 col = lit
             + uRimA * rimCyan    * mix(1.10, 1.55, uActive)
             + uRimB * rimMagenta * mix(1.00, 1.45, uActive)
             + specKey * vec3(0.80, 0.95, 1.00);

    // ── Iridescent speckles (sparser than before) ────────────────────────────
    // Higher thresholds → ~half the previous density. Single big-scale layer
    // with a small-scale accent.
    float speckBig   = snoise(vLocalPos * 10.0);
    float speckSmall = snoise(vLocalPos * 24.0 + 1.7);
    float maskBig    = smoothstep(0.66, 0.74, speckBig);
    float maskSmall  = smoothstep(0.72, 0.78, speckSmall) * 0.40;
    float speckMask  = max(maskBig, maskSmall);

    // Per-cluster colour pick — biased toward pink, with cyan accents.
    float colorPick  = snoise(vLocalPos * 4.0 + 5.3);
    vec3  speckColor = mix(uSpeckA, uSpeckB, smoothstep(0.55, 0.75, colorPick));

    // Fade speckles in valley shadows so they read as surface, not stickers.
    float speckBody  = 1.0 - smoothstep(0.55, 0.95, fres);
    col += speckColor * speckMask * speckBody * 0.85;

    gl_FragColor = vec4(col, 1.0);
  }
`

// ─── Theme palette ────────────────────────────────────────────────────────────
// Dark teal body with two-tone rim (cyan / magenta) and iridescent pink+cyan
// speckles — same on both themes since the orb is intrinsically dark.

type Palette = {
  base:      [number, number, number]
  rimA:      [number, number, number]  // cyan rim — upper-left light
  rimB:      [number, number, number]  // magenta rim — lower-right light
  speckA:    [number, number, number]  // electric pink speckle
  speckB:    [number, number, number]  // electric cyan speckle
  eye:       string
  eyeGlow:   string
}

const PALETTE: Record<'dark' | 'light', Palette> = {
  dark: {
    base:    [0.050, 0.075, 0.085],
    rimA:    [0.380, 0.860, 0.940],
    rimB:    [0.730, 0.330, 0.940],
    speckA:  [0.880, 0.275, 0.985],
    speckB:  [0.400, 0.910, 1.000],
    eye:     'rgba(255, 140, 245, 0.85)',  // hot pink — slightly translucent so it glows rather than reads solid
    eyeGlow: 'rgba(225, 90, 230, 0.70)',   // saturated magenta halo
  },
  light: {
    base:    [0.075, 0.105, 0.120],
    rimA:    [0.400, 0.870, 0.940],
    rimB:    [0.745, 0.355, 0.940],
    speckA:  [0.895, 0.290, 0.985],
    speckB:  [0.420, 0.915, 1.000],
    eye:     'rgba(255, 150, 248, 0.88)',
    eyeGlow: 'rgba(225, 100, 230, 0.75)',
  },
}

// ─── Idle look-around script ─────────────────────────────────────────────────
// left → slightly right → slightly left → top → back, then loop.
// x and y are in normalised stage coords (-1..1). y is "up = negative".
const LOOK_SEQUENCE: { x: number; y: number; dur: number }[] = [
  { x: -0.65, y:  0.00, dur: 2400 },  // left
  { x:  0.32, y:  0.00, dur: 2800 },  // slightly right
  { x: -0.24, y:  0.00, dur: 2200 },  // slightly left
  { x:  0.00, y: -0.55, dur: 2800 },  // top
  { x:  0.00, y:  0.00, dur: 2600 },  // back
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function CuriousAi() {
  const containerRef = useRef<HTMLDivElement>(null) // outer chrome — theme scope
  const stageRef     = useRef<HTMLDivElement>(null) // inner square — pointer events + rect
  const canvasRef    = useRef<HTMLDivElement>(null) // canvas host
  const sizeRef      = useRef({ w: 320, h: 320 })

  // One source of truth for "where is the orb looking?":
  // pointer overrides during hover, idle script drives otherwise.
  const lookTargetRef  = useRef({ x: 0, y: 0 })  // desired
  const lookCurrentRef = useRef({ x: 0, y: 0 })  // smoothed
  const hoverActiveRef = useRef(false)

  // Alertness — how "awake" the orb is. Driven by hover/touch.
  const activeRef = useRef(0)
  const targetRef = useRef(0)

  // Eye HTML offset — driven from RAF loop using lookCurrentRef.
  const eyeX = useMotionValue(0)
  const eyeY = useMotionValue(0)
  const sx   = useSpring(eyeX, { stiffness: 200, damping: 22, mass: 0.4 })
  const sy   = useSpring(eyeY, { stiffness: 200, damping: 22, mass: 0.4 })

  const [blinkAt, setBlinkAt] = useState(0)
  // Eye open-state: idle (off-page) = 0.85, in container = 0.70, on orb = 0.32 (shrink).
  const [open,    setOpen]    = useState(0.85)

  const theme = useScopedTheme(containerRef)

  // ── Three.js scene ──────────────────────────────────────────────────────────
  useEffect(() => {
    const host = canvasRef.current
    if (!host) return

    const W = host.clientWidth  || 320
    const H = host.clientHeight || 320
    sizeRef.current = { w: W, h: H }

    const palette = PALETTE[theme]

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100)
    camera.position.z = 4.4

    // Transparent canvas — the orb breathes against whatever page bg is behind.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    host.appendChild(renderer.domElement)

    const detail = W < 400 ? 32 : 64
    const geo    = new THREE.IcosahedronGeometry(1, detail)

    const uniforms: Record<string, THREE.IUniform> = {
      uTime:   { value: 0 },
      uActive: { value: 0 },
      uLook:   { value: new THREE.Vector2(0, 0) },
      uReduce: { value: 1 },
      uBase:   { value: new THREE.Color(...palette.base) },
      uRimA:   { value: new THREE.Color(...palette.rimA) },
      uRimB:   { value: new THREE.Color(...palette.rimB) },
      uSpeckA: { value: new THREE.Color(...palette.speckA) },
      uSpeckB: { value: new THREE.Color(...palette.speckB) },
    }

    const mat = new THREE.ShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent:    true,
    })

    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyMotion = () => { uniforms.uReduce.value = mql.matches ? 0 : 1 }
    applyMotion()
    mql.addEventListener('change', applyMotion)

    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect
      if (!r) return
      const nw = Math.max(1, Math.floor(r.width))
      const nh = Math.max(1, Math.floor(r.height))
      sizeRef.current = { w: nw, h: nh }
      renderer.setSize(nw, nh)
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
    })
    ro.observe(host)

    let raf = 0
    const clock = new THREE.Clock()

    function tick() {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05)
      uniforms.uTime.value += dt

      // Alertness smoothing.
      const ka = 1 - Math.exp(-dt * 6)
      activeRef.current += (targetRef.current - activeRef.current) * ka
      uniforms.uActive.value = activeRef.current

      // Look direction smoothing — slower during idle script (deliberate gaze),
      // snappier under cursor (responsive feel).
      const speed = hoverActiveRef.current ? 7 : 2.2
      const kl    = 1 - Math.exp(-dt * speed)
      const lc    = lookCurrentRef.current
      const lt    = lookTargetRef.current
      lc.x += (lt.x - lc.x) * kl
      lc.y += (lt.y - lc.y) * kl

      uniforms.uLook.value.set(lc.x, -lc.y)

      // Orb leans toward the cursor — visible but still subtler than the eye
      // travel, so the eyes remain the primary expressive surface.
      const lean = 0.12 + activeRef.current * 0.06
      mesh.position.x += (lc.x * lean - mesh.position.x) * kl
      mesh.position.y += (-lc.y * lean - mesh.position.y) * kl

      // Eye overlay follows the look direction — wide range so it reads clearly
      // as "the eyes moved left / right / down". This must out-pace the orb's
      // own lean so the eyes carry the personality.
      const range = sizeRef.current.w * 0.18
      eyeX.set(lc.x * range)
      eyeY.set(lc.y * range)

      mesh.rotation.y += dt * 0.04
      mesh.rotation.x += dt * 0.015

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      mql.removeEventListener('change', applyMotion)
      ro.disconnect()
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement)
    }
  }, [theme, eyeX, eyeY])

  // ── Pointer / activity handling ────────────────────────────────────────────
  // Events live on the OUTER container so the eyes drift toward the cursor
  // anywhere on the page — not just when it's directly on the orb. We
  // distinguish three states based on the cursor's distance from the orb's
  // centre:
  //   • off-page         → idle script drives look + relaxed eyes (0.85)
  //   • in container     → eyes track slightly toward cursor (0.70)
  //   • cursor on the orb→ eyes squint/focus + full tracking (0.32)
  useEffect(() => {
    const container = containerRef.current
    const stage     = stageRef.current
    if (!container || !stage) return

    function update(clientX: number, clientY: number) {
      const rect    = stage!.getBoundingClientRect()
      const centerX = rect.left + rect.width  / 2
      const centerY = rect.top  + rect.height / 2
      const radius  = rect.width / 2   // stage is square
      const dx      = clientX - centerX
      const dy      = clientY - centerY
      const nx      = Math.max(-1, Math.min(1, dx / radius))
      const ny      = Math.max(-1, Math.min(1, dy / radius))
      const dist    = Math.sqrt(nx * nx + ny * ny)

      // The orb visually occupies ~0.65 of the stage half-radius (accounts
      // for morph extension beyond the geometric 1.0 mesh radius).
      const onOrb = dist < 0.62

      hoverActiveRef.current = true
      if (onOrb) {
        targetRef.current = 1
        lookTargetRef.current = { x: nx, y: ny }
        setOpen(0.32)
      } else {
        targetRef.current = 0.35
        // Slight tracking — eyes drift toward the cursor but the orb itself
        // doesn't lean much.
        lookTargetRef.current = { x: nx * 0.40, y: ny * 0.40 }
        setOpen(0.70)
      }
    }

    function onMove(e: PointerEvent) {
      update(e.clientX, e.clientY)
    }
    function onEnter(e: PointerEvent) {
      update(e.clientX, e.clientY)
      setBlinkAt((v) => v + 1)
    }
    function onLeave() {
      hoverActiveRef.current = false
      targetRef.current = 0
      setOpen(0.85)
      setBlinkAt((v) => v + 1)
    }
    function onDown(e: PointerEvent) {
      update(e.clientX, e.clientY)
    }
    function onUp() {
      // Touch lift: small grace period in case it was a tap.
      window.setTimeout(() => {
        if (!container?.matches(':hover')) onLeave()
      }, 500)
    }

    container.addEventListener('pointermove',   onMove)
    container.addEventListener('pointerenter',  onEnter)
    container.addEventListener('pointerleave',  onLeave)
    container.addEventListener('pointerdown',   onDown)
    container.addEventListener('pointerup',     onUp)
    container.addEventListener('pointercancel', onLeave)

    return () => {
      container.removeEventListener('pointermove',   onMove)
      container.removeEventListener('pointerenter',  onEnter)
      container.removeEventListener('pointerleave',  onLeave)
      container.removeEventListener('pointerdown',   onDown)
      container.removeEventListener('pointerup',     onUp)
      container.removeEventListener('pointercancel', onLeave)
    }
  }, [])

  // ── Idle look-around script: left, slightly right, slightly left, top, back ─
  useEffect(() => {
    if (typeof window === 'undefined') return
    let idx = 0
    let timer: number
    function step() {
      const s = LOOK_SEQUENCE[idx]
      if (!hoverActiveRef.current) {
        lookTargetRef.current = { x: s.x, y: s.y }
      }
      idx = (idx + 1) % LOOK_SEQUENCE.length
      timer = window.setTimeout(step, s.dur)
    }
    step()
    return () => window.clearTimeout(timer)
  }, [])

  // ── Idle blink scheduler ───────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let t: number
    function schedule() {
      const wait = 3800 + Math.random() * 3200
      t = window.setTimeout(() => {
        setBlinkAt((v) => v + 1)
        schedule()
      }, wait)
    }
    schedule()
    return () => window.clearTimeout(t)
  }, [])

  // ── Render ─────────────────────────────────────────────────────────────────
  const palette = PALETTE[theme]
  const bgColor = theme === 'dark' ? '#0A0A09' : '#E8E8DF'

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div
        ref={stageRef}
        className="relative aspect-square h-full max-h-[min(42vh,42vw)] w-full max-w-[min(42vh,42vw)] cursor-pointer select-none touch-none"
      >
        <div ref={canvasRef} className="absolute inset-0" />

        {/* Vertical robot-eye pills — sit on the orb's "face" and track the look direction. */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-between"
          style={{ x: sx, y: sy, width: '11%', height: '15%' }}
        >
          <Eye open={open} blinkKey={blinkAt} palette={palette} />
          <Eye open={open} blinkKey={blinkAt} palette={palette} />
        </motion.div>
      </div>
    </div>
  )
}

// ─── Eye ──────────────────────────────────────────────────────────────────────
// Vertical pill — narrow + tall, like a robot's lens slit. ScaleY animates the
// blink and the open/close transition between idle ↔ alert.

function Eye({
  open, blinkKey, palette,
}: {
  open: number
  blinkKey: number
  palette: Palette
}) {
  return (
    <motion.div
      style={{
        width: '32%',          // ~3.5% of stage — narrow vertical bar
        height: '100%',        // full wrapper height — ~15% of stage
        background: palette.eye,
        borderRadius: 9999,
        // Two-layer halo: tight inner core glow + wide outer bloom — sells the
        // LED-lens read so the eyes feel luminous, not painted on.
        boxShadow: `0 0 4px 0 ${palette.eye}, 0 0 14px 1px ${palette.eyeGlow}, 0 0 28px 4px ${palette.eyeGlow}`,
        originY: 0.5,
      }}
      animate={{ scaleY: open }}
      transition={{ type: 'spring', stiffness: 240, damping: 22, mass: 0.4 }}
    >
      <motion.div
        key={blinkKey}
        className="h-full w-full"
        style={{ background: palette.eye, borderRadius: 9999 }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: [1, 0.05, 1] }}
        transition={{ duration: 0.18, times: [0, 0.45, 1], ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
