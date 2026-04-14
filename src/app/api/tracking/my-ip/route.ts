import { NextResponse } from 'next/server'
import { getRequestIp } from '@/lib/tracking/get-ip'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const ip = await getRequestIp()
  return NextResponse.json({ ip })
}
