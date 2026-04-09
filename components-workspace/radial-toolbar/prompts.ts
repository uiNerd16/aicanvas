import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`RadialToolbar\` — a persistent circular EDIT button that opens a 6-wedge radial pie menu of text-formatting tools.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

## Imports
\`\`\`
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { X, TextB, TextItalic, TextUnderline, TextStrikethrough, LinkSimple, Palette } from '@phosphor-icons/react'
\`\`\`

## Geometry constants (exact)
\`\`\`
const CX = 120, CY = 120
const R_IN  = 30   // exactly half the 60px button — wedges touch the button, no gap
const R_OUT = 114
const R_ICON = 78
const GAP = 0
\`\`\`

\`toRad = (d) => (d - 90) * (Math.PI / 180)\` (so 0° points up).

\`wedgePath(startDeg, endDeg)\` returns SVG path:
- s = toRad(start + GAP), e = toRad(end - GAP)
- (x1,y1) = inner @ s; (x2,y2) = outer @ s; (x3,y3) = outer @ e; (x4,y4) = inner @ e
- \`M x1 y1 L x2 y2 A R_OUT R_OUT 0 0 1 x3 y3 L x4 y4 A R_IN R_IN 0 0 0 x1 y1 Z\`

\`iconXY(midDeg)\` returns \`{ x: CX + R_ICON*cos(toRad(mid)), y: CY + R_ICON*sin(toRad(mid)) }\`.

## Tools (clockwise from top, 60° each)
\`[ {id:'bold', label:'Bold', Icon: TextB}, {id:'italic', label:'Italic', Icon: TextItalic}, {id:'under', label:'Underline', Icon: TextUnderline}, {id:'strike', label:'Strikethrough', Icon: TextStrikethrough}, {id:'link', label:'Link', Icon: LinkSimple}, {id:'color', label:'Color', Icon: Palette} ]\`

## State
\`open\` (bool), \`hoveredId\` (string|null), \`activeId\` (string|null), \`isDark\` (bool, default true).

## Theme detection (inline useEffect)
Get \`containerRef.current\`. Function \`check\`: find \`closest('[data-card-theme]')\`; if found use its \`.classList.contains('dark')\`, else use \`document.documentElement.classList.contains('dark')\`. Run \`check()\` once. Create a \`MutationObserver(check)\` and observe \`document.documentElement\` (attributes, attributeFilter ['class']) and the card wrapper if present. Cleanup disconnects.

## Layout
Root \`div ref={containerRef} className="relative flex h-full w-full items-center justify-center"\` with \`style={{ background: isDark ? '#0a0a0a' : '#F5F1EA' }}\`.

## Wheel (AnimatePresence around \`open\` block)
When open: \`<div className="absolute inset-0 flex items-center justify-center">\` containing \`motion.div\` \`{ width:240, height:240, position:'relative', filter:'drop-shadow(0 20px 48px rgba(0,0,0,0.7))' }\`, \`initial { opacity:0 }\`, \`animate { opacity:1 }\`, \`exit { opacity:0 }\`, \`transition { duration:0.22, ease:'easeOut' }\`.

Inside the motion.div:
1. \`<svg width=240 height=240 className="absolute inset-0">\`:
   - One \`<circle cx=CX cy=CY r=R_OUT+1 fill="none" stroke=isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.10)' strokeWidth=1 />\`.
   - 6 wedge \`<path>\` (NOT motion). \`d={wedgePath(i*60, i*60+60)}\`. style.fill: active → \`isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)'\`; hover → \`'rgba(255,255,255,0.14)' / 'rgba(0,0,0,0.10)'\`; idle → \`'rgba(255,255,255,0.07)' / 'rgba(0,0,0,0.06)'\`. style.stroke \`'rgba(255,255,255,0.04)' / 'rgba(0,0,0,0.06)'\` strokeWidth 1, transition \`'fill 0.18s ease'\`, cursor pointer. \`onPointerEnter\`/\`onPointerLeave\` set hoveredId. \`onClick\` toggles activeId (\`p === id ? null : id\`).

2. 6 \`motion.div\` icon containers (outside the svg, inside the motion.div). For each tool i:
   - \`{ x, y } = iconXY(i*60 + 30)\`
   - \`className="absolute flex items-center justify-center"\`
   - style \`{ left: x-12, top: y-12, width:24, height:24, pointerEvents:'none' }\`
   - \`initial { opacity:0, scale:0.4 }\`, \`animate { opacity:1, scale:1 }\`
   - \`transition { type:'spring', stiffness:320, damping:28, delay: i*0.035 + 0.05 }\`
   - Inside: \`<tool.Icon size={18} weight="regular" color={...} />\` where color = active → \`isDark?'#ffffff':'#110F0C'\`; hover → \`isDark?'#e4e4e7':'#2E2A24'\`; idle → \`isDark?'#71717a':'#9E9890'\`.

## Persistent EDIT button
\`motion.button\` (always rendered, not inside AnimatePresence) with style:
- \`position:'relative', zIndex:10, width:60, height:60, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'\`
- \`background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'\`
- \`border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)')\`
- \`boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)'\`
- \`whileHover { scale:1.08 }\`, \`whileTap { scale:0.94 }\`
- \`onClick: open ? close : () => setOpen(true)\`. \`close\` sets open false, activeId null, hoveredId null.

Inside, an \`AnimatePresence mode="wait"\`:
- !open → \`motion.span key="edit"\`, \`initial { opacity:0, scale:0.7 }\`, \`animate { opacity:1, scale:1 }\`, \`exit { opacity:0, scale:0.7 }\`, \`transition { duration:0.14, ease:'easeOut' }\`. Style \`{ fontFamily:'var(--font-sans, sans-serif)', fontSize:11, fontWeight:700, letterSpacing:'0.1em', color: isDark?'#e4e4e7':'#2E2A24', userSelect:'none' }\`. Text "EDIT".
- open → \`motion.span key="x-icon"\`, \`initial { opacity:0, rotate:-90, scale:0.4 }\`, \`animate { opacity:1, rotate:0, scale:1 }\`, \`exit { opacity:0, rotate:-90, scale:0.4 }\`, \`transition { type:'spring', stiffness:260, damping:24 }\`, style \`{ display:'flex' }\`. Inside: \`<X size={16} weight="regular" color={isDark?'#a1a1aa':'#4A453F'} />\`.

## Label pill (AnimatePresence)
When open AND \`labelTool\` exists. \`labelTool = TOOLS.find(t=>t.id===hoveredId) ?? TOOLS.find(t=>t.id===activeId)\`. \`motion.div key={labelTool.id}\` className \`pointer-events-none absolute flex items-center gap-1.5 rounded-full px-3 py-1.5\`. style:
- \`top:'calc(50% + 140px)', left:'50%', x:'-50%'\`
- \`background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'\`
- \`border: '1px solid ' + (isDark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.10)')\`
- \`fontFamily:'var(--font-sans, sans-serif)', whiteSpace:'nowrap'\`

Enter \`{ opacity:0, y:8, scale:0.9 }\` → \`{ opacity:1, y:0, scale:1 }\`, exit \`{ opacity:0, y:4, scale:0.95 }\`, \`transition { type:'spring', stiffness:500, damping:30 }\`.

Inside: \`<labelTool.Icon size={11} weight="regular" color={activeId===labelTool.id ? (isDark?'#e4e4e7':'#2E2A24') : (isDark?'#71717a':'#9E9890')} />\`, \`<span className="text-xs font-medium" style={{ color: isDark?'#a1a1aa':'#736D65' }}>{labelTool.label}</span>\`, and if \`activeId===labelTool.id\` a \`motion.span className="h-1 w-1 rounded-full" style={{ background: isDark?'#ffffff':'#1C1916' }} initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:600, damping:20 }} />\`.

Use Manrope font. The button must remain visible at all times — opening only adds the wheel around it, never replaces it.`,

  GPT: `Build a React client component named \`RadialToolbar\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Imports
\`\`\`
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { X, TextB, TextItalic, TextUnderline, TextStrikethrough, LinkSimple, Palette } from '@phosphor-icons/react'
\`\`\`

## Constants
\`CX=120, CY=120, R_IN=30, R_OUT=114, R_ICON=78, GAP=0\`. \`R_IN\` is exactly half the 60px button — wedges touch the button.

## Tools
\`[{id:'bold',label:'Bold',Icon:TextB}, {id:'italic',label:'Italic',Icon:TextItalic}, {id:'under',label:'Underline',Icon:TextUnderline}, {id:'strike',label:'Strikethrough',Icon:TextStrikethrough}, {id:'link',label:'Link',Icon:LinkSimple}, {id:'color',label:'Color',Icon:Palette}]\` (6 tools, 60° each, clockwise from top)

## Geometry helpers
\`toRad(d) = (d - 90) * Math.PI / 180\`.
\`wedgePath(start, end)\` builds: \`M x1 y1 L x2 y2 A R_OUT R_OUT 0 0 1 x3 y3 L x4 y4 A R_IN R_IN 0 0 0 x1 y1 Z\` where (x1,y1)/(x4,y4) are on R_IN and (x2,y2)/(x3,y3) are on R_OUT.
\`iconXY(mid)\` returns center of icon at R_ICON.

## State
\`open\` bool, \`hoveredId\`/\`activeId\` string|null, \`isDark\` bool default true. \`containerRef\` HTMLDivElement.
\`labelTool = TOOLS.find(t=>t.id===hoveredId) ?? TOOLS.find(t=>t.id===activeId)\`.
\`close = () => { setOpen(false); setActive(null); setHover(null) }\`.
\`handleTool(id) = setActive(p => p === id ? null : id)\`.

## Theme detection
Single \`useEffect\`: read \`containerRef.current\`; \`check\` reads \`el.closest('[data-card-theme]')\` — if found use \`.classList.contains('dark')\`, else \`document.documentElement.classList.contains('dark')\`. Initial check; \`MutationObserver(check)\` on documentElement (attributes, ['class']) and on cardWrapper if present. Cleanup disconnects.

## Wedge fill matrix
\`\`\`
active dark  rgba(255,255,255,0.18)   active light  rgba(0,0,0,0.16)
hover dark   rgba(255,255,255,0.14)   hover light   rgba(0,0,0,0.10)
idle dark    rgba(255,255,255,0.07)   idle light    rgba(0,0,0,0.06)
stroke dark  rgba(255,255,255,0.04)   stroke light  rgba(0,0,0,0.06)
\`\`\`
Wedge style transition: \`'fill 0.18s ease'\`. Cursor pointer.

## Icon color matrix
\`active: isDark ? '#ffffff' : '#110F0C'\`
\`hover:  isDark ? '#e4e4e7' : '#2E2A24'\`
\`idle:   isDark ? '#71717a' : '#9E9890'\`

## EDIT button style
\`width=60, height=60, borderRadius='50%', cursor:'pointer', position:'relative', zIndex:10, display/align/justify center\`.
Background \`isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'\`.
Border \`1px solid \` + \`isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)'\`.
Shadow dark: \`'0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'\`. Shadow light: \`'0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)'\`.
\`whileHover { scale:1.08 }\`, \`whileTap { scale:0.94 }\`. \`onClick: open ? close : () => setOpen(true)\`.

## EDIT label
\`motion.span key="edit"\`, \`initial { opacity:0, scale:0.7 }\` → \`animate { opacity:1, scale:1 }\` → \`exit { opacity:0, scale:0.7 }\`, \`transition { duration:0.14, ease:'easeOut' }\`. Style \`{ fontFamily:'var(--font-sans, sans-serif)', fontSize:11, fontWeight:700, letterSpacing:'0.1em', color: isDark?'#e4e4e7':'#2E2A24', userSelect:'none' }\`. Text "EDIT".

## X icon
\`motion.span key="x-icon"\`, \`initial { opacity:0, rotate:-90, scale:0.4 }\` → \`animate { opacity:1, rotate:0, scale:1 }\` → \`exit { opacity:0, rotate:-90, scale:0.4 }\`, \`transition { type:'spring', stiffness:260, damping:24 }\`. Inside: \`<X size={16} weight="regular" color={isDark?'#a1a1aa':'#4A453F'} />\`. AnimatePresence mode="wait".

## Wheel
\`AnimatePresence\` around \`open && (...)\`. Outer \`<div className="absolute inset-0 flex items-center justify-center">\`. Inner \`motion.div\` \`{ width:240, height:240, position:'relative', filter:'drop-shadow(0 20px 48px rgba(0,0,0,0.7))' }\`, \`initial/animate/exit { opacity }\`, \`transition { duration:0.22, ease:'easeOut' }\`.

Inside motion.div:
- \`<svg width={240} height={240} className="absolute inset-0">\` containing one \`<circle cx={CX} cy={CY} r={R_OUT+1} fill="none" stroke={isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.10)'} strokeWidth={1} />\` and 6 \`<path>\` wedges (NOT motion paths). Each path: \`d={wedgePath(i*60, i*60+60)}\`, style.fill from matrix above, stroke from matrix, strokeWidth 1, transition 'fill 0.18s ease', cursor pointer. \`onPointerEnter\` setHover(id), \`onPointerLeave\` setHover(null), \`onClick\` handleTool(id).
- 6 \`motion.div\` icon containers (siblings to the svg, NOT inside it). For each tool i: compute \`{ x, y } = iconXY(i*60 + 30)\`; className \`absolute flex items-center justify-center\`; style \`{ left:x-12, top:y-12, width:24, height:24, pointerEvents:'none' }\`; \`initial { opacity:0, scale:0.4 }\` → \`animate { opacity:1, scale:1 }\`, \`transition { type:'spring', stiffness:320, damping:28, delay: i*0.035 + 0.05 }\`. Inside: \`<tool.Icon size={18} weight="regular" color={active?...:hover?...:idle...} />\` from matrix.

## Label pill
\`AnimatePresence\` around \`open && labelTool && (...)\`. \`motion.div key={labelTool.id}\` className \`pointer-events-none absolute flex items-center gap-1.5 rounded-full px-3 py-1.5\`. Style:
\`top:'calc(50% + 140px)', left:'50%', x:'-50%'\`,
\`background: isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)'\`,
\`border:'1px solid '+(isDark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.10)')\`,
\`fontFamily:'var(--font-sans, sans-serif)', whiteSpace:'nowrap'\`.
Enter \`{ opacity:0, y:8, scale:0.9 }\` → \`{ opacity:1, y:0, scale:1 }\`, exit \`{ opacity:0, y:4, scale:0.95 }\`, \`{ type:'spring', stiffness:500, damping:30 }\`.
Children: \`<labelTool.Icon size={11} weight="regular" color={activeId===labelTool.id?(isDark?'#e4e4e7':'#2E2A24'):(isDark?'#71717a':'#9E9890')} />\`, \`<span className="text-xs font-medium" style={{ color: isDark?'#a1a1aa':'#736D65' }}>{labelTool.label}</span>\`, and if \`activeId===labelTool.id\` a \`motion.span className="h-1 w-1 rounded-full" style={{ background: isDark?'#ffffff':'#1C1916' }} initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:600, damping:20 }} />\`.

## JSX root order (CRITICAL — button must be persistent)
1. Root div with style background (isDark dark or light)
2. AnimatePresence wheel (inside the root, behind the button via flow but covers absolute inset-0)
3. Persistent \`motion.button\` EDIT (z-10) — NOT inside AnimatePresence
4. AnimatePresence label pill

## Behavior
- Font \`var(--font-sans)\` (Manrope).
- The button is persistent: opening the wheel does NOT replace the button. Opening only mounts the wheel layer around it.
- Background \`isDark ? '#0a0a0a' : '#F5F1EA'\`.`,

  Gemini: `Implement a React client component named \`RadialToolbar\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { X, TextB, TextItalic, TextUnderline, TextStrikethrough, LinkSimple, Palette } from '@phosphor-icons/react'
\`\`\`

USE these hooks and no others. DO NOT invent \`useToggleState\`, \`useTheme\`, or other helpers. The wheel uses plain SVG \`<path>\` elements (NOT motion.path) for the wedges — only the icon containers and the EDIT/X content are motion components.

## Phosphor icons
All Phosphor icons use \`weight="regular"\`. The wedge icons use \`size={18}\`. The X uses \`size={16}\`. The label icon uses \`size={11}\`.

## Constants
\`\`\`
const CX = 120
const CY = 120
const R_IN  = 30   // exactly half the 60px button — wedges touch it, no gap
const R_OUT = 114
const R_ICON = 78
const GAP   = 0
\`\`\`

## Types
\`\`\`
interface Tool { id: string; label: string; Icon: PhosphorIcon }
\`\`\`

\`\`\`
const TOOLS: Tool[] = [
  { id: 'bold',   label: 'Bold',          Icon: TextB },
  { id: 'italic', label: 'Italic',        Icon: TextItalic },
  { id: 'under',  label: 'Underline',     Icon: TextUnderline },
  { id: 'strike', label: 'Strikethrough', Icon: TextStrikethrough },
  { id: 'link',   label: 'Link',          Icon: LinkSimple },
  { id: 'color',  label: 'Color',         Icon: Palette },
]
\`\`\`

## Geometry helpers (top of file, outside the component)
\`\`\`
const toRad = (d: number) => (d - 90) * (Math.PI / 180)

function wedgePath(startDeg: number, endDeg: number): string {
  const s = toRad(startDeg + GAP)
  const e = toRad(endDeg - GAP)
  const x1 = CX + R_IN  * Math.cos(s); const y1 = CY + R_IN  * Math.sin(s)
  const x2 = CX + R_OUT * Math.cos(s); const y2 = CY + R_OUT * Math.sin(s)
  const x3 = CX + R_OUT * Math.cos(e); const y3 = CY + R_OUT * Math.sin(e)
  const x4 = CX + R_IN  * Math.cos(e); const y4 = CY + R_IN  * Math.sin(e)
  return \`M\${x1} \${y1}L\${x2} \${y2}A\${R_OUT} \${R_OUT} 0 0 1 \${x3} \${y3}L\${x4} \${y4}A\${R_IN} \${R_IN} 0 0 0 \${x1} \${y1}Z\`
}

function iconXY(midDeg: number) {
  const r = toRad(midDeg)
  return { x: CX + R_ICON * Math.cos(r), y: CY + R_ICON * Math.sin(r) }
}
\`\`\`

## Component state
\`\`\`
const [open, setOpen]       = useState(false)
const [hoveredId, setHover] = useState<string | null>(null)
const [activeId,  setActive]= useState<string | null>(null)
const containerRef          = useRef<HTMLDivElement>(null)
const [isDark, setIsDark]   = useState(true)
\`\`\`

\`labelTool = TOOLS.find(t => t.id === hoveredId) ?? TOOLS.find(t => t.id === activeId)\`.
\`handleTool(id) = setActive(p => p === id ? null : id)\`.
\`close()\` sets open false, active null, hover null.

## Theme detection useEffect
\`\`\`
useEffect(() => {
  const el = containerRef.current
  if (!el) return
  const check = () => {
    const card = el.closest('[data-card-theme]')
    setIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'))
  }
  check()
  const observer = new MutationObserver(check)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  const cardWrapper = el.closest('[data-card-theme]')
  if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}, [])
\`\`\`

## JSX layout
Root \`<div ref={containerRef} className="relative flex h-full w-full items-center justify-center" style={{ background: isDark ? '#0a0a0a' : '#F5F1EA' }}>\`.

Inside, in this exact order:

### 1. Wheel (AnimatePresence)
\`\`\`
<AnimatePresence>
  {open && (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        style={{ width: 240, height: 240, position: 'relative', filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.7))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <svg width={240} height={240} className="absolute inset-0">
          <circle cx={CX} cy={CY} r={R_OUT + 1} fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.10)'} strokeWidth={1} />
          {TOOLS.map((tool, i) => {
            const isH = hoveredId === tool.id
            const isA = activeId  === tool.id
            return (
              <path
                key={tool.id}
                d={wedgePath(i * 60, i * 60 + 60)}
                style={{
                  fill: isA
                    ? (isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)')
                    : isH
                      ? (isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.10)')
                      : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'),
                  stroke: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)',
                  strokeWidth: 1,
                  transition: 'fill 0.18s ease',
                  cursor: 'pointer',
                }}
                onPointerEnter={() => setHover(tool.id)}
                onPointerLeave={() => setHover(null)}
                onClick={() => handleTool(tool.id)}
              />
            )
          })}
        </svg>
        {TOOLS.map((tool, i) => {
          const { x, y } = iconXY(i * 60 + 30)
          const isH = hoveredId === tool.id
          const isA = activeId  === tool.id
          return (
            <motion.div
              key={\`icon-\${tool.id}\`}
              className="absolute flex items-center justify-center"
              style={{ left: x - 12, top: y - 12, width: 24, height: 24, pointerEvents: 'none' }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28, delay: i * 0.035 + 0.05 }}
            >
              <tool.Icon
                size={18}
                weight="regular"
                color={isA ? (isDark ? '#ffffff' : '#110F0C') : isH ? (isDark ? '#e4e4e7' : '#2E2A24') : (isDark ? '#71717a' : '#9E9890')}
              />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )}
</AnimatePresence>
\`\`\`

### 2. Persistent EDIT button (NOT inside AnimatePresence)
\`\`\`
<motion.button
  style={{
    position: 'relative', zIndex: 10, width: 60, height: 60, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
    border: \`1px solid \${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)'}\`,
    boxShadow: isDark
      ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
      : '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
  }}
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.94 }}
  onClick={open ? close : () => setOpen(true)}
>
  <AnimatePresence mode="wait">
    {!open ? (
      <motion.span
        key="edit"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        style={{
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
          color: isDark ? '#e4e4e7' : '#2E2A24',
          userSelect: 'none',
        }}
      >EDIT</motion.span>
    ) : (
      <motion.span
        key="x-icon"
        initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
        animate={{ opacity: 1, rotate: 0,   scale: 1   }}
        exit={{ opacity: 0, rotate: -90, scale: 0.4 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        style={{ display: 'flex' }}
      >
        <X size={16} weight="regular" color={isDark ? '#a1a1aa' : '#4A453F'} />
      </motion.span>
    )}
  </AnimatePresence>
</motion.button>
\`\`\`

### 3. Label pill (AnimatePresence)
\`\`\`
<AnimatePresence>
  {open && labelTool && (
    <motion.div
      key={labelTool.id}
      className="pointer-events-none absolute flex items-center gap-1.5 rounded-full px-3 py-1.5"
      style={{
        top: 'calc(50% + 140px)', left: '50%', x: '-50%',
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        border: \`1px solid \${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.10)'}\`,
        fontFamily: 'var(--font-sans, sans-serif)', whiteSpace: 'nowrap',
      }}
      initial={{ opacity: 0, y: 8,  scale: 0.9  }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: 4,  scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <labelTool.Icon size={11} weight="regular" color={activeId === labelTool.id ? (isDark ? '#e4e4e7' : '#2E2A24') : (isDark ? '#71717a' : '#9E9890')} />
      <span className="text-xs font-medium" style={{ color: isDark ? '#a1a1aa' : '#736D65' }}>{labelTool.label}</span>
      {activeId === labelTool.id && (
        <motion.span
          className="h-1 w-1 rounded-full"
          style={{ background: isDark ? '#ffffff' : '#1C1916' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 600, damping: 20 }}
        />
      )}
    </motion.div>
  )}
</AnimatePresence>
\`\`\`

## Behavior
- The persistent EDIT button is rendered OUTSIDE the wheel AnimatePresence so it never unmounts.
- Opening only fades in the wheel layer around the button. Closing fades it out.
- Clicking a wedge toggles the activeId; clicking the same wedge again clears it.
- Font \`var(--font-sans)\` (Manrope).`,

  V0: `Create a \`RadialToolbar\` component — a persistent circular EDIT button that opens a 6-slice radial pie menu of text-formatting tools.

Idle: a small dark circular button (60×60) with the word "EDIT" in bold uppercase letterspacing centered inside it. The background is dark (#0a0a0a) in dark mode, warm sand (#F5F1EA) in light mode. The button has a subtle frosted glass look — translucent fill, thin top inner highlight, soft drop shadow.

Click the EDIT button: a 240×240 wheel fades in around the button (the button stays put — it doesn't disappear). The wheel is a 6-slice pie cut into 60° wedges, with the EDIT button forming the hole at the center. Each wedge has a tinted glassy fill that gets brighter on hover. The EDIT label inside the button cross-fades to an X icon that springs in with a -90° rotation.

The 6 wedges (clockwise from top): Bold, Italic, Underline, Strikethrough, Link, Color — each with a Phosphor icon centered in its wedge. Click a wedge to activate it (icon turns white, fill brightens further). Click again to deactivate.

Below the wheel, a small floating pill appears showing the icon and label of whichever tool is currently hovered or active. If a tool is active, a tiny white dot appears next to its label.

Click the X (the EDIT button when the wheel is open) to close — the wheel fades out, the X cross-fades back to "EDIT", and the active/hover state clears.

The component watches for theme changes via a MutationObserver on \`document.documentElement\` and on the closest \`[data-card-theme]\` ancestor — it adapts wedge fills, icon colors, button style, and label pill style for dark/light modes.

Animations (Framer Motion):
- Wheel: opacity fade in/out, 220ms ease-out
- Wedge icons: stagger spring scale (320 stiffness, 28 damping, 35ms per wedge + 50ms base)
- EDIT/X swap: AnimatePresence mode="wait", spring 260/24 for X with rotation
- Label pill: spring 500/30 enter/exit with small y offset
- Button: \`whileHover { scale:1.08 }\`, \`whileTap { scale:0.94 }\`

Use Tailwind CSS, Framer Motion, and \`@phosphor-icons/react\` (TextB, TextItalic, TextUnderline, TextStrikethrough, LinkSimple, Palette, X) all with \`weight="regular"\`. Manrope font.`,
}
