import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Build a scatter-field card component in React + Framer Motion (single file, 'use client').

5 feature cards scattered at different positions and rotations across the container. Each card has a coloured top band with a Phosphor icon, a bold title, and a short description.

Cards (CARD_W=180, CARD_H=220, border-radius 18):
- Rocket   "Launch"      bg #2D2BDB  — idle: {x:-130,y:-60,rotate:-18}
- Palette  "Design"      bg #D45CB3  — idle: {x:-80,y:80,rotate:12}
- ChartBar "Metrics"     bg #1A9C6B  — idle: {x:0,y:-40,rotate:-6}
- Lightbulb "Ideas"      bg #CC8C1A  — idle: {x:90,y:60,rotate:14}
- Users    "Collaborate" bg #C03030  — idle: {x:140,y:-80,rotate:20}

Card anatomy:
- 72px coloured top band (icon centred, white, 28px)
- 6px accent dot + bold title (14px, 800)
- Description (12px, muted, 1.55 line-height)

Interaction: click a card to select it → moves to (0,0), rotate:0, scale:1.06, zIndex:10. Other cards scatter further (position × 1.15) and fade to opacity 0.38, scale 0.88. Click selected card again to deselect.

Springs: scatter → {stiffness:240,damping:24}, focus → {stiffness:340,damping:28}.
whileHover on non-selected, non-faded cards: scale 1.04, slight y lift.
"tap a card to focus" hint text at bottom, fades out when a card is selected.
Subtle dot grid background. Support both light and dark mode (card bg adapts).`,

  GPT: `React + Framer Motion scattered card layout. Single file, 'use client'.

CONSTANTS: CARD_W=180, CARD_H=220
SPRING_SCATTER={type:'spring',stiffness:240,damping:24}
SPRING_FOCUS={type:'spring',stiffness:340,damping:28}

CARDS=[
  {id:0,icon:Rocket,    title:'Launch',      body:'Ship fast, iterate faster.',         colorTop:'#2D2BDB',colorAccent:'#6B69FF',idle:{x:-130,y:-60,rotate:-18}},
  {id:1,icon:Palette,   title:'Design',      body:'Beautiful interfaces crafted.',      colorTop:'#D45CB3',colorAccent:'#F090D8',idle:{x:-80,y:80,rotate:12}},
  {id:2,icon:ChartBar,  title:'Metrics',     body:'Real-time analytics.',               colorTop:'#1A9C6B',colorAccent:'#40C896',idle:{x:0,y:-40,rotate:-6}},
  {id:3,icon:Lightbulb, title:'Ideas',       body:'Capture every spark.',               colorTop:'#CC8C1A',colorAccent:'#FFBA44',idle:{x:90,y:60,rotate:14}},
  {id:4,icon:Users,     title:'Collaborate', body:'Work together seamlessly.',          colorTop:'#C03030',colorAccent:'#FF6060',idle:{x:140,y:-80,rotate:20}},
]

STATE: selected:number|null
CLICK: setSelected(prev => prev===id ? null : id)

Each card motion.div (position:absolute, no left/top offset — cards sit at absolute (0,0) and are positioned entirely via animate x/y):
animate=isSelected
  ? {x:0,y:0,rotate:0,scale:1.06,zIndex:10,opacity:1}
  : isFaded
  ? {x:idle.x*1.15,y:idle.y*1.15,rotate:idle.rotate,scale:0.88,zIndex:1,opacity:0.38}
  : {x:idle.x,y:idle.y,rotate:idle.rotate,scale:1,zIndex:2,opacity:1}
transition=isSelected?SPRING_FOCUS:SPRING_SCATTER
whileHover (only idle): {scale:1.04,y:idle.y-6}

Card interior:
- 72px top div (background:colorTop, flexbox centered icon: Phosphor weight="regular" size=28 white)
- padding 14px 16px 18px: row with 6px dot (colorAccent, border-radius 50%) + title (14px 800)
- body text (12px, muted 0.45 opacity)

Root: className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-100 dark:bg-sand-950"
Dot-grid bg behind cards. Hint text (opacity:0 when selected active, else 0.2).`,

  V0: `Create a scattered card layout where 5 feature cards are spread across the canvas at different angles and positions.

The 5 cards each have: a solid coloured top section with a white icon, a bold card title, and 1 sentence of description text.

Cards: Launch (blue icon band), Design (pink icon band), Metrics (green icon band), Ideas (amber icon band), Collaborate (red icon band).

Click any card to bring it to the centre — it straightens out and scales up slightly. The other 4 cards scatter further apart and fade to ~40% opacity. Click the focused card again to return everything to the scattered layout.

Non-selected cards gently lift on hover. Show a subtle "tap a card to focus" hint at the bottom that disappears when a card is focused.

Use spring animations with framer-motion for all transitions. Include a subtle dot-grid background pattern.`,
}
