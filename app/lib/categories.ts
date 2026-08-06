// Single source of truth for component categories.
// `label` matches the `accent: true` tag string used on every component in
// the registry. `slug` becomes the URL segment under /components/category/.
// `title` and `description` drive per-category SEO metadata.
// `h1` and `intro` are the on-page copy that appears above the grid.
// `body` is the long-form copy BELOW the grid. Optional on purpose: it exists
// for categories with real search demand, where an h1 plus a one-line intro is
// too thin to rank. Only write it where the queries justify it.

export type Category = {
  label: string
  slug: string
  title: string
  description: string
  h1: string
  intro: string
  body?: readonly { h2: string; p: readonly string[] }[]
}

export const CATEGORIES: readonly Category[] = [
  {
    label: 'Cards & Modals',
    slug: 'cards-modals',
    title: 'Animated React Cards and Modals: Free + Tailwind',
    description:
      'Free animated React cards and modal dialogs. Tailwind CSS and Motion. Copy-paste ready, installable via the shadcn CLI.',
    h1: 'Animated React Cards and Modals',
    intro:
      'Animated card and modal dialog components for React. Built with Tailwind CSS and Motion, ready to copy and paste or install via the shadcn CLI.',
  },
  {
    label: 'Widgets',
    slug: 'widgets',
    title: 'Animated React Widgets: Copy and Paste UI Elements',
    description:
      'Free animated React widgets and UI elements. Built with Tailwind CSS and Motion. Copy-paste ready, installable via the shadcn CLI.',
    h1: 'Animated React Widgets',
    intro:
      'Animated widgets and small UI elements for React. Built with Tailwind CSS and Motion, copy-paste ready or installable via the shadcn CLI.',
  },
  {
    label: 'Backgrounds',
    slug: 'backgrounds',
    title: 'Animated React Backgrounds: Tailwind + Motion',
    description:
      'Free animated React backgrounds built with Tailwind CSS and Motion. Copy-paste ready, installable via the shadcn CLI.',
    h1: 'Animated React Backgrounds',
    intro:
      'Animated background components for React. Built with Tailwind CSS and Motion, ready to copy and paste or install with the shadcn CLI.',
    body: [
      {
        h2: 'CSS, Canvas, or WebGL: picking the right one',
        p: [
          'Animated backgrounds fall into three implementations, and the cheapest one that achieves the look is almost always the right answer. A gradient that drifts, a noise wash, or a pattern that pans can be done in pure CSS, which the compositor handles without touching the main thread. Particle fields, flow fields, and anything where thousands of independent points each need their own position are a Canvas 2D job. Reach for WebGL and Three.js only when the effect is genuinely per-pixel: refraction, volumetric light, displacement, or shader math with no CSS equivalent.',
          'The cost difference is not small. A CSS gradient animation runs on the GPU compositor and costs close to nothing. A Canvas particle field redraws every frame on the main thread. A WebGL scene ships a renderer, a scene graph, and shader compilation before the first frame ever appears.',
        ],
      },
      {
        h2: 'Keeping a background from stealing your frame budget',
        p: [
          'A background is decoration sitting behind the content people actually came for. It should never be the reason a scroll stutters or an input lags. Three habits cover most of it. Cap the device pixel ratio on canvas, since rendering at the full DPR of a modern phone can mean four times the pixels for a blur nobody will inspect. Pause the animation when the element leaves the viewport with an IntersectionObserver, and when the tab is hidden. And honor prefers-reduced-motion with a static frame, which is an accessibility requirement and a free performance win on the machines that need it most.',
          'If an effect still costs too much, the fix is usually resolution rather than complexity. Render the canvas at half size and scale it up with CSS. Backgrounds are dim, blurred, and behind things, so they hide a loss of detail better than any other layer on the page.',
        ],
      },
      {
        h2: 'Layering one behind real content',
        p: [
          'Two things break most background integrations. The first is stacking: give the background a fixed or absolute position at a low z-index inside a positioned parent, and set pointer-events to none so it never swallows clicks meant for the UI above it. The second is contrast. A background that shifts in brightness as it animates will push text in and out of legibility. Either keep the palette inside a narrow luminance band, or put a scrim between the background and the content, a semi-transparent layer in the page base color.',
        ],
      },
      {
        h2: 'Installing them',
        p: [
          'Every background on this page ships its full source. Copy it straight into your project, or install it with the shadcn CLI. There is no runtime package to depend on: the code becomes yours the moment it lands in your repo.',
        ],
      },
    ],
  },
  {
    label: 'Blocks',
    slug: 'blocks',
    title: 'React UI Blocks: Composed Page Sections',
    description:
      'React UI blocks: composed, multi-component page sections like pricing tables and hero banners. Tailwind CSS and Motion, free and premium.',
    h1: 'React UI Blocks',
    intro:
      'Composed, multi-component page sections for React: pricing tables, hero banners, and more. Built with Tailwind CSS and Motion, some free and some premium.',
  },
  {
    label: 'Buttons & Toggles',
    slug: 'buttons-toggles',
    title: 'Animated React Buttons and Toggles: Free + Tailwind',
    description:
      'Free animated React buttons and toggles built with Tailwind CSS and Motion. Copy-paste ready, installable via the shadcn CLI.',
    h1: 'Animated React Buttons and Toggles',
    intro:
      'Animated buttons and toggle switches for React. Built with Tailwind CSS and Motion, ready to copy and paste or install via the shadcn CLI.',
  },
  {
    label: 'Navigation',
    slug: 'navigation',
    title: 'React Navigation Components: Navbars, Sidebars, Tabs',
    description:
      'Free React navigation components: navbars, sidebars, tab bars, and docks. Tailwind CSS and Motion, installable via the shadcn CLI.',
    h1: 'React Navigation Components',
    intro:
      'Navigation components for React: navbars, sidebars, tab bars, and docks. Built with Tailwind CSS and Motion, copy-paste ready or installable via the shadcn CLI.',
  },
  {
    label: 'Inputs & Controls',
    slug: 'inputs-controls',
    title: 'Animated React Inputs and Controls: Free + Motion',
    description:
      'Free animated React input and control components. Tailwind CSS and Motion. Copy-paste ready, installable via the shadcn CLI.',
    h1: 'Animated React Inputs and Controls',
    intro:
      'Animated input and control components for React. Built with Tailwind CSS and Motion, ready to copy and paste or install via the shadcn CLI.',
  },
  {
    label: 'Notifications',
    slug: 'notifications',
    title: 'Animated React Notifications and Toasts: Free',
    description:
      'Free animated React notification and toast components. Tailwind CSS and Motion. Copy-paste ready, installable via the shadcn CLI.',
    h1: 'Animated React Notifications and Toasts',
    intro:
      'Animated notification and toast components for React. Built with Tailwind CSS and Motion, ready to copy and paste or install via the shadcn CLI.',
  },
  {
    label: 'Typography',
    slug: 'typography',
    title: 'Animated React Typography Components: Free + Tailwind',
    description:
      'Free animated React typography components: scramble text, blur reveal, ripple text, and more. Tailwind CSS and Motion.',
    h1: 'Animated React Typography Components',
    intro:
      'Animated typography components for React: scramble text, blur reveal, ripple text, and more. Built with Tailwind CSS and Motion.',
  },
  {
    label: 'Glass',
    slug: 'glass',
    title: 'Glassmorphism React Components: Free + Motion',
    description:
      'Free glassmorphism React components: navbars, cards, modals, sliders, toggles, and more. Tailwind CSS and Motion.',
    h1: 'Glassmorphism React Components',
    intro:
      'Glassmorphism components for React: navbars, cards, modals, sliders, toggles, and more. Built with Tailwind CSS and Motion, ready to copy and paste.',
    body: [
      {
        h2: 'What actually makes glass read as glass',
        p: [
          'Glassmorphism is four ingredients, and dropping any one of them leaves you with a flat gray panel. A backdrop blur, so what sits behind the surface reads as color but not as shape. A translucent fill, usually white or the surface color somewhere between 5 and 15 percent. A hairline border that is brighter along the top edge than the bottom, which is what sells the illusion of a pane catching light. And, most often forgotten, something worth blurring behind it. Glass over a solid background is just a rectangle. The effect only appears when there is an image, a gradient, or content scrolling underneath.',
          'Saturation is the detail that separates convincing glass from cheap glass. Frosted material intensifies the color passing through it, so pairing the blur with a saturate boost above 100 percent reproduces what the eye expects. It is the difference between a surface that looks like glass and one that looks like a blurred screenshot.',
        ],
      },
      {
        h2: 'backdrop-filter, support, and the fallback',
        p: [
          'The whole effect rests on backdrop-filter, which blurs what is painted behind an element rather than the element itself. Support is broad across current browsers, but it stays the most expensive property in this family: the browser composites everything behind the element, then blurs it, on every frame where either layer changes. Keep glass surfaces few, keep them small, and never animate the blur radius itself. Animate opacity, transform, or the fill color instead.',
          'Give it a fallback. A short @supports query that swaps in a near-solid background where backdrop-filter is unavailable or disabled costs a few lines, and it prevents the failure mode where unreadable text ends up sitting on a fully transparent panel.',
        ],
      },
      {
        h2: 'Keeping text readable on a moving surface',
        p: [
          'The accessibility trap in glassmorphism is that contrast is not fixed. Text at a comfortable ratio over a dark photo can fail completely once the user scrolls a bright one underneath. Because the backdrop is arbitrary, the reliable approach is to stop depending on it: set a minimum opacity on the fill so the surface always carries enough of its own color to anchor the text, then measure contrast against that floor rather than against the most flattering backdrop. Nudging font weight up on glass surfaces helps more than increasing size.',
        ],
      },
    ],
  },
  {
    label: '3D & Shaders',
    slug: '3d-shaders',
    title: '3D and Shader React Components: Three.js + WebGL',
    description:
      'Free 3D and shader React components built with Three.js and WebGL. Copy-paste ready, installable via the shadcn CLI.',
    h1: '3D and Shader React Components',
    intro:
      '3D and shader components for React. Built with Three.js and WebGL, ready to copy and paste or install via the shadcn CLI.',
  },
] as const

export const CATEGORY_LABELS = CATEGORIES.map((c) => c.label) as readonly string[]

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCategoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find((c) => c.label === label)
}
