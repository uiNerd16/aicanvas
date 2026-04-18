import type { Platform } from '../../app/components/ComponentCard'

const SPEC = `Create a React client component named \`StickerWall\` — a full-viewport physical feedback wall where text cards and emoji stickers pile up, collide, and can be dragged/tossed with real physics. A centered input lets visitors submit a note that falls in from above and joins the pile.

Write this as a single self-contained 'use client' TypeScript file. Inline everything, no helper files. Default export \`StickerWall\`. No 'any' types.

## Dependencies
- npm install matter-js framer-motion
- npm install -D @types/matter-js
- Tailwind CSS v4 (CSS-based @theme inline, NOT v3 tailwind.config.ts)
- Must dynamic-import matter-js inside an effect so SSR doesn't break.

## Root layout
- Outer wrapper: \`flex h-full w-full items-center justify-center\` with inline style \`background: bg\` where bg swaps with theme. The component fills its parent's height — the parent must define a height (e.g. \`h-screen\`, \`h-[480px]\`, or a flex chain). Do NOT use \`min-h-screen\`: the matter.js floor wall is placed at the canvas's bottom edge; if the rendered canvas is taller than the visible container, bodies pile up below the fold.
- Inside: a \`motion.div\` (framer-motion) containerRef, \`relative h-full w-full overflow-hidden\`, inline \`style={{ background: bg, touchAction: 'none' }}\`. Mount animation: \`initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}\`.
- Fills with: a \`<canvas>\` (absolute inset-0, display block, 100% w/h) + a \`<form>\` overlay (pointer-events-none, absolute inset-0, flex flex-col items-center justify-center gap-5, paddingLeft/Right 16, paddingBottom '18vh').

## Theme
- Dark bg: #0F0F12. Light bg: #F5F1E8.
- Detect dark via \`document.documentElement.classList.contains('dark')\` PLUS check \`containerRef.current.closest('[data-card-theme]')\` first and use its .dark class if present. Install a MutationObserver on documentElement (and the card wrapper if found) watching the 'class' attribute. Disconnect on cleanup.
- Seed the initial state by reading the same during render (guarded by typeof window).

## Header (inside the form, non-interactive, pointer-events-none)
Centered column of 2 elements, gap-2, text-center, select-none:
- h2 "Feedback Wall" — color \`rgba(255,255,255,0.95)\` dark / \`rgba(17,24,39,0.95)\` light. fontSize \`clamp(32px, 6vw, 56px)\`, fontWeight 800, letterSpacing -0.02em, lineHeight 1, margin 0. textShadow \`0 2px 20px rgba(0,0,0,0.4)\` dark / \`0 2px 20px rgba(17,24,39,0.08)\` light.
- p subtitle "Drop a note, toss an emoji, drag anything around. Real physics, no rules — just leave your mark on the wall." — color \`rgba(255,255,255,0.7)\` / \`rgba(17,24,39,0.7)\`. 16px, weight 500, letterSpacing -0.005em, lineHeight 1.45, maxWidth 46ch.

## Input pill (pointer-events-auto)
\`flex w-full max-w-md items-center gap-2 rounded-full p-1\`.
- Background: \`rgba(255,255,255,0.1)\` dark / \`rgba(17,24,39,0.06)\` light.
- Border: 2px solid \`rgba(255,255,255,0.7)\` dark / \`rgba(255,255,255,0.9)\` light.
- Base shadow: \`0 6px 14px rgba(0,0,0,0.25), 0 2px 0 rgba(0,0,0,0.08)\` dark / \`0 6px 14px rgba(17,24,39,0.12), 0 2px 0 rgba(17,24,39,0.04)\` light.
- CSS \`transition: background 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease\`.
- :hover → bg \`rgba(255,255,255,0.16)\` / \`rgba(17,24,39,0.1)\`, border brighten (\`rgba(255,255,255,0.85)\` / \`rgba(17,24,39,0.6)\`), \`transform: translateY(-1px)\`.
- :focus-within → bg \`rgba(255,255,255,0.22)\` / \`rgba(17,24,39,0.14)\`, border \`#FFFFFF\` / \`#111827\`, \`transform: translateY(-1px) scale(1.015)\`, boxShadow adds a soft ring: \`0 10px 24px rgba(0,0,0,0.3), 0 0 0 4px rgba(255,255,255,0.12)\` (dark) / \`0 10px 24px rgba(17,24,39,0.15), 0 0 0 4px rgba(17,24,39,0.08)\` (light).
- :active → \`transform: translateY(0) scale(0.99)\`.

Inside: an \`<input type="text" maxLength={80} placeholder="Leave feedback…" />\` — flex-1, transparent bg, px-4 py-2, 14px, weight 500, outline-none. Text color \`rgba(255,255,255,0.95)\` / \`rgba(17,24,39,0.92)\`. Placeholder color \`rgba(255,255,255,0.5)\` / \`rgba(17,24,39,0.45)\` via a scoped \`<style>\` block with a class.

## Send button (keyboard-key style)
\`<button type="submit">Send</button>\` — \`flex items-center rounded-2xl px-5 py-2 text-sm tracking-wide\`, fontWeight 700.
- Background \`#8A9CF4\` (periwinkle). Text \`#111827\`. Border \`1px solid rgba(255,255,255,0.12)\`.
- Base shadow (3D key): \`0 4px 0 rgba(0,0,0,0.45), 0 8px 16px rgba(0,0,0,0.3)\` dark / \`0 4px 0 rgba(17,24,39,0.35), 0 8px 16px rgba(17,24,39,0.18)\` light.
- :hover → \`transform: translateY(-1px)\`, shadow deepens to \`0 5px 0 ..., 0 10px 20px ...\`, \`filter: brightness(1.15)\`.
- :active → \`transform: translateY(3px)\`, shadow collapses to \`0 1px 0 ..., 0 2px 4px ...\`, \`filter: brightness(0.95)\`.
- Transition: \`transform 120ms ease, box-shadow 120ms ease, filter 120ms ease\`.
- Emit a scoped \`<style>\` with class rules (\`.sticker-wall-pill\`, \`.sticker-wall-input\`, \`.sticker-wall-send\`) so hover/focus pseudos work without JS.

## Physics engine (matter-js, dynamic-imported)
Tuning constants (exact):
- GRAVITY_SCALE 0.0012 — Engine gravity { x: 0, y: 1, scale: 0.0012 }.
- \`engine.timing.timeScale = 0.6\` — slows the whole sim uniformly so stickers feel weighty, not frantic.
- Body defaults for every sticker: restitution 0.05, friction 0.6, frictionAir 0.02, density 0.0015.
- Initial body angle: random in [-0.25, 0.25] rad.
- Seeded stickers get angular velocity in [-0.05, 0.05] and velocity (x,y) in [-0.5, 0.5].
- Submitted stickers spawn at y=-30 with angular velocity in [-0.03, 0.03] and velocity x in [-0.3, 0.3], y=0.
- Four invisible static walls, 60px thick (WALL_THICKNESS), rebuilt on every resize. Opts: \`{ isStatic: true, render: { visible: false } }\`. Extend walls +60 on each side so corners overlap.
- STICKER_CAP 60. When exceeded, find the OLDEST sticker with no \`fadeStart\`, set \`fadeStart = performance.now()\`. The renderer fades alpha over FADE_MS 250 then removes the body from the Composite and the array.
- \`Matter.Runner.create()\` + \`Matter.Runner.run(runner, engine)\`. Stop and clear on cleanup.

MouseConstraint:
- \`mouse = Matter.Mouse.create(canvas)\`; create MouseConstraint with \`{ stiffness: 0.2, damping: 0.1, render: { visible: false } }\`.
- Set \`mouse.pixelRatio = dpr\` on init AND inside resize() every time dpr updates — otherwise drags misalign on high-DPR screens.
- Add the constraint to the world composite.

## Stickers — two kinds
\`type StickerKind = 'text' | 'emoji'\` with interface \`Sticker { body: Body; kind; content: string; w: number; h: number; color: string; lines: string[]; createdAt: number; fadeStart?: number }\`. Attach the sticker back to its body via \`body.plugin = { sticker }\` (typed as a plugin).

Text card geometry (from measurement):
- font: \`600 15px ui-sans-serif, system-ui, -apple-system, Segoe UI, Manrope, sans-serif\`. TEXT_FONT_PX 15, TEXT_LINE_H 20, TEXT_PAD_X 14, TEXT_PAD_Y 10, TEXT_MAX_WIDTH 180.
- Word-wrap: split on whitespace, greedy fit using \`ctx.measureText\`. If a single word exceeds maxWidth, let that word be its own line.
- w = max(70, round(longestLineWidth + TEXT_PAD_X * 2)); h = max(40, round(lineCount * TEXT_LINE_H + TEXT_PAD_Y * 2)).
- Body is \`Matter.Bodies.rectangle(x, y, w, h, opts)\`.

Emoji card geometry:
- EMOJI_SIZE 72, EMOJI_FONT_PX 42. Body rectangle 72×72.

## Palettes (exact)
- PALETTE_DARK = \`['#FDE68A','#BBF7D0','#FBCFE8','#C7D2FE','#BAE6FD','#FED7AA']\`
- PALETTE_LIGHT = \`['#F59E0B','#34D399','#F472B6','#A78BFA','#38BDF8','#FB923C']\`
- Text on every sticker: \`#111827\`.
- Active palette is chosen from the current theme and kept in a ref so new stickers pick from the right set without re-render.

## Seed content (spawned once on boot)
10 text quotes:
\`['love the new layout', 'prompts are 🔥', 'found a tiny bug on hover', 'please add a search', 'this saved me hours', 'fonts feel just right', 'mobile nav could be bigger', 'the physics here rules', 'more components please', 'onboarding was smooth']\`

12 emojis:
\`['👏','💡','🙌','👀','💬','✅','🔥','💯','🎉','❤️','🤔','⭐']\`

Seed algorithm: for each text item i, spawn with color \`palette[i % palette.length]\`, x = rand(100, max(120, w-100)), y = rand(80, max(120, h-120)). For emoji i, color \`palette[(i+3) % palette.length]\`, x = rand(80, max(100, w-80)), y same range. Give each a small initial angular + linear velocity (see constants above) then \`Composite.add\` and push to the stickers array.

## Custom 2D canvas renderer (do NOT use Matter.Render)
Render loop via \`requestAnimationFrame\`:
1. DPR: \`Math.min(devicePixelRatio || 1, 2)\`. ResizeObserver on the container recomputes width/height; on resize set \`canvas.width = round(w*dpr); canvas.height = round(h*dpr); canvas.style.width = w+'px'; canvas.style.height = h+'px'; ctx.setTransform(dpr,0,0,dpr,0,0)\`. Rebuild walls. Also re-nudge any out-of-bounds bodies back inside (x within [20, w-20], y ≤ h-20).
2. Each frame: \`ctx.setTransform(dpr,...)\` again. Fill the whole canvas with the theme bg (#0F0F12 / #F5F1E8). Full clear — no motion trails.
3. Scan stickers in reverse; for any with \`fadeStart\` set, compute dt = now - fadeStart. If dt >= 250, \`Composite.remove(world, body)\` and splice from array.
4. For each sticker still alive:
   - alpha = fadeStart ? max(0, 1 - dt/250) : 1.
   - save ctx, set globalAlpha, translate to body.position, rotate body.angle.
   - Draw shadow FIRST in rotated local space: fillStyle \`rgba(0,0,0,0.25)\`, a roundedRect at (-w/2 + 2, -h/2 + 5, w, h, CARD_RADIUS).
   - Fill the card: sticker color, roundedRect at (-w/2, -h/2, w, h, CARD_RADIUS).
   - Inner border: strokeStyle \`rgba(255,255,255,0.7)\`, lineWidth BORDER_WIDTH 2, roundedRect inset by BORDER_WIDTH on each side with radius \`max(1, CARD_RADIUS - inset)\`.
   - Content:
     - text: fillStyle #111827, same 600 15px font, textAlign center, textBaseline middle. Draw pre-wrapped lines stacked vertically centered with line height 20.
     - emoji: 42px font with an Apple Color Emoji / Segoe UI Emoji fallback family, textAlign center, textBaseline middle, draw at (0, 2).
   - restore.

CARD_RADIUS 32 (clamped to half the min dimension inside roundedRect). BORDER_WIDTH 2.

## Submit handler (form onSubmit)
- e.preventDefault. Trim input. If empty → return (no sticker spawned, input cleared implicitly by staying the same).
- Use measureTextCard on the shared canvas ctx to get lines + w + h.
- Pick random palette color. x = rand(80, max(100, W-80)), y = -30 (above the viewport so it falls in).
- Build the body with the same physics opts + a random angle. Give it angular velocity [-0.03, 0.03] and velocity x in [-0.3, 0.3], y=0.
- Attach \`body.plugin.sticker\`, Composite.add, push.
- If the array now exceeds STICKER_CAP, fade out the oldest non-fading sticker.
- Clear the input value, keep focus where it is.

## Cleanup (effect return)
- set an \`alive\` flag false so the dynamic import resolver bails.
- cancelAnimationFrame.
- ResizeObserver.disconnect().
- MutationObserver.disconnect() for theme detection.
- Matter.Runner.stop(runner); Matter.Composite.clear(world, false, true); Matter.Engine.clear(engine).
- null out refs (engine, world, matterRef, measureCtxRef); clear the stickers array.

## Mobile + a11y
- \`touchAction: 'none'\` on the interactive wrapper so touch-drag doesn't page-scroll.
- All interactions must work via touch (matter-js Mouse handles touch events). No hover-only affordances.
- The pill lives in the lower third of the viewport (paddingBottom 18vh) so mobile thumbs reach it easily.

## Typography
- Font: project sans (ui-sans-serif, system-ui, -apple-system, Segoe UI, Manrope, sans-serif).
- Weights: 500 (subtitle/body), 600 (sticker text), 700 (Send), 800 (title).
- Sizes: title clamp(32–56px), subtitle 16px, input/button 14px, sticker text 15px, emoji 42px.
`

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

${SPEC}`,

  Lovable: SPEC,

  V0: SPEC,
}
