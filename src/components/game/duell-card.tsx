'use client'

import { useState, useEffect, useMemo } from 'react'
import { Droplets } from 'lucide-react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { getSips, formatSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface DuellCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

type SSP = 'stein' | 'saks' | 'papir'
type Phase = 'p1' | 'handoff' | 'p2' | 'result'

const SSP_OPTIONS: { value: SSP; emoji: string; label: string }[] = [
  { value: 'stein', emoji: '🪨', label: 'Stein' },
  { value: 'saks',  emoji: '✂️', label: 'Saks' },
  { value: 'papir', emoji: '📄', label: 'Papir' },
]

function sspResult(a: SSP, b: SSP): 'a' | 'b' | 'draw' {
  if (a === b) return 'draw'
  if (
    (a === 'stein' && b === 'saks') ||
    (a === 'saks' && b === 'papir') ||
    (a === 'papir' && b === 'stein')
  ) return 'a'
  return 'b'
}

function seedTwo(id: string, len: number): [number, number] {
  const h1 = id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)
  const h2 = (id + 'x').split('').reduce((acc, c) => (acc * 37 + c.charCodeAt(0)) | 0, 0)
  const i1 = Math.abs(h1) % len
  let i2 = Math.abs(h2) % len
  if (i2 === i1) i2 = (i1 + 1) % len
  return [i1, i2]
}

export function DuellCard({ card, pack, players, intensitet, korttyper, onNext }: DuellCardProps) {
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

  const [p1idx, p2idx] = players.length >= 2 ? seedTwo(card.id, players.length) : [0, 1]
  const p1 = players[p1idx] ?? 'Spiller 1'
  const p2 = players[p2idx] ?? 'Spiller 2'

  const [phase, setPhase] = useState<Phase>('p1')
  const [p1choice, setP1choice] = useState<SSP | null>(null)
  const [p2choice, setP2choice] = useState<SSP | null>(null)

  useEffect(() => {
    setPhase('p1')
    setP1choice(null)
    setP2choice(null)
  }, [card.id])

  const accent = athina ? '#FF1493' : meta.farge ?? pack.farge
  const primaryActionClass = cn(
    'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-base shadow-lg transition-all hover:opacity-95 active:scale-[0.98] landscape:py-2.5 landscape:text-sm',
    athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
  )

  const winner = p1choice && p2choice ? sspResult(p1choice, p2choice) : null
  const loser = winner === 'a' ? p2 : winner === 'b' ? p1 : null

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-[calc(env(safe-area-inset-top)_+_4.25rem)] pb-[calc(env(safe-area-inset-bottom)_+_6.75rem)] transition-colors duration-700 sm:px-5 landscape:px-10 landscape:pt-10 landscape:pb-14"
      style={{ backgroundColor: athina ? 'transparent' : pack.farge }}
    >
      <div className="flex min-h-0 w-full max-w-sm flex-col items-center gap-3 md:max-w-xl md:gap-5 lg:max-w-2xl xl:max-w-3xl landscape:max-w-3xl landscape:gap-2 lg:landscape:max-w-4xl">

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
            'relative flex max-h-[calc(100dvh-13.5rem)] w-full flex-col gap-5 overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-md sm:p-7 md:gap-7 md:p-10 landscape:max-h-[calc(100dvh-6rem)] landscape:gap-2 landscape:rounded-2xl landscape:p-4',
            athina ? 'border-white/30 bg-white/18' : 'border-white/25 bg-white/18'
          )}
          style={{
            boxShadow: athina
              ? '0 0 0 2px rgba(255,215,0,0.35), 0 24px 45px rgba(0,0,0,0.16)'
              : '0 24px 45px rgba(0,0,0,0.16)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: accent }} />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28"
            style={{ background: `linear-gradient(180deg, ${colorWithAlpha(accent, 0.24, 'rgba(255,255,255,0.14)')}, transparent)` }}
          />
          {athina && <div className="pointer-events-none absolute inset-0 bg-[#FF1493]/30" />}

          <div className="relative z-10 flex flex-col items-center gap-5 md:gap-6 landscape:gap-2">

            {/* VS header */}
            <div className="flex w-full items-center justify-between gap-2 text-center">
              <span className={cn(
                'flex-1 truncate rounded-2xl px-3 py-2 text-base font-black text-white transition-all landscape:py-1 landscape:text-sm',
                phase === 'p1' ? 'ring-2 ring-white/60' : 'opacity-60',
                athina ? 'bg-white/20' : 'bg-white/15'
              )}>
                {p1}
              </span>
              <span className="shrink-0 text-lg font-black text-white/50 landscape:text-sm">VS</span>
              <span className={cn(
                'flex-1 truncate rounded-2xl px-3 py-2 text-base font-black text-white transition-all landscape:py-1 landscape:text-sm',
                phase === 'p2' ? 'ring-2 ring-white/60' : 'opacity-60',
                athina ? 'bg-white/20' : 'bg-white/15'
              )}>
                {p2}
              </span>
            </div>

            {phase === 'p1' && (
              <>
                <p className="text-center text-sm font-bold text-white/70 landscape:text-xs">
                  {p1}, velg — ikke la {p2} se! 🙈
                </p>
                <div className="flex w-full justify-center gap-3 landscape:gap-2">
                  {SSP_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setP1choice(opt.value); setPhase('handoff') }}
                      className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white/15 py-4 text-3xl transition-all hover:bg-white/25 active:scale-95 landscape:py-2 landscape:text-2xl landscape:flex-row landscape:justify-center landscape:gap-2"
                    >
                      <span>{opt.emoji}</span>
                      <span className="text-xs font-bold text-white/80 landscape:text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {phase === 'handoff' && (
              <div className="flex flex-col items-center gap-4 text-center landscape:flex-row landscape:gap-5 landscape:text-left">
                <p className="text-4xl landscape:text-3xl">🤝</p>
                <div className="flex flex-col items-center gap-2 landscape:flex-1 landscape:items-stretch landscape:gap-1.5">
                  <p className="text-lg font-black text-white landscape:text-base">{p1} har valgt!</p>
                  <p className="text-sm text-white/70 landscape:text-xs">Gi telefonen til {p2}</p>
                  <button onClick={() => setPhase('p2')} className={cn(primaryActionClass, 'landscape:py-2 landscape:text-sm')}>
                    {p2} er klar →
                  </button>
                </div>
              </div>
            )}

            {phase === 'p2' && (
              <>
                <p className="text-center text-sm font-bold text-white/70 landscape:text-xs">
                  {p2}, velg ditt trekk!
                </p>
                <div className="flex w-full justify-center gap-3 landscape:gap-2">
                  {SSP_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setP2choice(opt.value); setPhase('result') }}
                      className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white/15 py-4 text-3xl transition-all hover:bg-white/25 active:scale-95 landscape:py-2 landscape:text-2xl landscape:flex-row landscape:justify-center landscape:gap-2"
                    >
                      <span>{opt.emoji}</span>
                      <span className="text-xs font-bold text-white/80 landscape:text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {phase === 'result' && p1choice && p2choice && (
              <div className="flex w-full flex-col items-center gap-4 text-center landscape:flex-row landscape:items-center landscape:gap-5 landscape:text-left">
                {/* Reveal */}
                <div className="flex w-full items-center justify-between gap-2 landscape:basis-1/2">
                  <div className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs font-bold text-white/60">{p1}</span>
                    <span className="text-4xl landscape:text-3xl">{SSP_OPTIONS.find(o => o.value === p1choice)?.emoji}</span>
                  </div>
                  <span className="text-xl font-black text-white/50 landscape:text-base">VS</span>
                  <div className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs font-bold text-white/60">{p2}</span>
                    <span className="text-4xl landscape:text-3xl">{SSP_OPTIONS.find(o => o.value === p2choice)?.emoji}</span>
                  </div>
                </div>

                {/* Resultat + CTA */}
                <div className="flex w-full flex-col items-center gap-3 landscape:flex-1 landscape:items-stretch landscape:gap-1.5 landscape:min-w-0">
                  {winner === 'draw' ? (
                    <p className="text-xl font-black text-white landscape:text-base">Uavgjort! Omspill!</p>
                  ) : (
                    <>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/60">Drikker</p>
                      <span className={cn(
                        'inline-block rounded-full px-6 py-2.5 text-2xl font-black text-center landscape:text-lg landscape:py-1.5',
                        athina ? 'bg-white text-[#FF1493]' : 'bg-white text-forest'
                      )}>
                        {loser}
                      </span>
                      <p className="flex items-center justify-center gap-2 text-2xl font-black text-white landscape:text-lg landscape:justify-start">
                        <Droplets className="h-6 w-6 landscape:h-5 landscape:w-5" />
                        {formatSips(sips)}
                      </p>
                    </>
                  )}

                  {winner === 'draw' ? (
                    <button onClick={() => { setPhase('p1'); setP1choice(null); setP2choice(null) }} className={cn(primaryActionClass, 'landscape:py-2 landscape:text-sm')}>
                      Spill igjen →
                    </button>
                  ) : (
                    <button onClick={onNext} className={cn(primaryActionClass, 'landscape:py-2 landscape:text-sm')}>
                      Neste kort →
                    </button>
                  )}
                </div>
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
