# Affiliate Deep Links for Remix with AI

## Summary

Change the "Remix with AI" dropdown so that V0 and Lovable buttons open the platform in a new tab with the prompt pre-filled AND copy the prompt to clipboard as a fallback. Claude Code stays as copy-to-clipboard only. Affiliate tracking params are included in the URLs for future revenue.

## Current behavior

All three platform buttons (Claude Code, Lovable, V0) call `copyPrompt(platform)` which copies the prompt string to the clipboard and shows "Copied!" for 2 seconds. No external links are opened.

**File:** `app/components/[slug]/ComponentPageView.tsx`, lines 223-231 (copyPrompt function), lines 466-482 (dropdown buttons).

## New behavior

### V0
- **Action:** `window.open()` a new tab + copy prompt to clipboard
- **URL format:** `https://v0.dev/chat?q={encodeURIComponent(prompt)}&via={V0_AFFILIATE_ID}`
- **Note:** The `?q=` param auto-submits the prompt immediately in V0

### Lovable
- **Action:** `window.open()` a new tab + copy prompt to clipboard
- **URL format:** `https://lovable.dev/?autosubmit=true#prompt={encodeURIComponent(prompt)}`
- **Affiliate param:** TBD — placeholder in config, added when program details are confirmed
- **Note:** Prompt goes in the hash fragment (`#prompt=`), not query params

### Claude Code
- **Action:** Copy to clipboard only (no change from current behavior)
- **No deep link, no affiliate**

## Config

A single config object for affiliate IDs, stored in a new file `app/lib/affiliate-config.ts`:

```ts
export const AFFILIATE_CONFIG = {
  v0: {
    baseUrl: 'https://v0.dev/chat',
    affiliateParam: 'via',
    affiliateId: 'PLACEHOLDER', // Replace with real ID after approval
  },
  lovable: {
    baseUrl: 'https://lovable.dev/',
    affiliateParam: null, // TBD — update when affiliate program details arrive
    affiliateId: 'PLACEHOLDER',
  },
} as const
```

## Implementation changes

### 1. Create `app/lib/affiliate-config.ts`
New file with the config object above.

### 2. Modify `copyPrompt()` in `ComponentPageView.tsx`

Replace the current `copyPrompt` function with a new `handlePlatformClick(platform)` that:

1. Copies the prompt to clipboard (same as now)
2. Sets the "Copied!" feedback state (same as now)
3. If platform is V0: builds the deep link URL from config + prompt, opens in new tab
4. If platform is Lovable: builds the deep link URL from config + prompt, opens in new tab
5. If platform is Claude Code: does nothing extra (copy only)

### 3. Update dropdown button `onClick`

Change from:
```ts
onClick={() => {
  copyPrompt(platform)
  setPromptDropdownOpen(false)
}}
```

To:
```ts
onClick={() => {
  handlePlatformClick(platform)
  setPromptDropdownOpen(false)
}}
```

### 4. Update button labels (optional)

Consider changing "Try in V0" / "Try in Lovable" to "Open in V0" / "Open in Lovable" to signal that a new tab will open, while Claude Code stays as "Copy for Claude Code". This is optional — can keep current labels if preferred.

## URL construction

### V0
```ts
const url = new URL('https://v0.dev/chat')
url.searchParams.set('q', prompt)
if (affiliateId !== 'PLACEHOLDER') {
  url.searchParams.set('via', affiliateId)
}
window.open(url.toString(), '_blank')
```

### Lovable
```ts
const base = affiliateId !== 'PLACEHOLDER'
  ? `https://lovable.dev/?autosubmit=true`  // add affiliate param when known
  : `https://lovable.dev/?autosubmit=true`
const url = `${base}#prompt=${encodeURIComponent(prompt)}`
window.open(url, '_blank')
```

## Prompt length consideration

V0 prompts go in query params — there's a practical URL length limit (~8,000 chars in most browsers, ~2,000 in older ones). Current prompts range from ~2,400 to ~7,300 chars. After URL encoding, the longest prompts could push the limit.

Lovable prompts go in the hash fragment — no server-side limit, handled client-side only. Lovable explicitly supports up to 50,000 chars.

**Mitigation:** If a V0 URL exceeds 8,000 chars total, fall back to copy-only behavior for that component and log a console warning. This is unlikely for most prompts but worth guarding.

## Files touched

1. **New:** `app/lib/affiliate-config.ts` — affiliate IDs and URL templates
2. **Modified:** `app/components/[slug]/ComponentPageView.tsx` — new `handlePlatformClick`, import config

No other files change. No new dependencies.
