import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/glitch-button/index.tsx\`. Export a named function \`GlitchButton\`.

First line: \`'use client'\`

Root element: \`<div className="flex h-full w-full items-center justify-center bg-sand-950">\`

Constants:
- LABEL = "INITIALIZE"
- GLITCH_CHARS = "@#$%&!*^~<>?+="
- SCRAMBLE_DURATION = 700 (ms, total time for full resolve)
- SCRAMBLE_INTERVAL = 40 (ms, throttle between visual updates)
- TERMINAL_GREEN = "#00ff41"
- TERMINAL_GREEN_DIM = "rgba(0, 255, 65, 0.6)"
- GLOW_COLOR = "rgba(0, 255, 65, 0.15)"

State:
- \`displayText: string\` (useState, initialized to LABEL)
- \`isHovered: boolean\` (useState, for rendering border/glow)
- \`rafRef: useRef<number>(0)\` — stores requestAnimationFrame ID
- \`isHoveredRef: useRef<boolean>(false)\` — tracks hover for RAF callback (avoids stale closure)
- \`startTimeRef: useRef<number>(0)\` — scramble start timestamp
- \`lastUpdateRef: useRef<number>(0)\` — throttle tracking

Scramble algorithm (RAF-based):
1. On mouseEnter: set isHoveredRef=true, isHovered=true, record performance.now(), start RAF loop
2. Each frame: elapsed = timestamp - startTime
3. resolvePerChar = SCRAMBLE_DURATION / LABEL.length
4. resolvedCount = Math.min(Math.floor(elapsed / resolvePerChar), LABEL.length)
5. Build string: chars[i] = LABEL[i] if i < resolvedCount, else random from GLITCH_CHARS
6. If resolvedCount >= LABEL.length, set displayText to LABEL and stop
7. Throttle: skip frame if less than SCRAMBLE_INTERVAL since lastUpdate

On mouseLeave: set isHoveredRef=false, isHovered=false, cancelAnimationFrame, setDisplayText(LABEL)

Cleanup: useEffect returns function that cancels RAF on unmount.

Styling:
- Button: \`relative cursor-pointer border bg-sand-950 px-8 py-4 font-mono text-lg font-semibold tracking-widest\`
- Color via inline style: \`color: TERMINAL_GREEN\`
- Border via inline style: isHovered ? TERMINAL_GREEN_DIM : "#2E2A24"
- Box-shadow via inline style: isHovered ? \`0 0 20px \${GLOW_COLOR}, inset 0 0 12px \${GLOW_COLOR}\` : "none"
- CSS transition on border-color and box-shadow: 0.3s
- Blinking cursor: \`<motion.span>\` with color TERMINAL_GREEN, \`animate={{ opacity: [1, 0] }}\`, transition duration 0.8s, repeat Infinity, repeatType "reverse", ease "steps(1)"

Framer Motion:
- Entrance wrapper: motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition duration 0.5 ease "easeOut"
- Button: motion.button with whileTap={{ scale: 0.97 }} spring stiffness 400 damping 30

No \`dark:\` variants. No CSS keyframes. No external dependencies beyond framer-motion.`,
}
