'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

const CONSENT_KEY = 'klink-consent-v1'

function readConsent(): 'accepted' | 'declined' | null {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    if (v === 'accepted' || v === 'declined') return v
    return null
  } catch {
    return null
  }
}

function applyConsent(consent: 'accepted' | 'declined') {
  try {
    localStorage.setItem(CONSENT_KEY, consent)
    if (consent === 'declined') {
      localStorage.setItem('klink_notrack', '1')
    } else {
      localStorage.removeItem('klink_notrack')
    }
    // Clear tracking-gate cache so it re-evaluates
    localStorage.removeItem('klink_should_track')
  } catch {}
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (readConsent() === null) {
      // Default to notrack until user chooses — prevents GA4 firing before consent
      try { localStorage.setItem('klink_notrack', '1') } catch {}
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  function choose(consent: 'accepted' | 'declined') {
    applyConsent(consent)
    setVisible(false)
    // Reload so TrackingGate re-runs with new consent state
    window.location.reload()
  }

  return (
    <div
      role="dialog"
      aria-label="Samtykke for analyse"
      className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-2xl mx-auto bg-forest text-white rounded-3xl shadow-2xl p-5 sm:p-6">
        <h2 className="font-display font-black text-lg sm:text-xl mb-2 flex items-center gap-2">
          <Cookie className="w-5 h-5" />
          Cookies og analyse
        </h2>
        <p className="text-sm text-white/80 leading-relaxed mb-4">
          Klink bruker Google Analytics og Vercel Analytics for å forstå hvordan appen brukes,
          slik at vi kan forbedre den. IP-adresse anonymiseres. Du kan velge bort når som helst.
          Les mer i{' '}
          <Link href="/personvern" className="underline font-semibold">personvernerklæringen</Link>.
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => choose('declined')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition"
          >
            Kun nødvendige
          </button>
          <button
            onClick={() => choose('accepted')}
            className="flex-1 px-4 py-2.5 rounded-xl bg-lime text-forest font-black text-sm hover:bg-lime-light active:scale-95 transition"
          >
            Godta alle
          </button>
        </div>
      </div>
    </div>
  )
}
