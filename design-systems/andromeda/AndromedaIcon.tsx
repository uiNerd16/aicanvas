// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// ANDROMEDA · brand icon
// Two-path mark: gray triangle + turquoise blade. Source SVG is
// 28x24 (7:6 aspect). The exported component takes a `size` prop
// that is interpreted as the WIDTH; height is derived so the icon
// never deforms regardless of where it's dropped in.
// ============================================================

export function AndromedaIcon({ size = 24, mono = false, style = undefined, ...props }) {
  const width = size;
  const height = (size * 24) / 28;

  // `mono` collapses the two-tone brand mark into a flat silhouette in
  // `currentColor`, so the icon reads like every other Phosphor icon
  // when dropped into nav rows that inherit text color from a parent.
  const fillBack = mono ? 'currentColor' : '#C1C1C1';
  const fillFront = mono ? 'currentColor' : '#2DD4BF';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
      aria-label="Andromeda"
      role="img"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 24L13.1483 0L14.9111 7.19476C14.4502 8.0149 14.0026 8.81944 13.5507 9.63168L9.86787 16.2221C10.7337 15.869 11.6049 15.5292 12.4707 15.1762L12.4717 15.1758C13.8326 14.633 12.4717 15.1758 16.531 13.5278L0 24Z"
        fill={fillBack}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7637 0L19.9727 20.3637C28 24 19.9727 20.3637 27.9998 24C26.8086 21.7712 25.5259 19.5191 24.3008 17.3031L17.7544 5.4295C17.5204 5.00473 14.8816 0.132369 14.7637 0Z"
        fill={fillFront}
      />
    </svg>
  );
}
