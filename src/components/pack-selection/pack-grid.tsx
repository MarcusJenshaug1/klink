'use client'

import type { Pack } from '@/types/game'
import { PackCard } from './pack-card'

interface PackGridProps {
  packs: Pack[]
  selectedIds: Set<string>
  onToggle: (packId: string) => void
}

export function PackGrid({ packs, selectedIds, onToggle }: PackGridProps) {
  if (packs.length === 0) {
    return (
      <div className="text-center py-10 bg-white/50 rounded-3xl px-6">
        <p className="text-2xl mb-2">🤔</p>
        <p className="text-forest font-bold">Ingen pakker matcher valgene dine</p>
        <p className="text-forest/60 text-sm mt-1">
          Prøv en annen drøyhet i <span className="font-semibold">Innstillinger</span> over.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {packs.map((pack) => (
        <PackCard
          key={pack.id}
          pack={pack}
          selected={selectedIds.has(pack.id)}
          onToggle={() => onToggle(pack.id)}
        />
      ))}
    </div>
  )
}
