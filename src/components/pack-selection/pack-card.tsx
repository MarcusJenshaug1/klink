'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Pack } from '@/types/game'

interface PackCardProps {
  pack: Pack
  selected: boolean
  onToggle: () => void
}

export function PackCard({ pack, selected, onToggle }: PackCardProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative w-full rounded-3xl p-5 text-left transition-all active:scale-95',
        'text-white min-h-[130px] flex flex-col justify-between',
        selected ? 'shadow-xl scale-[1.02]' : 'shadow-md opacity-90 hover:opacity-100'
      )}
      style={{ backgroundColor: pack.farge }}
    >
      {/* Top row: name + check */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-black text-xl leading-tight">{pack.navn}</h3>

        <div className={cn(
          'shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all',
          selected
            ? 'bg-white scale-100'
            : 'bg-white/20 scale-90'
        )}>
          <Check
            className={cn('w-4 h-4 transition-opacity', selected ? 'opacity-100' : 'opacity-0')}
            style={{ color: pack.farge }}
            strokeWidth={3}
          />
        </div>
      </div>

      {/* Description */}
      {pack.beskrivelse && (
        <p className="text-white/75 text-sm leading-snug line-clamp-2 mt-3">
          {pack.beskrivelse}
        </p>
      )}
    </button>
  )
}
