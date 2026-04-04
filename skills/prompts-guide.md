# Prompts Guide

Every component ships with 5 platform-specific prompts in `prompts.ts`. Each prompt must be fully self-contained — the AI receiving it must be able to recreate the component from scratch without seeing the code.

## The golden rule

If you removed the source code and only had the prompt, could you rebuild the component exactly? If no → the prompt is incomplete.

Every prompt must include:
- What the component looks like visually
- What interactions and animations it has
- Key implementation details (constants, timing, easing values)
- The tech stack being used

## Platform-by-platform guide

---

### V0
**Tone:** Conversational, plain English. Describe it like you're explaining to a designer.

Focus on:
- Visual appearance and layout
- Behaviour on hover/click
- Overall "feel" — is it playful, minimal, editorial?
- Mention Next.js + Tailwind + Framer Motion

Avoid: code snippets, file paths, type definitions

Example opening: *"Create a card component that..."*

---

### Bolt
**Tone:** Semi-technical. Mention the stack and key implementation details.

Focus on:
- Component structure and what state it manages
- Animation triggers and what they do
- Key values (spring stiffness, duration, colors)
- Mention: React, Tailwind CSS, Framer Motion

Include: one or two implementation hints but not full code

Example opening: *"Build a React component using Framer Motion that..."*

---

### Lovable
**Tone:** Friendly and visual. Describe the "feeling" and emotional quality.

Focus on:
- The mood and aesthetic (warm, playful, elegant, minimal)
- Visual metaphors ("it feels like a physical card being picked up")
- Design inspiration references if relevant
- Colours and typography choices

Avoid: technical jargon. Lead with emotion and experience.

Example opening: *"I'd love a component that feels like..."*

---

### Claude Code
**Tone:** Precise technical specification. No ambiguity.

Focus on:
- Exact file path: `components-workspace/<slug>/index.tsx`
- All constants with their values (colors, sizes, timing)
- Animation specs: type (spring/tween), stiffness, damping, duration, easing
- TypeScript types for all props and state
- Step-by-step algorithm for complex logic
- Cleanup requirements for effects

Include: pseudo-code or algorithm steps for complex parts

Example opening: *"Create `components-workspace/glowing-button/index.tsx`. Export a named function `GlowingButton`..."*

---

### Cursor
**Tone:** Concise spec format. Dense but complete.

Focus on:
- File path on the first line
- Bullet-point spec: one behaviour per bullet
- Key values inlined (e.g. `spring: stiffness 300 damping 20`)
- TypeScript types mentioned but not expanded
- Framer Motion API calls named explicitly

Example opening: *"File: `components-workspace/glowing-button/index.tsx`\n- Export `GlowingButton`..."*

---

## Quality checks before submitting prompts

- [ ] Every prompt names the component and its slug
- [ ] Every prompt mentions Framer Motion for animations
- [ ] Animation values (spring config, duration, easing) are specified in at least Claude Code + Cursor prompts
- [ ] No platform has a copy-paste of another platform's prompt
- [ ] No platform mentions internal file paths except Claude Code and Cursor
