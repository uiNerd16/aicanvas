# Monetization launch checklist

Ordered steps to take the subscription system live. Items marked **(done)** are
already handled in code/db; everything else is an operational step.

## Already in place
- **(done)** Migrations 0009/0010/0011 applied to prod (tokens backfilled, signup trigger fixed + verified).
- **(done)** All gating/billing code merged behind flags; defaults keep production unchanged.
- **(done)** Paddle sandbox fully wired and tested (webhook signature, idempotency, activation guards).

## Before flipping anything
1. **Apply the hardened `consume_quota`** to prod (advisory-lock version from `0011_usage_daily.sql`) — makes the daily limit a hard ceiling under concurrency.
2. **Paddle production setup** (mirror of the sandbox steps):
   - Live Paddle account verified (KYB), product + the two prices created.
   - Approved domain: `aicanvas.me`. Webhook destination: `https://aicanvas.me/api/webhooks/paddle` (subscription.* + transaction.completed).
   - Decide the monthly price vs Paddle's $10 floor before creating the live prices.
3. **Vercel env vars** (Production):
   - `SUPABASE_SECRET_KEY`, `USAGE_IP_SALT` (random, never empty — metering fails closed without it)
   - `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`, `PADDLE_ENV=production`
   - `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, `NEXT_PUBLIC_PADDLE_ENV=production`, `NEXT_PUBLIC_PADDLE_PRICE_MONTHLY/YEARLY`
4. **Vercel Pro** — Hobby's terms don't allow commercial use; upgrade before charging money.
5. **Publish `@aicanvas/mcp@0.2.0` to npm** — old installs send no token and don't understand 402s. Must be the published `@latest` BEFORE enforcement flips, or every existing MCP user breaks with raw errors.
6. **User communication** — site banner and/or email to opted-in users explaining the free tier (10/day signed in) before the gate goes on.

## Flip sequence (each takes effect on the next deploy)
1. `NEXT_PUBLIC_PREMIUM_ENABLED=true` → deploy → verify pricing/paywalls/badges with enforcement still permissive.
2. End-to-end live-payment test: real checkout on production Paddle (then refund via Paddle dashboard if desired).
3. `REGISTRY_ENFORCEMENT=enforce` → deploy → **purge the CDN cache** (permissive-mode cached registry responses must not outlive the flip).
4. Smoke-test: anonymous 2/day wall, free 10/day via token, premium unlimited, design systems 402 for free users, MCP + CLI both surface the upgrade message.

## Kill switches (in order of blast radius)
- `REGISTRY_ENFORCEMENT=permissive` + redeploy → gate off, premium UI stays.
- `NEXT_PUBLIC_PREMIUM_ENABLED=false` + redeploy → entire premium experience invisible.
- Note: enforcement auto-falls-back to permissive (with a loud server log) if the premium UI flag is off — blocked users must always have an upgrade path.

## Known accepted risks (documented decisions)
- CLI token rides in the install URL query string (shadcn ergonomics). Mitigated: 90-day expiry, one-click rotation, `last_used_at` stamping, no-store responses. Revisit if abuse appears.
- Anonymous metering trusts `x-real-ip` (Vercel-set). Spoofable on non-Vercel hosts only.
- `usage_daily` prune runs best-effort in the hot path; move to pg_cron/Vercel Cron if retention ever needs a hard guarantee.
