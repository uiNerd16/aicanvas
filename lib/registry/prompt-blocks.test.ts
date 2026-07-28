import { describe, it, expect } from 'vitest'
import { splitPromptAtPaywall } from './prompt-blocks'

const SCAFFOLD = [
  '## 1. Setup',
  'npm install framer-motion',
  '',
  '## 2. Constants',
  'const COLORS = ["#f00"]',
  '',
  '## 3. State',
  'const rootRef = useRef<HTMLDivElement>(null)',
  '',
  '## 4. Tree',
  '<div className="relative h-full" />',
  '',
  '## 5. Why',
  '- the RAF loop is disposed on unmount',
  '',
  '## 6. Remix',
  '- swap the palette',
  '',
  '## 7. Check',
  '- the canvas fills its parent',
].join('\n')

describe('splitPromptAtPaywall', () => {
  it('keeps blocks 1 and 2, withholds everything from block 3 on', () => {
    const split = splitPromptAtPaywall(SCAFFOLD)
    expect(split).not.toBeNull()
    const shipped = split!.head
    for (const kept of ['## 1. Setup', 'npm install framer-motion', '## 2. Constants', 'COLORS']) {
      expect(shipped).toContain(kept)
    }
    for (const gone of [
      '## 3. State', '## 4. Tree', '## 5. Why', '## 6. Remix', '## 7. Check',
      'rootRef', 'className', 'RAF loop', 'swap the palette', 'fills its parent',
    ]) {
      expect(shipped).not.toContain(gone)
    }
  })

  it('fails closed when the scaffold is missing', () => {
    expect(splitPromptAtPaywall('Build a card. Use framer-motion.')).toBeNull()
  })

  it('fails closed when the cut heading repeats at line start', () => {
    // Two cuts are ambiguous, so refuse rather than guess which one is real.
    expect(splitPromptAtPaywall(`## 3. State\nleaked\n${SCAFFOLD}`)).toBeNull()
  })

  it('fails closed when a later locked heading survives the cut', () => {
    // Block 2 quoting a real block-5 heading at line start would ship it.
    const prompt = [
      '## 1. Setup', 'x',
      '## 2. Constants',
      '## 5. Why',
      'SECRET-AFTER-STRAY-HEADING',
      '## 3. State', 'SECRET-STATE',
    ].join('\n')
    expect(splitPromptAtPaywall(prompt)).toBeNull()
  })

  it('ignores a locked heading quoted mid-line, cutting only at a real one', () => {
    // Anchoring to line starts is what makes this safe: the quoted copy is not at
    // a line start, so it neither moves the cut nor trips the survivor assertion.
    const prompt = [
      '## 1. Setup', 'x',
      '## 2. Constants',
      'const label = "## 3. State (quoted in a string)"',
      '## 3. State', 'SECRET-STATE',
      '## 4. Tree', 'SECRET-TREE',
      '## 5. Why', '- prose',
    ].join('\n')
    const out = splitPromptAtPaywall(prompt)
    expect(out).not.toBeNull()
    expect(out!.head).toContain('quoted in a string')
    expect(out!.head).not.toContain('SECRET-STATE')
    expect(out!.head).not.toContain('SECRET-TREE')
    expect(out!.head).not.toContain('- prose')
  })
})
