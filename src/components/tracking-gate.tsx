'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'

const CACHE_KEY = 'klink_should_track'
const OPT_OUT_KEY = 'klink_notrack'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

interface CacheEntry {
  track: boolean
  expires: number
}

function readCache(): boolean | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry
    if (Date.now() > entry.expires) return null
    return entry.track
  } catch {
    return null
  }
}

function writeCache(track: boolean) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ track, expires: Date.now() + CACHE_TTL_MS }),
    )
  } catch {}
}

export function TrackingGate() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const [shouldTrack, setShouldTrack] = useState<boolean | null>(null)

  useEffect(() => {
    // URL param opt-out
    const params = new URLSearchParams(window.location.search)
    if (params.get('notrack') === '1') {
      localStorage.setItem(OPT_OUT_KEY, '1')
    }
    if (params.get('notrack') === '0') {
      localStorage.removeItem(OPT_OUT_KEY)
    }

    // Per-browser opt-out
    if (localStorage.getItem(OPT_OUT_KEY) === '1') {
      setShouldTrack(false)
      return
    }

    // Cache check
    const cached = readCache()
    if (cached !== null) {
      setShouldTrack(cached)
      return
    }

    // Fetch from API
    fetch('/api/tracking/should-track')
      .then((r) => r.json())
      .then((data: { track: boolean }) => {
        writeCache(data.track)
        setShouldTrack(data.track)
      })
      .catch(() => setShouldTrack(true))
  }, [])

  if (shouldTrack !== true) return null

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      <VercelAnalytics />
    </>
  )
}
