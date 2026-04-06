import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
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

  Bolt: `Build a GlassTabBar component. Named export, 'use client'.

\`\`\`ts
const TABS = [
  { icon: House,       label: 'Home',     color: '#3A86FF' },
  { icon: Compass,     label: 'Explore',  color: '#FF7B54' },
  { icon: PlusCircle,  label: 'Create',   color: '#06D6A0' },
  { icon: ChatCircle,  label: 'Messages', color: '#FF5C8A' },
  { icon: User,        label: 'Profile',  color: '#B388FF' },
]
\`\`\`

No shared ACCENT constant — each tab uses its own \`color\`.

STATE: active (number, default 0), hovered (number|null)

CONTAINER: motion.div, w-[380px], rounded-full, flex items-center justify-around, px-5 py-2.5
  style: { background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.11)',
           boxShadow:'0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)' }
  Separate blur layer (non-animating, isolated from entrance spring):
    pointer-events-none absolute inset-0 z-[-1] rounded-full
    style: { backdropFilter:'blur(24px) saturate(1.8)', WebkitBackdropFilter same }
  entrance: initial y:20 → animate y:0, spring stiffness:200 damping:24

EACH TAB (motion.button):
  - onClick → setActive(i), onHoverStart/End → setHovered
  - className: relative flex cursor-pointer flex-col items-center gap-[3px] px-3 py-1
  - whileTap scale:0.85

  ACTIVE PILL (render when isActive, inside button, absolute):
    layoutId="tab-glow", rounded-full, -inset-y-1
    Horizontal class by position:
      i === 0            → '-left-5 -right-3'   (flush left with container)
      i === TABS.length-1 → '-left-3 -right-5'   (flush right with container)
      else               → '-inset-x-3'
    style: { background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.08)' }
    transition: spring stiffness:350 damping:30

  CONTENT WRAPPER (div, z-10, flex flex-col items-center gap-[3px]):
    style.transform: i===0 ? 'translateX(-4px)' : i===TABS.length-1 ? 'translateX(4px)' : undefined
    (centers content within asymmetric edge pills)

    ICON BADGE (motion.div, 36x36, rounded-xl, flex items-center justify-center):
      animate: scale isActive?1.15:1, y isActive?-1:0
      spring stiffness:400 damping:20
      Notification-style badge states (using tab.color):
        Active:   background \`\${color}28\`, border \`1px solid \${color}44\`
        Hover:    background \`\${color}12\`, border \`1px solid \${color}18\`
        Inactive: background transparent, border 1px solid transparent
      CSS transition: background 0.2s, border-color 0.2s
      Icon size:20, weight:"regular"
        color: isActive → tab.color | isHover → rgba(255,255,255,0.7) | else → rgba(255,255,255,0.32)
        CSS transition: color 0.2s ease

    LABEL (span, text-[10px] font-medium):
      color: isActive → tab.color | isHover → rgba(255,255,255,0.7) | else → rgba(255,255,255,0.32)
      transition: color 0.2s ease`,

  Lovable: `I want a beautiful frosted-glass tab bar — just the bar itself, no phone frame.

It's a wide pill (380px) centered on screen with a frosted glass effect (blur, semi-transparent white, subtle border and shadow). Inside are 5 navigation tabs: Home, Explore, Create, Messages, Profile — each with a Phosphor icon sitting inside a small notification-style badge above a tiny label.

Each tab has its own personality through colour — Home glows in a crisp blue (#3A86FF), Explore in warm coral (#FF7B54), Create in fresh mint green (#06D6A0), Messages in playful pink (#FF5C8A), and Profile in soft lavender (#B388FF). There is no single shared accent colour — each tab lights up in its own hue.

**The active tab's** icon badge gets a soft tinted background and border in its own colour — it looks like a subtle notification bubble. The icon and label turn that tab's colour, and the icon scales up with a little lift. A soft white semi-transparent pill slides smoothly between tabs as you click — it uses Framer Motion's layoutId so it animates fluidly.

**Hover:** when you hover over an inactive tab, the icon badge gets the faintest hint of a coloured background — barely there, like a breath of colour. The icon and text brighten to near-white.

**Inactive:** the badge background is fully transparent — just the muted icon floating there.

**Smart edge behaviour:** when the first tab (Home) or last tab (Profile) is selected, the pill extends to touch the container's left or right wall, making it look perfectly integrated with the pill shape. The icon and label are shifted slightly inward so they stay visually centered inside this asymmetric pill.

**On load:** the whole bar slides up from below with a spring animation.

The background is a full-bleed image with 60% opacity, and the bar floats centered over it. Build with Next.js, Tailwind CSS, and Framer Motion. Use Phosphor Icons with regular weight.`,

  'Claude Code': `Create \`components-workspace/glass-tab-bar/index.tsx\`. Export a named function \`GlassTabBar\`.

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

  Cursor: `File: \`components-workspace/glass-tab-bar/index.tsx\`

- \`'use client'\` at top
- Export named function \`GlassTabBar\`
- Imports: \`useState\` from react, \`motion\` from framer-motion, \`House, Compass, PlusCircle, ChatCircle, User\` from @phosphor-icons/react

---

CONSTANTS (top of file):
\`\`\`ts
const TABS = [
  { icon: House,       label: 'Home',     color: '#3A86FF' },
  { icon: Compass,     label: 'Explore',  color: '#FF7B54' },
  { icon: PlusCircle,  label: 'Create',   color: '#06D6A0' },
  { icon: ChatCircle,  label: 'Messages', color: '#FF5C8A' },
  { icon: User,        label: 'Profile',  color: '#B388FF' },
]
\`\`\`

No shared ACCENT constant — each tab uses its own \`color\`.

---

GLASS STYLE (on the pill container, NOT the blur layer):
\`\`\`ts
{
  background: 'rgba(255, 255, 255, 0.07)',
  border: '1px solid rgba(255, 255, 255, 0.11)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)',
}
\`\`\`

Blur is on a separate child div (\`pointer-events-none absolute inset-0 z-[-1] rounded-full\`):
\`\`\`ts
{ backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }
\`\`\`
(Isolating blur from the entrance spring prevents jank)

PILL CONTAINER (motion.div):
  \`relative isolate flex w-[380px] items-center justify-around rounded-full px-5 py-2.5\`
  Entrance: initial y:20 → animate y:0, spring stiffness:200 damping:24

PER TAB — motion.button (relative flex cursor-pointer flex-col items-center gap-[3px] px-3 py-1, whileTap scale:0.85):

  Active indicator pill (only when active===i):
    motion.div, layoutId="tab-glow", absolute, -inset-y-1, rounded-full
    Horizontal inset depends on position:
      first tab  → -left-5 -right-3   // flush against left container wall
      last tab   → -left-3 -right-5   // flush against right container wall
      middle     → -inset-x-3
    style: rgba(255,255,255,0.1) bg + rgba(255,255,255,0.08) border
    spring transition stiffness:350 damping:30

  Content div (z-10, flex flex-col items-center gap-[3px]):
    translateX(-4px) for first tab, translateX(4px) for last tab, else none
    // Why: edge pills are 8px asymmetric → shift content 4px to stay centered

    Icon badge (motion.div, 36x36, rounded-xl, flex items-center justify-center):
      animate scale:1.15 y:-1 when active | spring stiffness:400 damping:20
      Notification-style badge backgrounds:
        Active:   bg \`\${color}28\`, border \`1px solid \${color}44\`
        Hover:    bg \`\${color}12\`, border \`1px solid \${color}18\`
        Inactive: bg transparent, border 1px solid transparent
      CSS transition: background 0.2s, border-color 0.2s
      Child Icon: size 20, weight "regular"
        color: active → tab.color | hover → rgba(255,255,255,0.7) | rest → rgba(255,255,255,0.32)
        CSS transition: color 0.2s ease

    Label (span text-[10px] font-medium):
      Same color logic as icon (tab.color when active, not a shared accent)

ROOT: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`
  Background img: absolute inset-0, object-cover, opacity-60, pointer-events-none
  Always dark-themed (no dark: variants).`,
}
