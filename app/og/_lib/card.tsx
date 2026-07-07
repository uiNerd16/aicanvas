// Shared renderer for the dynamic /og/* social cards.
//
// Lives in an underscore folder (not a route) so the JSX stays out of the
// route.ts handlers — Next route handlers are .ts files and cannot hold JSX.
// Uses the sand/olive brand palette on the always-dark component-preview
// background. Fonts are raw TTFs read from assets/og (satori cannot consume
// the woff2 Google serves to browsers).

import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

const SAND_50 = '#F4F4FA'
const SAND_400 = '#9B9B9E'
const SAND_500 = '#7B7B7D'
const SAND_950 = '#0E0E0F'
const OLIVE_400 = '#DAE4A0'
const OLIVE_500 = '#A8B94D'

export type OgCardProps = {
  /** Small uppercase line above the title (category or "Collection"). */
  kicker: string
  /** The big line. */
  title: string
  /** Muted line under the title (stack, counts). */
  meta: string
  badge: 'Free' | 'Premium'
}

function titleSize(title: string): number {
  if (title.length > 26) return 56
  if (title.length > 17) return 66
  return 78
}

export async function ogCard({ kicker, title, meta, badge }: OgCardProps) {
  const [extraBold, medium] = await Promise.all([
    readFile(join(process.cwd(), 'assets/og/Manrope-ExtraBold.ttf')),
    readFile(join(process.cwd(), 'assets/og/Manrope-Medium.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: SAND_950,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          padding: '64px 80px',
          fontFamily: 'Manrope',
        }}
      >
        {/* Top row: brand mark left, Free/Premium pill right. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: OLIVE_500,
              }}
            />
            <div
              style={{
                display: 'flex',
                fontSize: 34,
                fontWeight: 800,
                color: SAND_50,
              }}
            >
              AI Canvas
            </div>
          </div>
          {badge === 'Free' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: OLIVE_500,
                color: SAND_950,
                fontSize: 24,
                fontWeight: 800,
                borderRadius: 999,
                padding: '10px 26px',
              }}
            >
              Free
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: `3px solid ${OLIVE_500}`,
                color: OLIVE_400,
                fontSize: 24,
                fontWeight: 800,
                borderRadius: 999,
                padding: '8px 24px',
              }}
            >
              Premium
            </div>
          )}
        </div>

        {/* Middle: kicker, title, meta line. */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 800,
              color: OLIVE_500,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 18,
              fontSize: titleSize(title),
              fontWeight: 800,
              color: SAND_50,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontSize: 28,
              fontWeight: 500,
              color: SAND_400,
            }}
          >
            {meta}
          </div>
        </div>

        {/* Bottom: domain. */}
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            fontWeight: 500,
            color: SAND_500,
          }}
        >
          aicanvas.me
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        { name: 'Manrope', data: extraBold, weight: 800, style: 'normal' },
        { name: 'Manrope', data: medium, weight: 500, style: 'normal' },
      ],
      headers: {
        'Cache-Control':
          'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  )
}
