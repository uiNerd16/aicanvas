import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/scramble-text/index.tsx\`. Export a named function \`ScrambleText\`.

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
}
