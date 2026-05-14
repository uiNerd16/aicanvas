'use client'

// 60K Particles — live renderer
// Generalised from components-workspace/particle-torus. Takes a Config and
// the resolved svgSource, samples particles, and animates them with the
// shader pipeline (idle wobble + hover dispersion + critically-damped spring +
// per-sprite light gradient).

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import {
  type Config,
  IDLE_MAP,
  HOVER_AREA_MAP,
  SPRING_MAP,
  LIGHT_MAP,
  DEPTH_MAP,
} from './config'
import { sampleSvg, PLACEHOLDER_SVG, type SamplerResult } from './svgSampler'

const PLANE_SIZE = 5.0
const HOVER_DISPLACEMENT_SCALE = 1.0 // hoverStrength config already in 0..2

// ─── Shaders ────────────────────────────────────────────────────────────────
const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3  uMouse;
  uniform float uHoverStrength;
  uniform float uInfluenceRadius;
  uniform float uDisplacement;
  uniform float uIdleAmp;
  uniform float uIdleFreq;
  uniform float uBaseSize;
  uniform float uDPR;

  attribute vec3 color;
  varying   vec3 vColor;

  void main() {
    vColor = color;
    vec3 restPos = position;

    float h1 = fract(sin(dot(restPos, vec3(127.1, 311.7,  74.7))) * 43758.5453);
    float h2 = fract(sin(dot(restPos, vec3(269.5, 183.3, 246.1))) * 43758.5453);
    float h3 = fract(sin(dot(restPos, vec3(113.5, 271.9, 124.6))) * 43758.5453);

    // Idle wobble — desync'd sin per axis.
    vec3 idleOffset = vec3(
      sin(uTime * uIdleFreq * 1.3 + h1 * 6.2831),
      sin(uTime * uIdleFreq * 1.7 + h2 * 6.2831),
      sin(uTime * uIdleFreq * 1.5 + h3 * 6.2831)
    ) * uIdleAmp;

    // Hover dispersion — static per-particle direction; XY-only distance.
    vec3 toMouse = restPos - uMouse;
    float distXY = length(vec2(toMouse.x, toMouse.y));
    float falloff = 1.0 - smoothstep(0.0, uInfluenceRadius, distXY);

    vec3 raw = vec3(h1, h2, h3) - vec3(0.5);
    vec3 dispersionDir = normalize(raw + vec3(0.0001));
    float magVary = 0.5 + 0.5 * h1;
    vec3 hoverOffset = dispersionDir * (falloff * uHoverStrength * uDisplacement * magVary);

    vec3 worldPos = restPos + idleOffset + hoverOffset;

    vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uBaseSize * uDPR * (1.0 / max(-mvPosition.z, 0.1));
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uOpacity;
  uniform float uHighlightStrength;
  uniform int   uLightMode; // 0 TR, 1 TL, 2 Center, 3 None
  varying vec3  vColor;

  void main() {
    vec2 uv = gl_PointCoord;
    vec2 center = uv - vec2(0.5);

    float r = length(center);
    float circle = 1.0 - smoothstep(0.45, 0.5, r);
    if (circle <= 0.001) discard;

    float lit = 0.0;
    if (uLightMode == 0) {
      // Top-Right: high uv.x AND low uv.y
      lit = clamp((uv.x + (1.0 - uv.y)) * 0.5, 0.0, 1.0);
    } else if (uLightMode == 1) {
      // Top-Left: low uv.x AND low uv.y
      lit = clamp(((1.0 - uv.x) + (1.0 - uv.y)) * 0.5, 0.0, 1.0);
    } else if (uLightMode == 2) {
      // Center: bright in the middle, fades to edges
      lit = clamp(1.0 - r * 2.0, 0.0, 1.0);
    } else {
      lit = 0.0;
    }
    lit = pow(lit, 1.6);

    float h = (uLightMode == 3) ? 0.0 : uHighlightStrength;
    vec3 highlight = mix(vColor, vec3(1.0), h);
    vec3 col = mix(vColor, highlight, lit);
    float alpha = circle * uOpacity;

    gl_FragColor = vec4(col, alpha);
  }
`

interface PointsProps {
  config: Config
  resolvedSvg: string
}

function ParticleField({ config, resolvedSvg }: PointsProps) {
  const groupRef = useRef<THREE.Group>(null)
  const planeRef = useRef<THREE.Mesh>(null)

  const mouseTargetRef = useRef(new THREE.Vector3(999, 999, 999))
  const hoverActiveRef = useRef(false)
  const hoverStrengthRef = useRef(0)
  const hoverStrengthVelRef = useRef(0)

  const { gl } = useThree()

  // Sample state — async because SVG → img is async.
  const [sample, setSample] = useState<SamplerResult | null>(null)
  // Track key inputs that require a full rebuild. (Mono-colour changes are
  // applied in-place; density / svgSource / depth changes require a resample.)
  const zJitter = DEPTH_MAP[config.depth]
  const resampleKey = `${resolvedSvg.length}::${config.density}::${zJitter}::${config.markSize}`

  useEffect(() => {
    let alive = true
    ;(async () => {
      const result = await sampleSvg(resolvedSvg, config.density, zJitter, config.markSize)
      if (!alive) return
      setSample(result)
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resampleKey])

  // Build the geometry + material from the sample. ShaderMaterial is created
  // once per geometry rebuild; uniforms are mutated in useFrame / effects.
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    if (sample && sample.positions.length > 0) {
      geo.setAttribute('position', new THREE.BufferAttribute(sample.positions, 3))
      // Color attribute — start with sampled colours; we may overwrite for Mono.
      const initialColors = sample.colors.slice()
      if (config.colorMode === 'Mono') {
        applyMonoColor(initialColors, config.monoColor)
      }
      geo.setAttribute('color', new THREE.BufferAttribute(initialColors, 3))
    } else {
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3))
      geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(0), 3))
    }

    const idle = IDLE_MAP[config.idle]
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:              { value: 0 },
        uMouse:             { value: new THREE.Vector3(999, 999, 999) },
        uHoverStrength:     { value: 0 },
        uInfluenceRadius:   { value: HOVER_AREA_MAP[config.hoverArea] },
        uDisplacement:      { value: config.hoverStrength * HOVER_DISPLACEMENT_SCALE },
        uIdleAmp:           { value: idle.amp },
        uIdleFreq:          { value: idle.freq },
        uBaseSize:          { value: config.particleSize },
        uDPR:               { value: gl.getPixelRatio() },
        uOpacity:           { value: 0.95 },
        uHighlightStrength: { value: config.highlightStrength },
        uLightMode:         { value: LIGHT_MAP[config.light] },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })

    return { geometry: geo, material: mat }
    // We deliberately rebuild only when the *sample* changes (positions/colors)
    // — all other config knobs are written into uniforms below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sample, gl])

  // ── Live uniform updates (no rebuild) ────────────────────────────────────
  useEffect(() => {
    if (!material) return
    material.uniforms.uInfluenceRadius.value = HOVER_AREA_MAP[config.hoverArea]
  }, [config.hoverArea, material])

  useEffect(() => {
    if (!material) return
    material.uniforms.uDisplacement.value = config.hoverStrength * HOVER_DISPLACEMENT_SCALE
  }, [config.hoverStrength, material])

  useEffect(() => {
    if (!material) return
    const idle = IDLE_MAP[config.idle]
    material.uniforms.uIdleAmp.value = idle.amp
    material.uniforms.uIdleFreq.value = idle.freq
  }, [config.idle, material])

  useEffect(() => {
    if (!material) return
    material.uniforms.uBaseSize.value = config.particleSize
  }, [config.particleSize, material])

  useEffect(() => {
    if (!material) return
    material.uniforms.uHighlightStrength.value = config.highlightStrength
  }, [config.highlightStrength, material])

  useEffect(() => {
    if (!material) return
    material.uniforms.uLightMode.value = LIGHT_MAP[config.light]
  }, [config.light, material])

  useEffect(() => {
    if (material) material.uniforms.uDPR.value = gl.getPixelRatio()
  }, [material, gl])

  // ── Mono / Original colour repaint without geometry rebuild ──────────────
  useEffect(() => {
    if (!geometry || !sample) return
    const colorAttr = geometry.getAttribute('color') as THREE.BufferAttribute | undefined
    if (!colorAttr) return
    const arr = colorAttr.array as Float32Array
    if (config.colorMode === 'Mono') {
      applyMonoColor(arr, config.monoColor)
    } else {
      arr.set(sample.colors)
    }
    colorAttr.needsUpdate = true
  }, [config.colorMode, config.monoColor, geometry, sample])

  // Dispose on unmount / rebuild.
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  // ── Pointer handlers ────────────────────────────────────────────────────
  function onPointerMove(e: ThreeEvent<PointerEvent>) {
    const local = e.point.clone()
    if (groupRef.current) groupRef.current.worldToLocal(local)
    mouseTargetRef.current.copy(local)
    hoverActiveRef.current = true
  }
  function onPointerLeave() {
    hoverActiveRef.current = false
    mouseTargetRef.current.set(999, 999, 999)
  }
  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    ;(e.target as Element | undefined)?.setPointerCapture?.(e.pointerId)
    onPointerMove(e)
  }
  function onPointerUp(e: ThreeEvent<PointerEvent>) {
    ;(e.target as Element | undefined)?.releasePointerCapture?.(e.pointerId)
    onPointerLeave()
  }

  // ── Frame loop ──────────────────────────────────────────────────────────
  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30)
    const u = material.uniforms
    u.uTime.value += dt

    const target = hoverActiveRef.current ? 1 : 0
    const spr = SPRING_MAP[config.spring]
    const x = hoverStrengthRef.current - target
    const xv = hoverStrengthVelRef.current
    const a = -spr.stiffness * x - spr.damping * xv
    hoverStrengthVelRef.current += a * dt
    hoverStrengthRef.current    += hoverStrengthVelRef.current * dt
    hoverStrengthRef.current = Math.max(0, Math.min(1.2, hoverStrengthRef.current))

    u.uHoverStrength.value = hoverStrengthRef.current
    u.uMouse.value.copy(mouseTargetRef.current)
  })

  return (
    <group ref={groupRef}>
      <points args={[geometry, material]} />
      <mesh
        ref={planeRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// Parse '#rrggbb' into 0..1 floats and write across the color buffer.
function applyMonoColor(arr: Float32Array, hex: string) {
  const clean = hex.replace('#', '').padEnd(6, '0').slice(0, 6)
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  for (let i = 0; i < arr.length; i += 3) {
    arr[i]     = r
    arr[i + 1] = g
    arr[i + 2] = b
  }
}

// ─── Canvas wrapper (browser-only) ──────────────────────────────────────────
function Scene({
  config,
  onCanvasReady,
}: {
  config: Config
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void
}) {
  const resolvedSvg = config.svgSource ?? PLACEHOLDER_SVG
  const bg = config.backgroundColor

  // Canvas is always opaque (alpha: false) + the chosen bg as clear-colour.
  // Why: a transparent WebGL canvas gets composited through the OS's wide-
  // gamut path on macOS / Apple Silicon. Screen recorders default to sRGB
  // capture and clip that extra saturation, so recordings looked duller than
  // the live view. Forcing the canvas opaque keeps everything on one sRGB
  // path and recordings match the live colours.
  //
  // preserveDrawingBuffer is required so that WebCodecs / canvas.toBlob can
  // read pixels after the browser has composited them; without it the buffer
  // is cleared and our recorder captures black frames.
  return (
    <div className="relative h-full w-full" style={{ background: bg }}>
      <Canvas
        key={`opaque:${bg}`}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.5], fov: 38 }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0)
          gl.setClearColor(bg, 1)
          onCanvasReady?.(gl.domElement)
        }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        style={{ touchAction: 'none' }}
      >
        <ParticleField config={config} resolvedSvg={resolvedSvg} />
      </Canvas>
    </div>
  )
}

const SceneNoSSR = dynamic(() => Promise.resolve(Scene), { ssr: false })

export default function Renderer({
  config,
  onCanvasReady,
}: {
  config: Config
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void
}) {
  return <SceneNoSSR config={config} onCanvasReady={onCanvasReady} />
}
