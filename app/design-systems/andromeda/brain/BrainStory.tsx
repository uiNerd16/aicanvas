'use client'

// ============================================================
// Andromeda Brain — the story / pitch surface (non-premium).
// Drop into a starfield of the system's real information; scroll
// and it compiles into a brain — nodes migrate together, the
// CONNECTIONS DRAW between the stars, a few fire. Narration is
// centered, slides down as you scroll, and hands off across
// staged beats. Framer's useScroll (on this component's own
// container) drives it; Canvas 2D renders it; narration is
// state-driven from live progress. Ends on the CTA.
//
// Counts + section names derive from BRAIN_TEASER (never hardcoded,
// never brain CONTENT). Safe for anonymous/free.
// ============================================================

import { useEffect, useMemo, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import Link from 'next/link'
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { BRAIN_TEASER } from '@/app/lib/andromeda-brain-teaser.generated'

const C = { base: '#0E0E0F', node: '154,154,154', reason: '199,199,199', bright: '#F5F5F5', accent: '#0FCFB2', muted: '#6E6E6E' }
const FONT = "var(--font-jetbrains-mono, 'JetBrains Mono Variable'), 'JetBrains Mono', monospace"

const FND: readonly string[] = BRAIN_TEASER.sections.find((s) => s.id === 'foundations')?.files ?? []
const CMP: readonly string[] = BRAIN_TEASER.sections.find((s) => s.id === 'component-rules')?.files ?? []
const pick = <T,>(arr: readonly T[], n: number) => {
  const step = Math.max(1, Math.floor(arr.length / n)); const out: T[] = []
  for (let i = 0; i < arr.length && out.length < n; i += step) out.push(arr[i]); return out
}
type Kind = 'token' | 'foundation' | 'component' | 'reason'
const LABELS: { text: string; kind: Kind }[] = [
  ...['color is measurement', 'one frame per surface', 'movement signals data', 'must · should · may', 'desktop-first', 'no glow'].map((text) => ({ text, kind: 'reason' as const })),
  ...pick(FND, 7).map((text) => ({ text, kind: 'foundation' as const })),
  ...pick(CMP, 13).map((text) => ({ text, kind: 'component' as const })),
  ...['accent.300', 'spacing.6', 'duration.cascade', 'tracking.widest'].map((text) => ({ text, kind: 'token' as const })),
]

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const clamp01 = (x: number) => Math.max(0, Math.min(1, x))
const smoothstep = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t) }
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

interface Node { sx: number; sy: number; tx: number; ty: number; label?: string; kind?: Kind; r: number; st: number; ph: number; fire: number; edge: boolean }
interface Star { x: number; y: number; r: number; a: number; ph: number }
interface Edge { i: number; j: number; s: number }

function build() {
  const rnd = mulberry32(0x5eed)
  const DOTS = 300
  const nodes: Node[] = []
  const sample = () => {
    const side = rnd() < 0.5 ? -1 : 1
    const a = rnd() * Math.PI * 2, rr = Math.pow(rnd(), 0.5)
    let x = side * 0.3 + Math.cos(a) * 0.42 * rr
    let y = -0.03 + Math.sin(a) * 0.44 * rr
    x += Math.cos(a * 6 + side * 1.7) * 0.03 * rr; y += Math.sin(a * 5) * 0.03 * rr
    x *= 1.12
    if (Math.abs(x) < 0.07) x = 0.07 * (x < 0 ? -1 : 1)
    if (y > 0.32) { const o = y - 0.32; y = 0.32 + o * 0.5; x *= 1 - o * 0.7 }
    return { x, y, edge: rr > 0.8 }
  }
  const scatter = () => { const sa = rnd() * Math.PI * 2, sd = 0.45 + rnd() * 0.6; return { sx: Math.cos(sa) * sd * 1.1, sy: Math.sin(sa) * sd * 0.95 } }
  for (let i = 0; i < DOTS; i++) {
    const s = sample(), sc = scatter()
    nodes.push({ ...sc, tx: s.x, ty: s.y, edge: s.edge, r: s.edge ? 0.7 + rnd() * 0.9 : 0.5 + rnd() * 0.8, st: rnd(), ph: rnd() * Math.PI * 2, fire: rnd() })
  }
  for (let k = 0; k < 7; k++) { const t = k / 7, sc = scatter(); nodes.push({ ...sc, tx: (rnd() - 0.5) * 0.06, ty: 0.38 + t * 0.2, edge: false, r: 0.7 + rnd() * 0.7, st: rnd(), ph: rnd() * Math.PI * 2, fire: rnd() * 0.3 }) }
  const rim = nodes.map((n, i) => i).filter((i) => nodes[i].edge).sort((a, b) => (nodes[b].tx ** 2 + nodes[b].ty ** 2) - (nodes[a].tx ** 2 + nodes[a].ty ** 2))
  LABELS.forEach((l, i) => { const idx = rim[Math.floor((i / LABELS.length) * rim.length)]; if (idx == null) return; nodes[idx].label = l.text; nodes[idx].kind = l.kind; nodes[idx].r = Math.max(nodes[idx].r, 1.2) })
  const edges: Edge[] = []; const seen = new Set<string>()
  for (let i = 0; i < nodes.length; i++) {
    const near = nodes.map((n, j) => ({ j, d: (n.tx - nodes[i].tx) ** 2 + (n.ty - nodes[i].ty) ** 2 })).filter((o) => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 2)
    for (const { j } of near) { const key = i < j ? `${i}-${j}` : `${j}-${i}`; if (!seen.has(key)) { seen.add(key); edges.push({ i, j, s: rnd() }) } }
  }
  // ambient background starfield (does not migrate)
  const stars: Star[] = []
  for (let i = 0; i < 120; i++) stars.push({ x: (rnd() * 2 - 1) * 1.35, y: (rnd() * 2 - 1) * 1.05, r: 0.4 + rnd() * 0.9, a: 0.08 + rnd() * 0.28, ph: rnd() * Math.PI * 2 })
  return { nodes, edges, stars }
}

// narration timing: fade+rise in, fade+rise out (scrubbed with scroll)
const narr = (inA: number, inB: number, outA: number, outB: number, p: number) => {
  const e = smoothstep(inA, inB, p), x = smoothstep(outA, outB, p)
  return { opacity: e * (1 - x), ty: (1 - e) * 16 - x * 12, blur: (1 - e) * 5 }
}

export function BrainStory() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const { nodes, edges, stars } = useMemo(build, [])
  const { scrollYProgress } = useScroll({ container: scrollerRef })
  const [prog, setProg] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setProg(v))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0, W = 0, H = 0
    const resize = () => {
      const stage = canvas.parentElement!
      W = stage.clientWidth; H = stage.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize(); window.addEventListener('resize', resize)

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw)
      const p = reduced ? 1 : scrollYProgress.get()
      const t = time * 0.001
      const cx = W / 2, cy = H * 0.44, scale = Math.min(W * 0.6, H * 0.56)
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = C.base; ctx.fillRect(0, 0, W, H)

      // ambient starfield (subtle twinkle)
      for (const s of stars) {
        const a = s.a * (0.6 + 0.4 * Math.sin(t * 0.7 + s.ph))
        ctx.beginPath(); ctx.arc(cx + s.x * scale, cy + s.y * scale, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(154,154,154,${a})`; ctx.fill()
      }

      const px = new Array(nodes.length), py = new Array(nodes.length), form = new Array(nodes.length)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const start = 0.1 + n.st * 0.46           // migration spread wide -> slow assemble
        const m = easeOutCubic(smoothstep(start, start + 0.2, p)); form[i] = m
        let nx = lerp(n.sx, n.tx, m), ny = lerp(n.sy, n.ty, m)
        if (!reduced) { nx += Math.sin(t * 0.28 + n.ph) * 0.011 * (1 - m * 0.4); ny += Math.cos(t * 0.24 + n.ph * 1.3) * 0.011 * (1 - m * 0.4) }
        px[i] = cx + nx * scale; py[i] = cy + ny * scale
      }

      // CONNECTIONS DRAW between the stars — each edge grows i -> j over its window
      for (let e = 0; e < edges.length; e++) {
        const { i, j, s } = edges[e]
        if (Math.min(form[i], form[j]) < 0.55) continue
        const es = 0.5 + s * 0.34
        const dT = smoothstep(es, es + 0.06, p)
        if (dT <= 0) continue
        const ex = lerp(px[i], px[j], dT), ey = lerp(py[i], py[j], dT)
        ctx.lineWidth = 1; ctx.strokeStyle = `rgba(58,58,59,${0.5 * dT})`
        ctx.beginPath(); ctx.moveTo(px[i], py[i]); ctx.lineTo(ex, ey); ctx.stroke()
        if (dT < 1 && !reduced) { // bright signal at the growing tip
          const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, 9)
          g.addColorStop(0, 'rgba(15,207,178,0.9)'); g.addColorStop(1, 'rgba(15,207,178,0)')
          ctx.fillStyle = g; ctx.fillRect(ex - 9, ey - 9, 18, 18)
        }
      }

      // firing pulses once the network is up
      const live = smoothstep(0.72, 0.9, p)
      if (!reduced && live > 0.01) {
        for (let a = 0; a < 9; a++) {
          const e = Math.floor(t * 1.0 + a * (edges.length / 9)) % edges.length
          const { i, j } = edges[e]; if (Math.min(form[i], form[j]) < 0.9) continue
          const pr = (t * 0.6 + a * 0.29) % 1
          const gx = lerp(px[i], px[j], pr), gy = lerp(py[i], py[j], pr)
          const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 22)
          g.addColorStop(0, `rgba(15,207,178,${0.5 * live})`); g.addColorStop(1, 'rgba(15,207,178,0)')
          ctx.fillStyle = g; ctx.fillRect(gx - 22, gy - 22, 44, 44)
        }
      }

      // nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i], m = form[i]
        const firing = !reduced && n.fire > 0.9 && live > 0.3 ? 0.5 + 0.5 * Math.sin(t * 2 + n.ph) : 0
        if (firing > 0.2) {
          const g = ctx.createRadialGradient(px[i], py[i], 0, px[i], py[i], 12)
          g.addColorStop(0, `rgba(15,207,178,${0.36 * firing * live})`); g.addColorStop(1, 'rgba(15,207,178,0)')
          ctx.fillStyle = g; ctx.fillRect(px[i] - 12, py[i] - 12, 24, 24)
        }
        ctx.beginPath(); ctx.arc(px[i], py[i], n.r, 0, Math.PI * 2)
        ctx.fillStyle = firing > 0.2 ? `rgba(15,207,178,${0.6 + 0.4 * firing})` : `rgba(${C.node},${0.3 + 0.5 * Math.max(0.3, m)})`
        ctx.fill()
      }

      // labels (spread outward, de-overlap)
      const labelP = smoothstep(0.5, 0.72, p)
      if (labelP > 0.02) {
        ctx.font = `10px ${FONT}`; ctx.textBaseline = 'middle'
        const placed: { x: number; y: number; w: number }[] = []
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i]; if (!n.label || form[i] < 0.9) continue
          const left = n.tx < 0, w = ctx.measureText(n.label).width
          const lx = left ? px[i] - n.r - 6 - w : px[i] + n.r + 6, ly = py[i]
          if (placed.some((q) => Math.abs(q.y - ly) < 13 && lx < q.x + q.w + 8 && lx + w > q.x - 8)) continue
          placed.push({ x: lx, y: ly, w }); ctx.textAlign = 'left'
          ctx.fillStyle = `rgba(${n.kind === 'reason' ? C.reason : C.node},${labelP * 0.82})`
          ctx.fillText(n.label, lx, ly)
        }
      }
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [nodes, edges, stars, reduced, scrollYProgress])

  const total = BRAIN_TEASER.totalFiles, foundationsN = FND.length, rulesN = CMP.length
  const p = prog
  const hintO = 1 - smoothstep(0, 0.05, p)
  const introExit = smoothstep(0.06, 0.16, p)
  const introO = 1 - introExit
  const introDown = introExit * 130
  const a = narr(0.16, 0.24, 0.3, 0.37, p)      // 48 files
  const bft = narr(0.34, 0.42, 0.48, 0.55, p)   // foundations
  const cmp = narr(0.52, 0.6, 0.66, 0.73, p)    // component rules
  const rsn = narr(0.7, 0.78, 0.83, 0.88, p)    // reasoning
  const cta = narr(0.88, 0.94, 2, 2, p)         // CTA (no exit)

  const beat = (n: { opacity: number; ty: number; blur: number }, node: ReactNode, extra?: CSSProperties) => (
    <div style={{ opacity: n.opacity, transform: `translate(-50%, calc(-50% + ${n.ty}px))`, filter: n.blur > 0.1 ? `blur(${n.blur}px)` : 'none', position: 'absolute', left: '50%', top: '78%', width: 'min(760px, 86%)', textAlign: 'center', ...extra }}>{node}</div>
  )

  return (
    <div ref={scrollerRef} data-brain-scroller style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: C.base }}>
      <style>{`@keyframes bstoryBounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}`}</style>
      <div style={{ position: 'relative', height: '620vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} />
          {/* legibility scrim for lower narration */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%', background: 'linear-gradient(to top, #0E0E0F 8%, rgba(14,14,15,0) 100%)', pointerEvents: 'none' }} />

          {/* intro — centered, slides down + fades on scroll */}
          <div style={{ opacity: introO, transform: `translate(-50%, calc(-50% + ${introDown}px))`, position: 'absolute', left: '50%', top: '46%', width: 'min(820px,90%)', textAlign: 'center', fontFamily: FONT, pointerEvents: 'none' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>Andromeda / Premium</div>
            <div style={{ fontSize: 'clamp(22px,3.6vw,38px)', color: C.bright, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}>Every value. Every rule. Every decision.</div>
          </div>

          {/* scroll cue — downward */}
          <div style={{ opacity: hintO, position: 'absolute', left: '50%', bottom: '8%', transform: 'translateX(-50%)', textAlign: 'center', fontFamily: FONT, color: C.muted, pointerEvents: 'none' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 8 }}>Scroll to compile</div>
            <div style={{ animation: 'bstoryBounce 1.6s ease-in-out infinite', display: 'inline-block' }}>
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1l7 7 7-7" stroke="#6E6E6E" strokeWidth="1.4" /></svg>
            </div>
          </div>

          {/* staged narration beats (lower third) */}
          {beat(a, <span style={{ fontFamily: FONT, fontSize: 'clamp(18px,2.8vw,30px)', color: C.bright, fontWeight: 700 }}>{total} files of judgment, compiling.</span>)}
          {beat(bft, <span style={{ fontFamily: FONT, fontSize: 'clamp(16px,2.5vw,26px)', color: `rgb(${C.reason})`, fontWeight: 600 }}>{foundationsN} foundations. The system-wide taste.</span>)}
          {beat(cmp, <span style={{ fontFamily: FONT, fontSize: 'clamp(16px,2.5vw,26px)', color: `rgb(${C.reason})`, fontWeight: 600 }}>{rulesN} component rules. Every do, and every don&apos;t.</span>)}
          {beat(rsn, <span style={{ fontFamily: FONT, fontSize: 'clamp(15px,2.4vw,24px)', color: `rgb(${C.reason})`, fontWeight: 600, lineHeight: 1.4 }}>Not the tokens. Not the components. The reasoning that connects them.</span>)}

          {/* CTA */}
          <div style={{ opacity: cta.opacity, transform: `translate(-50%, calc(-50% + ${cta.ty}px))`, filter: cta.blur > 0.1 ? `blur(${cta.blur}px)` : 'none', position: 'absolute', left: '50%', top: '74%', width: 'min(620px,90%)', textAlign: 'center', fontFamily: FONT, pointerEvents: cta.opacity > 0.5 ? 'auto' : 'none' }}>
            <div style={{ fontSize: 'clamp(26px,3.6vw,42px)', color: C.bright, fontWeight: 700, letterSpacing: '-0.02em' }}>The Andromeda Brain</div>
            <div style={{ fontSize: 13, color: `rgb(${C.node})`, margin: '12px 0 22px', lineHeight: 1.6 }}>The judgment your agent reads to build on-brand on the first prompt. {foundationsN} foundations, {rulesN} component rules, {total} files of design intent.</div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center', justifyContent: 'center' }}>
              <Link href="/pricing" style={{ background: C.accent, color: C.base, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 28px', textDecoration: 'none', fontFamily: FONT }}>Upgrade to Premium</Link>
              <Link href="/design-systems/andromeda" style={{ fontSize: 12, color: C.muted, letterSpacing: '0.08em', textDecoration: 'none', fontFamily: FONT }}>Explore Andromeda</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
