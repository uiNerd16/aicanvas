# Glass Toast

**Slug:** glass-toast
**Description:** Frosted glassmorphism toast notification stack with variant accents, auto-dismiss progress bar, and spring-animated stacking.

## Visual

- Toasts appear bottom-right, frosted glass panel matching glass-sidebar aesthetic
- Same pink flower ImageKit background at 60% opacity
- Glass panel: `rgba(255,255,255,0.06)` bg, blur(24px) saturate(1.8) on separate non-animating layer, `rounded-2xl`
- Each toast has: a 3px left accent bar (full height, rounded), a squircle icon tile with gradient + gloss (matching glass-sidebar icon style), bold title, optional muted description, and a close (x) glass pill button
- Bottom progress bar: thin (2px), accent-colored, drains left-to-right over 4 seconds
- Variant colors (matching glass-sidebar nav item palette):
  - **success**: `#06D6A0` (green)
  - **error**: `#FF5C8A` (pink)
  - **warning**: `#FFBE0B` (amber)
  - **info**: `#3A86FF` (blue)

## Behaviour

- **Enter**: slide in from right (x: 80 → 0) + fade, spring stiffness ~300, damping ~26
- **Exit**: slide out right (x → 80) + fade, spring animation
- **Auto-dismiss**: 4s timer with progress bar drain. On complete, spring exit
- **Close button**: manual dismiss with same spring exit
- **Stacking**: max 3 visible. Older toasts compress (scale down slightly) and shift upward with Framer Motion `layout` transitions. Toasts beyond 3 are removed
- **Progress bar**: animated width from 100% → 0% over 4s, pauses on hover
- **Hover**: progress timer pauses; toast gets subtle scale lift (1.01)
- All animations respect `useReducedMotion` — fallback to opacity fade

## Tech notes

- Demo layout: 4 trigger buttons (one per variant) centered on screen, styled as glass pills matching glass-sidebar toggle button style, with squircle icon badges
- Toast container positioned `fixed bottom-6 right-6` (mobile: `bottom-4 right-4 left-4`)
- Responsive 320px+ — toasts go full-width on mobile (<640px), 380px max on desktop
- 44px minimum touch targets on close button and trigger buttons
- Preview route: `/preview/two`
