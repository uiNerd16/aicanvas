'use client'

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react'

// Scroll-triggered entrance, replacing framer-motion's whileInView on the
// homepage's static sections. One IntersectionObserver + a CSS transition
// instead of the framer runtime, so these sections can live in a server
// component (Step 2) and ship almost no JS. Matches the prior behavior:
// content starts hidden and reveals once, when it scrolls into view.
export function Reveal({
  children,
  className = '',
  delay = 0,
  x = 0,
  y = 10,
}: {
  children: ReactNode
  className?: string
  delay?: number // seconds, for stagger
  x?: number // px start offset
  y?: number // px start offset
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '-40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal=""
      data-shown={shown ? '' : undefined}
      className={className}
      style={{ '--reveal-x': `${x}px`, '--reveal-y': `${y}px`, transitionDelay: `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  )
}
