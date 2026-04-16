import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

Create a React client component named \`CircleField\`. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed HTML canvas of randomly-scattered tiny stroked circles. On hover, circles near the cursor brighten and grow a double-ring halo (inner + outer ring). DPR-aware canvas, requestAnimationFrame, ResizeObserver.

Constants:
\`\`\`
DENSITY      = 1 / 250   // circles per pixel²
MAX_DOTS     = 3000
RADIUS       = 200       // hover influence radius
BASE_R       = 3
BASE_A_DARK  = 0.18
BASE_A_LIGHT = 0.28
PEAK_A       = 0.65
\`\`\`

Build once: count = min(round(cw*ch*DENSITY), MAX_DOTS). Each circle is \`{ x: random*cw, y: random*ch, b: 0 }\`.

Per-frame loop:
- dist2 = (x-mx)^2 + (y-my)^2
- tgt = dist2 < RADIUS*RADIUS ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
- b += (tgt > b ? 0.16 : 0.07) * (tgt - b); if b < 0.004 b = 0
- alpha = baseA + (PEAK_A - baseA) * b
- If b > 0.02: stroke inner ring arc(x,y,1.5) at rgba(dotRGB, (b*0.50).toFixed(2))
- If b > 0.02: stroke outer ring arc(x,y,7) at rgba(dotRGB, (b*0.40).toFixed(2))
- Always: stroke base arc(x,y,BASE_R) at rgba(dotRGB, alpha.toFixed(2))
- All strokes lineWidth 0.5.

dotRGB = dark ? '255,255,255' : '28,25,22'. baseA = dark ? BASE_A_DARK : BASE_A_LIGHT.

Standard DPR setup. ResizeObserver on canvas.parentElement rebuilds. Mouse on outer div onMouseMove/onTouchMove writes {x: clientX - canvasRect.left, y: clientY - canvasRect.top} to mouseRef. Leave/touchend → null. Sentinel -99999.

Theme detection: walk containerRef.current.closest('[data-card-theme]'); if found use its .dark class, else document.documentElement.classList.contains('dark'). MutationObserver on both. Mirror into isDarkRef and isDark state.

JSX: outer div relative h-full w-full overflow-hidden, bg '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered pointer-events-none overlay:
- "Circle Field" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to illuminate" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

Cleanup: alive=false, cancelAnimationFrame, ro.disconnect, observer.disconnect.

## Typography
- Font: project default sans-serif
- Sizes: 11px, 22px
- Weights: 600, 700`,

  'Lovable': `Create a React client component named \`CircleField\`. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed HTML canvas of randomly-scattered tiny stroked circles. On hover, circles near the cursor brighten and grow a double-ring halo (inner + outer ring). DPR-aware canvas, requestAnimationFrame, ResizeObserver.

Constants:
\`\`\`
DENSITY      = 1 / 250   // circles per pixel²
MAX_DOTS     = 3000
RADIUS       = 200       // hover influence radius
BASE_R       = 3
BASE_A_DARK  = 0.18
BASE_A_LIGHT = 0.28
PEAK_A       = 0.65
\`\`\`

Build once: count = min(round(cw*ch*DENSITY), MAX_DOTS). Each circle is \`{ x: random*cw, y: random*ch, b: 0 }\`.

Per-frame loop:
- dist2 = (x-mx)^2 + (y-my)^2
- tgt = dist2 < RADIUS*RADIUS ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
- b += (tgt > b ? 0.16 : 0.07) * (tgt - b); if b < 0.004 b = 0
- alpha = baseA + (PEAK_A - baseA) * b
- If b > 0.02: stroke inner ring arc(x,y,1.5) at rgba(dotRGB, (b*0.50).toFixed(2))
- If b > 0.02: stroke outer ring arc(x,y,7) at rgba(dotRGB, (b*0.40).toFixed(2))
- Always: stroke base arc(x,y,BASE_R) at rgba(dotRGB, alpha.toFixed(2))
- All strokes lineWidth 0.5.

dotRGB = dark ? '255,255,255' : '28,25,22'. baseA = dark ? BASE_A_DARK : BASE_A_LIGHT.

Standard DPR setup. ResizeObserver on canvas.parentElement rebuilds. Mouse on outer div onMouseMove/onTouchMove writes {x: clientX - canvasRect.left, y: clientY - canvasRect.top} to mouseRef. Leave/touchend → null. Sentinel -99999.

Theme detection: walk containerRef.current.closest('[data-card-theme]'); if found use its .dark class, else document.documentElement.classList.contains('dark'). MutationObserver on both. Mirror into isDarkRef and isDark state.

JSX: outer div relative h-full w-full overflow-hidden, bg '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered pointer-events-none overlay:
- "Circle Field" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to illuminate" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

Cleanup: alive=false, cancelAnimationFrame, ro.disconnect, observer.disconnect.

## Typography
- Font: project default sans-serif
- Sizes: 11px, 22px
- Weights: 600, 700`,

  'V0': `Create a React client component named \`CircleField\`. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed HTML canvas of randomly-scattered tiny stroked circles. On hover, circles near the cursor brighten and grow a double-ring halo (inner + outer ring). DPR-aware canvas, requestAnimationFrame, ResizeObserver.

Constants:
\`\`\`
DENSITY      = 1 / 250   // circles per pixel²
MAX_DOTS     = 3000
RADIUS       = 200       // hover influence radius
BASE_R       = 3
BASE_A_DARK  = 0.18
BASE_A_LIGHT = 0.28
PEAK_A       = 0.65
\`\`\`

Build once: count = min(round(cw*ch*DENSITY), MAX_DOTS). Each circle is \`{ x: random*cw, y: random*ch, b: 0 }\`.

Per-frame loop:
- dist2 = (x-mx)^2 + (y-my)^2
- tgt = dist2 < RADIUS*RADIUS ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
- b += (tgt > b ? 0.16 : 0.07) * (tgt - b); if b < 0.004 b = 0
- alpha = baseA + (PEAK_A - baseA) * b
- If b > 0.02: stroke inner ring arc(x,y,1.5) at rgba(dotRGB, (b*0.50).toFixed(2))
- If b > 0.02: stroke outer ring arc(x,y,7) at rgba(dotRGB, (b*0.40).toFixed(2))
- Always: stroke base arc(x,y,BASE_R) at rgba(dotRGB, alpha.toFixed(2))
- All strokes lineWidth 0.5.

dotRGB = dark ? '255,255,255' : '28,25,22'. baseA = dark ? BASE_A_DARK : BASE_A_LIGHT.

Standard DPR setup. ResizeObserver on canvas.parentElement rebuilds. Mouse on outer div onMouseMove/onTouchMove writes {x: clientX - canvasRect.left, y: clientY - canvasRect.top} to mouseRef. Leave/touchend → null. Sentinel -99999.

Theme detection: walk containerRef.current.closest('[data-card-theme]'); if found use its .dark class, else document.documentElement.classList.contains('dark'). MutationObserver on both. Mirror into isDarkRef and isDark state.

JSX: outer div relative h-full w-full overflow-hidden, bg '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered pointer-events-none overlay:
- "Circle Field" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to illuminate" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

Cleanup: alive=false, cancelAnimationFrame, ro.disconnect, observer.disconnect.

## Typography
- Font: project default sans-serif
- Sizes: 11px, 22px
- Weights: 600, 700`,
}
