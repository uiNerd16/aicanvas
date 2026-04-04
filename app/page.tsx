import { HomeClient } from './components/HomeClient'
import { COMPONENTS } from './lib/component-registry'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const filtered =
    category && category !== 'All Components'
      ? COMPONENTS.filter((c) => c.tags.some((t) => t.accent && t.label === category))
      : COMPONENTS

  return <HomeClient components={filtered} />
}
