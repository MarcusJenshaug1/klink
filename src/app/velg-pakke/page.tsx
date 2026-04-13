'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Droplets, Flame, Zap, ChevronLeft, Play } from 'lucide-react'
import { PackGrid } from '@/components/pack-selection/pack-grid'
import { useGame } from '@/context/game-context'
import { usePacks } from '@/hooks/use-packs'
import { useCards } from '@/hooks/use-cards'
import { INTENSITET_META } from '@/lib/game/sips'
import { cn } from '@/lib/utils'
import type { Intensitet } from '@/types/game'

const INTENSITET_ICONS: Record<Intensitet, typeof Droplets> = {
  lett: Droplets,
  medium: Flame,
  borst: Zap,
}

export default function PackSelectionPage() {
  const router = useRouter()
  const { state, dispatch } = useGame()
  const { packs, loading: packsLoading } = usePacks()
  const { fetchCards, loading: cardsLoading } = useCards()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const togglePack = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleStart = async () => {
    const selected = packs.filter((p) => selectedIds.has(p.id))
    dispatch({ type: 'SELECT_PACKS', packs: selected })
    const cards = await fetchCards(Array.from(selectedIds))
    if (cards.length > 0) {
      dispatch({ type: 'START_GAME', cards })
      router.push('/spill')
    }
  }

  const handleBack = () => {
    dispatch({ type: 'SET_PHASE', phase: 'landing' })
    router.push('/')
  }

  const canStart = selectedIds.size > 0 && !cardsLoading

  return (
    <div className="min-h-dvh bg-lime flex flex-col">
      <div className="flex-1 flex flex-col p-6 gap-6 max-w-lg mx-auto w-full">

        {/* Top row: back + players */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleBack}
            aria-label="Tilbake"
            className="shrink-0 w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center text-forest hover:bg-forest/20 transition-colors active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Player chips */}
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {state.players.map((p, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-forest/10 text-forest text-sm font-semibold"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-display text-4xl font-black text-forest tracking-tight leading-none">
            Velg pakker
          </h1>
          <p className="text-forest/50 font-medium mt-1">
            Velg én eller flere spillpakker
          </p>
        </div>

        {/* Pack grid */}
        {packsLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-forest/20 border-t-forest rounded-full animate-spin" />
          </div>
        ) : (
          <PackGrid
            packs={packs}
            selectedIds={selectedIds}
            onToggle={togglePack}
          />
        )}

        {/* Intensity */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-5 shadow-sm">
          <p className="text-xs font-bold text-forest/50 uppercase tracking-widest mb-4">
            Intensitet
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(INTENSITET_META) as Intensitet[]).map((key) => {
              const meta = INTENSITET_META[key]
              const Icon = INTENSITET_ICONS[key]
              const selected = state.intensitet === key
              return (
                <button
                  key={key}
                  onClick={() => dispatch({ type: 'SET_INTENSITET', intensitet: key })}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95',
                    selected
                      ? 'bg-forest text-lime shadow-sm'
                      : 'bg-forest/5 text-forest hover:bg-forest/10'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-black">{meta.label}</span>
                  <span className={cn(
                    'text-[10px] leading-tight text-center font-medium',
                    selected ? 'text-lime/70' : 'text-forest/40'
                  )}>
                    {meta.beskrivelse}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Spacer for sticky button */}
        <div className="h-4" />
      </div>

      {/* Sticky start button */}
      <div className="sticky bottom-0 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-lime/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={cn(
              'w-full min-h-[56px] rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95',
              canStart
                ? 'bg-forest text-lime shadow-lg hover:bg-forest-light'
                : 'bg-forest/20 text-forest/40 cursor-not-allowed'
            )}
          >
            {cardsLoading ? (
              <div className="w-5 h-5 border-2 border-lime/40 border-t-lime rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-5 h-5" />
                {selectedIds.size === 0
                  ? 'Velg en pakke'
                  : `Start med ${selectedIds.size} pakke${selectedIds.size !== 1 ? 'r' : ''}`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
