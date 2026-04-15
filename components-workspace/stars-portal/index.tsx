'use client'

// npm install @react-three/drei @react-three/fiber three

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ─── Config ───────────────────────────────────────────────────────────────────

type WobbleMat = THREE.MeshStandardMaterial & { factor: number; speed: number }

// ─── Inner scene ──────────────────────────────────────────────────────────────

function PortalScene({ warping }: { warping: boolean }) {
  const starsRef = useRef<THREE.Group>(null!)
  const torusRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    // Stars drift / warp
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * (warping ? 1.2 : 0.04)
      starsRef.current.rotation.x += delta * (warping ? 0.6 : 0.01)
    }

    // Camera rush on warp
    const targetZ = warping ? -120 : 5
    state.camera.position.z +=
      (targetZ - state.camera.position.z) * delta * (warping ? 10 : 3)

    // Portal ring wobble + emissive pulse
    if (torusRef.current) {
      torusRef.current.rotation.z += delta * (warping ? 3.5 : 0.4)
      const mat = torusRef.current.material as WobbleMat
      const tf = warping ? 0.9 : 0.18
      const ts = warping ? 6.0 : 1.5
      mat.factor += (tf - mat.factor) * Math.min(delta * 5, 1)
      mat.speed += (ts - mat.speed) * Math.min(delta * 5, 1)
      const targetEI = warping ? 5 : 2
      ;(mat as THREE.MeshStandardMaterial).emissiveIntensity +=
        (targetEI - (mat as THREE.MeshStandardMaterial).emissiveIntensity) * Math.min(delta * 4, 1)
    }

    // Inner glow ring
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      const targetOpacity = warping ? 1 : 0.5
      mat.opacity += (targetOpacity - mat.opacity) * Math.min(delta * 4, 1)
    }
  })

  return (
    <>
      <group ref={starsRef}>
        <Stars radius={90} depth={60} count={6000} factor={4} saturation={0.3} fade />
      </group>

      {/* Portal ring */}
      <mesh ref={torusRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.07, 16, 120]} />
        <MeshWobbleMaterial
          color="#00d8ff"
          emissive="#00d8ff"
          emissiveIntensity={2}
          factor={0.18}
          speed={1.5}
          metalness={0.9}
          roughness={0.05}
          toneMapped={false}
        />
      </mesh>

      {/* Inner glow fill */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.035, 8, 120]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </>
  )
}

// ─── StarsPortal ──────────────────────────────────────────────────────────────

export default function StarsPortal() {
  const [warping, setWarping] = useState(false)

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ cursor: warping ? 'crosshair' : 'pointer', background: '#000000' }}
      onMouseDown={() => setWarping(true)}
      onMouseUp={() => setWarping(false)}
      onMouseLeave={() => setWarping(false)}
      onTouchStart={() => setWarping(true)}
      onTouchEnd={() => setWarping(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.15} color="#003366" />
        <pointLight position={[0, 0, 2]} intensity={4} color="#00d8ff" />
        <PortalScene warping={warping} />
      </Canvas>
    </div>
  )
}
