import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Build a frosted glass user menu component with an avatar trigger and animated dropdown.

The scene has a dark atmospheric background image. Centered on screen is a glass pill trigger button showing a gradient avatar circle with user initials (JR), the name "Jennifer Rivera", and a chevron that rotates 180° when open.

Clicking the trigger opens a frosted glass dropdown panel below it. The dropdown springs open with a blur+scale entrance animation and closes the same way. Clicking outside closes it.

The dropdown contains two groups of menu items:
- Account group: Profile, Settings
- Workspace group: Team, Billing

Each item has a 20px Phosphor icon on the left, label text, and a subtle glass highlight + 3px x-shift on hover with spring physics.

Below the groups is a thin divider, then a Log Out button in red that glows red on hover.

All menu items animate in with a staggered spring entrance (opacity + x slide).

The dropdown width is capped at 256px but shrinks on small screens. Closing works on both mouse click outside and touch tap outside.

Use Framer Motion and Phosphor icons.`,

  Bolt: `Create GlassUserMenu React component — glass trigger + animated dropdown with grouped menu items.

USER config:
{ name: 'Jennifer Rivera', email: 'jennifer@studio.io', initials: 'JR' }

MENU_GROUPS:
[
  { label: 'Account', items: [{ icon: User, label: 'Profile' }, { icon: Gear, label: 'Settings' }] },
  { label: 'Workspace', items: [{ icon: Users, label: 'Team' }, { icon: CreditCard, label: 'Billing' }] },
]

GLASS STYLE (reuse for both trigger and dropdown):
background: rgba(255,255,255,0.08), backdropFilter: blur(24px) saturate(1.8),
border: 1px solid rgba(255,255,255,0.1), boxShadow: 0 8px 40px rgba(0,0,0,0.45)

TRIGGER: glass pill, avatar div (gradient #FF7B54→#FF6BF5, initials JR), name, CaretDown (rotates 180° when open via spring). gap-2 between elements.

DROPDOWN: AnimatePresence, initial opacity:0 scale:0.95 y:-8 blur:4px → animate to 1/1/0/0px. w-[min(256px,calc(100vw-32px))]. Top edge highlight line.

MENU ITEMS: staggered spring entrance (opacity+x), whileHover x:3 + glass bg, icon size 20, gap-2.

GROUP LABELS: text-[10px] uppercase tracking-widest text-white/25.

DIVIDER: h-[1px] rgba(255,255,255,0.07).

LOG OUT: SignOut icon in red rgba(255,90,90,0.7), whileHover red bg glow.

CLOSE: useEffect on mousedown + touchstart, check ref.current.contains(target).`,

  Lovable: `Make a beautiful frosted glass user menu dropdown component.

There should be a trigger button that looks like a glass pill — it shows a small avatar circle with gradient colors and the user's initials "JR", the name "Jennifer Rivera", and a chevron arrow.

When clicked, a dropdown menu appears below with a smooth spring animation (it scales in from slightly smaller and fades in with a blur). Clicking anywhere outside closes it.

The dropdown has two sections:
- Account: Profile, Settings
- Workspace: Team, Billing

Each section has a tiny label above it. Each menu item has a Phosphor icon (20px) and label. On hover, items slide slightly to the right with a glass highlight.

At the bottom, after a thin divider, there's a "Log Out" button in red that glows red on hover.

Everything works on mobile too — tapping outside closes the menu, and the dropdown never overflows the screen width.

Use Framer Motion for all animations and Phosphor icons.`,

  'Claude Code': `Build GlassUserMenu component ('use client') with glass trigger and animated dropdown.

USER = { name: 'Jennifer Rivera', email: 'jennifer@studio.io', initials: 'JR' }

MENU_GROUPS = [
  { label: 'Account', items: [{ icon: User, label: 'Profile' }, { icon: Gear, label: 'Settings' }] },
  { label: 'Workspace', items: [{ icon: Users, label: 'Team' }, { icon: CreditCard, label: 'Billing' }] },
]

GLASS STYLE object (shared):
{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)', border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)' }

TRIGGER: motion.button, whileHover scale:1.02, whileTap scale:0.97. Avatar div h-8 w-8 rounded-full gradient #FF7B54→#FF6BF5. CaretDown size:18, animates rotate 0↔180 on open. gap-2 between elements.

CLOSE OUTSIDE: useEffect listening mousedown + touchstart on document, check ref.current.contains(target).

DROPDOWN:
- AnimatePresence wrapping motion.div
- initial: opacity:0 scale:0.95 y:-8 filter:blur(4px) → animate: 1/1/0/blur(0px)
- exit: same as initial. transition: spring stiffness:350 damping:28
- w-[min(256px,calc(100vw-32px))] — mobile safe width
- transformOrigin: top center

MENU ITEM component: staggered spring delay (0.06 + index*0.04), whileHover x:3 + rgba(255,255,255,0.07) bg, icon size:20, gap-2.

LOG OUT: SignOut size:20 in rgba(255,90,90,0.7), whileHover rgba(255,80,80,0.12) bg.

Root: h-full w-full relative flex items-center justify-center overflow-hidden bg-sand-950. Background img absolute inset-0 opacity-60.`,

  Cursor: `Implement GlassUserMenu with these exact specs:

STRUCTURE:
Root div: h-full w-full relative flex items-center justify-center overflow-hidden bg-sand-950
Background img: absolute inset-0 object-cover opacity-60
Inner div (ref): relative flex flex-col items-center px-4

GLASS STYLE (const, reused):
background rgba(255,255,255,0.08), backdropFilter blur(24px) saturate(1.8),
border 1px solid rgba(255,255,255,0.1), boxShadow 0 8px 40px rgba(0,0,0,0.45)

TRIGGER (motion.button):
- gap-2 rounded-2xl px-4 py-2.5, onClick toggle open
- Avatar: h-8 w-8 rounded-full, gradient linear-gradient(135deg,#FF7B54,#FF6BF5), initials JR
- Name: text-sm font-semibold text-white/80
- CaretDown size:18 — motion.div animate rotate 0↔180, spring stiffness:400 damping:28

OUTSIDE CLOSE (useEffect, dep:[open]):
document.addEventListener mousedown + touchstart → check ref.current.contains → setOpen(false)
Remove both listeners on cleanup.

DROPDOWN (AnimatePresence → motion.div):
initial/exit: opacity:0 scale:0.95 y:-8 filter:blur(4px)
animate: opacity:1 scale:1 y:0 filter:blur(0px)
transition: spring stiffness:350 damping:28
className: absolute top-full mt-2 w-[min(256px,calc(100vw-32px))] rounded-2xl p-2
style: glassPanel + transformOrigin:top center

Top edge: absolute left-6 right-6 top-0 h-[1px] white gradient line

MENU ITEMS (MenuItem component):
- initial opacity:0 x:-8 → animate 1/0, spring delay: 0.06 + index*0.04
- whileHover x:3 + rgba(255,255,255,0.07) bg, whileTap scale:0.98
- Icon size:20, gap-2 px-3 py-2.5

GROUP LABEL: text-[10px] uppercase tracking-widest text-white/25

DIVIDER: mx-2 my-1.5 h-[1px] rgba(255,255,255,0.07)

LOG OUT:
- Same stagger delay as last item
- SignOut size:20, color rgba(255,90,90,0.7)
- whileHover x:3 + rgba(255,80,80,0.12) bg`,
}
