'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { CONTACT_EMAIL } from '../lib/config'
import { SiteFooter } from '../components/SiteFooter'
import { HeaderSocials } from '../components/HeaderSocials'

// ─── /impressum ───────────────────────────────────────────────────────────────
// § 5 DDG-compliant imprint for a private-person / Kleinunternehmer
// Einzelunternehmen operator based in Germany.
//
// Mandatory under § 5 DDG: Creator (name + ladungsfähige Anschrift) + Contact.
// Everything above those two sections — liability for content, liability for
// external links, copyright — is standard German boilerplate. Not legally
// required, but every German reader expects to see it on an Impressum.
//
// Intentionally NOT included:
//   • Editorial responsibility (§ 18 (2) MStV) — does not apply to a
//     component marketplace per BGH case law.
//   • EU online-dispute-resolution link — platform was discontinued
//     20 July 2025; keeping the link is itself an Abmahnung risk under § 5 UWG.
//   • Verbraucherstreitbeilegung notice (§ 36 VSBG) — only required for
//     companies ≥10 employees; solo operator is exempt.
//
// Operator: Alexandru Daniel Tatu, Strahuberstr. 13, 81479 Munich, Germany.
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
        <div className="flex items-center justify-end">
          <HeaderSocials />
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
          <h2 className="text-lg font-bold text-sand-50">Liability for content</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            As a service provider we are responsible for our own content on
            these pages in accordance with general legislation pursuant to § 7
            (1) DDG. Pursuant to §§ 8 to 10 DDG we are not obliged to monitor
            transmitted or stored third-party information or to investigate
            circumstances that indicate illegal activity. Obligations to remove
            or block the use of information under general law remain unaffected.
            Liability in this respect is, however, only possible from the time
            we become aware of a specific infringement. Upon notification of a
            corresponding infringement we will remove the content immediately.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">Liability for external links</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Our site contains links to external websites of third parties, on
            whose content we have no influence. We therefore cannot assume any
            liability for these external contents. The respective provider or
            operator of the linked pages is always responsible for their
            content. The linked pages were checked for possible legal
            violations at the time of linking. Illegal contents were not
            recognisable at the time of linking. A permanent control of the
            content of the linked pages is, however, not reasonable without
            concrete evidence of an infringement. Upon notification of legal
            violations, we will remove such links immediately.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">Copyright</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Components published in the AI Canvas registry are released under
            the MIT licence. You are free to copy them, modify them, and ship
            them.
          </p>
          <p className="mt-3 leading-relaxed text-sand-400">
            The website itself (page layout, written copy, branding) is the
            Creator&apos;s work and copyright. Third-party content used on
            this site (icons, fonts, embedded libraries) is identified as such
            and remains the property of its respective rights holder.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-sand-50">Creator</h2>
          <p className="mt-3 leading-relaxed text-sand-400">
            Alexandru Daniel Tatu <span className="mx-2 text-sand-600">•</span> Strahuberstr. 13
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
