import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/glass-toggle/index.tsx — a glassmorphism toggle settings panel.

Structure:
- Root: relative div, h-full w-full, overflow-hidden, bg-sand-950
- Background: <img> absolute inset-0, object-cover, opacity-60 (ethereal flower from ImageKit)
- Panel: motion.div w-[320px] rounded-3xl px-7 py-7, glass styles

Glass: bg rgba(255,255,255,0.06), backdropFilter blur(24px) saturate(1.6), border 1px rgba(255,255,255,0.1), boxShadow deep + inset highlight. Top: 1px absolute gradient highlight line.

Header: "Preferences" title (text-base font-semibold text-white/80).

Toggle subcomponent (label: string, defaultOn: boolean, color: string, delay: number):
- const [on, setOn] = useState(defaultOn)
- const progress = useSpring(defaultOn ? 1 : 0, {stiffness:300, damping:22})
- useEffect(() => progress.set(on ? 1 : 0), [on, progress])
- useTransform derivatives:
  - trackBg: ['rgba(255,255,255,0.08)', \`\${color}44\`]
  - trackBorder: ['rgba(255,255,255,0.1)', \`\${color}55\`]
  - thumbX: [2, 26]
  - thumbShadow: ['0 2px 8px rgba(0,0,0,0.3)', \`0 2px 16px \${color}44\`]
- Left side: label text-sm white/60 + "On"/"Off" text-[11px] (colored when on, white/25 when off)
- Right side: motion.button h-8 w-14 rounded-full, whileTap scale:0.95
- Glow div: absolute inset-0, radial-gradient at 75% 50%, opacity 0.3 when on
- Thumb: absolute h-6 w-6 rounded-full, white gradient (brighter when on), inner highlight

5 toggles with 1px dividers:
- "Dark Mode" #FF6BF5 defaultOn:true delay:0.1
- "Notifications" #06D6A0 defaultOn:true delay:0.15
- "Auto-Update" #FFBE0B defaultOn:false delay:0.2
- "Analytics" #FF7B54 defaultOn:false delay:0.25
- "Haptic Feedback" #3A86FF defaultOn:true delay:0.3

Entry: panel springs from y:20 scale:0.96. Each toggle staggers from x:-16.`,

  V0: `Create a settings panel with 5 toggle switches in Apple glassmorphism style on a dark background with a full-bleed ethereal flower photo (loaded from a URL, opacity 60%, object-cover).

The panel is a 320px-wide frosted glass card: rgba(255,255,255,0.06) background, backdrop-blur 24px with saturate 1.6, 1px white/10% border, deep box-shadow, and a thin gradient highlight along the top edge. It enters with a spring scale-up animation.

Header: "Preferences" title (text-base font-semibold text-white/80).

Five toggles, each separated by a thin divider line (rgba(255,255,255,0.06)):
1. Dark Mode — pink #FF6BF5 — default ON
2. Notifications — green #06D6A0 — default ON
3. Auto-Update — yellow #FFBE0B — default OFF
4. Analytics — coral #FF7B54 — default OFF
5. Haptic Feedback — blue #3A86FF — default ON

Each toggle has:
- A label on the left with an "On"/"Off" state indicator below it (colored when on, dimmed when off)
- A pill-shaped switch (h-8 w-14) on the right with a sliding white thumb (h-6 w-6)
- When ON: track fills with the toggle's accent color (44% opacity), border tints to match, colored radial glow appears behind the thumb, thumb brightens, colored shadow
- When OFF: dark track (white/8%), dim thumb, no glow
- Spring-physics animation for the thumb slide (stiffness 300, damping 22)
- Staggered entrance animation for each row

The thumb slides from left (x:2) to right (x:26) via a spring-driven MotionValue — not useState for animation values. Track background and border color also animate via spring-driven useTransform.

Build with React, TypeScript, Tailwind CSS, and Framer Motion.`,
}
