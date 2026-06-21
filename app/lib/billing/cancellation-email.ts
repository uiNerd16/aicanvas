// ─── cancellation-email ───────────────────────────────────────────────────────
// Builds the §312k Abs. 3 "Eingangsbestätigung": the durable-medium confirmation
// that a cancellation was received. By statute it must state three things —
// the CONTENT of the cancellation, the DATE/TIME it was received, and the TIME
// the contract will end. This email also carries the ownership-confirm link that
// actually completes the cancellation (clicking proves control of the account
// email). Bilingual: German first (statutory market), English alongside.

const FONT = "'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Stable, locale-independent timestamp (UTC) for the legal record. */
function fmt(d: Date): string {
  return d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
}

export type CancelReceipt = {
  plan: string
  receivedAt: Date
  endsAt: Date | null
  confirmUrl: string
  /** Extraordinary cancellation (for cause): processed asap after we review the reason. */
  extraordinary?: boolean
}

export function cancellationReceiptEmail(r: CancelReceipt): { subject: string; html: string; text: string } {
  const received = fmt(r.receivedAt)
  const periodEndDe = r.endsAt ? fmt(r.endsAt) : 'dem Ende deines aktuellen Abrechnungszeitraums'
  const periodEndEn = r.endsAt ? fmt(r.endsAt) : 'the end of your current billing period'
  const endsDe = r.extraordinary
    ? `so bald wie möglich, nach Prüfung deines Grundes (spätestens ${periodEndDe})`
    : periodEndDe
  const endsEn = r.extraordinary
    ? `as soon as possible after we review your reason (at the latest ${periodEndEn})`
    : periodEndEn
  const plan = esc(r.plan)

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#1A1A19;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1A1A19;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#21211F;border:1px solid #383836;border-radius:16px;">
          <tr><td style="padding:28px 32px 0 32px;">
            <p style="margin:0;font-family:${FONT};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#A8B94D;font-weight:700;">AI Canvas &middot; Kündigung</p>
            <h1 style="margin:8px 0 0 0;font-family:${FONT};font-size:20px;line-height:1.3;color:#FAFAF0;font-weight:800;">Kündigung erhalten / Cancellation received</h1>
          </td></tr>
          <tr><td style="padding:20px 32px 8px 32px;">
            <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:#E8E8DF;">Wir haben deine Kündigung für <strong style="color:#FAFAF0;">${plan}</strong> erhalten. Bestätige unten, um sie abzuschließen.<br/><span style="color:#9E9E98;">We received your cancellation for ${plan}. Confirm below to complete it.</span></p>
            <p style="margin:0 0 4px 0;font-family:${FONT};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9E9E98;font-weight:700;">Eingang / Received</p>
            <p style="margin:0 0 14px 0;font-family:${FONT};font-size:15px;color:#FAFAF0;">${received}</p>
            <p style="margin:0 0 4px 0;font-family:${FONT};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9E9E98;font-weight:700;">Vertrag endet / Subscription ends</p>
            <p style="margin:0 0 18px 0;font-family:${FONT};font-size:15px;color:#FAFAF0;">${esc(endsDe)}<br/><span style="color:#9E9E98;font-size:13px;">${esc(endsEn)}</span></p>
            <p style="margin:0 0 20px 0;font-family:${FONT};font-size:14px;line-height:1.6;color:#9E9E98;">Du behältst bis dahin vollen Zugang. / You keep full access until then.</p>
          </td></tr>
          <tr><td style="padding:0 32px 24px 32px;">
            <a href="${r.confirmUrl}" style="display:inline-block;font-family:${FONT};font-size:15px;font-weight:700;color:#0E0E0F;background:#A8B94D;text-decoration:none;padding:12px 22px;border-radius:10px;">Kündigung bestätigen / Confirm</a>
          </td></tr>
          <tr><td style="padding:0 32px 28px 32px;border-top:1px solid #383836;padding-top:18px;">
            <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.5;color:#7D7D78;">Wenn du das nicht warst, ignoriere diese E-Mail — es passiert nichts. / If this wasn't you, just ignore this email; nothing happens. Der Link ist 24 Stunden gültig.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`

  const text = `Kündigung erhalten / Cancellation received

Wir haben deine Kündigung für ${r.plan} erhalten. / We received your cancellation for ${r.plan}.

Eingang / Received: ${received}
Vertrag endet / Subscription ends: ${endsDe} / ${endsEn}

Bestätige deine Kündigung / Confirm your cancellation:
${r.confirmUrl}

Du behältst bis dahin vollen Zugang. / You keep full access until then.
Wenn du das nicht warst, ignoriere diese E-Mail. Der Link ist 24 Stunden gültig.`

  return { subject: 'Bestätige deine Kündigung / Confirm your cancellation', html, text }
}
