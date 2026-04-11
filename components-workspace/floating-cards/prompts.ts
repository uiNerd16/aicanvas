import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named FloatingCards — a swipeable deck of 3 travel destination cards. The front card is draggable downward; releasing it past a threshold flings it off-screen and the next card slides to the front. Each card shows a hotels count that animates up from 0 when it becomes the front card. Theme-aware (light + dark). Write as a single self-contained React client component. Inline everything (you may keep one small inline useCountUp hook and a HotelsCounter sub-component in the same file). 'use client' at the top. No 'any' types.

Imports: useRef, useState, useEffect from 'react'; motion from 'framer-motion'; { Buildings, ArrowUpRight } from '@phosphor-icons/react'.

Constants: CARD_W = 280, CARD_H = 200.

CARDS (as const tuple of 3):
- { title: 'Maafushi',   sub: 'Crystal waters',    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=520&q=80&fit=crop&crop=center', country: 'Maldives',    hotels: 120 }
- { title: 'Swiss Alps', sub: 'Powder & peaks',    img: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=520&q=80&fit=crop&crop=center', country: 'Switzerland', hotels: 87 }
- { title: 'Bali',       sub: 'Sun-soaked shores', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=520&q=80&fit=crop&crop=center', country: 'Indonesia',   hotels: 250 }

POSITIONS (slot 0 = back, 1 = middle, 2 = front):
- { x: 12, y: -32, rotate: 6, zIndex: 1, opacity: 1 }
- { x:  6, y: -18, rotate: 4, zIndex: 2, opacity: 1 }
- { x:  0, y:   0, rotate: 0, zIndex: 3, opacity: 1 }

useCountUp(target, active): const [value, setValue] = useState(0). useEffect([active, target]): if !active -> setValue(0); return. duration=900, steps=40, interval=duration/steps, step=0. setInterval: step++; setValue(Math.round((step/steps)*target)); if step>=steps clearInterval. Cleanup: clearInterval(id). Return value.

HotelsCounter({target, active}): const value = useCountUp(target, active). Render a flex row gap 5 with a Buildings icon (weight='regular', size=16, color #E8E8DF opacity 0.55) and a span (fontSize 10, fontWeight 500, color 'rgba(255,255,255,0.55)', letterSpacing '0.04em', fontVariantNumeric 'tabular-nums') that reads 'hotels <value>' — the number is wrapped in its own span with color 'rgba(255,255,255,0.85)' and marginLeft 2.

Component state: containerRef: HTMLDivElement. isDark=true. order: [number, number, number] init [0,1,2] — order[positionIndex] = cardIndex. isShuffling=false. exitingCard: number|null = null.

Theme detection: useEffect on mount — find containerRef.current.closest('[data-card-theme]'); setIsDark based on that card's 'dark' class else documentElement.classList.contains('dark'). MutationObserver on documentElement AND on the card wrapper if present, attributeFilter ['class']. Disconnect on cleanup.

Layout root: div ref={containerRef} className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{background: isDark ? '#110F0C' : '#F5F1EA'}}.

Dot grid background: absolute inset-0 with backgroundImage 'radial-gradient(circle, ' + (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)') + ' 1px, transparent 1px)' and backgroundSize '24px 24px'.

Deck wrapper: div style {position:'relative', width: CARD_W, height: CARD_H}.

Inside the deck, CARDS.map((card, i)): const posIndex = order.indexOf(i); pos = POSITIONS[posIndex]; isFront = posIndex === 2; isExiting = exitingCard === i. Render a motion.div key={i} with:
- style: position 'absolute', top 0, left 0, width CARD_W, height CARD_H, cursor isFront?'grab':'default', borderRadius 16, background '#2A2825', border '1px solid rgba(255,255,255,0.10)', boxShadow isDark ? '8px -8px 24px rgba(0,0,0,0.35)' : '8px -8px 24px rgba(0,0,0,0.15)', display flex, flexDirection column, justifyContent flex-start, overflow hidden, padding 0.
- drag: isFront && !isShuffling ? 'y' : false. dragConstraints {top:0, bottom:0}. dragElastic {top:0, bottom:0.6}. dragMomentum false.
- onDragEnd(_e, info): if !isFront || isShuffling return; if info.offset.y > 80 || info.velocity.y > 400 -> setIsShuffling(true); setExitingCard(i).
- animate: isExiting ? {y:600, rotate:8, opacity:0} : {x:pos.x, y:pos.y, rotate:pos.rotate, zIndex:pos.zIndex, opacity:pos.opacity}.
- transition: isExiting ? {duration:0.45, ease:'easeIn'} : {type:'spring', stiffness:80, damping:16}.
- onAnimationComplete: if isExiting -> setExitingCard(null); setOrder(prev => [prev[2], prev[0], prev[1]]); setTimeout(()=>setIsShuffling(false), 400).

Card contents:

Top section: div style padding '10px 10px 0', flex column gap 8, flex '0 0 auto'.
  Header row: flex row justify-between items-center.
    Left: <HotelsCounter target={card.hotels} active={isFront && !isExiting} />.
    Right: circular 26×26 button style borderRadius '50%' background '#BECF5D' (olive accent) flex center, containing <ArrowUpRight weight="bold" size={13} style={{color:'#1A1A19'}}/>.
  Title row: flex row items-baseline justify-between.
    Left: p fontSize 17, fontWeight 800, lineHeight 1.15, color '#FFFFFF', letterSpacing '-0.02em', margin 0 → {card.title}.
    Right: span fontSize 10, fontWeight 500, color 'rgba(255,255,255,0.45)', letterSpacing '0.04em' → {card.country}.

Visual block: div style margin '8px 6px 6px', borderRadius 12, flex 1, position relative, overflow hidden, backgroundImage 'url(\${card.img})', backgroundSize cover, backgroundPosition center.

Hint text: p absolute bottom 24, fontSize 11, color isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', letterSpacing '0.05em' → 'swipe down to shuffle'.

Key details:
- Shadow opacity differs by theme: dark 0.35, light 0.15.
- Only the front card is draggable and only when not shuffling.
- HotelsCounter resets to 0 and counts back up whenever its active prop becomes true (not just on mount).
- The exit threshold is offset.y > 80 OR velocity.y > 400.
- After the exit animation finishes, cycle order: new order = [prev[2], prev[0], prev[1]] — the front card moves to the back.
- The icon header row uses a 16px Buildings icon (not 18), paired with the word "hotels" and the animated number.`,

  GPT: `Build a React client component named FloatingCards. Single file. TypeScript strict, no \`any\`. No props. This is a self-contained showcase.

A deck of 3 travel destination cards. The front card is draggable downward; flick it off and the next card comes forward. Each card displays a hotels count (with a Buildings icon) that animates from 0 to target when it becomes the front card. Theme-aware: light + dark backgrounds and shadow intensity differ.

## Imports
'use client'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Buildings, ArrowUpRight } from '@phosphor-icons/react'

## Constants
const CARD_W = 280
const CARD_H = 200

const CARDS = [
  { title: 'Maafushi',   sub: 'Crystal waters',    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=520&q=80&fit=crop&crop=center', country: 'Maldives',    hotels: 120 },
  { title: 'Swiss Alps', sub: 'Powder & peaks',    img: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=520&q=80&fit=crop&crop=center', country: 'Switzerland', hotels: 87  },
  { title: 'Bali',       sub: 'Sun-soaked shores', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=520&q=80&fit=crop&crop=center', country: 'Indonesia',   hotels: 250 },
] as const

// POSITIONS: index 0 = back, 1 = middle, 2 = front
const POSITIONS = [
  { x: 12, y: -32, rotate: 6, zIndex: 1, opacity: 1 },
  { x:  6, y: -18, rotate: 4, zIndex: 2, opacity: 1 },
  { x:  0, y:   0, rotate: 0, zIndex: 3, opacity: 1 },
] as const

## useCountUp hook (inline)
function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) { setValue(0); return }
    const duration = 900, steps = 40, interval = duration / steps
    let step = 0
    const id = setInterval(() => {
      step++
      setValue(Math.round((step / steps) * target))
      if (step >= steps) clearInterval(id)
    }, interval)
    return () => clearInterval(id)
  }, [active, target])
  return value
}

## HotelsCounter sub-component (inline)
function HotelsCounter({target, active}: {target:number; active:boolean}): const value = useCountUp(target, active). Render:
<div style={{display:'flex', alignItems:'center', gap:5}}>
  <Buildings weight="regular" size={16} style={{color:'#E8E8DF', opacity:0.55}}/>
  <span style={{fontSize:10, fontWeight:500, color:'rgba(255,255,255,0.55)', letterSpacing:'0.04em', fontVariantNumeric:'tabular-nums'}}>
    hotels <span style={{color:'rgba(255,255,255,0.85)', marginLeft:2}}>{value}</span>
  </span>
</div>

## State
- containerRef: useRef<HTMLDivElement>(null)
- isDark=true
- order: [number,number,number] = [0,1,2]  (order[posIndex] = cardIndex)
- isShuffling=false
- exitingCard: number|null = null

## Theme detection
useEffect([]): el = containerRef.current; if !el return. check(): card = el.closest('[data-card-theme]'); setIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark')). Call check() once. MutationObserver observing documentElement AND the card wrapper (if present) with {attributes:true, attributeFilter:['class']}. Cleanup: observer.disconnect().

## JSX root
<div ref={containerRef} className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{background: isDark ? '#110F0C' : '#F5F1EA'}}>

  // dot grid
  <div className="absolute inset-0" style={{
    backgroundImage: \`radial-gradient(circle, \${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'} 1px, transparent 1px)\`,
    backgroundSize: '24px 24px',
  }}/>

  // deck
  <div style={{position:'relative', width:CARD_W, height:CARD_H}}>
    {CARDS.map((card, i) => {
      const posIndex = order.indexOf(i)
      const pos = POSITIONS[posIndex]
      const isFront = posIndex === 2
      const isExiting = exitingCard === i
      return (
        <motion.div key={i}
          style={{
            position:'absolute', top:0, left:0, width:CARD_W, height:CARD_H,
            cursor: isFront ? 'grab' : 'default',
            borderRadius:16,
            background:'#2A2825',
            border:'1px solid rgba(255,255,255,0.10)',
            boxShadow: isDark ? '8px -8px 24px rgba(0,0,0,0.35)' : '8px -8px 24px rgba(0,0,0,0.15)',
            display:'flex', flexDirection:'column', justifyContent:'flex-start',
            overflow:'hidden', padding:0,
          }}
          drag={isFront && !isShuffling ? 'y' : false}
          dragConstraints={{top:0, bottom:0}}
          dragElastic={{top:0, bottom:0.6}}
          dragMomentum={false}
          onDragEnd={(_e, info) => {
            if (!isFront || isShuffling) return
            if (info.offset.y > 80 || info.velocity.y > 400) {
              setIsShuffling(true); setExitingCard(i)
            }
          }}
          animate={isExiting
            ? {y:600, rotate:8, opacity:0}
            : {x:pos.x, y:pos.y, rotate:pos.rotate, zIndex:pos.zIndex, opacity:pos.opacity}}
          transition={isExiting
            ? {duration:0.45, ease:'easeIn'}
            : {type:'spring', stiffness:80, damping:16}}
          onAnimationComplete={() => {
            if (isExiting) {
              setExitingCard(null)
              setOrder(prev => [prev[2], prev[0], prev[1]])
              setTimeout(() => setIsShuffling(false), 400)
            }
          }}
        >
          // top section
          <div style={{padding:'10px 10px 0', display:'flex', flexDirection:'column', gap:8, flex:'0 0 auto'}}>
            // header row
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <HotelsCounter target={card.hotels} active={isFront && !isExiting}/>
              <div style={{width:26, height:26, borderRadius:'50%', background:'#BECF5D', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <ArrowUpRight weight="bold" size={13} style={{color:'#1A1A19'}}/>
              </div>
            </div>
            // title row
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
              <p style={{fontSize:17, fontWeight:800, lineHeight:1.15, color:'#FFFFFF', letterSpacing:'-0.02em', margin:0}}>
                {card.title}
              </p>
              <span style={{fontSize:10, fontWeight:500, color:'rgba(255,255,255,0.45)', letterSpacing:'0.04em'}}>
                {card.country}
              </span>
            </div>
          </div>
          // visual block
          <div style={{
            margin:'8px 6px 6px', borderRadius:12, flex:1, position:'relative', overflow:'hidden',
            backgroundImage: \`url(\${card.img})\`, backgroundSize:'cover', backgroundPosition:'center',
          }}/>
        </motion.div>
      )
    })}
  </div>

  // hint
  <p style={{position:'absolute', bottom:24, fontSize:11, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', letterSpacing:'0.05em'}}>
    swipe down to shuffle
  </p>
</div>

## Notes
- Only the front card (posIndex===2) is draggable, and only while !isShuffling.
- Shadow opacity differs by theme: dark 0.35, light 0.15.
- HotelsCounter's active prop flips true when the card becomes the front (and not exiting) — the count animates from 0 each time.
- Shuffle cycle: new order = [prev[2], prev[0], prev[1]]. After the 600px off-screen exit completes, cycle order, then setTimeout 400ms to re-enable dragging.`,

  Gemini: `Implement a React client component named FloatingCards as a single TypeScript file. Implement the complete component in one response.

## Required imports (use these exact names, no substitutions)
'use client'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Buildings, ArrowUpRight } from '@phosphor-icons/react'

USE these hooks and APIs and no others. No useMotionValue, no useTransform — this component uses plain state and motion.div animate props only.

## Concept
A stack of 3 travel destination cards displayed as a deck. The front card is draggable downward; if the user drags it more than 80px or flicks it faster than 400 px/s, the card flies off-screen and the next card slides to the front. Each card shows an animated hotel-count (Buildings icon + "hotels <N>") that ticks up from 0 to target whenever it becomes the front card. The component is theme-aware (light + dark).

## Constants
const CARD_W = 280
const CARD_H = 200

## Data
const CARDS = [
  { title: 'Maafushi',   sub: 'Crystal waters',    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=520&q=80&fit=crop&crop=center', country: 'Maldives',    hotels: 120 },
  { title: 'Swiss Alps', sub: 'Powder & peaks',    img: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=520&q=80&fit=crop&crop=center', country: 'Switzerland', hotels: 87  },
  { title: 'Bali',       sub: 'Sun-soaked shores', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=520&q=80&fit=crop&crop=center', country: 'Indonesia',   hotels: 250 },
] as const

const POSITIONS = [
  { x: 12, y: -32, rotate: 6, zIndex: 1, opacity: 1 }, // back
  { x:  6, y: -18, rotate: 4, zIndex: 2, opacity: 1 }, // middle
  { x:  0, y:   0, rotate: 0, zIndex: 3, opacity: 1 }, // front
] as const

## useCountUp hook (inline above the component)
function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) { setValue(0); return }
    const duration = 900
    const steps = 40
    const interval = duration / steps
    let step = 0
    const id = setInterval(() => {
      step++
      setValue(Math.round((step / steps) * target))
      if (step >= steps) clearInterval(id)
    }, interval)
    return () => clearInterval(id)
  }, [active, target])
  return value
}

## HotelsCounter sub-component (inline)
function HotelsCounter({ target, active }: { target: number; active: boolean }) {
  const value = useCountUp(target, active)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <Buildings weight="regular" size={16} style={{ color: '#E8E8DF', opacity: 0.55 }} />
      <span style={{ fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>
        hotels <span style={{ color: 'rgba(255,255,255,0.85)', marginLeft: 2 }}>{value}</span>
      </span>
    </div>
  )
}

## State & refs (inside FloatingCards)
const containerRef = useRef<HTMLDivElement>(null)
const [isDark, setIsDark] = useState(true)
const [order, setOrder] = useState<[number, number, number]>([0, 1, 2])  // order[positionIndex] = cardIndex
const [isShuffling, setIsShuffling] = useState(false)
const [exitingCard, setExitingCard] = useState<number | null>(null)

## Theme detection effect
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

## JSX
Root: <div ref={containerRef} className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{background: isDark ? '#110F0C' : '#F5F1EA'}}>.

Dot grid: <div className="absolute inset-0" style={{backgroundImage: \`radial-gradient(circle, \${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'} 1px, transparent 1px)\`, backgroundSize: '24px 24px'}}/>

Deck: <div style={{position:'relative', width: CARD_W, height: CARD_H}}> containing CARDS.map((card, i) => { ... }).

For each card:
- posIndex = order.indexOf(i); pos = POSITIONS[posIndex]; isFront = posIndex === 2; isExiting = exitingCard === i.
- Render motion.div key={i} with these style props:
  position:'absolute', top:0, left:0, width: CARD_W, height: CARD_H,
  cursor: isFront ? 'grab' : 'default',
  borderRadius: 16,
  background: '#2A2825',
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow: isDark ? '8px -8px 24px rgba(0,0,0,0.35)' : '8px -8px 24px rgba(0,0,0,0.15)',
  display:'flex', flexDirection:'column', justifyContent:'flex-start', overflow:'hidden', padding:0.
- drag = (isFront && !isShuffling) ? 'y' : false.
- dragConstraints = {top: 0, bottom: 0}. dragElastic = {top: 0, bottom: 0.6}. dragMomentum = false.
- onDragEnd(_e, info): if (!isFront || isShuffling) return; if (info.offset.y > 80 || info.velocity.y > 400) { setIsShuffling(true); setExitingCard(i) }.
- animate: isExiting ? {y: 600, rotate: 8, opacity: 0} : {x: pos.x, y: pos.y, rotate: pos.rotate, zIndex: pos.zIndex, opacity: pos.opacity}.
- transition: isExiting ? {duration: 0.45, ease: 'easeIn'} : {type: 'spring', stiffness: 80, damping: 16}.
- onAnimationComplete: if (isExiting) { setExitingCard(null); setOrder(prev => [prev[2], prev[0], prev[1]]); setTimeout(() => setIsShuffling(false), 400) }.

Card contents:
Top section div — style {padding:'10px 10px 0', display:'flex', flexDirection:'column', gap:8, flex:'0 0 auto'}:
  Header row div — {display:'flex', justifyContent:'space-between', alignItems:'center'}:
    <HotelsCounter target={card.hotels} active={isFront && !isExiting}/>
    Olive circle button div — {width:26, height:26, borderRadius:'50%', background:'#BECF5D', display:'flex', alignItems:'center', justifyContent:'center'} containing <ArrowUpRight weight="bold" size={13} style={{color:'#1A1A19'}}/>
  Title row div — {display:'flex', alignItems:'baseline', justifyContent:'space-between'}:
    <p style={{fontSize:17, fontWeight:800, lineHeight:1.15, color:'#FFFFFF', letterSpacing:'-0.02em', margin:0}}>{card.title}</p>
    <span style={{fontSize:10, fontWeight:500, color:'rgba(255,255,255,0.45)', letterSpacing:'0.04em'}}>{card.country}</span>
Visual block div — style {margin:'8px 6px 6px', borderRadius:12, flex:1, position:'relative', overflow:'hidden', backgroundImage:\`url(\${card.img})\`, backgroundSize:'cover', backgroundPosition:'center'}. Self-closing.

Hint: <p style={{position:'absolute', bottom:24, fontSize:11, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', letterSpacing:'0.05em'}}>swipe down to shuffle</p>.

## Behavior summary
- Only posIndex===2 is draggable (grab cursor). The other two are static.
- Drag is vertical only, locked against upward motion (dragElastic.top=0), elastic downward.
- Exit condition: offset.y > 80 OR velocity.y > 400. Card flies to y=600 with rotation 8deg fading to opacity 0 over 450ms easeIn. After animation completes, cycle order [prev[2], prev[0], prev[1]] so the flown card becomes the back slot, and re-enable dragging after 400ms.
- HotelsCounter resets to 0 when its active prop becomes false and counts up to target whenever active becomes true. Only the non-exiting front card is active at any time.`,

  V0: `Create a FloatingCards component: a swipeable deck of 3 travel destination cards. The front card can be dragged down; release past a threshold (or flick it) and it flings off-screen while the next card springs to the front. Each card shows an animated "hotels <N>" counter in the header that ticks up from 0 every time the card reaches the front.

Use React, Framer Motion, Tailwind CSS, and @phosphor-icons/react (weight="regular"). Theme-aware — detect the closest [data-card-theme] ancestor's dark class with documentElement fallback. Preview background #110F0C dark / #F5F1EA light with a subtle radial dot grid.

3 cards: Maafushi (Maldives, 120 hotels), Swiss Alps (Switzerland, 87 hotels), Bali (Indonesia, 250 hotels). Each card is 280×200, rounded 16px, dark surface #2A2825 with a 1px white/10 border and a warm offset shadow (8px -8px 24px) — 0.35 opacity in dark, 0.15 in light. Use these Unsplash photos for the cards:
- https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=520&q=80&fit=crop&crop=center
- https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=520&q=80&fit=crop&crop=center
- https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=520&q=80&fit=crop&crop=center

Card header has two items: a left cluster with a Buildings icon (16px, off-white, 55% opacity) followed by the label "hotels" and the animated number, and a small olive accent circle (#BECF5D, 26×26) on the right containing an ArrowUpRight icon (13px, sand-950). Below the header, the card title ("Maafushi", "Swiss Alps", "Bali") in white, fontSize 17, fontWeight 800, letterSpacing -0.02em, with the country name on the right in small uppercase-ish muted white. The rest of the card is filled with the Unsplash photo via backgroundImage.

The 3 cards stack with slight offsets and rotation — back card offset (12, -32) rotated 6°, middle (6, -18) rotated 4°, front (0, 0) rotated 0°. Only the front card is draggable. Use drag="y", dragConstraints {top: 0, bottom: 0}, dragElastic {top: 0, bottom: 0.6}. On drag end: if offset.y > 80 or velocity.y > 400, fling the card to y: 600, rotate: 8°, opacity: 0 over 0.45s easeIn, then rotate the deck order so the flown card moves to the back slot. Non-exiting transitions use a spring {stiffness: 80, damping: 16}. Animate the hotels counter by resetting to 0 and counting up to target over ~900ms whenever the front card changes. Add the hint text "swipe down to shuffle" at the bottom in dim white/black (25%).`,
}
