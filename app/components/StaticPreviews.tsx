// Static (no-animation) preview thumbnails for cards that can't be frozen
// by MotionConfig (Three.js RAF loops, Framer Motion animate() utility calls,
// or setTimeout-driven remount cycles).

// ─── PixelRabbitStatic ────────────────────────────────────────────────────────

const RABBIT = [
  [0,0,1,1,0,0,1,1,0,0], [0,0,1,2,0,0,1,2,0,0],
  [0,0,1,2,0,0,1,2,0,0], [0,0,1,1,0,0,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,0], [0,1,3,1,1,1,1,3,1,0],
  [0,1,1,1,4,1,1,1,1,0], [5,5,5,5,5,5,5,5,5,0],
  [1,1,1,1,1,1,1,1,1,3], [0,1,1,1,1,1,1,1,1,0],
  [0,1,1,0,0,0,0,1,1,0],
]
const PX = 8
const C: Record<number, string> = {
  0: 'transparent', 1: '#3b82f6', 2: '#facc15',
  3: '#f8fafc',     4: '#ef4444', 5: '#22c55e',
}

export function PixelRabbitStatic() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0a0a0a]">
      <div>
        {RABBIT.map((row, ri) => (
          <div key={ri} style={{ display: 'flex' }}>
            {row.map((cell, ci) => (
              <div key={ci} style={{ width: PX, height: PX, background: C[cell] }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ParticleSphereStatic ─────────────────────────────────────────────────────

export function ParticleSphereStatic() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: [
            'radial-gradient(',
            '  ellipse at 40% 38%,',
            '  rgba(255,210,80,0.95) 0%,',
            '  rgba(255,150,30,0.70) 28%,',
            '  rgba(210,210,220,0.35) 60%,',
            '  transparent 80%',
            ')',
          ].join(''),
          boxShadow: '0 0 60px 16px rgba(255,160,30,0.18), 0 0 120px 40px rgba(255,120,10,0.08)',
        }}
      />
    </div>
  )
}

// ─── TextBlurRevealStatic ─────────────────────────────────────────────────────

const WORDS  = ['Craft', 'interfaces', 'that', 'feel', 'like', 'magic.']
const ACCENT = new Set([1, 5])

export function TextBlurRevealStatic() {
  return (
    <div className="flex flex-wrap justify-center gap-x-[0.4em] gap-y-1 px-6">
      {WORDS.map((word, i) => (
        <span
          key={i}
          className={
            ACCENT.has(i)
              ? 'bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent'
              : 'text-4xl font-bold tracking-tight text-white'
          }
        >
          {word}
        </span>
      ))}
    </div>
  )
}

// ─── TextLayoutCardStatic ─────────────────────────────────────────────────────

const PREVIEW_TEXT = 'Pretext computes wrap and height via canvas. No DOM reflow. ~0.09ms per layout call.'

export function TextLayoutCardStatic() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 p-5">
      <div style={{ fontFamily: '"Courier New", monospace', fontSize: 13, lineHeight: '20px', color: '#d4d4d8' }}>
        <div style={{
          width: 240,
          border: '1px solid #3f3f46',
          borderRadius: 6,
          padding: '10px 12px',
        }}>
          {PREVIEW_TEXT}
        </div>
        <div style={{ marginTop: 8, height: 3, width: '62%', background: '#d4a520', borderRadius: 2 }} />
        <p style={{ marginTop: 6, fontSize: 11, color: '#71717a' }}>
          width: <span style={{ color: '#d4d4d8' }}>240</span> px
          &nbsp;&nbsp;lines: <span style={{ color: '#d4d4d8' }}>4</span>
        </p>
      </div>
    </div>
  )
}
