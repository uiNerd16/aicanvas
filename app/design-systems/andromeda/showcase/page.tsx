// Thin route wrapper. The full showcase body lives in
// AndromedaShowcase.tsx so the ideation Andromeda landing can render
// the same content without duplication.
import AndromedaShowcase from './AndromedaShowcase'

export default function ShowcasePage() {
  return <AndromedaShowcase />
}
