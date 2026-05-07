/**
 * Design-system declarations — source of truth for both:
 *  - the registry generator (which emits multi-file `andromeda.json` and per-block JSONs)
 *  - the website (per-component "Part of Andromeda" affordance, BlockChrome metadata)
 *
 * Keeping this in `.mjs` means the build script and Next.js can both import it
 * without parsing TS or duplicating the data. New systems land here.
 */

/**
 * @typedef {Object} DesignSystemBlock
 * @property {string} slug         Registry slug, e.g. 'andromeda-mission-control'
 * @property {string} name         Human label for the block widget
 * @property {string} [domain]     Short domain tag (e.g. 'Sci-Fi', 'Finance')
 * @property {string} entryPath    Entry file relative to the system's `rootDir`.
 *                                 The generator walks transitive imports starting
 *                                 here and ships every file inside `rootDir` reached.
 */

/**
 * @typedef {Object} DesignSystem
 * @property {'andromeda'} slug
 * @property {string} name
 * @property {string} rootDir         Path from repo root. Layout is preserved verbatim
 *                                    so internal relative imports continue to resolve.
 * @property {string[]} tokenEntries  Foundation files (tokens, utils, system icons).
 *                                    Shipped as the `<slug>-tokens` registry item;
 *                                    every other item depends on it.
 * @property {string[]} systemEntries Component files. Shipped as the `<slug>` system
 *                                    item, which depends on `<slug>-tokens` so the
 *                                    foundation isn't duplicated. Walked transitively.
 * @property {DesignSystemBlock[]} blocks
 */

/** @type {DesignSystem[]} */
export const DESIGN_SYSTEMS = [
  {
    slug: 'andromeda',
    name: 'Andromeda',
    rootDir: 'design-systems/andromeda',
    tokenEntries: [
      'tokens.ts',
      'components/lib/utils.ts',
      'AndromedaIcon.tsx',
    ],
    systemEntries: [
      'components/Alert.tsx',
      'components/Avatar.tsx',
      'components/Badge.tsx',
      'components/Button.tsx',
      'components/Card.tsx',
      'components/Checkbox.tsx',
      'components/CornerMarkers.tsx',
      'components/DateRangePicker.tsx',
      'components/Drawer.tsx',
      'components/EmptyState.tsx',
      'components/IconButton.tsx',
      'components/Input.tsx',
      'components/NavItem.tsx',
      'components/PanelHeader.tsx',
      'components/PanelMenu.tsx',
      'components/Planet.tsx',
      'components/ProgressBar.tsx',
      'components/RadarChart.tsx',
      'components/Radio.tsx',
      'components/SegmentedControl.tsx',
      'components/Slider.tsx',
      'components/Spinner.tsx',
      'components/StatTile.tsx',
      'components/Table.tsx',
      'components/Tag.tsx',
      'components/Textarea.tsx',
      'components/Toggle.tsx',
      'components/Tooltip.tsx',
    ],
    blocks: [
      { slug: 'andromeda-mission-control',   name: 'Mission Control',   domain: 'Sci-Fi',     entryPath: 'examples/mission-control/index.tsx' },
      { slug: 'andromeda-service-order',     name: 'Service Order',     domain: 'Telecom',    entryPath: 'examples/service-order/index.tsx' },
      { slug: 'andromeda-exchange-terminal', name: 'Exchange Terminal', domain: 'Finance',    entryPath: 'examples/exchange-terminal/index.tsx' },
      { slug: 'andromeda-resource-planning', name: 'Resource Planning', domain: 'Operations', entryPath: 'examples/resource-planning/index.tsx' },
    ],
  },
]

export function getDesignSystem(slug) {
  return DESIGN_SYSTEMS.find((s) => s.slug === slug)
}

export function getDesignSystemBlock(slug) {
  for (const system of DESIGN_SYSTEMS) {
    const block = system.blocks.find((b) => b.slug === slug)
    if (block) return { system, block }
  }
  return undefined
}
