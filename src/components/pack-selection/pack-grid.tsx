'use client'

import { PackageOpen } from 'lucide-react'
import type { Pack } from '@/types/game'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import { PackCard } from './pack-card'

interface PackGridProps {
  packs: Pack[]
  selectedIds: Set<string>
  onToggle: (packId: string) => void
  cardCounts?: Record<string, number>
}

export function PackGrid({ packs, selectedIds, onToggle, cardCounts }: PackGridProps) {
  const { isActive: athina } = useAthina()

  if (packs.length === 0) {
    return (
      <div className={cn('text-center py-10 rounded-3xl px-6', athina ? 'bg-white/18 text-white' : 'bg-white/50')}>
        <PackageOpen className={cn('w-10 h-10 mx-auto mb-3', athina ? 'text-white/50' : 'text-forest/40')} />
        <p className={cn('font-bold', athina ? 'text-white' : 'text-forest')}>Ingen pakker matcher valgene dine</p>
        <p className={cn('text-sm mt-1', athina ? 'text-white/70' : 'text-forest/60')}>
          Prøv en annen drøyhet i <span className="font-semibold">Innstillinger</span> over.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4">
      {packs.map((pack) => (
        <PackCard
          key={pack.id}
          pack={pack}
          selected={selectedIds.has(pack.id)}
          onToggle={() => onToggle(pack.id)}
          cardCount={cardCounts?.[pack.id]}
        />
      ))}
    </div>
  )
}
