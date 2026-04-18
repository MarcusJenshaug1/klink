import { ImageResponse } from 'next/og'

export const runtime = 'edge'

async function getPlayfairFont() {
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap',
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  ).then((res) => res.text())

  const fontUrl = css.match(/src: url\((.+?)\) format/)?.[1]
  if (!fontUrl) throw new Error('Could not find Playfair Display font URL')

  return fetch(fontUrl).then((res) => res.arrayBuffer())
}

export async function GET() {
  const fontData = await getPlayfairFont()

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#FF1493',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 128,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1,
            fontFamily: 'Playfair Display',
          }}
        >
          K
        </span>
      </div>
    ),
    {
      width: 180,
      height: 180,
      fonts: [{ name: 'Playfair Display', data: fontData, weight: 900 }],
    }
  )
}
