import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#A8E63D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 128,
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
