import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/glass-notification/index.tsx — a glassmorphism notification stack component.

Structure:
- Root: relative div, h-full w-full, overflow-hidden, bg-sand-950
- Background: <img> absolute inset-0, object-cover, opacity-60, pointer-events-none (ethereal flower from ImageKit)
- Content: motion.div w-[360px] centered, flex-col gap-2.5

State: notifications array (useState), initialized with 5 items. Each: {id, icon: PhosphorComponent, color: hex, title, message, time}.

Colors: #3A86FF (blue), #FF7B54 (coral), #06D6A0 (green), #B388FF (violet), #FFBE0B (yellow).

NotificationCard (separate function component):
- motion.div with layout prop, drag="x", dragConstraints {left:0, right:0}, dragElastic 0.3
- onDragEnd: dismiss if abs(offset.x) > 80
- Entry: initial {opacity:0, x:60, scale:0.9}, animate {opacity:1, x:0, scale:1}, spring stiffness:280 damping:24, staggered delay index*0.05
- Exit: {opacity:0, x:-60, scale:0.9, filter:'blur(4px)'}
- whileHover: {backgroundColor: 'rgba(255,255,255,0.1)'}
- Glass: bg rgba(255,255,255,0.06), backdropFilter blur(20px) saturate(1.6), border 1px rgba(255,255,255,0.08), boxShadow with inset highlight
- Layout: flex items-start gap-3.5, px-4 py-3.5 pr-12
- Icon container: h-9 w-9 rounded-xl, bg \${color}18, border 1px \${color}22, spring scale entrance
- Text: title text-sm font-semibold white/85, message text-[13px] white/40
- Dismiss group: absolute right-3 top-3, flex-col items-end gap-1.5. Close button h-5 w-5 rounded-full. Time text-[10px] white/25 below.
- Bottom accent: absolute h-[1px] gradient with notification color

Header: justify-between. Left group: Bell icon 20px + "Notifications" + counter badge (h-4, pink). Right: Reset button when cards < initial.

Empty state: "All caught up" text-white/60.

Wrap cards in <AnimatePresence mode="popLayout">. Use Phosphor icons: Bell, ChatCircle, Heart, ShieldCheck, X, ArrowUp.`,

  V0: `Create a notification stack component with Apple glassmorphism styling on a dark background with a full-bleed background image (an ethereal flower photo, loaded from a URL, opacity 60%, object-cover).

The component shows a vertical stack of 5 notification cards. Each card has:
- A frosted glass surface: rgba(255,255,255,0.06) background, backdrop-blur 20px with saturate 1.6, 1px white/8% border, subtle box shadow with inset top highlight
- Left side: a colored icon in a tinted rounded-xl container (9×9 size), next to a title (white/85%) and message (white/40%)
- Right side: a small close button (5×5, rounded-full, white/6% bg) positioned absolute top-right, with the time label ("2m ago") directly below it, both right-aligned
- A subtle colored gradient accent line at the bottom of each card
- On hover: the card background lightens slightly to white/10%

Notifications are: New Message (blue #3A86FF), New Like (coral #FF7B54), Security (green #06D6A0), Update (violet #B388FF), Reminder (yellow #FFBE0B).

Above the cards: a header row with a bell icon (20px), "Notifications" label, and a small pink counter badge on the left. A "Reset" button appears on the right when cards are dismissed.

Interactions:
- Cards can be swiped left or right to dismiss (drag on X axis, dismiss threshold 80px)
- Dismissed cards exit with x:-60, scale:0.9, blur:4px animation
- Cards enter with staggered spring animation from the right
- When all dismissed, show "All caught up" text
- Reset button restores all notifications

Use Framer Motion for all animations. AnimatePresence with mode="popLayout" for smooth layout shifts. Spring physics: stiffness 280, damping 24.

Build with React, TypeScript, Tailwind CSS, and Framer Motion.`,
}
