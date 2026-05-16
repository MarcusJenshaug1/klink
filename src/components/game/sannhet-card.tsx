'use client'

import { useState, useEffect, useMemo } from 'react'
import { Droplets } from 'lucide-react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { interpolateToSegments } from '@/lib/game/interpolate'
import { getSips, formatSips, replaceSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface SannhetCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

type Phase = 'challenge' | 'voting' | 'result'

function seedIndex(id: string, len: number): number {
  const hash = id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)
  return Math.abs(hash) % len
}

export function SannhetCard({ card, pack, players, intensitet, korttyper, onNext }: SannhetCardProps) {
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

  const hasPlayers = players.length > 0
  const playerIdx = hasPlayers ? seedIndex(card.id, players.length) : 0
  const player = hasPlayers ? players[playerIdx] : 'Spiller'

  // {spiller} in content always resolves to the agent (same person as "på teppet")
  // {spiller2}, {spiller3}, etc. resolve to other players
  const agentFirstPool = useMemo(() => {
    if (!hasPlayers) return []
    return [players[playerIdx], ...players.filter((_, i) => i !== playerIdx)]
  }, [players, playerIdx, hasPlayers])

  const segments = useMemo(() => {
    const raw = interpolateToSegments(card.innhold, players, agentFirstPool)
    return raw.map(seg =>
      seg.type === 'text' ? { ...seg, text: replaceSips(seg.text, sips) } : seg
    )
  }, [card.innhold, players, agentFirstPool, sips])

  const [phase, setPhase] = useState<Phase>('challenge')
  const [believers, setBelievers] = useState(0)
  const [doubters, setDoubters] = useState(0)
  const otherCount = Math.max(players.length - 1, 0)

  useEffect(() => {
    setPhase('challenge')
    setBelievers(0)
    setDoubters(0)
  }, [card.id])

  const majorityDoubts = doubters > believers
  const finalSips = majorityDoubts ? sips : 0

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

        {/* Badge */}
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
            boxShadow: athina
              ? '0 0 0 2px rgba(255,215,0,0.35), 0 24px 45px rgba(0,0,0,0.16)'
              : '0 24px 45px rgba(0,0,0,0.16)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: accent }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28"
            style={{ background: `linear-gradient(180deg, ${colorWithAlpha(accent, 0.24, 'rgba(255,255,255,0.14)')}, transparent)` }} />
          {athina && <div className="pointer-events-none absolute inset-0 bg-[#FF1493]/30" />}

          <div className="relative z-10 flex flex-col items-center gap-5 md:gap-7 landscape:gap-4">

            {/* Player badge */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">På teppet</p>
              <span
                className="rounded-full px-5 py-2 text-lg font-black text-white"
                style={{ backgroundColor: colorWithAlpha(accent, 0.35, 'rgba(255,255,255,0.2)') }}
              >
                {player}
              </span>
            </div>

            {/* Question */}
            <p className="break-words text-center text-2xl font-semibold leading-snug text-white sm:text-3xl landscape:text-xl [overflow-wrap:anywhere]">
              {segments.map((seg, i) =>
                seg.type === 'player' ? (
                  <mark key={i} className={cn(
                    'mx-0.5 inline-block rounded-full px-2.5 py-0.5 align-baseline font-black not-italic shadow-sm',
                    athina ? 'bg-white text-[#FF1493]' : 'bg-white/30 text-white'
                  )}>
                    {seg.name}
                  </mark>
                ) : <span key={i}>{seg.text}</span>
              )}
            </p>

            {phase === 'challenge' && (
              <button
                onClick={() => setPhase('voting')}
                className={primaryActionClass}
              >
                Start stemming →
              </button>
            )}

            {phase === 'voting' && (
              <div className="flex w-full flex-col items-center gap-4">
                <p className="text-center text-sm text-white/70">
                  <span className="font-black text-white">{player}</span> svarte — tror dere på det?
                </p>
                {otherCount > 0 ? (
                  <>
                    <div className="flex w-full gap-2">
                      <button
                        onClick={() => setBelievers(n => n + 1)}
                        className="flex-1 rounded-2xl bg-green-500/20 py-3 text-sm font-black text-green-300 transition-all hover:bg-green-500/30 active:scale-95"
                      >
                        👍 Tror det
                        {believers > 0 && <span className="ml-1.5 opacity-70">({believers})</span>}
                      </button>
                      <button
                        onClick={() => setDoubters(n => n + 1)}
                        className="flex-1 rounded-2xl bg-red-500/20 py-3 text-sm font-black text-red-300 transition-all hover:bg-red-500/30 active:scale-95"
                      >
                        👎 Tviler
                        {doubters > 0 && <span className="ml-1.5 opacity-70">({doubters})</span>}
                      </button>
                    </div>
                    <p className="text-xs text-white/50">
                      {believers + doubters} av {otherCount} har stemt
                    </p>
                    <button
                      onClick={() => setPhase('result')}
                      disabled={believers + doubters === 0}
                      className={cn(primaryActionClass, 'disabled:opacity-40')}
                    >
                      Se resultat →
                    </button>
                  </>
                ) : (
                  <button onClick={() => setPhase('result')} className={primaryActionClass}>
                    Ferdig →
                  </button>
                )}
              </div>
            )}

            {phase === 'result' && (
              <div className="flex w-full flex-col items-center gap-4 text-center">
                {majorityDoubts ? (
                  <>
                    <p className="text-4xl landscape:text-3xl">🤥</p>
                    <p className="text-xl font-black text-white">Ingen trodde på deg!</p>
                    <p className="text-sm text-white/70">
                      <span className="font-black text-white">{player}</span> drikker
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-4xl landscape:text-3xl">✅</p>
                    <p className="text-xl font-black text-white">Trodd!</p>
                    <p className="text-sm text-white/70">
                      <span className="font-black text-white">{player}</span> slipper unna
                    </p>
                  </>
                )}

                {finalSips > 0 && (
                  <p className="flex items-center gap-2 text-2xl font-black text-white">
                    <Droplets className="h-6 w-6" />{formatSips(finalSips)}
                  </p>
                )}
                <button onClick={onNext} className={primaryActionClass}>Neste kort →</button>
              </div>
            )}

          </div>
        </div>

        {phase !== 'result' && (
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold text-white/75 shadow-sm backdrop-blur-sm">
            <Droplets className="h-4 w-4 shrink-0" />
            {formatSips(sips)}
          </span>
        )}
      </div>
    </div>
  )
}
