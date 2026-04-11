import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  V0: `Create a ScrambleText component — a dark terminal-style display that shows two stacked words "DECRYPT" and "ACCESS" in a chunky pixel/grid font, all in olive green (#BECF5D), against a near-black background (#292929). The whole thing has a cyberpunk-access-terminal vibe.

Idle state: all characters continuously cycle through random glitch characters (uppercase letters, digits, and symbols like @#$%&!) every 60ms — the text never sits still.

Hover: when the user hovers over a padded hit zone around the words, both rows start revealing their actual letters left-to-right simultaneously. Each character snaps into place one at a time with staggered timing (first character at 80ms, each subsequent character 100ms later). While some characters are still scrambling the unrevealed ones keep glitching. Once fully revealed, the scrambling stops.

Mouse leave: immediately resets back to full scramble mode.

Layout: a "/" prefix symbol precedes the first word (DECRYPT) and a "_" suffix follows the last word (ACCESS). The two rows are centered and stacked with a gap between them. The hover zone has generous padding (60px top/bottom, 80px left/right) so the interaction feels natural.

Decorative crosshair SVG markers sit at top-right and bottom-left corners of the overall container — each one an olive-colored crosshair (4 short arms radiating from a center dot, with a small gap at the center), rendered at 35% opacity.

Below the words, a small hint text "hover to decrypt" in the same pixel font, olive at 45% opacity, fades in upward on mount.

Use the GeistPixelGrid font loaded with next/font/local from node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Grid.woff2. All text is text-6xl. The component never changes based on light/dark theme — it always uses the fixed dark background.`,

  GPT: `Build a React client component named \`ScrambleText\`. Single file, TypeScript strict, no \`any\`. 'use client' at top. Self-contained, no props. Implement exactly what is specified.

## Font
import localFont from 'next/font/local'
const GeistPixelGrid = localFont({ src: '../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Grid.woff2' })

## Constants
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!'
const WORDS = ['DECRYPT', 'ACCESS']
const OLIVE = '#BECF5D'
const OLIVE_35 = 'rgba(190,207,93,0.35)'
const OLIVE_45 = 'rgba(190,207,93,0.45)'

## Types
interface CharState { display: string; resolved: boolean }

## Helpers
function randomChar(): string { return CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? 'X' }
const makeScrambled = (word: string): CharState[] => word.split('').map(() => ({ display: randomChar(), resolved: false }))

## useScramble hook
function useScramble(word: string, isHovered: boolean): CharState[] — extracts the scramble/reveal logic into a reusable hook:
- State: chars = useState<CharState[]>(() => makeScrambled(word))
- Effect on [isHovered, word]:
  - let cancelled = false; const timeouts: ReturnType<typeof setTimeout>[] = []; let scrambleInterval: ReturnType<typeof setInterval> | null = null
  - startScrambleInterval(resolvedSet: Set<number>): clears existing interval, then every 60ms sets chars replacing unresolved indices with randomChar()
  - if isHovered: startScrambleInterval(resolvedSet); for each letter at index i, setTimeout at 80 + i*100ms: add i to resolvedSet, update char to { display: letter, resolved: true }; when resolvedSet.size === word.length, stop interval
  - else: setChars(makeScrambled(word)); startScrambleInterval(empty Set)
  - cleanup: cancelled=true, clear timeouts, clear interval
- Returns chars

## Crosshair component
function Crosshair({ style }: { style: React.CSSProperties }) — renders a pointer-events-none absolute SVG crosshair:
- arm=14, gap=3, thick=1 (px), color = OLIVE_35
- SVG viewBox: 0 0 34 34 (arm*2 + gap*2 = 34)
- Lines: top arm (x1=17,y1=0 to x1=17,y1=14), bottom arm (17,17+6=17 to 17,34), left arm (0,17 to 14,17), right arm (20,17 to 34,17) — where center offset = arm+gap = 17 and gap*2 = 6
- Center dot: circle cx=17 cy=17 r=1.5 fill={color}

## Main component ScrambleText
- isHovered state; chars0 = useScramble(WORDS[0]!, isHovered); chars1 = useScramble(WORDS[1]!, isHovered); rows = [chars0, chars1]
- Root: relative flex h-full w-full cursor-default items-center justify-center, style {{ background: '#292929' }}
- Crosshair top-right: style {{ top:'10%', right:'8%' }}
- Crosshair bottom-left: style {{ bottom:'10%', left:'8%' }}
- Inner container: flex select-none flex-col items-center gap-4, style {{ padding:'60px 80px' }}, onMouseEnter/Leave toggle isHovered
- Rows: for each rowIdx, a flex items-center gap-1 div with GeistPixelGrid.className:
  - rowIdx===0: render <span text-6xl leading-none tracking-widest color OLIVE>/</span> before chars
  - chars.map each <span text-6xl leading-none tracking-widest color OLIVE>{ch.display}</span>
  - rowIdx===rows.length-1: render <span text-6xl leading-none tracking-widest color OLIVE>_</span> after chars
- Hint: <motion.p> mt-2 text-xs font-medium uppercase tracking-[0.2em] GeistPixelGrid.className, color OLIVE_45, initial {{opacity:0,y:8}} animate {{opacity:1,y:0}} transition {{duration:0.3,ease:'easeOut',delay:0.8}}> hover to decrypt </motion.p>

Imports: useState, useEffect from 'react'; motion from 'framer-motion'; localFont from 'next/font/local'. No phosphor icons needed. Always dark — no dark: variants.`,

  Gemini: `Implement a React client component named \`ScrambleText\` as a single TypeScript file. Idle state: two stacked words DECRYPT and ACCESS continuously glitch through random characters. On hover: characters reveal left-to-right simultaneously across both rows. Mouse leave: instantly back to full scramble.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import localFont from 'next/font/local'
const GeistPixelGrid = localFont({ src: '../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Grid.woff2' })

## Constants (copy verbatim)
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!'
const WORDS = ['DECRYPT', 'ACCESS']

function randomChar(): string {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? 'X'
}

interface CharState { display: string; resolved: boolean }

const makeScrambled = (word: string): CharState[] =>
  word.split('').map(() => ({ display: randomChar(), resolved: false }))

## useScramble hook
function useScramble(word: string, isHovered: boolean): CharState[] {
  const [chars, setChars] = useState<CharState[]>(() => makeScrambled(word))

  useEffect(() => {
    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let scrambleInterval: ReturnType<typeof setInterval> | null = null

    function startScrambleInterval(resolvedSet: Set<number>) {
      if (scrambleInterval) clearInterval(scrambleInterval)
      scrambleInterval = setInterval(() => {
        if (cancelled) return
        setChars(prev =>
          prev.map((ch, i) => resolvedSet.has(i) ? ch : { display: randomChar(), resolved: false })
        )
      }, 60)
    }

    if (isHovered) {
      const resolvedSet = new Set<number>()
      startScrambleInterval(resolvedSet)
      word.split('').forEach((letter, i) => {
        const t = setTimeout(() => {
          if (cancelled) return
          resolvedSet.add(i)
          setChars(prev =>
            prev.map((ch, idx) => idx === i ? { display: letter, resolved: true } : ch)
          )
          if (resolvedSet.size === word.length && scrambleInterval) {
            clearInterval(scrambleInterval)
            scrambleInterval = null
          }
        }, 80 + i * 100)
        timeouts.push(t)
      })
    } else {
      setChars(makeScrambled(word))
      startScrambleInterval(new Set<number>())
    }

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
      if (scrambleInterval) clearInterval(scrambleInterval)
    }
  }, [isHovered, word])

  return chars
}

## Crosshair component
function Crosshair({ style }: { style: React.CSSProperties }) {
  const color = 'rgba(190,207,93,0.35)'
  const arm = 14; const gap = 3; const thick = 1
  const size = arm * 2 + gap * 2  // = 34
  return (
    <div className="pointer-events-none absolute" style={{ width: size, height: size, ...style }}>
      <svg width="100%" height="100%" viewBox={\`0 0 \${size} \${size}\`} fill="none">
        <line x1={arm+gap} y1={0} x2={arm+gap} y2={arm} stroke={color} strokeWidth={thick} />
        <line x1={arm+gap} y1={arm+gap*2} x2={arm+gap} y2={size} stroke={color} strokeWidth={thick} />
        <line x1={0} y1={arm+gap} x2={arm} y2={arm+gap} stroke={color} strokeWidth={thick} />
        <line x1={arm+gap*2} y1={arm+gap} x2={size} y2={arm+gap} stroke={color} strokeWidth={thick} />
        <circle cx={arm+gap} cy={arm+gap} r={1.5} fill={color} />
      </svg>
    </div>
  )
}

## ScrambleText component JSX
<div className="relative flex h-full w-full cursor-default items-center justify-center" style={{ background: '#292929' }}>
  <Crosshair style={{ top: '10%', right: '8%' }} />
  <Crosshair style={{ bottom: '10%', left: '8%' }} />
  <div
    className="flex select-none flex-col items-center gap-4"
    style={{ padding: '60px 80px' }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {rows.map((chars, rowIdx) => (
      <div key={rowIdx} className={\`flex items-center gap-1 \${GeistPixelGrid.className}\`}>
        {rowIdx === 0 && <span className="text-6xl leading-none tracking-widest" style={{ color: '#BECF5D' }}>/</span>}
        {chars.map((ch, i) => (
          <span key={i} className="text-6xl leading-none tracking-widest" style={{ color: '#BECF5D' }}>{ch.display}</span>
        ))}
        {rowIdx === rows.length - 1 && <span className="text-6xl leading-none tracking-widest" style={{ color: '#BECF5D' }}>_</span>}
      </div>
    ))}
    <motion.p
      className={\`mt-2 text-xs font-medium uppercase tracking-[0.2em] \${GeistPixelGrid.className}\`}
      style={{ color: 'rgba(190,207,93,0.45)' }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.8 }}
    >
      hover to decrypt
    </motion.p>
  </div>
</div>

State: const [isHovered, setIsHovered] = useState(false); const chars0 = useScramble(WORDS[0]!, isHovered); const chars1 = useScramble(WORDS[1]!, isHovered); const rows = [chars0, chars1]

No dark: variants. Fixed background always #292929. All text color #BECF5D.`,

  Claude: `Create a React client component named \`ScrambleText\`. 'use client' at the top. TypeScript strict, no \`any\`. Extract a \`useScramble\` hook and a \`Crosshair\` component — do not inline everything.

## Font
import localFont from 'next/font/local'
const GeistPixelGrid = localFont({ src: '../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Grid.woff2' })

## Constants
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!'
const WORDS = ['DECRYPT', 'ACCESS']

## Types and helpers
interface CharState { display: string; resolved: boolean }
function randomChar(): string — picks a random char from CHARSET, fallback 'X'
const makeScrambled = (word: string): CharState[] — maps each char to { display: randomChar(), resolved: false }

## useScramble(word: string, isHovered: boolean): CharState[]
- State: chars initialized with makeScrambled(word)
- Effect on [isHovered, word]:
  - Declare cancelled, timeouts array, scrambleInterval
  - startScrambleInterval(resolvedSet: Set<number>): clears old interval, starts new one at 60ms — on each tick, replaces unresolved chars with randomChar()
  - if isHovered: startScrambleInterval with empty resolvedSet; then forEach char of word, schedule a timeout at 80 + i*100ms that adds i to resolvedSet, sets that char to { display: letter, resolved: true }, and stops the interval once all chars are resolved
  - else: reset chars to makeScrambled(word), startScrambleInterval with empty Set
  - cleanup: cancelled=true, clear all timeouts, clear interval
- Returns chars

## Crosshair({ style: React.CSSProperties })
- pointer-events-none absolute div, dimensions: arm*2 + gap*2 square
- arm=14, gap=3, thick=1, color='rgba(190,207,93,0.35)'
- SVG with 4 arms (top, bottom, left, right) and a center circle r=1.5
- Arms start at gap distance from center: e.g. top arm goes from (arm+gap, 0) to (arm+gap, arm)
- Center at (arm+gap, arm+gap) = (17, 17)

## ScrambleText component
- State: isHovered
- chars0 = useScramble(WORDS[0]!, isHovered); chars1 = useScramble(WORDS[1]!, isHovered); rows = [chars0, chars1]
- Root: relative flex h-full w-full cursor-default items-center justify-center, style={{ background: '#292929' }}
- Crosshair at top-right: style={{ top:'10%', right:'8%' }}
- Crosshair at bottom-left: style={{ bottom:'10%', left:'8%' }}
- Inner flex-col div: select-none, items-center, gap-4, padding '60px 80px', mouse enter/leave handlers
- Rows: for each rowIdx, a flex items-center gap-1 div using GeistPixelGrid.className:
  - If rowIdx===0: prepend <span className="text-6xl leading-none tracking-widest" style={{ color: '#BECF5D' }}>/</span>
  - Each char: <span key={i} className="text-6xl leading-none tracking-widest" style={{ color: '#BECF5D' }}>{ch.display}</span>
  - If rowIdx===rows.length-1: append <span className="text-6xl leading-none tracking-widest" style={{ color: '#BECF5D' }}>_</span>
- Hint <motion.p>: mt-2 text-xs font-medium uppercase tracking-[0.2em] GeistPixelGrid.className, style={{ color:'rgba(190,207,93,0.45)' }}, initial {{opacity:0,y:8}} animate {{opacity:1,y:0}} transition {{duration:0.3,ease:'easeOut',delay:0.8}}, text "hover to decrypt"

## Visual spec
- Background: always #292929 (never theme-dependent)
- All text/symbols: #BECF5D (olive)
- Hint opacity: 45% (rgba(190,207,93,0.45))
- Crosshair opacity: 35% (rgba(190,207,93,0.35))
- Font size: text-6xl for all word characters and prefix/suffix symbols
- No Phosphor icons, no light/dark variants`,
}
