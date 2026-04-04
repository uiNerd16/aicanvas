import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a terminal-inspired button component called "GlitchButton". It should feel like a command prompt from a sci-fi movie — deep dark background, monospace font, bright terminal green text (#00ff41).

The button displays a label like "INITIALIZE" in monospace with a blinking underscore cursor after it. The text glows faintly, and the button has a barely-visible dark border.

On hover, the magic happens: every character in the label rapidly scrambles into random symbols (@, #, $, %, &, !, *) for about 0.7 seconds, then the original characters snap back into place one by one from left to right — like a computer decoding a secret message.

The border shifts to a dim green glow on hover, with a subtle box-shadow that makes the whole button feel like it's powering up. When you move the mouse away, everything resets instantly.

Use Next.js with Tailwind CSS and Framer Motion. The button should have a tiny press-down feel when clicked. The whole thing sits centered on a very dark background (#110F0C).`,

  Bolt: `Build a React component called GlitchButton using Framer Motion and Tailwind CSS. It renders a terminal-style button with a glitch text scramble effect on hover.

Structure:
- Root div: \`flex h-full w-full items-center justify-center bg-sand-950\` (bg #110F0C)
- Button: monospace font, terminal green text (#00ff41), dark border (#2E2A24) that transitions to green glow on hover
- Blinking underscore cursor after the label, animated with Framer Motion opacity [1, 0], 0.8s steps easing

Glitch effect (on mouseEnter):
- Store the original label "INITIALIZE"
- Use requestAnimationFrame to scramble all unresolved characters with random symbols from "@#$%&!*^~<>?+="
- Characters resolve left-to-right over ~700ms total — each position locks in sequentially based on elapsed time
- resolvePerChar = 700 / label.length, resolvedCount = floor(elapsed / resolvePerChar)
- Throttle visual updates to every ~40ms for performance
- On mouseLeave: cancel the RAF loop, reset text to original immediately

Hover visual effects:
- Border transitions from #2E2A24 to rgba(0, 255, 65, 0.6) over 0.3s
- Box-shadow: \`0 0 20px rgba(0, 255, 65, 0.15), inset 0 0 12px rgba(0, 255, 65, 0.15)\`
- Both via CSS transition on the style prop

Animation details:
- Entrance: fade in + slide up (opacity 0→1, y 16→0, 0.5s ease-out) via Framer Motion
- Button press: whileTap scale 0.97, spring stiffness 400 damping 30

Important: clean up requestAnimationFrame on unmount. Use useRef for RAF ID and hover state to avoid stale closures. Track isHovered with both useRef (for RAF callback) and useState (for border/glow rendering).`,

  Lovable: `I'd love a button that feels like it belongs on a hacker's terminal in a sci-fi movie — the kind of interface you see when someone's breaking into a system and mysterious green text is scrolling across a dark screen.

The button sits on a deep, almost-black surface and says "INITIALIZE" in a monospace font with a soft, electric green glow (#00ff41). There's a blinking cursor after the text, pulsing steadily like a heartbeat — like the system is alive and waiting for your command.

When you hover over it, chaos erupts — every letter gets replaced by random symbols like @, #, $, %, creating this beautiful digital scramble. Then, one by one from left to right, the original letters decode back into place over about 0.7 seconds. It feels like watching a computer crack an encryption key in real time.

The border goes from nearly invisible to a soft green luminescence, and a subtle glow radiates from the button like it's charging up with energy. Move your mouse away and everything snaps back to calm — the system is ready and waiting again.

When you click, there's a satisfying tiny press feeling, like pushing a real physical button on a control panel.

The colors are intentional — bright terminal green on deep dark charcoal. Not the harsh neon of the 80s, but something more refined and cinematic. Built with React, Tailwind CSS, and Framer Motion.`,

  'Claude Code': `Create \`components-workspace/glitch-button/index.tsx\`. Export a named function \`GlitchButton\`.

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

  Cursor: `File: \`components-workspace/glitch-button/index.tsx\`
- \`'use client'\`, export \`GlitchButton\`
- Root: \`flex h-full w-full items-center justify-center bg-sand-950\`

Constants:
- LABEL = "INITIALIZE", GLITCH_CHARS = "@#$%&!*^~<>?+="
- SCRAMBLE_DURATION = 700ms, SCRAMBLE_INTERVAL = 40ms
- TERMINAL_GREEN = "#00ff41", TERMINAL_GREEN_DIM = "rgba(0,255,65,0.6)"
- GLOW_COLOR = "rgba(0,255,65,0.15)"

Button styling:
- \`font-mono text-lg font-semibold tracking-widest\`, color via inline style (TERMINAL_GREEN)
- \`border bg-sand-950 px-8 py-4\`, border-color via inline style
- Hover: border → TERMINAL_GREEN_DIM, box-shadow → \`0 0 20px GLOW_COLOR, inset 0 0 12px GLOW_COLOR\`
- Transitions via CSS \`transition: border-color 0.3s, box-shadow 0.3s\`
- Blinking underscore after label: Framer Motion opacity [1,0], 0.8s steps, repeat Infinity

Glitch effect:
- On mouseEnter: start RAF loop, track with useRef
- resolvedCount = floor(elapsed / (700 / label.length))
- Resolved positions → original char, rest → random from GLITCH_CHARS
- Throttle updates to 40ms intervals
- On mouseLeave: cancel RAF, reset text, set isHovered=false

State:
- useState: displayText (string), isHovered (boolean)
- useRef: rafId (number), isHoveredRef (boolean — avoids stale closure in RAF), startTime, lastUpdate
- Cleanup RAF on unmount via useEffect

Framer Motion:
- Entrance: opacity 0→1, y 16→0, 0.5s easeOut
- whileTap: scale 0.97, spring stiffness 400 damping 30
- No dark: variants, no CSS keyframes`,
}
