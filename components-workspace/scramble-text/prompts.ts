import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`ScrambleText\`: idle state shows all characters continuously scrambling (olive random chars); on hover, characters decrypt one by one left-to-right revealing the word "ENCRYPTED". Mouse leave instantly resets to scrambled loop. Hint text below: "hover to decrypt".

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Imports: useState, useEffect from 'react'; motion from 'framer-motion'; Geist_Mono from 'next/font/google'. Initialize const geistMono = Geist_Mono({ subsets:['latin'], weight:['500'] }).

Constants:
- CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!'
- TARGET_TEXT = 'ENCRYPTED'

Helper randomChar(): CHARSET[Math.floor(Math.random()*CHARSET.length)] ?? 'X'.

Type: interface CharState { display:string; resolved:boolean }
SCRAMBLED(): CharState[] — TARGET_TEXT.split('').map(() => ({display:randomChar(), resolved:false})).

State: chars useState<CharState[]>(SCRAMBLED), isHovered useState(false).

Effect depending on [isHovered]:
- let cancelled=false
- const timeouts: ReturnType<typeof setTimeout>[] = []
- let scrambleInterval: ReturnType<typeof setInterval> | null = null
- function startScrambleInterval(resolvedSet: Set<number>): clear existing, then setInterval every 60ms: if cancelled return; setChars(prev => prev.map((ch,i) => resolvedSet.has(i) ? ch : { display:randomChar(), resolved:false })).
- if isHovered: const resolvedSet=new Set<number>(); startScrambleInterval(resolvedSet); TARGET_TEXT.split('').forEach((letter,i) => { t=setTimeout(()=>{ if(cancelled) return; resolvedSet.add(i); setChars(prev => prev.map((ch,idx) => idx===i ? {display:letter,resolved:true} : ch)); if(resolvedSet.size===TARGET_TEXT.length && scrambleInterval){ clearInterval(scrambleInterval); scrambleInterval=null } }, 80 + i*100); timeouts.push(t) })
- else: setChars(SCRAMBLED()); startScrambleInterval(new Set<number>())
- cleanup: cancelled=true; clear all timeouts; if scrambleInterval clearInterval.

JSX root: <div className="flex h-full w-full cursor-default items-center justify-center bg-sand-100 dark:bg-sand-950" onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}>

Inside: flex select-none flex-col items-center gap-6.

Character row: flex items-center gap-1 \${geistMono.className}. Map chars: <span className={['text-5xl font-medium leading-none tracking-widest transition-colors duration-100', ch.resolved ? 'text-sand-900 dark:text-sand-50' : 'text-olive-500 dark:text-olive-400'].join(' ')}>{ch.display}</span>

Hint: motion.p className="text-xs font-medium uppercase tracking-[0.2em] text-sand-400 dark:text-sand-600 \${geistMono.className}" initial {opacity:0,y:8} animate {opacity:1,y:0} transition duration 0.3 easeOut delay 0.8. Text: "hover to decrypt".`,

  GPT: `Build a React client component named \`ScrambleText\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Imports
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Geist_Mono } from 'next/font/google'
const geistMono = Geist_Mono({ subsets:['latin'], weight:['500'] })

## Constants
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!'
const TARGET_TEXT = 'ENCRYPTED'

function randomChar(): string { return CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? 'X' }

interface CharState { display: string; resolved: boolean }
const SCRAMBLED = (): CharState[] => TARGET_TEXT.split('').map(() => ({ display: randomChar(), resolved: false }))

## State
const [chars, setChars] = useState<CharState[]>(SCRAMBLED)
const [isHovered, setIsHovered] = useState(false)

## Effect on [isHovered]
let cancelled = false
const timeouts: ReturnType<typeof setTimeout>[] = []
let scrambleInterval: ReturnType<typeof setInterval> | null = null

function startScrambleInterval(resolvedSet: Set<number>) {
  if (scrambleInterval) clearInterval(scrambleInterval)
  scrambleInterval = setInterval(() => {
    if (cancelled) return
    setChars(prev => prev.map((ch, i) => resolvedSet.has(i) ? ch : { display: randomChar(), resolved: false }))
  }, 60)
}

if (isHovered) {
  const resolvedSet = new Set<number>()
  startScrambleInterval(resolvedSet)
  TARGET_TEXT.split('').forEach((letter, i) => {
    const t = setTimeout(() => {
      if (cancelled) return
      resolvedSet.add(i)
      setChars(prev => prev.map((ch, idx) => idx === i ? { display: letter, resolved: true } : ch))
      if (resolvedSet.size === TARGET_TEXT.length && scrambleInterval) {
        clearInterval(scrambleInterval); scrambleInterval = null
      }
    }, 80 + i * 100)
    timeouts.push(t)
  })
} else {
  setChars(SCRAMBLED())
  startScrambleInterval(new Set<number>())
}

return () => {
  cancelled = true
  timeouts.forEach(clearTimeout)
  if (scrambleInterval) clearInterval(scrambleInterval)
}

## Timings
- Scramble tick: 60ms
- Per-character reveal delay: 80 + i*100 ms (first reveals at 80ms, last reveals at 80 + 8*100 = 880ms)

## JSX structure
<div className="flex h-full w-full cursor-default items-center justify-center bg-sand-100 dark:bg-sand-950" onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}>
  <div className="flex select-none flex-col items-center gap-6">
    <div className={\`flex items-center gap-1 \${geistMono.className}\`}>
      {chars.map((ch, i) => (
        <span key={i} className={[
          'text-5xl font-medium leading-none tracking-widest transition-colors duration-100',
          ch.resolved ? 'text-sand-900 dark:text-sand-50' : 'text-olive-500 dark:text-olive-400',
        ].join(' ')}>{ch.display}</span>
      ))}
    </div>
    <motion.p className={\`text-xs font-medium uppercase tracking-[0.2em] text-sand-400 dark:text-sand-600 \${geistMono.className}\`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3,ease:'easeOut',delay:0.8}}>hover to decrypt</motion.p>
  </div>
</div>`,

  Gemini: `Implement a React client component named \`ScrambleText\` as a single TypeScript file. Idle: all characters continuously scramble through a random charset in olive color. On hover: characters decrypt one by one, left to right, revealing 'ENCRYPTED'. Mouse leave: immediately back to scrambling.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Geist_Mono } from 'next/font/google'
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['500'] })

USE these hooks and no others. DO NOT invent hooks not shown above. Only use motion.p from framer-motion.

## Constants (copy verbatim)
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!'
const TARGET_TEXT = 'ENCRYPTED'

function randomChar(): string {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? 'X'
}

interface CharState { display: string; resolved: boolean }

const SCRAMBLED = (): CharState[] =>
  TARGET_TEXT.split('').map(() => ({ display: randomChar(), resolved: false }))

## State
const [chars, setChars] = useState<CharState[]>(SCRAMBLED)
const [isHovered, setIsHovered] = useState(false)

## Effect (depends on isHovered)
useEffect(() => {
  let cancelled = false
  const timeouts: ReturnType<typeof setTimeout>[] = []
  let scrambleInterval: ReturnType<typeof setInterval> | null = null

  function startScrambleInterval(resolvedSet: Set<number>) {
    if (scrambleInterval) clearInterval(scrambleInterval)
    scrambleInterval = setInterval(() => {
      if (cancelled) return
      setChars((prev) =>
        prev.map((ch, i) =>
          resolvedSet.has(i) ? ch : { display: randomChar(), resolved: false }
        )
      )
    }, 60)
  }

  if (isHovered) {
    const resolvedSet = new Set<number>()
    startScrambleInterval(resolvedSet)

    TARGET_TEXT.split('').forEach((letter, i) => {
      const t = setTimeout(() => {
        if (cancelled) return
        resolvedSet.add(i)
        setChars((prev) =>
          prev.map((ch, idx) => (idx === i ? { display: letter, resolved: true } : ch))
        )
        if (resolvedSet.size === TARGET_TEXT.length && scrambleInterval) {
          clearInterval(scrambleInterval)
          scrambleInterval = null
        }
      }, 80 + i * 100)
      timeouts.push(t)
    })
  } else {
    setChars(SCRAMBLED())
    startScrambleInterval(new Set<number>())
  }

  return () => {
    cancelled = true
    timeouts.forEach(clearTimeout)
    if (scrambleInterval) clearInterval(scrambleInterval)
  }
}, [isHovered])

## JSX
<div className="flex h-full w-full cursor-default items-center justify-center bg-sand-100 dark:bg-sand-950" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
  <div className="flex select-none flex-col items-center gap-6">
    <div className={\`flex items-center gap-1 \${geistMono.className}\`}>
      {chars.map((ch, i) => (
        <span
          key={i}
          className={[
            'text-5xl font-medium leading-none tracking-widest transition-colors duration-100',
            ch.resolved ? 'text-sand-900 dark:text-sand-50' : 'text-olive-500 dark:text-olive-400',
          ].join(' ')}
        >
          {ch.display}
        </span>
      ))}
    </div>
    <motion.p
      className={\`text-xs font-medium uppercase tracking-[0.2em] text-sand-400 dark:text-sand-600 \${geistMono.className}\`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.8 }}
    >
      hover to decrypt
    </motion.p>
  </div>
</div>

## Exact behavior notes
- Scramble interval: 60ms, picks a new random char from CHARSET for every index not in resolvedSet.
- Reveal schedule: letter i resolves at 80 + i*100 ms after hover starts.
- On unhover, the effect re-runs, cancelling timeouts, resetting chars to fresh SCRAMBLED(), and restarting the scramble interval with an empty resolvedSet.`,
}
