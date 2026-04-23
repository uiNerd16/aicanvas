import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Before writing any code, verify the project has Tailwind CSS v4, TypeScript, and React set up. If missing, use the shadcn CLI to scaffold them.

Build a single-file React component called \`WildMorph\` with \`'use client'\` at the top. Install dependency: \`framer-motion\`.

---

## Visual

Full-viewport layout. Outer wrapper: dark background \`#1a1a19\`, \`min-h-screen w-screen\`, flexbox centered. Inner panel: warm off-white \`#efeee6\`, \`92vw × 86vh\`, clips overflow. Inside the panel, centered: a single italic word in the Anton font (loaded via \`@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap')\` injected as a \`<style>\` tag). Font color \`#1a1a19\`. Responsive font size: JS-computed \`clamp(64px, 12vw, 144px)\`, recalculated on \`resize\`. No Tailwind design tokens inside the component — use raw hex values and inline styles.

The word defaults to \`'wild'\` and is configurable via a \`text\` prop. Render the word as SVG \`<text>\` (not an HTML span) so glyphs re-rasterize at native resolution under extreme stretch. Measure the text's bounding box via \`getBBox()\` after each font-size/text change and use those pixel dimensions to size the \`<svg>\` element exactly.

---

## Hover zone

Wrap the SVG container in a \`<div>\` with \`padding: 2.5rem 3.5rem\` and attach all pointer events to it. The hover zone is tight around the text, not the whole panel.

---

## Warp technique: 2D homography → CSS matrix3d

Maintain **eight Framer Motion \`MotionValue<number>\`s** — one X and one Y offset per corner: \`tlX, tlY, trX, trY, blX, blY, brX, brY\`. All start at 0.

On every frame (subscribe via \`useMotionValueEvent\` on all eight), recompute a \`matrix3d\` string and imperatively write it to \`warpRef.current.style.transform\`. Do NOT use \`<motion.div>\` or re-render; drive the DOM directly.

The matrix is a **2D projective (homography) transform** that maps the element's natural rect \`[(0,0),(w,0),(w,h),(0,h)]\` onto a target quadrilateral built from the corner offsets:
- TL = \`(0 + tlX, 0 + tlY)\`
- TR = \`(w + trX, 0 + trY)\`
- BR = \`(w + brX, h + brY)\`
- BL = \`(0 + blX, h + blY)\`

Solve the homography with **Gaussian elimination** (8×8 linear system, partial pivoting). The 8 unknowns \`[a, b, c, d, e, f, g, h]\` come from the system: for each of the 4 corner pairs \`(u,v) → (x,y)\`:
\`\`\`
x-row:  a·u + c·v + e − g·u·x − h·v·x = x
y-row:  b·u + d·v + f − g·u·y − h·v·y = y
\`\`\`
Embed the 3×3 result H into a **4×4 CSS matrix3d** (column-major):
\`\`\`
matrix3d(a, b, 0, g,  c, d, 0, h,  0, 0, 1, 0,  e, f, 0, 1)
\`\`\`
If the system is degenerate (pivot < 1e-12), fall back to identity \`[1,0,0,1,0,0,0,0]\`. Always set \`transformOrigin: '0 0'\` on the warp container.

Track natural element size with a \`ResizeObserver\` on the warp container and store it in a ref.

---

## Interaction modes

Three modes tracked in a ref (\`'none' | 'top' | 'bottom'\`):

- **\`none\`** — pointer outside; all 8 offsets → 0.
- **\`top\`** — pointer in the **upper half** of the hover zone: TL and TR corners pull up + outward; BL and BR stay pinned at 0.
  - \`tlX = -1.0 × w\`, \`tlY = -1.55 × h\`
  - \`trX = +1.05 × w\`, \`trY = -1.48 × h\`
  - \`blX = blY = brX = brY = 0\`
- **\`bottom\`** — pointer in the **lower half**: BL and BR pull down + outward; TL and TR stay pinned at 0.
  - \`blX = -1.0 × w\`, \`blY = +1.55 × h\`
  - \`brX = +1.05 × w\`, \`brY = +1.48 × h\`
  - \`tlX = tlY = trX = trY = 0\`

Determine mode from the cursor's \`clientY\` vs the hover zone's bounding rect midline.

---

## Spring physics

Use Framer Motion's imperative \`animate(motionValue, target, options)\`:

- **Enter / midline cross** (warping in): \`{ type: 'spring', stiffness: 280, damping: 14, mass: 1.8 }\` — underdamped; corners overshoot and bounce 2–3 times.
- **Release** (returning to rest): \`{ type: 'spring', stiffness: 280, damping: 16, mass: 1.8 }\` — slightly more damped, still oscillates but settles gently.

On every mode change: cancel all 8 in-flight animations (store \`AnimationPlaybackControls[]\` in a ref), then start fresh animations for all 8 motion values.

---

## Touch/mouse/pen handling

Touch/mouse/pen handling uses unified pointer events — no separate touch handlers needed.
On the hover zone div:
- \`onPointerDown\`: call \`e.currentTarget.setPointerCapture(e.pointerId)\` then apply mode from \`e.clientY\`.
- \`onPointerMove\`: apply mode from \`e.clientY\` (\`setPointerCapture\` ensures this fires for active touch drags too).
- \`onPointerUp\` / \`onPointerLeave\` / \`onPointerCancel\`: return to rest.
Set \`touchAction: 'none'\` on the hover zone so the browser doesn't intercept touch scroll.
No \`pointerType\` guards needed.

---

## Outer wrapper

Set \`perspective: 1400px\` and \`perspectiveOrigin: 50% 50%\` on the outer wrapper div so the CSS matrix3d has a camera distance.

---

## Cleanup

Stop all animation controls on unmount. The component is fully self-contained in one file with a default export.`,

  Lovable: `Build a single-file React component called \`WildMorph\`. Install dependency: \`framer-motion\`.

---

## Visual

Full-viewport layout. Outer wrapper: dark background \`#1a1a19\`, \`min-h-screen w-screen\`, flexbox centered. Inner panel: warm off-white \`#efeee6\`, \`92vw × 86vh\`, clips overflow. Inside the panel, centered: a single italic word in the Anton font (loaded via \`@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap')\` injected as a \`<style>\` tag). Font color \`#1a1a19\`. Responsive font size: JS-computed \`clamp(64px, 12vw, 144px)\`, recalculated on \`resize\`. Use raw hex values and inline styles throughout.

The word defaults to \`'wild'\` and is configurable via a \`text\` prop. Render the word as SVG \`<text>\` (not an HTML span) so glyphs re-rasterize at native resolution under extreme stretch. Measure the text's bounding box via \`getBBox()\` after each font-size/text change and use those pixel dimensions to size the \`<svg>\` element exactly.

---

## Hover zone

Wrap the SVG container in a \`<div>\` with \`padding: 2.5rem 3.5rem\` and attach all pointer events to it. The hover zone is tight around the text, not the whole panel.

---

## Warp technique: 2D homography → CSS matrix3d

Maintain **eight Framer Motion \`MotionValue<number>\`s** — one X and one Y offset per corner: \`tlX, tlY, trX, trY, blX, blY, brX, brY\`. All start at 0.

On every frame (subscribe via \`useMotionValueEvent\` on all eight), recompute a \`matrix3d\` string and imperatively write it to \`warpRef.current.style.transform\`. Do NOT use \`<motion.div>\` or re-render; drive the DOM directly.

The matrix is a **2D projective (homography) transform** that maps the element's natural rect \`[(0,0),(w,0),(w,h),(0,h)]\` onto a target quadrilateral built from the corner offsets:
- TL = \`(0 + tlX, 0 + tlY)\`
- TR = \`(w + trX, 0 + trY)\`
- BR = \`(w + brX, h + brY)\`
- BL = \`(0 + blX, h + blY)\`

Solve the homography with **Gaussian elimination** (8×8 linear system, partial pivoting). The 8 unknowns \`[a, b, c, d, e, f, g, h]\` come from the system: for each of the 4 corner pairs \`(u,v) → (x,y)\`:
\`\`\`
x-row:  a·u + c·v + e − g·u·x − h·v·x = x
y-row:  b·u + d·v + f − g·u·y − h·v·y = y
\`\`\`
Embed the 3×3 result H into a **4×4 CSS matrix3d** (column-major):
\`\`\`
matrix3d(a, b, 0, g,  c, d, 0, h,  0, 0, 1, 0,  e, f, 0, 1)
\`\`\`
If the system is degenerate (pivot < 1e-12), fall back to identity \`[1,0,0,1,0,0,0,0]\`. Always set \`transformOrigin: '0 0'\` on the warp container.

Track natural element size with a \`ResizeObserver\` on the warp container and store it in a ref.

---

## Interaction modes

Three modes tracked in a ref (\`'none' | 'top' | 'bottom'\`):

- **\`none\`** — pointer outside; all 8 offsets → 0.
- **\`top\`** — pointer in the **upper half** of the hover zone: TL and TR corners pull up + outward; BL and BR stay pinned at 0.
  - \`tlX = -1.0 × w\`, \`tlY = -1.55 × h\`
  - \`trX = +1.05 × w\`, \`trY = -1.48 × h\`
  - \`blX = blY = brX = brY = 0\`
- **\`bottom\`** — pointer in the **lower half**: BL and BR pull down + outward; TL and TR stay pinned at 0.
  - \`blX = -1.0 × w\`, \`blY = +1.55 × h\`
  - \`brX = +1.05 × w\`, \`brY = +1.48 × h\`
  - \`tlX = tlY = trX = trY = 0\`

Determine mode from the cursor's \`clientY\` vs the hover zone's bounding rect midline.

---

## Spring physics

Use Framer Motion's imperative \`animate(motionValue, target, options)\`:

- **Enter / midline cross** (warping in): \`{ type: 'spring', stiffness: 280, damping: 14, mass: 1.8 }\` — underdamped; corners overshoot and bounce 2–3 times.
- **Release** (returning to rest): \`{ type: 'spring', stiffness: 280, damping: 16, mass: 1.8 }\` — slightly more damped, still oscillates but settles gently.

On every mode change: cancel all 8 in-flight animations (store \`AnimationPlaybackControls[]\` in a ref), then start fresh animations for all 8 motion values.

---

## Touch/mouse/pen handling

Touch/mouse/pen handling uses unified pointer events — no separate touch handlers needed.
On the hover zone div:
- \`onPointerDown\`: call \`e.currentTarget.setPointerCapture(e.pointerId)\` then apply mode from \`e.clientY\`.
- \`onPointerMove\`: apply mode from \`e.clientY\` (\`setPointerCapture\` ensures this fires for active touch drags too).
- \`onPointerUp\` / \`onPointerLeave\` / \`onPointerCancel\`: return to rest.
Set \`touchAction: 'none'\` on the hover zone so the browser doesn't intercept touch scroll.
No \`pointerType\` guards needed.

---

## Outer wrapper

Set \`perspective: 1400px\` and \`perspectiveOrigin: 50% 50%\` on the outer wrapper div so the CSS matrix3d has a camera distance.

---

## Cleanup

Stop all animation controls on unmount. The component is fully self-contained in one file with a default export.`,

  V0: `Build a single-file React component called \`WildMorph\`. Install dependency: \`framer-motion\`.

---

## Visual

Full-viewport layout. Outer wrapper: dark background \`#1a1a19\`, \`min-h-screen w-screen\`, flexbox centered. Inner panel: warm off-white \`#efeee6\`, \`92vw × 86vh\`, clips overflow. Inside the panel, centered: a single italic word in the Anton font (loaded via \`@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap')\` injected as a \`<style>\` tag). Font color \`#1a1a19\`. Responsive font size: JS-computed \`clamp(64px, 12vw, 144px)\`, recalculated on \`resize\`. Use raw hex values and inline styles throughout.

The word defaults to \`'wild'\` and is configurable via a \`text\` prop. Render the word as SVG \`<text>\` (not an HTML span) so glyphs re-rasterize at native resolution under extreme stretch. Measure the text's bounding box via \`getBBox()\` after each font-size/text change and use those pixel dimensions to size the \`<svg>\` element exactly.

---

## Hover zone

Wrap the SVG container in a \`<div>\` with \`padding: 2.5rem 3.5rem\` and attach all pointer events to it. The hover zone is tight around the text, not the whole panel.

---

## Warp technique: 2D homography → CSS matrix3d

Maintain **eight Framer Motion \`MotionValue<number>\`s** — one X and one Y offset per corner: \`tlX, tlY, trX, trY, blX, blY, brX, brY\`. All start at 0.

On every frame (subscribe via \`useMotionValueEvent\` on all eight), recompute a \`matrix3d\` string and imperatively write it to \`warpRef.current.style.transform\`. Do NOT use \`<motion.div>\` or re-render; drive the DOM directly.

The matrix is a **2D projective (homography) transform** that maps the element's natural rect \`[(0,0),(w,0),(w,h),(0,h)]\` onto a target quadrilateral built from the corner offsets:
- TL = \`(0 + tlX, 0 + tlY)\`
- TR = \`(w + trX, 0 + trY)\`
- BR = \`(w + brX, h + brY)\`
- BL = \`(0 + blX, h + blY)\`

Solve the homography with **Gaussian elimination** (8×8 linear system, partial pivoting). The 8 unknowns \`[a, b, c, d, e, f, g, h]\` come from the system: for each of the 4 corner pairs \`(u,v) → (x,y)\`:
\`\`\`
x-row:  a·u + c·v + e − g·u·x − h·v·x = x
y-row:  b·u + d·v + f − g·u·y − h·v·y = y
\`\`\`
Embed the 3×3 result H into a **4×4 CSS matrix3d** (column-major):
\`\`\`
matrix3d(a, b, 0, g,  c, d, 0, h,  0, 0, 1, 0,  e, f, 0, 1)
\`\`\`
If the system is degenerate (pivot < 1e-12), fall back to identity \`[1,0,0,1,0,0,0,0]\`. Always set \`transformOrigin: '0 0'\` on the warp container.

Track natural element size with a \`ResizeObserver\` on the warp container and store it in a ref.

---

## Interaction modes

Three modes tracked in a ref (\`'none' | 'top' | 'bottom'\`):

- **\`none\`** — pointer outside; all 8 offsets → 0.
- **\`top\`** — pointer in the **upper half** of the hover zone: TL and TR corners pull up + outward; BL and BR stay pinned at 0.
  - \`tlX = -1.0 × w\`, \`tlY = -1.55 × h\`
  - \`trX = +1.05 × w\`, \`trY = -1.48 × h\`
  - \`blX = blY = brX = brY = 0\`
- **\`bottom\`** — pointer in the **lower half**: BL and BR pull down + outward; TL and TR stay pinned at 0.
  - \`blX = -1.0 × w\`, \`blY = +1.55 × h\`
  - \`brX = +1.05 × w\`, \`brY = +1.48 × h\`
  - \`tlX = tlY = trX = trY = 0\`

Determine mode from the cursor's \`clientY\` vs the hover zone's bounding rect midline.

---

## Spring physics

Use Framer Motion's imperative \`animate(motionValue, target, options)\`:

- **Enter / midline cross** (warping in): \`{ type: 'spring', stiffness: 280, damping: 14, mass: 1.8 }\` — underdamped; corners overshoot and bounce 2–3 times.
- **Release** (returning to rest): \`{ type: 'spring', stiffness: 280, damping: 16, mass: 1.8 }\` — slightly more damped, still oscillates but settles gently.

On every mode change: cancel all 8 in-flight animations (store \`AnimationPlaybackControls[]\` in a ref), then start fresh animations for all 8 motion values.

---

## Touch/mouse/pen handling

Touch/mouse/pen handling uses unified pointer events — no separate touch handlers needed.
On the hover zone div:
- \`onPointerDown\`: call \`e.currentTarget.setPointerCapture(e.pointerId)\` then apply mode from \`e.clientY\`.
- \`onPointerMove\`: apply mode from \`e.clientY\` (\`setPointerCapture\` ensures this fires for active touch drags too).
- \`onPointerUp\` / \`onPointerLeave\` / \`onPointerCancel\`: return to rest.
Set \`touchAction: 'none'\` on the hover zone so the browser doesn't intercept touch scroll.
No \`pointerType\` guards needed.

---

## Outer wrapper

Set \`perspective: 1400px\` and \`perspectiveOrigin: 50% 50%\` on the outer wrapper div so the CSS matrix3d has a camera distance.

---

## Cleanup

Stop all animation controls on unmount. The component is fully self-contained in one file with a default export.`,
}
