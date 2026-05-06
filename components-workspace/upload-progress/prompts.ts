import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Build a self-contained animated file upload progress widget in a single React file using Framer Motion and @phosphor-icons/react.

## Environment
Verify Tailwind CSS v4, TypeScript, and React are set up. Use the shadcn CLI if missing.

## Component: UploadProgress

### Layout & container
- Root: \`flex min-h-screen w-full items-center justify-center\` with warm neutral background (\`#E8E8DF\` light, \`#1A1A19\` dark)
- Card max 480px wide, centered

### States
Four states: \`uploading\`, \`paused\`, \`complete\`, \`idle\`

**Idle:** A pill button ("Upload Files") centered. Dark bg / light text in light mode; inverted in dark. Spring scale hover/tap. Clicking starts a simulated upload.

**Uploading / Paused / Complete:** A rounded card (\`borderRadius: 28\`, \`boxShadow: '0px 16px 56px rgba(0,0,0,0.14)'\`, overflow hidden, position relative):
- Card bg: \`#f1f1f0\` (same in both themes — card is always light)

### Collapsed view
- Title: "Uploading 3 files" (18px bold) or "Upload complete"
- Subtitle (14px medium, muted \`#6c6c6c\`): \`"XX% · N seconds left"\` / \`"XX% · Paused"\` / \`"Upload complete"\`. Use \`key={status}\` on the AnimatePresence child so it only animates on state transitions, not on every percentage tick.
- **Bottom bar**: 6px tall, full width flush at card bottom. Track \`#e4e4dc\`. Fill animates between \`#6366f1\` (uploading) and \`#f59e0b\` (paused) with a 0.35s ease transition. While uploading, a white gradient shimmer (\`linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)\`) sweeps left-to-right across the fill on a 1.6s loop with a 0.8s delay between sweeps. Shimmer stops (animate x stays at -100%) when paused.
- No background fill/sweep on the card — the bar is the only progress indicator in collapsed view.

### Expanded view
- Title + 4 icon buttons in header, no subtitle
- Divider (1px at mx-6) below header
- 3 file rows: filename bold left, "XX% · Ns left" muted right, individual 3px progress bar under each row
- Each file bar fill also transitions between \`#6366f1\` and \`#f59e0b\` matching the paused state
- File list height animates via AnimatePresence with spring transition (stiffness 380, damping 38) for height, opacity 0.16s. No overflow:hidden on the file list — let the card's overflow handle clipping for smooth corner animation.

### 4 action buttons (top-right)
All 36px circles (\`size-9\`), bg \`#ededea\`, icon \`#6c6c6c\`. Spring hover scale 1.12, tap 0.88. Hidden in complete state except expand.

1. **Pause/Play toggle**: Pause icon while uploading; Play icon while paused. AnimatePresence mode="wait" icon swap.
2. **Refresh** (\`ArrowCounterClockwise\`): Resets all progress to 0 and resumes.
3. **Stop** (\`X\`): Resets to idle.
4. **Expand/Collapse** (\`ArrowsOutSimple\` / \`ArrowsInSimple\`): Always visible.

### Progress simulation
Files: \`{ name: 'Brand reel.mp4', durationMs: 8000 }\`, \`{ name: 'Product demo.mp4', durationMs: 12500 }\`, \`{ name: 'Hero animation.mp4', durationMs: 16000 }\`. setInterval 80ms; each tick: \`p + (100/durationMs)*80\`, clamped to 100. Use \`useRef\` for raw values. Pause clears interval; refresh resets refs and sets status to \`'uploading'\`. All at 100% → complete → 2s → idle + reset.

### Dark mode (inline)
Inline \`useDarkMode(ref)\` hook: check \`[data-card-theme]\` ancestor first, fallback to \`document.documentElement.classList.contains('dark')\`, watch via MutationObserver.

Single file. \`'use client'\` at top. \`export default function UploadProgress()\`.`,

  Lovable: `Build a self-contained animated file upload progress widget in a single React file using Framer Motion and @phosphor-icons/react.

## Component: UploadProgress

### Layout
Root: \`flex min-h-screen w-full items-center justify-center\`, bg \`#E8E8DF\` light / \`#1A1A19\` dark. Card max 480px, centered.

### States: \`uploading\` | \`paused\` | \`complete\` | \`idle\`

**Idle:** Pill button "Upload Files" (dark/light inverted by theme). Spring scale. Clicking starts upload.

**Active card:** borderRadius 28, shadow \`0px 16px 56px rgba(0,0,0,0.14)\`, overflow hidden, position relative. Bg \`#f1f1f0\` (always light).

### Collapsed view
- Title 18px bold. Subtitle 14px muted with \`key={status}\` (not text string) for AnimatePresence so it doesn't flash on every tick.
- **Bottom 6px progress bar** flush at card edge. Track \`#e4e4dc\`. Fill color: \`#6366f1\` uploading → \`#f59e0b\` paused (0.35s transition). While uploading, animate a white shimmer gradient across the fill in a 1.6s loop. No background sweep on the card body.

### Expanded view
- Title + 4 buttons, divider, 3 file rows each with filename + stats + 3px progress bar.
- Each file bar uses same indigo/amber color logic.
- File list AnimatePresence: spring height (stiffness 380, damping 38), opacity 0.16s. No overflow:hidden on the list div — card handles clipping.

### 4 action buttons (36px circles, hidden in complete state except expand)
1. Pause/Play — Pause icon when uploading → Play icon when paused. AnimatePresence swap.
2. Refresh — ArrowCounterClockwise — resets progress to 0 and resumes.
3. Stop — X — resets to idle.
4. Expand — ArrowsOutSimple / ArrowsInSimple — always visible.

### Simulation
Files: Brand reel.mp4 (8s), Product demo.mp4 (12.5s), Hero animation.mp4 (16s). setInterval 80ms, increment (100/durationMs)*80 per file. Use ref for raw values. Complete → 2s → idle.

### Dark mode
Inline \`useDarkMode(ref)\` that checks \`[data-card-theme]\` ancestor then \`document.documentElement\` via MutationObserver.

Single file. \`'use client'\`. \`export default function UploadProgress()\`.`,

  V0: `Build a self-contained animated file upload progress widget in a single React file using Framer Motion and @phosphor-icons/react.

## Component: UploadProgress

### Layout
Root: \`flex min-h-screen w-full items-center justify-center\`, bg \`#E8E8DF\` light / \`#1A1A19\` dark. Card max 480px, centered.

### States: \`uploading\` | \`paused\` | \`complete\` | \`idle\`

**Idle:** Pill button "Upload Files" (dark/light inverted by theme). Spring scale. Clicking starts upload.

**Active card:** borderRadius 28, shadow \`0px 16px 56px rgba(0,0,0,0.14)\`, overflow hidden, position relative. Bg \`#f1f1f0\` (always light).

### Collapsed view
- Title 18px bold. Subtitle 14px muted with \`key={status}\` (not text string) for AnimatePresence so it doesn't flash on every tick.
- **Bottom 6px progress bar** flush at card edge. Track \`#e4e4dc\`. Fill color: \`#6366f1\` uploading → \`#f59e0b\` paused (0.35s transition). While uploading, animate a white shimmer gradient across the fill in a 1.6s loop. No background sweep on the card body.

### Expanded view
- Title + 4 buttons, divider, 3 file rows each with filename + stats + 3px progress bar.
- Each file bar uses same indigo/amber color logic.
- File list AnimatePresence: spring height (stiffness 380, damping 38), opacity 0.16s. No overflow:hidden on the list div — card handles clipping.

### 4 action buttons (36px circles, hidden in complete state except expand)
1. Pause/Play — Pause icon when uploading → Play icon when paused. AnimatePresence swap.
2. Refresh — ArrowCounterClockwise — resets progress to 0 and resumes.
3. Stop — X — resets to idle.
4. Expand — ArrowsOutSimple / ArrowsInSimple — always visible.

### Simulation
Files: Brand reel.mp4 (8s), Product demo.mp4 (12.5s), Hero animation.mp4 (16s). setInterval 80ms, increment (100/durationMs)*80 per file. Use ref for raw values. Complete → 2s → idle.

### Dark mode
Inline \`useDarkMode(ref)\` that checks \`[data-card-theme]\` ancestor then \`document.documentElement\` via MutationObserver.

Single file. \`'use client'\`. \`export default function UploadProgress()\`.`,
}
