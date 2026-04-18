# Jar of Emotions

**Slug:** `jar-of-emotions`
**Tier:** standalone
**Status:** briefed → building (index.tsx only)

## Description
A playful check-in component where picking an emotion flips open a jar's lid and drops that emoji out with real 2D physics, landing and bouncing onto the button that was clicked.

## Visual
- Centered SVG glass jar with a hinged lid resting on top
- Through the glass: a loose pile of 5–8 emoji emotions settled at the bottom (happy, sad, anxious, angry, calm, excited, tired, meh)
- Above the jar: a warm prompt, e.g. "How do you feel today?"
- Below the jar: a horizontal row of labeled emotion buttons (emoji + word under each)
- Canvas area below the buttons is the floor where fallen emojis accumulate across clicks

## Behaviour
- **Idle:** lid closed, interior emojis settled in a loose pile
- **On button click:**
  1. Lid rotates open around a left-edge hinge (mechanical feel, not fade/slide)
  2. The matching-emotion emoji rises out of the jar's mouth
  3. Emoji falls under gravity, tumbling/bouncing until it lands on or near the clicked button
  4. Lid swings back and closes once the emoji has exited
- Interior pile visibly shifts/settles when an emoji is removed
- Fallen emojis persist on the floor for the session and collide with each other (stack realistically)
- Jar supply is infinite — same emotion can be clicked repeatedly
- No persistence across reloads

## Mobile
- Layout stacks vertically (prompt → jar → buttons → floor)
- Buttons are touch-sized (≥44px tap target), wrap to multiple rows on narrow screens
- Jar scales to viewport width while keeping aspect ratio
- Physics world rescales with the container — emojis land on the correct button regardless of screen size

## Tech notes
- **2D physics:** `matter-js` — already used in `sticker-wall` (integrated), good precedent to follow for dynamic import pattern, world setup, and cleanup
- **Bodies:**
  - Jar interior walls = static Matter bodies (two side walls + floor inside the jar)
  - Button row = static floor segments below the jar (one rectangle per button, so the landing emoji can be matched to the clicked button via collision event)
  - Each emoji = dynamic circle body with friction + restitution
  - Lid = a rectangle body with a revolute constraint pinned to its left-edge hinge point; a brief torque impulse opens it, a restoring constraint closes it
- **Rendering:** jar + lid are SVG. Emojis are native emoji glyphs in absolute-positioned DOM nodes (no images). A requestAnimationFrame loop syncs DOM transforms from Matter body positions each frame.
- **Perf:** cap total fallen bodies (~80), sleep settled bodies, stop the loop when `!alive`.
- **Dispense logic:** clicking a button applies an upward impulse to an interior emoji of the matching type; if the jar is empty of that type, spawn a fresh one inside the jar before impulsing. The lid opens on click, closes after the emoji clears the jar mouth (detect via position-above-threshold check or a delay).
- **Extended skills to consult:**
  - `.claude/skills/creative-3d-components/SKILL.md` — jar glass treatment (subtle inner shadow, soft specular highlight), emoji presentation
  - `skills/animation-patterns.md` — lid spring easing, pile-settle micro-motion
  - `skills/component-anatomy.md` — structure, copy-paste ready, no design tokens inside standalone
- **Reference:** `components-workspace/sticker-wall/index.tsx` for the matter-js integration pattern (dynamic import, world setup, RAF loop, cleanup on unmount)
- No external icon/image deps beyond emoji glyphs and `matter-js`

## Acceptance criteria
- Clicking an emotion button clearly dispenses the matching emoji (not random)
- Lid animation feels mechanical — hinged, not fade/slide
- The falling emoji reliably lands on the clicked button with a satisfying bounce
- Emojis inside the jar visibly settle and react when one is removed
- Works on touch devices
- Multiple clicks work smoothly — no stuck lid, no duplicate drops
- Fallen emojis persist on the floor and collide with each other
- Canvas performance stays smooth as fallen emojis accumulate (sleeping bodies + cap)
- Works in both light and dark mode (distinct but cohesive light version)
- Works at 320px width without overflow
