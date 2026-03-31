import { ComponentCard } from './components/ComponentCard'
import { TopBar } from './components/TopBar'
import { COMPONENTS } from './lib/component-registry'

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">

      {/* ── Sticky top bar ── */}
      <TopBar count={COMPONENTS.length} />

      {/* ── Grid ── */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {COMPONENTS.map((entry) => (
            <ComponentCard
              key={entry.slug}
              name={entry.name}
              description={entry.description}
              tags={entry.tags}
              PreviewComponent={entry.PreviewComponent}
              href={`/components/${entry.slug}`}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
