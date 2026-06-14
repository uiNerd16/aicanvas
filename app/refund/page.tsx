'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { CONTACT_EMAIL } from '../lib/config'
import { SiteFooter } from '../components/SiteFooter'
import { HeaderSocials } from '../components/HeaderSocials'

// ─── /refund ────────────────────────────────────────────────────────────────
// Refund & Cancellation Policy for the AI Canvas Premium subscription. Kept as
// a standalone, footer-linked page because Paddle's Merchant-of-Record domain
// review requires a clearly accessible refund policy. Mirrors the subscription
// clause in /terms § 2b; Paddle is the seller of record and handles payment and
// any refunds. Operator details live in /impressum.

export default function RefundPage() {
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
        <Link href="/refund" className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400">
          /Refund
        </Link>
        <div className="flex items-center justify-end">
          <HeaderSocials />
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <p className="mb-6 text-sm font-semibold md:hidden">
          <span className="text-olive-500">/Refund</span>
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="mt-3 text-sm text-sand-500">
          Last updated: 2026-06-14. This policy applies to the AI Canvas Premium subscription.
        </p>

        {/* ── 1. Overview ──────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-sand-50">1. Overview</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Browsing AI Canvas, remixing components with AI, and installing
            standalone components up to the daily free limit are always free:
            there is nothing to pay and nothing to refund. This policy covers the
            optional paid{' '}
            <strong className="font-semibold text-sand-300">Premium</strong>{' '}
            subscription, which unlocks unlimited daily installs, premium design
            systems, and premium templates.
          </p>
        </section>

        {/* ── 2. How billing works ─────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">2. How billing works</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Premium is billed at $9.99 per month or $49.99 per year through{' '}
            <a
              href="https://www.paddle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-olive-400 hover:underline"
            >
              Paddle.com
            </a>
            , our reseller and Merchant of Record. Paddle is the seller of record
            for these transactions and handles payment, billing, and any refunds,
            so your purchase is also governed by{' '}
            <a
              href="https://www.paddle.com/legal/checkout-buyer-terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-olive-400 hover:underline"
            >
              Paddle&apos;s buyer terms
            </a>
            . Your subscription renews automatically at the end of each billing
            period until you cancel.
          </p>
        </section>

        {/* ── 3. Cancelling your subscription ──────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">3. Cancelling your subscription</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            You can cancel at any time from the customer portal linked in your{' '}
            <code className="rounded bg-sand-900 px-1 py-0.5 text-xs text-sand-300">
              /account/settings
            </code>
            . Cancellation stops future renewals and takes effect at the end of
            your current billing period: you keep Premium access until then, and
            you are not charged again.
          </p>
        </section>

        {/* ── 4. Refunds & EU/UK right of withdrawal ───────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">
            4. Refunds &amp; EU/UK right of withdrawal
          </h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Premium is digital content that is made available immediately. By
            starting a subscription you consent to immediate performance and
            acknowledge that your EU/UK 14-day right of withdrawal ends once
            access begins, except where the law provides otherwise. Where a
            statutory right to a refund applies, it is honoured.
          </p>
          <p className="mt-3 leading-relaxed text-sand-400">
            Beyond that, refund requests are handled by Paddle under its buyer
            terms and at its discretion, for example an accidental charge or a
            duplicate payment. To request a refund, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-olive-400 hover:underline">
              {CONTACT_EMAIL}
            </a>{' '}
            or reach Paddle directly through the receipt email Paddle sends after
            purchase.
          </p>
        </section>

        {/* ── 5. Billing questions & disputes ──────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">
            5. Billing questions &amp; disputes
          </h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            For any billing question, a wrong charge, or a dispute, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-olive-400 hover:underline">
              {CONTACT_EMAIL}
            </a>{' '}
            first and we will sort it out quickly. As Merchant of Record, Paddle
            also provides customer service for orders and processes any approved
            refunds back to your original payment method.
          </p>
        </section>

        {/* ── 6. Components you've installed ────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">
            6. Components you&apos;ve installed
          </h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Components you have already installed are released under the MIT
            licence and remain yours to keep and use regardless of whether you
            cancel Premium or receive a refund. Cancelling only stops future
            access to Premium-only downloads; it does not reach back into code
            already in your project.
          </p>
        </section>

        {/* ── 7. Contact ───────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">7. Contact</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Questions about refunds or cancellation? Email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-olive-400 hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
