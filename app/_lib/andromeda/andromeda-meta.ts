// Pure metadata for Andromeda components. NO Node APIs here — this file is
// safe to import from client components (sidebar, demos, etc.). The full
// registry (which reads source files via `fs`) lives in
// `andromeda-registry.ts` and imports this file as the metadata source.

export type AndromedaComponentMeta = {
  slug: string
  name: string
  description: string
  sourceFile: string
}

export const ANDROMEDA_COMPONENT_META: AndromedaComponentMeta[] = [
  {
    slug: 'alert',
    name: 'Alert',
    description:
      'Banner-style status component for inline messages. Default, accent, warning, fault — each with its own icon color and title color.',
    sourceFile: 'Alert.tsx',
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    description:
      'Square initials tile in 3 sizes. Initials derived from name; optional status dot in 4 states.',
    sourceFile: 'Avatar.tsx',
  },
  {
    slug: 'badge',
    name: 'Badge',
    description: '6 variants for status, metric tags, and inline labels.',
    sourceFile: 'Badge.tsx',
  },
  {
    slug: 'button',
    name: 'Button',
    description:
      '5 variants × 3 sizes with full hover, focus, active, and disabled coverage. shadcn/ui-aligned API: variant, size, asChild.',
    sourceFile: 'Button.tsx',
  },
  {
    slug: 'card',
    name: 'Card',
    description:
      'Compound primitive: Card / Header / Content / Footer / Title / Description. No continuous border — corner brackets do the framing.',
    sourceFile: 'Card.tsx',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description:
      'Square boolean control. Controlled or uncontrolled. Inline label, accent fill on checked.',
    sourceFile: 'Checkbox.tsx',
  },
  {
    slug: 'corner-markers',
    name: 'Corner Markers',
    description:
      'The defining motif. 4 L-shaped brackets at the corners of the nearest position:relative ancestor.',
    sourceFile: 'CornerMarkers.tsx',
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    description:
      'Right-side slide-in panel with backdrop, ESC to close, body scroll lock, and the bracket motif. Portaled.',
    sourceFile: 'Drawer.tsx',
  },
  {
    slug: 'empty-state',
    name: 'Empty State',
    description:
      'Centered icon + uppercase mono title + sans description + optional action. Built on Card so it inherits brackets.',
    sourceFile: 'EmptyState.tsx',
  },
  {
    slug: 'input',
    name: 'Input',
    description:
      'Optional uppercase mono label, optional left icon, default + error states. Border transitions on focus.',
    sourceFile: 'Input.tsx',
  },
  {
    slug: 'nav-item',
    name: 'Nav Item',
    description:
      'Sidebar item with icon, active state, accent left bar. Mono label by default; sans available.',
    sourceFile: 'NavItem.tsx',
  },
  {
    slug: 'progress-bar',
    name: 'Progress Bar',
    description:
      '3 variants. 3px tall track with a gradient fill and soft glow halo. Smooth width transitions.',
    sourceFile: 'ProgressBar.tsx',
  },
  {
    slug: 'radar-chart',
    name: 'Radar Chart',
    description:
      'Polygon spider chart for multi-axis system diagnostics. Single or multiple overlapping series.',
    sourceFile: 'RadarChart.tsx',
  },
  {
    slug: 'radio',
    name: 'Radio',
    description:
      'Mutually-exclusive square radio. Standalone or inside a RadioGroup wiring up name, value, onValueChange.',
    sourceFile: 'Radio.tsx',
  },
  {
    slug: 'slider',
    name: 'Slider',
    description:
      'Custom horizontal range. Pointer drag + full keyboard support. ARIA-compliant.',
    sourceFile: 'Slider.tsx',
  },
  {
    slug: 'spinner',
    name: 'Spinner',
    description:
      'SVG arc that rotates via a CSS keyframe — runs on the compositor. 4 color variants × 3 sizes.',
    sourceFile: 'Spinner.tsx',
  },
  {
    slug: 'stat-tile',
    name: 'Stat Tile',
    description:
      'Stat readout built on Card. Big numeric value, optional unit, optional ▲/▼ delta colored by sign.',
    sourceFile: 'StatTile.tsx',
  },
  {
    slug: 'tag',
    name: 'Tag',
    description:
      'Compact uppercase mono label. 4 variants. Optional dismiss button when onClose is provided.',
    sourceFile: 'Tag.tsx',
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    description:
      'Multi-line counterpart to Input. Same border / focus / error behavior, vertical resize.',
    sourceFile: 'Textarea.tsx',
  },
  {
    slug: 'toggle',
    name: 'Toggle',
    description:
      'Sharp rectangular track + sliding rectangular thumb. Same vocabulary as Checkbox, but feels like a hardware switch.',
    sourceFile: 'Toggle.tsx',
  },
]

export const ANDROMEDA_META = {
  name: 'Andromeda',
  tagline: 'Sci-fi blueprint design system',
  description:
    'One typeface. Transparent surfaces over a void background. 1px corner brackets instead of card borders. Turquoise accent. A domain-agnostic visual language — works for fintech, crypto, AI, ops, dev tools, and anywhere an editorial, technical, high-density feel fits.',
  font: 'JetBrains Mono',
  accent: '#2DD4BF',
  void: '#0E0E0F',
} as const
