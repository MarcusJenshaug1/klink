'use client'

import { useEffect, useId, useState } from 'react'
import { PenLine, Quote, Sparkles, Users, X } from 'lucide-react'
import { useAthina } from '@/context/athina-context'
import { useDialogA11y } from '@/hooks/use-dialog-a11y'
import { createClient } from '@/lib/supabase/client'
import { interpolatePreview } from '@/lib/game/interpolate'
import type { Pack } from '@/types/game'

interface PackInfoModalProps {
  pack: Pack
  cardCount?: number
  playerCount?: number
  onClose: () => void
}

const IS_CUSTOM = (id: string) => id === '__custom__'

export function PackInfoModal({ pack, cardCount, playerCount, onClose }: PackInfoModalProps) {
  const { isActive: athina } = useAthina()
  const titleId = useId()
  const dialogRef = useDialogA11y(true, onClose)
  const [examples, setExamples] = useState<string[] | null>(null)
  const [exampleErr, setExampleErr] = useState(false)

  // Lazy-load 3 eksempelkort hvis det ikke er custom-pakken.
  useEffect(() => {
    if (IS_CUSTOM(pack.id)) {
      setExamples([])
      return
    }
    let cancelled = false
    const run = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('kort')
          .select('innhold')
          .eq('spillpakke_id', pack.id)
          .eq('aktiv', true)
          .limit(50)
        if (cancelled) return
        if (error || !data) {
          setExampleErr(true)
          return
        }
        const shuffled = [...data].sort(() => Math.random() - 0.5)
        const picks = shuffled.slice(0, 3).map((c: { innhold: string }) =>
          interpolatePreview(c.innhold)
        )
        setExamples(picks)
      } catch {
        if (!cancelled) setExampleErr(true)
      }
    }
    run()
    return () => { cancelled = true }
  }, [pack.id])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up"
        style={{ backgroundColor: pack.farge }}
        onClick={(e) => e.stopPropagation()}
      >
        {athina && (
          <div className="absolute inset-0 rounded-t-3xl sm:rounded-3xl bg-[#FF1493]/30 pointer-events-none" />
        )}
        <div className="relative flex items-start justify-between gap-3 mb-4">
          <h2 id={titleId} className="font-display font-black text-2xl text-white leading-tight">{pack.navn}</h2>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className="shrink-0 w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative space-y-3">
          {/* Metadata-rad */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/80 font-semibold">
            {cardCount !== undefined && (
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {cardCount} kort
              </span>
            )}
            {playerCount !== undefined && (
              <span className="inline-flex items-center gap-1">
                <Users className="w-3 h-3" /> {playerCount} spiller{playerCount !== 1 ? 'e' : ''}
              </span>
            )}
          </div>

          {/* Beskrivelse */}
          {pack.beskrivelse && (
            <p className="text-white/90 text-sm leading-relaxed">{pack.beskrivelse}</p>
          )}

          {/* Egne kort: kontekst */}
          {IS_CUSTOM(pack.id) && (
            <div className="bg-white/15 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest mb-1.5">
                <PenLine className="w-3 h-3" /> Egne kort
              </div>
              <p className="text-white text-sm leading-relaxed">
                Disse kortene ble sendt inn av spillere som scannet QR-koden før spillet startet.
                Du kan slå pakken av/på som vanlig, eller starte spillet på nytt fra forsiden for å nullstille.
              </p>
            </div>
          )}

          {/* Eksempelkort (kun ikke-custom) */}
          {!IS_CUSTOM(pack.id) && examples !== null && examples.length > 0 && (
            <div className="bg-white/15 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                <Quote className="w-3 h-3" /> Eksempelkort
              </div>
              <ul className="space-y-2">
                {examples.map((text, i) => (
                  <li key={i} className="text-white/90 text-sm leading-snug">
                    «{text}»
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!IS_CUSTOM(pack.id) && examples === null && !exampleErr && (
            <div className="bg-white/10 rounded-2xl p-4 animate-pulse">
              <div className="h-3 w-24 bg-white/30 rounded mb-3" />
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-white/20 rounded" />
                <div className="h-3 w-3/4 bg-white/20 rounded" />
                <div className="h-3 w-2/3 bg-white/20 rounded" />
              </div>
            </div>
          )}

          {/* Regler */}
          {pack.regler ? (
            <div className="bg-white/15 rounded-2xl p-4">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1.5">Regler</p>
              <p className="text-white text-sm leading-relaxed whitespace-pre-line">{pack.regler}</p>
            </div>
          ) : !IS_CUSTOM(pack.id) ? (
            <p className="text-white/55 text-xs">
              Ingen ekstra regler — bare følg kortene.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
