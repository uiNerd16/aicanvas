import { describe, it, expect } from 'vitest'
import { classifyContent, type ContentLookup } from './content-type'

const lookup: ContentLookup = {
  designSystemSlugs: new Set(['andromeda-card']),
  templateSlugs: new Set(['andromeda-mission-control', 'andromeda-service-order']),
  systemSlugs: new Set(['andromeda']),
  premiumSlugs: new Set(['aurora-pricing-table']),
  brainSlugs: new Set(['andromeda-brain']),
}

describe('classifyContent', () => {
  it('classifies a plain standalone', () => {
    expect(classifyContent('glass-navbar', lookup)).toBe('standalone')
  })

  it('classifies a premium standalone (gated, not free)', () => {
    expect(classifyContent('aurora-pricing-table', lookup)).toBe('premium-standalone')
    expect(classifyContent('aurora-pricing-table.json', lookup)).toBe('premium-standalone')
  })

  it('a non-listed standalone stays free even if premiumSlugs is non-empty', () => {
    expect(classifyContent('glass-navbar', lookup)).toBe('standalone')
  })

  it('keeps a name-colliding standalone as standalone (andromeda-button is NOT the system)', () => {
    expect(classifyContent('andromeda-button', lookup)).toBe('standalone')
  })

  it('classifies an individual design-system component as metered (not premium)', () => {
    // Individual components are free-metered like standalones; only templates
    // and whole-system aggregates stay premium.
    expect(classifyContent('andromeda-card', lookup)).toBe('design-system-component')
  })

  it('classifies a template', () => {
    expect(classifyContent('andromeda-mission-control', lookup)).toBe('template')
  })

  it('classifies the whole-system aggregates', () => {
    expect(classifyContent('andromeda', lookup)).toBe('design-system')
    expect(classifyContent('andromeda-all', lookup)).toBe('design-system')
  })

  it('classifies a brain item as brain (gated), exact match only', () => {
    expect(classifyContent('andromeda-brain', lookup)).toBe('brain')
    expect(classifyContent('andromeda-brain.json', lookup)).toBe('brain')
    // a brain slug for a system without one stays a plain standalone
    expect(classifyContent('aurora-brain', lookup)).toBe('standalone')
  })

  it('classifies catalog/meta files', () => {
    expect(classifyContent('registry', lookup)).toBe('meta')
    expect(classifyContent('aicanvas-mcp', lookup)).toBe('meta')
    // the free token foundation is meta — uncounted, never gated (c3a3a1e)
    expect(classifyContent('andromeda-tokens', lookup)).toBe('meta')
  })

  it('strips a .json suffix before classifying', () => {
    expect(classifyContent('andromeda-all.json', lookup)).toBe('design-system')
    expect(classifyContent('glass-navbar.json', lookup)).toBe('standalone')
  })
})
