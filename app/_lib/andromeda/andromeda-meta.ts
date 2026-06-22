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
      'Banner-style status component for inline messages. Default, accent, warning, fault — each with its own per-variant color set. Severity-aware ARIA (warning and fault announce assertively, the rest politely) and compound parts: AlertIcon, AlertContent, AlertTitle, AlertDescription.',
    sourceFile: 'Alert.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/alert.png?v=5',
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    description:
      'Square tile in 3 sizes. Shows an image when src is provided, with a fallback to initials; optional status bar in 4 states.',
    sourceFile: 'Avatar.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/avatar.png?v=3',
  },
  {
    slug: 'badge',
    name: 'Badge',
    description:
      '6 variants for status, metric tags, and inline labels. A leading per-variant status dot blinks on a loop to carry the signal, and holds steady when reduced motion is requested.',
    sourceFile: 'Badge.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/badge.png?v=3',
  },
  {
    slug: 'button',
    name: 'Button',
    description:
      '5 variants × 3 sizes with full hover, focus, active, and disabled coverage. shadcn/ui-aligned API: variant, size, asChild.',
    sourceFile: 'Button.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/button.png?v=4',
  },
  {
    slug: 'card',
    name: 'Card',
    description:
      'Compound primitive: Card / Header / Content / Footer / Title / Description. Corner brackets do the framing by default, with a bordered toggle for a continuous 1px border and a glow variant that adds an accent tint.',
    sourceFile: 'Card.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/card.png?v=4',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description:
      'Square boolean control. Controlled or uncontrolled. Inline label, accent fill on checked, an accent focus ring, a press scale, a pop-in on the checkmark, and a 40px touch target on coarse pointers.',
    sourceFile: 'Checkbox.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/checkbox.png?v=3',
  },
  {
    slug: 'corner-markers',
    name: 'Corner Markers',
    description:
      'The defining motif. 4 L-shaped brackets at the corners of the nearest position:relative ancestor.',
    sourceFile: 'CornerMarkers.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/corner-markers.png?v=3',
  },
  {
    slug: 'date-range-picker',
    name: 'Date Range Picker',
    description:
      'Trigger chip + drop-down calendar panel. Anchor-then-confirm range selection with hover preview, Monday-first grid, ESC and click-outside to close.',
    sourceFile: 'DateRangePicker.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/date-range-picker.png?v=4',
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    description:
      'Slide-in panel on any side (left, right, top, or bottom), with focus trap and a size prop. Backdrop, ESC to close, body scroll lock, and the bracket motif. Portaled.',
    sourceFile: 'Drawer.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/drawer.png?v=3',
  },
  {
    slug: 'empty-state',
    name: 'Empty State',
    description:
      'Centered icon + uppercase mono title + sans description + optional action. Built on Card so it inherits brackets.',
    sourceFile: 'EmptyState.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/empty-state.png?v=3',
  },
  {
    slug: 'heat-grid',
    name: 'Heat Grid',
    description:
      'A 2-D matrix fill gauge — the cousin of ProgressBar. Cells fill from the bottom-centre outward in a widening pyramid as the value rises, with a dim-to-bright accent ramp toward the wave front. Scroll-gated fill, optional percentage readout.',
    sourceFile: 'HeatGrid.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/heat-grid.png?v=4',
  },
  {
    slug: 'icon-button',
    name: 'Icon Button',
    description:
      'Square label-less companion to Button. Same variant + size vocabulary so it lines up with Button on the same baseline.',
    sourceFile: 'IconButton.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/icon-button.png?v=3',
  },
  {
    slug: 'input',
    name: 'Input',
    description:
      'Optional uppercase mono label, optional left icon, default + error states. Border transitions on focus.',
    sourceFile: 'Input.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/input.png?v=4',
  },
  {
    slug: 'nav-item',
    name: 'Nav Item',
    description:
      'Sidebar item with icon, active state, right-edge indicator dot. Mono label by default; sans available.',
    sourceFile: 'NavItem.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/nav-item.png?v=4',
  },
  {
    slug: 'panel-header',
    name: 'Panel Header',
    description:
      'Title row for top-level dashboard panels. Sentence-case mono title on the left, optional actions slot on the right (PanelMenu, IconButton, Button). Inset bottom divider.',
    sourceFile: 'PanelHeader.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/panel-header.png?v=3',
  },
  {
    slug: 'panel-menu',
    name: 'Panel Menu',
    description:
      'Kebab-trigger overflow menu for panel headers. Items can have icons, separators, and a single level of right-flyout submenu. Closes on outside click and Escape.',
    sourceFile: 'PanelMenu.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/panel-menu.png?v=4',
  },
  {
    slug: 'planet',
    name: 'Planet',
    description:
      'A slowly rotating 3D particle sphere built with Three.js, lit from one side, with every particle colored from the Andromeda accent ramp so it follows the system palette. The canvas is transparent, so drop it inside a Card and the void shows through.',
    sourceFile: 'Planet.tsx',
  },
  {
    slug: 'progress-bar',
    name: 'Progress Bar',
    description:
      '3 status variants. 30 skewed segments fill left to right with a scroll-gated staggered cascade.',
    sourceFile: 'ProgressBar.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/progress-bar.png?v=4',
  },
  {
    slug: 'radar-chart',
    name: 'Radar Chart',
    description:
      'Polygon spider chart for multi-axis system diagnostics. Single or multiple overlapping series.',
    sourceFile: 'RadarChart.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/radar-chart.png?v=3',
  },
  {
    slug: 'radio',
    name: 'Radio',
    description:
      'Mutually-exclusive square radio. Standalone or inside a RadioGroup wiring up name, value, onValueChange.',
    sourceFile: 'Radio.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/radio.png?v=3',
  },
  {
    slug: 'search-field',
    name: 'Search Field',
    description:
      'Command-bar-style search input with optional ⌘-K shortcut chip. Five states — idle, hover, focus, text-inactive (placeholder), text-active (typed). Controlled or uncontrolled.',
    sourceFile: 'SearchField.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/search-field.png?v=4',
  },
  {
    slug: 'segmented-control',
    name: 'Segmented Control',
    description:
      'Row of icon-or-label buttons that share a single border. The active background slides between segments on selection. Sized sm/md/lg to match the row baseline.',
    sourceFile: 'SegmentedControl.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/segmented-control.png?v=3',
  },
  {
    slug: 'slider',
    name: 'Slider',
    description:
      'Custom horizontal range. Pointer drag + full keyboard support. ARIA-compliant.',
    sourceFile: 'Slider.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/slider.png?v=4',
  },
  {
    slug: 'spinner',
    name: 'Spinner',
    description:
      'A 3x3 pixel grid with a snake-game trail cycling via a single CSS keyframe, running on the compositor. 4 color variants and 3 sizes.',
    sourceFile: 'Spinner.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/spinner.png?v=3',
  },
  {
    slug: 'stat-tile',
    name: 'Stat Tile',
    description:
      'Stat readout built on Card. Big numeric value, optional unit, optional ▲/▼ delta colored by sign. Scroll-aware count-up on first view, a live mode that snaps to new values, a per-digit odometer roll (liveRoll), and a top-right code identifier prop.',
    sourceFile: 'StatTile.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/stat-tile.png?v=3',
  },
  {
    slug: 'tag',
    name: 'Tag',
    description:
      'Compact uppercase mono label. 4 variants. Optional dismiss button when onClose is provided.',
    sourceFile: 'Tag.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/tag.png?v=3',
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    description:
      'Multi-line counterpart to Input. Same border / focus / error behavior, vertical resize.',
    sourceFile: 'Textarea.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/textarea.png?v=3',
  },
  {
    slug: 'toggle',
    name: 'Toggle',
    description:
      'Sharp rectangular track + sliding rectangular thumb. Same vocabulary as Checkbox, but feels like a hardware switch.',
    sourceFile: 'Toggle.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/toggle.png?v=3',
  },
  {
    slug: 'table',
    name: 'Table',
    description:
      'Compound data-table primitive: Table / TableHead / TableBody / TableRow / TableHeader / TableCell. Sortable column headers, row hover highlight, selected-row accent edge. Render TableStyles once on the page to enable the hover styling.',
    sourceFile: 'Table.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/table.png?v=3',
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description:
      'Hover label for icon-only controls. Wraps any child, floats above or below, sharp corners, mono uppercase text. Shows on keyboard focus too, carries role="tooltip", and clamps itself away from the viewport edges.',
    sourceFile: 'Tooltip.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/tooltip.png?v=4',
  },
  {
    slug: 'trend-chart',
    name: 'Trend Chart',
    description:
      'The canonical multi-series time-series chart. One configurable component that renders as line, area, or bar with a built-in mode toggle, custom tooltip, and toggleable legend. Series colour follows the multi-series hierarchy (baseline / live / context / threshold). Scroll-gated reveal.',
    sourceFile: 'TrendChart.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/trend-chart.png?v=3',
  },
  {
    slug: 'user-card',
    name: 'User Card',
    description:
      'Wider user trigger that shows avatar, name, and role alongside the chevron, the canonical bottom-of-sidebar identity card. Same popover as User Menu, with menu rows supplied by the caller via an `items` prop; opens upward by default and stretches to the card width.',
    sourceFile: 'UserCard.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/user-card.png?v=3',
  },
  {
    slug: 'user-menu',
    name: 'User Menu',
    description:
      'Avatar-trigger popover whose menu rows are supplied by the caller via an `items` prop. Designed for top-bar slots where space is tight. Opens downward and right-aligned by default; closes on outside-click and Escape.',
    sourceFile: 'UserMenu.tsx',
    image: 'https://ik.imagekit.io/aitoolkit/andromeda/user-menu.png?v=3',
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
