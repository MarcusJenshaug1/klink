'use client'

import { useState, use } from 'react'
import { usePlayerJoin } from '@/hooks/use-join-room'
import { Beer, Check, Loader2 } from 'lucide-react'

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const { connected, sent, sendJoin } = usePlayerJoin(code.toUpperCase())
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    setError('')
    const ok = await sendJoin(trimmed)
    if (!ok) setError('Klarte ikke å bli med. Sjekk at koden er riktig og prøv igjen.')
    setLoading(false)
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#A8E63D]">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="font-display text-5xl font-black text-forest tracking-tight leading-none">Klink</p>
          <p className="text-forest/60 font-semibold mt-1 text-sm">Drikkespill</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          {sent ? (
            /* Success state */
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center">
                <Check className="w-7 h-7 text-lime" strokeWidth={3} />
              </div>
              <div>
                <p className="text-forest font-black text-xl">Du er med!</p>
                <p className="text-forest/60 font-semibold text-sm mt-1">
                  Vent til verten starter spillet på TV-en
                </p>
              </div>
              <div className="mt-2 px-4 py-2 bg-forest/8 rounded-2xl">
                <p className="text-forest/50 text-xs font-bold uppercase tracking-widest mb-0.5">Kode</p>
                <p className="text-forest font-black text-2xl tracking-widest">{code.toUpperCase()}</p>
              </div>
            </div>
          ) : (
            /* Join form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-xs font-bold text-forest/50 uppercase tracking-widest mb-3">
                  Bli med i spillet
                </p>
                <div className="flex items-center gap-2 px-1 pb-2 border-b border-forest/10">
                  <Beer className="w-4 h-4 text-forest/30 shrink-0" />
                  <p className="text-forest/40 font-bold text-sm tabular-nums tracking-widest">
                    {code.toUpperCase()}
                  </p>
                </div>
              </div>

              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setError('') }}
                placeholder="Navnet ditt"
                autoFocus
                maxLength={24}
                className="w-full bg-transparent border-b-2 border-forest/20 focus:border-forest/60 outline-none text-forest font-semibold text-xl py-2 placeholder:text-forest/30 transition-colors"
              />

              {error && (
                <p className="text-red-600 text-sm font-semibold">{error}</p>
              )}

              <button
                type="submit"
                disabled={!name.trim() || loading || !connected}
                className="w-full min-h-[52px] rounded-2xl bg-forest text-lime font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : !connected ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Kobler til…
                  </>
                ) : (
                  'Bli med!'
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-forest/40 mt-4 font-medium">
          18+ · Drikk ansvarlig
        </p>
      </div>
    </div>
  )
}
