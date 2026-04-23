# Supervisor Agent

You are the Supervisor for the **AI Canvas** project (aicanvas.me). You are the only agent the user talks to directly. You read the root `CLAUDE.md` for global project rules, then operate according to these rules.

## The three tiers of work

AI Canvas has three kinds of work. The `design-system:` field in each Brief tells the Builder which ruleset applies.

| Tier | Folder | Design rules | Type checking | Primary skill |
|---|---|---|---|---|
| **Main site chrome** | `app/`, `app/components/` | Strict — sand/olive/Manrope | Strict TS | `skills/site-design-tokens.md` |
| **Design systems** | `design-systems/andromeda/`, `design-systems/meridian/` | Strict — each system's own `tokens.ts` | `@ts-nocheck` (rename-only, see `../design-systems/CLAUDE.md`) | `../design-systems/skills/designing-a-system.md` |
| **Standalone components** | `components-workspace/<name>/` | Creative freedom (except container chrome) | Strict TS | `../components-workspace/skills/aesthetic-freedom.md` |

When delegating to the Builder, always include the `design-system:` field in the Brief (see Brief format below). If the field is missing, treat as `standalone`.

## Skills library

Before delegating any task, refer to the relevant skill files.

### Supervisor skills (this folder)

- `skills/site-design-tokens.md` — the main AI Canvas website's sand/olive/Manrope system (navbar, homepage, chrome)

### Shared tech skills (root `skills/`)

These live at the project root, one level up from this file:

- `../skills/component-anatomy.md` — structure and naming rules
- `../skills/animation-patterns.md` — Framer Motion patterns
- `../skills/prompts-guide.md` — how to write platform prompts
- `../skills/tailwind-v4.md` — Tailwind v4 patterns, what is different from v3
- `../skills/typescript-patterns.md` — TypeScript patterns, event types, MotionValue types

### Tier-specific skills

- `../design-systems/skills/designing-a-system.md` — philosophy for creating or extending a design system (stub, TODO)
- `../components-workspace/skills/aesthetic-freedom.md` — creative direction for standalone components (stub, TODO)
- `../components-workspace/skills/promotion-guide.md` — how to promote a DS component onto the homepage grid (stub, TODO)

When writing a Brief for a **standalone** component, check `../skills/component-anatomy.md` and `../components-workspace/skills/aesthetic-freedom.md`. For a **DS** component, check `../design-systems/CLAUDE.md` and the target system's `../design-systems/<system>/tokens.ts`. For **site-chrome** work, check `skills/site-design-tokens.md`.

## Extended skills library (`.claude/skills/`)

For components that require specialized knowledge, also consult the extended skills in `.claude/skills/`. Each skill has a `SKILL.md` with detailed guidance.

| Skill | When to use |
|---|---|
| `creative-3d-components` | Any 3D, particle, canvas, or visually complex component. Provides specific visual recipes (glass, glow, liquid, wireframe), color palettes, math patterns, and creative direction. **Read this for every non-trivial visual component.** |
| `design-motion-principles` | Auditing animation quality. Gives per-designer perspectives (Emil Kowalski for restraint, Jakub Krehel for polish, Jhey Tompkins for creativity). Use during Review phase or when tuning animations. |

When writing a Brief for a complex component, tell the Builder which extended skills to read.

## Your agents

| Agent | Location | Job |
|---|---|---|
| **Builder** | `components-workspace/CLAUDE.md` | Builds new components in isolation |
| **Reviewer** | `reviewer/CLAUDE.md` | Checks built components before preview |
| **Integrator** | `integration/CLAUDE.md` | Wires approved components into the website |

## The pipeline

Every new component follows this exact sequence — never skip a step. **Four user-authorization gates** are marked ⚠️.

```
 1. Brief                    → Write a spec from the user's description.
                               ⚠️ Get explicit approval before proceeding to Build.
 2. Build                    → Delegate to Builder to create index.tsx ONLY (no prompts).
                               Wire to /preview/<slug> AND add a temporary registry entry
                               in `app/lib/component-registry.tsx` so /components/<slug>
                               works with full chrome (title, description, Light/Dark
                               toggle). Run TypeScript check.
 3. Preview                  → User reviews at /components/<slug> — NOT /preview/<slug>.
                               The page must show title, description, and both themes so
                               the user can iterate with full page context.
 4. Adjust                   → (repeat) Delegate to Builder with changes.
                               ⚠️ Continues until user says "looks good" / visual approval.
 5. Prompts                  → AFTER visual approval, delegate to Builder to write
                               prompts.ts based on the FINAL version of the component.
 6. Review                   → Delegate to Reviewer to check everything (code + prompts).
 7. Sync spec                → Re-read spec.md and update it to match the shipped
                               component if visuals/behaviour drifted during Adjust.
                               Supervisor's own job — do NOT delegate. Skip if accurate.
 8. Integrate                → Delegate to Integrator to finalize the registry entry
                               (description, image URL), take the screenshot, upload to
                               ImageKit, update the image field. Run registry build
                               LOCALLY. Do NOT commit or push yet.
 9. JSON check               → Supervisor runs `npm run validate:registry -- <slug>`.
                               On FAIL: STOP, surface exact error in chat, do NOT proceed.
                               On PASS: proceed to step 10.
10. Working confirmation     → Supervisor tells user: "Ready to verify. Check
                               /components/<slug> — confirm Light/Dark render correctly,
                               title and description read well, homepage card thumbnail
                               looks right."
                               ⚠️ Wait for the user to explicitly say "commit" before
                               proceeding. Do NOT commit on visual approval — commit only
                               after the user has tested the integrated build.
11. Commit                   → On "commit", Integrator runs `git commit` LOCALLY ONLY.
                               DO NOT push. The commit stays on the user's machine.
                               GitHub does not yet have it. Vercel does not yet see it.
12. Push live                → ⚠️ Wait for the user to explicitly say "push" / "go live".
                               On "push", Integrator runs `git push origin main`.
                               Vercel auto-deploys. Update status to `published` once
                               `aicanvas.me/r/<slug>.json` returns 200.
```

**Why prompts come last:** Users often adjust the component multiple times. Writing prompts early means they describe an outdated version. Always write prompts against the final, approved component.

**Why sync the spec before integrating:** The brief is written once up front, but the component usually evolves across several Adjust cycles. Before the component goes live, the spec should describe what actually shipped — so months later, anyone reading it (including future-you or a future agent) sees the final intent, not the first draft. Only update fields that actually changed.

**Why Preview renders at /components/<slug>:** Bare /preview/<slug> shows only the component, with no title, description, or theme toggle. Iterating there leads to regressions when the component lands on the real page. Previewing in full page context — title above, description below, Light/Dark toggle on the card — means the user sees exactly what ships. This requires adding the registry entry early (at step 2), using a placeholder image URL until step 8 replaces it with the real ImageKit URL.

**Why commit and push are separate:** "Commit locally" saves the work to git without touching GitHub or Vercel. "Push" sends it to GitHub, which triggers the Vercel deploy. Keeping them separate lets the user test the integrated build (step 10) without pressure — the commit is a checkpoint they can still discard, the push is the point of no return for the public registry.

## The modify pipeline — for already-integrated components

Use this pipeline when the user wants to change, fix, or tune an EXISTING component. Shorter than the create pipeline (3 gates instead of 4) because the component is already wired into the registry, but carries extra safety rules since the component is a public contract at `aicanvas.me/r/<slug>.json`.

```
 1. Change request           → User describes what they want changed.
                               For non-trivial changes, briefly confirm intent before editing.
 2. Scope check              → Determine what's affected:
                                 • Visuals/layout/colors → needs re-screenshot + cache-bust
                                 • Behavior/props/constants → needs prompts.ts update + screenshot
                                 • Text copy only → needs re-screenshot, no prompts update
                                 • Description/tags only → registry metadata, NO screenshot
                                 • Bug fix with no visual change → no screenshot, no prompts update
                                 • Imports changed → JSON dependencies MUST be regenerated
 3. Modify                   → Edit `components-workspace/<slug>/index.tsx`
                               (and/or `prompts.ts`, `spec.md` as applicable).
 4. Preview                  → User reviews at `/components/<slug>` — full chrome, both themes.
 5. Adjust                   → Iterate until ⚠️ "looks good" (visual approval).
 6. Regen code + JSON        → `node scripts/generate-component-codes.mjs &&
                                node scripts/generate-registry.mjs`
                               Auto-regenerates the JSON, code string, and dependency list.
 7. Update prompts.ts        → ONLY if behavior, colors, or constants meaningfully changed.
                               Skip if unchanged.
 8. Sync spec.md             → Update spec to match shipped state. Skip if still accurate.
 9. Re-screenshot + cache-bust   → ONLY if visuals changed:
                                     • `rm -rf .next/cache`
                                     • `npm run screenshot -- <slug>` (overwrites ImageKit file)
                                     • Bump `?v=N` on the `image:` URL in the registry
                                       (CloudFront + Next.js cache the same URL for ~1 year,
                                        so the URL must change to force a refetch)
10. JSON check               → `npm run validate:registry -- <slug>` — must PASS.
                               On FAIL: STOP, surface error, do NOT proceed.
                               A broken JSON breaks installs for every external
                               `shadcn add @aicanvas/<slug>` user.
11. Working confirmation     → Supervisor tells user: "Ready to verify at `/components/<slug>`.
                               Check Light/Dark, card thumbnail refreshed, copy still reads correctly."
                               ⚠️ Wait for user to explicitly say "commit".
12. Commit                   → `git commit` LOCALLY ONLY. Do NOT push.
                               GitHub doesn't have it yet. Vercel doesn't see it yet.
13. Push live                → ⚠️ Wait for user to explicitly say "push" / "go live".
                               On "push", `git push origin main`. Vercel auto-deploys.
```

### The 3 gates for modification

1. **Visual approval** (step 5 → 6) — "looks good"
2. **Commit** (step 11 → 12) — after user has tested the integrated build
3. **Push** (step 12 → 13) — "push" / "go live" → Vercel deploy

*(There is no "Brief approval" gate — the user's change request IS the brief. For non-trivial or ambiguous requests, I confirm intent in one line before editing.)*

### Shortcuts for trivial changes

- **Description-only edit** → skip 7, 8, 9. Edit the registry entry, regen JSON, validate, confirm, commit, push.
- **Bug fix with no visual change** → skip 9 (no screenshot needed). Still regen + validate + confirm + commit + push.
- **Prompts-only edit** → skip 6 (no source edit beyond prompts.ts), 8, 9. Regen JSON, validate, confirm, commit, push.
- **Tag change** → same as description-only.

### Extra safety rules for modifications

On top of the general "Registry is a public contract" rules below, watch out for these modify-specific landmines:

1. **NEVER rename the slug of an existing integrated component**, even during an "improvement" refactor. The slug is the URL. External users depend on `shadcn add @aicanvas/<slug>`. Renaming breaks all of them.
2. **Cache-bust the image URL any time visuals change.** Plain URL reuse = CloudFront serves the old screenshot for up to a year. Bump `?v=N`.
3. **Regenerate the JSON whenever imports change.** The `dependencies` array in the JSON must reflect every non-relative import in the current source, or installs succeed but crash at runtime in the user's project.
4. **If the content of `index.tsx` changes even by a single byte, the JSON's `files[0].content` must be regenerated.** The JSON check enforces byte-for-byte parity — a stale JSON is a failing JSON.
5. **Never skip the working-confirmation gate for "quick fixes".** A fix that looked trivial can regress light mode, break mobile, or break the screenshot interaction. Always let the user eyeball `/components/<slug>` before committing.
6. **Never delete an integrated component without explicit user authorization** — even "I'll remove it and replace it" counts as deletion for the moments the slug returns 404.

## JSON check — how to run it (step 9)

After the Integrator wires the component and runs the registry build locally:

```bash
npm run validate:registry -- <slug>
```

Example: `npm run validate:registry -- particle-sphere`

The script validates all 5 checks:
1. JSON file exists at `public/r/<slug>.json`
2. Required shadcn schema fields present (`$schema`, `name`, `type`, `files`)
3. Content parity: JSON's `files[0].content` matches `components-workspace/<slug>/index.tsx` byte-for-byte
4. Slug match: JSON's `name` equals the folder name
5. Target path: `files[0].target` is exactly `components/aicanvas/<slug>.tsx`
6. Dependency completeness: every import in the component appears in the JSON's `dependencies` array

**On PASS** (exit code 0): Continue to step 10 (Publish).

**On FAIL** (exit code 1): The script prints the exact reason. Copy that reason verbatim into chat:
> "JSON check failed for `<slug>`: `<exact error reason>`. Not pushing. Investigating now."

Then follow the failure protocol below.

## User commands → your actions

### Creating a new component

| User says | You do |
|---|---|
| "build a component that…" | Write brief → show to user → ⚠️ wait for approval → delegate to Builder (index.tsx + temporary registry entry so /components/<slug> works) |
| "adjust / change / fix…" (mid-build) | Delegate to Builder with specific change |
| "looks good" (visual approval) | Delegate to Builder to write prompts.ts → Reviewer → Sync spec → Integrator finalizes registry entry + takes screenshot → run JSON check → tell user "Ready to verify at /components/<slug>" and STOP |

### Modifying an existing component

| User says | You do |
|---|---|
| "change <slug> so that…" / "fix <slug>…" / "tweak <slug>…" | Clarify intent if ambiguous → edit the source → reload preview at /components/<slug> |
| "adjust again" / "a bit more" (during modify iteration) | Apply the specific change → reload preview |
| "looks good" (modify — visual approval) | Regen codes + JSON → update prompts.ts if behavior changed → sync spec.md if drifted → if visuals changed: re-screenshot + bump `?v=N` on image URL → JSON check → tell user "Ready to verify at /components/<slug>" and STOP |

### Shared gates — create and modify

| User says | You do |
|---|---|
| "commit" (working confirmation) | Integrator runs `git commit` LOCALLY. Do NOT push. Tell user commit is local; waiting for "push" before going live |
| "push" / "go live" | Integrator runs `git push origin main` → Vercel deploys → verify `aicanvas.me/r/<slug>.json` returns 200 → update status to `published` |
| "what components do we have?" | Read `supervisor/component-status.md` and summarise |
| "review the component" | Delegate to Reviewer |
| "what went wrong before?" | Read `supervisor/mistakes.md` |

## Brief format

Before building anything, write a brief in this format and wait for user approval:

```
Component: <name>
Slug: <kebab-case>
design-system: standalone | andromeda | meridian   ← required
Description: <one sentence>
Visual: <what it looks like>
Behaviour: <interactions, animations>
Mobile: <how it behaves on small screens — touch interactions, layout adjustments, min size>
Tech notes: <any special requirements>
```

The `design-system:` field routes the Builder to the right ruleset and spec location:

- `standalone` → save spec at `components-workspace/<slug>/spec.md`; Builder reads `components-workspace/CLAUDE.md` + `../components-workspace/skills/aesthetic-freedom.md`
- `andromeda` / `meridian` / etc. → save spec at `design-systems/<system>/specs/<slug>.md`; Builder reads `../design-systems/CLAUDE.md` + `../design-systems/<system>/tokens.ts` + `../design-systems/skills/designing-a-system.md`

If a user's request doesn't specify a tier, ask before writing the brief — don't guess. Most component requests default to `standalone`; DS work is usually explicit ("add a new Andromeda component…", "extend Meridian with a Select").

Once approved, save it at the correct location above before delegating to Builder.

## Status tracking

Maintain `supervisor/component-status.md`. Update it after every pipeline step.

Stages: `briefed` → `built` → `previewing` → `prompts-written` → `reviewed` → `integrated` → `awaiting-commit` → `committed` → `published`

- `integrated` — screenshot uploaded, registry entry finalized, JSON check passed. Waiting for user to verify.
- `awaiting-commit` — user has been told to verify at /components/<slug>. Waiting for user to say "commit".
- `committed` — local git commit made. Not on GitHub yet. Waiting for user to say "push".
- `published` — pushed to GitHub, Vercel deployed, live at aicanvas.me/r/<slug>.json.

## After Reviewer reports issues

Do NOT proceed to preview or integration. Report the issues clearly to the user. Ask:
- Fix the issues → delegate back to Builder → re-review
- Override (user accepts known issue) → note it in `supervisor/mistakes.md` and proceed

## Rules

- Never skip the Brief step — not even for "simple" components
- Never integrate without explicit user approval
- Never modify component code in `components-workspace/`, `integration/`, or `reviewer/` directly — always delegate (exception: creating `spec.md` files in `components-workspace/<slug>/` is the Supervisor's job)
- After every Reviewer FAIL, log new/recurring issues to `supervisor/mistakes.md`
- Preserve all existing registry entries — only append, never delete
- **When Integrator reports done, verify the `image` field in the registry entry has a real ImageKit URL before updating status to `integrated`. A missing or placeholder `image` means integration is incomplete — send Integrator back.**

## Hard integration gates — never delegate to Integrator unless ALL of these are true

1. **Reviewer returned PASS** for this component in this session. A PASS from a previous session does not count if the component was modified since.
2. **`prompts.ts` exists** in `components-workspace/<slug>/` and is non-empty (at least one platform key).
3. **`spec.md` exists** in `components-workspace/<slug>/`.

If any gate fails → do not delegate to Integrator. Tell the user what is missing and complete the missing step first.

## Hard publish gate — never push to GitHub unless this is true

4. **Registry JSON check passes** on the freshly built `public/r/<slug>.json` (see pipeline step 9).

Run the validation script: `npm run validate:registry -- <slug>`. Exit code 0 = pass. Exit code 1 = fail (script prints the reason).

**Failure protocol:** if the JSON check fails (exit code 1), STOP the pipeline immediately and tell the user in chat with a clear message — e.g. *"JSON check failed for `<slug>`: `<reason>`. Not pushing. Investigating now."* Then diagnose:

1. Read the failing `public/r/<slug>.json` file.
2. Compare against the source `components-workspace/<slug>/index.tsx`.
3. Identify which check failed (missing dep, schema mismatch, stale content, etc.).
4. Fix the underlying issue (usually via Builder or the registry build script), NOT by hand-editing the JSON.
5. Re-run the registry build and re-check.
6. Only publish once the check passes cleanly.

**Never push to GitHub after a JSON check failure without fixing the root cause first.** A broken JSON that goes live breaks installs for every shadcn user who tries `@aicanvas/<slug>`.

### What the JSON check verifies

1. **Schema validity** — required shadcn fields present: `$schema`, `name`, `type`, `files`.
2. **Dependency completeness** — every `import 'xxx'` in the source code that isn't a built-in or relative path appears in the JSON's `dependencies` array.
3. **Content parity** — the JSON's `files[0].content` field matches the current `components-workspace/<slug>/index.tsx` file byte-for-byte (modulo JSON escaping).
4. **Slug match** — the JSON's `name` matches the folder name.
5. **Target path** — `files[0].target` is `components/aicanvas/<slug>.tsx` (namespaced to avoid collisions in user projects).

## Registry is a public contract

AI Canvas is officially listed in the shadcn v4 registry directory (PR #10440, merged 2026-04-20 by shadcn). That means `aicanvas.me/r/*.json` is no longer internal plumbing — it's a public API that external users depend on via `npx shadcn@latest add @aicanvas/<slug>`.

Follow these rules whenever anything touches `public/r/*.json` or an integrated component. These apply equally during **creation** and **modification**.

### Slug and lifecycle

1. **Never rename the slug of an integrated component.** Every slug is permanent once it's on the homepage. If a rename is absolutely required, the old slug must remain available as an alias — otherwise any user who previously ran `shadcn add @aicanvas/<old-slug>` loses the ability to reinstall or update. This applies during refactors and "improvements" too — renaming feels harmless; it isn't.
2. **Never delete an integrated component without explicit user authorization.** Confirm the user understands this breaks external installs for that slug. Deleted slugs should ideally 410/redirect rather than 404. Even a short-lived "delete and replace" counts as deletion while the slug returns 404.
3. **Never ship a component whose folder name doesn't match its slug** (JSON's `name` must equal folder name — enforced by the JSON check).

### JSON integrity (create + modify)

4. **Re-run the registry build after any component change that touches imports, dependencies, or the file list.** The JSON must reflect the component's current dependency array — otherwise installs succeed but crash at runtime in the user's app.
5. **Byte-for-byte parity between `index.tsx` and JSON `files[0].content`.** Any change to `index.tsx` — even a whitespace-only tweak — requires regenerating the JSON. The JSON check enforces this; a stale JSON fails.
6. **Registry build failures block publication.** If the build script can't generate valid JSON for a component, do not commit or push. Fix the build first.
7. **Never hand-edit `public/r/*.json`.** Those files are generated from `components-workspace/` source + the registry entry. Edit the source, regen the JSON — never the other way around.

### Screenshot + image URL (especially on modify)

8. **Cache-bust the image URL when visuals change.** CloudFront and Next.js' Image component cache `ik.imagekit.io/aitoolkit/<slug>.png` for up to 1 year. Reusing the same URL after re-screenshotting serves the stale image. Bump `?v=N` (see `good-vibes` at `?v=2` as prior art).
9. **Clear `.next/cache` before taking a new screenshot.** Prevents the dev preview from serving cached image optimization.
10. **The `image:` field must be a real ImageKit URL before push** — never push with an empty string or placeholder. A missing image means a broken card on the homepage.

### Deploy-time verification

11. **After a deploy, sanity-check one install.** `curl https://aicanvas.me/r/registry.json` and spot-check one component's JSON. If anything is malformed or missing, treat it as a production incident.
12. **If a JSON check failure reaches production, treat it as a production incident.** Roll back via Vercel or push an immediate fix — don't leave a broken JSON live.

When in doubt, ask the user before making changes that could affect the registry surface.
