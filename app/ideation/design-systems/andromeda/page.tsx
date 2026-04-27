import AndromedaShowcase from '../../../design-systems/andromeda/showcase/AndromedaShowcase'

// Andromeda Overview = the showcase rendered inside the ideation chrome.
//
// The page is a flex-grow column with the Andromeda void as its
// background. That guarantees the dark surface covers the entire
// scroll content area, so the sand-950 from the layout never shows
// through at the bottom (the "harsh cut" the showcase's own
// minHeight: 100vh leaves at the boundary).

export default function AndromedaPage() {
  return (
    <div
      className="flex flex-1 flex-col"
      style={{ backgroundColor: '#0E0E0F' }}
    >
      <AndromedaShowcase />
    </div>
  )
}
