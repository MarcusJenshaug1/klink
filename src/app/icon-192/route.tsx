import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          borderRadius: 48,
          background: '#A8E63D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 130, fontWeight: 900, color: '#1C3A1F', fontFamily: 'serif', lineHeight: 1 }}>
          K
        </span>
      </div>
    ),
    { width: 192, height: 192 }
  )
}
