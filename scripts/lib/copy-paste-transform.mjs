/**
 * Shared copy-paste-readiness transform for component source code.
 *
 * Both `generate-component-codes.mjs` and `generate-registry.mjs` apply this
 * before shipping component source to end users (via the website "Copy Code"
 * button or via the shadcn registry JSON consumed by `shadcn add` / the MCP).
 *
 * `validate-registry-json.ts` mirrors this logic in TS to verify byte-for-byte
 * parity between source and shipped JSON. The TS twin must stay in sync.
 */

/**
 * Make a component's source code copy-paste ready by replacing `h-full` with
 * `min-h-screen` ON THE ROOT JSX ELEMENT ONLY.
 *
 * The root element is detected as the first `className="..."` after the
 * `return (` of `export default function` in the file content.
 *
 * Why root-only: components that author with `h-full` on root rely on a parent
 * height chain. When copy-pasted into a fresh project, no parent provides
 * height, so they collapse — switching root to `min-h-screen` ensures the
 * component fills the viewport standalone.
 *
 * Why NOT global (the previous behavior): inner elements legitimately use
 * `h-full` to fill their container — e.g. a 3px progress-bar fill, or an
 * avatar image inside a card. Replacing those with `min-h-screen` makes them
 * try to be viewport-tall, blowing up layouts (see `upload-progress` dome bug).
 *
 * If detection fails at any step (no `export default function`, no `return`,
 * no className), returns content unchanged — safer to ship `h-full` as-is than
 * to mis-transform.
 *
 * @param {string} content - Component source file content
 * @returns {string} The content with the root className transformed (if applicable)
 */
export function transformRootHeightClass(content) {
  const exportMatch = content.match(/export\s+default\s+function/)
  if (!exportMatch) return content

  const exportPos = exportMatch.index

  // Find the JSX return — `return (` followed (after whitespace/comments) by `<`.
  // This filters out useEffect cleanup `return () => {}` and similar.
  const returnEndPos = findJSXReturnContentStart(content, exportPos)
  if (returnEndPos === -1) return content

  const afterReturn = content.slice(returnEndPos)

  const classNameRegex = /className\s*=\s*(["'])([^"']*?)\1/
  const classNameMatch = afterReturn.match(classNameRegex)
  if (!classNameMatch) return content

  const fullMatch = classNameMatch[0]
  const quote = classNameMatch[1]
  const classNameValue = classNameMatch[2]

  if (!/\bh-full\b/.test(classNameValue)) return content

  const transformedValue = classNameValue.replace(/\bh-full\b/g, 'min-h-screen')
  if (transformedValue === classNameValue) return content

  const transformedClassName = `className=${quote}${transformedValue}${quote}`

  const matchAbsoluteStart = returnEndPos + classNameMatch.index
  const matchAbsoluteEnd = matchAbsoluteStart + fullMatch.length

  return (
    content.slice(0, matchAbsoluteStart) +
    transformedClassName +
    content.slice(matchAbsoluteEnd)
  )
}

/**
 * Find the position right after `return (` of the JSX return statement,
 * starting search from `startPos`. The "JSX return" is distinguished from
 * other `return (` patterns (e.g. useEffect cleanups returning a function:
 * `return () => {...}`) by requiring that the next non-whitespace,
 * non-comment character after `(` is `<` (start of a JSX element or fragment).
 *
 * Returns the byte position immediately after the matching `(`, or -1 if no
 * JSX return is found.
 */
export function findJSXReturnContentStart(content, startPos) {
  const re = /return\s*\(/g
  re.lastIndex = startPos
  let match
  while ((match = re.exec(content)) !== null) {
    const afterParen = match.index + match[0].length
    let i = afterParen
    while (i < content.length) {
      const ch = content[i]
      if (/\s/.test(ch)) { i++; continue }
      // Skip /* block comment */
      if (ch === '/' && content[i + 1] === '*') {
        const end = content.indexOf('*/', i + 2)
        if (end === -1) return -1
        i = end + 2
        continue
      }
      // Skip // line comment
      if (ch === '/' && content[i + 1] === '/') {
        const end = content.indexOf('\n', i + 2)
        if (end === -1) return -1
        i = end + 1
        continue
      }
      // First real char: must be `<` for a JSX return
      if (ch === '<') return afterParen
      // Anything else (e.g. `)` for `() =>`, `{` for `({...})`) — not JSX, try next
      break
    }
  }
  return -1
}
