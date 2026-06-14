export const GITHUB_URL = 'https://github.com/uiNerd16/aicanvas'
export const X_URL = 'https://x.com/uiNerd'
export const SITE_URL = 'https://aicanvas.me'
export const CONTACT_EMAIL = 'aicanvas.me@gmail.com'

// Sender for the website contact form (app/api/contact). The aicanvas.me domain
// is verified in Resend, so any @aicanvas.me address is a valid sender. Messages
// are delivered to CONTACT_EMAIL with reply_to set to the visitor, so replying
// in Gmail goes back to them — see app/api/contact/route.ts.
export const CONTACT_FROM = 'AI Canvas <contact@aicanvas.me>'

// Update this date whenever you push new components to production.
// Any component with badge: 'New' will show the badge for 96 hours from this date.
export const LAST_DEPLOY = '2026-04-18'
