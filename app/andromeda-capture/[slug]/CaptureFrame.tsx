'use client'

// Fit-scales an Andromeda demo into a fixed 1280×720 void canvas so every
// component yields a uniform 16:9 card image. Mirrors the Andromeda layout's
// font wiring (--font-jetbrains-mono) so demos render in JetBrains Mono, not a
// system fallback. Exposes:
//   [data-capture-frame] — the exact element the screenshot script grabs
//   [data-capture-ready] — present once measured, scaled, and fonts loaded
import { useEffect, useRef, useState } from 'react'
import { JetBrains_Mono } from 'next/font/google'
import { AndromedaDemo } from '../../_lib/andromeda/andromeda-demos'
import { tokens } from '../../../design-systems/andromeda/tokens'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const FRAME_W = 1280
const FRAME_H = 720
const PAD = 64
const INNER_W = FRAME_W - PAD * 2
const INNER_H = FRAME_H - PAD * 2
// Demos are built for the tall detail page, so most occupy a small fraction of
// a 16:9 frame. Scale each one UP to fill the frame (capped) so it reads at
// card size. Contain-fit on the measured demo box — it enlarges, never crops.
const MAX_SCALE = 2.6

export function CaptureFrame({ slug }: { slug: string }) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      // Measure after webfonts settle so the height reflects real metrics.
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        try {
          await document.fonts.ready
        } catch {}
      }
      const el = innerRef.current
      if (!el || cancelled) return
      // Measure the demo's true ink bounds: the union of its descendant rects,
      // NOT the root box. Some demos declare width:100%, so the root would
      // report the full frame width even when the visible content is small and
      // centered (e.g. UserMenu/UserCard trigger demos). The wrapper stays a
      // fixed width so responsive charts still render correctly — only the
      // measurement changes.
      const root = el.firstElementChild ?? el
      let minL = Infinity,
        minT = Infinity,
        maxR = -Infinity,
        maxB = -Infinity
      for (const node of root.querySelectorAll('*')) {
        const r = node.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        if (r.left < minL) minL = r.left
        if (r.top < minT) minT = r.top
        if (r.right > maxR) maxR = r.right
        if (r.bottom > maxB) maxB = r.bottom
      }
      const rootRect = root.getBoundingClientRect()
      const w = maxR > minL ? maxR - minL : rootRect.width
      const h = maxB > minT ? maxB - minT : rootRect.height
      const s =
        w > 0 && h > 0 ? Math.min(MAX_SCALE, INNER_W / w, INNER_H / h) : 1
      setScale(s)
      requestAnimationFrame(() => {
        if (!cancelled) setReady(true)
      })
    }
    run()
    return () => {
      cancelled = true
    }
  }, [slug])

  return (
    <div
      data-capture-frame=""
      data-capture-ready={ready ? '' : undefined}
      className={jetbrainsMono.variable}
      style={{
        position: 'fixed',
        inset: 0,
        width: FRAME_W,
        height: FRAME_H,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: tokens.color.surface.base,
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      {/* Kill body margins / scrollbars so the fixed frame fills the viewport
          exactly and the element screenshot has no stray edges. */}
      <style>{`html,body{margin:0;padding:0;overflow:hidden;}`}</style>
      <div
        ref={innerRef}
        style={{
          width: INNER_W,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <AndromedaDemo slug={slug} />
      </div>
    </div>
  )
}
