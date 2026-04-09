import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named PolaroidStack — a pile of five small polaroid cards that fans out into an arc on click, lets you hover/select individual cards, then restacks on another click. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Constants: CARD_W = 110, CARD_H = 140.

Cards data (5 entries, each { id, label, from, to }):
0: 'Sunset'  #FF6B6B → #FF8E53
1: 'Ocean'   #14B8A6 → #67E8F9
2: 'Dream'   #8B5CF6 → #C4B5FD
3: 'Golden'  #F59E0B → #FDE68A
4: 'Mist'    #64748B → #CBD5E1

STACKED positions (x,y,rotate):
[ (-6, 2, -12), (3, -4, -5), (1, 1, 2), (-4, 3, 8), (5, -2, 14) ]

FANNED positions:
[ (-160, 30, -22), (-80, 8, -11), (0, -4, 0), (80, 8, 11), (160, 30, 22) ]

State: fanned=false, hoveredId=null, selectedId=null. Click on background toggles fanned and clears hoveredId + selectedId.

Layout: root div className "relative flex h-full w-full cursor-pointer select-none items-center justify-center bg-zinc-950" onClick=toggle. Inside a fixed stage div style {width:460, height:220} className "relative".

Inject the Caveat google font once with an inline <style> block: @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap');

Each card is rendered as a nested motion.div pair inside an absolute-positioned outer at left-1/2 top-1/2.

Outer motion.div (fan/stack transform): animate {x: pos.x - CARD_W/2, y: pos.y - CARD_H/2, rotate: isSelected ? 0 : pos.rotate}, zIndex (isSelected ? 30 : isHovered ? 20 : i), transition {type:'spring', stiffness:280, damping:22, delay: fanned ? i*0.06 : (CARDS.length-1-i)*0.05}. (So fanning staggers left→right, restacking right→left.)

Inner motion.div (hover lift + selected pop): animate {y: isSelected ? -28 : isHovered ? -18 : 0, scale: isSelected ? 1.4 : isHovered ? 1.1 : 1}, transition {type:'spring', stiffness:420, damping:26}. cursor 'pointer' when fanned else 'inherit'. onHoverStart sets hoveredId if fanned. onHoverEnd clears. onClick (only when fanned): stopPropagation, toggle selectedId (if === card.id else set), clear hoveredId.

Card frame (div inside the inner motion.div): width CARD_W, height CARD_H, white background, borderRadius 2, flex column, padding '8px 8px 0 8px'. boxShadow: if isSelected '0 32px 64px rgba(0,0,0,0.7), 0 12px 24px rgba(0,0,0,0.4)'; else if isHovered '0 20px 40px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.3)'; else '0 4px 20px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.15)'. transition 'box-shadow 0.25s ease'.

Inside the frame: a "photo" div flexShrink 0 height 93 with background \`linear-gradient(135deg, \${card.from}, \${card.to})\`. Then a label row flex:1 centered with a <p> using fontFamily "'Caveat', cursive", fontSize 16, fontWeight 600, color '#3f3f46', margin 0, lineHeight 1, text card.label.

Toggle hint: motion.p keyed on \`\${String(fanned)}-\${String(selectedId !== null)}\` initial {opacity:0, y:4} animate {opacity:1, y:0} transition {duration:0.3} className "absolute bottom-6 text-xs text-zinc-500" pointer-events-none fontFamily 'var(--font-sans, sans-serif)' letterSpacing 0.03em. Text: !fanned ? 'click to fan out' : selectedId !== null ? 'click card again to deselect' : 'click a card · click bg to stack'.

Note: this component uses a fixed dark background (#0a0a0a / bg-zinc-950) and does not support a separate light mode — matches the reference.`,

  GPT: `Build a React client component named PolaroidStack. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

Five tiny polaroid photo cards stacked messily in the center. Clicking the background fans them into a wide arc with stagger; hovering a fanned card lifts it; clicking a fanned card pops it forward at 1.4× scale. Clicking the background again restacks them. Always-dark background.

## Data/State
- CARD_W = 110, CARD_H = 140
- CARDS: [{id:0,label:'Sunset',from:'#FF6B6B',to:'#FF8E53'}, {id:1,label:'Ocean',from:'#14B8A6',to:'#67E8F9'}, {id:2,label:'Dream',from:'#8B5CF6',to:'#C4B5FD'}, {id:3,label:'Golden',from:'#F59E0B',to:'#FDE68A'}, {id:4,label:'Mist',from:'#64748B',to:'#CBD5E1'}]
- STACKED: [{-6,2,-12},{3,-4,-5},{1,1,2},{-4,3,8},{5,-2,14}]
- FANNED:  [{-160,30,-22},{-80,8,-11},{0,-4,0},{80,8,11},{160,30,22}]
- state: fanned=false, hoveredId:number|null=null, selectedId:number|null=null

## Animation
Outer motion.div for each card (position + base rotation):
- animate={{ x: pos.x - CARD_W/2, y: pos.y - CARD_H/2, rotate: isSelected ? 0 : pos.rotate }}
- style {zIndex: isSelected ? 30 : isHovered ? 20 : i}
- transition {type:'spring', stiffness:280, damping:22, delay: fanned ? i*0.06 : (CARDS.length-1-i)*0.05}

Inner motion.div (hover lift + click pop):
- animate={{ y: isSelected ? -28 : isHovered ? -18 : 0, scale: isSelected ? 1.4 : isHovered ? 1.1 : 1 }}
- transition {type:'spring', stiffness:420, damping:26}
- style cursor: fanned ? 'pointer' : 'inherit'

## Interaction
Click on the stage background toggles fanned and resets hoveredId + selectedId.
Per card:
- onHoverStart: if (fanned) setHoveredId(card.id)
- onHoverEnd: setHoveredId(null)
- onClick: if (!fanned) return; e.stopPropagation(); setSelectedId(id => id === card.id ? null : card.id); setHoveredId(null).

## JSX structure
- style tag: <style>{\`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap');\`}</style>
- div className="relative flex h-full w-full cursor-pointer select-none items-center justify-center bg-zinc-950" onClick={toggle}
  - div className="relative" style={{width: 460, height: 220}}
    - CARDS.map((card,i) => motion.div absolute left-1/2 top-1/2 with outer props → inner motion.div → card frame div)
  - motion.p hint (absolute bottom-6)

## Card frame
Style: {width:CARD_W, height:CARD_H, backgroundColor:'#ffffff', borderRadius:2, display:'flex', flexDirection:'column', padding:'8px 8px 0 8px', boxShadow: isSelected ? '0 32px 64px rgba(0,0,0,0.7), 0 12px 24px rgba(0,0,0,0.4)' : isHovered ? '0 20px 40px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.15)', transition:'box-shadow 0.25s ease'}.
Inside: photo div {flexShrink:0, height:93, background:\`linear-gradient(135deg, \${card.from}, \${card.to})\`}. Then label row {flex:1, display:'flex', alignItems:'center', justifyContent:'center'} containing <p style={{fontFamily:"'Caveat', cursive", fontSize:16, fontWeight:600, color:'#3f3f46', margin:0, lineHeight:1}}>{card.label}</p>.

## Hint text
motion.p key={\`\${String(fanned)}-\${String(selectedId !== null)}\`} initial={{opacity:0, y:4}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="absolute bottom-6 text-xs text-zinc-500" style={{pointerEvents:'none', fontFamily:'var(--font-sans, sans-serif)', letterSpacing:'0.03em'}}. Text: !fanned ? 'click to fan out' : selectedId !== null ? 'click card again to deselect' : 'click a card · click bg to stack'.

Imports: useState; motion from framer-motion.`,

  Gemini: `Implement a React client component named PolaroidStack as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

USE these hooks and no others. DO NOT invent hooks not shown above. This component has NO theme detection — the background is fixed dark.

## Concept
Five colorful mini polaroids stacked in the middle of the stage. Click the background to fan them out into a wide arc; click a card to pop it up at 1.4× scale; click it again (or background) to undo. Hovering a fanned card gently lifts it.

## Types
interface CardData { id: number; label: string; from: string; to: string }
interface Pos { x: number; y: number; rotate: number }

## Constants
CARD_W = 110. CARD_H = 140.
CARDS: CardData[] =
  { id: 0, label: 'Sunset', from: '#FF6B6B', to: '#FF8E53' },
  { id: 1, label: 'Ocean',  from: '#14B8A6', to: '#67E8F9' },
  { id: 2, label: 'Dream',  from: '#8B5CF6', to: '#C4B5FD' },
  { id: 3, label: 'Golden', from: '#F59E0B', to: '#FDE68A' },
  { id: 4, label: 'Mist',   from: '#64748B', to: '#CBD5E1' }
STACKED: Pos[] = { x:-6, y:2, rotate:-12 }, { x:3, y:-4, rotate:-5 }, { x:1, y:1, rotate:2 }, { x:-4, y:3, rotate:8 }, { x:5, y:-2, rotate:14 }
FANNED: Pos[] = { x:-160, y:30, rotate:-22 }, { x:-80, y:8, rotate:-11 }, { x:0, y:-4, rotate:0 }, { x:80, y:8, rotate:11 }, { x:160, y:30, rotate:22 }

## State
fanned=false, hoveredId:number|null=null, selectedId:number|null=null.

## Handlers
toggle(): setFanned(f=>!f); setHoveredId(null); setSelectedId(null).

## Google font
Inject once via <style>{\`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap');\`}</style>. Place it inside a React fragment wrapper along with the main div.

## JSX
<>
  <style>{...Caveat import...}</style>
  <div className="relative flex h-full w-full cursor-pointer select-none items-center justify-center bg-zinc-950" onClick={toggle}>
    <div className="relative" style={{ width: 460, height: 220 }}>
      {CARDS.map((card, i) => {
        const pos = fanned ? FANNED[i] : STACKED[i]
        const isHovered = fanned && hoveredId === card.id && selectedId !== card.id
        const isSelected = fanned && selectedId === card.id
        return (
          <motion.div
            key={card.id}
            className="absolute left-1/2 top-1/2"
            animate={{ x: pos.x - CARD_W/2, y: pos.y - CARD_H/2, rotate: isSelected ? 0 : pos.rotate }}
            style={{ zIndex: isSelected ? 30 : isHovered ? 20 : i }}
            transition={{ type: 'spring', stiffness: 280, damping: 22, delay: fanned ? i * 0.06 : (CARDS.length - 1 - i) * 0.05 }}
          >
            <motion.div
              animate={{ y: isSelected ? -28 : isHovered ? -18 : 0, scale: isSelected ? 1.4 : isHovered ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              style={{ cursor: fanned ? 'pointer' : 'inherit' }}
              onHoverStart={() => { if (fanned) setHoveredId(card.id) }}
              onHoverEnd={() => setHoveredId(null)}
              onClick={(e) => { if (!fanned) return; e.stopPropagation(); setSelectedId(id => id === card.id ? null : card.id); setHoveredId(null) }}
            >
              <div style={{
                width: CARD_W, height: CARD_H, backgroundColor: '#ffffff', borderRadius: 2,
                display: 'flex', flexDirection: 'column', padding: '8px 8px 0 8px',
                boxShadow: isSelected
                  ? '0 32px 64px rgba(0,0,0,0.7), 0 12px 24px rgba(0,0,0,0.4)'
                  : isHovered
                    ? '0 20px 40px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.3)'
                    : '0 4px 20px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.15)',
                transition: 'box-shadow 0.25s ease',
              }}>
                <div style={{ flexShrink: 0, height: 93, background: \`linear-gradient(135deg, \${card.from}, \${card.to})\` }} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontFamily: "'Caveat', cursive", fontSize: 16, fontWeight: 600, color: '#3f3f46', margin: 0, lineHeight: 1 }}>{card.label}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
    <motion.p
      key={\`\${String(fanned)}-\${String(selectedId !== null)}\`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-6 text-xs text-zinc-500"
      style={{ pointerEvents: 'none', fontFamily: 'var(--font-sans, sans-serif)', letterSpacing: '0.03em' }}
    >
      {!fanned ? 'click to fan out' : selectedId !== null ? 'click card again to deselect' : 'click a card · click bg to stack'}
    </motion.p>
  </div>
</>`,

  V0: `Create a PolaroidStack component — five small polaroid photo cards (110×140, white frame, 2px radius) sitting in a casual stack in the middle of a dark stage. Each polaroid has a colored gradient 'photo' (Sunset, Ocean, Dream, Golden, Mist) and a handwritten Caveat font label beneath. Clicking the stage fans the cards out into a wide arc from -160 to +160 px with matching rotations. Hovering a fanned card lifts it ~18px and scales it 1.1; clicking a fanned card pops it forward 28px at 1.4× scale with an upright rotation. Clicking the background again restacks the cards (right-to-left stagger).

Use Tailwind CSS and Framer Motion. Background is a fixed dark bg-zinc-950 — no light mode. Import the Caveat font from Google Fonts inside an inline style tag. Use nested motion.divs so the outer one handles fan/stack position (spring stiffness 280, damping 22, with a 60ms stagger fanning out, 50ms restacking) and the inner handles hover lift + click pop (spring stiffness 420, damping 26). Card shadows escalate from a soft default to a heavy '0 32px 64px rgba(0,0,0,0.7)' when selected. A small muted hint near the bottom reads 'click to fan out' / 'click a card · click bg to stack' / 'click card again to deselect' depending on state.`,
}
