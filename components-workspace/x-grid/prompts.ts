import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/x-grid/index.tsx\`. TypeScript strict, no \`any\`. \`'use client'\`. Export named function \`XGrid\`.

## Constants
\`\`\`
const SPACING = 20   // px between × centres
const RADIUS  = 340  // px hover influence radius
const BASE_A  = 0.13 // resting alpha (dark)
const PEAK_A  = 0.92 // fully lit alpha
\`\`\`
Light-mode baseA override: \`0.25\` (branch on \`isDarkRef.current\` inside the frame loop).

## Refs & state
- \`containerRef\` → HTMLDivElement
- \`canvasRef\` → HTMLCanvasElement
- \`mouseRef\` → \`{ x: number; y: number } | null\` (initial null)
- \`isDarkRef\` → boolean (initial true) — mirror of state for sync reads inside the RAF loop
- \`const [isDark, setIsDark] = useState(true)\` — drives background/label colours in JSX

## Theme detection effect
On mount, resolve theme: \`const card = containerRef.current.closest('[data-card-theme]')\`; if card, \`dark = card.classList.contains('dark')\`, else \`document.documentElement.classList.contains('dark')\`. Call setIsDark and set isDarkRef.current. MutationObserver (\`attributeFilter: ['class']\`) observing both \`document.documentElement\` and the card wrapper (if any). Cleanup: \`observer.disconnect()\`.

## Canvas render effect (runs once, deps [])
Locals: \`type Mark = { x: number; y: number; b: number; col: number; row: number }\`, \`let marks: Mark[] = []\`, \`let grid: Mark[][] = []\`, \`let animId = 0\`, \`let alive = true\`, \`let cw = 0, ch = 0\`, \`const t0 = performance.now()\`.

\`build()\`:
1. \`dpr = window.devicePixelRatio || 1\`
2. \`rect = canvas.getBoundingClientRect()\`; set cw/ch; early-return if zero.
3. \`canvas.width = round(cw*dpr)\`, \`canvas.height = round(ch*dpr)\`.
4. \`ctx.setTransform(dpr,0,0,dpr,0,0)\`.
5. Reset \`marks = []\`, \`grid = []\`.
6. \`cols = floor(cw/SPACING)+2\`, \`rows = floor(ch/SPACING)+2\`, \`ox = (cw%SPACING)/2\`, \`oy = (ch%SPACING)/2\`.
7. Nested loop r,c: \`m = { x: ox + c*SPACING, y: oy + r*SPACING, b: 0, col: c, row: r }\`; push to marks; assign \`grid[r][c] = m\`.

\`frame()\`:
1. If \`!alive\` return. \`ctx.clearRect(0, 0, cw, ch)\`.
2. \`ctx.lineWidth = 0.5\` — explicit reset before the mark loop so state doesn't bleed from the connection pass.
3. \`mx = mouseRef.current?.x ?? -99999\`, same for my. \`r2 = RADIUS*RADIUS\`. \`dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'\`. \`t = (performance.now() - t0) / 1000\`.
4. For each d in marks:
   - \`dx=d.x-mx, dy=d.y-my, dist2=dx*dx+dy*dy\`
   - \`tgt = dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2)/RADIUS, 1.5) : 0\`
   - Brightness lerp: \`d.b += (tgt > d.b ? 0.16 : 0.05) * (tgt - d.b)\` (attack 0.16, release 0.05 — ~1s trail decay). If \`d.b < 0.004\` set to 0.
   - \`arm = 2 + d.b * 1.0\` (2px resting → 3px lit)
   - \`sw  = 0.5 + d.b * 0.3\` (0.5px resting → 0.8px lit)
   - \`baseA = isDarkRef.current ? BASE_A : 0.25\`
   - \`wave = Math.sin(d.col*0.3 + d.row*0.3 - t*0.5)\`
   - \`restingAlpha = baseA * (1 + wave * 0.3)\`
   - \`alpha = restingAlpha + (PEAK_A - restingAlpha) * d.b\`
   - \`ctx.strokeStyle = \\\`rgba(\${dotRGB},\${alpha.toFixed(2)})\\\`\`; \`ctx.lineWidth = sw\`.
   - Draw × via two diagonals, axis-aligned (no rotate/translate): \`moveTo(x-arm,y-arm); lineTo(x+arm,y+arm); moveTo(x+arm,y-arm); lineTo(x-arm,y+arm); stroke()\`.
5. Connection pass: \`ctx.lineWidth = 0.5\`. For each d with \`d.b >= 0.05\`, look up four neighbours from grid: right \`[row][col+1]\`, below \`[row+1][col]\`, down-right \`[row+1][col+1]\`, down-left \`[row+1][col-1]\`. For each defined neighbour with \`n.b >= 0.05\`: \`lineAlpha = Math.min(d.b, n.b) * 0.4\`, stroke the segment d→n.
6. \`animId = requestAnimationFrame(frame)\`.

After defining build/frame: call \`build()\`, \`frame()\`. Create \`ro = new ResizeObserver(build)\` and \`ro.observe(canvas.parentElement!)\`. Cleanup: \`alive = false; cancelAnimationFrame(animId); ro.disconnect()\`.

## Mouse + touch
\`updateMouse(cx, cy)\`: read \`canvas.getBoundingClientRect()\`, set \`mouseRef.current = { x: cx - rect.left, y: cy - rect.top }\`. Handlers on the outer div: \`onMouseMove\` calls updateMouse; \`onMouseLeave\` → \`mouseRef.current = null\`; \`onTouchMove\` uses \`e.touches[0]\` if present; \`onTouchEnd\` → null.

## JSX
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }} ...handlers>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>X Grid</span>
    <span style={{ color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>hover to illuminate</span>
  </div>
</div>
\`\`\`

## Cleanup checklist
- \`alive\` flag, \`cancelAnimationFrame(animId)\`, \`ro.disconnect()\` in the render effect return
- \`observer.disconnect()\` in the theme effect return
- No \`any\`; only \`canvasRef.current!\` / \`canvas.parentElement!\` assertions, which are safe inside the mount effect.`,
}
