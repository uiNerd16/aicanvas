import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`RunwayLoader\`: a playful progress indicator shaped like a runway. A top-down SVG airplane taxis left→right along a rounded horizontal track while a red fill grows behind it. When the plane nose touches the right wall it "takes off" (scales + slides off-screen + fades), the bar completes, then the whole thing resets and loops. Numeric % and label read out below. Supports light + dark themes.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types. Define the Airplane SVG as a plain inner function component in the same file (not an exported helper).

Imports: useEffect, useRef, useState from 'react'; motion, AnimatePresence from 'framer-motion'.

Airplane({isDark}): <svg className="w-[52px] sm:w-[72px] h-auto" viewBox="0 0 72 46" fill="none" style={{filter: isDark ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.35)) drop-shadow(0 1px 3px rgba(0,0,0,0.2))'}}>
Colors (dark vs light): bodyTop '#ececec'/'#c8c8c8', bodyMid '#ffffff'/'#dedede', bodyBot '#d0d0d0'/'#b4b4b4', wingLight '#f8f8f8'/'#d8d8d8', wingDark '#bababa'/'#909090', tail '#c8c8c8'/'#a8a8a8', nose '#f4f4f4'/'#d8d8d8'.
defs: linearGradient id="rl-body" x1=0 y1=0 x2=0 y2=1 stops 0% bodyTop, 40% bodyMid, 100% bodyBot. "rl-wing-t" x1=0 y1=1 x2=1 y2=0 stops wingLight→wingDark. "rl-wing-b" x1=0 y1=0 x2=1 y2=1 stops wingLight→wingDark.
Paths:
- Top wing: <path d="M44,21 L28,21 L8,2 L18,0 Z" fill="url(#rl-wing-t)"/>
- Bottom wing: <path d="M44,25 L28,25 L8,44 L18,46 Z" fill="url(#rl-wing-b)"/>
- Tail stabilisers: <path d="M8,21 L2,14 L6,14 L12,21 Z" fill={tail}/> and <path d="M8,25 L2,32 L6,32 L12,25 Z" fill={tail}/>
- Fuselage: <ellipse cx=34 cy=23 rx=29 ry=7 fill="url(#rl-body)"/>
- Nose: <path d="M61,19.5 C66,21.5 67.5,23 67,23 C67.5,23 66,24.5 61,26.5 L58,23 Z" fill={nose}/>
- Cockpit window: <ellipse cx=57 cy=23 rx=4 ry=3 fill="#7ec8e8" opacity="0.9"/>

Type Phase = 'taxiing' | 'takeoff' | 'resetting'.

State/refs in RunwayLoader:
- containerRef<HTMLDivElement>
- [isDark, setIsDark] default true
- [progress, setProgress] number starting 0
- [phase, setPhase]<Phase> default 'taxiing'
- [cycle, setCycle] number 0
- rafRef number 0, startRef undefined, aliveRef true, disappearedRef false
- const WALL_PCT = 91

Theme effect: same closest [data-card-theme] / html fallback pattern. MutationObserver on both, cleanup disconnect.

Animation effect (runs once):
- aliveRef.current=true; disappearedRef.current=false; TAXI_MS=5500.
- tick(ts): if !aliveRef return. if !startRef set startRef=ts. t=min((ts-startRef)/TAXI_MS, 1). eased = t<=0.75 ? (t/0.75)*82 : 82 + (1 - (1-(t-0.75)/0.25)^2)*18. p=min(eased,100). setProgress(p). If p>=WALL_PCT && !disappearedRef: disappearedRef=true; setPhase('takeoff'). If p<100 raf=requestAnimationFrame(tick); else setTimeout 600ms: setPhase('resetting'), setTimeout 400ms: disappearedRef=false, startRef=undefined, setProgress(0), setPhase('taxiing'), setCycle(c=>c+1), raf=requestAnimationFrame(tick).
- Initial: rafRef=requestAnimationFrame(tick). Cleanup: aliveRef=false; cancelAnimationFrame(rafRef).

planePct = min(progress, WALL_PCT).

Theme-responsive track styles:
- trackBg dark: 'linear-gradient(to bottom, #404040, #252525)'; light: 'linear-gradient(to bottom, #bab7b2, #a09d98)'
- trackShadow dark: 'inset 0 4px 12px rgba(0,0,0,0.85), inset 0 -1px 3px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.5)'; light: 'inset 0 3px 8px rgba(0,0,0,0.22), inset 0 -1px 3px rgba(255,255,255,0.28), 0 2px 5px rgba(0,0,0,0.12)'
- dashColor dark 'rgba(255,255,255,0.22)' light 'rgba(255,255,255,0.42)'

JSX:
<div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{background: isDark?'#110F0C':'#F5F1EA'}}>
  <div className="flex w-full max-w-[440px] flex-col items-center gap-4 px-4 sm:gap-6 sm:px-6">
    <div className="relative h-11 w-full overflow-visible rounded-full sm:h-14" style={{background:trackBg, boxShadow:trackShadow}}>

      {/* Centreline dashes */}
      <div className="pointer-events-none absolute top-1/2 -translate-y-px" style={{ left:18, right:18, height:2, backgroundImage: \`repeating-linear-gradient(to right, \${dashColor} 0, \${dashColor} 10px, transparent 10px, transparent 24px)\` }}/>

      {/* Red fill on top */}
      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: \`\${progress}%\`, background:'linear-gradient(to right, #6b0000, #be1c1c 50%, #e03030)', boxShadow:'inset 0 1px 3px rgba(255,255,255,0.1)' }}/>

      {/* Heat shimmer exhaust — only when taxiing & progress>30 */}
      {phase === 'taxiing' && progress > 30 && (
        <motion.div className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full" style={{ right: \`calc(\${100 - planePct}% + 26px)\`, width: Math.min(((progress-30)/70)*56, 56), height: 22, background:'radial-gradient(ellipse at right, rgba(255,140,20,0.3), transparent)', filter:'blur(8px)' }} animate={{opacity:[0.3,0.75,0.2,0.65,0.3]}} transition={{duration:0.2, repeat:Infinity}}/>
      )}

      <AnimatePresence>
        {phase !== 'resetting' && (
          <div key={\`plane-\${cycle}\`} className="pointer-events-none absolute top-1/2 z-20" style={{ left: \`\${planePct}%\`, transform:'translateX(-50%) translateY(-50%)' }}>
            {phase === 'taxiing'
              ? <Airplane isDark={isDark}/>
              : <motion.div initial={{opacity:1,x:0,scale:1}} animate={{opacity:0,x:120,scale:1.8}} transition={{duration:0.7,ease:'easeIn'}}><Airplane isDark={isDark}/></motion.div>
            }
          </div>
        )}
      </AnimatePresence>
    </div>

    <div className="flex flex-col items-center gap-1">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums sm:text-[28px]" style={{color: isDark?'#FAF7F2':'#1C1916'}}>{Math.round(progress)}</span>
        <span className="text-sm font-semibold sm:text-base" style={{color:'#9E9890'}}>%</span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-widest sm:text-[11px]" style={{color: isDark?'#736D65':'#9E9890'}}>
        {phase === 'takeoff' ? 'Taking off!' : phase === 'resetting' ? '—' : 'Preparing for takeoff'}
      </span>
    </div>
  </div>
</div>`,

  GPT: `Build a React client component named \`RunwayLoader\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Imports
'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

## Types
type Phase = 'taxiing' | 'takeoff' | 'resetting'

## Airplane subcomponent (top-down, pointing right)
function Airplane({ isDark }: { isDark: boolean }) — palette per theme:
  bodyTop '#ececec'/'#c8c8c8', bodyMid '#ffffff'/'#dedede', bodyBot '#d0d0d0'/'#b4b4b4'
  wingLight '#f8f8f8'/'#d8d8d8', wingDark '#bababa'/'#909090'
  tail '#c8c8c8'/'#a8a8a8', nose '#f4f4f4'/'#d8d8d8'

svg className="w-[52px] sm:w-[72px] h-auto" viewBox="0 0 72 46" fill="none"
filter dark: 'drop-shadow(0 4px 12px rgba(0,0,0,0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
filter light: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35)) drop-shadow(0 1px 3px rgba(0,0,0,0.2))'

defs:
- linearGradient#rl-body x1=0 y1=0 x2=0 y2=1: stop 0% bodyTop, 40% bodyMid, 100% bodyBot
- linearGradient#rl-wing-t x1=0 y1=1 x2=1 y2=0: wingLight → wingDark
- linearGradient#rl-wing-b x1=0 y1=0 x2=1 y2=1: wingLight → wingDark

Paths (exact d values):
- Top wing:    path d="M44,21 L28,21 L8,2 L18,0 Z" fill=url(#rl-wing-t)
- Bottom wing: path d="M44,25 L28,25 L8,44 L18,46 Z" fill=url(#rl-wing-b)
- Tail top:    path d="M8,21 L2,14 L6,14 L12,21 Z" fill={tail}
- Tail bot:    path d="M8,25 L2,32 L6,32 L12,25 Z" fill={tail}
- Fuselage:    ellipse cx=34 cy=23 rx=29 ry=7 fill=url(#rl-body)
- Nose:        path d="M61,19.5 C66,21.5 67.5,23 67,23 C67.5,23 66,24.5 61,26.5 L58,23 Z" fill={nose}
- Cockpit:     ellipse cx=57 cy=23 rx=4 ry=3 fill="#7ec8e8" opacity=0.9

## RunwayLoader state + refs
containerRef<HTMLDivElement>, isDark (true), progress (0), phase ('taxiing'), cycle (0)
rafRef=useRef<number>(0), startRef=useRef<number|undefined>(undefined), aliveRef=useRef(true), disappearedRef=useRef(false)
const WALL_PCT = 91

## Theme effect
Standard closest [data-card-theme] → class check, fallback document.documentElement. MutationObserver on html + cardWrapper (if present), attributeFilter ['class']. Cleanup disconnect.

## Animation loop (useEffect [])
const TAXI_MS = 5500
aliveRef.current = true; disappearedRef.current = false

function tick(ts:number) {
  if (!aliveRef.current) return
  if (!startRef.current) startRef.current = ts
  const t = Math.min((ts - startRef.current) / TAXI_MS, 1)
  const eased = t <= 0.75
    ? (t / 0.75) * 82
    : 82 + (1 - Math.pow(1 - (t - 0.75) / 0.25, 2)) * 18
  const p = Math.min(eased, 100)
  setProgress(p)
  if (p >= WALL_PCT && !disappearedRef.current) { disappearedRef.current = true; setPhase('takeoff') }
  if (p < 100) {
    rafRef.current = requestAnimationFrame(tick)
  } else {
    setTimeout(() => {
      if (!aliveRef.current) return
      setPhase('resetting')
      setTimeout(() => {
        if (!aliveRef.current) return
        disappearedRef.current = false
        startRef.current = undefined
        setProgress(0)
        setPhase('taxiing')
        setCycle(c => c + 1)
        rafRef.current = requestAnimationFrame(tick)
      }, 400)
    }, 600)
  }
}

rafRef.current = requestAnimationFrame(tick)
return () => { aliveRef.current = false; if (rafRef.current) cancelAnimationFrame(rafRef.current) }

## Derived values
const planePct = Math.min(progress, WALL_PCT)
trackBg: dark 'linear-gradient(to bottom, #404040, #252525)' / light 'linear-gradient(to bottom, #bab7b2, #a09d98)'
trackShadow: dark 'inset 0 4px 12px rgba(0,0,0,0.85), inset 0 -1px 3px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.5)' / light 'inset 0 3px 8px rgba(0,0,0,0.22), inset 0 -1px 3px rgba(255,255,255,0.28), 0 2px 5px rgba(0,0,0,0.12)'
dashColor: dark 'rgba(255,255,255,0.22)' / light 'rgba(255,255,255,0.42)'

## JSX
Outer <div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{background:isDark?'#110F0C':'#F5F1EA'}}>
  <div className="flex w-full max-w-[440px] flex-col items-center gap-4 px-4 sm:gap-6 sm:px-6">
    <div className="relative h-11 w-full overflow-visible rounded-full sm:h-14" style={{background:trackBg, boxShadow:trackShadow}}>

      Centreline dashes: <div className="pointer-events-none absolute top-1/2 -translate-y-px" style={{ left:18, right:18, height:2, backgroundImage: \`repeating-linear-gradient(to right, \${dashColor} 0, \${dashColor} 10px, transparent 10px, transparent 24px)\` }}/>

      Red fill: <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: \`\${progress}%\`, background:'linear-gradient(to right, #6b0000, #be1c1c 50%, #e03030)', boxShadow:'inset 0 1px 3px rgba(255,255,255,0.1)' }}/>

      Heat shimmer (only when phase==='taxiing' && progress>30):
      <motion.div className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full" style={{ right: \`calc(\${100 - planePct}% + 26px)\`, width: Math.min(((progress - 30) / 70) * 56, 56), height: 22, background:'radial-gradient(ellipse at right, rgba(255,140,20,0.3), transparent)', filter:'blur(8px)' }} animate={{opacity:[0.3,0.75,0.2,0.65,0.3]}} transition={{duration:0.2,repeat:Infinity}}/>

      <AnimatePresence>
        {phase !== 'resetting' && (
          <div key={\`plane-\${cycle}\`} className="pointer-events-none absolute top-1/2 z-20" style={{ left: \`\${planePct}%\`, transform:'translateX(-50%) translateY(-50%)' }}>
            {phase === 'taxiing'
              ? <Airplane isDark={isDark}/>
              : <motion.div initial={{opacity:1,x:0,scale:1}} animate={{opacity:0,x:120,scale:1.8}} transition={{duration:0.7,ease:'easeIn'}}><Airplane isDark={isDark}/></motion.div>}
          </div>
        )}
      </AnimatePresence>
    </div>

    Readout column:
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums sm:text-[28px]" style={{color:isDark?'#FAF7F2':'#1C1916'}}>{Math.round(progress)}</span>
        <span className="text-sm font-semibold sm:text-base" style={{color:'#9E9890'}}>%</span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-widest sm:text-[11px]" style={{color:isDark?'#736D65':'#9E9890'}}>
        {phase === 'takeoff' ? 'Taking off!' : phase === 'resetting' ? '—' : 'Preparing for takeoff'}
      </span>
    </div>
  </div>
</div>`,

  Gemini: `Implement a React client component named \`RunwayLoader\` as a single TypeScript file. Progress loader shaped like a runway: a top-down SVG airplane taxis left→right along a rounded track while a red fill grows behind it; at 91% progress the plane "takes off" (fades, scales up, slides right); after 100% the loader resets and loops. Numeric % and status label below.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

USE these hooks and no others. DO NOT invent hooks not shown above. Only use motion.div and AnimatePresence from framer-motion.

## Type
type Phase = 'taxiing' | 'takeoff' | 'resetting'

## Airplane subcomponent
function Airplane({ isDark }: { isDark: boolean }) {
  const bodyTop   = isDark ? '#ececec' : '#c8c8c8'
  const bodyMid   = isDark ? '#ffffff' : '#dedede'
  const bodyBot   = isDark ? '#d0d0d0' : '#b4b4b4'
  const wingLight = isDark ? '#f8f8f8' : '#d8d8d8'
  const wingDark  = isDark ? '#bababa' : '#909090'
  const tail      = isDark ? '#c8c8c8' : '#a8a8a8'
  const nose      = isDark ? '#f4f4f4' : '#d8d8d8'

  return (
    <svg className="w-[52px] sm:w-[72px] h-auto" viewBox="0 0 72 46" fill="none" style={{ filter: isDark ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.35)) drop-shadow(0 1px 3px rgba(0,0,0,0.2))' }}>
      <defs>
        <linearGradient id="rl-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bodyTop}/>
          <stop offset="40%" stopColor={bodyMid}/>
          <stop offset="100%" stopColor={bodyBot}/>
        </linearGradient>
        <linearGradient id="rl-wing-t" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={wingLight}/>
          <stop offset="100%" stopColor={wingDark}/>
        </linearGradient>
        <linearGradient id="rl-wing-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={wingLight}/>
          <stop offset="100%" stopColor={wingDark}/>
        </linearGradient>
      </defs>
      <path d="M44,21 L28,21 L8,2 L18,0 Z" fill="url(#rl-wing-t)"/>
      <path d="M44,25 L28,25 L8,44 L18,46 Z" fill="url(#rl-wing-b)"/>
      <path d="M8,21 L2,14 L6,14 L12,21 Z" fill={tail}/>
      <path d="M8,25 L2,32 L6,32 L12,25 Z" fill={tail}/>
      <ellipse cx="34" cy="23" rx="29" ry="7" fill="url(#rl-body)"/>
      <path d="M61,19.5 C66,21.5 67.5,23 67,23 C67.5,23 66,24.5 61,26.5 L58,23 Z" fill={nose}/>
      <ellipse cx="57" cy="23" rx="4" ry="3" fill="#7ec8e8" opacity="0.9"/>
    </svg>
  )
}

## RunwayLoader state
const containerRef = useRef<HTMLDivElement>(null)
const [isDark, setIsDark] = useState(true)
const [progress, setProgress] = useState(0)
const [phase, setPhase] = useState<Phase>('taxiing')
const [cycle, setCycle] = useState(0)
const rafRef = useRef<number>(0)
const startRef = useRef<number | undefined>(undefined)
const aliveRef = useRef(true)
const disappearedRef = useRef(false)
const WALL_PCT = 91

## Theme detection effect
Standard: closest [data-card-theme] → class check, else document.documentElement.classList.contains('dark'). MutationObserver on html + cardWrapper if present, attributeFilter ['class']. Cleanup observer.disconnect().

## Animation loop (useEffect with [] deps)
aliveRef.current = true
disappearedRef.current = false
const TAXI_MS = 5500

function tick(ts: number) {
  if (!aliveRef.current) return
  if (!startRef.current) startRef.current = ts
  const t = Math.min((ts - startRef.current) / TAXI_MS, 1)
  const eased = t <= 0.75
    ? (t / 0.75) * 82
    : 82 + (1 - Math.pow(1 - (t - 0.75) / 0.25, 2)) * 18
  const p = Math.min(eased, 100)
  setProgress(p)
  if (p >= WALL_PCT && !disappearedRef.current) {
    disappearedRef.current = true
    setPhase('takeoff')
  }
  if (p < 100) {
    rafRef.current = requestAnimationFrame(tick)
  } else {
    setTimeout(() => {
      if (!aliveRef.current) return
      setPhase('resetting')
      setTimeout(() => {
        if (!aliveRef.current) return
        disappearedRef.current = false
        startRef.current = undefined
        setProgress(0)
        setPhase('taxiing')
        setCycle((c) => c + 1)
        rafRef.current = requestAnimationFrame(tick)
      }, 400)
    }, 600)
  }
}
rafRef.current = requestAnimationFrame(tick)
return () => {
  aliveRef.current = false
  if (rafRef.current) cancelAnimationFrame(rafRef.current)
}

## Derived values
const planePct = Math.min(progress, WALL_PCT)
const trackBg = isDark ? 'linear-gradient(to bottom, #404040, #252525)' : 'linear-gradient(to bottom, #bab7b2, #a09d98)'
const trackShadow = isDark
  ? 'inset 0 4px 12px rgba(0,0,0,0.85), inset 0 -1px 3px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.5)'
  : 'inset 0 3px 8px rgba(0,0,0,0.22), inset 0 -1px 3px rgba(255,255,255,0.28), 0 2px 5px rgba(0,0,0,0.12)'
const dashColor = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.42)'

## JSX tree
<div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
  <div className="flex w-full max-w-[440px] flex-col items-center gap-4 px-4 sm:gap-6 sm:px-6">
    <div className="relative h-11 w-full overflow-visible rounded-full sm:h-14" style={{ background: trackBg, boxShadow: trackShadow }}>
      <div className="pointer-events-none absolute top-1/2 -translate-y-px" style={{ left: 18, right: 18, height: 2, backgroundImage: \`repeating-linear-gradient(to right, \${dashColor} 0, \${dashColor} 10px, transparent 10px, transparent 24px)\` }}/>
      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: \`\${progress}%\`, background: 'linear-gradient(to right, #6b0000, #be1c1c 50%, #e03030)', boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)' }}/>
      {phase === 'taxiing' && progress > 30 && (
        <motion.div className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full" style={{ right: \`calc(\${100 - planePct}% + 26px)\`, width: Math.min(((progress - 30) / 70) * 56, 56), height: 22, background: 'radial-gradient(ellipse at right, rgba(255,140,20,0.3), transparent)', filter: 'blur(8px)' }} animate={{ opacity: [0.3, 0.75, 0.2, 0.65, 0.3] }} transition={{ duration: 0.2, repeat: Infinity }}/>
      )}
      <AnimatePresence>
        {phase !== 'resetting' && (
          <div key={\`plane-\${cycle}\`} className="pointer-events-none absolute top-1/2 z-20" style={{ left: \`\${planePct}%\`, transform: 'translateX(-50%) translateY(-50%)' }}>
            {phase === 'taxiing' ? (
              <Airplane isDark={isDark}/>
            ) : (
              <motion.div initial={{ opacity: 1, x: 0, scale: 1 }} animate={{ opacity: 0, x: 120, scale: 1.8 }} transition={{ duration: 0.7, ease: 'easeIn' }}>
                <Airplane isDark={isDark}/>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums sm:text-[28px]" style={{ color: isDark ? '#FAF7F2' : '#1C1916' }}>{Math.round(progress)}</span>
        <span className="text-sm font-semibold sm:text-base" style={{ color: '#9E9890' }}>%</span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-widest sm:text-[11px]" style={{ color: isDark ? '#736D65' : '#9E9890' }}>
        {phase === 'takeoff' ? 'Taking off!' : phase === 'resetting' ? '—' : 'Preparing for takeoff'}
      </span>
    </div>
  </div>
</div>`,

  V0: `Create a React client component named \`RunwayLoader\`. Single file, TypeScript, \`'use client'\` at the top. Use \`useEffect\`, \`useRef\`, and \`useState\` from React, plus \`motion\` and \`AnimatePresence\` from framer-motion. The component fills its parent (\`h-full w-full\`) and supports both light and dark themes.

## The visual
A playful progress bar disguised as an airport runway. The track is a long, pill-shaped strip sitting centred in the frame, with a dashed white centreline running down the middle the way an actual runway does. A chunky top-down airplane (painted in soft greys with a light blue cockpit window) sits on the track and slowly taxis left to right as the loader fills. Behind the plane, a glossy red-gradient fill sweeps across the runway so the taxied portion is painted red and the untaxied portion is still grey. Once the plane's nose reaches the right wall at 91% progress, it "takes off" — scaling up, sliding off to the right, and fading out — while the bar finishes filling. A beat later, everything resets and loops.

Below the runway, centred, a big tabular-nums percentage readout (0 to 100) and a small uppercase status label underneath. The label text is exactly:
- \`Preparing for takeoff\` during the taxi phase
- \`Taking off!\` the moment the plane hits the wall and starts lifting off
- \`—\` (em dash) during the brief reset gap

## Theme
Detect theme by checking \`.closest('[data-card-theme]')\` for a \`.dark\` class, falling back to \`document.documentElement.classList.contains('dark')\`. Track it with \`useState isDark\` (default \`true\`). Watch for class changes via a \`MutationObserver\` on \`documentElement\` and on the card wrapper if one exists, with \`attributeFilter: ['class']\`. Disconnect on cleanup.

Outer background (inline style on the container): \`#110F0C\` on dark, \`#F5F1EA\` on light.

## Constants
- \`WALL_PCT = 91\` — the progress percentage where the plane's nose reaches the right wall and liftoff triggers
- \`TAXI_MS = 5500\` — total taxi duration per cycle in milliseconds
- After progress hits 100, wait 600ms, switch to a 'resetting' phase for 400ms, then start the next cycle

## Airplane SVG (top-down, pointing right)
Write a small inner \`function Airplane({ isDark })\` in the same file. It renders an \`<svg className="w-[52px] sm:w-[72px] h-auto" viewBox="0 0 72 46" fill="none">\` with a soft drop-shadow filter (heavier on dark: \`drop-shadow(0 4px 12px rgba(0,0,0,0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))\`; lighter on light: \`drop-shadow(0 2px 8px rgba(0,0,0,0.35)) drop-shadow(0 1px 3px rgba(0,0,0,0.2))\`).

The plane is a fuselage ellipse plus two triangular wings, two tail stabilisers, a tapered nose, and a round cockpit window. Use these palette values per theme (dark/light):
- body top \`#ececec\` / \`#c8c8c8\`, body mid \`#ffffff\` / \`#dedede\`, body bottom \`#d0d0d0\` / \`#b4b4b4\`
- wing light \`#f8f8f8\` / \`#d8d8d8\`, wing dark \`#bababa\` / \`#909090\`
- tail \`#c8c8c8\` / \`#a8a8a8\`, nose \`#f4f4f4\` / \`#d8d8d8\`
- cockpit window always \`#7ec8e8\` at opacity 0.9

Define three linear gradients in \`<defs>\`: \`rl-body\` top-to-bottom (body top → body mid at 40% → body bottom), \`rl-wing-t\` diagonal bottom-left-to-top-right (wing light → wing dark), and \`rl-wing-b\` diagonal top-left-to-bottom-right (wing light → wing dark). Then draw, in order:
- Top wing: \`<path d="M44,21 L28,21 L8,2 L18,0 Z" />\` filled with \`url(#rl-wing-t)\`
- Bottom wing: \`<path d="M44,25 L28,25 L8,44 L18,46 Z" />\` filled with \`url(#rl-wing-b)\`
- Top tail stabiliser: \`<path d="M8,21 L2,14 L6,14 L12,21 Z" />\` filled with the tail colour
- Bottom tail stabiliser: \`<path d="M8,25 L2,32 L6,32 L12,25 Z" />\` filled with the tail colour
- Fuselage: \`<ellipse cx="34" cy="23" rx="29" ry="7" />\` filled with \`url(#rl-body)\`
- Nose taper: \`<path d="M61,19.5 C66,21.5 67.5,23 67,23 C67.5,23 66,24.5 61,26.5 L58,23 Z" />\` filled with the nose colour
- Cockpit: \`<ellipse cx="57" cy="23" rx="4" ry="3" fill="#7ec8e8" opacity="0.9" />\`

## Runway track
The track is \`relative h-11 w-full overflow-visible rounded-full sm:h-14\`, sitting inside a \`max-w-[440px]\` column centred in the frame. Inline background is a vertical gradient — dark: \`linear-gradient(to bottom, #404040, #252525)\`, light: \`linear-gradient(to bottom, #bab7b2, #a09d98)\`. Inline box-shadow adds a deep inset bevel plus a subtle outer drop shadow. Use these exact shadow strings:
- Dark: \`inset 0 4px 12px rgba(0,0,0,0.85), inset 0 -1px 3px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.5)\`
- Light: \`inset 0 3px 8px rgba(0,0,0,0.22), inset 0 -1px 3px rgba(255,255,255,0.28), 0 2px 5px rgba(0,0,0,0.12)\`

Inside the track, stack three things:

1. **Centreline dashes** — a \`pointer-events-none absolute\` strip at top-1/2 offset 1px up, inset 18px from left and right, height 2px. Its \`backgroundImage\` is \`repeating-linear-gradient(to right, <dashColor> 0, <dashColor> 10px, transparent 10px, transparent 24px)\`. Dash colour is \`rgba(255,255,255,0.22)\` on dark, \`rgba(255,255,255,0.42)\` on light. This is the runway centreline and stays full-width the whole cycle.
2. **Red fill** — an \`absolute inset-y-0 left-0 rounded-full\` div whose \`width\` is \`\${progress}%\`. Background is \`linear-gradient(to right, #6b0000, #be1c1c 50%, #e03030)\` with a soft inner highlight \`inset 0 1px 3px rgba(255,255,255,0.1)\`. This paints over the dashes so only the taxied portion reads red.
3. **Heat-shimmer exhaust** — while \`phase === 'taxiing'\` and \`progress > 30\`, render a \`motion.div\` positioned 26px behind the plane (i.e. \`right: calc(\${100 - planePct}% + 26px)\`), width \`Math.min(((progress - 30) / 70) * 56, 56)\` px, height 22px. Background \`radial-gradient(ellipse at right, rgba(255,140,20,0.3), transparent)\` with \`filter: blur(8px)\`. Animate its opacity flickering \`[0.3, 0.75, 0.2, 0.65, 0.3]\` with \`duration: 0.2\` and \`repeat: Infinity\` — the effect is a hot orange jet-wash shimmering behind the engines.

## The plane itself
Wrap the plane in an \`<AnimatePresence>\`. While \`phase !== 'resetting'\`, render a positioned div keyed by the current cycle number at \`left: \${planePct}%\` with \`transform: translateX(-50%) translateY(-50%)\` so the plane centres on the fill boundary. During \`'taxiing'\`, just render \`<Airplane isDark={isDark}/>\`. During \`'takeoff'\`, wrap it in a \`motion.div\` going from \`{ opacity:1, x:0, scale:1 }\` to \`{ opacity:0, x:120, scale:1.8 }\` over 0.7s with \`ease: 'easeIn'\` — the plane visibly leaps off the runway as the bar finishes. \`planePct\` is just \`Math.min(progress, WALL_PCT)\` so the plane's left-edge clamp never overshoots the wall even after progress passes 91%.

## Progress readout (below the track)
A small column gap-1, centred:
- Percentage row with \`text-2xl font-bold tabular-nums sm:text-[28px]\` for the integer (\`Math.round(progress)\`) in \`#FAF7F2\` on dark / \`#1C1916\` on light, followed by a smaller \`%\` sign in \`#9E9890\`.
- Status label below in \`text-[10px] font-semibold uppercase tracking-widest sm:text-[11px]\`, colour \`#736D65\` on dark / \`#9E9890\` on light. Text switches between \`Taking off!\`, \`—\`, and \`Preparing for takeoff\` based on phase (see above).

## The animation loop
One \`useEffect\` with empty deps. Keep an \`aliveRef\`, a \`disappearedRef\`, a \`startRef\` (for the RAF timestamp origin), and a \`rafRef\` for the current handle. Progress follows a custom eased curve: fast ramp to 82% over the first 75% of the taxi window, then a gentler ease-out-quad decel across the remaining 18%. In prose: \`eased = t <= 0.75 ? (t / 0.75) * 82 : 82 + (1 - (1 - (t - 0.75) / 0.25)^2) * 18\`, where \`t = (now - startRef) / TAXI_MS\` clamped to 1.

On each frame, update \`progress\`. The instant \`progress >= WALL_PCT\` and we haven't already flipped, set \`disappearedRef = true\` and \`setPhase('takeoff')\` — this triggers the motion.div liftoff while the red fill keeps completing. Keep scheduling RAF until \`p >= 100\`, then \`setTimeout\` 600ms → \`setPhase('resetting')\`, then another 400ms → reset \`disappearedRef\`, clear \`startRef\`, \`setProgress(0)\`, \`setPhase('taxiing')\`, increment \`cycle\` (so the AnimatePresence key changes and the next plane mounts fresh), and kick off RAF again.

## Cleanup
On unmount: set \`aliveRef.current = false\`, \`cancelAnimationFrame(rafRef.current)\`, and disconnect the theme MutationObserver. The inner setTimeouts self-guard on \`aliveRef\` so pending resets don't fire after unmount.

## Structure
\`\`\`
<div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: ... }}>
  <div className="flex w-full max-w-[440px] flex-col items-center gap-4 px-4 sm:gap-6 sm:px-6">
    <div className="relative h-11 w-full overflow-visible rounded-full sm:h-14" style={{ background, boxShadow }}>
      {/* centreline dashes */}
      {/* red fill */}
      {/* heat-shimmer (conditional) */}
      <AnimatePresence>{/* plane */}</AnimatePresence>
    </div>
    <div className="flex flex-col items-center gap-1">
      {/* percentage + % */}
      {/* status label */}
    </div>
  </div>
</div>
\`\`\`

The finished piece should feel like a tiny animated airport: the plane rolls down the runway while the fill paints behind it, the engines kick up a heat shimmer, the nose kisses the right wall, and the plane leaps off into the sky — then the sequence quietly resets and does it again.`,
}
