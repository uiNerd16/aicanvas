import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a text scramble / decryption effect component in Next.js with Tailwind CSS and Framer Motion.

The component shows a single bold monospace word — "ENCRYPTED" — centered on the canvas. Above and below the word are short decorative horizontal lines that fade in on mount.

On hover, each character immediately starts cycling through random characters (letters A–Z, digits 0–9, and symbols like @#$%&!) at about 60ms per cycle. After ~300ms of scrambling, the characters resolve one by one back to their real letters, from left to right, with about 80ms stagger between each character. Resolved characters appear in the normal text color (dark on light, near-white on dark), while still-scrambling characters show in an olive/green accent color so the user can see the decryption "front" sweeping through.

When the cursor leaves, the same scramble triggers briefly (~400ms), then all characters settle back to their correct letters with the same stagger.

A small "hover to decrypt" label in tiny uppercase tracking-widest monospace text sits below the word. It fades out when the user hovers.

Styling:
- Background: warm light gray in light mode, deep near-black in dark mode
- Text: large (~48px), bold, monospace font (Courier New)
- Scrambling chars: olive green (#7D8D41 light / #96A452 dark)
- Resolved chars: dark sand (#1C1916 light / #FAF7F2 dark)
- Wide letter-spacing on the main word

The component should support both light and dark mode with Tailwind dark: variants.`,

  Bolt: `Build a React component called ScrambleText using Framer Motion and Tailwind CSS.

Component state:
- \`chars: { display: string, resolved: boolean }[]\` — one entry per character of "ENCRYPTED"
- \`isHovered: boolean\`

Behavior:
1. On mount: all chars are in resolved state, showing their real letter.
2. On mouseenter: trigger "scramble then resolve":
   - Set all chars to \`resolved: false\` immediately, with random chars from charset \`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!\`
   - Start a \`setInterval\` at 60ms that re-randomizes all unresolved chars
   - After 300ms, schedule per-character timeouts staggered 80ms apart; each timeout marks that char as resolved and sets its correct letter
   - When all chars are resolved, clear the interval
3. On mouseleave: same logic but resolve starts after 400ms (brief scramble, then settle)
4. Clean up all intervals and timeouts on unmount

Rendering:
- Root: \`flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950\`
- Characters in a flex row, monospace font (Courier New), text-5xl, font-bold
- Scrambled chars: \`text-olive-500 dark:text-olive-400\`
- Resolved chars: \`text-sand-900 dark:text-sand-50\`
- "hover to decrypt" label fades out on hover
- Decorative 1px horizontal lines above and below the word fade in with a Framer Motion initial/animate`,

  Lovable: `I'd love a component that feels like cracking open a secret message — a hacking or decryption terminal moment frozen on screen.

The word "ENCRYPTED" sits dead center, large and monospaced, like something ripped from a spy movie interface. When you hover over it, it goes chaotic — every letter starts scrambling through random characters, numbers, symbols, flickering at high speed in a vivid olive-green glow. Then, one letter at a time, left to right, each character snaps into its true form — the green fades to clean white (or deep charcoal in light mode), like a signal resolving through noise.

When you move away, it scrambles briefly one more time, then settles back — quiet, encoded, waiting.

The mood should feel cool and technical but not cold. The green accent on scrambling characters gives it life and energy. There's a tiny "hover to decrypt" label in tiny monospace caps below the word that quietly disappears when the animation starts.

Decorative thin horizontal lines above and below the word appear on load, framing it like a terminal readout.

Both light and dark modes should look great — dark background with near-white text and olive scramble color; light background with deep charcoal text and slightly darker olive.`,

  'Claude Code': `Create \`components-workspace/scramble-text/index.tsx\`. Export a named function \`ScrambleText\`.

**Target text:** \`"ENCRYPTED"\` (9 characters)

**Charset for scrambling:** \`"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!"\`

**State:**
\`\`\`ts
interface CharState { display: string; resolved: boolean }
const [chars, setChars] = useState<CharState[]>(...)
const [isHovered, setIsHovered] = useState(false)
\`\`\`

**Refs (cleanup):**
- \`scrambleIntervalRef: useRef<ReturnType<typeof setInterval> | null>\`
- \`resolveTimeoutsRef: useRef<ReturnType<typeof setTimeout>[]>\`
- \`aliveRef: useRef<boolean>(true)\` — guard against state updates after unmount

**Algorithm — runScrambleThenResolve(resolveAfterMs: number):**
1. Clear any existing interval + timeouts
2. Set all chars to \`{ display: randomChar(), resolved: false }\`
3. Start \`setInterval\` at 60ms: for each unresolved index, pick a new random char
4. For each char index \`i\`, schedule a \`setTimeout\` at \`resolveAfterMs + i * 80\`:
   - Mark index \`i\` as resolved in state with its real letter
   - If all resolved: clear the interval

**Mouse handlers:**
- \`handleMouseEnter\`: \`setIsHovered(true)\`, call \`runScrambleThenResolve(300)\`
- \`handleMouseLeave\`: \`setIsHovered(false)\`, call \`runScrambleThenResolve(400)\` (brief scramble duration before resolving)

**Cleanup:** \`useEffect(() => { aliveRef.current = true; return () => { aliveRef.current = false; clearAll() } }, [])\`

**Rendering:**
- Root: \`className="flex h-full w-full cursor-default items-center justify-center bg-sand-100 dark:bg-sand-950"\`
- Characters: flex row, \`style={{ fontFamily: "'Courier New', Courier, monospace" }}\`, \`text-5xl font-bold tracking-widest\`
- Resolved char color: \`text-sand-900 dark:text-sand-50\`
- Scrambled char color: \`text-olive-500 dark:text-olive-400\`
- Use \`motion.span\` per char with \`animate={{ opacity: 1 }} transition={{ duration: 0.08 }}\`
- "hover to decrypt" label: tiny uppercase monospace, \`opacity\` animated to 0 when \`isHovered\`
- Decorative \`h-px\` lines above/below: \`initial={{ scaleX: 0 }}\` → \`animate={{ scaleX: 1 }}\` on mount

**Rules:**
- \`'use client'\` at top
- No \`any\`, no type assertions
- No useTheme needed — all colors via Tailwind \`dark:\` variants
- Import \`motion, AnimatePresence\` from \`framer-motion\``,

  Cursor: `File: \`components-workspace/scramble-text/index.tsx\`
- Export: \`ScrambleText\` (named function, \`'use client'\`)
- Target word: \`"ENCRYPTED"\` (9 chars)
- Charset: \`"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!"\`

State:
- \`chars: { display: string; resolved: boolean }[]\`
- \`isHovered: boolean\`

Refs:
- \`scrambleIntervalRef: ReturnType<typeof setInterval> | null\`
- \`resolveTimeoutsRef: ReturnType<typeof setTimeout>[]\`
- \`aliveRef: boolean\` — guard unmounted state updates

Scramble logic (shared fn \`runScrambleThenResolve(resolveAfterMs)\`):
1. Clear existing interval + all timeouts
2. Immediately set all chars to \`resolved: false\`, random display
3. Start interval @ 60ms → rerandomize unresolved chars
4. Per-char timeout at \`resolveAfterMs + i * 80ms\` → mark resolved, real letter; if all done → clear interval

Triggers:
- \`mouseenter\` → isHovered=true, resolveAfterMs=300
- \`mouseleave\` → isHovered=false, resolveAfterMs=400

Cleanup: \`useEffect\` returns \`() => { aliveRef.current = false; clearAll() }\`

Layout:
- Root: \`flex h-full w-full cursor-default items-center justify-center bg-sand-100 dark:bg-sand-950\`
- Chars: flex row, font Courier New, \`text-5xl font-bold tracking-widest\`
- Resolved: \`text-sand-900 dark:text-sand-50\`
- Scrambling: \`text-olive-500 dark:text-olive-400\`
- Each char: \`motion.span\`, animate opacity 1, transition 80ms
- "hover to decrypt": tiny monospace uppercase, fades to opacity 0 when hovered
- Top/bottom decorative \`h-px\` lines: Framer Motion \`scaleX 0→1\` on mount
- No \`useTheme\` — Tailwind \`dark:\` variants only`,
}
