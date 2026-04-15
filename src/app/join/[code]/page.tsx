'use client'

import { useState, use, useRef, useCallback } from 'react'
import { usePlayerJoin } from '@/hooks/use-join-room'
import { Beer, Check, Loader2, PenLine, Send } from 'lucide-react'

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const { connected, sent, sendJoin, sendCard } = usePlayerJoin(code.toUpperCase())
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
            /* Success state + card form */
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-lime" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-forest font-black text-lg">Du er med, {name.trim()}!</p>
                  <p className="text-forest/60 font-semibold text-sm">Lag egne kort mens du venter</p>
                </div>
              </div>

              <CardSubmitForm name={name.trim()} sendCard={sendCard} />
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

function insertAtCursor(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  text: string,
  setter: (v: string) => void,
) {
  const el = ref.current
  if (!el) return
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? el.value.length
  const next = el.value.slice(0, start) + text + el.value.slice(end)
  setter(next)
  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(start + text.length, start + text.length)
  })
}

interface CardSubmitFormProps {
  name: string
  sendCard: (innhold: string, tittel: string, author: string) => Promise<boolean>
}

function CardSubmitForm({ name, sendCard }: CardSubmitFormProps) {
  const [tittel, setTittel] = useState('')
  const [innhold, setInnhold] = useState('')
  const [submittedCount, setSubmittedCount] = useState(0)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lastSent, setLastSent] = useState(false)
  const innholdRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInnhold = innhold.trim()
    if (!trimmedInnhold) return
    setSubmitting(true)
    setSubmitError('')
    setLastSent(false)
    const ok = await sendCard(trimmedInnhold, tittel.trim(), name)
    if (ok) {
      setSubmittedCount((n) => n + 1)
      setInnhold('')
      setTittel('')
      setLastSent(true)
    } else {
      setSubmitError('Klarte ikke å sende kortet. Prøv igjen.')
    }
    setSubmitting(false)
  }, [innhold, tittel, name, sendCard])

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <PenLine className="w-4 h-4 text-forest/50 shrink-0" />
        <p className="text-xs font-bold text-forest/50 uppercase tracking-widest">
          Lag et kort
        </p>
      </div>

      <input
        value={tittel}
        onChange={(e) => setTittel(e.target.value)}
        placeholder="Tittel (valgfritt)"
        maxLength={60}
        className="w-full bg-transparent border-b border-forest/15 focus:border-forest/50 outline-none text-forest font-semibold text-sm py-1.5 placeholder:text-forest/25 transition-colors"
      />

      <div className="space-y-1.5">
        <textarea
          ref={innholdRef}
          value={innhold}
          onChange={(e) => { setInnhold(e.target.value); setSubmitError('') }}
          placeholder="Skriv kortinnholdet her... Eks: Alle som har på seg rødt drikker {spiller} slurker!"
          rows={3}
          maxLength={280}
          className="w-full bg-forest/5 rounded-xl border border-forest/10 focus:border-forest/30 outline-none text-forest font-medium text-sm px-3 py-2.5 placeholder:text-forest/25 transition-colors resize-none leading-relaxed"
        />
        <button
          type="button"
          onClick={() => insertAtCursor(innholdRef, '{spiller}', setInnhold)}
          className="text-xs font-bold text-forest/50 bg-forest/8 hover:bg-forest/15 px-2.5 py-1 rounded-full transition-colors"
        >
          + Tilfeldig spiller
        </button>
      </div>

      {submitError && (
        <p className="text-red-600 text-xs font-semibold">{submitError}</p>
      )}

      {lastSent && (
        <p className="text-forest/60 text-xs font-semibold text-center">
          Kort sendt! Du har laget {submittedCount} kort{submittedCount !== 1 ? '' : ''}. Lag ett til?
        </p>
      )}

      <button
        type="submit"
        disabled={!innhold.trim() || submitting}
        className="w-full min-h-[48px] rounded-2xl bg-forest text-lime font-black text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send kort
          </>
        )}
      </button>

      {submittedCount > 0 && !lastSent && (
        <p className="text-forest/50 text-xs font-semibold text-center">
          Du har laget {submittedCount} kort til nå
        </p>
      )}
    </form>
  )
}
