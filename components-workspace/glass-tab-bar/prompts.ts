import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a frosted-glass pill tab bar component.

**Shape:** A single wide pill (380px, rounded-full) centered on screen. This is the only element — no phone frame, no extra chrome.

**Glass style:**
- background: rgba(255,255,255,0.07)
- backdropFilter: blur(24px) saturate(1.8)
- border: 1px solid rgba(255,255,255,0.11)
- boxShadow: 0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)

**Tabs (5 items, using Phosphor icons):**
| Icon | Label |
|------|-------|
| House | Home |
| Compass | Explore |
| PlusCircle | Create |
| ChatCircle | Messages |
| User | Profile |

**Inactive state:** icon + label at rgba(255,255,255,0.32)
**Hover state:** icon + label brighten to rgba(255,255,255,0.7) — color transition only, no background
**Active state:** icon + label turn orange — rgba(255,155,50,1) — icon scales to 1.15 and lifts 1px

**Active pill indicator** (slides between tabs via Framer Motion layoutId="tab-glow"):
- White semi-transparent: background rgba(255,255,255,0.1), border 1px solid rgba(255,255,255,0.08)
- Top/bottom: -inset-y-1 (4px beyond button)
- Left/right: -inset-x-3 (12px beyond button) for middle tabs
- **Edge tabs:** first tab extends 20px to the left (-left-5) and 12px to the right (-right-3), last tab is the mirror. This makes the pill flush against the container wall.
- **Content centering fix:** because edge pills are asymmetric (8px difference), shift icon+label 4px inward (translateX(-4px) for first tab, translateX(4px) for last) so content stays centered inside the pill.

**Entrance:** spring slide up from y:20, opacity:0 — stiffness:200 damping:24`,

  Bolt: `Build a GlassTabBar component. Named export, 'use client'.

\`\`\`ts
const TABS = [
  { icon: House,       label: 'Home'     },
  { icon: Compass,     label: 'Explore'  },
  { icon: PlusCircle,  label: 'Create'   },
  { icon: ChatCircle,  label: 'Messages' },
  { icon: User,        label: 'Profile'  },
]

const ACCENT = 'rgba(255, 155, 50, 1)'
\`\`\`

STATE: active (number, default 0), hovered (number|null)

CONTAINER: motion.div, w-[380px], rounded-full, flex items-center justify-around, px-5 py-2.5
  style: { background:'rgba(255,255,255,0.07)', backdropFilter:'blur(24px) saturate(1.8)',
           border:'1px solid rgba(255,255,255,0.11)',
           boxShadow:'0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)' }
  entrance: initial y:20 opacity:0 → animate y:0 opacity:1, spring stiffness:200 damping:24

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

    ICON (motion.div):
      animate: scale isActive?1.15:1, y isActive?-1:0
      spring stiffness:400 damping:20
      Icon size:24, color: isActive→ACCENT | isHover→white/70 | else→white/32

    LABEL (span, text-[10px] font-medium):
      color: isActive→ACCENT | isHover→white/70 | else→white/32
      transition: color 0.2s ease`,

  Lovable: `I want a beautiful frosted-glass tab bar — just the bar itself, no phone frame.

It's a wide pill (380px) centered on screen with a frosted glass effect (blur, semi-transparent white, subtle border and shadow). Inside are 5 navigation tabs: Home, Explore, Create, Messages, Profile — each with a Phosphor icon above a small label.

**The active tab** turns orange (a warm amber-orange color) and the icon scales up slightly. A soft white semi-transparent pill slides smoothly between tabs as you click — it uses Framer Motion's layoutId so it animates fluidly.

**Smart edge behaviour:** when the first tab (Home) or last tab (Profile) is selected, the pill extends to touch the container's left or right wall, making it look perfectly integrated with the pill shape. The icon and label are shifted slightly inward so they stay visually centered inside this asymmetric pill.

**Hover:** hovering a tab brightens the icon and text to near-white. No background on hover — just the text/icon change.

**On load:** the whole bar slides up from below with a spring animation.

The background is a full-bleed image with 60% opacity, and the bar floats centered over it.`,

  'Claude Code': `Create components-workspace/glass-tab-bar/index.tsx

\`\`\`ts
'use client'
// Named export: GlassTabBar
// Imports: useState, motion from framer-motion, House/Compass/PlusCircle/ChatCircle/User from @phosphor-icons/react
\`\`\`

CONSTANTS:
\`\`\`ts
const TABS = [
  { icon: House,       label: 'Home'     },
  { icon: Compass,     label: 'Explore'  },
  { icon: PlusCircle,  label: 'Create'   },
  { icon: ChatCircle,  label: 'Messages' },
  { icon: User,        label: 'Profile'  },
]
const ACCENT = 'rgba(255, 155, 50, 1)'  // ← change this to retheme
\`\`\`

STATE: active (number, default 0), hovered (number|null)

ROOT: div, h-full w-full, flex items-center justify-center, bg-sand-950, relative overflow-hidden
  Background img: absolute inset-0, object-cover, opacity-60, pointer-events-none

PILL (motion.nav):
  w-[380px] rounded-full flex items-center justify-around px-5 py-2.5
  style: glass effect (rgba(255,255,255,0.07) bg, blur(24px), border rgba(255,255,255,0.11), inset highlight)
  entrance: y:20→0 opacity:0→1, spring stiffness:200 damping:24

PER TAB (motion.button, relative, flex flex-col items-center gap-[3px] px-3 py-1, whileTap scale:0.85):

  1. Active pill (absolute, render when isActive):
     layoutId="tab-glow", -inset-y-1, rounded-full
     horizontal: i===0 → '-left-5 -right-3' | i===last → '-left-3 -right-5' | else → '-inset-x-3'
     style: bg rgba(255,255,255,0.1), border rgba(255,255,255,0.08)
     spring stiffness:350 damping:30

  2. Content wrapper (div, z-10, flex flex-col items-center gap-[3px]):
     style.transform: i===0→'translateX(-4px)' | i===last→'translateX(4px)' | else→undefined
     (corrects centering for asymmetric edge pills)

     Icon (motion.div → Icon component, size:24):
       animate scale:1.15 y:-1 when active, else 1/0
       color: active→ACCENT | hover→rgba(255,255,255,0.7) | else→rgba(255,255,255,0.32)
       CSS transition: color 0.2s ease

     Label (span, text-[10px] font-medium):
       same color logic as icon`,

  Cursor: `Build components-workspace/glass-tab-bar/index.tsx — a frosted-glass pill tab bar.

Named export: GlassTabBar. 'use client'. No phone frame — just the bar.

---

EDITABLE CONSTANTS (top of file):
\`\`\`ts
const TABS = [
  { icon: House,       label: 'Home'     },
  { icon: Compass,     label: 'Explore'  },
  { icon: PlusCircle,  label: 'Create'   },
  { icon: ChatCircle,  label: 'Messages' },
  { icon: User,        label: 'Profile'  },
]
const ACCENT = 'rgba(255, 155, 50, 1)'
\`\`\`

---

GLASS STYLE (apply to the pill container):
\`\`\`ts
{
  background: 'rgba(255, 255, 255, 0.07)',
  backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
  border: '1px solid rgba(255, 255, 255, 0.11)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)',
}
\`\`\`

PILL CONTAINER (motion.div):
  w-[380px] rounded-full flex items-center justify-around px-5 py-2.5
  Entrance: y:20 opacity:0 → y:0 opacity:1, spring stiffness:200 damping:24

PER TAB — motion.button (relative flex flex-col items-center gap-[3px] px-3 py-1, whileTap scale:0.85):

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

    Icon (motion.div, size:24):
      animate scale:1.15 y:-1 when active | spring stiffness:400 damping:20
      color: active→ACCENT | hover→rgba(255,255,255,0.7) | rest→rgba(255,255,255,0.32)
      CSS transition: color 0.2s ease

    Label (span text-[10px] font-medium):
      Same color logic as icon`,
}
