import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`TextBlurReveal\` — words animate into view one by one with a blur-to-sharp entrance over a dark dot-grid background, followed by a subtext line and a gradient CTA button. Plays once on mount, no loop.

Write this as a single self-contained \`'use client'\` file. No props on the exported component. No \`any\` types.

## Font
The headline uses Geist Pixel Circle, registered as the CSS variable \`--font-geist-pixel-circle\` (from the \`geist\` npm package). Apply it via \`style={{ fontFamily: 'var(--font-geist-pixel-circle)' }}\` on every word span.

## Constants
\`\`\`
const WORDS = ['Craft', 'interfaces', 'that', 'feel', 'like', 'magic.']
const ACCENTED = new Set([1, 5]) // "interfaces", "magic."
const STAGGER = 100   // ms between each word
const DURATION = 650  // ms per word animation
const LAST_WORD_END = (WORDS.length - 1) * STAGGER + DURATION // 1150 ms
const SHOW_BUTTON_AT = LAST_WORD_END + 150  // 1300 ms
\`\`\`

## State & timing
\`showCTA: boolean\` (default false). \`useEffect([], [])\`: single-run on mount — \`const t = setTimeout(() => setShowCTA(true), SHOW_BUTTON_AT)\`. Return \`() => clearTimeout(t)\`. Animation plays once, no loop.

## Background
Root: \`relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden\`.

Dot grid (pointer-events-none absolute inset-0): \`backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)'\`, \`backgroundSize: '24px 24px'\`.

Indigo glow (pointer-events-none absolute inset-0 flex items-center justify-center): inner div \`h-40 w-80 rounded-full bg-indigo-600/20 blur-3xl\`.

## Animated words
\`relative flex flex-wrap justify-center gap-x-[0.4em] gap-y-1\`. Map WORDS — each is a \`motion.span\` with \`key={i}\`:
- \`initial={{ opacity: 0, y: 22, filter: 'blur(14px)' }}\`
- \`animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}\`
- \`transition={{ duration: DURATION / 1000, delay: (i * STAGGER) / 1000, ease: [0.21, 0.47, 0.32, 0.98] }}\`
- \`style={{ fontFamily: 'var(--font-geist-pixel-circle)' }}\` on every span
- Accented className: \`'bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-4xl tracking-tight text-transparent'\`
- Normal className: \`'text-4xl tracking-tight text-white'\`

## Subtext
\`motion.p\` with \`key="sub"\`, \`initial={{ opacity: 0, y: 8 }}\`, \`animate={{ opacity: 1, y: 0 }}\`, \`transition={{ duration: 0.55, delay: ((WORDS.length - 1) * STAGGER + 200) / 1000, ease: 'easeOut' }}\`, className \`relative text-base text-zinc-400\`. Text: "Drop any phrase. Works with any text."

## CTA
Wrap in \`<div className="flex h-10 items-center justify-center">\` (fixed height prevents layout shift). Inside \`<AnimatePresence>\` render when \`showCTA\`:
\`motion.button\` \`initial={{ opacity: 0, y: 6 }}\` \`animate={{ opacity: 1, y: 0 }}\` \`exit={{ opacity: 0, y: 6 }}\` \`transition={{ duration: 0.35, ease: 'easeOut' }}\` \`whileHover={{ scale: 1.04 }}\` \`whileTap={{ scale: 0.97 }}\` className \`relative rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-opacity hover:opacity-90\`. Label: "Start building".`,

  GPT: `Build a React client component named \`TextBlurReveal\`. Single file, \`'use client'\`, TypeScript strict, no \`any\`, no props.

## Setup
\`\`\`ts
const WORDS = ['Craft', 'interfaces', 'that', 'feel', 'like', 'magic.']
const ACCENTED = new Set([1, 5])
const STAGGER = 100
const DURATION = 650
const LAST_WORD_END = (WORDS.length - 1) * STAGGER + DURATION
const SHOW_BUTTON_AT = LAST_WORD_END + 150
\`\`\`

State: \`showCTA\` (boolean, false). \`useEffect([], [])\` — runs once on mount: \`const t = setTimeout(() => setShowCTA(true), SHOW_BUTTON_AT)\`. Return \`() => clearTimeout(t)\`. No loop, no cycle state.

## JSX
Root: \`relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden\`.

**Dot grid** — \`pointer-events-none absolute inset-0\`, inline style \`backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)'\`, \`backgroundSize: '24px 24px'\`.

**Indigo glow** — \`pointer-events-none absolute inset-0 flex items-center justify-center\` with inner \`h-40 w-80 rounded-full bg-indigo-600/20 blur-3xl\`.

**Words** — \`relative flex flex-wrap justify-center gap-x-[0.4em] gap-y-1\`. Each word is a \`motion.span\` with \`key={i}\`, \`initial={{ opacity: 0, y: 22, filter: 'blur(14px)' }}\`, \`animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}\`, \`transition={{ duration: DURATION/1000, delay: i*STAGGER/1000, ease: [0.21,0.47,0.32,0.98] }}\`, \`style={{ fontFamily: 'var(--font-geist-pixel-circle)' }}\` on all spans. Accented: \`bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-4xl tracking-tight text-transparent\`. Normal: \`text-4xl tracking-tight text-white\`.

**Subtext** — \`motion.p\` with \`key="sub"\`, \`initial={{ opacity: 0, y: 8 }}\`, \`animate={{ opacity: 1, y: 0 }}\`, \`transition={{ duration: 0.55, delay: ((WORDS.length-1)*STAGGER+200)/1000, ease: 'easeOut' }}\`, className \`relative text-base text-zinc-400\`. Text: "Drop any phrase. Works with any text."

**CTA slot** — \`<div className="flex h-10 items-center justify-center">\`. Inside \`<AnimatePresence>\`, when \`showCTA\`: \`motion.button\` \`initial={{ opacity:0, y:6 }}\` \`animate={{ opacity:1, y:0 }}\` \`exit={{ opacity:0, y:6 }}\` \`transition={{ duration:0.35, ease:'easeOut' }}\` \`whileHover={{ scale:1.04 }}\` \`whileTap={{ scale:0.97 }}\` className \`relative rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-opacity hover:opacity-90\`. Label: "Start building".

**Font note**: \`--font-geist-pixel-circle\` must be registered in the app's root layout using \`GeistPixelCircle\` from \`geist/font/pixel\`.`,

  Gemini: `Implement a React client component named \`TextBlurReveal\` as a single TypeScript file.

Do NOT invent hooks. Use only what is listed. Implement the complete component — do not abbreviate.

## Required imports
\`\`\`
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
\`\`\`

## Constants (declare at module level)
\`\`\`
const WORDS = ['Craft', 'interfaces', 'that', 'feel', 'like', 'magic.']
const ACCENTED = new Set([1, 5])
const STAGGER = 100
const DURATION = 650
const LAST_WORD_END = (WORDS.length - 1) * STAGGER + DURATION
const SHOW_BUTTON_AT = LAST_WORD_END + 150
\`\`\`

## Component
State: \`const [showCTA, setShowCTA] = useState(false)\`.

\`useEffect\` deps \`[]\` — runs once on mount: \`const t = setTimeout(() => setShowCTA(true), SHOW_BUTTON_AT)\`. Return \`() => clearTimeout(t)\`. No loop.

## JSX
\`<div className="relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden">\`

Dot grid: \`<div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />\`

Glow: \`<div className="pointer-events-none absolute inset-0 flex items-center justify-center"><div className="h-40 w-80 rounded-full bg-indigo-600/20 blur-3xl" /></div>\`

Words: \`<div className="relative flex flex-wrap justify-center gap-x-[0.4em] gap-y-1">\` then map WORDS to \`<motion.span key={i} initial={{ opacity: 0, y: 22, filter: 'blur(14px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: DURATION/1000, delay: (i*STAGGER)/1000, ease: [0.21,0.47,0.32,0.98] }} className={ACCENTED.has(i) ? 'bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-4xl tracking-tight text-transparent' : 'text-4xl tracking-tight text-white'} style={{ fontFamily: 'var(--font-geist-pixel-circle)' }}>{word}</motion.span>\`

Subtext: \`<motion.p key="sub" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: ((WORDS.length-1)*STAGGER+200)/1000, ease: 'easeOut' }} className="relative text-base text-zinc-400">Drop any phrase. Works with any text.</motion.p>\`

CTA: \`<div className="flex h-10 items-center justify-center"><AnimatePresence>{showCTA && (<motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.35, ease: 'easeOut' }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="relative rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-opacity hover:opacity-90">Start building</motion.button>)}</AnimatePresence></div>\`

**Font**: register \`GeistPixelCircle\` from \`geist/font/pixel\` in the app layout to expose \`--font-geist-pixel-circle\`.`,

  V0: `Create a \`TextBlurReveal\` component — words blur into focus one by one over a dark dot-grid background, then a CTA button fades in. Plays once on mount, no loop.

**Background**: dark (\`bg-sand-950\` or equivalent), subtle white dot grid (radial-gradient 1px dots, 24px grid), and a soft \`bg-indigo-600/20 blur-3xl\` glow blob centered behind the text.

**Headline**: "Craft interfaces that feel like magic." rendered word by word using Framer Motion. Each word animates from \`opacity: 0, y: 22, blur: 14px\` to \`opacity: 1, y: 0, blur: 0\` with a 100ms stagger and 650ms duration per word, using ease \`[0.21, 0.47, 0.32, 0.98]\`. All words use the Geist Pixel Circle font (\`geist\` npm package, \`--font-geist-pixel-circle\` CSS variable). "interfaces" (index 1) and "magic." (index 5) are gradient-colored: \`bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent\`. All others are plain white. Font size \`text-4xl\`, \`tracking-tight\`.

**Subtext**: "Drop any phrase. Works with any text." fades in (\`opacity: 0, y: 8 → 1, 0\`) slightly after the headline, \`text-base text-zinc-400\`.

**CTA**: 150ms after the last word finishes, a "Start building" button fades in (\`opacity: 0, y: 6 → 1, 0\`, 350ms). Gradient pill: \`bg-gradient-to-r from-violet-500 to-indigo-500\`, \`rounded-full px-5 py-2.5 text-sm font-semibold text-white\`, subtle \`shadow-lg shadow-indigo-500/30\`. Wrap in a fixed \`h-10\` container to prevent layout shift. \`whileHover={{ scale: 1.04 }}\`, \`whileTap={{ scale: 0.97 }}\`.

**Single play**: animation runs once on mount. No loop, no replay.

Use Tailwind CSS and Framer Motion.`,
}
