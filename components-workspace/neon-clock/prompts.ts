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

  V0: `Create a React client component named \`NeonClock\`. Single file, TypeScript, \`'use client'\` at the top. Use \`useState\` and \`useEffect\` from React — no other libraries, no framer-motion. The component fills its parent (\`h-full w-full\`) and is intentionally dark-only — it's a glowing LCD fixture, so the background stays the same in both light and dark site themes.

## The visual
A retro cyan 7-segment LCD clock that looks like it's been lifted out of an 80s alarm radio and polished. Big \`HH:MM\` digits dominate the display, a steady colon separates hours from minutes, then a smaller \`SS\` seconds readout sits to the right at roughly half the height. Between the minutes and the seconds there's a tiny blinking colon that ticks on and off once per second. Floating just above the seconds, right-aligned to them, are two small \`AM\` and \`PM\` labels — whichever one is active glows bright cyan, the other sits dim. Below the whole time row, spanning exactly the same width, a row of weekday abbreviations \`SUN MON TUE WED THU FRI SAT\` is distributed edge-to-edge; the current day glows, the rest are ghosted. Under that, centered, a long-form date like \`APRIL 11, 2026\` in dimmed cyan.

A subtle LCD pixel-grid overlay sits on top of everything — a fine dotted darkening pattern that makes the display feel like a real screen with visible sub-pixels rather than a flat SVG.

## Overlay text (exact strings)
- Weekday row: \`SUN\`, \`MON\`, \`TUE\`, \`WED\`, \`THU\`, \`FRI\`, \`SAT\`
- \`AM\` and \`PM\`
- Date formatted like \`APRIL 11, 2026\` (month name uppercase, day numeric, year numeric)

## Colors (dark-only — same in both themes)
- Background: \`#060a0a\` — nearly black with a hint of cyan shadow
- Primary cyan (lit segments, active labels): \`#55E8E2\`
- Inactive segments of a digit (the "off" bars that make the whole 8 shape ghost-visible): \`rgba(85,232,226,0.055)\` — barely there
- Inactive text labels (dim AM/PM, dim weekdays): \`rgba(85,232,226,0.28)\`
- Date row text: \`rgba(85,232,226,0.65)\`
- Glow on lit SVG shapes: CSS filter \`drop-shadow(0 0 3px #55E8E2) drop-shadow(0 0 8px #55E8E299)\`
- Glow on lit text: \`textShadow: '0 0 5px #55E8E2, 0 0 11px #55E8E288'\`

Font family for the whole component: \`"Courier New", Courier, monospace\`.

## Digit rendering — build these as inline SVG
Don't use a font for the digits. Draw each digit as a 7-segment SVG with custom bevelled polygon segments so it looks like a real LCD, not a rendered number. Use a viewBox of \`0 0 42 80\`. Each segment is a hexagonal polygon 6 units thick with a 3-unit bevel at each tip (so the corners of the bars kiss at angled cuts, the way a real LCD is cut). Leave a 2-unit gap at the outside edges and around the middle bar.

A horizontal bar at vertical position \`y\` has six points: left tip, top-left shoulder, top-right shoulder, right tip, bottom-right shoulder, bottom-left shoulder. A vertical bar at horizontal position \`x\` spanning \`y1\` to \`y2\` is the same hexagon rotated 90 degrees. The top bar sits at y=2, the middle bar at y=37, the bottom bar at y=72. The left vertical lives at x=2, the right vertical at x=34. The top and bottom verticals span the full height from the top bar to the middle and from the middle to the bottom bar respectively, so a "1" is exactly as tall as an "8".

Use a standard 7-segment lookup (segments \`a,b,c,d,e,f,g\` = top, top-right, bot-right, bottom, bot-left, top-left, middle) and fill lit segments with the primary cyan + glow filter, unlit segments with the very faint \`rgba(85,232,226,0.055)\`. The unlit segments being barely visible is what gives the display its "ghost 8" character — every digit subtly shows the full 8 behind it. The SVG should render with \`overflow: visible\` so the glow isn't clipped by the viewBox.

## Colon dots
Colons are their own SVG, sized about 44% the width of a digit at the same height. Two circles stacked — one at roughly 30% down the display, one at 68% down — each with radius ~12.5% of the digit width. The steady colon between \`HH\` and \`MM\` is always lit (cyan + glow). The colon between \`MM\` and \`SS\` toggles on/off every second; when off, render the dots in the same faint \`rgba(85,232,226,0.055)\` as unlit digit segments so they dim rather than vanish.

## Sizes (in pixels)
- Big digits (\`HH\` and \`MM\`): 50 wide
- Small digits (\`SS\`): 24 wide (about half)
- Gap between every flex child in the time row: 3
- AM/PM labels: fontSize 13, letterSpacing 0.08em, with a 6px gap between AM and PM, sitting 3px above the seconds digits
- Weekday row and date row: fontSize 13, letterSpacing 0.05em and 0.1em respectively
- The weekday row is 13px below the time row; the date row is 5px below the weekday row
- The weekday and date rows should have their width locked to the exact measured width of the \`HH:MM:SS\` time row so the edges line up perfectly. Compute it as \`4*50 + round(50*0.44) + round(24*0.44) + 2*24 + 7*3\` which comes out to 302px.

## Layout
Root is a full-size flex container, items centred, with the cyan-black background and the monospace font family set inline. Inside, put a single left-anchored column (\`alignItems: 'flex-start'\`) so the whole assembly — time row, weekday row, date row — shares a consistent left edge and gets centred together as one block.

The time row itself is a flex row with \`alignItems: 'flex-end'\` so the small seconds digits hug the baseline of the big digits: big \`H H\`, big steady colon, big \`M M\`, small blinking colon, then a small vertical stack containing the AM/PM row on top and the small \`S S\` digits below. The AM/PM stack is right-aligned so the labels hang off the right edge of the seconds.

Below that row, the weekday row uses \`justify-content: space-between\` with its fixed 302px width so \`SUN\` and \`SAT\` pin to the edges and the others distribute evenly. The date row is centred inside the same 302px.

## LCD overlay
Drop a \`pointer-events-none\` \`absolute inset-0\` div on top of everything with a repeating radial-gradient background: \`radial-gradient(circle, rgba(0,0,0,0.48) 1.3px, transparent 1.3px)\` with \`backgroundSize: '3.8px 3.8px'\`. This produces the fine dotted darkening that reads as LCD sub-pixels.

## The tick
One piece of state tracks the current time, another tracks whether the MM:SS colon is currently on. A single \`setInterval\` at 1000ms reads the fresh time via \`new Date()\`, pads hours/minutes/seconds to 2 digits, converts hours to 12-hour format (\`h % 12 || 12\`), records whether the hour is PM, reads \`getDay()\` for the weekday index, and formats the date with \`toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()\`. On every tick also flip the blinking colon. Clean up the interval in the effect's teardown.

The finished piece should feel like a quiet, confident LCD artefact — barely-there ghost segments behind bright digits, a steady heartbeat on the colon, and the tiny dot grid making it feel less like SVG and more like glass.`,
}
