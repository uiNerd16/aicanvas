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
  it('drops blocks 2-4 and keeps 1, 5, 6, 7', () => {
    const split = splitPromptAtPaywall(SCAFFOLD)!
    expect(split).not.toBeNull()
    const shipped = `${split.head}\n\n${split.tail}`
    for (const gone of ['## 2. Constants', '## 3. State', '## 4. Tree', 'COLORS', 'rootRef', 'className']) {
      expect(shipped).not.toContain(gone)
    }
    for (const kept of ['## 1. Setup', 'npm install framer-motion', '## 5. Why', '## 6. Remix', '## 7. Check']) {
      expect(shipped).toContain(kept)
    }
  })

  it('fails closed when the scaffold is missing', () => {
    expect(splitPromptAtPaywall('Build a card. Use framer-motion.')).toBeNull()
  })

  it('fails closed when a locked heading sits outside the cut', () => {
    expect(splitPromptAtPaywall(`## 3. State\nleaked\n${SCAFFOLD}`)).toBeNull()
  })

  it('ignores a locked heading quoted mid-line inside block 4', () => {
    // The dormant leak the adversarial pass found. Anchoring headings to line
    // starts is what makes this safe: the quoted copy is not at a line start, so
    // the cut still lands on the real heading and block 4 goes with the secrets.
    const prompt = [
      '## 1. Setup', 'x',
      '## 2. Constants', 'SECRET-CONSTANT',
      '## 3. State', 'SECRET-STATE',
      '## 4. Tree',
      'div title="## 5. Why (quoted in markup)"',
      'SECRET-B4-REMAINDER',
      '## 5. Why', '- public',
    ].join('\n')
    const out = splitPromptAtPaywall(prompt)
    expect(out).not.toBeNull()
    const shipped = `${out!.head}\n${out!.tail}`
    expect(shipped).not.toContain('SECRET-CONSTANT')
    expect(shipped).not.toContain('SECRET-STATE')
    expect(shipped).not.toContain('SECRET-B4-REMAINDER')
    expect(shipped).toContain('## 5. Why')
  })

  it('refuses to split when a locked heading genuinely repeats at line start', () => {
    const prompt = [
      '## 1. Setup', 'x',
      '## 2. Constants', 'SECRET-CONSTANT',
      '## 3. State', 'SECRET-STATE',
      '## 4. Tree', 'SECRET-TREE',
      '## 5. Why', '- public',
      '## 5. Why', '- duplicated heading, ambiguous cut',
    ].join('\n')
    expect(splitPromptAtPaywall(prompt)).toBeNull()
  })
})
