/**
 * The paywall seam in the seven-block prompt scaffold.
 *
 * Every prompt is written in the same fixed scaffold (the same headings
 * scripts/lint-prompts.mjs lints against):
 *
 *   1. Setup · 2. Constants · 3. State · 4. Tree · 5. Why · 6. Remix · 7. Check
 *
 * WHY THE SPLIT IS AT 2-4: those three blocks ARE the build spec. Block 2 is
 * the data and config verbatim, block 3 is the entire engine (hooks, handlers,
 * RAF loop, disposal — by far the largest block), block 4 is the JSX with every
 * className and inline style verbatim. Together they reproduce the large
 * majority of the paywalled source, so a public premium prompt is a free copy
 * of a paid component. Blocks 1, 5, 6 and 7 describe, explain and sell it
 * without rebuilding it, so they stay public for everyone: they are the SEO
 * text and the pitch.
 *
 * The seam is therefore [start of "## 2. Constants", start of "## 5. Why").
 */
const LOCKED_HEADINGS = ['## 2. Constants', '## 3. State', '## 4. Tree'] as const
const LOCK_START = LOCKED_HEADINGS[0]
const LOCK_END = '## 5. Why'

/**
 * Split a scaffold prompt into the part before the locked blocks and the part
 * after them. Returns null when the prompt is NOT in a recognisable scaffold —
 * callers must then withhold the prompt whole.
 *
 * Failing closed matters: the scaffold is not enforced for premium prompts
 * (scripts/prompts-scaffold-scope.json scopes free slugs only), so "no
 * headings found" means "cannot safely redact", never "nothing to redact".
 */
export function splitPromptAtPaywall(
  prompt: string,
): { head: string; tail: string } | null {
  // Headings are matched at LINE START and must be UNIQUE. A plain indexOf would
  // land on a heading quoted inside block 4's content (JSX, prose) and cut there,
  // leaking the rest of block 4 heading-less past the assertion below.
  const at = (h: string): number[] => {
    const out: number[] = []
    const re = new RegExp(`^${h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'gm')
    for (let m = re.exec(prompt); m; m = re.exec(prompt)) out.push(m.index)
    return out
  }
  const starts = at(LOCK_START)
  const ends = at(LOCK_END)
  if (starts.length !== 1 || ends.length !== 1) return null
  const [start] = starts
  const [end] = ends
  if (end <= start) return null

  const head = prompt.slice(0, start).trimEnd()
  const tail = prompt.slice(end).trimStart()
  // Out-of-order or duplicated headings would leave a locked block outside the
  // cut. Cheap final assertion on the actual output, not on the input's shape.
  if (LOCKED_HEADINGS.some((h) => head.includes(h) || tail.includes(h))) return null
  return { head, tail }
}
