'use client'

import { useState } from 'react'
import { Check, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAthina } from '@/context/athina-context'
import { PackInfoModal } from './pack-info-modal'
import type { Pack } from '@/types/game'

interface PackCardProps {
  pack: Pack
  selected: boolean
  onToggle: () => void
  cardCount?: number
}

export function PackCard({ pack, selected, onToggle, cardCount }: PackCardProps) {
  const { isActive: athina } = useAthina()
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <>
      <button
        onClick={onToggle}
        className={cn(
          'relative w-full rounded-2xl p-4 text-left transition-all active:scale-95 overflow-hidden',
          'text-white min-h-[110px] flex flex-col justify-between',
          selected ? 'shadow-xl scale-[1.02]' : 'shadow-md opacity-90 hover:opacity-100',
        )}
        style={{ backgroundColor: pack.farge }}
        aria-pressed={selected}
      >
        {athina && <div className="absolute inset-0 bg-[#FF1493]/30 pointer-events-none" />}

        {/* Top row: name + info + check */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-black text-base sm:text-lg leading-tight flex-1">{pack.navn}</h3>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setInfoOpen(true) }}
              aria-label={`Info om ${pack.navn}`}
              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition"
            >
              <Info className="w-3.5 h-3.5 text-white" />
            </button>

            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center transition-all',
                selected ? 'bg-white scale-100' : 'bg-white/20 scale-90',
              )}
            >
              <Check
                className={cn('w-3.5 h-3.5 transition-opacity', selected ? 'opacity-100' : 'opacity-0')}
                style={{ color: pack.farge }}
                strokeWidth={3}
              />
            </div>
          </div>
        </div>

        {/* Bottom: description + card count */}
        <div className="flex items-end justify-between gap-2 mt-2">
          {pack.beskrivelse ? (
            <p className="text-white/75 text-xs sm:text-sm leading-snug line-clamp-2 flex-1">
              {pack.beskrivelse}
            </p>
          ) : (
            <span />
          )}
          {cardCount !== undefined && (
            <span className="shrink-0 text-white/60 text-xs font-bold tabular-nums">
              {cardCount} kort
            </span>
          )}
        </div>
      </button>

      {infoOpen && (
        <PackInfoModal
          pack={pack}
          cardCount={cardCount}
          onClose={() => setInfoOpen(false)}
        />
      )}
    </>
  )
}
