'use client'

import { useState } from 'react'
import { X, Flag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { track } from '@/lib/analytics/events'

interface FlagModalProps {
  open: boolean
  cardId: string | null
  onClose: () => void
}

const REASONS = [
  { key: 'darlig_skrevet', label: 'Dårlig skrevet / uklart' },
  { key: 'for_krenkende', label: 'For krenkende' },
  { key: 'ikke_morsomt', label: 'Ikke morsomt' },
  { key: 'feil_kategori', label: 'Feil kategori / drøyhet' },
  { key: 'annet', label: 'Annet' },
]

export function FlagModal({ open, cardId, onClose }: FlagModalProps) {
  const [reason, setReason] = useState<string | null>(null)
  const [kommentar, setKommentar] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  if (!open || !cardId) return null

  async function submit() {
    if (!reason || !cardId) return
    setSending(true)
    const supabase = createClient()
    await supabase.from('kort_rapporter').insert({
      kort_id: cardId,
      grunn: reason,
      kommentar: kommentar.trim() || null,
    })
    track('card_flagged', { card_id: cardId, reason })
    setSent(true)
    setSending(false)
    setTimeout(() => {
      onClose()
      setTimeout(() => {
        setReason(null)
        setKommentar('')
        setSent(false)
      }, 300)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-cream rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-forest" />
            <h2 className="font-display font-black text-xl text-forest">Rapporter kort</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest hover:bg-forest/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <p className="text-forest text-center py-4 font-semibold">Takk! Admin ser på det.</p>
        ) : (
          <>
            <p className="text-forest/70 text-sm mb-3">Hva er problemet med dette kortet?</p>
            <div className="space-y-1.5 mb-4">
              {REASONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setReason(r.key)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                    reason === r.key
                      ? 'bg-forest text-white'
                      : 'bg-white text-forest hover:bg-white/80 border border-cream-dark/40'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <textarea
              value={kommentar}
              onChange={(e) => setKommentar(e.target.value)}
              placeholder="Kommentar (valgfritt)"
              rows={2}
              className="w-full px-4 py-2.5 bg-white border border-cream-dark/60 rounded-xl text-forest text-sm focus:outline-none focus:border-forest/40 resize-none mb-4"
            />

            <button
              onClick={submit}
              disabled={!reason || sending}
              className="w-full bg-forest text-white font-black py-3 rounded-xl disabled:opacity-40 hover:bg-forest/80 active:scale-95 transition"
            >
              {sending ? 'Sender...' : 'Send rapport'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
