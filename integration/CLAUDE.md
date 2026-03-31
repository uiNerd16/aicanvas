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

3. Add an entry to the `COMPONENTS` array:
   ```ts
   {
     slug: 'component-slug',
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
