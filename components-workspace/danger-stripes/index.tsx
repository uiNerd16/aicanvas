'use client'

// npm install framer-motion

import { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const STRIPE_TEXT = 'WORK IN PROGRESS \u00A0\u2022\u00A0 DO NOT CLICK OR HOVER \u00A0\u2022\u00A0 DANGER'

const STRIPES = [
  { rotate: -20, top: '40%' },
  { rotate: 12, top: '47%' },
  { rotate: -8, top: '54%' },
]

function RepeatingText() {
  const repeated = `${STRIPE_TEXT} \u00A0\u2022\u00A0 `.repeat(10)
  return (
    <div className="flex items-center whitespace-nowrap">
      <span className="text-sm font-black tracking-widest text-black uppercase sm:text-base">
        {repeated}
      </span>
    </div>
  )
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default function DangerStripes() {
  const rafRef = useRef<number>(0)
  const hoveringRef = useRef(false)
  const clickedRef = useRef(false)
  const intensityRef = useRef(0)
  const stripesRef = useRef<(HTMLDivElement | null)[]>([])

  const animateStripes = useCallback(() => {
    // Ramp intensity up or down
    if (hoveringRef.current || clickedRef.current) {
      const target = clickedRef.current ? 3 : 1
      intensityRef.current += (target - intensityRef.current) * 0.15
    } else {
      intensityRef.current *= 0.92 // decay
    }

    // Stop when fully settled
    if (intensityRef.current < 0.005 && !hoveringRef.current && !clickedRef.current) {
      intensityRef.current = 0
      stripesRef.current.forEach((el, idx) => {
        if (el) el.style.transform = `rotate(${STRIPES[idx].rotate}deg)`
      })
      rafRef.current = 0
      return
    }

    const intensity = intensityRef.current

    stripesRef.current.forEach((el, idx) => {
      if (!el) return
      const base = STRIPES[idx].rotate
      const tx = random(-18, 18) * intensity
      const ty = random(-10, 10) * intensity
      const skewX = random(-6, 6) * intensity
      const sc = 1 + random(-0.04, 0.04) * intensity
      el.style.transform = `rotate(${base}deg) translate(${tx}px, ${ty}px) skewX(${skewX}deg) scale(${sc})`
    })

    rafRef.current = requestAnimationFrame(animateStripes)
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const startLoop = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(animateStripes)
  }, [animateStripes])

  const triggerHover = useCallback(() => {
    hoveringRef.current = true
    startLoop()
  }, [startLoop])

  const triggerClick = useCallback(() => {
    clickedRef.current = true
    startLoop()
    setTimeout(() => {
      clickedRef.current = false
    }, 500)
  }, [startLoop])

  const triggerLeave = useCallback(() => {
    hoveringRef.current = false
  }, [])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a]">
      <div
        className="relative h-full w-full overflow-hidden select-none"
        style={{ minHeight: '100vh' }}
      >
        {STRIPES.map((stripe, i) => (
          <motion.div
            key={i}
            ref={(el) => { stripesRef.current[i] = el }}
            className="absolute left-[-40%] flex h-[44px] w-[180%] items-center overflow-hidden sm:h-[52px]"
            style={{
              top: stripe.top,
              background: 'linear-gradient(180deg, #FFE44D 0%, #FFD600 50%, #E6BF00 100%)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.8), 0 1px 8px rgba(0,0,0,0.6)',
              willChange: 'transform',
              cursor: 'pointer',
            }}
            initial={{ x: i % 2 === 0 ? -300 : 300, opacity: 0, rotate: stripe.rotate }}
            animate={{ x: 0, opacity: 1, rotate: stripe.rotate }}
            transition={{
              duration: 0.6,
              delay: i * 0.12,
              ease: 'easeOut',
            }}
            onMouseEnter={triggerHover}
            onMouseLeave={triggerLeave}
            onClick={triggerClick}
            onTouchStart={triggerHover}
            onTouchEnd={() => {
              triggerClick()
              setTimeout(triggerLeave, 600)
            }}
          >
            <RepeatingText />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
