import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
            fontFamily: 'serif',
          }}
        >
          K
        </span>
      </div>
    ),
    { ...size }
  )
}
