'use client'

import { X } from 'lucide-react'
import Markdown from 'react-markdown'
import type { Pack } from '@/types/game'

interface InfoModalProps {
  open: boolean
  onClose: () => void
  pack: Pack | null
}

export function InfoModal({ open, onClose, pack }: InfoModalProps) {
  if (!open || !pack) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      <div
        className="relative w-full max-w-lg bg-lime rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-forest/20 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl font-black text-forest">{pack.navn}</h2>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center text-forest hover:bg-forest/20 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {pack.regler ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 prose prose-sm max-w-none text-forest/80 [&_strong]:text-forest [&_h1]:text-forest [&_h2]:text-forest [&_h3]:text-forest">
            <Markdown>{pack.regler}</Markdown>
          </div>
        ) : (
          <p className="text-forest/40 text-sm font-medium">Ingen regler tilgjengelig for denne pakken.</p>
        )}
      </div>
    </div>
  )
}
