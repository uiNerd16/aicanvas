'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

// ─── Pixel art grid ───────────────────────────────────────────────────────────
// 0=transparent  1=blue  2=yellow  3=white  4=red  5=green
const RABBIT: number[][] = [
  [0,0,1,1,0,0,1,1,0,0],   // ear tips
  [0,0,1,2,0,0,1,2,0,0],   // ears — yellow inside
  [0,0,1,2,0,0,1,2,0,0],   // ears — yellow inside
  [0,0,1,1,0,0,1,1,0,0],   // ear base
  [0,1,1,1,1,1,1,1,1,0],   // head
  [0,1,3,1,1,1,1,3,1,0],   // white eyes
  [0,1,1,1,4,1,1,1,1,0],   // red nose
  [5,5,5,5,5,5,5,5,5,0],   // green collar
  [1,1,1,1,1,1,1,1,1,3],   // body — white tail at right
  [0,1,1,1,1,1,1,1,1,0],   // body lower
  [0,1,1,0,0,0,0,1,1,0],   // feet
]

const EAR_ROWS = 4
const PX       = 7
const RABBIT_W = RABBIT[0].length * PX   // 70
const RABBIT_H = RABBIT.length    * PX   // 77

const C: Record<number, string> = {
  0: 'transparent',
  1: '#3b82f6',   // blue
  2: '#facc15',   // yellow
  3: '#f8fafc',   // white
  4: '#ef4444',   // red
  5: '#22c55e',   // green
}

// ─── Poem — one continuous paragraph so Pretext can reflow it freely ──────────
const POEM_TEXT =
  'In morning light the rabbit wakes, his pink nose twitching as day breaks. ' +
  'He hops through grass on silent feet, each dewy blade a fresh-smelled treat. ' +
  'With floppy ears that catch the breeze, he nibbles clover, takes his ease. ' +
  'The golden eggs are tucked away in nests of green on Easter day.'

// ─── Layout constants (FONT + LINE_H must match CSS exactly) ─────────────────
const FONT   = '12px "Courier New"'
const LINE_H = 20
const PAD    = 14    // container padding
const LEFT_X = 100   // leftmost rabbit position (px from container left)
const REST_Y = 60    // vertical resting position

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ─── Component ────────────────────────────────────────────────────────────────
export function PixelRabbit() {
  const x      = useMotionValue(LEFT_X)
  const y      = useMotionValue(REST_Y)
  const earRot = useMotionValue(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive  = true
    const unsubs: Array<() => void> = []

    // Dynamic import — prepareWithSegments uses browser canvas; must not run on server
    import('@chenglou/pretext').then(({ prepareWithSegments, layoutNextLine }) => {
      if (!alive) return

      const cw      = containerRef.current?.clientWidth ?? 480
      const textW   = cw - PAD * 2            // full available text width
      const RIGHT_X = cw - RABBIT_W - PAD     // rightmost rabbit position

      // One-time preparation pass (~19ms) — measures every glyph width via canvas
      const prepared = prepareWithSegments(POEM_TEXT, FONT)

      // Called on every position change — pure arithmetic, ~0.09ms
      function renderText(rx: number, ry: number) {
        if (!textRef.current || !alive) return

        // Convert rabbit's container-y into text-div-local coords
        // (textRef starts PAD below container top)
        const rbTextY = ry - PAD

        let cursor = { segmentIndex: 0, graphemeIndex: 0 }
        let lineY  = 0
        const html: string[] = []

        while (lineY < 600) {
          // Does this line band vertically overlap the rabbit?
          const overlaps = lineY < rbTextY + RABBIT_H && lineY + LINE_H > rbTextY

          // Lines beside the rabbit stop at the rabbit's left edge;
          // space available = rabbit's container-x minus text-div's left offset (PAD)
          const maxW = overlaps ? Math.max(50, rx - PAD) : textW

          const line = layoutNextLine(prepared, cursor, maxW)
          if (!line) break

          html.push(
            `<div style="position:absolute;top:${lineY}px;left:0;` +
            `font:${FONT};color:#71717a;white-space:nowrap">${esc(line.text)}</div>`
          )
          cursor = line.end
          lineY += LINE_H
        }

        textRef.current.innerHTML = html.join('')
      }

      // Initial render
      renderText(LEFT_X, REST_Y)

      // Re-render on every frame of the rabbit's motion
      unsubs.push(
        x.on('change', v => renderText(v, y.get())),
        y.on('change', v => renderText(x.get(), v)),
      )

      // ── Animation helpers ────────────────────────────────────────────────
      async function hop(n = 2) {
        for (let i = 0; i < n; i++) {
          if (!alive) return
          await animate(y, [REST_Y, REST_Y - 28, REST_Y], {
            duration: 0.42, ease: [0.4, 0, 0.2, 1],
          })
        }
      }

      async function walk(toX: number) {
        if (!alive) return
        const dur = 1.7
        const yKf = [
          REST_Y, REST_Y - 11, REST_Y, REST_Y - 11, REST_Y,
          REST_Y - 11, REST_Y, REST_Y - 11, REST_Y,
        ]
        await Promise.all([
          animate(x, toX, { duration: dur, ease: 'linear' }),
          animate(y, yKf, { duration: dur }),
        ])
      }

      async function wiggle() {
        if (!alive) return
        await animate(earRot, [-11, 11, -7, 7, -3, 3, 0], { duration: 1.3 })
        if (alive) await new Promise<void>(r => setTimeout(r, 280))
      }

      // ── Main loop ────────────────────────────────────────────────────────
      async function loop() {
        if (!alive) return
        await hop(2)
        if (!alive) return
        await walk(RIGHT_X)
        if (!alive) return
        await hop(1)
        if (!alive) return
        await wiggle()
        if (!alive) return
        await walk(LEFT_X)
        if (!alive) return
        await wiggle()
        if (!alive) return
        await new Promise<void>(r => setTimeout(r, 200))
        if (alive) loop()
      }

      loop()
    })

    return () => {
      alive = false
      unsubs.forEach(fn => fn())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const earRows  = RABBIT.slice(0, EAR_ROWS)
  const bodyRows = RABBIT.slice(EAR_ROWS)

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#0a0a0a]"
    >
      {/* Poem — written directly to the DOM each frame, no React re-renders */}
      <div
        ref={textRef}
        className="pointer-events-none absolute"
        style={{ top: PAD, left: PAD, right: 0, bottom: 0 }}
      />

      {/* Pixel rabbit */}
      <motion.div style={{ x, y }} className="absolute z-10">

        {/* Ears — wiggle around their bottom edge */}
        <motion.div style={{ rotate: earRot, transformOrigin: '50% 100%' }}>
          {earRows.map((row, ri) => (
            <div key={ri} style={{ display: 'flex' }}>
              {row.map((cell, ci) => (
                <div key={ci} style={{ width: PX, height: PX, background: C[cell] }} />
              ))}
            </div>
          ))}
        </motion.div>

        {/* Body */}
        <div>
          {bodyRows.map((row, ri) => (
            <div key={ri} style={{ display: 'flex' }}>
              {row.map((cell, ci) => (
                <div key={ci} style={{ width: PX, height: PX, background: C[cell] }} />
              ))}
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  )
}
