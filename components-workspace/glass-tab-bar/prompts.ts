import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/glass-tab-bar/index.tsx\`. Export a named function \`GlassTabBar\`.

**File header:** \`'use client'\`

**Imports:**
- \`useState\` from react
- \`motion\` from framer-motion
- \`House, Compass, PlusCircle, ChatCircle, User\` from @phosphor-icons/react

**Constants at module level:**
\`\`\`ts
const TABS = [
  { icon: House,       label: 'Home',     color: '#3A86FF' },
  { icon: Compass,     label: 'Explore',  color: '#FF7B54' },
  { icon: PlusCircle,  label: 'Create',   color: '#06D6A0' },
  { icon: ChatCircle,  label: 'Messages', color: '#FF5C8A' },
  { icon: User,        label: 'Profile',  color: '#B388FF' },
]
\`\`\`

No shared ACCENT constant — each tab uses its own \`color\` field.

STATE: \`active\` (number, default 0), \`hovered\` (number | null)

ROOT: div, \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`
  Background img: \`pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\`
  URL: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866\`

PILL CONTAINER (motion.div):
  className: \`relative isolate flex w-[380px] items-center justify-around rounded-full px-5 py-2.5\`
  style: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.11)', boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)' }
  entrance: initial={{ y: 20 }} animate={{ y: 0 }}, spring stiffness:200 damping:24

  Separate blur layer (child div, NOT on the motion.div itself):
    \`pointer-events-none absolute inset-0 z-[-1] rounded-full\`
    style: { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }
    (Isolating blur from the entrance spring prevents jank)

PER TAB (motion.button, relative, flex cursor-pointer flex-col items-center gap-[3px] px-3 py-1, whileTap scale:0.85):

  1. Active pill (absolute, render only when isActive):
     layoutId="tab-glow", rounded-full, -inset-y-1
     horizontal: i===0 → '-left-5 -right-3' | i===last → '-left-3 -right-5' | else → '-inset-x-3'
     style: bg rgba(255,255,255,0.1), border 1px solid rgba(255,255,255,0.08)
     spring stiffness:350 damping:30

  2. Content wrapper (div, z-10, flex flex-col items-center gap-[3px]):
     style.transform: i===0 → 'translateX(-4px)' | i===last → 'translateX(4px)' | else → undefined
     (corrects centering for asymmetric edge pills)

     Icon badge (motion.div, 36x36, rounded-xl, flex items-center justify-center):
       animate: scale isActive ? 1.15 : 1, y isActive ? -1 : 0
       spring stiffness:400 damping:20
       Notification-style badge — background and border change per state:
         Active:   \`background: \${tab.color}28\`, \`border: 1px solid \${tab.color}44\`
         Hover:    \`background: \${tab.color}12\`, \`border: 1px solid \${tab.color}18\`
         Inactive: \`background: transparent\`, \`border: 1px solid transparent\`
       CSS transition on badge: \`background 0.2s, border-color 0.2s\`
       Child Icon: size 20, weight "regular"
         style.color: isActive → tab.color | isHover → 'rgba(255,255,255,0.7)' | else → 'rgba(255,255,255,0.32)'
         CSS transition: color 0.2s ease

     Label (span, text-[10px] font-medium):
       color: isActive → tab.color | isHover → 'rgba(255,255,255,0.7)' | else → 'rgba(255,255,255,0.32)'
       transition: color 0.2s ease

No dark: Tailwind variants — component is always dark-themed.`,

  V0: `Create a frosted-glass pill tab bar component called GlassTabBar.

**Shape:** A single wide pill (380px, rounded-full) centered on screen over a full-bleed background image at 60% opacity. This is the only element — no phone frame, no extra chrome.

**Glass style:**
- background: rgba(255,255,255,0.07)
- backdropFilter: blur(24px) saturate(1.8)
- border: 1px solid rgba(255,255,255,0.11)
- boxShadow: 0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)

**Tabs (5 items, each with its own accent colour, using Phosphor icons):**
| Icon | Label | Colour |
|------|-------|--------|
| House | Home | #3A86FF |
| Compass | Explore | #FF7B54 |
| PlusCircle | Create | #06D6A0 |
| ChatCircle | Messages | #FF5C8A |
| User | Profile | #B388FF |

Each icon is wrapped in a 36x36 notification-style badge (rounded-xl). The badge background and border change based on state:

**Inactive state:** badge is transparent with transparent border. Icon + label at rgba(255,255,255,0.32).
**Hover state:** badge gets a very subtle tinted background (\`color\` at ~7% opacity) and border (\`color\` at ~9% opacity). Icon + label brighten to rgba(255,255,255,0.7).
**Active state:** badge gets a stronger tinted background (\`color\` at ~16% opacity) and border (\`color\` at ~27% opacity). Icon + label turn the tab's own accent colour. Icon scales to 1.15 and lifts 1px.

There is no shared orange accent — each tab uses its own colour when active.

**Active pill indicator** (slides between tabs via Framer Motion layoutId="tab-glow"):
- White semi-transparent: background rgba(255,255,255,0.1), border 1px solid rgba(255,255,255,0.08)
- Top/bottom: -inset-y-1 (4px beyond button)
- Left/right: -inset-x-3 (12px beyond button) for middle tabs
- **Edge tabs:** first tab extends 20px to the left (-left-5) and 12px to the right (-right-3), last tab is the mirror. This makes the pill flush against the container wall.
- **Content centering fix:** because edge pills are asymmetric (8px difference), shift icon+label 4px inward (translateX(-4px) for first tab, translateX(4px) for last) so content stays centered inside the pill.

**Entrance:** spring slide up from y:20 — stiffness:200 damping:24

Build with Next.js, Tailwind CSS, and Framer Motion. Use Phosphor Icons with weight="regular".`,
}
