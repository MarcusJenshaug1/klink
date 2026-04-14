import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Klink – Drikkespill'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
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
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 220,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          Klınk
        </div>
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            marginTop: 12,
            opacity: 0.8,
          }}
        >
          Drikkespillet
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            marginTop: 40,
            opacity: 0.7,
            maxWidth: 900,
            textAlign: 'center',
          }}
        >
          Jeg har aldri · Pekeleken · Snusboksen · Drøye festspørsmål
        </div>
      </div>
    ),
    size,
  )
}
