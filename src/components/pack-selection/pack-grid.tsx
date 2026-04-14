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
      <div className="text-center py-12 text-charcoal/50">
        <p className="text-lg font-medium">Ingen spillpakker tilgjengelig</p>
        <p className="text-sm mt-1">Kontakt admin for a legge til pakker</p>
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
