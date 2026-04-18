'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Beer, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const VALID_CHARS = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/

export default function JoinPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
    setCode(val)
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (trimmed.length !== 5) {
      setError('Koden må være 5 tegn')
      return
    }
    if (!VALID_CHARS.test(trimmed)) {
      setError('Ugyldig kode')
      return
    }
    router.push(`/join/${trimmed}`)
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#A8E63D]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-5xl font-black text-forest tracking-tight leading-none">Klink</p>
          <p className="text-forest/60 font-semibold mt-1 text-sm">Bli med i et spill</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="text-xs font-bold text-forest/50 uppercase tracking-widest mb-3">
                Skriv inn spillkoden
              </p>
              <input
                value={code}
                onChange={handleChange}
                placeholder="F.eks. A3KX2"
                autoFocus
                autoComplete="off"
                inputMode="text"
                className="w-full bg-transparent border-b-2 border-forest/20 focus:border-forest/60 outline-none text-forest font-black text-3xl py-2 placeholder:text-forest/20 tracking-[0.2em] text-center transition-colors"
              />
              {error && (
                <p className="text-red-600 text-sm font-semibold mt-2 text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={code.length !== 5}
              className="w-full min-h-[52px] rounded-2xl bg-forest text-lime font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              Bli med
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-forest/40 mt-4 font-medium">
          <Link href="/" className="underline hover:text-forest/60">← Tilbake til forsiden</Link>
        </p>
      </div>

      <p className="text-center text-xs text-forest/40 mt-6 flex items-center gap-1.5">
        <Beer className="w-3.5 h-3.5" />
        18+ · Drikk ansvarlig
      </p>
    </div>
  )
}
