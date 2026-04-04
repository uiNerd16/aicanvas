# Integrator Agent Rules

You take finished components from `components-workspace/` and wire them into the website. You never modify the component's core logic.

## Your scope
For each component to integrate, you will:

1. **Register in the component registry** (`app/lib/component-registry.tsx`)
2. **Verify the page route** is handled by the existing dynamic route (`app/components/[slug]/page.tsx`)

That's it. The dynamic route already exists and handles all slugs automatically.

## Step-by-step integration

### Step 1 — Inspect the component
Read `components-workspace/<name>/index.tsx` and `components-workspace/<name>/prompts.ts`.
Note the exported function name and the slug you'll assign (kebab-case of the name).

### Step 2 — Add to the registry
In `app/lib/component-registry.tsx`:

1. Import the component at the top:
   ```ts
   import { ComponentName } from '../../components-workspace/component-name'
   ```

2. Import the prompts:
   ```ts
   import { prompts as componentNamePrompts } from '../../components-workspace/component-name/prompts'
   ```

3. Add an entry to the `COMPONENTS` array — always include the `image` field with the ImageKit URL:
   ```ts
   {
     slug: 'component-slug',
     image: 'https://ik.imagekit.io/aitoolkit/component-slug.png',
     name: 'Human Readable Name',
     description: 'One sentence describing what it does.',
     tags: [
       { label: 'Category', accent: true },
       { label: 'Framer Motion' },
     ],
     PreviewComponent: ComponentName,
     code: COMPONENT_NAME_CODE,  // see note below
     prompts: componentNamePrompts,
   },
   ```

4. Add the code string constant (`COMPONENT_NAME_CODE`) by reading the source file and storing it as a template literal string. Escape any backticks in the source with `\``.

### Step 3 — Verify
- Run `npx tsc --noEmit` to check for TypeScript errors
- The component page is automatically available at `/components/<slug>` via the existing dynamic route
- The homepage grid automatically includes the new card (it reads from `COMPONENTS`)

### Step 4 — Screenshot and upload to ImageKit (MANDATORY — integration is not complete without this)

**This step is required. A component without a screenshot image is considered broken on the homepage.**

#### 4a — Register the slug in the screenshot script
Open `scripts/screenshot.mjs` and:
1. Add the slug to the `ALL_SLUGS` array
2. If the component has an interactive or active state (hover effect, toggle on, animation triggered), add it to the `INTERACTIONS` map so the screenshot captures the active state. Use `hoverCenter` for hover-based components, or write a custom interaction (click a button, move the mouse, etc.). See existing entries for examples.

#### 4b — Run the screenshot
The dev server must be running (`npm run dev`). Then:

```bash
npm run screenshot -- <slug>
```

The script will open the component page, trigger the interaction, screenshot the preview area, upload to ImageKit, and print the URL.

#### 4c — Update the registry
Copy the URL printed by the script and set it as the `image` field in the registry entry. The entry is not complete until this field has a real URL.

**Never report back to the Supervisor until the `image` field is populated with the ImageKit URL.**

## Completion checklist — confirm all before reporting to Supervisor

Before reporting back, verify every item:

- [ ] Component imported in `component-registry.tsx`
- [ ] Prompts imported in `component-registry.tsx`
- [ ] Registry entry appended to `COMPONENTS` array
- [ ] `npx tsc --noEmit` passes with no errors
- [ ] Slug added to `ALL_SLUGS` in `scripts/screenshot.mjs`
- [ ] Interaction added to `INTERACTIONS` map in `scripts/screenshot.mjs` (if component has active/hover state)
- [ ] `npm run screenshot -- <slug>` ran successfully and printed an ImageKit URL
- [ ] `image` field in the registry entry set to the exact URL printed by the script

**If any item is unchecked, do not report back. Complete it first.**

## Rules
- **Never** modify `index.tsx` or `prompts.ts` in `components-workspace/`
- **Never** modify `app/components/[slug]/page.tsx` or `app/components/[slug]/ComponentPageView.tsx` — they are generic and handle all components
- **Never** add routing files — the catch-all dynamic route handles everything
- If the component needs a new npm package, add it via `npm install` before registering
- Preserve the existing registry entries — only append, never delete

## File layout reference
```
app/
  lib/
    component-registry.tsx   ← ADD new entries here
  components/
    [slug]/
      page.tsx               ← DO NOT TOUCH (generic server component)
      ComponentPageView.tsx  ← DO NOT TOUCH (generic client component)

components-workspace/
  <name>/
    index.tsx                ← READ ONLY
    prompts.ts               ← READ ONLY
```
