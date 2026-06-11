# Subscription copy audit

Every line of live site copy the freemium model contradicts, with its premium-aware rewrite.

Rules applied (from the spec + repo decision 2026-06-11):
- Never call the whole site "free" wholesale anymore. The *components* stay open source (MIT, public repo); the *service* has free and premium tiers.
- Standalone components are free with daily limits (2/day anonymous, 10/day signed in). Design systems and templates are premium.
- Remix with AI stays free everywhere, every tier.
- Never promise "exclusive" or "protected" source. Premium sells convenience: unlimited installs, design systems, templates.
- House style: no em-dashes in user-facing copy.

These rewrites apply when `NEXT_PUBLIC_PREMIUM_ENABLED=true` flips on (Plan 4 / launch). Flag off keeps today's copy. Lines marked **(launch)** change unconditionally at launch since metadata cannot be flag-branched per request.

| # | File | Current line | Premium-aware rewrite |
|---|------|--------------|----------------------|
| 1 | `app/layout.tsx:33` (global meta description) | "Free, open-source registry of N animated React components…" | "Open-source registry of N animated React components built with Tailwind CSS and Motion. Free daily installs, premium design systems, and AI reproduction prompts for Claude Code, Lovable, and v0." **(launch)** |
| 2 | `app/page.tsx:7` (homepage meta description) | "Free, open-source registry of N animated React components… Install with one command or remix with AI prompts…" | "Open-source registry of N animated React components. Install free components with one command, remix with AI for free, or go premium for design systems and unlimited installs." **(launch)** |
| 3 | `app/home/HomePageClient.tsx:711` (hero) | "Everything here is free, open source, and ready to ship." | "Open source and ready to ship. Free components every day, premium design systems when you need a whole language." |
| 4 | `app/home/HomePageClient.tsx:753` (stats strip) | `$0 / Free Forever` | Replace the stat with `Remix / Always Free` (Remix is the funnel and stays free for everyone). |
| 5 | `app/components/SiteFooter.tsx:24` | "AI native components. Free and open source." | "AI native components. Open source, with free daily installs." |
| 6 | `app/components/[slug]/page.tsx:43` (per-component meta) | "Install via shadcn CLI. Free and open source." | Standalone: "Install via shadcn CLI. Open source, free to install." Design system or template: "Install via shadcn CLI. Part of a premium design system." **(launch)** |
| 7 | `app/pricing/page.tsx:35` (Nerd tagline) | "Browse the canvas freely. Copy any component or prompt with no account, no friction." | Whole page is rebuilt by Task 7 as Free vs Premium. Free card: "Browse everything. Install up to 10 components a day with a free account, 2 without one. Remix with AI is always free." |
| 8 | `app/pricing/page.tsx:216` (hero) | "AI Canvas is free, forever. Browse as a Nerd or sign up as a Hero…" | "Start free, upgrade when you need more. Free accounts install 10 components a day. Premium unlocks design systems, templates, and unlimited installs." |
| 9 | `app/pricing/page.tsx:60` ("EVERYTHING IN NERD, PLUS") | Free-vs-free framing | Becomes "EVERYTHING IN FREE, PLUS" on the Premium card (Task 7). |
| 10 | `app/support/page.tsx:161` | "AI Canvas is free, forever. If it has saved you time…" | "AI Canvas runs on a generous free tier. If it has saved you time…" |
| 11 | `app/terms/page.tsx:73` | "AI Canvas is a free, open-source registry of animated React components…" | "AI Canvas is an open-source registry of animated React components with free and premium tiers." Full terms rework (billing, cancellation, withdrawal) is Plan 4 Task 7b. **(launch)** |
| 12 | `app/privacy/page.tsx:121` ("/r/ paths process no personal data") | "No personal data is processed on these paths and no account cookies are read." | Rewritten by Plan 3 Task 8 when the registry route starts reading tokens and counting hashed IPs. **(launch, Plan 3)** |
| 13 | `app/mcp/page.tsx:31` (JSON-LD `offers: price 0`) | `offers: { price: '0' }` | Keep price 0 for the MCP app itself (the server IS free); the gated thing is component delivery. No change needed, noted for awareness. |
| 14 | `app/mcp/page.tsx` ("What you get" cards) | "your agent can search, inspect, and install AI Canvas components on its own" | Add one honest sentence when the flag is on: "Free accounts pull 10 components a day. Design systems and templates need Premium." (Task 8). |

Not flagged: `app/lib/auth-errors.ts:28` ("No account uses that email yet") and the Lab delete dialog ("Delete forever") match the pattern grep but are unrelated to pricing.
