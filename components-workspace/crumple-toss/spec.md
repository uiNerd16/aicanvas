# Crumple & Toss — spec

Component: Crumple & Toss
Slug: crumple-toss
design-system: standalone

## Description
A paper note sits on screen with Save and Delete buttons — saving folds it away neatly, deleting crumples it into a ball that arcs into a nearby wastebasket with real physics.

## Visual
A slightly imperfect rectangular paper note centered on a dark surface, rendered as an SVG with subtle grain (feTurbulence), faint corner curl, and soft ambient shadow. Handwritten-feel font (cursive or serif). A small illustrated SVG wastebasket sits to the lower-right. Two buttons below: Save (calm, outlined) and Delete (accent/warm).

## Behaviour

**Idle:** paper has a very subtle breathing float (slow sinusoidal translateY, ~4px, ~3s loop) so it feels alive.

**Delete flow (the hero moment):**
1. Crumple phase (~1.2s): SVG paper path morphs through 5 hand-crafted keyframe states — flat → corners folding in → surface creasing, text distorts via feTurbulence baseFrequency ramping up → irregular crumpled shape → tight paper ball. Each state is a distinct polygon or path; Framer Motion animates between them with a custom ease.
2. Toss phase: the ball is launched toward the wastebasket on a natural parabolic arc using Matter.js — circular body, gravity, rotation. Wastebasket has invisible physics walls (two sides + bottom rim so the ball can bounce off the rim edge and settle inside).
3. Reset: after ~0.6s settle, ball fades out, fresh paper fades in with the next message from the pool.

**Save flow:**
Paper folds in half (top half folds down over bottom, SVG clip + scale), then the folded note slides upward and shrinks to a point with a gentle ease-out. Contrasts sharply with delete — tidy, deliberate, quiet. Reset as above.

## Mobile
Touch-friendly buttons (min 44px tap target). Physics and animations are the same; layout stacks paper above buttons with enough padding. Canvas/SVG scales to container width.

## Tech notes
- SVG paper with feTurbulence filter for grain + distortion during crumple
- Framer Motion for all state transitions (idle bob, crumple morphing, save fold, reset fade)
- Matter.js for ball physics (same dep as sticker-wall — already in package.json)
- Message pool (5 messages): "Hey… u up? Been thinking about us.", "We need to talk.", "Miss you. Don't reply.", "It was never nothing.", "Call me when you're ready."
- No persistence; resets on each interaction
- Read .claude/skills/creative-3d-components/SKILL.md for visual texture recipes
- Read .claude/skills/design-motion-principles/SKILL.md for crumple pacing guidance
