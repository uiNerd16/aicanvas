import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
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

  Bolt: `Build a React component GlassNotification with Framer Motion and Phosphor Icons.

Container: relative, full width/height, overflow hidden, bg-sand-950. Background: an <img> tag with absolute positioning, inset-0, object-cover, opacity-60, pointer-events-none, loaded from an ImageKit URL.

Data: 5 notifications array, each with id, icon (Phosphor component), color hex, title, message, time string.
- id:1 ChatCircle #3A86FF "New Message" / "Alex sent you a photo" / "2m ago"
- id:2 Heart #FF7B54 "New Like" / "Sarah liked your post" / "5m ago"
- id:3 ShieldCheck #06D6A0 "Security" / "New login from MacBook Pro" / "12m ago"
- id:4 ArrowUp #B388FF "Update Available" / "Version 4.2 is ready to install" / "1h ago"
- id:5 Bell #FFBE0B "Reminder" / "Team standup in 15 minutes" / "1h ago"

NotificationCard subcomponent:
- motion.div with layout, drag="x", dragConstraints left:0 right:0, dragElastic:0.3
- onDragEnd: if abs(offset.x) > 80, call onDismiss
- initial: opacity:0, x:60, scale:0.9. animate: opacity:1, x:0, scale:1
- exit: opacity:0, x:-60, scale:0.9, filter:'blur(4px)'
- transition: spring stiffness:280 damping:24 delay:index*0.05
- whileHover: backgroundColor rgba(255,255,255,0.1)
- Glass styles: bg rgba(255,255,255,0.06), backdrop-blur 20px saturate 1.6, border 1px rgba(255,255,255,0.08)
- Inner layout: flex items-start gap-3.5 px-4 py-3.5 pr-12
- Icon: motion.div h-9 w-9 rounded-xl with color-tinted bg (color+18 hex) and border (color+22 hex), spring scale-in entrance
- Content: title text-sm font-semibold text-white/85, message text-[13px] text-white/40
- Dismiss: absolute right-3 top-3, flex-col items-end gap-1.5. Button h-5 w-5 rounded-full bg rgba(255,255,255,0.06). X icon size 11. Time span text-[10px] text-white/25 below button.
- Bottom accent: absolute h-[1px] gradient using notification color

Header: flex justify-between. Left: Bell size 20 + "Notifications" text-sm font-semibold text-white/60 + counter badge (h-4 min-w-4 rounded-full, pink bg rgba(255,107,245,0.4)). Right: Reset button (appears when cards dismissed).

Empty state: "All caught up" text-sm text-white/60.

AnimatePresence mode="popLayout" wraps the card list.`,

  Lovable: `Build a glassmorphism notification stack — think Apple's notification center but with a beautiful floral background image.

Dark background with a full-bleed ethereal flower photo at 60% opacity behind everything.

Stack of 5 notification cards, each a frosted glass panel:
- Blurred glass effect (backdrop-blur 20px, very subtle white background at 6% opacity)
- Each notification has a colored icon on the left (blue for messages, coral for likes, green for security, violet for updates, yellow for reminders)
- Title and message text on the left, close button and time aligned to the right
- Subtle color accent line at the bottom of each card matching the icon color
- Cards darken slightly on hover for a nice interactive feel

The magic is in the interactions:
- Swipe cards left or right to dismiss them (like iOS notifications)
- Cards animate out with a blur effect and slide
- New cards stagger in from the right with spring physics
- Layout smoothly reflows when cards are removed
- "All caught up" message when everything is dismissed
- Reset button to bring them all back

Header shows a bell icon, "Notifications" label, and a small pink counter badge.

Use Framer Motion for all animations with spring physics. AnimatePresence for enter/exit. Drag gestures for swipe-to-dismiss.`,

  'Claude Code': `Create components-workspace/glass-notification/index.tsx — a glassmorphism notification stack component.

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

  Cursor: `// Glass Notification Stack — Apple glassmorphism notification center
// Stack: React + TypeScript + Tailwind CSS + Framer Motion + Phosphor Icons

// File: components-workspace/glass-notification/index.tsx
// Export: GlassNotification (named export)
// Root: relative div, h-full w-full, overflow-hidden, bg-sand-950
// Background image: absolute <img>, inset-0, object-cover, opacity-60

// 5 notifications with typed interface: {id, icon, color, title, message, time}
// Icons from @phosphor-icons/react: Bell, ChatCircle, Heart, ShieldCheck, X, ArrowUp
// Colors: #3A86FF #FF7B54 #06D6A0 #B388FF #FFBE0B

// NotificationCard subcomponent:
// - Glass surface: bg rgba(255,255,255,0.06), backdrop-blur 20px saturate 1.6
// - Border: 1px solid rgba(255,255,255,0.08), box-shadow with inset top highlight
// - motion.div: layout, drag="x", dragConstraints {left:0,right:0}, dragElastic 0.3
// - Dismiss on drag > 80px offset
// - Entry animation: spring {stiffness:280, damping:24}, from x:60 scale:0.9
// - Exit: x:-60 scale:0.9 filter:blur(4px)
// - whileHover: backgroundColor rgba(255,255,255,0.1)
// - Inner layout: flex items-start gap-3.5 px-4 py-3.5 pr-12
// - Left: colored icon (h-9 w-9 rounded-xl, tinted bg+border), spring scale entrance
// - Center: title (text-sm semibold white/85) + message (text-[13px] white/40)
// - Right: absolute right-3 top-3, flex-col items-end. Close btn h-5 w-5 + time below
// - Bottom: 1px accent gradient line using notification color

// Header: bell icon 20px + "Notifications" + pink counter badge (h-4) | Reset button right
// Empty state: "All caught up" text-white/60
// AnimatePresence mode="popLayout" for smooth card removal`,
}
