'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { GithubLogo, XLogo } from '@phosphor-icons/react'
import { GITHUB_URL, X_URL, CONTACT_EMAIL } from '../lib/config'
import { SiteFooter } from '../components/SiteFooter'

// ─── /impressum ───────────────────────────────────────────────────────────────
// § 5 DDG-compliant imprint, trimmed to the strict minimum for a private-person
// / Kleinunternehmer Einzelunternehmen operator based in Germany.
//
// Why so short:
//   • § 5 DDG only requires name + ladungsfähige Anschrift + rapid contact.
//   • Editorial responsibility (§ 18 (2) MStV) does not apply — AI Canvas is
//     a marketplace, not journalistic-editorial content.
//   • Liability/copyright disclaimers were dropped — they are boilerplate that
//     has no legal effect; §§ 7–10 DDG and German UrhG apply regardless.
//   • EU online-dispute-resolution platform was discontinued 20 July 2025;
//     a lingering link can trigger an Abmahnung under § 5 UWG.
//   • Verbraucherstreitbeilegung notice (§ 36 VSBG) only required for
//     companies ≥10 employees — solo operator is exempt.
//
// Operator: Alexandru Tatu, Strahuberstr. 13, 81479 Munich, Germany.
// This is the public ladungsfähige Anschrift on the live site.

export default function ImpressumPage() {
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
        <Link href="/impressum" className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400">
          /Impressum
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
          <span className="text-olive-500">/Impressum</span>
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl">
          Impressum
        </h1>
        <p className="mt-3 text-sm text-sand-500">
          Information pursuant to § 5 DDG (Digital Services Act, Germany).
        </p>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-sand-50">Creator</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Alexandru Tatu <span className="mx-2 text-sand-600">•</span> Strahuberstr. 13
            <span className="mx-2 text-sand-600">•</span> 81479 Munich
            <span className="mx-2 text-sand-600">•</span> Germany
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">Contact</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Email:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-olive-400 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
