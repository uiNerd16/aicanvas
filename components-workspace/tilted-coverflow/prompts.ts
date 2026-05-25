import type { Platform } from '../../app/components/ComponentCard'

const SPEC = `Create a React client component named TiltedCoverflow at components-workspace/tilted-coverflow/index.tsx. Write this as a single self-contained file. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. Add the comment // npm install framer-motion right under it. No 'any' types. Use Framer Motion for all animation.

Export a single default function: export default function TiltedCoverflow().

What it looks like and does:
A horizontal cover-flow style fan of 7 portrait cards. The center card is the focus, the other 6 fan out three to the left and three to the right with a size gradient (focused largest, each step outward smaller). Side cards tilt inward in 3D so the row feels like an album-art carousel. Every card breathes on its own period (gentle vertical bob plus a tiny picture-frame rocking rotation). The focused caption animates in word-by-word. The user can shift focus three ways: click any side card, drag the row left or right, or press the left and right arrow keys. A row of 7 dots underneath shows focus position (active dot is wider and brighter). Below the dots is a single hint line: "drag, click, or use the arrow keys".

Root element:
<div className="flex min-h-screen w-full select-none items-center justify-center overflow-hidden bg-[#E8E8DF] px-4 py-12 dark:bg-[#1A1A19]"> wrapping an inner relative max-w-5xl flex column with gap-8.

Inside it, a motion.div stage with style { perspective: '1400px', height: 'clamp(280px, 36vw, 380px)' } that owns drag="x", dragConstraints={{ left: 0, right: 0 }}, dragElastic={0.15}, onDragEnd. This is where horizontal swipes are captured.

Data (exact 7 entries, do not change captions or URLs):
0: caption "Alley Sentinel", image "https://images.unsplash.com/photo-1550532422-378e93ec379c?w=600&h=750&fit=crop&auto=format"
1: caption "Sticker Riot", image "https://images.unsplash.com/photo-1700222720939-60f0e91d691d?w=600&h=750&fit=crop&auto=format"
2: caption "Quiet Vandals", image "https://images.unsplash.com/photo-1597355797858-35ffba85673c?w=600&h=750&fit=crop&auto=format"
3: caption "Soft Beast", image "https://images.unsplash.com/photo-1612486524816-d7aaa8ac7bd6?w=600&h=750&fit=crop&auto=format"
4: caption "City Gaze", image "https://images.unsplash.com/photo-1644424428722-b6f950e4b22d?w=600&h=750&fit=crop&auto=format"
5: caption "Loud Letters", image "https://images.unsplash.com/photo-1581010105372-caf9ed5ab50f?w=600&h=750&fit=crop&auto=format"
6: caption "Color Crash", image "https://images.unsplash.com/photo-1589236095092-1f7ea6f09cdd?w=600&h=750&fit=crop&auto=format"

Slide type: interface Slide { id: number; caption: string; image: string }.

Layout constants (top of file):
- TOTAL = 7
- HALF = 3
- ROTATION_PER_STEP = 14 (degrees per offset step on rotateY)
- ARC_Y = 8 (pixels of downward drop per |offset|)
- GAP_PX = 30 (constant visible pixel gap between adjacent cards)
- SCALE_BY_OFFSET = [1.0, 0.88, 0.76, 0.64] (indexed by absolute offset 0..3)
- SPRING = { type: 'spring', stiffness: 240, damping: 30 } (runtime: click, drag, key)
- MOUNT_SPRING = { type: 'spring', stiffness: 180, damping: 18 } (entrance, slightly bouncier so the focus card has a satisfying settle)
- STAGGER_MS = 0.09

Card sizing: every card shares the same base width, className "absolute aspect-[4/5] w-[clamp(160px,17vw,220px)]". Scale is applied via Framer Motion, not via width changes.

State (useState):
- focus: number, initial 3 (start on the middle slide so the fan is symmetric)
- maxSide: number, initial 3 (collapses to 1 on small screens)
- cardWidth: number, initial 180 (replaced by ResizeObserver measurement after mount)
- mounted: boolean, initial false (flips true in a useEffect after first paint so the entrance transition only runs once)

Refs: cardRef = useRef<HTMLButtonElement | null>(null). Attach ref={slide.id === 0 ? cardRef : undefined} on the first card so the ResizeObserver can measure a single representative card.

Effects:
1. setMounted(true) on mount.
2. matchMedia('(min-width: 640px)'): setMaxSide(match ? 3 : 1) on mount and on change; clean up the listener.
3. ResizeObserver on cardRef.current: read getBoundingClientRect().width and setCardWidth when > 0. Also listen to window 'resize'. The measurement reads the UNTRANSFORMED bounding box (the outer motion.button is the measured node, and its width is set via Tailwind clamp, not via the scale prop, so the value is the raw base width). Clean up observer and listener.
4. window keydown: ArrowRight calls step(1), ArrowLeft calls step(-1), preventDefault on both. Clean up.

Helpers (declared at module scope above the component):
- visibleOffset(cardIndex, focus, total): wraps offsets into the visible range -HALF..+HALF. const half = Math.floor(total / 2); let off = cardIndex - focus; if (off > half) off -= total; if (off < -half) off += total; return off. This is what keeps a 7-card fan always showing 3 left, 1 center, 3 right no matter where focus is.
- buildXPositions(scales: number[], baseWidth: number, gap: number): returns Map<number, number> from offset (-3..3) to translateX pixels. Start with positions.set(0, 0); let cursor = 0; for i = 1..3: const step = (scales[i - 1] / 2 + scales[i] / 2) * baseWidth + gap; cursor += step; positions.set(i, cursor); positions.set(-i, -cursor). This walks outward from the center and accumulates the average of two adjacent scaled half-widths plus the constant pixel gap, then mirrors the result to the left side so the fan is symmetric and adjacent cards never overlap regardless of viewport.

step callback: setFocus((current) => (current + dir + SLIDES.length) % SLIDES.length). Looping is intentional.

handleDragEnd(_, info: PanInfo):
- distance = info.offset.x, velocity = info.velocity.x
- if distance < -80 or velocity < -500: step(1)
- else if distance > 80 or velocity > 500: step(-1)

Per-card rendering (map over SLIDES inside the stage; compute positions once per render via buildXPositions(SCALE_BY_OFFSET, cardWidth, GAP_PX)):

For each slide:
- offset = visibleOffset(slide.id, focus, TOTAL); absOffset = Math.abs(offset)
- hidden = absOffset > maxSide
- isFocus = offset === 0
- scale = SCALE_BY_OFFSET[absOffset] ?? 0.6
- rotateY = -offset * ROTATION_PER_STEP (negative so the side cards tilt their faces toward the viewer)
- translateX = positions.get(offset) ?? 0
- translateY = absOffset * ARC_Y
- mountDelay = (HALF - absOffset) * STAGGER_MS (outer cards land first at delay 0, focus card lands last at delay 0.27s)
- transition = mounted ? SPRING : { ...MOUNT_SPRING, delay: mountDelay }
- breathDuration = 7 + slide.id * 0.6 (per-card period so the breathing loops fall out of phase)
- words = slide.caption.split(' ')

Three DOM layers per card:

Layer 1, outer motion.button. Owns the fan transform (x, y, rotateY, scale) and the click hit target. NO visual chrome on this element. className "absolute aspect-[4/5] w-[clamp(160px,17vw,220px)]". style { transformStyle: 'preserve-3d', transformOrigin: 'center center', pointerEvents: hidden ? 'none' : 'auto', cursor: isFocus ? 'grab' : 'pointer', zIndex: TOTAL - absOffset }. initial={{ opacity: 0, scale: 0.45, y: 70, x: 0, rotateY: 0 }}. animate={{ x: translateX, y: translateY, rotateY, scale, opacity: hidden ? 0 : 1 }}. transition={transition}. whileTap={isFocus ? { cursor: 'grabbing' } : undefined}. onClick: event.preventDefault(); if (!hidden && !isFocus) setFocus(slide.id). type="button". aria-label={slide.caption}.

Layer 2, middle motion.div. Owns the visual chrome AND the breathing loop, so the entire card moves as one unit. className "relative h-full w-full overflow-hidden rounded-[20px] ring-1 ring-black/10 dark:ring-white/10". style.boxShadow is a ternary on isFocus: focused = '0 30px 60px rgba(0,0,0,0.35), 0 12px 24px rgba(0,0,0,0.18)'; else '0 14px 30px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.12)'. animate={{ y: [0, -12, 0, 10, 0], rotate: [0, 1.5, 0, -1.5, 0] }}. transition={{ duration: breathDuration, repeat: Infinity, ease: 'easeInOut' }}.

Layer 3, content inside the breathing div:
- <img src={slide.image} alt={slide.caption} loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
- Caption block: <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end px-4 pb-3 pt-12">
  - Gradient overlay sibling (aria-hidden, className="absolute inset-x-0 bottom-0 h-2/3", style.background = 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0) 100%)'). The gradient covers the bottom two thirds and fades fully to transparent at the top so the photo above it is undisturbed. No border, no backdrop blur, no pill.
  - <span className="relative text-center leading-tight text-white font-medium" style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.25rem)', textShadow: '0 1px 8px rgba(0,0,0,0.45)' }}> containing the caption words.
  - On the focused card, render each word as <motion.span key={\`\${focus}-\${i}\`} className="inline-block" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.42, ease: [0.2, 0.65, 0.3, 1] }}>{word}{i < words.length - 1 ? ' ' : ''}</motion.span>. The key includes focus so the animation replays every time focus lands here.
  - On non-focused cards, render plain <span key={i} className="inline-block">{word}{i < words.length - 1 ? ' ' : ''}</span>. This is important: using motion.span on non-focused cards would re-trigger the entrance on every focus change and cause a flicker.

Below the stage (still inside the max-w-5xl column), render a small column with gap-3:
- Dot row: 7 motion.button dots, className "h-1.5 rounded-full bg-[#21211F] dark:bg-[#FAFAF0]", animate={{ width: isCurrent ? 22 : 6, opacity: isCurrent ? 1 : 0.35 }}, transition={{ type: 'spring', stiffness: 400, damping: 30 }}, aria-label={\`Focus \${slide.caption}\`}, onClick sets focus to that id.
- Hint line: <p className="text-xs tracking-wide text-[#666662] dark:text-[#9E9E98]">drag, click, or use the arrow keys</p>.

Mobile (matchMedia('(min-width: 640px)') = false): maxSide becomes 1, so only the focus card plus 1 neighbour on each side render visibly (3 visible total). Off-screen cards animate opacity to 0 and set pointer-events none. Breathing and word-fade still apply to visible cards.

Why the layer split matters: putting the breathing animation on the OUTER button would conflict with the fan transform on every render and the per-card translateX would jitter as breathing values changed. Keeping the fan on the outer button and the breath on the inner div means the two animations compose cleanly, and the visual chrome (rounded corners, overflow clip, ring, shadow) is attached to the layer that actually moves with the breath so the card never visually decouples from its frame.

Spring choices: MOUNT_SPRING is intentionally a touch bouncy so the focus card lands with a satisfying micro-overshoot the first time. Every subsequent transition (click, drag, arrow) uses the snappy SPRING with no overshoot, which is what you want for repeated interaction.

Theme: works in both light and dark. Light background #E8E8DF, dark background #1A1A19. The cards themselves are full-bleed photos with white text and a dark gradient, so they read identically in both themes. Hint text and dot colors flip on .dark.

TypeScript strict, no any, no type assertions. Use 'as const' on the spring type fields if needed. Clean up every effect (matchMedia listener, ResizeObserver, resize listener, keydown listener).`

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Verify this project has Tailwind CSS v4, TypeScript, and React set up. If anything is missing, install via the shadcn CLI:
  npx shadcn@latest init

---

${SPEC}`,

  'Lovable': SPEC,

  'V0': SPEC,
}
