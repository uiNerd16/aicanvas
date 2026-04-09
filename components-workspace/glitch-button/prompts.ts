import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlitchButton\`: a terminal-inspired button that scrambles its label on hover through random glitch symbols, then resolves character by character left to right. Supports light + dark themes.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Imports: useState, useRef, useEffect, useCallback from 'react'; motion from 'framer-motion'.

Constants:
- LABEL = 'INITIALIZE'
- GLITCH_CHARS = '@#$%&!*^~<>?+='
- SCRAMBLE_DURATION = 700 (ms total)
- SCRAMBLE_INTERVAL = 40 (ms between updates)

Palettes:
DARK { text:'#00ff41', textDim:'rgba(0, 255, 65, 0.6)', glow:'rgba(0, 255, 65, 0.15)', borderDefault:'#2E2A24' }
LIGHT { text:'#2a6b0a', textDim:'rgba(42, 107, 10, 0.7)', glow:'rgba(42, 107, 10, 0.12)', borderDefault:'#DDD8CE' }

Theme detection: useEffect, find closest [data-card-theme], else use document.documentElement.classList.contains('dark'). MutationObserver on both with attributeFilter ['class']. Cleanup disconnect.

State: isDark, displayText (init LABEL), isHovered. Refs: rafRef (number, 0), isHoveredRef (false), startTimeRef (0), lastUpdateRef (0).

cleanup: cancelAnimationFrame(rafRef.current), set to 0. Cleanup effect on unmount.

scrambleTick(timestamp): if !isHoveredRef return. elapsed = timestamp - startTimeRef. resolvePerChar = 700/LABEL.length. If timestamp - lastUpdateRef < 40, schedule next RAF and return. Else lastUpdateRef = timestamp. resolvedCount = min(floor(elapsed/resolvePerChar), LABEL.length). If resolvedCount >= LABEL.length: setDisplayText(LABEL) and stop. Else: build chars[] where i<resolvedCount uses LABEL[i], else getRandomChar() (random from GLITCH_CHARS). setDisplayText(chars.join('')). Schedule next RAF.

handleMouseEnter: isHoveredRef=true, setIsHovered(true), startTimeRef=performance.now(), lastUpdateRef=0, cleanup(), rafRef=requestAnimationFrame(scrambleTick).
handleMouseLeave: isHoveredRef=false, setIsHovered(false), cleanup(), setDisplayText(LABEL).

Root: <div ref className="flex h-full w-full items-center justify-center" style={{background: isDark?'#110F0C':'#F5F1EA'}}>
motion.div entrance initial {opacity:0,y:16} animate {opacity:1,y:0} duration 0.5 easeOut.

motion.button: className "relative cursor-pointer px-8 py-4 font-mono text-lg font-semibold tracking-widest". style: background same, color=colors.text, boxShadow hover '0 0 20px \${glow}, inset 0 0 12px \${glow}' else 'none', transition 'box-shadow 0.3s'. whileTap scale 0.97, spring 400/30.

Corner brackets: map ['tl','tr','bl','br'] to span pointer-events-none absolute, width/height 10, positioned by corner. borderColor hover=textDim else borderDefault, borderTopWidth/BottomWidth/LeftWidth/RightWidth 1.5 depending on corner, borderStyle solid, transition 'border-color 0.3s'.

Inside: <span className="relative z-10">{displayText}</span>.`,

  GPT: `Build a React client component named \`GlitchButton\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Imports
'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

## Constants
const LABEL = 'INITIALIZE'
const GLITCH_CHARS = '@#$%&!*^~<>?+='
const SCRAMBLE_DURATION = 700
const SCRAMBLE_INTERVAL = 40

DARK = { text:'#00ff41', textDim:'rgba(0, 255, 65, 0.6)', glow:'rgba(0, 255, 65, 0.15)', borderDefault:'#2E2A24' }
LIGHT = { text:'#2a6b0a', textDim:'rgba(42, 107, 10, 0.7)', glow:'rgba(42, 107, 10, 0.12)', borderDefault:'#DDD8CE' }

## Helpers
function getRandomChar(): string { return GLITCH_CHARS[Math.floor(Math.random()*GLITCH_CHARS.length)] }

## State
containerRef<HTMLDivElement>, isDark (true), displayText (LABEL), isHovered (false).
Refs: rafRef=useRef<number>(0), isHoveredRef=useRef(false), startTimeRef=useRef(0), lastUpdateRef=useRef(0).

## Theme effect
Same as standard: closest [data-card-theme] → class check, fallback document.documentElement. MutationObserver on html + cardWrapper (if present), attributeFilter ['class']. cleanup disconnect.

## cleanup callback
useCallback: if rafRef.current cancelAnimationFrame it and set 0. useEffect on mount returns ()=>cleanup().

## scrambleTick (useCallback(timestamp))
if !isHoveredRef.current return.
elapsed = timestamp - startTimeRef.current
resolvePerChar = SCRAMBLE_DURATION / LABEL.length  (=70)
if timestamp - lastUpdateRef.current < SCRAMBLE_INTERVAL:
  rafRef.current = requestAnimationFrame(scrambleTick); return
lastUpdateRef.current = timestamp
resolvedCount = min(floor(elapsed/resolvePerChar), LABEL.length)
if resolvedCount >= LABEL.length: setDisplayText(LABEL); return
build chars[] length LABEL.length: chars[i] = i<resolvedCount ? LABEL[i] : getRandomChar()
setDisplayText(chars.join(''))
rafRef.current = requestAnimationFrame(scrambleTick)

## Handlers
handleMouseEnter: isHoveredRef.current=true; setIsHovered(true); startTimeRef.current=performance.now(); lastUpdateRef.current=0; cleanup(); rafRef.current=requestAnimationFrame(scrambleTick)
handleMouseLeave: isHoveredRef.current=false; setIsHovered(false); cleanup(); setDisplayText(LABEL)

## JSX
<div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{background: isDark?'#110F0C':'#F5F1EA'}}>
  <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:'easeOut'}}>
    <motion.button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer px-8 py-4 font-mono text-lg font-semibold tracking-widest"
      style={{ background: isDark?'#110F0C':'#F5F1EA', color: colors.text,
        boxShadow: isHovered ? \`0 0 20px \${colors.glow}, inset 0 0 12px \${colors.glow}\` : 'none',
        transition:'box-shadow 0.3s' }}
      whileTap={{scale:0.97}} transition={{type:'spring',stiffness:400,damping:30}}>

      {/* 4 corner brackets */}
      {(['tl','tr','bl','br'] as const).map(corner => (
        <span key={corner} className="pointer-events-none absolute" style={{
          width:10, height:10,
          top: corner.startsWith('t') ? 0 : 'auto',
          bottom: corner.startsWith('b') ? 0 : 'auto',
          left: corner.endsWith('l') ? 0 : 'auto',
          right: corner.endsWith('r') ? 0 : 'auto',
          borderColor: isHovered ? colors.textDim : colors.borderDefault,
          borderTopWidth: corner.startsWith('t') ? 1.5 : 0,
          borderBottomWidth: corner.startsWith('b') ? 1.5 : 0,
          borderLeftWidth: corner.endsWith('l') ? 1.5 : 0,
          borderRightWidth: corner.endsWith('r') ? 1.5 : 0,
          borderStyle:'solid',
          transition:'border-color 0.3s',
        }}/>
      ))}

      <span className="relative z-10">{displayText}</span>
    </motion.button>
  </motion.div>
</div>

colors = isDark ? DARK : LIGHT.`,

  Gemini: `Implement a React client component named \`GlitchButton\` as a single TypeScript file. Terminal-style button that scrambles label 'INITIALIZE' on hover through glitch chars, resolving left-to-right.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

USE these hooks and no others. DO NOT invent hooks not shown above. Use only motion.div and motion.button from framer-motion.

## Constants (copy verbatim)
const LABEL = 'INITIALIZE'
const GLITCH_CHARS = '@#$%&!*^~<>?+='
const SCRAMBLE_DURATION = 700
const SCRAMBLE_INTERVAL = 40
const DARK = { text:'#00ff41', textDim:'rgba(0, 255, 65, 0.6)', glow:'rgba(0, 255, 65, 0.15)', borderDefault:'#2E2A24' }
const LIGHT = { text:'#2a6b0a', textDim:'rgba(42, 107, 10, 0.7)', glow:'rgba(42, 107, 10, 0.12)', borderDefault:'#DDD8CE' }

function getRandomChar(): string { return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] }

## State and refs
const containerRef = useRef<HTMLDivElement>(null)
const [isDark, setIsDark] = useState(true)
const [displayText, setDisplayText] = useState<string>(LABEL)
const [isHovered, setIsHovered] = useState(false)
const rafRef = useRef<number>(0)
const isHoveredRef = useRef(false)
const startTimeRef = useRef(0)
const lastUpdateRef = useRef(0)

## Theme detection effect
Inside useEffect(()=>{...},[]): const el = containerRef.current; if (!el) return. Define check(): const card = el.closest('[data-card-theme]'); setIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark')). Call check(). const observer = new MutationObserver(check). observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']}). const cardWrapper = el.closest('[data-card-theme]'); if (cardWrapper) observer.observe(cardWrapper,{attributes:true,attributeFilter:['class']}). return () => observer.disconnect().

## cleanup + unmount effect
const cleanup = useCallback(() => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0 } }, [])
useEffect(()=>{ return () => { cleanup() } }, [cleanup])

## scrambleTick (useCallback)
const scrambleTick = useCallback((timestamp: number) => {
  if (!isHoveredRef.current) return
  const elapsed = timestamp - startTimeRef.current
  const resolvePerChar = SCRAMBLE_DURATION / LABEL.length
  if (timestamp - lastUpdateRef.current < SCRAMBLE_INTERVAL) {
    rafRef.current = requestAnimationFrame(scrambleTick); return
  }
  lastUpdateRef.current = timestamp
  const resolvedCount = Math.min(Math.floor(elapsed / resolvePerChar), LABEL.length)
  if (resolvedCount >= LABEL.length) { setDisplayText(LABEL); return }
  const chars: string[] = []
  for (let i=0; i<LABEL.length; i++) chars.push(i < resolvedCount ? LABEL[i] : getRandomChar())
  setDisplayText(chars.join(''))
  rafRef.current = requestAnimationFrame(scrambleTick)
}, [])

## Handlers
function handleMouseEnter() { isHoveredRef.current = true; setIsHovered(true); startTimeRef.current = performance.now(); lastUpdateRef.current = 0; cleanup(); rafRef.current = requestAnimationFrame(scrambleTick) }
function handleMouseLeave() { isHoveredRef.current = false; setIsHovered(false); cleanup(); setDisplayText(LABEL) }

const colors = isDark ? DARK : LIGHT

## JSX
Outer div: <div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{background: isDark ? '#110F0C' : '#F5F1EA'}}>
<motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:'easeOut'}}>
<motion.button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative cursor-pointer px-8 py-4 font-mono text-lg font-semibold tracking-widest" style={{ background: isDark?'#110F0C':'#F5F1EA', color: colors.text, boxShadow: isHovered ? \`0 0 20px \${colors.glow}, inset 0 0 12px \${colors.glow}\` : 'none', transition:'box-shadow 0.3s' }} whileTap={{scale:0.97}} transition={{type:'spring',stiffness:400,damping:30}}>

Render 4 corner brackets via (['tl','tr','bl','br'] as const).map(corner => <span key={corner} className="pointer-events-none absolute" style={{ width:10, height:10, top:corner.startsWith('t')?0:'auto', bottom:corner.startsWith('b')?0:'auto', left:corner.endsWith('l')?0:'auto', right:corner.endsWith('r')?0:'auto', borderColor:isHovered?colors.textDim:colors.borderDefault, borderTopWidth:corner.startsWith('t')?1.5:0, borderBottomWidth:corner.startsWith('b')?1.5:0, borderLeftWidth:corner.endsWith('l')?1.5:0, borderRightWidth:corner.endsWith('r')?1.5:0, borderStyle:'solid', transition:'border-color 0.3s' }}/>)

Then <span className="relative z-10">{displayText}</span>. Close button, motion.div, outer div.`,
}
