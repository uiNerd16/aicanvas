// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
//
// Andromeda v1: free and open source (MIT). These components and tokens
// are free to use, forever. This public repo is frozen at v1; new
// Andromeda components are developed privately and are not published
// here (they stay free to use via the platform).
//
// Andromeda v2 is premium: the full design brain (deep rules + build
// workflow), the template library, and one-command bulk install.
// https://aicanvas.me/andromeda
//
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
      alpha:   'rgba(0, 0, 0, 0.6)',
    },
    // Borders — four solid greys. There was a fifth, `alpha`, a white
    // translucent "glassy edge"; it was deleted 2026-08-10 with zero consumers
    // in 40 components. A token nobody reaches for is a suggestion, not a
    // system: it invites a second edge treatment beside these four.
    border: {
      subtle: '#212122',
      base:   '#3E3E3F',
      bright: '#5B5B5C',
      strong: '#939393',
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
      alpha: 'rgba(15, 207, 178, 0.1)',
      // Text/icon ON an accent-filled surface. The one guaranteed-contrast
      // pairing token — every accent fill takes its foreground from here so
      // a theme retuning the family keeps labels legible. Defaults to the
      // 100 stop (documented ≥6:1 on the 500 stop).
      on:    '#BAF8EC',
    },
    // Red — 5 stops + 1 alpha. Use 100 for body text on 500 (≥7:1).
    red: {
      100:   '#FFCFCF',
      200:   '#FF8B8B',
      300:   '#FF3939',
      400:   '#B82424',
      500:   '#5A1818',
      alpha: 'rgba(255, 57, 57, 0.1)',
      on:    '#FFCFCF',
    },
    // Orange — 5 stops + 1 alpha. Use 100 for body text on 500 (≥8:1).
    orange: {
      100:   '#FFE5B5',
      200:   '#FFC466',
      300:   '#FFA000',
      400:   '#B57009',
      500:   '#4D3712',
      alpha: 'rgba(255, 160, 0, 0.1)',
      on:    '#FFE5B5',
    },
    // Gradients fade to solid colors (no transparent stops).
    gradient: {
      accentFade:  'linear-gradient(180deg, #0A2422 0%, #0E0E0F 100%)',
      // Soft accent spotlight — a barely-visible accent tint blooms from
      // the top-left corner and fades smoothly back to surface.raised.
      // Used by Card variant="glow" to draw the eye without painting a
      // colored card.
      accentSweep: 'radial-gradient(ellipse 80% 70% at 0% 0%, #1B2C29 0%, #172321 25%, #141415 65%)',
      // The louder twin of accentSweep: the top-left bloom at roughly 2x, plus
      // a small counter-light in the opposite corner so the card reads as lit
      // from one side rather than tinted all over. Two layers, and the LAST one
      // listed is the base — it is the only opaque one, so it lands on
      // surface.raised exactly like accentSweep does. The small layer fades to
      // rgba(20,20,21,0), the transparent form of surface.raised, so it never
      // greys out where it meets the base.
      accentSweepDual:
        'radial-gradient(ellipse 42% 38% at 100% 100%, rgba(31,54,50,0.95) 0%, rgba(23,35,33,0.5) 45%, rgba(20,20,21,0) 72%), ' +
        'radial-gradient(ellipse 160% 140% at 0% 0%, #1F3632 0%, #172321 28%, #141415 62%)',
      surfaceSoft: 'linear-gradient(180deg, #181819 0%, #111111 100%)',
    },
  },
  typography: {
    // JetBrains Mono is the only font in the Andromeda design system.
    // In the AI Canvas app, --font-jetbrains-mono is provided by next/font (see
    // app/design-systems/andromeda/layout.tsx). Installed projects don't have it,
    // so the var carries an INNER fallback ('JetBrains Mono Variable'). Without an
    // inner fallback, an undefined var invalidates the WHOLE declaration (invalid
    // at computed-value time) and the named fallbacks below never apply — the font
    // collapses to the page's inherited font. The registry self-loads
    // 'JetBrains Mono Variable' via @fontsource-variable so the fallback resolves.
    // Both fontSans and fontMono resolve to the same family — the sans/mono
    // distinction is kept only so existing component references work unchanged.
    fontSans: "var(--font-jetbrains-mono, 'JetBrains Mono Variable'), 'JetBrains Mono', 'IBM Plex Mono', Menlo, Monaco, Consolas, monospace",
    fontMono: "var(--font-jetbrains-mono, 'JetBrains Mono Variable'), 'JetBrains Mono', 'IBM Plex Mono', Menlo, Monaco, Consolas, monospace",
    // Modifier / symbol glyphs (⌘ ⌥ ⇧ ⌃ ⏎ ⌫ ⎋). JetBrains Mono is loaded with
    // subsets ['latin'] and none of the unicode-ranges it serves covers U+2318,
    // so the browser ALWAYS draws the command glyph from some fallback family,
    // whichever the machine happens to offer, and that family sets the symbol
    // well below JetBrains' cap height. Naming the fallback here makes the
    // substitution deliberate and identical everywhere, instead of every
    // component that renders a shortcut rediscovering the same diagnosis.
    fontSymbol: "Menlo, 'Segoe UI Symbol', 'Noto Sans Symbols 2', 'Apple Symbols', monospace",
    // Optical step-up for a fontSymbol glyph so it reads at the same weight as
    // the JetBrains text beside it. Unitless on purpose: multiply it into an
    // `em` font-size, and divide it back out of the line-height so the taller
    // glyph does not grow the line box it sits in. Retune if the first family
    // in fontSymbol changes; 1.25 is an optical match against Menlo.
    symbolScale: 1.25,
    // Set 2026-08-11. A component's SIZE STEP decides its type size:
    // size="sm" → 12px (sm), size="md" → 14px (md), size="lg" → 16px (lg).
    // That ruling moved lg 15 → 16 and inserted a 20px step, so every key
    // above 18px shifted up one NAME while keeping its exact PIXEL value
    // (old 2xl 22 → 3xl, 3xl 28 → 4xl, 4xl 36 → 5xl, 5xl 48 → 6xl).
    // LEGIBILITY FLOOR: interactive text never below 12px (sm). xs (10px) is
    // for decorative/metadata labels only — things that are read, not clicked.
    size: {
      xs:   '10px',
      sm:   '12px',
      md:   '14px',
      lg:   '16px',
      xl:   '18px',
      '2xl':'20px',
      '3xl':'22px',
      '4xl':'28px',
      '5xl':'36px',
      '6xl':'48px',
    },
    weight: {
      thin:     200,
      regular:  400,
      medium:   500,
      semibold: 600,
      bold:     700,
    },
    lineHeight: {
      none:    1,
      tight:   1.1,
      snug:    1.25,
      normal:  1.5,
      relaxed: 1.6,
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
    // The one half-step. A 4px grid cannot express the gap between an icon and
    // its label: 4px reads as a collision, 8px reads as two separate things.
    // Added 2026-08-10 for exactly that, and it is the only sub-grid stop the
    // system gets — reach for it inside a control, never for layout.
    1.5: '6px',
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
    // The one radius every framed surface consumes (cards, buttons, inputs,
    // menus, tiles). 0 = the square identity. Same var-with-fallback pattern
    // as border.thin below, so INLINE styles consuming tokens.radius.frame
    // are theme-tunable too; andromedaVars() emits the raw 0px default for
    // --andromeda-radius-frame (it must not self-reference this string).
    // `none` stays a true constant zero for explicit square declarations.
    frame: 'var(--andromeda-radius-frame, 0px)',
  },
  opacity: {
    // Disabled controls. One system-wide constant so every primitive and
    // input dims identically. Exposed as --andromeda-opacity-disabled.
    disabled: 0.4,
  },
  // Icon glyph sizes (numbers — Phosphor `size` props and SVG boxes need
  // numerics). One authoritative scale instead of per-component px.
  iconSize: {
    xs: 12,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
  },
  // Effects — frosted-glass blur radii and the accent hover/focus glow
  // radius. Exposed as --andromeda-blur-sm/-lg and --andromeda-glow.
  effect: {
    blurSm: '2px',
    blurLg: '8px',
    glow:   '8px',
    // Drop-shadow system. Four PRIMITIVES a theme can tune (color, x, y,
    // blur), then three SIZE TIERS composed from them. The tiers scale the
    // offset + blur so a large panel casts a deeper shadow than a small chip
    // — one control set retunes every tier at once. Components pick the tier
    // that matches their footprint (chips → sm, menus/popovers → md, drawers
    // / big panels → lg). Default is a soft near-black elevation, close to
    // the ad-hoc shadows components used before.
    shadowColor: 'rgba(0, 0, 0, 0.45)',
    shadowX:     '0px',
    shadowY:     '10px',
    shadowBlur:  '24px',
    // Tier strings reference the primitive vars (with the token defaults as
    // fallbacks) so tuning any primitive reflows all three tiers live.
    shadowSm: 'var(--andromeda-shadow-x, 0px) calc(var(--andromeda-shadow-y, 10px) * 0.4) calc(var(--andromeda-shadow-blur, 24px) * 0.4) var(--andromeda-shadow-color, rgba(0, 0, 0, 0.45))',
    shadowMd: 'var(--andromeda-shadow-x, 0px) calc(var(--andromeda-shadow-y, 10px) * 0.8) calc(var(--andromeda-shadow-blur, 24px) * 0.9) var(--andromeda-shadow-color, rgba(0, 0, 0, 0.45))',
    shadowLg: 'var(--andromeda-shadow-x, 0px) var(--andromeda-shadow-y, 10px) var(--andromeda-shadow-blur, 24px) var(--andromeda-shadow-color, rgba(0, 0, 0, 0.45))',
  },
  // Chart constants shared by TrendChart / MetricChart / RadarChart / Gauge.
  // lineWidth/dash are recharts sinks (numbers/strings, var-incapable — keep
  // RAW); fillOpacity + swatch are CSS sinks, exposed as vars.
  chart: {
    fillOpacity:      0.12,
    fillOpacityFaint: 0.06,
    lineWidth:        1.5,
    dash:             '2 4',
    swatch:           '8px',
  },
  border: {
    // Border-width SCALE, same contract as spacing: strings with units, keys
    // track the px value, change a step here and every consumer follows.
    // Step 1 is THE system hairline — the identity — and feeds the
    // --andromeda-border-width var (andromedaVars), so a theme can widen
    // every border at once. Like spacing, only the steps the system actually
    // uses exist (today: 1 = every hairline, 4 = FunnelChart band edges); a
    // new step is a deliberate addition when a component earns it, not an
    // escape hatch. SVG consumers derive numbers via parseInt — the root
    // stays a string. Chart series ink is NOT a border: that is
    // chart.lineWidth, a separate family on purpose.
    width: {
      1: '1px',
      4: '4px',
    },
    thin: 'var(--andromeda-border-width, 1px) solid',
  },
  marker: {
    // Corner marker geometry — L-shaped brackets that hug each corner.
    size:        12,    // px square the bracket lives inside
    offset:      0,     // px inset from the corner (0 = flush)
    borderWidth: 1,     // px stroke thickness of the L; rendered through
                        // --andromeda-marker-width so themes can thicken it
  },
  // Control ladder — the ONE height ladder every interactive control lands on,
  // so an `sm` field and an `sm` button line up in a row with no props passed.
  // Height is stated, not derived: Button used to reach 31.2px from padding +
  // leading while Input reached ~37px from its own padding, and two controls
  // that each compute their own height cannot be made to agree. Every control
  // now pins `height` to this rung and centres its content inside it, which is
  // what makes the alignment a guarantee rather than an arithmetic coincidence.
  // padX/text repeat spacing[3,4,5] and typography.size[sm,md,lg] as literals
  // because a single object literal cannot reference itself; change them here
  // and in those scales together.
  //
  // Two horizontal paddings, because a button and a field want different things
  // from the same rung:
  //   padX     — a BUTTON's side padding. Its label is centred, so the sides are
  //              breathing room and are deliberately wider than the top/bottom.
  //   padInset — a FIELD's inset on ALL FOUR sides. Text in a field is
  //              left-aligned against the border, so an inset that is wider at
  //              the sides than above reads as broken. padInset is exactly
  //              (height - 2*border - text) / 2, which is what makes the gap
  //              above the glyphs equal the gap left of them.
  //              What that identity depends on is the PINNED HEIGHT, not the
  //              line-height: a single-line field centres its em box inside the
  //              fixed content box, so md leaves the glyphs 10px off the frame
  //              whether the leading is 1 or the font's ~1.32 normal. Apply
  //              padInset horizontally and let the pinned height supply the
  //              vertical half. A field with NO pinned height (a textarea) has
  //              to apply it on all four sides as real padding instead.
  control: {
    // Reset 2026-08-11 for the size-step rule: text is now 12 / 14 / 16, the
    // same sm/md/lg rungs of typography.size, so a size="sm" control renders
    // 12px instead of the old 10px. The BOXES GREW to carry the bigger type
    // (26/30/34 → 28/34/40, a 6px step) rather than eating it as lost padding.
    // padInset is (height - 2*border - text) / 2 and still lands on whole px:
    //   sm  (28 - 2 - 12) / 2 = 14 / 2 =  7
    //   md  (34 - 2 - 14) / 2 = 18 / 2 =  9
    //   lg  (40 - 2 - 16) / 2 = 22 / 2 = 11
    // Content boxes (height minus two 1px borders) are 26 / 32 / 38.
    // Keep the identity exact when retuning: an odd (height - 2 - text) puts
    // the glyphs a half pixel off centre.
    sm: { height: '28px', padX: '12px', text: '12px', padInset: '7px'  },
    md: { height: '34px', padX: '16px', text: '14px', padInset: '9px'  },
    lg: { height: '40px', padX: '20px', text: '16px', padInset: '11px' },
  },
  layout: {
    sidebarWidth: '224px',
    headerHeight: '60px',
  },
  // Breakpoints — max-width thresholds. Andromeda is DESKTOP-FIRST: the
  // default (unqualified) styles are the desktop layout and these step
  // DOWN from there. `md` (768px) is the primary stack threshold — at/below
  // it, dense bento grids collapse to a single column and the sidebar
  // becomes a Drawer. `sm` is for phone-only fine-tuning (display-type
  // step-down, tighter insets); `lg` is the tablet ceiling where the full
  // desktop grid is still guaranteed to fit. Media queries can't read a
  // CSS var(), so the `mq` helper (components/lib/responsive.ts)
  // interpolates these literals — tokens.ts stays the single source.
  // See the Andromeda responsive rules for the mechanism + faithful-stack rules.
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },
  // Motion — durations, easings, and stagger presets that encode the
  // Andromeda tempo. Movement signals data movement or interaction
  // acknowledgement; never decoration. See the Andromeda motion rules for the
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
      countup: '1800ms',
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
