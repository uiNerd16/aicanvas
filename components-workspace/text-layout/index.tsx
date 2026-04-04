'use client'

import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import type { AnimationPlaybackControls } from 'framer-motion'

// ─── Constants ────────────────────────────────────────────────────────────────
const SAMPLE_TEXT =
  'Pretext computes wrap and height via canvas. No DOM reflow. ~0.09ms per layout call.'
const FONT    = '14px "Courier New"'
const LINE_H  = 22
const W_MIN   = 160
const W_MAX   = 320

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function TextLayoutCard() {
  const motionWidth = useMotionValue(W_MIN)

  const widthValRef  = useRef<HTMLSpanElement>(null)
  const heightValRef = useRef<HTMLSpanElement>(null)
  const linesNumRef  = useRef<HTMLSpanElement>(null)
  const linesListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive    = true
    let controls : AnimationPlaybackControls | undefined
    let unsub    : (() => void) | undefined

    import('@chenglou/pretext').then(({ prepareWithSegments, layoutWithLines }) => {
      if (!alive) return

      const prepared = prepareWithSegments(SAMPLE_TEXT, FONT)

      function flush(w: number) {
        const rw = Math.round(w)
        const { height, lineCount, lines } = layoutWithLines(prepared, rw, LINE_H)

        if (widthValRef.current)  widthValRef.current.textContent  = String(rw)
        if (heightValRef.current) heightValRef.current.textContent = String(height)
        if (linesNumRef.current)  linesNumRef.current.textContent  = String(lineCount)

        if (linesListRef.current) {
          linesListRef.current.innerHTML = lines.map((line) => {
            const fillPct = ((line.width / rw) * 100).toFixed(1)
            return `
              <div style="margin-bottom:10px">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
                  <div style="flex:1;height:3px;background:#27272a;border-radius:2px;overflow:hidden">
                    <div style="height:100%;width:${fillPct}%;background:rgb(251,191,36);border-radius:2px;transition:width 0.05s"></div>
                  </div>
                  <span style="font:10px monospace;color:#52525b;min-width:38px;text-align:right">${fillPct}%</span>
                </div>
                <div style="font:11px monospace;color:#a1a1aa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">"${esc(line.text)}"</div>
              </div>`
          }).join('')
        }
      }

      flush(W_MIN)
      unsub = motionWidth.on('change', flush)
      controls = animate(motionWidth, [W_MIN, W_MAX, W_MIN], {
        duration: 5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 0.4,
      })
    })

    return () => {
      alive = false
      unsub?.()
      controls?.stop()
    }
  }, [motionWidth])

  const progressPct = useTransform(motionWidth, [W_MIN, W_MAX], ['0%', '100%'])

  return (
    <div className="relative flex h-full w-full gap-5 overflow-hidden bg-zinc-950 p-5">

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Amber glow */}
      <div className="pointer-events-none absolute bottom-0 left-4 h-32 w-48 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Left column: CSS-rendered text box */}
      <div className="relative flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          container
        </span>

        <motion.div
          style={{
            width: motionWidth,
            fontFamily: '"Courier New", monospace',
            fontSize: '14px',
            lineHeight: '22px',
          }}
          className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 text-zinc-300"
        >
          {SAMPLE_TEXT}
        </motion.div>

        <div className="flex flex-col gap-1.5">
          <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
            <motion.div style={{ width: progressPct }} className="h-full rounded-full bg-amber-400" />
          </div>
          <p className="font-mono text-xs text-zinc-500">
            <span ref={widthValRef} className="text-zinc-300">{W_MIN}</span>
            {' px wide'}
          </p>
        </div>
      </div>

      {/* Right column: live Pretext output */}
      <div className="relative flex min-w-0 flex-1 flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500/80">
          pretext output
        </span>

        <div ref={linesListRef} className="min-h-0 flex-1 overflow-hidden" />

        <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">height</span>
            <span ref={heightValRef} className="tabular-nums text-amber-400">—</span>
            <span className="text-zinc-600">px</span>
          </div>
          <div className="h-3 w-px bg-zinc-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">lines</span>
            <span ref={linesNumRef} className="tabular-nums text-amber-400">—</span>
          </div>
          <div className="ml-auto text-zinc-600">no DOM reflow</div>
        </div>
      </div>

    </div>
  )
}
