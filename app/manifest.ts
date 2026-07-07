import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Canvas',
    short_name: 'AI Canvas',
    description:
      'Open component marketplace: animated React components with source code and AI prompts. Open source and free to start.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0E0E0F',
    theme_color: '#0E0E0F',
    icons: [
      {
        src: '/ai-canvas-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
