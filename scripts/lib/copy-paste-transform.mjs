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
  const afterExport = content.slice(exportPos)

  const returnMatch = afterExport.match(/return\s*\(/)
  if (!returnMatch) return content

  const returnEndPos = exportPos + returnMatch.index + returnMatch[0].length
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
