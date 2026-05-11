# Component screenshots — capture & upload

Living document — extend as new edge cases come up.

## At capture
- **Source dimensions:** target ~1920×1080. Going much bigger is wasteful; ImageKit transforms down at serve time. Going smaller means it can't scale up cleanly.
- **Format:**
  - PNG → line-art, sharp UI, screenshots with text
  - JPEG (q90+) → photographic content, gradients, generative visuals where minor compression is invisible
- **Don't pre-compress.** ImageKit handles compression at serve time via URL transformations. Upload at high quality so the source stays clean.

## At upload
- **Filename:** `<slug>.<ext>` matching the registry slug.
- **Path:** `https://ik.imagekit.io/aitoolkit/<slug>.<ext>`
- **Cache-bust on update:** append `?v=N` (incrementing) — see `feedback_component_modify_pipeline` and `feedback_screenshot_cleanup` memories. Also delete the old ImageKit file when replacing.

## How serving works (don't fight this)
The ComponentCard renders every screenshot through `optimizeImageKitUrl(url, 'card')` from `app/lib/imagekit.ts`, which appends `?tr=w-800,q-85,f-auto`:
- `w-800` — 2× retina at the ~400px card display width
- `q-85` — visually indistinguishable, ~50% smaller payload
- `f-auto` — WebP for modern browsers, JPEG/PNG fallback otherwise

Because ImageKit transforms at serve time, **upload-side optimization is not load-bearing**. Focus capture-side effort on quality, not file size.

## When q-85 isn't enough
If a specific component shows compression artifacts (banding on smooth gradients, fuzzy fine lines, color shifts in olive accents), bump that component's render to the `'detail'` preset (`q-90`) or, in extreme cases, increase the `card` preset's quality in `app/lib/imagekit.ts`. Verify on localhost before committing.

## Existing query strings
A handful of registry URLs already carry `?v=N` cache busters. The helper appends with `&` when a query string already exists, so cache-busting and `tr=` coexist correctly. Don't strip the `?v=N` — it's how the modify pipeline invalidates Next/CDN caches on screenshot updates.
