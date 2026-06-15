// Pure metadata for Andromeda components. NO Node APIs here — this file is
// safe to import from client components (sidebar, demos, etc.). The full
// registry (which reads source files via `fs`) lives in
// `andromeda-registry.ts` and imports this file as the metadata source.

export type AndromedaComponentMeta = {
  slug: string
  name: string
  description: string
  sourceFile: string
  image?: string
}

export const ANDROMEDA_COMPONENT_META: AndromedaComponentMeta[] = [
  {
    slug: 'alert',
    name: 'Alert',
    description:
      'Banner-style status component for inline messages. Default, accent, warning, fault — each with its own icon color and title color.',
    sourceFile: 'Alert.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/alert.png?v=2',
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    description:
      'Square initials tile in 3 sizes. Initials derived from name; optional status dot in 4 states.',
    sourceFile: 'Avatar.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/avatar.png?v=2',
  },
  {
    slug: 'badge',
    name: 'Badge',
    description: '6 variants for status, metric tags, and inline labels.',
    sourceFile: 'Badge.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/badge.png?v=2',
  },
  {
    slug: 'button',
    name: 'Button',
    description:
      '5 variants × 3 sizes with full hover, focus, active, and disabled coverage. shadcn/ui-aligned API: variant, size, asChild.',
    sourceFile: 'Button.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/button.png?v=2',
  },
  {
    slug: 'card',
    name: 'Card',
    description:
      'Compound primitive: Card / Header / Content / Footer / Title / Description. No continuous border — corner brackets do the framing.',
    sourceFile: 'Card.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/card.png?v=2',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description:
      'Square boolean control. Controlled or uncontrolled. Inline label, accent fill on checked.',
    sourceFile: 'Checkbox.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/checkbox.png?v=2',
  },
  {
    slug: 'corner-markers',
    name: 'Corner Markers',
    description:
      'The defining motif. 4 L-shaped brackets at the corners of the nearest position:relative ancestor.',
    sourceFile: 'CornerMarkers.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/corner-markers.png?v=2',
  },
  {
    slug: 'date-range-picker',
    name: 'Date Range Picker',
    description:
      'Trigger chip + drop-down calendar panel. Anchor-then-confirm range selection with hover preview, Monday-first grid, ESC and click-outside to close.',
    sourceFile: 'DateRangePicker.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/date-range-picker.png?v=2',
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    description:
      'Right-side slide-in panel with backdrop, ESC to close, body scroll lock, and the bracket motif. Portaled.',
    sourceFile: 'Drawer.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/drawer.png?v=2',
  },
  {
    slug: 'empty-state',
    name: 'Empty State',
    description:
      'Centered icon + uppercase mono title + sans description + optional action. Built on Card so it inherits brackets.',
    sourceFile: 'EmptyState.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/empty-state.png?v=2',
  },
  {
    slug: 'heat-grid',
    name: 'Heat Grid',
    description:
      'A 2-D matrix fill gauge — the cousin of ProgressBar. Cells fill from the bottom-centre outward in a widening pyramid as the value rises, with a dim-to-bright accent ramp toward the wave front. Scroll-gated fill, optional percentage readout.',
    sourceFile: 'HeatGrid.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/heat-grid.png?v=2',
  },
  {
    slug: 'icon-button',
    name: 'Icon Button',
    description:
      'Square label-less companion to Button. Same variant + size vocabulary so it lines up with Button on the same baseline.',
    sourceFile: 'IconButton.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/icon-button.png?v=2',
  },
  {
    slug: 'input',
    name: 'Input',
    description:
      'Optional uppercase mono label, optional left icon, default + error states. Border transitions on focus.',
    sourceFile: 'Input.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/input.png?v=2',
  },
  {
    slug: 'nav-item',
    name: 'Nav Item',
    description:
      'Sidebar item with icon, active state, accent left bar. Mono label by default; sans available.',
    sourceFile: 'NavItem.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/nav-item.png?v=2',
  },
  {
    slug: 'panel-header',
    name: 'Panel Header',
    description:
      'Title row for top-level dashboard panels. Sentence-case mono title on the left, optional actions slot on the right (PanelMenu, IconButton, Button). Bottom border for separation.',
    sourceFile: 'PanelHeader.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/panel-header.png?v=2',
  },
  {
    slug: 'panel-menu',
    name: 'Panel Menu',
    description:
      'Kebab-trigger overflow menu for panel headers. Items can have icons, separators, and a single level of right-flyout submenu. Closes on outside click and Escape.',
    sourceFile: 'PanelMenu.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/panel-menu.png?v=2',
  },
  {
    slug: 'progress-bar',
    name: 'Progress Bar',
    description:
      '3 variants. 3px tall track with a gradient fill and soft glow halo. Smooth width transitions.',
    sourceFile: 'ProgressBar.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/progress-bar.png?v=2',
  },
  {
    slug: 'radar-chart',
    name: 'Radar Chart',
    description:
      'Polygon spider chart for multi-axis system diagnostics. Single or multiple overlapping series.',
    sourceFile: 'RadarChart.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/radar-chart.png?v=2',
  },
  {
    slug: 'radio',
    name: 'Radio',
    description:
      'Mutually-exclusive square radio. Standalone or inside a RadioGroup wiring up name, value, onValueChange.',
    sourceFile: 'Radio.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/radio.png?v=2',
  },
  {
    slug: 'search-field',
    name: 'Search Field',
    description:
      'Command-bar-style search input with optional ⌘-K shortcut chip. Five states — idle, hover, focus, text-inactive (placeholder), text-active (typed). Controlled or uncontrolled.',
    sourceFile: 'SearchField.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/search-field.png?v=2',
  },
  {
    slug: 'segmented-control',
    name: 'Segmented Control',
    description:
      'Row of icon-or-label buttons that share a single border. The active background slides between segments on selection. Sized sm/md/lg to match the row baseline.',
    sourceFile: 'SegmentedControl.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/segmented-control.png?v=2',
  },
  {
    slug: 'slider',
    name: 'Slider',
    description:
      'Custom horizontal range. Pointer drag + full keyboard support. ARIA-compliant.',
    sourceFile: 'Slider.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/slider.png?v=2',
  },
  {
    slug: 'spinner',
    name: 'Spinner',
    description:
      'SVG arc that rotates via a CSS keyframe — runs on the compositor. 4 color variants × 3 sizes.',
    sourceFile: 'Spinner.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/spinner.png?v=2',
  },
  {
    slug: 'stat-tile',
    name: 'Stat Tile',
    description:
      'Stat readout built on Card. Big numeric value, optional unit, optional ▲/▼ delta colored by sign.',
    sourceFile: 'StatTile.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/stat-tile.png?v=2',
  },
  {
    slug: 'tag',
    name: 'Tag',
    description:
      'Compact uppercase mono label. 4 variants. Optional dismiss button when onClose is provided.',
    sourceFile: 'Tag.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/tag.png?v=2',
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    description:
      'Multi-line counterpart to Input. Same border / focus / error behavior, vertical resize.',
    sourceFile: 'Textarea.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/textarea.png?v=2',
  },
  {
    slug: 'toggle',
    name: 'Toggle',
    description:
      'Sharp rectangular track + sliding rectangular thumb. Same vocabulary as Checkbox, but feels like a hardware switch.',
    sourceFile: 'Toggle.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/toggle.png?v=2',
  },
  {
    slug: 'table',
    name: 'Table',
    description:
      'Compound data-table primitive: Table / TableHead / TableBody / TableRow / TableHeader / TableCell. Sortable column headers, row hover lift, selected-row accent edge.',
    sourceFile: 'Table.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/table.png?v=2',
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description:
      'Hover label for icon-only controls. Wraps any child, floats above or below, sharp corners, mono uppercase text.',
    sourceFile: 'Tooltip.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/tooltip.png?v=2',
  },
  {
    slug: 'trend-chart',
    name: 'Trend Chart',
    description:
      'The canonical multi-series time-series chart. One configurable component that renders as line, area, or bar with a built-in mode toggle, custom tooltip, and toggleable legend. Series colour follows the multi-series hierarchy (baseline / live / context / threshold). Scroll-gated reveal.',
    sourceFile: 'TrendChart.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/trend-chart.png?v=2',
  },
  {
    slug: 'user-card',
    name: 'User Card',
    description:
      'Wider user trigger that shows avatar, name, and role alongside the chevron — the canonical bottom-of-sidebar identity card. Same Profile / Preferences / Sign Out popover as User Menu; opens upward by default and stretches to the card width.',
    sourceFile: 'UserCard.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/user-card.png?v=2',
  },
  {
    slug: 'user-menu',
    name: 'User Menu',
    description:
      'Avatar-trigger popover with Profile, Preferences, Sign Out and friends. Designed for top-bar slots where space is tight. Opens downward and right-aligned by default; closes on outside-click and Escape.',
    sourceFile: 'UserMenu.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/user-menu.png?v=2',
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
