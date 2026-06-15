import { describe, it, expect } from 'vitest'
import { classifyContent, type ContentLookup } from './content-type'

const lookup: ContentLookup = {
  designSystemSlugs: new Set(['andromeda-card']),
  templateSlugs: new Set(['andromeda-mission-control', 'andromeda-service-order']),
  systemSlugs: new Set(['andromeda']),
}

describe('classifyContent', () => {
  it('classifies a plain standalone', () => {
    expect(classifyContent('glass-navbar', lookup)).toBe('standalone')
  })

  it('keeps a name-colliding standalone as standalone (andromeda-button is NOT the system)', () => {
    expect(classifyContent('andromeda-button', lookup)).toBe('standalone')
  })

  it('classifies a real design-system component', () => {
    expect(classifyContent('andromeda-card', lookup)).toBe('design-system')
  })

  it('classifies a template', () => {
    expect(classifyContent('andromeda-mission-control', lookup)).toBe('template')
  })

  it('classifies the whole-system aggregates', () => {
    expect(classifyContent('andromeda', lookup)).toBe('design-system')
    expect(classifyContent('andromeda-all', lookup)).toBe('design-system')
    expect(classifyContent('andromeda-tokens', lookup)).toBe('design-system')
  })

  it('classifies catalog/meta files', () => {
    expect(classifyContent('registry', lookup)).toBe('meta')
    expect(classifyContent('aicanvas-mcp', lookup)).toBe('meta')
  })

  it('strips a .json suffix before classifying', () => {
    expect(classifyContent('andromeda-all.json', lookup)).toBe('design-system')
    expect(classifyContent('glass-navbar.json', lookup)).toBe('standalone')
  })
})
