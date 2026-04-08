import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/glass-card/index.tsx\`. Export a named function \`GlassCard\`.

**File header:** \`'use client'\`

**Imports:**
- \`useRef\` from react
- \`motion, useMotionValue, useMotionTemplate, useTransform, useSpring\` from framer-motion
- \`ChartLineUp, Lightning, ShieldCheck, ArrowRight\` from @phosphor-icons/react
- \`type { Icon }\` from @phosphor-icons/react

**Constants at module level:**
\`\`\`ts
const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'

const CARDS: { title: string; subtitle: string; color: string; gradient: string; cta: string; Icon: Icon }[] = [
  { title: 'Analytics',  subtitle: 'Real-time metrics and insights for your application.',   color: '#5B8FF9', gradient: '#5B8FF9, #A78BFA', cta: 'View Dashboard',  Icon: ChartLineUp },
  { title: 'Automation', subtitle: 'Streamline your workflows with intelligent triggers.',    color: '#FF6BF5', gradient: '#FF6BF5, #FF6680', cta: 'Create Workflow',  Icon: Lightning   },
  { title: 'Security',   subtitle: 'Enterprise-grade protection for your data.',             color: '#FF7B54', gradient: '#FF7B54, #FFBE0B', cta: 'View Report',      Icon: ShieldCheck },
]
\`\`\`

**Internal component \`GlassCardItem\`** — props: \`{ title: string; subtitle: string; color: string; gradient: string; cta: string; Icon: Icon }\`

All motion values must be declared at the top of the function body (never inline inside JSX):
1. \`const cardRef = useRef<HTMLDivElement>(null)\`
2. \`const mouseX = useMotionValue(0.5)\`
3. \`const mouseY = useMotionValue(0.5)\`
4. \`const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 20 })\`
5. \`const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 })\`
6. \`const glareX = useTransform(mouseX, [0, 1], [0, 100])\`
7. \`const glareY = useTransform(mouseY, [0, 1], [0, 100])\`
8. \`const glareBackground = useMotionTemplate\\\`radial-gradient(circle at \${glareX}% \${glareY}%, rgba(255,255,255,0.4), transparent 50%)\\\`\`

Event handlers:
- \`handleMouse(e: React.MouseEvent)\`: reads \`cardRef.current!.getBoundingClientRect()\`, sets \`mouseX\` and \`mouseY\` as (clientX - rect.left) / rect.width and (clientY - rect.top) / rect.height
- \`handleLeave()\`: sets mouseX and mouseY back to 0.5

**JSX structure:**

Outer \`motion.div\` (the card wrapper):
- \`ref={cardRef}\`, \`onMouseMove={handleMouse}\`, \`onMouseLeave={handleLeave}\`
- \`style={{ rotateX, rotateY, transformPerspective: 800 }}\`
- className: \`relative w-64 cursor-pointer overflow-hidden rounded-3xl p-[1px]\`

Inside the outer card, first child — rotating border gradient (\`motion.div\`):
- className: \`absolute inset-0 rounded-3xl opacity-30\`
- \`style={{ background: \`linear-gradient(135deg, \${gradient}, transparent 60%)\` }}\`
- \`animate={{ rotate: [0, 360] }}\`, \`transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}\`

Second child — card body (plain \`div\`):
- className: \`relative rounded-3xl p-6\`
- inline styles: \`background: 'rgba(255, 255, 255, 0.08)'\`, \`backdropFilter: 'blur(24px) saturate(1.8)'\`, \`WebkitBackdropFilter\` same value, \`boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)'\`

Inside the card body:
1. Glare \`motion.div\`: className \`pointer-events-none absolute inset-0 rounded-3xl opacity-40\`, \`style={{ background: glareBackground }}\`
2. Icon badge \`motion.div\` — notification-style tinted badge (NOT gradient-filled): className \`mb-5 flex h-12 w-12 items-center justify-center rounded-xl\`, inline style \`background: \`\${color}18\`\` (accent at ~9% opacity), \`border: \`1px solid \${color}22\`\` (accent at ~13% opacity). No boxShadow. \`whileHover={{ scale: 1.1, rotate: 5 }}\`, \`transition={{ type: 'spring', stiffness: 400, damping: 15 }}\`. Child: \`<Icon size={22} weight="regular" style={{ color }} />\` — icon rendered in the card's accent colour, not white.
3. \`<h3>\` className \`mb-2 text-base font-semibold text-white/90\`
4. \`<p>\` className \`mb-5 text-sm leading-relaxed text-white/40\`
5. CTA \`motion.button\`: \`whileHover={{ scale: 1.03 }}\`, \`whileTap={{ scale: 0.97 }}\`, className \`flex w-full items-center justify-between rounded-2xl px-4 py-3\`, inline styles: background gradient tint (color1+40 → color2+28), border color1+55, boxShadow color1+25; child \`<span>\` for label in color1+ee, child \`<ArrowRight size={16} weight="regular">\` in color1+cc
6. Top edge highlight: absolute 1px div, \`left-6 right-6 top-0\`, \`linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)\`

**\`GlassCard\` root element:**
- className: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\`
- Child 1: \`<img src={BACKGROUND} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />\`
- Child 2: \`<div className="relative flex flex-wrap items-center justify-center gap-6 px-6">\` containing \`{CARDS.map(card => <GlassCardItem key={card.title} {...card} />)}\`

No entrance animations. No dark: Tailwind variants — component is always dark-themed.`,

  V0: `Create a glass card component called GlassCard that shows three frosted-glass cards side by side against a vivid background image.

The background is a full-bleed photo of an ethereal orange flower (ImageKit URL: https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133, opacity 60%). The cards float on top of it with a real glass effect.

Each card has:
- A notification-style icon badge — a 48x48 rounded-xl box with a very subtle tinted background and border in the card's accent colour, with the icon rendered in that same accent colour (not white)
- A bold title and a short muted subtitle
- A tinted CTA button at the bottom with a right-arrow icon

The three cards are:
1. Analytics — accent colour #5B8FF9, gradient pair #5B8FF9 to #A78BFA, ChartLineUp icon, "View Dashboard" button
2. Automation — accent colour #FF6BF5, gradient pair #FF6BF5 to #FF6680, Lightning icon, "Create Workflow" button
3. Security — accent colour #FF7B54, gradient pair #FF7B54 to #FFBE0B, ShieldCheck icon, "View Report" button

The icon badge for each card uses the card's accent colour at very low opacity for the background (roughly 9%) and an even subtler border (roughly 13% opacity). The icon inside is rendered in the full accent colour. On hover the badge scales to 1.1 and rotates 5° with a springy feel.

Glass effect on each card body: white at 8% opacity, backdrop blur 24px with saturation 1.8, a subtle outer shadow, and a 1px white inner top border. There is also a 1px gradient line running along the very top edge of the card body to add a highlight.

Each card also has a rotating gradient border (the card's gradient pair at 30% opacity) that slowly spins 360° over 20 seconds on a continuous loop.

On mouse hover the card tilts in 3D — rotating up to 8° on both axes following the cursor position. A glare highlight (a soft white radial gradient) also tracks the mouse across the card surface, so it looks like light reflecting off glass.

The CTA button scales up very slightly on hover.

No entrance animations — cards appear instantly when the page loads.

Build this with Next.js, Tailwind CSS, and Framer Motion. Use Phosphor Icons (ChartLineUp, Lightning, ShieldCheck, ArrowRight) with weight="regular".`,
}
