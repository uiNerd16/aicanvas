import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Build GlassUserMenu component ('use client') with glass trigger (orange active glow) and animated dropdown.

USER = { name: 'Jennifer Rivera', email: 'jennifer@studio.io', initials: 'JR' }

MENU_GROUPS = [
  { label: 'Account', items: [{ icon: User, label: 'Profile', color: '#3A86FF' }, { icon: Gear, label: 'Settings', color: '#B388FF' }] },
  { label: 'Workspace', items: [{ icon: Users, label: 'Team', color: '#06D6A0' }, { icon: CreditCard, label: 'Billing', color: '#FFBE0B' }] },
]

GLASS STYLE (two consts for perf):
glassPanel: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)' }
glassPanelBlur (separate div, avoids recalc on hover): { backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }

ACTIVE_GLOW = '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1.5px rgba(255, 160, 50, 0.5), 0 0 20px rgba(255, 160, 50, 0.12)'

TRIGGER: motion.button, whileHover scale:1.02, whileTap scale:0.97.
animate={{ boxShadow: open ? ACTIVE_GLOW : glassPanel.boxShadow }} — spring stiffness:300 damping:26.
Style: background + border from glassPanel (NOT boxShadow — that's animated).
Avatar div h-8 w-8 rounded-full gradient #FF7B54→#FF6BF5. CaretDown size:18, animates rotate 0↔180 on open via spring stiffness:400 damping:28.

CLOSE OUTSIDE: useEffect listening mousedown + touchstart on document, check ref.current.contains(target).

DROPDOWN:
- AnimatePresence wrapping motion.div
- initial: opacity:0 scale:0.95 y:-8 filter:blur(4px) → animate: 1/1/0/blur(0px)
- exit: same as initial. transition: spring stiffness:350 damping:28
- w-[min(256px,calc(100vw-32px))] — mobile safe width
- transformOrigin: top center

MENU ITEM component — TWO-LAYER HOVER PATTERN (matches glass-search-bar):
Outer: motion.div, holds [hovered] state, onMouseEnter/Leave.
  initial opacity:0 → animate opacity:1, duration:0.15, delay: 0.06 + index*0.04.
  Static — no movement. flex gap-2.5 rounded-xl px-3 py-2.5 minHeight:44.
Inner: motion.button, animate x: hovered?3:0 scale: hovered?1.08:1.
  spring stiffness:320 damping:20, transformOrigin:'left center'. whileTap scale:0.90.
  Contains icon badge + label. flex gap-2.5 cursor-pointer.
Icon badge: 32x32 div, rounded-xl. bg: \`\${color}18\`, border: \`1px solid \${color}22\`. Icon size:16 weight:"regular", style={{ color }}.
Label: text-sm font-medium, color white/70 default → white/95 hovered, transition 0.15s.

LOG OUT (LogOutItem component, same two-layer hover):
Badge: bg '#FF5A5A18', border '1px solid #FF5A5A22', SignOut size:16 color:#FF5A5A.
Label: rgba(255,90,90,0.70) → 0.95 on hover.

Container offset: marginTop: -150 for vertical centering when open.
Root: h-full w-full relative flex items-center justify-center overflow-hidden bg-sand-950. Background img absolute inset-0 opacity-60.`,

  V0: `Build a frosted glass user menu component with an avatar trigger and animated dropdown.

The scene has a dark atmospheric background image. Centered on screen (offset upward by ~150px) is a glass pill trigger button showing a gradient avatar circle with user initials (JR), the name "Jennifer Rivera", and a chevron that rotates 180° when open.

When the menu is open, the trigger gets a warm orange active glow — an animated boxShadow transition that adds a 1.5px orange ring (rgba(255, 160, 50, 0.5)) and a soft 20px orange ambient glow (rgba(255, 160, 50, 0.12)), matching the glass search bar active state. This animates with a spring (stiffness 300, damping 26).

Clicking the trigger opens a frosted glass dropdown panel below it. The dropdown springs open with a blur+scale entrance animation and closes the same way. Clicking outside closes it.

The dropdown contains two groups of menu items:
- Account group: Profile, Settings
- Workspace group: Team, Billing

Each menu item uses a two-layer hover pattern: an outer static div holds the hover state, and an inner motion.button animates the icon badge + label together. On hover, the inner group scales to 1.08 and nudges 3px to the right with spring physics (stiffness 320, damping 20, origin left center). The outer div stays still. Text brightens from white/70 to white/95 on hover with a 0.15s transition.

Each item has a notification-style icon badge — a 32px rounded-xl square with tinted background (color + "18") and border (1px solid color + "22"), icon in full accent color:
- Profile: blue #3A86FF
- Settings: purple #B388FF
- Team: green #06D6A0
- Billing: yellow #FFBE0B

Below the groups is a thin divider, then a Log Out button with the same hover pattern and badge style in red (#FF5A5A). Log Out text brightens from rgba(255,90,90,0.70) to rgba(255,90,90,0.95) on hover.

All menu items stagger in with opacity fade (duration 0.15, delay 0.06 + index * 0.04).

Use Framer Motion and Phosphor icons (User, Gear, Users, CreditCard, SignOut, CaretDown — all weight "regular").`,
}
