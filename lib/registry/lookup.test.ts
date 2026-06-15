import { describe, it, expect } from 'vitest'
import { buildLookup, type GateManifest } from './manifest'
import { classifyContent } from './content-type'

// Mirrors the real generator output shape (registry-data/_manifest.json).
// Regression for the launch-blocking bug where designSystemSlugs was built
// from a registry flag nothing set, classifying every design-system
// component as a free standalone.
const manifest: GateManifest = {
  systemSlugs: ['andromeda'],
  designSystemSlugs: ['andromeda-alert', 'andromeda-card', 'andromeda-table'],
  templateSlugs: [
    'andromeda-mission-control',
    'andromeda-service-order',
    'andromeda-resource-planning',
    'andromeda-signal-room',
  ],
}

describe('buildLookup + classifyContent (manifest-driven gate)', () => {
  const lookup = buildLookup(manifest)

  it('individual design-system components are design-system, not standalone', () => {
    expect(classifyContent('andromeda-alert', lookup)).toBe('design-system')
    expect(classifyContent('andromeda-card.json', lookup)).toBe('design-system')
  })

  it('every template is gated, including signal-room', () => {
    for (const t of manifest.templateSlugs) {
      expect(classifyContent(t, lookup)).toBe('template')
    }
  })

  it('system aggregates are design-system', () => {
    expect(classifyContent('andromeda', lookup)).toBe('design-system')
    expect(classifyContent('andromeda-all', lookup)).toBe('design-system')
    expect(classifyContent('andromeda-tokens', lookup)).toBe('design-system')
  })

  it('the name-colliding free standalone stays standalone', () => {
    expect(classifyContent('andromeda-button', lookup)).toBe('standalone')
  })

  it('meta files stay meta', () => {
    expect(classifyContent('registry', lookup)).toBe('meta')
    expect(classifyContent('aicanvas-mcp', lookup)).toBe('meta')
  })
})
