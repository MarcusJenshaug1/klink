import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: 120,
          background: '#A8E63D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 360, fontWeight: 900, color: '#1C3A1F', fontFamily: 'serif', lineHeight: 1 }}>
          K
        </span>
      </div>
    ),
    { width: 512, height: 512 }
  )
}
