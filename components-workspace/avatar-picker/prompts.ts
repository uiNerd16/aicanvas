import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

Create \`components-workspace/avatar-picker/index.tsx\`. Export a named function \`AvatarPicker\`.

**Layout:** Full-container flex column, centered, gap-8. bg-[#E8E8DF] dark:bg-[#1A1A19]. Four sections top-to-bottom: uppercase label ("MEET THE CREW"), card stack, dots indicator, action row.

**Card stack:** 4 portrait cards (174×218px, radius 20) stacked with absolute positioning, all centered via \`left:50% top:50% marginLeft:-87 marginTop:-109\`. Slot layout (index = front→back):
  - 0: x:0, y:0, rotate:1.5°, scale:1, zIndex:4
  - 1: x:52, y:-8, rotate:8°, scale:0.92, zIndex:3
  - 2: x:-46, y:-4, rotate:-9°, scale:0.90, zIndex:2
  - 3: x:4, y:26, rotate:3.5°, scale:0.86, zIndex:1

**State:** \`order: number[]\` tracks which photo ID is at each slot. \`selectedId: number | null\`. \`exiting: { id, dir } | null\`. \`returning: Set<number>\` for instant (duration:0) snap-back.

**Drag to dismiss (front card only):** \`drag="x"\` with \`dragConstraints={{ left:0, right:0 }}\`, \`dragElastic:0.6\`. On release: if \`Math.abs(offset.x) > 80\` or \`Math.abs(velocity.x) > 400\`, trigger dismiss. Exit animation: x:±460, y:150, rotate:±22°, scale:0.85, opacity:0, duration:0.4, ease:[0.4,0,0.2,1]. After 420ms: move front to back (setOrder), snap-return with duration:0, then two RAFs to re-enable spring.

**Tap to select (front card only):** If drag delta < 8px on click, toggle selectedId. Show teal ring (\`border: 2.5px solid #2DD4BF\`) and checkmark badge (24px circle, bg #2DD4BF, Check icon size 13, color #0f2e2b).

**Spring config:** stiffness:280, damping:26.

**Dots:** Row of 4 dots. Active dot: width:20, opacity:1. Inactive: width:5, opacity:0.28. Height:5, radius:3. Spring stiffness:400, damping:30. bg-[#21211F] dark:bg-white.

**Action row:** height:34. If selectedId !== null: teal pill button (\`bg:#2DD4BF, radius:20, padding:7px 18px\`) with checkmark + "[Name] Selected" text (color #0f2e2b, uppercase, 11px, weight 700). Clicking deselects. If null: "swipe to browse" hint text. Both animate in with opacity/y spring.

**Photos:** 4 Unsplash portrait URLs (w=400&h=500&fit=crop). Names: Capt. Vroom (Asteroid Hugger), Zork (Zero-G Chef), Dronk (Space Surfer), Gloop (Nebula Napper).

**Theme:** Detect via MutationObserver on \`document.documentElement.classList\`. Use \`useRef\` for order (stable in callbacks), \`useRef\` for dismissing guard (prevents double-dismiss).

## Typography
- Font: project default sans-serif
- Sizes: 11px, 14px
- Weights: 400, 700`,

  'Lovable': `Create \`components-workspace/avatar-picker/index.tsx\`. Export a named function \`AvatarPicker\`.

**Layout:** Full-container flex column, centered, gap-8. bg-[#E8E8DF] dark:bg-[#1A1A19]. Four sections top-to-bottom: uppercase label ("MEET THE CREW"), card stack, dots indicator, action row.

**Card stack:** 4 portrait cards (174×218px, radius 20) stacked with absolute positioning, all centered via \`left:50% top:50% marginLeft:-87 marginTop:-109\`. Slot layout (index = front→back):
  - 0: x:0, y:0, rotate:1.5°, scale:1, zIndex:4
  - 1: x:52, y:-8, rotate:8°, scale:0.92, zIndex:3
  - 2: x:-46, y:-4, rotate:-9°, scale:0.90, zIndex:2
  - 3: x:4, y:26, rotate:3.5°, scale:0.86, zIndex:1

**State:** \`order: number[]\` tracks which photo ID is at each slot. \`selectedId: number | null\`. \`exiting: { id, dir } | null\`. \`returning: Set<number>\` for instant (duration:0) snap-back.

**Drag to dismiss (front card only):** \`drag="x"\` with \`dragConstraints={{ left:0, right:0 }}\`, \`dragElastic:0.6\`. On release: if \`Math.abs(offset.x) > 80\` or \`Math.abs(velocity.x) > 400\`, trigger dismiss. Exit animation: x:±460, y:150, rotate:±22°, scale:0.85, opacity:0, duration:0.4, ease:[0.4,0,0.2,1]. After 420ms: move front to back (setOrder), snap-return with duration:0, then two RAFs to re-enable spring.

**Tap to select (front card only):** If drag delta < 8px on click, toggle selectedId. Show teal ring (\`border: 2.5px solid #2DD4BF\`) and checkmark badge (24px circle, bg #2DD4BF, Check icon size 13, color #0f2e2b).

**Spring config:** stiffness:280, damping:26.

**Dots:** Row of 4 dots. Active dot: width:20, opacity:1. Inactive: width:5, opacity:0.28. Height:5, radius:3. Spring stiffness:400, damping:30. bg-[#21211F] dark:bg-white.

**Action row:** height:34. If selectedId !== null: teal pill button (\`bg:#2DD4BF, radius:20, padding:7px 18px\`) with checkmark + "[Name] Selected" text (color #0f2e2b, uppercase, 11px, weight 700). Clicking deselects. If null: "swipe to browse" hint text. Both animate in with opacity/y spring.

**Photos:** 4 Unsplash portrait URLs (w=400&h=500&fit=crop). Names: Capt. Vroom (Asteroid Hugger), Zork (Zero-G Chef), Dronk (Space Surfer), Gloop (Nebula Napper).

**Theme:** Detect via MutationObserver on \`document.documentElement.classList\`. Use \`useRef\` for order (stable in callbacks), \`useRef\` for dismissing guard (prevents double-dismiss).

## Typography
- Font: project default sans-serif
- Sizes: 11px, 14px
- Weights: 400, 700`,

  'V0': `Create \`components-workspace/avatar-picker/index.tsx\`. Export a named function \`AvatarPicker\`.

**Layout:** Full-container flex column, centered, gap-8. bg-[#E8E8DF] dark:bg-[#1A1A19]. Four sections top-to-bottom: uppercase label ("MEET THE CREW"), card stack, dots indicator, action row.

**Card stack:** 4 portrait cards (174×218px, radius 20) stacked with absolute positioning, all centered via \`left:50% top:50% marginLeft:-87 marginTop:-109\`. Slot layout (index = front→back):
  - 0: x:0, y:0, rotate:1.5°, scale:1, zIndex:4
  - 1: x:52, y:-8, rotate:8°, scale:0.92, zIndex:3
  - 2: x:-46, y:-4, rotate:-9°, scale:0.90, zIndex:2
  - 3: x:4, y:26, rotate:3.5°, scale:0.86, zIndex:1

**State:** \`order: number[]\` tracks which photo ID is at each slot. \`selectedId: number | null\`. \`exiting: { id, dir } | null\`. \`returning: Set<number>\` for instant (duration:0) snap-back.

**Drag to dismiss (front card only):** \`drag="x"\` with \`dragConstraints={{ left:0, right:0 }}\`, \`dragElastic:0.6\`. On release: if \`Math.abs(offset.x) > 80\` or \`Math.abs(velocity.x) > 400\`, trigger dismiss. Exit animation: x:±460, y:150, rotate:±22°, scale:0.85, opacity:0, duration:0.4, ease:[0.4,0,0.2,1]. After 420ms: move front to back (setOrder), snap-return with duration:0, then two RAFs to re-enable spring.

**Tap to select (front card only):** If drag delta < 8px on click, toggle selectedId. Show teal ring (\`border: 2.5px solid #2DD4BF\`) and checkmark badge (24px circle, bg #2DD4BF, Check icon size 13, color #0f2e2b).

**Spring config:** stiffness:280, damping:26.

**Dots:** Row of 4 dots. Active dot: width:20, opacity:1. Inactive: width:5, opacity:0.28. Height:5, radius:3. Spring stiffness:400, damping:30. bg-[#21211F] dark:bg-white.

**Action row:** height:34. If selectedId !== null: teal pill button (\`bg:#2DD4BF, radius:20, padding:7px 18px\`) with checkmark + "[Name] Selected" text (color #0f2e2b, uppercase, 11px, weight 700). Clicking deselects. If null: "swipe to browse" hint text. Both animate in with opacity/y spring.

**Photos:** 4 Unsplash portrait URLs (w=400&h=500&fit=crop). Names: Capt. Vroom (Asteroid Hugger), Zork (Zero-G Chef), Dronk (Space Surfer), Gloop (Nebula Napper).

**Theme:** Detect via MutationObserver on \`document.documentElement.classList\`. Use \`useRef\` for order (stable in callbacks), \`useRef\` for dismissing guard (prevents double-dismiss).

## Typography
- Font: project default sans-serif
- Sizes: 11px, 14px
- Weights: 400, 700`,
}
