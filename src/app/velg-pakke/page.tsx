'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Droplets, Flame, Zap, Feather, Skull, ChevronLeft, Play } from 'lucide-react'
import { PackGrid } from '@/components/pack-selection/pack-grid'
import { ScarePop } from '@/components/pack-selection/scare-pop'
import { track } from '@/lib/analytics/events'
import { useGame } from '@/context/game-context'
import { useAthina } from '@/context/athina-context'
import { usePacks } from '@/hooks/use-packs'
import { useCards } from '@/hooks/use-cards'
import { useCardCounts } from '@/hooks/use-card-counts'
import { INTENSITET_META } from '@/lib/game/sips'
import { DROYHET_META, DROYHET_ORDER, getDroyhetCopies } from '@/lib/game/droyhet'
import { cn } from '@/lib/utils'
import type { Intensitet, Droyhet, Pack } from '@/types/game'

type Step = 'settings' | 'packs'

const CUSTOM_PACK: Pack = {
  id: '__custom__',
  navn: 'Egne kort',
  beskrivelse: 'Kort laget av spillerne via QR-flyten',
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
  const { packs, loading: packsLoading, error: packsError, refetch: refetchPacks } = usePacks()
  const { fetchCards, fetchKorttyper, loading: cardsLoading } = useCards()
  const { counts: cardCounts, loaded: countsLoaded } = useCardCounts(state.droyhet, state.players.length)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => (state.customCards?.length ?? 0) > 0 ? new Set(['__custom__']) : new Set()
  )
  const [startError, setStartError] = useState<string | null>(null)

  // Førstegangsbrukere starter på 'settings', ellers (kom tilbake fra deck-empty) på 'packs'.
  const [step, setStep] = useState<Step>(
    () => state.selectedPacks.length > 0 ? 'packs' : 'settings'
  )

  const enrichedCounts = useMemo((): Record<string, number> => ({
    ...cardCounts,
    ...((state.customCards?.length ?? 0) > 0 ? { '__custom__': state.customCards.length } : {}),
  }), [cardCounts, state.customCards])

  const isPackBlocked = (pack: Pack) =>
    DROYHET_ORDER[pack.droyhet ?? 'normal'] > DROYHET_ORDER[state.droyhet]

  // Vis ALLE pakker, inkludert "blocked"-pakker (greyed-out + auto-juster ved klikk).
  // Men skjul "døde" pakker — pakker som ikke er blocked men som har 0 kort tilgjengelig
  // (f.eks. fordi spillerantall filtrerer bort alt).
  const allPacks = useMemo(() => {
    const base = packs.filter((p) => {
      if (DROYHET_ORDER[p.droyhet ?? 'normal'] > DROYHET_ORDER[state.droyhet]) return true
      if (countsLoaded && (enrichedCounts[p.id] ?? 0) === 0) return false
      return true
    })
    return (state.customCards?.length ?? 0) > 0 ? [CUSTOM_PACK, ...base] : base
  }, [packs, state.droyhet, state.customCards, enrichedCounts, countsLoaded])

  const blockedCount = useMemo(
    () => allPacks.filter(isPackBlocked).length,
    [allPacks, state.droyhet] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // Rydd selectedIds når pakker forsvinner fra visning (f.eks. ved bytte av drøyhet).
  useEffect(() => {
    if (!countsLoaded) return
    const visibleIds = new Set(allPacks.map((p) => p.id))
    setSelectedIds((prev) => {
      const next = new Set([...prev].filter((id) => visibleIds.has(id)))
      return next.size !== prev.size ? next : prev
    })
  }, [allPacks, countsLoaded])

  const togglePack = (id: string) => {
    setStartError(null)
    const pack = allPacks.find((p) => p.id === id)
    if (pack && isPackBlocked(pack)) {
      // Auto-juster drøyhet opp slik at brukeren kan velge denne pakken.
      dispatch({ type: 'SET_DROYHET', droyhet: pack.droyhet ?? 'droy' })
    }
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleStart = async () => {
    setStartError(null)
    const selected = allPacks.filter((p) => selectedIds.has(p.id) && !isPackBlocked(p))
    if (selected.length === 0) {
      setStartError('Velg minst én pakke.')
      return
    }
    dispatch({ type: 'SELECT_PACKS', packs: selected })
    const packIds = selected.map((p) => p.id).filter((id) => id !== '__custom__')
    let fetchedCards: import('@/types/game').Card[] = []
    let korttyper: import('@/types/game').Korttype[] = []
    try {
      ;[fetchedCards, korttyper] = await Promise.all([
        packIds.length > 0 ? fetchCards(packIds) : Promise.resolve([] as import('@/types/game').Card[]),
        fetchKorttyper(),
      ])
    } catch {
      setStartError('Klarte ikke hente kortene akkurat nå. Sjekk nett og prøv igjen.')
      return
    }
    const customSelected = selectedIds.has('__custom__') ? (state.customCards ?? []) : []
    const cards = [...fetchedCards, ...customSelected]
    dispatch({ type: 'SET_KORTTYPER', korttyper })

    const totalBeforeFilter = cards.length
    // Diagnostiser hvorfor pool ble tom: spillerkrav vs drøyhet.
    let removedByPlayers = 0
    let removedByDroyhet = 0
    let lowestMinRequired = Infinity
    const filtered = cards.filter((c) => {
      const allContent = (c.innhold ?? '') + ' ' + (c.utfordring ?? '')
      const slotNums = [...allContent.matchAll(/\{spiller(\d+)\}/g)].map(m => parseInt(m[1]))
      const minReq = Math.max(
        c.min_spillere ?? 2,
        slotNums.length > 0 ? Math.max(...slotNums) : 0
      )
      if (minReq > state.players.length) {
        removedByPlayers++
        if (minReq < lowestMinRequired) lowestMinRequired = minReq
        return false
      }
      return true
    })
    const droyhetOk = filtered.filter(
      (c) => getDroyhetCopies(state.droyhet, c.droyhet ?? 'normal') > 0
    )
    removedByDroyhet = filtered.length - droyhetOk.length

    if (totalBeforeFilter === 0) {
      setStartError('De valgte pakkene har ingen kort. Velg en annen pakke.')
      return
    }
    if (droyhetOk.length === 0) {
      if (removedByPlayers > 0 && removedByDroyhet === 0) {
        const needed = Math.max(1, lowestMinRequired - state.players.length)
        const playerWord = needed === 1 ? 'spiller' : 'spillere'
        setStartError(
          state.players.length === 0
            ? `Du har ingen spillere ennå — gå tilbake og legg til minst ${Math.max(2, lowestMinRequired)}.`
            : `Pakkene krever minst ${lowestMinRequired} spillere — dere er ${state.players.length}. Legg til ${needed} ${playerWord} eller velg en annen pakke.`
        )
      } else if (removedByDroyhet > 0 && removedByPlayers === 0) {
        setStartError(`Drøyhet «${DROYHET_META[state.droyhet].label}» filtrerer bort alle kortene. Prøv «Drøy» i innstillinger.`)
      } else {
        setStartError('Ingen kort passer valgene dine. Prøv en annen pakke, legg til spillere, eller endre drøyhet.')
      }
      track('pack_selection_empty', {
        total_before: totalBeforeFilter,
        removed_by_players: removedByPlayers,
        removed_by_droyhet: removedByDroyhet,
        lowest_min_required: lowestMinRequired === Infinity ? null : lowestMinRequired,
        players: state.players.length,
        droyhet: state.droyhet,
      })
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
    if (step === 'packs' && state.selectedPacks.length === 0) {
      // Tilbake til innstillinger i stedet for helt ut.
      setStep('settings')
      return
    }
    dispatch({ type: 'SET_PHASE', phase: 'landing' })
    router.push('/')
  }

  const canStart = selectedIds.size > 0 && !cardsLoading

  const scareActive = state.intensitet === 'borst' && state.droyhet === 'droy'
  const selectedCount = allPacks.filter((p) => selectedIds.has(p.id) && !isPackBlocked(p)).length

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

        {/* Header: back + players + steg-tittel */}
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
              {state.players.map((p, i) => (
                <span
                  key={i}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-semibold',
                    athina ? 'bg-white/25 text-white' : 'bg-forest/10 text-forest'
                  )}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Steg-progresjon */}
          <StepIndicator step={step} athina={athina} />

          {/* Tittel */}
          <div className="mt-3">
            <h1
              className="font-display text-4xl font-black tracking-tight leading-none"
              style={{ color: athina ? '#ffffff' : '#1A3A1A' }}
            >
              {step === 'settings' ? 'Hvor drøyt?' : 'Velg pakker'}
            </h1>
            <p style={{ color: athina ? 'rgba(255,255,255,0.75)' : 'rgba(26,58,26,0.5)' }} className="font-medium mt-1">
              {step === 'settings'
                ? 'Tilpass intensitet og drøyhet før dere starter.'
                : 'Velg én eller flere spillpakker.'}
            </p>
          </div>
        </div>

        {step === 'settings' ? (
          <SettingsStep
            athina={athina}
            intensitet={state.intensitet}
            droyhet={state.droyhet}
            onIntensitet={(i) => dispatch({ type: 'SET_INTENSITET', intensitet: i })}
            onDroyhet={(d) => { setStartError(null); dispatch({ type: 'SET_DROYHET', droyhet: d }) }}
          />
        ) : (
          <>
            {/* Quick settings recap */}
            <button
              onClick={() => setStep('settings')}
              className={cn(
                'flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm transition-all active:scale-[0.98]',
                athina ? 'bg-white/15 text-white hover:bg-white/20' : 'bg-white/55 text-forest hover:bg-white/70'
              )}
            >
              <span className="font-semibold">
                <span className="font-black">{INTENSITET_META[state.intensitet].label}</span>
                {' · '}
                <span className="font-black">{DROYHET_META[state.droyhet].label}</span>
              </span>
              <span className={cn('text-xs font-bold underline', athina ? 'text-white/80' : 'text-forest/70')}>
                Endre
              </span>
            </button>

            {/* Pack grid */}
            {packsLoading ? (
              <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4" aria-label="Laster pakker">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'min-h-[118px] rounded-2xl animate-pulse',
                      athina ? 'bg-white/18' : 'bg-white/45'
                    )}
                  />
                ))}
              </div>
            ) : packsError ? (
              <div
                className={cn(
                  'rounded-3xl px-6 py-10 text-center',
                  athina ? 'bg-white/18 text-white' : 'bg-white/60 text-forest'
                )}
              >
                <p className="font-black">Klarte ikke hente pakker</p>
                <p className={cn('text-sm mt-1', athina ? 'text-white/70' : 'text-forest/60')}>
                  Sjekk nettet og prøv igjen.
                </p>
                <button
                  type="button"
                  onClick={refetchPacks}
                  className={cn(
                    'mt-4 min-h-[44px] px-4 rounded-xl text-sm font-black transition-all active:scale-95',
                    athina ? 'bg-white/30 text-white hover:bg-white/40' : 'bg-forest text-lime hover:bg-forest-light'
                  )}
                >
                  Prøv igjen
                </button>
              </div>
            ) : allPacks.length === 0 ? (
              <div
                className={cn(
                  'rounded-3xl px-6 py-10 text-center',
                  athina ? 'bg-white/18 text-white' : 'bg-white/60 text-forest'
                )}
              >
                <p className="font-black">Ingen pakker tilgjengelig</p>
                <p className={cn('text-sm mt-1', athina ? 'text-white/70' : 'text-forest/60')}>
                  Sjekk nettet og prøv igjen, eller kontakt support hvis det vedvarer.
                </p>
                <button
                  type="button"
                  onClick={refetchPacks}
                  className={cn(
                    'mt-4 min-h-[44px] px-4 rounded-xl text-sm font-black transition-all active:scale-95',
                    athina ? 'bg-white/30 text-white hover:bg-white/40' : 'bg-forest text-lime hover:bg-forest-light'
                  )}
                >
                  Prøv igjen
                </button>
              </div>
            ) : (
              <>
                {blockedCount > 0 && (
                  <p
                    className={cn(
                      'rounded-2xl px-4 py-2.5 text-sm',
                      athina ? 'bg-white/15 text-white/80' : 'bg-white/55 text-forest/70'
                    )}
                  >
                    {blockedCount} pakke{blockedCount !== 1 ? 'r' : ''} krever høyere drøyhet — trykk for å aktivere automatisk.
                  </p>
                )}
                <PackGrid
                  packs={allPacks}
                  selectedIds={selectedIds}
                  onToggle={togglePack}
                  cardCounts={enrichedCounts}
                  blockedIds={new Set(allPacks.filter(isPackBlocked).map((p) => p.id))}
                  selectedDroyhet={state.droyhet}
                  playerCount={state.players.length}
                />
              </>
            )}
          </>
        )}

        {/* Spacer for sticky button */}
        <div className="h-4" />
      </div>

      {/* Sticky button */}
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
          {step === 'settings' ? (
            <button
              onClick={() => setStep('packs')}
              className={cn(
                'w-full min-h-[56px] rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95',
                athina ? 'bg-white/30 text-white shadow-lg hover:bg-white/40 backdrop-blur-sm' : 'bg-forest text-lime shadow-lg hover:bg-forest-light'
              )}
            >
              Neste: velg pakker →
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={!canStart}
              className={cn(
                'w-full min-h-[56px] rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95',
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
                  {selectedCount === 0
                    ? 'Velg en pakke'
                    : `Start med ${selectedCount} pakke${selectedCount !== 1 ? 'r' : ''}`}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function StepIndicator({ step, athina }: { step: Step; athina: boolean }) {
  const inactiveBg = athina ? 'bg-white/20' : 'bg-forest/15'
  const activeBg = athina ? 'bg-white' : 'bg-forest'
  return (
    <div className="mt-4 flex items-center gap-2">
      <span className={cn('h-1.5 rounded-full transition-all', step === 'settings' ? `${activeBg} w-8` : `${inactiveBg} w-4`)} />
      <span className={cn('h-1.5 rounded-full transition-all', step === 'packs' ? `${activeBg} w-8` : `${inactiveBg} w-4`)} />
      <span className={cn('ml-2 text-[10px] font-bold uppercase tracking-widest', athina ? 'text-white/60' : 'text-forest/40')}>
        Steg {step === 'settings' ? '1' : '2'} av 2
      </span>
    </div>
  )
}

interface SettingsStepProps {
  athina: boolean
  intensitet: Intensitet
  droyhet: Droyhet
  onIntensitet: (i: Intensitet) => void
  onDroyhet: (d: Droyhet) => void
}

function SettingsStep({ athina, intensitet, droyhet, onIntensitet, onDroyhet }: SettingsStepProps) {
  return (
    <div className={cn(
      'backdrop-blur-sm rounded-3xl p-5 shadow-sm space-y-5',
    )} style={{ backgroundColor: athina ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.6)' }}>
      {/* Intensitet */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: athina ? 'rgba(255,255,255,0.6)' : 'rgba(26,58,26,0.5)' }}>
          Intensitet — hvor mye drikkes
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(INTENSITET_META) as Intensitet[]).map((key) => {
            const meta = INTENSITET_META[key]
            const Icon = INTENSITET_ICONS[key]
            const selected = intensitet === key
            return (
              <button
                key={key}
                onClick={() => onIntensitet(key)}
                aria-pressed={selected}
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
                    ? athina ? 'text-white/80' : 'text-lime/80'
                    : athina ? 'text-white/55' : 'text-forest/45'
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
          Drøyhet — hvor vågale kort
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(DROYHET_META) as Droyhet[]).map((key) => {
            const meta = DROYHET_META[key]
            const Icon = DROYHET_ICONS[key]
            const selected = droyhet === key
            return (
              <button
                key={key}
                onClick={() => onDroyhet(key)}
                aria-pressed={selected}
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
                    ? athina ? 'text-white/80' : 'text-lime/80'
                    : athina ? 'text-white/55' : 'text-forest/45'
                )}>
                  {meta.beskrivelse}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
