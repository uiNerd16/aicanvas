import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Build a React Three Fiber component called StarsPortal. Combine Drei's Stars component with a glowing torus portal ring using MeshWobbleMaterial. Requirements:
- Stars: <Stars radius=90 depth=60 count=6000 factor=4 saturation=0.3 fade /> inside a group ref for rotation
- Portal ring: torus args={[1.2, 0.07, 16, 120]} rotated [Math.PI/2, 0, 0], MeshWobbleMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity=2 factor=0.18 speed=1.5 metalness=0.9 roughness=0.05 toneMapped={false}
- Inner glow: second torus args={[1.2, 0.035, 8, 120]}, meshBasicMaterial color="#fff" transparent opacity=0.5 toneMapped={false}
- Idle: stars group rotates y += delta*0.04, x += delta*0.01; camera stays at z=5
- On hold (warping=true passed as prop): stars rotate y += delta*1.2, x += delta*0.6; camera rushes to z=-120 (lerp delta*10); portal ring rotation.z += delta*3.5; wobble factor→0.9, speed→6.0, emissiveIntensity→5
- On release: everything smoothly returns to idle via lerp (delta*3 for camera, delta*4-5 for material)
- Parent div handles mousedown/mouseup/mouseleave + touchstart/touchend to toggle warping state
- Pure black background via <color attach="background" args={['#000000']} />
- Camera: position [0,0,5] fov=60
- 'use client', single file`,

  GPT: `Build StarsPortal with @react-three/fiber + @react-three/drei.

Canvas: camera={position:[0,0,5], fov:60}, gl={{antialias:true}}.

Scene contents:
1. <group ref={starsRef}><Stars radius={90} depth={60} count={6000} factor={4} saturation={0.3} fade /></group>
2. <mesh ref={torusRef} rotation={[Math.PI/2,0,0]}><torusGeometry args={[1.2,0.07,16,120]}/><MeshWobbleMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={2} factor={0.18} speed={1.5} metalness={0.9} roughness={0.05} toneMapped={false}/></mesh>
3. Inner glow mesh: torusGeometry args={[1.2,0.035,8,120]}, meshBasicMaterial white transparent opacity=0.5

useFrame per frame (warping is prop from parent useState):
Stars: starsRef.rotation.y += delta*(warping?1.2:0.04), .x += delta*(warping?0.6:0.01)
Camera: state.camera.position.z += ((warping?-120:5) - z) * delta*(warping?10:3)
Torus: rotation.z += delta*(warping?3.5:0.4); lerp factor→(warping?0.9:0.18), speed→(warping?6:1.5), emissiveIntensity→(warping?5:2)
Glow opacity: lerp toward warping?1:0.5

Parent StarsPortal: useState(false) for warping. Outer div handles onMouseDown/Up/Leave + onTouchStart/End. background #000000.`,

  V0: `Make a space scene with a glowing portal ring and a star field. Use React Three Fiber with Drei's Stars and MeshWobbleMaterial.

The scene shows thousands of stars slowly drifting in a dark void. In the center floats a glowing cyan ring — it pulses and wobbles gently with an emissive glow.

When the user clicks and holds anywhere, warp speed activates: the stars rush past the camera at incredible speed, the portal ring spins fast and glows much brighter, everything feels like jumping to hyperspace. When they release, the scene smoothly settles back to the quiet drift.

Pure black background. Works on touch (hold to warp, release to return). The portal ring is made from a thin torus with a MeshWobbleMaterial that smoothly increases distortion on warp. Container fills parent fully.`,
}
