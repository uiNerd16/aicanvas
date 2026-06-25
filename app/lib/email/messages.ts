// ─── email/messages ───────────────────────────────────────────────────────────
// App-sent lifecycle emails (NOT Supabase auth templates). Each returns the
// rendered HTML using the shared adaptive shell so they match every other email.
// Senders/triggers live in the routes that call these (auth callback, cancel-
// confirm) along with their send-once guards.

import { emailShell, emailText } from './shell'

/** Onboarding email, sent once after a brand-new account's first confirmation.
 *  The "send only for accounts created after launch, once" guard lives in the
 *  auth callback so existing users never receive it. */
export function welcomeEmail(): { subject: string; html: string } {
  const html = emailShell({
    title: 'Welcome to AI Canvas',
    heading: "You're in",
    bodyHtml: `<p ${emailText('secondary', 'margin:0;font-size:15px;line-height:1.6;')}>Your account is live. Grab any component with its full source code and remix it with your AI coding agent. Everything ships ready to paste into your project.</p>`,
    button: { label: 'Start building', url: 'https://aicanvas.me' },
  })
  return { subject: 'Welcome to AI Canvas', html }
}

/** Closes the loop after the cancellation-confirm link actually cancels the
 *  Paddle subscription. Only sent when a real cancel was executed this request
 *  (see app/api/billing/cancel-confirm), so a replayed link can't re-send. */
export function cancellationConfirmedEmail(opts: { endsAt: Date | null }): { subject: string; html: string } {
  const ends = opts.endsAt
    ? opts.endsAt.toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
    : 'the end of your current billing period'
  const bodyHtml = `<p ${emailText('secondary', 'margin:0;font-size:15px;line-height:1.6;')}>Your AI Canvas Premium cancellation is confirmed. You keep full access until <strong ${emailText('primary')}>${ends}</strong>, and you won't be charged again.</p>`
  const html = emailShell({
    title: 'Your cancellation is confirmed',
    heading: 'Your cancellation is confirmed',
    bodyHtml,
  })
  return { subject: 'Your cancellation is confirmed', html }
}
