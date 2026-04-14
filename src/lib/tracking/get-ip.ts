import { headers } from 'next/headers'

export async function getRequestIp(): Promise<string> {
  const h = await headers()
  const xff = h.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const real = h.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}
