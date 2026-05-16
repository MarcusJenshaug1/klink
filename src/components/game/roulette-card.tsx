'use client'

import { useState, useEffect, useMemo } from 'react'
import { Droplets } from 'lucide-react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { getSips, formatSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface RouletteCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

const CHAMBERS = 6

function seedNum(id: string, max: number): number {
  const hash = id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)
  return Math.abs(hash) % max
}

export function RouletteCard({ card, pack, players, intensitet, korttyper, onNext }: RouletteCardProps) {
  const { isActive: athina } = useAthina()
  const meta = getCardTypeMeta(card.type, korttyper)

  const sips = useMemo(() => {
    const override =
      intensitet === 'lett' ? card.slurker_lett
      : intensitet === 'medium' ? card.slurker_medium
      : card.slurker_borst
    if (override != null) return override
    return getSips(intensitet)
  }, [card.slurker_borst, card.slurker_lett, card.slurker_medium, intensitet])

  const loadedIdx = seedNum(card.id, CHAMBERS)
  const hasPlayers = players.length > 0
  const startPlayerIdx = hasPlayers ? seedNum(card.id + 'p', players.length) : 0

  const [tapped, setTapped] = useState<number[]>([])
  const [bang, setBang] = useState<number | null>(null)
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(startPlayerIdx)

  useEffect(() => {
    setTapped([])
    setBang(null)
    setCurrentPlayerIdx(hasPlayers ? seedNum(card.id + 'p', players.length) : 0)
  }, [card.id, hasPlayers, players.length])

  const currentPlayer = hasPlayers ? players[currentPlayerIdx] : null

  const handleTap = (idx: number) => {
    if (tapped.includes(idx) || bang !== null) return
    if (idx === loadedIdx) {
      setBang(idx)
      setTapped(t => [...t, idx])
    } else {
      setTapped(t => [...t, idx])
      if (hasPlayers) setCurrentPlayerIdx(i => (i + 1) % players.length)
    }
  }

  const accent = athina ? '#FF1493' : meta.farge ?? pack.farge
  const primaryActionClass = cn(
    'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-base shadow-lg transition-all hover:opacity-95 active:scale-[0.98] landscape:py-2.5 landscape:text-sm',
    athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
  )

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-[calc(env(safe-area-inset-top)_+_4.25rem)] pb-[calc(env(safe-area-inset-bottom)_+_6.75rem)] transition-colors duration-700 sm:px-5 landscape:px-20 landscape:pt-14 landscape:pb-20"
      style={{ backgroundColor: athina ? 'transparent' : pack.farge }}
    >
      <div className="flex min-h-0 w-full max-w-sm flex-col items-center gap-3 md:max-w-xl md:gap-5 lg:max-w-2xl xl:max-w-3xl landscape:max-w-2xl landscape:gap-2 lg:landscape:max-w-3xl">

        {/* Category badge */}
        <div className="flex justify-center">
          <div
            className={cn(
              'inline-flex max-w-[calc(100vw_-_2rem)] items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-sm backdrop-blur-sm sm:max-w-sm',
              athina ? 'border-white/30 bg-white/18' : 'border-white/20'
            )}
            style={athina ? undefined : { backgroundColor: accent }}
          >
            <meta.icon className="w-3.5 h-3.5" />
            <span className="truncate">{card.tittel || meta.label}</span>
          </div>
        </div>

        {/* Main card */}
        <div
          className={cn(
            'relative flex max-h-[calc(100dvh-13.5rem)] w-full flex-col gap-5 overflow-x-hidden overflow-y-auto rounded-3xl border p-6 shadow-2xl backdrop-blur-md sm:p-7 md:gap-7 md:p-10 landscape:max-h-[calc(100dvh-8.5rem)] landscape:gap-4 landscape:rounded-2xl landscape:p-5',
            athina ? 'border-white/30 bg-white/18' : 'border-white/25 bg-white/18'
          )}
          style={{
            boxShadow: bang !== null
              ? '0 0 0 3px rgba(220,38,38,0.7), 0 24px 45px rgba(0,0,0,0.24)'
              : athina
                ? '0 0 0 2px rgba(255,215,0,0.35), 0 24px 45px rgba(0,0,0,0.16)'
                : '0 24px 45px rgba(0,0,0,0.16)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: bang !== null ? '#dc2626' : accent }} />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28"
            style={{ background: `linear-gradient(180deg, ${colorWithAlpha(bang !== null ? '#dc2626' : accent, 0.24, 'rgba(255,255,255,0.14)')}, transparent)` }}
          />
          {athina && <div className="pointer-events-none absolute inset-0 bg-[#FF1493]/30" />}

          <div className="relative z-10 flex flex-col items-center gap-5 md:gap-6 landscape:gap-3">

            {bang === null ? (
              <>
                {/* Current player */}
                {currentPlayer && (
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60">Velger kammer</p>
                    <span
                      className="rounded-full px-5 py-2 text-lg font-black text-white"
                      style={{ backgroundColor: colorWithAlpha(accent, 0.35, 'rgba(255,255,255,0.2)') }}
                    >
                      {currentPlayer}
                    </span>
                  </div>
                )}

                {/* Cylinder grid */}
                <div className="grid w-full grid-cols-3 gap-3 landscape:gap-2">
                  {Array.from({ length: CHAMBERS }, (_, i) => {
                    const isTapped = tapped.includes(i)
                    return (
                      <button
                        key={i}
                        onClick={() => handleTap(i)}
                        disabled={isTapped}
                        className={cn(
                          'flex flex-col items-center justify-center rounded-2xl py-5 text-2xl font-black transition-all landscape:py-3 landscape:text-xl',
                          isTapped
                            ? 'bg-green-500/30 text-green-300 cursor-default'
                            : 'bg-white/15 text-white hover:bg-white/25 active:scale-95'
                        )}
                      >
                        {isTapped ? '✅' : '🔘'}
                        <span className="mt-1 text-xs font-bold opacity-60">{i + 1}</span>
                      </button>
                    )
                  })}
                </div>

                <p className="text-center text-xs text-white/50">
                  {CHAMBERS - tapped.length} kammer igjen · {tapped.length} trygge
                </p>
              </>
            ) : (
              /* BANG */
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-6xl landscape:text-4xl">💥</p>
                <p className="text-2xl font-black text-white">BANG!</p>
                {currentPlayer && (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60">Drikker</p>
                    <span className={cn(
                      'rounded-full px-6 py-2.5 text-2xl font-black',
                      athina ? 'bg-white text-[#FF1493]' : 'bg-white text-forest'
                    )}>
                      {currentPlayer}
                    </span>
                    <p className="flex items-center gap-2 text-2xl font-black text-white">
                      <Droplets className="h-6 w-6" />
                      {formatSips(sips)}
                    </p>
                  </>
                )}
                <button onClick={onNext} className={primaryActionClass}>
                  Neste kort →
                </button>
              </div>
            )}

          </div>
        </div>

        {bang === null && (
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold text-white/75 shadow-sm backdrop-blur-sm">
            <Droplets className="h-4 w-4 shrink-0" />
            {formatSips(sips)}
          </span>
        )}
      </div>
    </div>
  )
}
