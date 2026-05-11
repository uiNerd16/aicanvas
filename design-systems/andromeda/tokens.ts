// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// ANDROMEDA DESIGN TOKENS
// Sci-fi / blueprint aesthetic. Solid surfaces by default — every
// hue palette (accent, red, orange) ships as a 5-stop scale (100
// lightest → 500 darkest). One alpha token is allowed per family
// (color, border, surface) for cases that genuinely need layering.
// ============================================================

export const tokens = {
  color: {
    // Text — solid greys. No alpha. Tuned for WCAG AA on surface.base:
    // primary 17.7:1, secondary 8.3:1, muted 6.9:1, faint 3.5:1 (AA-large).
    text: {
      primary:   '#F5F5F5',
      secondary: '#A3A3A3',
      muted:     '#9A9A9A',
      faint:     '#6E6E6E',
    },
    // Surfaces — solid colors. `base` is the page void; nothing
    // else is transparent. `alpha` is the one allowed alpha
    // surface (modal scrim / drawer backdrop).
    surface: {
      base:    '#0E0E0F',
      raised:  '#141415',
      overlay: '#19191A',
      hover:   '#1C1C1D',
      active:  '#232325',
      alpha:   'rgba(0, 0, 0, 0.65)',
    },
    // Borders — solid greys + one alpha border for glassy edges.
    border: {
      subtle: '#212122',
      base:   '#3E3E3F',
      bright: '#5B5B5C',
      strong: '#939393',
      alpha:  'rgba(255, 255, 255, 0.18)',
    },
    // Accent — turquoise. 5 stops + 1 alpha (translucent overlay
    // derived from the 300 base, 0.25). The 100 stop pairs with
    // the 500 stop for body text (≥6:1 ratio).
    accent: {
      100:   '#BAF8EC',
      200:   '#56F0D6',
      300:   '#0FCFB2',
      400:   '#109380',
      500:   '#126059',
      alpha: 'rgba(15, 207, 178, 0.25)',
    },
    // Red — 5 stops + 1 alpha. Use 100 for body text on 500 (≥7:1).
    red: {
      100:   '#FFCFCF',
      200:   '#FF8B8B',
      300:   '#FF3939',
      400:   '#B82424',
      500:   '#5A1818',
      alpha: 'rgba(255, 57, 57, 0.25)',
    },
    // Orange — 5 stops + 1 alpha. Use 100 for body text on 500 (≥8:1).
    orange: {
      100:   '#FFE5B5',
      200:   '#FFC466',
      300:   '#FFA000',
      400:   '#B57009',
      500:   '#4D3712',
      alpha: 'rgba(255, 160, 0, 0.25)',
    },
    // Gradients fade to solid colors (no transparent stops).
    gradient: {
      accentFade:  'linear-gradient(180deg, #0A2422 0%, #0E0E0F 100%)',
      // Soft accent spotlight — a barely-visible accent tint blooms from
      // the top-left corner and fades smoothly back to surface.raised.
      // Used by Card variant="glow" to draw the eye without painting a
      // colored card.
      accentSweep: 'radial-gradient(ellipse 80% 70% at 0% 0%, #1B2C29 0%, #172321 25%, #141415 65%)',
      surfaceSoft: 'linear-gradient(180deg, #181819 0%, #111111 100%)',
    },
  },
  typography: {
    // JetBrains Mono is the only font in the Andromeda design system.
    // The --font-jetbrains-mono variable is provided by next/font
    // (see app/design-systems/andromeda/page.tsx). Both fontSans and fontMono
    // resolve to the same family — the sans/mono distinction is kept
    // only so existing component references continue to work unchanged.
    fontSans: "var(--font-jetbrains-mono), 'JetBrains Mono', 'IBM Plex Mono', Menlo, Monaco, Consolas, monospace",
    fontMono: "var(--font-jetbrains-mono), 'JetBrains Mono', 'IBM Plex Mono', Menlo, Monaco, Consolas, monospace",
    size: {
      xs:   '10px',
      sm:   '12px',
      md:   '14px',
      lg:   '15px',
      xl:   '18px',
      '2xl':'22px',
      '3xl':'28px',
      '4xl':'36px',
      '5xl':'48px',
    },
    weight: {
      thin:     200,
      regular:  400,
      medium:   500,
      semibold: 600,
      bold:     700,
    },
    lineHeight: {
      tight:   1.1,
      snug:    1.25,
      normal:  1.5,
    },
    tracking: {
      // Wide letter-spacing on monospace labels
      tight:  '0',
      normal: '0.02em',
      wide:   '0.08em',
      wider:  '0.14em',
      widest: '0.22em',
    },
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10:'40px',
    12:'48px',
  },
  radius: {
    // Sharp by default — square corners are part of the look
    none: '0',
    sm:   '2px',
    md:   '3px',
  },
  border: {
    thin: '1px solid',
  },
  marker: {
    // Corner marker geometry — L-shaped brackets that hug each corner.
    size:        12,    // px square the bracket lives inside
    offset:      0,     // px inset from the corner (0 = flush)
    borderWidth: 1,     // px stroke thickness of the L
  },
  layout: {
    sidebarWidth: '224px',
    headerHeight: '60px',
  },
  // Motion — durations, easings, and stagger presets that encode the
  // Andromeda tempo. Movement signals data movement or interaction
  // acknowledgement; never decoration. See `rules.md` → Motion for the
  // philosophy and approved/forbidden patterns.
  motion: {
    duration: {
      // Click acknowledgement (active flash, focus ring, button press).
      // Brief enough that the user reads it as feedback, not animation.
      fast:    '80ms',
      // Default state transitions: hover, popover caret rotation, anything
      // where the user changed their mind and wants to see the new state.
      normal:  '140ms',
      // Stateful trigger reveals (drawer slide, menu open). The motion
      // IS the visual answer to the click — slow enough to track, fast
      // enough not to feel laggy.
      slow:    '200ms',
      // Cascade entrances (ProgressBar segment fill, dashboard section
      // slide-in). Each element's own motion duration; stagger between
      // siblings is `motion.stagger.cascade`. 500ms is the calm read —
      // each element clearly arrives, the cascade doesn't feel hurried.
      cascade: '500ms',
      // Row reveals inside a table or log when its container scrolls
      // into view. Tighter than the section cascade because rows are
      // smaller visual elements; a 500ms reveal per row drags.
      row:     '350ms',
      // StatTile count-up. Long enough that the eye reads the value as
      // animating in, short enough that the final number is what the
      // user remembers.
      countup: '800ms',
    },
    easing: {
      // Material standard — accelerate then decelerate. Default for
      // anything that doesn't have a more specific reason.
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      // Ease-out — fast start, soft landing. Use for entrances (cascade,
      // hover-in) where the motion settles into a final state.
      out:      'cubic-bezier(0, 0, 0.2, 1)',
      // Ease-in — slow start, fast end. Use for exits (drawer close,
      // hover-out) where the motion is leaving the field.
      in:       'cubic-bezier(0.4, 0, 1, 1)',
      // Ease-in-out — symmetrical. Use for state-flip transitions where
      // start and end deserve the same weight.
      sharp:    'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    stagger: {
      // Cascade between siblings on entrance (top-to-bottom dashboard
      // load, list reveal). 60ms reads as a deliberate sequence, not
      // a cascade so fast it feels like a single event.
      cascade:     '60ms',
      // Row stagger inside a table or log. Tighter than section cascade
      // — long tables would otherwise feel like they take forever to
      // reveal. 40ms is fast enough to keep the user moving, slow
      // enough that the eye registers the cascade.
      row:         '40ms',
      // ProgressBar segment fill cascade. Tighter than entrance because
      // segments are visually adjacent — looser would read as choppy.
      progressBar: '120ms',
    },
  },
};
