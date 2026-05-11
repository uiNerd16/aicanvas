// ─── safeNext ─────────────────────────────────────────────────────────────────
// Open-redirect guard for any `?next=` parameter we honour after auth flows.
// Without this, `https://aicanvas.me/account/auth/callback?next=https://evil.com`
// would happily redirect the freshly-authenticated user to evil.com — and
// since `next` flows through the OAuth/email-confirmation callback, it's a
// classic phishing vector.
//
// A valid target must be a same-origin path:
//   • starts with a single `/` (a local path)
//   • does NOT start with `//` (protocol-relative URL → external)
//   • does NOT start with `/\` (Windows-style scheme prefix some browsers
//     normalize back to a protocol-relative URL)
//   • not blank
// Anything else falls back to the supplied default (typically `/account`).

export function safeNext(input: string | null | undefined, fallback = '/account'): string {
  if (!input || typeof input !== 'string') return fallback
  if (!input.startsWith('/')) return fallback
  if (input.startsWith('//') || input.startsWith('/\\')) return fallback
  return input
}
