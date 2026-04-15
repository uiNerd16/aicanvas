'use client'

// npm install @phosphor-icons/react framer-motion

import { useState, useCallback, useLayoutEffect, useEffect, useRef } from 'react'
import { motion, useAnimate, stagger } from 'framer-motion'
import { Moon, Sun } from '@phosphor-icons/react'
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect


// ─── BlindPullToggle ──────────────────────────────────────────────────────────
// A dark/light toggle styled as a window-blind pull cord.
// All dimensions are derived from the container size — fully responsive.

const SLATS      = 6
const MAX_SIZE   = 80  // button px cap
const MIN_SIZE   = 48  // button px floor

export default function BlindPullToggle() {
  const [toggleDark, setToggleDark] = useState(true)
  const [pageIsDark, setPageIsDark] = useState(() => typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false)
  const [animating, setAnimating]   = useState(false)
  const [size, setSize]             = useState(MAX_SIZE) // button px, reactive
  const sizeRef                     = useRef(MAX_SIZE)   // stable ref for async handler
  const [scope, animate]            = useAnimate()

  // ── Theme detection ──────────────────────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      setPageIsDark(
        card
          ? card.classList.contains('dark')
          : document.documentElement.classList.contains('dark'),
      )
    }
    check()
    const mo = new MutationObserver(check)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) mo.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Responsive sizing — derived from container ───────────────────────────────
  useEffect(() => {
    const el = scope.current
    if (!el) return
    const update = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      const s = Math.max(MIN_SIZE, Math.min(MAX_SIZE, Math.round(Math.min(w, h) * 0.2)))
      sizeRef.current = s
      setSize(s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived tokens ───────────────────────────────────────────────────────────
  const iconSize   = Math.round(size * 0.45)               // 36 at 80
  const radius     = Math.round(size * 0.275)              // 22 at 80
  const cordRestH  = Math.round(size * 0.30)               // 24 at 80
  const dotSize    = Math.max(8, Math.round(size * 0.138)) // 11 at 80

  // ── Theme-derived colors ─────────────────────────────────────────────────────
  const previewBg    = pageIsDark ? '#110F0C' : '#EDEAE5'
  const buttonBg     = pageIsDark
    ? 'linear-gradient(145deg, #3a3530, #252019)'
    : 'linear-gradient(145deg, #E8E4DC, #DFDBD4)'
  const buttonBorder = pageIsDark
    ? '1.5px solid rgba(255,255,255,0.10)'
    : '1.5px solid rgba(0,0,0,0.12)'
  const buttonShadow = pageIsDark
    ? '0 6px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)'
    : '0 4px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)'
  const iconColor    = pageIsDark ? 'white' : '#2E2A24'
  const cordTop      = pageIsDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.22)'
  const cordBottom   = pageIsDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
  const dotBg        = pageIsDark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.32)'
  const dotShadow    = pageIsDark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.12)'

  // ── Toggle handler ───────────────────────────────────────────────────────────
  const handleToggle = useCallback(async () => {
    if (animating) return
    setAnimating(true)

    const pullH = Math.round(sizeRef.current * 0.65)
    const restH = Math.round(sizeRef.current * 0.30)

    // 1. Line stretches downward
    await animate('.cord-line', { height: pullH }, { duration: 0.1, ease: [0.4, 0, 1, 1] })
    // 2. Spring back (concurrent)
    animate('.cord-line', { height: restH }, { type: 'spring', stiffness: 300, damping: 18 })
    // 3. Close blinds
    await animate('.slat', { scaleY: 0 }, { delay: stagger(0.04), duration: 0.1, ease: 'easeIn' })
    // 4. Swap icon
    setToggleDark((d) => !d)
    // 5. Open blinds
    await animate('.slat', { scaleY: 1 }, { delay: stagger(0.04), duration: 0.13, ease: 'easeOut' })

    setAnimating(false)
  }, [animating, animate])

  return (
    <div
      ref={scope}
      className="flex h-full w-full items-center justify-center"
      style={{ background: previewBg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex select-none flex-col items-center"
      >
        {/* ── Button ───────────────────────────────────────────────────────── */}
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            border: buttonBorder,
            boxShadow: buttonShadow,
            cursor: 'pointer',
            position: 'relative',
            background: 'transparent',
          }}
        >
          {/* Slat container — clips every slat to the rounded button shape */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: radius - 1,
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: SLATS }).map((_, i) => {
              // Pixel-perfect slat bounds — Math.round prevents subpixel gaps
              const topPx     = Math.round((i / SLATS) * size)
              const nextTopPx = i === SLATS - 1
                ? size
                : Math.round(((i + 1) / SLATS) * size)
              const heightPx  = nextTopPx - topPx

              return (
                <div
                  key={i}
                  className="slat"
                  style={{
                    position: 'absolute',
                    top: topPx,
                    left: 0,
                    width: '100%',
                    height: heightPx,
                    overflow: 'hidden',
                    transformOrigin: '50% 50%',
                  }}
                >
                  {/* Full button face (bg + icon), shifted so only this strip shows */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -topPx,
                      left: 0,
                      width: size,
                      height: size,
                      background: buttonBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: iconColor,
                    }}
                  >
                    {toggleDark ? (
                      <Moon size={iconSize} weight="regular" />
                    ) : (
                      <Sun size={iconSize} weight="regular" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.button>

        {/* ── Cord ─────────────────────────────────────────────────────────── */}
        <div
          className="flex cursor-pointer flex-col items-center"
          onClick={handleToggle}
        >
          {/* String — grows downward on pull, stays anchored at top */}
          <div
            className="cord-line"
            style={{
              width: 2,
              height: cordRestH,
              background: `linear-gradient(to bottom, ${cordTop}, ${cordBottom})`,
              borderRadius: 1,
            }}
          />
          {/* Pull dot */}
          <div
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              background: dotBg,
              boxShadow: dotShadow,
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
