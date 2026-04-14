'use client'

import { PackageOpen } from 'lucide-react'
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
        <PackageOpen className="w-10 h-10 mx-auto text-forest/40 mb-3" />
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
