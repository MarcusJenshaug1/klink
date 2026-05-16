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
      <div
        className={cn(
          'relative w-full rounded-2xl p-4 text-left transition-all duration-200 overflow-hidden',
          'text-white min-h-[118px] flex flex-col justify-between',
          selected
            ? 'shadow-xl scale-[1.02] ring-[3px] ring-inset ring-white/70'
            : 'shadow-md opacity-85 hover:opacity-100',
        )}
        style={{ backgroundColor: pack.farge }}
      >
        {/* Full-card tap to toggle */}
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={selected}
          aria-label={`${selected ? 'Fjern' : 'Velg'} ${pack.navn}`}
          className="absolute inset-0 rounded-2xl active:scale-[0.98] transition-transform"
        />
        {athina && <div className="absolute inset-0 bg-[#FF1493]/30 pointer-events-none" />}

        <div className="relative z-10 pointer-events-none flex min-h-[86px] flex-col justify-between">

          {/* Top row: name + selection indicator only */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-base sm:text-lg leading-tight flex-1">{pack.navn}</h3>
            <div className={cn(
              'mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shrink-0',
              selected
                ? 'bg-white shadow-sm scale-100'
                : 'border-2 border-white/35 scale-90',
            )}>
              <Check
                className={cn('w-3.5 h-3.5 transition-opacity duration-150', selected ? 'opacity-100' : 'opacity-0')}
                style={{ color: pack.farge }}
                strokeWidth={3}
              />
            </div>
          </div>

          {/* Bottom row: description + info button + card count */}
          <div className="flex items-end justify-between gap-2 mt-2">
            {pack.beskrivelse ? (
              <p className="text-white/75 text-xs sm:text-sm leading-snug line-clamp-2 flex-1">
                {pack.beskrivelse}
              </p>
            ) : (
              <span className="flex-1" />
            )}

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                aria-label={`Info om ${pack.navn}`}
                className="pointer-events-auto -mb-1 -mr-1 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 active:bg-white/30 transition"
              >
                <Info className="w-3.5 h-3.5 text-white/55" />
              </button>
              {cardCount !== undefined && (
                <span className="text-white/60 text-xs font-bold tabular-nums">
                  {cardCount} kort
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

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
