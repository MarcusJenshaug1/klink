'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAthina } from '@/context/athina-context'
import type { Pack } from '@/types/game'

interface PackCardProps {
  pack: Pack
  selected: boolean
  onToggle: () => void
}

export function PackCard({ pack, selected, onToggle }: PackCardProps) {
  const { isActive: athina } = useAthina()

  return (
    <button
      onClick={onToggle}
      className={cn(
        'group relative w-full rounded-2xl text-left overflow-hidden',
        'aspect-[4/5] sm:aspect-[1/1] md:aspect-[5/4]',
        'transition-all duration-200 active:scale-[0.97]',
        selected
          ? 'ring-2 ring-white shadow-xl scale-[1.02]'
          : 'shadow-md hover:shadow-lg opacity-95 hover:opacity-100 hover:scale-[1.01]',
      )}
      style={{ backgroundColor: pack.farge }}
      aria-pressed={selected}
    >
      {/* Subtle top highlight */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
      {/* Bottom darkening for contrast */}
      <div
        className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {athina && <div className="absolute inset-0 bg-[#FF1493]/25 pointer-events-none" />}

      {/* Selected glow */}
      {selected && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 40px rgba(255,255,255,0.25)',
          }}
        />
      )}

      {/* Check badge — top right */}
      <div
        className={cn(
          'absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200',
          selected
            ? 'bg-white scale-100'
            : 'bg-white/15 scale-90 border border-white/30',
        )}
      >
        <Check
          className={cn('w-4 h-4 transition-opacity duration-150', selected ? 'opacity-100' : 'opacity-0')}
          style={{ color: pack.farge }}
          strokeWidth={3}
        />
      </div>

      {/* Name + description — bottom left */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
        <h3 className="font-display font-black text-lg sm:text-xl leading-tight tracking-tight drop-shadow-sm">
          {pack.navn}
        </h3>
        {pack.beskrivelse && (
          <p className="text-white/80 text-xs sm:text-sm leading-snug line-clamp-2 mt-1">
            {pack.beskrivelse}
          </p>
        )}
      </div>
    </button>
  )
}
