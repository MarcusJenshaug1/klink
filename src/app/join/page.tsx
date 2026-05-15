'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Beer, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PublicPageShell } from '@/components/public/public-page-shell'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'

const VALID_CHARS = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/

export default function JoinPage() {
  const router = useRouter()
  const { isActive: athina } = useAthina()
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
    <PublicPageShell className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className={cn('font-display text-5xl font-black tracking-tight leading-none', athina ? 'text-white' : 'text-forest')}>Klink</p>
          <p className={cn('font-semibold mt-1 text-sm', athina ? 'text-white/70' : 'text-forest/60')}>Bli med i et spill</p>
        </div>

        <div className={cn('backdrop-blur-sm rounded-3xl p-6 shadow-lg', athina ? 'bg-white/18' : 'bg-white/60')}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="join-code" className={cn('block text-xs font-bold uppercase tracking-widest mb-3', athina ? 'text-white/60' : 'text-forest/50')}>
                Skriv inn spillkoden
              </label>
              <input
                id="join-code"
                value={code}
                onChange={handleChange}
                placeholder="F.eks. A3KX2"
                autoFocus
                autoComplete="off"
                inputMode="text"
                aria-describedby={error ? 'join-code-error' : undefined}
                className={cn(
                  'w-full bg-transparent border-b-2 outline-none font-black text-2xl sm:text-3xl py-2 tracking-[0.2em] text-center transition-colors',
                  athina ? 'border-white/20 focus:border-white/60 text-white placeholder:text-white/25' : 'border-forest/20 focus:border-forest/60 text-forest placeholder:text-forest/20'
                )}
              />
              {error && (
                <p id="join-code-error" className={cn('text-sm font-semibold mt-2 text-center', athina ? 'text-white' : 'text-red-600')}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={code.length !== 5}
              className={cn(
                'w-full min-h-[52px] rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none',
                athina ? 'bg-white/30 text-white hover:bg-white/40' : 'bg-forest text-lime'
              )}
            >
              Bli med
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <p className={cn('text-center text-xs mt-4 font-medium', athina ? 'text-white/50' : 'text-forest/40')}>
          <Link href="/" className={cn('underline', athina ? 'hover:text-white/75' : 'hover:text-forest/60')}>← Tilbake til forsiden</Link>
        </p>
      </div>

      <p className={cn('text-center text-xs mt-6 flex items-center gap-1.5', athina ? 'text-white/50' : 'text-forest/40')}>
        <Beer className="w-3.5 h-3.5" />
        18+ · Drikk ansvarlig
      </p>
    </PublicPageShell>
  )
}
