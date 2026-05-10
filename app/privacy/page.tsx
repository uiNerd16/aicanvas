'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { GithubLogo, XLogo } from '@phosphor-icons/react'
import { GITHUB_URL, X_URL, CONTACT_EMAIL } from '../lib/config'
import { SiteFooter } from '../components/SiteFooter'

// ─── /privacy ─────────────────────────────────────────────────────────────────
// Datenschutzerklärung — Art. 13 GDPR notice. Trimmed to the strict minimum:
// every section here is required by Art. 13 GDPR, BDSG, or § 25 TDDDG.
// Best-practice but non-mandatory items (SSL/TLS statement, data-categories
// enumeration, dedicated hosting/email subsections, AI usage disclosure) were
// intentionally left out for cleanliness.
//
// Controller info lives entirely in /impressum (Alexandru Tatu, Munich).
// If the operator ever changes (e.g. to a Romanian SRL), update both the
// controller link target's content and the supervisory authority below
// (currently BayLDA — would become ANSPDCP for a Romanian operator).

export default function PrivacyPage() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scrollParent = ref.current?.parentElement
    if (scrollParent) {
      scrollParent.style.backgroundColor = 'var(--color-sand-950)'
      return () => { scrollParent.style.backgroundColor = '' }
    }
  }, [])

  return (
    <div ref={ref} className="min-h-full bg-sand-950">
      <header className="sticky top-0 z-50 hidden h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-800 bg-sand-950 px-6 md:grid">
        <div />
        <Link href="/privacy" className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400">
          /Privacy
        </Link>
        <div className="flex items-center justify-end gap-1">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-400 transition-colors hover:bg-sand-800 hover:text-sand-100">
            <GithubLogo weight="regular" size={20} />
          </a>
          <div className="mx-1 h-4 w-px bg-sand-700" />
          <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-400 transition-colors hover:bg-sand-800 hover:text-sand-100">
            <XLogo weight="regular" size={20} />
          </a>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <p className="mb-6 text-sm font-semibold md:hidden">
          <span className="text-olive-500">/Privacy</span>
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-sand-500">
          Last updated: 2026-05-10. This policy describes how AI Canvas processes
          personal data, in line with the EU General Data Protection Regulation
          (GDPR / DSGVO) and the German Bundesdatenschutzgesetz (BDSG).
        </p>

        {/* ── 1. Controller ─────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-sand-50">1. Controller</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            The controller responsible for the processing of personal data on this
            site is the operator named in the{' '}
            <Link href="/impressum" className="text-olive-400 hover:underline">
              Impressum
            </Link>
            . For privacy questions, contact{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-olive-400 hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        {/* ── 2. What we collect and why ────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">2. What we collect</h2>

          <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-sand-300">
            Account data
          </h3>
          <p className="mt-2 leading-relaxed text-sand-400">
            When you create an account we store your email address and a salted,
            bcrypt-hashed version of your password. If you sign in with Google we
            store the Google account identifier and email returned by Google's
            OAuth flow instead of a password. We never see or store your Google
            password. Account data lives in our authentication database operated
            by Supabase (see Section 5).
          </p>

          <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-sand-300">
            Usage data tied to your account
          </h3>
          <p className="mt-2 leading-relaxed text-sand-400">
            While signed in, we record which components you save (saved
            components), which CLI install commands you copy (install history,
            including the package manager you used), and your interface
            preferences (preferred package manager, preferred AI platform). This
            data is private to you, protected by row-level security, and only
            used to power features such as your saved list, your install history
            tab, and pre-selected defaults in the install drawer.
          </p>

          <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-sand-300">
            Technical data (everyone)
          </h3>
          <p className="mt-2 leading-relaxed text-sand-400">
            Our hosting provider Vercel records standard server logs containing IP
            address, user-agent string, and timestamp for each request. These
            logs are short-lived and used to detect abuse and operate the
            service. Vercel Web Analytics produces aggregated, cookieless traffic
            statistics — visitors are identified only by a per-day hash of the
            request and the hash is discarded after 24 hours. No personal
            identifier is created and no cross-site tracking is possible.
          </p>

          <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-sand-300">
            Anonymous registry hits
          </h3>
          <p className="mt-2 leading-relaxed text-sand-400">
            Requests to the public component registry endpoints (paths under{' '}
            <code className="rounded bg-sand-900 px-1 py-0.5 text-xs text-sand-300">/r/</code>
            ) are made by the shadcn CLI and the AI Canvas MCP without any user
            session. These hits are aggregated anonymously so we can see which
            components are being installed. No personal data is processed on
            these paths and no account cookies are read.
          </p>
        </section>

        {/* ── 3. Legal basis ─────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">3. Legal basis</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-sand-400">
            <li>
              <strong className="text-sand-200">Account &amp; usage data:</strong>{' '}
              Art. 6 (1)(b) GDPR — processing is necessary to provide the AI
              Canvas account service you signed up for.
            </li>
            <li>
              <strong className="text-sand-200">Server logs &amp; aggregate analytics:</strong>{' '}
              Art. 6 (1)(f) GDPR — legitimate interest in operating, securing,
              and understanding usage of the service. We balance this against
              your interests by using only cookieless, aggregate analytics with
              no cross-site tracking.
            </li>
            <li>
              <strong className="text-sand-200">Anonymous registry hits:</strong>{' '}
              the data is not personal under GDPR (no identifier links to a
              person). Logged for product analytics under Art. 6 (1)(f).
            </li>
          </ul>
        </section>

        {/* ── 4. Required data and automated decisions ───────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">
            4. Required data and automated decisions
          </h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Providing your email and password (or a Google account, if you sign
            in with Google) is necessary to create and use an AI Canvas account.
            If you do not provide them, you cannot create an account, but the
            public site &mdash; component browsing, copying source, downloading
            registry items via the CLI &mdash; remains fully usable without
            signing in. There is no statutory obligation to provide any data.
          </p>
          <p className="mt-3 leading-relaxed text-sand-400">
            We do not use automated decision-making, including profiling, in the
            sense of Art. 22 GDPR. No decisions affecting you are made
            automatically based on your data.
          </p>
        </section>

        {/* ── 5. Processors ──────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">5. Processors</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            We use the following service providers to operate AI Canvas. Each is
            bound by a Data Processing Agreement (DPA) and processes data only on
            our instructions. Where data leaves the EU, transfers are protected
            by the EU Standard Contractual Clauses.
          </p>
          <ul className="mt-4 space-y-3 leading-relaxed text-sand-400">
            <li>
              <strong className="text-sand-200">Vercel Inc.</strong> (USA) —
              hosting, request logs, cookieless Web Analytics. Edge serving from
              Frankfurt where possible.{' '}
              <a
                href="https://vercel.com/legal/dpa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-olive-400 hover:underline"
              >
                DPA
              </a>
              .
            </li>
            <li>
              <strong className="text-sand-200">Supabase Inc.</strong> (USA) —
              authentication, account database, transactional emails (sign-up
              confirmation, magic links, password reset). EU-region project where
              available.{' '}
              <a
                href="https://supabase.com/legal/dpa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-olive-400 hover:underline"
              >
                DPA
              </a>
              .
            </li>
            <li>
              <strong className="text-sand-200">Google Ireland Ltd.</strong> (EU) /{' '}
              Google LLC (USA) — only if you choose &ldquo;Sign in with Google.&rdquo;
              Google authenticates you and returns your email and profile
              identifier to us. Google's own privacy policy applies to their
              processing.
            </li>
            <li>
              <strong className="text-sand-200">ImageKit (Raw Engineering Inc.)</strong>{' '}
              — delivers component preview screenshots. No user data is sent;
              ImageKit only serves public image URLs.
            </li>
          </ul>
        </section>

        {/* ── 6. Retention ───────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">6. Retention</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-sand-400">
            <li>
              <strong className="text-sand-200">Account data</strong> is kept for
              as long as your account exists. When you delete your account, your
              account row, saved components, install history, and preferences
              are removed via cascade.
            </li>
            <li>
              <strong className="text-sand-200">Server logs</strong> are kept for
              the period set by Vercel's default log retention (typically a few
              weeks).
            </li>
            <li>
              <strong className="text-sand-200">Aggregate analytics</strong> are
              not tied to your identity and are kept indefinitely as aggregates.
            </li>
          </ul>
        </section>

        {/* ── 7. Your rights ─────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">7. Your rights</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Under GDPR you have the right to:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-sand-400">
            <li>Access the personal data we hold about you (Art. 15)</li>
            <li>Request correction of inaccurate data (Art. 16)</li>
            <li>Request deletion of your data (Art. 17 — &ldquo;right to be forgotten&rdquo;)</li>
            <li>Restrict or object to processing (Art. 18, 21)</li>
            <li>Receive your data in a portable, machine-readable format (Art. 20)</li>
            <li>Withdraw consent at any time, where processing is based on consent</li>
          </ul>
          <p className="mt-4 leading-relaxed text-sand-400">
            To exercise any of these rights, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-olive-400 hover:underline">
              {CONTACT_EMAIL}
            </a>
            . We respond within 30 days.
          </p>
        </section>

        {/* ── 8. Cookies and local storage ───────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">
            8. Cookies and local storage
          </h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            AI Canvas uses only strictly necessary storage. No tracking, advertising,
            or third-party cookies are set, and there is therefore no cookie banner.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-sand-400">
            <li>
              <strong className="text-sand-200">Authentication session cookie</strong>{' '}
              (set by Supabase): keeps you signed in. Removed on sign-out or
              expiry.
            </li>
            <li>
              <strong className="text-sand-200">Theme preference</strong>{' '}
              (localStorage): stores your light/dark theme choice on your device.
              Never sent to our servers.
            </li>
          </ul>
          <p className="mt-3 leading-relaxed text-sand-400">
            Both are exempt from the consent requirement of § 25 (2) TDDDG /
            TTDSG because they are strictly necessary to deliver the
            functionality you actively requested.
          </p>
        </section>

        {/* ── 9. Right to lodge a complaint ──────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">
            9. Right to lodge a complaint
          </h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            You have the right to lodge a complaint with a data protection
            supervisory authority. The competent authority for the operator named
            in the Impressum is the Bayerisches Landesamt für Datenschutzaufsicht
            (BayLDA), Promenade 18, 91522 Ansbach, Germany.{' '}
            <a
              href="https://www.lda.bayern.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-olive-400 hover:underline"
            >
              www.lda.bayern.de
            </a>
            . You may also contact the supervisory authority of your habitual
            residence or place of work.
          </p>
        </section>

        {/* ── 10. Changes ────────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">10. Changes</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            We update this policy when our processing changes. The &ldquo;Last
            updated&rdquo; date at the top of this page reflects the most recent
            revision. For significant changes affecting signed-in users we will
            notify you by email.
          </p>
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
