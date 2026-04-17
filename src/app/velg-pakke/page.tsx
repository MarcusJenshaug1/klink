'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Droplets, Flame, Zap, Feather, Skull, ChevronLeft, ChevronDown, ChevronUp, Settings, Play, Tv } from 'lucide-react'
import { CastModal } from '@/components/game/cast-modal'
import { PackGrid } from '@/components/pack-selection/pack-grid'
import { ScarePop } from '@/components/pack-selection/scare-pop'
import { track } from '@/lib/analytics/events'
import { useGame } from '@/context/game-context'
import { useAthina } from '@/context/athina-context'
import { usePacks } from '@/hooks/use-packs'
import { useCards } from '@/hooks/use-cards'
import { useCardCounts } from '@/hooks/use-card-counts'
import { useMemo } from 'react'
import { INTENSITET_META } from '@/lib/game/sips'
import { DROYHET_META, DROYHET_ORDER, getDroyhetCopies } from '@/lib/game/droyhet'
import { cn } from '@/lib/utils'
import type { Intensitet, Droyhet, Pack } from '@/types/game'

const CUSTOM_PACK: Pack = {
  id: '__custom__',
  navn: 'Egne kort',
  beskrivelse: 'Kort laget av spillerne',
  regler: null,
  farge: '#F59E0B',
  ikon: 'pencil',
  aktiv: true,
  droyhet: 'droy',
}

const INTENSITET_ICONS: Record<Intensitet, typeof Droplets> = {
  lett: Droplets,
  medium: Flame,
  borst: Zap,
}

const DROYHET_ICONS: Record<Droyhet, typeof Droplets> = {
  mild: Feather,
  normal: Flame,
  droy: Skull,
}

export default function PackSelectionPage() {
  const router = useRouter()
  const { state, dispatch } = useGame()
  const { isActive: athina } = useAthina()
  const { packs, loading: packsLoading } = usePacks()
  const { fetchCards, fetchKorttyper, loading: cardsLoading } = useCards()
  const { counts: cardCounts } = useCardCounts(state.droyhet)
  const [castOpen, setCastOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => (state.customCards?.length ?? 0) > 0 ? new Set(['__custom__']) : new Set()
  )
  const [startError, setStartError] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Filtrer bort pakker der pakkens drøyhet er høyere enn brukerens valg.
  // Mild valgt → viser kun mild-pakker. Normal → mild+normal. Drøy → alle.
  // Legg til virtuell "Egne kort"-pakke øverst om spillere har sendt inn kort.
  const visiblePacks = useMemo(() => {
    const base = packs.filter((p) => DROYHET_ORDER[p.droyhet ?? 'normal'] <= DROYHET_ORDER[state.droyhet])
    return (state.customCards?.length ?? 0) > 0 ? [CUSTOM_PACK, ...base] : base
  }, [packs, state.droyhet, state.customCards])

  const togglePack = (id: string) => {
    setStartError(null)
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleStart = async () => {
    setStartError(null)
    const selected = visiblePacks.filter((p) => selectedIds.has(p.id))
    dispatch({ type: 'SELECT_PACKS', packs: selected })
    // Skip Supabase fetch for the virtual __custom__ pack
    const packIds = Array.from(selectedIds).filter((id) => id !== '__custom__')
    const [fetchedCards, korttyper] = await Promise.all([
      packIds.length > 0 ? fetchCards(packIds) : Promise.resolve([] as import('@/types/game').Card[]),
      fetchKorttyper(),
    ])
    const customSelected = selectedIds.has('__custom__') ? (state.customCards ?? []) : []
    const cards = [...fetchedCards, ...customSelected]
    dispatch({ type: 'SET_KORTTYPER', korttyper })
    // Hard-krav filter: min_spillere + nummererte spillerslots
    const filtered = cards.filter((c) => {
      if ((c.min_spillere ?? 2) > state.players.length) return false
      // {spiller3} i innhold krever min 3 spillere
      const allContent = (c.innhold ?? '') + ' ' + (c.utfordring ?? '')
      const nums = [...allContent.matchAll(/\{spiller(\d+)\}/g)].map(m => parseInt(m[1]))
      if (nums.length > 0 && Math.max(...nums) > state.players.length) return false
      return true
    })
    if (filtered.length === 0) {
      setStartError('Ingen kort passer til valgene dine. Prøv flere pakker eller legg til flere spillere.')
      return
    }
    const hasMatchingDroyhet = filtered.some(
      (c) => getDroyhetCopies(state.droyhet, c.droyhet ?? 'normal') > 0
    )
    if (!hasMatchingDroyhet) {
      setStartError(`Ingen kort passer valgt drøyhet (${DROYHET_META[state.droyhet].label.toLowerCase()}). Prøv å velge «Drøy» under Innstillinger.`)
      return
    }
    track('game_started', {
      players: state.players.length,
      packs: selected.length,
      pack_ids: selected.map((p) => p.id).join(','),
      intensitet: state.intensitet,
      droyhet: state.droyhet,
      cards_in_pool: filtered.length,
    })
    dispatch({ type: 'START_GAME', cards: filtered })
    router.push('/spill')
  }

  const handleBack = () => {
    dispatch({ type: 'SET_PHASE', phase: 'landing' })
    router.push('/')
  }

  const canStart = selectedIds.size > 0 && !cardsLoading

  const enrichedCounts = useMemo(() => ({
    ...cardCounts,
    ...((state.customCards?.length ?? 0) > 0 ? { '__custom__': state.customCards.length } : {}),
  }), [cardCounts, state.customCards])

  const scareActive = state.intensitet === 'borst' && state.droyhet === 'droy'

  return (
    <div className="min-h-dvh flex flex-col transition-colors duration-700 relative" style={{ backgroundColor: athina ? 'transparent' : '#A8E63D' }}>
      <ScarePop trigger={scareActive} />
      {scareActive && (
        <div
          className="pointer-events-none fixed inset-0 z-[50] animate-blood-pulse"
          aria-hidden
        />
      )}
      <div className="flex-1 flex flex-col p-6 gap-6 max-w-lg mx-auto w-full">

        {/* Header: back + players + title */}
        <div
          className={cn('rounded-3xl transition-all duration-500', athina && 'p-4 -mx-1')}
          style={athina ? { backgroundColor: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(10px)' } : {}}
        >
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleBack}
              aria-label="Tilbake"
              className={cn(
                'shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-95',
                athina ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-forest/10 text-forest hover:bg-forest/20'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Player chips */}
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {state.players.map((p, i) => {
                return (
                  <span
                    key={i}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-semibold',
                      athina ? 'bg-white/25 text-white' : 'bg-forest/10 text-forest'
                    )}
                  >
                    {p}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div className="mt-4">
            <h1
              className="font-display text-4xl font-black tracking-tight leading-none"
              style={{ color: athina ? '#ffffff' : '#1A3A1A' }}
            >
              Velg pakker
            </h1>
            <p style={{ color: athina ? 'rgba(255,255,255,0.75)' : 'rgba(26,58,26,0.5)' }} className="font-medium mt-1">
              Velg én eller flere spillpakker
            </p>
          </div>
        </div>

        {/* Settings (collapsible: Intensitet + Drøyhet) — plassert over pakkene */}
        <div className="backdrop-blur-sm rounded-3xl shadow-sm transition-colors duration-500 overflow-hidden" style={{ backgroundColor: athina ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.6)' }}>
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className={cn(
              'w-full flex items-center justify-between gap-3 px-5 py-4 transition-colors',
              athina ? 'text-white hover:bg-white/5' : 'text-forest hover:bg-forest/5'
            )}
          >
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4 opacity-70" />
              <span className="text-sm font-black tracking-wide">Innstillinger</span>
              <span className={cn('text-xs font-semibold', athina ? 'text-white/60' : 'text-forest/50')}>
                {INTENSITET_META[state.intensitet].label} · {DROYHET_META[state.droyhet].label}
              </span>
            </span>
            {settingsOpen ? <ChevronUp className="w-4 h-4 opacity-70" /> : <ChevronDown className="w-4 h-4 opacity-70" />}
          </button>

          {settingsOpen && (
            <div className="px-5 pb-5 space-y-4 border-t border-black/5">
              {/* Intensitet */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: athina ? 'rgba(255,255,255,0.6)' : 'rgba(26,58,26,0.5)' }}>
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
                          key === 'borst' && selected && 'animate-scary-shake',
                          selected
                            ? athina ? 'bg-white/30 text-white shadow-sm' : 'bg-forest text-lime shadow-sm'
                            : athina ? 'bg-white/10 text-white/80 hover:bg-white/20' : 'bg-forest/5 text-forest hover:bg-forest/10'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-black">{meta.label}</span>
                        <span className={cn(
                          'text-[10px] leading-tight text-center font-medium',
                          selected
                            ? athina ? 'text-white/70' : 'text-lime/70'
                            : athina ? 'text-white/50' : 'text-forest/40'
                        )}>
                          {meta.beskrivelse}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Drøyhet */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: athina ? 'rgba(255,255,255,0.6)' : 'rgba(26,58,26,0.5)' }}>
                  Drøyhet
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(DROYHET_META) as Droyhet[]).map((key) => {
                    const meta = DROYHET_META[key]
                    const Icon = DROYHET_ICONS[key]
                    const selected = state.droyhet === key
                    return (
                      <button
                        key={key}
                        onClick={() => { setStartError(null); dispatch({ type: 'SET_DROYHET', droyhet: key }) }}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95',
                          key === 'droy' && selected && 'animate-scary-shake',
                          selected
                            ? athina ? 'bg-white/30 text-white shadow-sm' : 'bg-forest text-lime shadow-sm'
                            : athina ? 'bg-white/10 text-white/80 hover:bg-white/20' : 'bg-forest/5 text-forest hover:bg-forest/10'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-black">{meta.label}</span>
                        <span className={cn(
                          'text-[10px] leading-tight text-center font-medium',
                          selected
                            ? athina ? 'text-white/70' : 'text-lime/70'
                            : athina ? 'text-white/50' : 'text-forest/40'
                        )}>
                          {meta.beskrivelse}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pack grid */}
        {packsLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-forest/20 border-t-forest rounded-full animate-spin" />
          </div>
        ) : (
          <PackGrid
            packs={visiblePacks}
            selectedIds={selectedIds}
            onToggle={togglePack}
            cardCounts={enrichedCounts}
          />
        )}

        {/* Spacer for sticky button */}
        <div className="h-4" />
      </div>

      {/* Sticky start button */}
      <div className="sticky bottom-0 p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-colors duration-700" style={{ backgroundColor: athina ? 'rgba(233,30,140,0.55)' : 'rgba(168,230,61,0.8)' }}>
        <div className="max-w-lg mx-auto">
          {startError && (
            <p
              className="mb-2 text-sm font-semibold text-center rounded-xl px-4 py-2"
              style={{
                backgroundColor: athina ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.75)',
                color: athina ? '#fff' : '#991b1b',
              }}
            >
              {startError}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setCastOpen(true)}
              aria-label="Cast til TV"
              className={cn(
                'shrink-0 w-14 min-h-[56px] rounded-2xl flex items-center justify-center transition-all active:scale-95',
                athina ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-forest/15 text-forest hover:bg-forest/25'
              )}
            >
              <Tv className="w-5 h-5" />
            </button>
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={cn(
              'flex-1 min-h-[56px] rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95',
              canStart
                ? athina ? 'bg-white/30 text-white shadow-lg hover:bg-white/40 backdrop-blur-sm' : 'bg-forest text-lime shadow-lg hover:bg-forest-light'
                : athina ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-forest/20 text-forest/40 cursor-not-allowed'
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

      <CastModal open={castOpen} onClose={() => setCastOpen(false)} castCode={state.castCode} />
    </div>
  )
}
