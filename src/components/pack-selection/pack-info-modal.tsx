'use client'

import { X } from 'lucide-react'
import { useAthina } from '@/context/athina-context'
import type { Pack } from '@/types/game'

interface PackInfoModalProps {
  pack: Pack
  cardCount?: number
  onClose: () => void
}

export function PackInfoModal({ pack, cardCount, onClose }: PackInfoModalProps) {
  const { isActive: athina } = useAthina()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up overflow-hidden"
        style={{ backgroundColor: pack.farge }}
        onClick={(e) => e.stopPropagation()}
      >
        {athina && (
          <div className="absolute inset-0 rounded-t-3xl sm:rounded-3xl bg-[#FF1493]/30 pointer-events-none" />
        )}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="font-display font-black text-2xl text-white leading-tight">{pack.navn}</h2>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {cardCount !== undefined && (
          <p className="text-white/70 text-sm font-bold mb-3">{cardCount} kort</p>
        )}

        {pack.beskrivelse && (
          <p className="text-white/90 text-sm leading-relaxed mb-3">{pack.beskrivelse}</p>
        )}

        {pack.regler && (
          <div className="bg-white/15 rounded-2xl p-4">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1.5">Regler</p>
            <p className="text-white text-sm leading-relaxed">{pack.regler}</p>
          </div>
        )}
      </div>
    </div>
  )
}
