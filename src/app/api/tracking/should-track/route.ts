import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRequestIp } from '@/lib/tracking/get-ip'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const ip = await getRequestIp()

  if (ip === 'unknown') {
    return NextResponse.json({ track: true, ip })
  }

  try {
    const supa = createAdminClient()
    const { data, error } = await supa
      .from('tracking_blocklist')
      .select('ip')
      .eq('ip', ip)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ track: true, ip, warning: error.message })
    }
    return NextResponse.json({ track: !data, ip })
  } catch {
    return NextResponse.json({ track: true, ip })
  }
}
