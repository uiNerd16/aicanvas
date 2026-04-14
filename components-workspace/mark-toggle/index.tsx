'use client'

// npm install @phosphor-icons/react framer-motion

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { X, Check } from '@phosphor-icons/react'

// ─── MarkToggle ───────────────────────────────────────────────────────────────
// iOS-style pill toggle in earth/sand tones. The thumb carries a small icon
// that morphs from X (off) to Check (on) as it slides across.

const MAX_TRACK_W = 80
const MIN_TRACK_W = 48

export default function MarkToggle() {
  const [isOn, setIsOn]             = useState(false)
  const [animating, setAnimating]   = useState(false)
  const [pageIsDark, setPageIsDark] = useState(true)
  const [trackW, setTrackW]         = useState(MAX_TRACK_W)
  const containerRef                = useRef<HTMLDivElement>(null)
  const isOnRef                     = useRef(false)

  // ── Derived dimensions ───────────────────────────────────────────────────────
  const trackH   = Math.round(trackW * 0.55)
  const thumb    = Math.round(trackW * 0.45)
  const pad      = Math.max(3, Math.round(trackW * 0.05))
  const offX     = pad
  const onX      = trackW - thumb - pad
  const iconSize = Math.round(thumb * 0.50)

  const thumbX = useMotionValue(offX)

  // ── Theme detection + resize observer ────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
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

    const update = () => {
      const s = Math.max(
        MIN_TRACK_W,
        Math.min(MAX_TRACK_W, Math.round(Math.min(el.offsetWidth, el.offsetHeight) * 0.18)),
      )
      setTrackW(s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)

    return () => { mo.disconnect(); ro.disconnect() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Snap thumb to correct side when container resizes ────────────────────────
  useEffect(() => {
    thumbX.set(isOnRef.current ? onX : offX)
  }, [trackW]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Earth/sand colour palette ─────────────────────────────────────────────────
  const offTrack  = pageIsDark ? '#8C7B6B' : '#B09478'
  const onTrack   = pageIsDark ? '#4A5935' : '#6B8040'
  const trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack])

  // Icon colour matches the track it lives above for visual harmony
  const iconColor = isOn ? onTrack : offTrack

  // ── Toggle ───────────────────────────────────────────────────────────────────
  const handleToggle = useCallback(async () => {
    if (animating) return
    setAnimating(true)
    const target = isOn ? offX : onX
    isOnRef.current = !isOn
    setIsOn((v) => !v)
    await animate(thumbX, target, { type: 'spring', stiffness: 500, damping: 36 })
    setAnimating(false)
  }, [isOn, animating, thumbX, offX, onX])

  // ── Theme tokens ─────────────────────────────────────────────────────────────
  const previewBg   = pageIsDark ? '#110F0C' : '#EDEAE5'
  const trackInset  = pageIsDark
    ? 'inset 0 1px 4px rgba(0,0,0,0.50)'
    : 'inset 0 1px 3px rgba(0,0,0,0.14)'
  const thumbShadow = pageIsDark
    ? '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)'
    : '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen w-full items-center justify-center"
      style={{ background: previewBg }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="select-none"
      >
        {/* ── Track ──────────────────────────────────────────────────────────── */}
        <motion.button
          onClick={handleToggle}
          style={{
            width: trackW,
            height: trackH,
            borderRadius: trackH / 2,
            backgroundColor: trackColor,
            boxShadow: trackInset,
            position: 'relative',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            display: 'block',
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          {/* ── Thumb ────────────────────────────────────────────────────────── */}
          <motion.div
            style={{
              position: 'absolute',
              top: pad,
              x: thumbX,
              width: thumb,
              height: thumb,
              borderRadius: '50%',
              background: 'white',
              boxShadow: thumbShadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* ── Icon morph ─────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait" initial={false}>
              {isOn ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Check size={iconSize} weight="bold" color={iconColor} />
                </motion.span>
              ) : (
                <motion.span
                  key="x-icon"
                  initial={{ scale: 0, rotate: 45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={iconSize} weight="bold" color={iconColor} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  )
}
