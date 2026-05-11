import Link from 'next/link'

// Placeholder for /ideation/components. The Components pole exists in the
// sidebar so the hierarchy is visible, but for this ideation pass we only
// build out the Design Systems flow. The production /components grid stays
// canonical for now — link out for the live experience.
export default function IdeationComponentsPlaceholder() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-sand-900 dark:text-sand-50 sm:text-4xl">
        Components
      </h1>
      <p className="mt-3 text-base text-sand-600 dark:text-sand-400">
        Standalone components live in the production catalog — this pole is
        preserved here so the new sidebar's mutual-exclusion behaviour is
        visible. Open Design Systems → Andromeda for the new flow.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/ideation/design-systems/andromeda"
          className="rounded-lg bg-olive-500 px-4 py-2 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
        >
          Open Andromeda
        </Link>
        <Link
          href="/components"
          className="rounded-lg border border-sand-300 bg-sand-100 px-4 py-2 text-sm font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:bg-sand-900 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100"
        >
          Production /components
        </Link>
      </div>
    </main>
  )
}
