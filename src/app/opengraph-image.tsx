import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Klink – Drikkespill'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadPlayfair(weight: 900) {
  const url = `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@${weight}&display=swap`
  const css = await fetch(url, {
    headers: {
      // trick googleapis to return woff2 url
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
  }).then((r) => r.text())

  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('(woff2|woff|truetype)'\)/)
  if (!match) return null
  const fontRes = await fetch(match[1])
  return fontRes.arrayBuffer()
}

export default async function OGImage() {
  const playfair = await loadPlayfair(900).catch(() => null)

  // Dimensions tuned so the "Kl·nk" feels like the app logo
  const LOGO_SIZE = 260
  const DOT_SIZE = LOGO_SIZE * 0.135

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#A8E63D',
          color: '#1A3A1A',
          fontFamily: 'Playfair',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontSize: LOGO_SIZE,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            position: 'relative',
          }}
        >
          <span>Kl</span>
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline' }}>
            {/* dotless i */}
            <span>{'\u0131'}</span>
            {/* decorative dot */}
            <span
              style={{
                position: 'absolute',
                top: `${LOGO_SIZE * 0.06}px`,
                left: '50%',
                marginLeft: `-${DOT_SIZE / 2}px`,
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: '50%',
                backgroundColor: '#1A3A1A',
              }}
            />
          </span>
          <span>nk</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 500,
            marginTop: 18,
            color: 'rgba(26,58,26,0.65)',
            fontFamily: 'sans-serif',
          }}
        >
          Drikkespillet
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            fontSize: 28,
            fontWeight: 700,
            marginTop: 44,
            color: 'rgba(26,58,26,0.55)',
            fontFamily: 'sans-serif',
          }}
        >
          <span>Jeg har aldri</span>
          <span>·</span>
          <span>Pekeleken</span>
          <span>·</span>
          <span>Snusboksen</span>
          <span>·</span>
          <span>Drøye festspørsmål</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: playfair
        ? [
            {
              name: 'Playfair',
              data: playfair,
              weight: 900,
              style: 'normal',
            },
          ]
        : undefined,
    },
  )
}
