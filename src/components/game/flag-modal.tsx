'use client'

import { useId, useState } from 'react'
import { X, Flag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { track } from '@/lib/analytics/events'
import { useAthina } from '@/context/athina-context'
import { useDialogA11y } from '@/hooks/use-dialog-a11y'
import { cn } from '@/lib/utils'

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
  const { isActive: athina } = useAthina()
  const [reason, setReason] = useState<string | null>(null)
  const [kommentar, setKommentar] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const titleId = useId()
  const dialogRef = useDialogA11y(open && !!cardId, onClose)

  if (!open || !cardId) return null

  async function submit() {
    if (!reason || !cardId) return
    setSending(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.from('kort_rapporter').insert({
      kort_id: cardId,
      grunn: reason,
      kommentar: kommentar.trim() || null,
    })
    if (err) {
      setError('Klarte ikke sende rapporten. Prøv igjen.')
      setSending(false)
      return
    }
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up max-h-[90dvh] overflow-y-auto',
          athina ? 'bg-[#FF69B4]' : 'bg-cream'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flag className={cn('w-5 h-5', athina ? 'text-white' : 'text-forest')} />
            <h2 id={titleId} className={cn('font-display font-black text-xl', athina ? 'text-white' : 'text-forest')}>Rapporter kort</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className={cn(
              'w-11 h-11 rounded-full flex items-center justify-center transition',
              athina ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-forest/10 text-forest hover:bg-forest/20'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <p className={cn('text-center py-4 font-semibold', athina ? 'text-white' : 'text-forest')}>Takk! Admin ser på det.</p>
        ) : (
          <>
            <p className={cn('text-sm mb-3', athina ? 'text-white/75' : 'text-forest/70')}>Hva er problemet med dette kortet?</p>
            <div className="space-y-1.5 mb-4">
              {REASONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setReason(r.key)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                    reason === r.key
                      ? athina ? 'bg-white text-[#FF1493]' : 'bg-forest text-white'
                      : athina ? 'bg-white/15 text-white hover:bg-white/25 border border-white/10' : 'bg-white text-forest hover:bg-white/80 border border-cream-dark/40'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {reason === 'annet' && (
              <textarea
                value={kommentar}
                onChange={(e) => setKommentar(e.target.value)}
                placeholder="Beskriv problemet (valgfritt)"
                rows={2}
                className={cn(
                  'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none resize-none mb-4',
                  athina ? 'bg-white/15 border-white/10 text-white placeholder:text-white/45 focus:border-white/50' : 'bg-white border-cream-dark/60 text-forest focus:border-forest/40'
                )}
              />
            )}

            {error && (
              <p className={cn('text-sm font-semibold mb-3', athina ? 'text-white' : 'text-red-600')}>{error}</p>
            )}

            <button
              onClick={submit}
              disabled={!reason || sending}
              className={cn(
                'w-full font-black py-3 rounded-xl disabled:opacity-40 active:scale-95 transition',
                athina ? 'bg-white/30 text-white hover:bg-white/40' : 'bg-forest text-white hover:bg-forest/80'
              )}
            >
              {sending ? 'Sender...' : 'Send rapport'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
