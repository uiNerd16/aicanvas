// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// ANDROMEDA DESIGN TOKENS
// Sci-fi / blueprint aesthetic. Fully transparent surfaces
// designed to sit on top of a background image.
// Few colors, soft gradients, sharp 1px borders, corner markers.
// ============================================================

export const tokens = {
  color: {
    // Text — pure white with alpha steps
    text: {
      primary:   'rgba(255, 255, 255, 0.96)',
      secondary: 'rgba(255, 255, 255, 0.62)',
      muted:     'rgba(255, 255, 255, 0.38)',
      faint:     'rgba(255, 255, 255, 0.22)',
    },
    // Surfaces — every surface is transparent except the page background
    surface: {
      void:    '#0E0E0F',              // Page background — the dark canvas
      base:    'transparent',
      raised:  'rgba(255, 255, 255, 0.025)',
      overlay: 'rgba(255, 255, 255, 0.045)',
      hover:   'rgba(255, 255, 255, 0.06)',
      active:  'rgba(255, 255, 255, 0.09)',
    },
    // Borders — also white-with-alpha
    border: {
      subtle: 'rgba(255, 255, 255, 0.04)',
      base:   'rgba(255, 255, 255, 0.08)',
      bright: 'rgba(255, 255, 255, 0.32)',
      strong: 'rgba(255, 255, 255, 0.55)',
    },
    // The single hue accent — electric blue
    accent: {
      base:    '#60A5FA',
      bright:  '#93C5FD',
      dim:     'rgba(96, 165, 250, 0.55)',
      glow:    'rgba(96, 165, 250, 0.18)',
      glowSoft:'rgba(96, 165, 250, 0.08)',
    },
    // Two semantic colors — that's it
    warning: '#F5A524',
    fault:   '#EF4444',
    // Tinted alpha variants of the semantic colors so semantic
    // surfaces/borders don't need to hardcode rgba() literals.
    warningDim:  'rgba(245, 165, 36, 0.45)',
    warningGlow: 'rgba(245, 165, 36, 0.08)',
    warningRing: 'rgba(245, 165, 36, 0.25)',
    faultDim:    'rgba(239, 68, 68, 0.50)',
    faultGlow:   'rgba(239, 68, 68, 0.10)',
    faultRing:   'rgba(239, 68, 68, 0.25)',
    // Soft gradients (used for accent fills, glow sweeps)
    gradient: {
      accentFade:  'linear-gradient(180deg, rgba(96,165,250,0.25) 0%, rgba(96,165,250,0) 100%)',
      accentSweep: 'linear-gradient(135deg, rgba(96,165,250,0.18) 0%, rgba(96,165,250,0.02) 50%, transparent 100%)',
      surfaceSoft: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
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
};
