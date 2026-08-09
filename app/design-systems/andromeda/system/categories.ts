// Gallery taxonomy. Andromeda's component metadata carries no category (Lumen's
// registry does), so the grouping lives here rather than being invented at
// render time. Sections sort by size, so a category with more components leads.
//
// A new component must be added here or it lands in "Other" — visible, never
// dropped.
export const CATEGORY: Record<string, string> = {
  // Forms
  input: 'Forms',
  textarea: 'Forms',
  'search-field': 'Forms',
  checkbox: 'Forms',
  radio: 'Forms',
  toggle: 'Forms',
  slider: 'Forms',
  'segmented-control': 'Forms',
  'date-range-picker': 'Forms',

  // Data display
  table: 'Data display',
  'data-table': 'Data display',
  'stat-tile': 'Data display',
  'progress-bar': 'Data display',
  'heat-grid': 'Data display',
  badge: 'Data display',
  tag: 'Data display',
  avatar: 'Data display',

  // Charts
  'trend-chart': 'Charts',
  'metric-chart': 'Charts',
  'radar-chart': 'Charts',
  'funnel-chart': 'Charts',
  gauge: 'Charts',
  waveform: 'Charts',

  // Overlays
  'panel-menu': 'Overlays',
  'user-menu': 'Overlays',
  'user-card': 'Overlays',
  drawer: 'Overlays',
  tooltip: 'Overlays',

  // Feedback
  alert: 'Feedback',
  'empty-state': 'Feedback',
  spinner: 'Feedback',

  // Actions
  button: 'Actions',
  'icon-button': 'Actions',

  // Navigation
  'nav-item': 'Navigation',
  'panel-header': 'Navigation',

  // Surfaces
  card: 'Surfaces',
  'corner-markers': 'Surfaces',

  // Media
  'media-card': 'Media',
  'music-player': 'Media',

  // Visualization
  planet: 'Visualization',
}
