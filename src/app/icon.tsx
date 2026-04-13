import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

async function getPlayfairFont() {
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap',
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  ).then((res) => res.text())

  const fontUrl = css.match(/src: url\((.+?)\) format/)?.[1]
  if (!fontUrl) throw new Error('Could not find Playfair Display font URL')

  return fetch(fontUrl).then((res) => res.arrayBuffer())
}

export default async function Icon() {
  const fontData = await getPlayfairFont()

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#A8E63D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#1C3A1F',
            lineHeight: 1,
            fontFamily: 'Playfair Display',
          }}
        >
          K
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Playfair Display', data: fontData, weight: 900 }],
    }
  )
}
