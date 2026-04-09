import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`NeonClock\`: a cyan 7-segment LCD-style clock rendered in SVG. Shows HH:MM:SS with a steady colon between HH/MM and a blinking colon between MM/SS (half-size). AM/PM indicator stacks above the seconds. Day-of-week row and long-form date beneath. Subtle LCD pixel grid overlay. Always dark — background #060a0a.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Imports: useState, useEffect from 'react'. No framer-motion.

Colors:
CYAN='#55E8E2', CYAN_OFF='rgba(85,232,226,0.055)', CYAN_IDLE='rgba(85,232,226,0.28)', CYAN_DIM='rgba(85,232,226,0.65)', BG='#060a0a'.
GLOW_SVG = \`drop-shadow(0 0 3px #55E8E2) drop-shadow(0 0 8px #55E8E299)\`
GLOW_TXT = \`0 0 5px #55E8E2, 0 0 11px #55E8E288\`

7-segment geometry (viewBox 42x80): VW=42, VH=80, T=6 (thickness), BV=3 (bevel), GP=2 (gap).
- hPts(y): returns "\${GP},\${y+T/2} \${GP+BV},\${y} \${VW-GP-BV},\${y} \${VW-GP},\${y+T/2} \${VW-GP-BV},\${y+T} \${GP+BV},\${y+T}"
- vPts(x,y1,y2): cx=x+T/2 → "\${cx},\${y1} \${x+T},\${y1+BV} \${x+T},\${y2-BV} \${cx},\${y2} \${x},\${y2-BV} \${x},\${y1+BV}"

Positions: aY=GP=2, gY=VH/2-T/2=37, dY=VH-GP-T=72. lX=GP=2, rX=VW-GP-T=34.
Verticals span full height: aEnd=aY, gTop=gY-GP, gEnd=gY+T+GP, dTop=dY+T.

SHAPES array in order a,b,c,d,e,f,g:
[hPts(aY), vPts(rX,aEnd,gTop), vPts(rX,gEnd,dTop), hPts(dY), vPts(lX,gEnd,dTop), vPts(lX,aEnd,gTop), hPts(gY)]

SEG map (Record<string,boolean[]>) for '0'..'9' — standard 7-seg lookup [a,b,c,d,e,f,g]:
'0':[1,1,1,1,1,1,0] '1':[0,1,1,0,0,0,0] '2':[1,1,0,1,1,0,1] '3':[1,1,1,1,0,0,1] '4':[0,1,1,0,0,1,1] '5':[1,0,1,1,0,1,1] '6':[1,0,1,1,1,1,1] '7':[1,1,1,0,0,0,0] '8':[1,1,1,1,1,1,1] '9':[1,1,1,1,0,1,1]

Digit({char,size}): svg viewBox 0 0 42 80, width=size, height=round(size*80/42), style display:block overflow:visible flexShrink:0. For each SHAPES poly: fill CYAN if seg on else CYAN_OFF; if on add style filter:GLOW_SVG.

ColonDots({dim,size}): svg viewBox 0 0 \${42*0.44} 80, width=round(size*0.44), height=round(size*80/42). Two circles at cx=42*0.22, cy=80*0.30 and 80*0.68, r=42*0.125, fill CYAN_OFF when dim else CYAN with glow filter.

Helpers: pad2(n)=String(n).padStart(2,'0'). DAYS=['SUN','MON','TUE','WED','THU','FRI','SAT'].
getNow(): new Date(); h=hours; return { h:pad2(h%12||12), m:pad2(minutes), s:pad2(seconds), isPM:h>=12, dow:getDay(), date: toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}).toUpperCase() }.

Size constants: BIG=50, SML=24, GAP=3, COLON_BIG=round(50*0.44)=22, COLON_SML=round(24*0.44)=11. TIME_W = 4*BIG + COLON_BIG + COLON_SML + 2*SML + 7*GAP = 302.

State: now=useState(getNow), colonOn=useState(true). useEffect setInterval 1000ms: setNow(getNow()); setColonOn(c=>!c). Cleanup clearInterval.

Layout: root div relative flex h-full w-full select-none items-center justify-center overflow-hidden, background BG, fontFamily '"Courier New", Courier, monospace'. Inside: a left-anchored flex-column (alignItems flex-start) wrapper — centered as a whole.
- Time row: flex alignItems flex-end gap 3 — Digit h[0], Digit h[1], ColonDots dim=false size=BIG, Digit m[0], Digit m[1], ColonDots dim={!colonOn} size=SML, then stacked column (alignItems flex-end) containing:
  - AM/PM row: flex gap 6 fontSize 13 letterSpacing 0.08em marginBottom 3. Two spans "AM" and "PM". Active one uses color CYAN + textShadow GLOW_TXT; inactive uses CYAN_IDLE, textShadow none.
  - Seconds row: flex gap 3, Digit s[0] size SML, Digit s[1] size SML.
- Days row: flex justifyContent space-between width TIME_W marginTop 13 fontSize 13 letterSpacing 0.05em. Map DAYS, color CYAN + GLOW_TXT when i===dow else CYAN_IDLE.
- Date row: div width TIME_W marginTop 5 textAlign center fontSize 13 letterSpacing 0.1em color CYAN_DIM. Render {now.date}.

LCD pixel-grid overlay: absolute inset-0 pointer-events-none. backgroundImage 'radial-gradient(circle, rgba(0,0,0,0.48) 1.3px, transparent 1.3px)', backgroundSize '3.8px 3.8px'.`,

  GPT: `Build a React client component named \`NeonClock\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Imports
'use client'
import { useState, useEffect } from 'react'

## Colors
const CYAN = '#55E8E2'
const CYAN_OFF = 'rgba(85,232,226,0.055)'
const CYAN_IDLE = 'rgba(85,232,226,0.28)'
const CYAN_DIM = 'rgba(85,232,226,0.65)'
const BG = '#060a0a'
const GLOW_SVG = \`drop-shadow(0 0 3px \${CYAN}) drop-shadow(0 0 8px \${CYAN}99)\`
const GLOW_TXT = \`0 0 5px \${CYAN}, 0 0 11px \${CYAN}88\`

## 7-segment geometry (viewBox 0 0 42 80)
const VW = 42, VH = 80, T = 6, BV = 3, GP = 2

function hPts(y:number): string {
  const x1 = GP+BV, x2 = VW-GP-BV, cy = y+T/2
  return \`\${GP},\${cy} \${x1},\${y} \${x2},\${y} \${VW-GP},\${cy} \${x2},\${y+T} \${x1},\${y+T}\`
}
function vPts(x:number, y1:number, y2:number): string {
  const cx = x+T/2
  return \`\${cx},\${y1} \${x+T},\${y1+BV} \${x+T},\${y2-BV} \${cx},\${y2} \${x},\${y2-BV} \${x},\${y1+BV}\`
}

const aY = GP, gY = VH/2 - T/2, dY = VH - GP - T
const lX = GP, rX = VW - GP - T
const aEnd = aY, gTop = gY - GP, gEnd = gY + T + GP, dTop = dY + T

const SHAPES = [ hPts(aY), vPts(rX,aEnd,gTop), vPts(rX,gEnd,dTop), hPts(dY), vPts(lX,gEnd,dTop), vPts(lX,aEnd,gTop), hPts(gY) ]

const SEG: Record<string, boolean[]> = {
  '0':[true,true,true,true,true,true,false],
  '1':[false,true,true,false,false,false,false],
  '2':[true,true,false,true,true,false,true],
  '3':[true,true,true,true,false,false,true],
  '4':[false,true,true,false,false,true,true],
  '5':[true,false,true,true,false,true,true],
  '6':[true,false,true,true,true,true,true],
  '7':[true,true,true,false,false,false,false],
  '8':[true,true,true,true,true,true,true],
  '9':[true,true,true,true,false,true,true],
}

## Digit subcomponent
function Digit({ char, size }: { char:string; size:number }) {
  const segs = SEG[char] ?? SEG['8']
  return <svg viewBox={\`0 0 \${VW} \${VH}\`} width={size} height={Math.round(size*VH/VW)} style={{display:'block',overflow:'visible',flexShrink:0}}>
    {SHAPES.map((pts,i) => <polygon key={i} points={pts} fill={segs[i]?CYAN:CYAN_OFF} style={segs[i]?{filter:GLOW_SVG}:undefined}/>)}
  </svg>
}

## ColonDots subcomponent
function ColonDots({ dim, size }: { dim:boolean; size:number }) {
  return <svg viewBox={\`0 0 \${VW*0.44} \${VH}\`} width={Math.round(size*0.44)} height={Math.round(size*VH/VW)} style={{display:'block',overflow:'visible',flexShrink:0}}>
    {([0.30,0.68] as const).map((yf,i) => <circle key={i} cx={VW*0.22} cy={VH*yf} r={VW*0.125} fill={dim?CYAN_OFF:CYAN} style={dim?undefined:{filter:GLOW_SVG}}/>)}
  </svg>
}

## Helpers
const pad2 = (n:number) => n.toString().padStart(2,'0')
const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'] as const
function getNow() {
  const d = new Date(); const h = d.getHours()
  return { h:pad2(h%12||12), m:pad2(d.getMinutes()), s:pad2(d.getSeconds()), isPM:h>=12, dow:d.getDay(),
    date: d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}).toUpperCase() }
}

## Size constants
const BIG = 50; const SML = 24; const GAP = 3
const COLON_BIG = Math.round(BIG*0.44) // 22
const COLON_SML = Math.round(SML*0.44) // 11
const TIME_W = 4*BIG + COLON_BIG + COLON_SML + 2*SML + 7*GAP // 302

## NeonClock
State: now=useState(getNow), colonOn=useState(true).
Effect: setInterval 1000 → setNow(getNow()); setColonOn(c=>!c). cleanup clearInterval.

## JSX
<div className="relative flex h-full w-full select-none items-center justify-center overflow-hidden" style={{background:BG, fontFamily:'"Courier New", Courier, monospace'}}>
  <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
    {/* Time row */}
    <div style={{display:'flex', alignItems:'flex-end', gap:GAP}}>
      <Digit char={now.h[0]} size={BIG}/>
      <Digit char={now.h[1]} size={BIG}/>
      <ColonDots dim={false} size={BIG}/>
      <Digit char={now.m[0]} size={BIG}/>
      <Digit char={now.m[1]} size={BIG}/>
      <ColonDots dim={!colonOn} size={SML}/>
      <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
        <div style={{display:'flex', gap:6, fontSize:13, letterSpacing:'0.08em', marginBottom:3}}>
          <span style={{color:!now.isPM?CYAN:CYAN_IDLE, textShadow:!now.isPM?GLOW_TXT:'none'}}>AM</span>
          <span style={{color:now.isPM?CYAN:CYAN_IDLE, textShadow:now.isPM?GLOW_TXT:'none'}}>PM</span>
        </div>
        <div style={{display:'flex', gap:GAP}}>
          <Digit char={now.s[0]} size={SML}/>
          <Digit char={now.s[1]} size={SML}/>
        </div>
      </div>
    </div>
    {/* Days row */}
    <div style={{display:'flex', justifyContent:'space-between', width:TIME_W, marginTop:13, fontSize:13, letterSpacing:'0.05em'}}>
      {DAYS.map((d,i) => <span key={d} style={{color:i===now.dow?CYAN:CYAN_IDLE, textShadow:i===now.dow?GLOW_TXT:'none'}}>{d}</span>)}
    </div>
    {/* Date row */}
    <div style={{width:TIME_W, marginTop:5, textAlign:'center', fontSize:13, letterSpacing:'0.1em', color:CYAN_DIM}}>{now.date}</div>
  </div>
  {/* LCD pixel-grid overlay */}
  <div className="pointer-events-none absolute inset-0" style={{backgroundImage:'radial-gradient(circle, rgba(0,0,0,0.48) 1.3px, transparent 1.3px)', backgroundSize:'3.8px 3.8px'}}/>
</div>`,

  Gemini: `Implement a React client component named \`NeonClock\` as a single TypeScript file. Cyan 7-segment SVG clock with HH:MM:SS, steady colon between HH/MM and blinking colon between MM/SS (half-size). AM/PM above seconds. Days-of-week row and long date beneath. LCD dot overlay. Dark bg #060a0a.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useEffect } from 'react'

USE these hooks and no others. DO NOT invent hooks not shown above. No framer-motion is needed.

## Color constants
const CYAN = '#55E8E2'
const CYAN_OFF = 'rgba(85,232,226,0.055)'
const CYAN_IDLE = 'rgba(85,232,226,0.28)'
const CYAN_DIM = 'rgba(85,232,226,0.65)'
const BG = '#060a0a'
const GLOW_SVG = \`drop-shadow(0 0 3px \${CYAN}) drop-shadow(0 0 8px \${CYAN}99)\`
const GLOW_TXT = \`0 0 5px \${CYAN}, 0 0 11px \${CYAN}88\`

## 7-segment geometry
const VW = 42, VH = 80, T = 6, BV = 3, GP = 2

function hPts(y: number): string {
  const x1 = GP + BV, x2 = VW - GP - BV, cy = y + T / 2
  return \`\${GP},\${cy} \${x1},\${y} \${x2},\${y} \${VW-GP},\${cy} \${x2},\${y+T} \${x1},\${y+T}\`
}
function vPts(x: number, y1: number, y2: number): string {
  const cx = x + T / 2
  return \`\${cx},\${y1} \${x+T},\${y1+BV} \${x+T},\${y2-BV} \${cx},\${y2} \${x},\${y2-BV} \${x},\${y1+BV}\`
}

const aY = GP
const gY = VH / 2 - T / 2
const dY = VH - GP - T
const lX = GP
const rX = VW - GP - T
const aEnd = aY, gTop = gY - GP, gEnd = gY + T + GP, dTop = dY + T

const SHAPES = [ hPts(aY), vPts(rX, aEnd, gTop), vPts(rX, gEnd, dTop), hPts(dY), vPts(lX, gEnd, dTop), vPts(lX, aEnd, gTop), hPts(gY) ]

## SEG table (order a,b,c,d,e,f,g)
const SEG: Record<string, boolean[]> = {
  '0':[true,true,true,true,true,true,false],
  '1':[false,true,true,false,false,false,false],
  '2':[true,true,false,true,true,false,true],
  '3':[true,true,true,true,false,false,true],
  '4':[false,true,true,false,false,true,true],
  '5':[true,false,true,true,false,true,true],
  '6':[true,false,true,true,true,true,true],
  '7':[true,true,true,false,false,false,false],
  '8':[true,true,true,true,true,true,true],
  '9':[true,true,true,true,false,true,true],
}

## Digit subcomponent
function Digit({ char, size }: { char: string; size: number }) {
  const segs = SEG[char] ?? SEG['8']
  return (
    <svg viewBox={\`0 0 \${VW} \${VH}\`} width={size} height={Math.round(size * VH / VW)} style={{display:'block', overflow:'visible', flexShrink:0}}>
      {SHAPES.map((pts, i) => (
        <polygon key={i} points={pts} fill={segs[i] ? CYAN : CYAN_OFF} style={segs[i] ? {filter: GLOW_SVG} : undefined}/>
      ))}
    </svg>
  )
}

## ColonDots subcomponent
function ColonDots({ dim, size }: { dim: boolean; size: number }) {
  return (
    <svg viewBox={\`0 0 \${VW * 0.44} \${VH}\`} width={Math.round(size * 0.44)} height={Math.round(size * VH / VW)} style={{display:'block', overflow:'visible', flexShrink:0}}>
      {([0.30, 0.68] as const).map((yf, i) => (
        <circle key={i} cx={VW * 0.22} cy={VH * yf} r={VW * 0.125} fill={dim ? CYAN_OFF : CYAN} style={dim ? undefined : {filter: GLOW_SVG}}/>
      ))}
    </svg>
  )
}

## Helpers
const pad2 = (n: number) => n.toString().padStart(2, '0')
const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'] as const

function getNow() {
  const d = new Date()
  const h = d.getHours()
  return { h: pad2(h % 12 || 12), m: pad2(d.getMinutes()), s: pad2(d.getSeconds()), isPM: h >= 12, dow: d.getDay(),
    date: d.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }).toUpperCase() }
}

## Size constants
const BIG = 50
const SML = 24
const GAP = 3
const COLON_BIG = Math.round(BIG * 0.44)
const COLON_SML = Math.round(SML * 0.44)
const TIME_W = 4 * BIG + COLON_BIG + COLON_SML + 2 * SML + 7 * GAP

## NeonClock
const [now, setNow] = useState(getNow)
const [colonOn, setColonOn] = useState(true)
useEffect(() => {
  const id = setInterval(() => { setNow(getNow()); setColonOn(c => !c) }, 1000)
  return () => clearInterval(id)
}, [])

## JSX tree
<div className="relative flex h-full w-full select-none items-center justify-center overflow-hidden" style={{background:BG, fontFamily:'"Courier New", Courier, monospace'}}>
  <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
    <div style={{display:'flex', alignItems:'flex-end', gap:GAP}}>
      <Digit char={now.h[0]} size={BIG}/>
      <Digit char={now.h[1]} size={BIG}/>
      <ColonDots dim={false} size={BIG}/>
      <Digit char={now.m[0]} size={BIG}/>
      <Digit char={now.m[1]} size={BIG}/>
      <ColonDots dim={!colonOn} size={SML}/>
      <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
        <div style={{display:'flex', gap:6, fontSize:13, letterSpacing:'0.08em', marginBottom:3}}>
          <span style={{color:!now.isPM?CYAN:CYAN_IDLE, textShadow:!now.isPM?GLOW_TXT:'none'}}>AM</span>
          <span style={{color:now.isPM?CYAN:CYAN_IDLE, textShadow:now.isPM?GLOW_TXT:'none'}}>PM</span>
        </div>
        <div style={{display:'flex', gap:GAP}}>
          <Digit char={now.s[0]} size={SML}/>
          <Digit char={now.s[1]} size={SML}/>
        </div>
      </div>
    </div>
    <div style={{display:'flex', justifyContent:'space-between', width:TIME_W, marginTop:13, fontSize:13, letterSpacing:'0.05em'}}>
      {DAYS.map((d,i) => <span key={d} style={{color:i===now.dow?CYAN:CYAN_IDLE, textShadow:i===now.dow?GLOW_TXT:'none'}}>{d}</span>)}
    </div>
    <div style={{width:TIME_W, marginTop:5, textAlign:'center', fontSize:13, letterSpacing:'0.1em', color:CYAN_DIM}}>{now.date}</div>
  </div>
  <div className="pointer-events-none absolute inset-0" style={{backgroundImage:'radial-gradient(circle, rgba(0,0,0,0.48) 1.3px, transparent 1.3px)', backgroundSize:'3.8px 3.8px'}}/>
</div>`,
}
