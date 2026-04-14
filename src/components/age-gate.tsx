'use client'

import { useEffect, useState } from 'react'

const AGE_KEY = 'klink-age-verified-v1'

export function AgeGate() {
  const [state, setState] = useState<'loading' | 'ask' | 'blocked' | 'ok'>('loading')

  useEffect(() => {
    try {
      const v = localStorage.getItem(AGE_KEY)
      if (v === 'ok') return setState('ok')
      if (v === 'blocked') return setState('blocked')
      setState('ask')
    } catch {
      setState('ask')
    }
  }, [])

  if (state === 'loading' || state === 'ok') return null

  function handleYes() {
    try { localStorage.setItem(AGE_KEY, 'ok') } catch {}
    setState('ok')
  }

  function handleNo() {
    try { localStorage.setItem(AGE_KEY, 'blocked') } catch {}
    setState('blocked')
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-forest/95 backdrop-blur-md">
      <div className="max-w-sm w-full bg-cream rounded-3xl p-7 shadow-2xl text-center">
        <div className="text-5xl mb-3" aria-hidden>🔞</div>
        <h1 className="font-display font-black text-2xl text-forest mb-2">Er du 18 år eller eldre?</h1>
        {state === 'ask' && (
          <>
            <p className="text-forest/70 text-sm leading-relaxed mb-5">
              Klink er et drikkespill beregnet for voksne. Du må bekrefte at du er myndig for å fortsette.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleNo}
                className="flex-1 py-3 rounded-xl bg-forest/10 text-forest font-bold text-sm hover:bg-forest/15 transition"
              >
                Nei
              </button>
              <button
                onClick={handleYes}
                className="flex-1 py-3 rounded-xl bg-forest text-lime font-black text-sm hover:bg-forest-light active:scale-95 transition"
              >
                Ja, jeg er 18+
              </button>
            </div>
            <p className="text-forest/40 text-xs mt-4">
              Drikk ansvarlig. Kjør aldri bil etter alkohol.
            </p>
          </>
        )}
        {state === 'blocked' && (
          <>
            <p className="text-forest/70 text-sm leading-relaxed mb-4">
              Klink er kun tilgjengelig for personer 18 år eller eldre. Kom tilbake når du er myndig.
            </p>
            <button
              onClick={() => setState('ask')}
              className="text-forest/50 hover:text-forest underline text-sm"
            >
              Jeg valgte feil
            </button>
          </>
        )}
      </div>
    </div>
  )
}
