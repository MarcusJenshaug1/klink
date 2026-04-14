'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import Markdown from 'react-markdown'
import { useAthina } from '@/context/athina-context'
import type { Pack } from '@/types/game'

interface InfoModalProps {
  open: boolean
  onClose: () => void
  packs: Pack[]
}

export function InfoModal({ open, onClose, packs }: InfoModalProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const { isActive: athina } = useAthina()

  if (!open || packs.length === 0) return null

  const pack = packs[Math.min(activeIdx, packs.length - 1)]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>

      <div
        className="relative w-full max-w-lg rounded-t-3xl pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-slide-up max-h-[85vh] flex flex-col transition-colors duration-500"
        style={{ backgroundColor: athina ? '#FF69B4' : '#A8E63D' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="pt-4 pb-2 flex justify-center shrink-0">
          <div className="w-10 h-1 bg-forest/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-3 shrink-0">
          <h2 className="font-display text-2xl font-black text-forest">{pack.navn}</h2>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${athina ? 'bg-[#E91E8C]/15 text-[#E91E8C] hover:bg-[#E91E8C]/25' : 'bg-forest/10 text-forest hover:bg-forest/20'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pack tabs — only shown when multiple packs selected */}
        {packs.length > 1 && (
          <div className="flex gap-2 px-6 pb-3 shrink-0 overflow-x-auto">
            {packs.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveIdx(i)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  i === activeIdx
                    ? athina ? 'bg-[#E91E8C] text-white' : 'bg-forest text-lime'
                    : athina ? 'bg-[#E91E8C]/15 text-[#E91E8C]/70 hover:bg-[#E91E8C]/25' : 'bg-forest/10 text-forest/60 hover:bg-forest/20'
                }`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                  style={{ backgroundColor: p.farge }}
                />
                {p.navn}
              </button>
            ))}
          </div>
        )}

        {/* Rules content */}
        <div className="px-6 overflow-y-auto pb-2">
          {pack.regler ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 prose prose-sm max-w-none text-forest/80 [&_strong]:text-forest [&_h1]:text-forest [&_h2]:text-forest [&_h3]:text-forest">
              <Markdown>{pack.regler}</Markdown>
            </div>
          ) : (
            <p className="text-forest/40 text-sm font-medium">
              Ingen regler tilgjengelig for denne pakken.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
