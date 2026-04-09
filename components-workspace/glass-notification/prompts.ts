import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassNotification\` — a swipeable frosted-glass notification stack with a header, counter badge, Reset button, and empty state.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background image (absolute inset-0 object-cover opacity-60 pointer-events-none):
\`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png\`

INITIAL_NOTIFICATIONS (5 items, ids 1..5):
1. ChatCircle #3A86FF "New Message" / "Alex sent you a photo" / "2m ago"
2. Heart #FF7B54 "New Like" / "Sarah liked your post" / "5m ago"
3. ShieldCheck #06D6A0 "Security" / "New login from MacBook Pro" / "12m ago"
4. ArrowUp #B388FF "Update Available" / "Version 4.2 is ready to install" / "1h ago"
5. Bell #FFBE0B "Reminder" / "Team standup in 15 minutes" / "1h ago"

State (GlassNotification): [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS). dismiss(id) filters out. reset() restores initial.

Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950. Background <img>. Stack container: relative flex w-[360px] flex-col gap-2.5.

Header (mb-1 flex justify-between px-1): left group (flex items-center gap-2): Bell size=20 weight="regular" text-white/40 + <span className="text-sm font-semibold text-white/60">Notifications</span> + counter motion.span (layout, h-4 min-w-4 rounded-full px-1 text-[9px] font-semibold text-white, bg 'rgba(255,107,245,0.4)' border '1px solid rgba(255,107,245,0.3)') showing notifications.length. Right: Reset motion.button (visible only when notifications.length < INITIAL.length): initial {opacity:0, scale:0.8} animate {opacity:1, scale:1}, whileHover {scale:1.05} whileTap {scale:0.95}, className "cursor-pointer text-xs font-medium text-white/30 transition-colors hover:text-white/50".

Cards wrapped in <AnimatePresence mode="popLayout">. Each NotificationCard receives notification, onDismiss, index.

NotificationCard (inner function component):
- motion.div layout, drag="x", dragConstraints {left:0, right:0}, dragElastic 0.3.
- onDragEnd(_, info): if Math.abs(info.offset.x) > 80 → onDismiss(id).
- initial {x:60, scale:0.9}, animate {x:0, scale:1, transition:{type:'spring', stiffness:280, damping:24, delay:index*0.05}}.
- exit {opacity:0, x:-60, scale:0.9, filter:'blur(4px)', transition:{duration:0.2, ease:'easeIn'}}.
- className "group relative isolate w-full cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing transition-colors duration-200".
- style: background 'rgba(255,255,255,0.06)', border '1px solid rgba(255,255,255,0.08)', boxShadow '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)'.
- whileHover {backgroundColor: 'rgba(255,255,255,0.1)'}.
- Separate blur layer: pointer-events-none absolute inset-0 z-[-1] rounded-2xl, backdropFilter 'blur(20px) saturate(1.6)' (+ WebkitBackdropFilter).
- Inner row: flex items-start gap-3.5 px-4 py-3.5 pr-12.
- Icon motion.div (notification-style tinted): mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl, style {background: \`\${color}18\`, border: \`1px solid \${color}22\`}. initial {scale:0} animate {scale:1} transition {type:'spring', stiffness:400, damping:18, delay:0.1 + index*0.05}. Child <Icon size={18} weight="regular" style={{color}} />.
- Content min-w-0 flex-1: <h4 className="text-sm font-semibold text-white/85">{title}</h4>, <p className="mt-0.5 text-[13px] text-white/40">{message}</p>.
- Top-right group: absolute right-3 top-3 flex flex-col items-end gap-1.5. Close motion.button h-5 w-5 rounded-full, bg 'rgba(255,255,255,0.06)', whileHover {scale:1.2, backgroundColor:'rgba(255,255,255,0.15)'} whileTap {scale:0.85}. X size={11} weight="regular" text-white/30. Below: <span className="text-[10px] text-white/25">{time}</span>.
- Bottom accent line: absolute bottom-0 left-4 right-4 h-[1px], background \`linear-gradient(90deg, transparent, \${color}22, transparent)\`.

Empty state: AnimatePresence containing motion.div when notifications.length===0: initial {opacity:0, scale:0.9} animate {opacity:1, scale:1} className "flex flex-col items-center gap-3 py-12". Text: <span className="text-sm text-white/60">All caught up</span>.

Imports: useState from react; motion, AnimatePresence from framer-motion; Bell, ChatCircle, Heart, ShieldCheck, X, ArrowUp from @phosphor-icons/react.`,

  GPT: `Build a React client component named \`GlassNotification\`. Single file. TypeScript strict, no \`any\`. 'use client' at top. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background URL: https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png

INITIAL_NOTIFICATIONS (5 items):
1. { id:1, icon: ChatCircle,  color:'#3A86FF', title:'New Message',      message:'Alex sent you a photo',           time:'2m ago'  }
2. { id:2, icon: Heart,       color:'#FF7B54', title:'New Like',         message:'Sarah liked your post',            time:'5m ago'  }
3. { id:3, icon: ShieldCheck, color:'#06D6A0', title:'Security',         message:'New login from MacBook Pro',       time:'12m ago' }
4. { id:4, icon: ArrowUp,     color:'#B388FF', title:'Update Available', message:'Version 4.2 is ready to install',  time:'1h ago'  }
5. { id:5, icon: Bell,        color:'#FFBE0B', title:'Reminder',         message:'Team standup in 15 minutes',       time:'1h ago'  }

## Glass surface (each card)
- background: rgba(255, 255, 255, 0.06)
- border: 1px solid rgba(255, 255, 255, 0.08)
- boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
- backdrop-filter (separate child z-[-1] rounded-2xl pointer-events-none): blur(20px) saturate(1.6) (+ WebkitBackdropFilter)
- rounded-2xl, isolate.
- whileHover backgroundColor 'rgba(255,255,255,0.1)'.

## Framer Motion
Card motion.div:
- layout prop
- drag="x", dragConstraints={{ left: 0, right: 0 }}, dragElastic={0.3}
- onDragEnd: if Math.abs(info.offset.x) > 80 → onDismiss(id)
- initial={{ x: 60, scale: 0.9 }}
- animate={{ x: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 24, delay: index * 0.05 } }}
- exit={{ opacity: 0, x: -60, scale: 0.9, filter: 'blur(4px)', transition: { duration: 0.2, ease: 'easeIn' } }}

Icon motion.div: initial {scale:0} animate {scale:1} transition {type:'spring', stiffness:400, damping:18, delay:0.1 + index*0.05}.

Close motion.button: whileHover {scale:1.2, backgroundColor:'rgba(255,255,255,0.15)'}, whileTap {scale:0.85}.

Wrap cards list in <AnimatePresence mode="popLayout">.

Empty state <AnimatePresence> containing motion.div: initial {opacity:0, scale:0.9} animate {opacity:1, scale:1}.

Reset button motion.button: initial {opacity:0, scale:0.8} animate {opacity:1, scale:1}, whileHover {scale:1.05}, whileTap {scale:0.95}.

## Hover state
Card background lifts from rgba(255,255,255,0.06) to rgba(255,255,255,0.1). Close button grows to 1.2× and its bg brightens.

## JSX structure
Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950. Background <img>. Column div (relative flex w-[360px] flex-col gap-2.5):
- Header div (mb-1 flex items-center justify-between px-1): left flex items-center gap-2 → Bell size 20 text-white/40 + <span className="text-sm font-semibold text-white/60">Notifications</span> + counter motion.span (layout, h-4 min-w-4 rounded-full px-1 text-[9px] font-semibold text-white, bg rgba(255,107,245,0.4) border 1px rgba(255,107,245,0.3)) showing notifications.length (only when length>0). Right: Reset button (only when notifications.length < INITIAL.length).
- Cards <AnimatePresence mode="popLayout"> wrapping .map NotificationCard.
- Empty state <AnimatePresence> showing "All caught up" (text-sm text-white/60) in a motion.div py-12.

NotificationCard row: "flex items-start gap-3.5 px-4 py-3.5 pr-12":
- Icon badge: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", style background \`\${color}18\`, border \`1px solid \${color}22\`. <Icon size={18} weight="regular" style={{color}} />
- Content "min-w-0 flex-1": <h4 className="text-sm font-semibold text-white/85">{title}</h4>, <p className="mt-0.5 text-[13px] text-white/40">{message}</p>
- Absolute top-right "absolute right-3 top-3 flex flex-col items-end gap-1.5": Close (h-5 w-5 rounded-full, bg rgba(255,255,255,0.06), <X size={11} weight="regular" className="text-white/30" />), then <span className="text-[10px] text-white/25">{time}</span>
- Bottom accent line: absolute bottom-0 left-4 right-4 h-[1px], background \`linear-gradient(90deg, transparent, \${color}22, transparent)\`

Icons from @phosphor-icons/react (weight="regular"): Bell, ChatCircle, Heart, ShieldCheck, ArrowUp, X.`,

  Gemini: `Implement a React client component named \`GlassNotification\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChatCircle, Heart, ShieldCheck, X, ArrowUp } from '@phosphor-icons/react'

## API guardrails
USE only the hooks listed above. DO NOT invent \`useSwipe\`, \`useGesture\`, \`useList\`, or helpers not shown. Drag is done via framer-motion's \`drag\`, \`dragConstraints\`, \`dragElastic\`, and \`onDragEnd\` props on motion.div — do NOT import \`@use-gesture/react\`. Phosphor icons must be written exactly as Bell, ChatCircle, Heart, ShieldCheck, X, ArrowUp with weight="regular". No \`any\` types.

## Types
interface Notification { id: number; icon: typeof Bell; color: string; title: string; message: string; time: string }

## Constants
const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png'
const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, icon: ChatCircle,  color: '#3A86FF', title: 'New Message',      message: 'Alex sent you a photo',          time: '2m ago' },
  { id: 2, icon: Heart,       color: '#FF7B54', title: 'New Like',         message: 'Sarah liked your post',           time: '5m ago' },
  { id: 3, icon: ShieldCheck, color: '#06D6A0', title: 'Security',         message: 'New login from MacBook Pro',      time: '12m ago' },
  { id: 4, icon: ArrowUp,     color: '#B388FF', title: 'Update Available', message: 'Version 4.2 is ready to install', time: '1h ago' },
  { id: 5, icon: Bell,        color: '#FFBE0B', title: 'Reminder',         message: 'Team standup in 15 minutes',      time: '1h ago' },
]

## NotificationCard (inner component)
Props: { notification: Notification; onDismiss: (id: number) => void; index: number }. Destructure Icon = notification.icon.

Return:
<motion.div layout initial={{ x: 60, scale: 0.9 }} animate={{ x: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 24, delay: index * 0.05 } }} exit={{ opacity: 0, x: -60, scale: 0.9, filter: 'blur(4px)', transition: { duration: 0.2, ease: 'easeIn' } }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.3} onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 80) onDismiss(notification.id) }} className="group relative isolate w-full cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing transition-colors duration-200" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.06)' }} whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
  <div className="pointer-events-none absolute inset-0 z-[-1] rounded-2xl" style={{ backdropFilter: 'blur(20px) saturate(1.6)', WebkitBackdropFilter: 'blur(20px) saturate(1.6)' }} />
  <div className="flex items-start gap-3.5 px-4 py-3.5 pr-12">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 + index * 0.05 }} className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: \`\${notification.color}18\`, border: \`1px solid \${notification.color}22\` }}>
      <Icon size={18} weight="regular" style={{ color: notification.color }} />
    </motion.div>
    <div className="min-w-0 flex-1">
      <h4 className="text-sm font-semibold text-white/85">{notification.title}</h4>
      <p className="mt-0.5 text-[13px] text-white/40">{notification.message}</p>
    </div>
  </div>
  <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
    <motion.button whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.85 }} onClick={() => onDismiss(notification.id)} className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <X size={11} weight="regular" className="text-white/30" />
    </motion.button>
    <span className="text-[10px] text-white/25">{notification.time}</span>
  </div>
  <div className="absolute bottom-0 left-4 right-4 h-[1px]" style={{ background: \`linear-gradient(90deg, transparent, \${notification.color}22, transparent)\` }} />
</motion.div>

## GlassNotification
const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
const dismiss = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id))
const reset = () => setNotifications(INITIAL_NOTIFICATIONS)

Root div (relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950) → background img → column container (relative flex w-[360px] flex-col gap-2.5) → header row → <AnimatePresence mode="popLayout">{notifications.map((n, i) => <NotificationCard key={n.id} notification={n} onDismiss={dismiss} index={i} />)}</AnimatePresence> → empty-state AnimatePresence.

Header: Bell 20 text-white/40 + "Notifications" text-sm font-semibold text-white/60 + counter motion.span (layout, h-4 min-w-4 rounded-full px-1 text-[9px] font-semibold text-white, bg rgba(255,107,245,0.4), border 1px rgba(255,107,245,0.3)); Reset motion.button (only when notifications.length < INITIAL.length) initial {opacity:0, scale:0.8} animate {opacity:1, scale:1} whileHover {scale:1.05} whileTap {scale:0.95} className="cursor-pointer text-xs font-medium text-white/30 transition-colors hover:text-white/50".

Empty state: <AnimatePresence>{notifications.length === 0 && (<motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="flex flex-col items-center gap-3 py-12"><span className="text-sm text-white/60">All caught up</span></motion.div>)}</AnimatePresence>

Named export \`GlassNotification\`.`,

  V0: `Create a GlassNotification component — a vertical stack of swipeable frosted-glass notification cards centered over a dreamy orange flower background photo (opacity 60).

Above the stack, a header row shows a Bell icon (white/40), the label "Notifications" (white/60 semibold), and a small pink counter badge showing the remaining count (pink rgba(255,107,245,0.4) background with matching border, white/9px text). On the right, a subtle "Reset" text button appears only after cards have been dismissed — it restores the full list.

5 notification cards (360px wide, rounded-2xl), each a real glass panel: white at 6% background, 20px backdrop blur with 1.6 saturation (on a separate non-animating layer), 1px white/8 border, soft drop shadow with inset top highlight. On hover each card lifts to white/10.

Each card has:
- A notification-style tinted icon badge on the left: 36×36 rounded-xl with the notification's color at ~9% opacity for the background and ~13% for the border, containing the Phosphor icon in the full accent color.
- A title (white/85 semibold) and a short message (white/40) next to it.
- A small close button (X, 20×20 rounded-full, faint white fill) positioned absolute top-right, with the timestamp label ("2m ago") directly below it right-aligned (white/25).
- A subtle colored gradient accent line running along the bottom edge, using the notification's color at ~13% opacity.

Notifications: New Message (ChatCircle, blue #3A86FF, "Alex sent you a photo", 2m ago), New Like (Heart, coral #FF7B54, "Sarah liked your post", 5m ago), Security (ShieldCheck, green #06D6A0, "New login from MacBook Pro", 12m ago), Update Available (ArrowUp, violet #B388FF, "Version 4.2 is ready to install", 1h ago), Reminder (Bell, yellow #FFBE0B, "Team standup in 15 minutes", 1h ago).

Interactions:
- Cards enter with a staggered spring from the right (x:60 → 0, scale 0.9 → 1, delay index*0.05, spring stiffness 280 damping 24).
- Cards can be dragged horizontally. If dragged more than 80px, they get dismissed and exit with x:-60, scale 0.9, blur 4px fade.
- When the list is empty, show a small "All caught up" label in white/60.

Use Tailwind CSS, Framer Motion (AnimatePresence with mode='popLayout' for smooth layout reshuffles), and Phosphor Icons (weight='regular'): Bell, ChatCircle, Heart, ShieldCheck, ArrowUp, X.`,
}
