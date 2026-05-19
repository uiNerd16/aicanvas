'use client'
// npm install framer-motion

import { useRef, useState } from 'react'
import { motion, useMotionValue, animate, type AnimationPlaybackControls } from 'framer-motion'

type FaceShape = 'wide' | 'side'

const FACES: { src: string; label: string; shape: FaceShape; transform: string }[] = [
  // Wide 16:9 faces (front, back, top, bottom)
  { src: 'https://picsum.photos/seed/pivot-1/640/360', label: '01 / 06', shape: 'wide', transform: 'translateZ(var(--half-d))' },
  { src: 'https://picsum.photos/seed/pivot-2/640/360', label: '02 / 06', shape: 'wide', transform: 'rotateY(180deg) translateZ(var(--half-d))' },
  { src: 'https://picsum.photos/seed/pivot-5/640/360', label: '05 / 06', shape: 'wide', transform: 'rotateX(90deg) translateZ(var(--half-h))' },
  { src: 'https://picsum.photos/seed/pivot-6/640/360', label: '06 / 06', shape: 'wide', transform: 'rotateX(-90deg) translateZ(var(--half-h))' },
  // Square side faces (left, right) — depth = height makes these H × H
  { src: 'https://picsum.photos/seed/pivot-3/640/640', label: '03 / 06', shape: 'side', transform: 'rotateY(90deg) translateZ(var(--half-w))' },
  { src: 'https://picsum.photos/seed/pivot-4/640/640', label: '04 / 06', shape: 'side', transform: 'rotateY(-90deg) translateZ(var(--half-w))' },
]

const DRAG_SENSITIVITY = 0.5
const COAST = { type: 'spring' as const, stiffness: 40, damping: 22 }

export default function PivotCube() {
  const rotateX = useMotionValue(-14)
  const rotateY = useMotionValue(-22)
  const [hovered, setHovered] = useState(false)

  const dragging = useRef(false)
  const start = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 })
  const last = useRef({ t: 0, x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const xAnim = useRef<AnimationPlaybackControls | null>(null)
  const yAnim = useRef<AnimationPlaybackControls | null>(null)

  const stopAnims = () => {
    xAnim.current?.stop()
    yAnim.current?.stop()
    xAnim.current = null
    yAnim.current = null
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stopAnims()
    dragging.current = true
    const t = performance.now()
    start.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotateX.get(),
      rotY: rotateY.get(),
    }
    last.current = { t, x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    rotateY.set(start.current.rotY + dx * DRAG_SENSITIVITY)
    rotateX.set(start.current.rotX - dy * DRAG_SENSITIVITY)

    const now = performance.now()
    const dt = now - last.current.t
    if (dt > 8) {
      velocity.current = {
        x: (e.clientX - last.current.x) / dt,
        y: (e.clientY - last.current.y) / dt,
      }
      last.current = { t: now, x: e.clientX, y: e.clientY }
    }
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    dragging.current = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    // Subtle coast: glide a little in the direction of release, no snap
    const vy = velocity.current.x * 1000 * DRAG_SENSITIVITY  // deg/sec
    const vx = -velocity.current.y * 1000 * DRAG_SENSITIVITY
    const projectY = rotateY.get() + vy * 0.18
    const projectX = rotateX.get() + vx * 0.18
    yAnim.current = animate(rotateY, projectY, { ...COAST, velocity: vy })
    xAnim.current = animate(rotateX, projectX, { ...COAST, velocity: vx })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#E8E8DF] dark:bg-[#1A1A19]">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 'clamp(320px, 84vw, 640px)',
          height: 'clamp(260px, 60vw, 460px)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[12%] -z-10 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, rgba(0,0,0,0.18), transparent 75%)',
          }}
        />

        <div
          style={{ perspective: '1400px' }}
          className="flex h-full w-full items-center justify-center"
        >
          <motion.div
            animate={{ y: hovered ? -4 : 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative"
          >
            <motion.div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={
                {
                  width: 'var(--w)',
                  height: 'var(--h)',
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                  '--w': 'clamp(240px, 64vw, 480px)',
                  '--h': 'calc(var(--w) * 9 / 16)',
                  '--d': 'var(--h)',
                  '--half-w': 'calc(var(--w) / 2)',
                  '--half-h': 'calc(var(--h) / 2)',
                  '--half-d': 'calc(var(--d) / 2)',
                  touchAction: 'none',
                } as React.CSSProperties
              }
              className="relative cursor-grab select-none active:cursor-grabbing"
            >
              {FACES.map((face, i) => {
                const isSide = face.shape === 'side'
                return (
                  <div
                    key={i}
                    className="absolute overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/15"
                    style={{
                      width: isSide ? 'var(--d)' : 'var(--w)',
                      height: isSide ? 'var(--h)' : 'var(--h)',
                      top: 0,
                      left: isSide ? 'calc((var(--w) - var(--d)) / 2)' : 0,
                      transform: face.transform,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={face.src}
                      alt={`Pivot face ${i + 1}`}
                      className="h-full w-full select-none object-cover"
                      draggable={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-white/95 backdrop-blur-sm">
                      {face.label}
                    </div>
                  </div>
                )
              })}
            </motion.div>

            <motion.div
              aria-hidden
              animate={{ opacity: hovered ? 0.55 : 0.32 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute left-1/2 top-full -translate-x-1/2 rounded-full bg-black"
              style={{
                width: '72%',
                height: 28,
                marginTop: 28,
                filter: 'blur(22px)',
              }}
            />
          </motion.div>
        </div>

      </div>
    </div>
  )
}
