import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

Build a scatter-field card component in React + Framer Motion (single file, 'use client').

5 feature cards scattered at different positions and rotations across the container. Each card has a coloured top band with a Phosphor icon, a bold title, and a short description.

Cards (CARD_W=180, CARD_H=220, border-radius 18):
- Rocket   "Launch"      bg #2D2BDB  — idle: {x:-130,y:-60,rotate:-18}
- Palette  "Design"      bg #D45CB3  — idle: {x:-80,y:80,rotate:12}
- ChartBar "Metrics"     bg #1A9C6B  — idle: {x:0,y:-40,rotate:-6}
- Lightbulb "Ideas"      bg #CC8C1A  — idle: {x:90,y:60,rotate:14}
- Users    "Collaborate" bg #C03030  — idle: {x:140,y:-80,rotate:20}

Card anatomy:
- 72px coloured top band (icon centred, white, 28px)
- 6px accent dot + bold title (14px, 800)
- Description (12px, muted, 1.55 line-height)

Interaction: click a card to select it → moves to (0,0), rotate:0, scale:1.06, zIndex:10. Other cards scatter further (position × 1.15) and fade to opacity 0.38, scale 0.88. Click selected card again to deselect.

Springs: scatter → {stiffness:240,damping:24}, focus → {stiffness:340,damping:28}.
whileHover on non-selected, non-faded cards: scale 1.04, slight y lift.
"tap a card to focus" hint text at bottom, fades out when a card is selected.
Subtle dot grid background. Support both light and dark mode (card bg adapts).

## Typography
- Font: project default sans-serif
- Sizes: 6.5px, 7.5px, 9px, 11px, 11.5px, 16px, 18px
- Weights: 400, 600, 700, 800, 900`,

  'Lovable': `Build a scatter-field card component in React + Framer Motion (single file, 'use client').

5 feature cards scattered at different positions and rotations across the container. Each card has a coloured top band with a Phosphor icon, a bold title, and a short description.

Cards (CARD_W=180, CARD_H=220, border-radius 18):
- Rocket   "Launch"      bg #2D2BDB  — idle: {x:-130,y:-60,rotate:-18}
- Palette  "Design"      bg #D45CB3  — idle: {x:-80,y:80,rotate:12}
- ChartBar "Metrics"     bg #1A9C6B  — idle: {x:0,y:-40,rotate:-6}
- Lightbulb "Ideas"      bg #CC8C1A  — idle: {x:90,y:60,rotate:14}
- Users    "Collaborate" bg #C03030  — idle: {x:140,y:-80,rotate:20}

Card anatomy:
- 72px coloured top band (icon centred, white, 28px)
- 6px accent dot + bold title (14px, 800)
- Description (12px, muted, 1.55 line-height)

Interaction: click a card to select it → moves to (0,0), rotate:0, scale:1.06, zIndex:10. Other cards scatter further (position × 1.15) and fade to opacity 0.38, scale 0.88. Click selected card again to deselect.

Springs: scatter → {stiffness:240,damping:24}, focus → {stiffness:340,damping:28}.
whileHover on non-selected, non-faded cards: scale 1.04, slight y lift.
"tap a card to focus" hint text at bottom, fades out when a card is selected.
Subtle dot grid background. Support both light and dark mode (card bg adapts).

## Typography
- Font: project default sans-serif
- Sizes: 6.5px, 7.5px, 9px, 11px, 11.5px, 16px, 18px
- Weights: 400, 600, 700, 800, 900`,

  'V0': `Build a scatter-field card component in React + Framer Motion (single file, 'use client').

5 feature cards scattered at different positions and rotations across the container. Each card has a coloured top band with a Phosphor icon, a bold title, and a short description.

Cards (CARD_W=180, CARD_H=220, border-radius 18):
- Rocket   "Launch"      bg #2D2BDB  — idle: {x:-130,y:-60,rotate:-18}
- Palette  "Design"      bg #D45CB3  — idle: {x:-80,y:80,rotate:12}
- ChartBar "Metrics"     bg #1A9C6B  — idle: {x:0,y:-40,rotate:-6}
- Lightbulb "Ideas"      bg #CC8C1A  — idle: {x:90,y:60,rotate:14}
- Users    "Collaborate" bg #C03030  — idle: {x:140,y:-80,rotate:20}

Card anatomy:
- 72px coloured top band (icon centred, white, 28px)
- 6px accent dot + bold title (14px, 800)
- Description (12px, muted, 1.55 line-height)

Interaction: click a card to select it → moves to (0,0), rotate:0, scale:1.06, zIndex:10. Other cards scatter further (position × 1.15) and fade to opacity 0.38, scale 0.88. Click selected card again to deselect.

Springs: scatter → {stiffness:240,damping:24}, focus → {stiffness:340,damping:28}.
whileHover on non-selected, non-faded cards: scale 1.04, slight y lift.
"tap a card to focus" hint text at bottom, fades out when a card is selected.
Subtle dot grid background. Support both light and dark mode (card bg adapts).

## Typography
- Font: project default sans-serif
- Sizes: 6.5px, 7.5px, 9px, 11px, 11.5px, 16px, 18px
- Weights: 400, 600, 700, 800, 900`,
}
