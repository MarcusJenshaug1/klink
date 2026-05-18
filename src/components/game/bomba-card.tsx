'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Droplets } from 'lucide-react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { interpolateToSegments } from '@/lib/game/interpolate'
import { getSips, formatSips, replaceSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface BombaCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

function seedIndex(id: string, len: number): number {
  const hash = id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)
  return Math.abs(hash) % len
}

export function BombaCard({ card, pack, players, intensitet, korttyper, onNext }: BombaCardProps) {
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

  const segments = useMemo(() => {
    const raw = interpolateToSegments(card.innhold, players)
    return raw.map(seg =>
      seg.type === 'text' ? { ...seg, text: replaceSips(seg.text, sips) } : seg
    )
  }, [card.innhold, players, sips])

  const hasPlayers = players.length > 0
  const startIdx = hasPlayers ? seedIndex(card.id, players.length) : 0

  type Phase = 'ready' | 'counting' | 'exploded'
  const [phase, setPhase] = useState<Phase>('ready')
  const [holderIdx, setHolderIdx] = useState(startIdx)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setPhase('ready')
    setHolderIdx(hasPlayers ? seedIndex(card.id, players.length) : 0)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [card.id, hasPlayers, players.length])

  const startBomb = () => {
    if (!hasPlayers) return
    setPhase('counting')
    // Skjult random countdown: 15–45 sek
    const delay = Math.floor(Math.random() * 30_000) + 15_000
    timeoutRef.current = setTimeout(() => setPhase('exploded'), delay)
  }

  const pass = () => {
    if (!hasPlayers || phase !== 'counting') return
    setHolderIdx(i => (i + 1) % players.length)
  }

  const exploded = phase === 'exploded'

  const holder = hasPlayers ? players[holderIdx] : null
  const accent = athina ? '#FF1493' : meta.farge ?? pack.farge
  const primaryActionClass = cn(
    'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-base shadow-lg transition-all hover:opacity-95 active:scale-[0.98] landscape:py-2.5 landscape:text-sm',
    athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
  )

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
            'relative flex max-h-[calc(100dvh-13.5rem)] w-full flex-col gap-5 overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-md sm:p-7 md:gap-7 md:p-10 landscape:max-h-[calc(100dvh-6rem)] landscape:gap-3 landscape:rounded-2xl landscape:p-4',
            athina ? 'border-white/30 bg-white/18' : 'border-white/25 bg-white/18'
          )}
          style={{
            boxShadow: exploded
              ? '0 0 0 3px rgba(220,38,38,0.7), 0 24px 45px rgba(0,0,0,0.24)'
              : athina
                ? '0 0 0 2px rgba(255,215,0,0.35), 0 24px 45px rgba(0,0,0,0.16)'
                : '0 24px 45px rgba(0,0,0,0.16)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: exploded ? '#dc2626' : accent }} />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28"
            style={{ background: `linear-gradient(180deg, ${colorWithAlpha(exploded ? '#dc2626' : accent, 0.24, 'rgba(255,255,255,0.14)')}, transparent)` }}
          />
          {athina && <div className="pointer-events-none absolute inset-0 bg-[#FF1493]/30" />}

          {/* I landscape: 2-kolonne grid (emoji venstre, info+CTA høyre). I portrait: stacked. */}
          <div className="relative z-10 flex flex-col items-center gap-5 md:gap-7 landscape:flex-row landscape:items-center landscape:gap-5">

            {phase === 'ready' ? (
              <>
                {/* Venstre i landscape: bomb + tekst */}
                <div className="flex flex-col items-center gap-3 landscape:shrink-0 landscape:basis-1/3">
                  <div className="text-7xl landscape:text-6xl select-none">
                    💣
                  </div>
                </div>

                {/* Høyre i landscape: instruks + start-CTA */}
                <div className="flex w-full flex-col items-center gap-3 landscape:flex-1 landscape:items-stretch landscape:gap-2 landscape:min-w-0">
                  <p className="text-center text-xl font-black text-white landscape:text-left landscape:text-lg">
                    Bomba tikker — send videre!
                  </p>
                  <p className="text-center text-sm text-white/80 leading-snug landscape:text-xs landscape:text-left">
                    Trykk Start. Send mobilen videre rundt bordet. Den som holder bomba når den går av, drikker {formatSips(sips)}.
                  </p>
                  {card.innhold && (
                    <p className="break-words text-center text-sm font-semibold leading-snug text-white/85 [overflow-wrap:anywhere] landscape:text-left">
                      {segments.map((seg, i) =>
                        seg.type === 'player' ? (
                          <mark key={i} className={cn(
                            'mx-0.5 inline-block rounded-full px-2 py-0.5 align-baseline font-black not-italic',
                            athina ? 'bg-white text-[#FF1493]' : 'bg-white/30 text-white'
                          )}>
                            {seg.name}
                          </mark>
                        ) : <span key={i}>{seg.text}</span>
                      )}
                    </p>
                  )}
                  <button
                    onClick={startBomb}
                    disabled={!hasPlayers}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-black shadow-lg transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 landscape:py-2.5',
                      athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
                    )}
                  >
                    Start bomba 💣
                  </button>
                </div>
              </>
            ) : phase === 'counting' ? (
              <>
                {/* Venstre kolonne i landscape: emoji + status */}
                <div className="flex flex-col items-center gap-3 landscape:shrink-0 landscape:basis-1/3">
                  <div className="text-7xl landscape:text-6xl select-none animate-pulse">
                    💣
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-300 animate-pulse" />
                    Bombe aktiv
                  </span>
                </div>

                {/* Høyre kolonne i landscape: tekst + holder + CTA */}
                <div className="flex w-full flex-col items-center gap-4 landscape:flex-1 landscape:items-stretch landscape:gap-2 landscape:min-w-0">
                  {card.innhold && (
                    <p className="break-words text-center text-lg font-semibold leading-snug text-white/90 [overflow-wrap:anywhere] landscape:text-sm landscape:text-left">
                      {segments.map((seg, i) =>
                        seg.type === 'player' ? (
                          <mark key={i} className={cn(
                            'mx-0.5 inline-block rounded-full px-2.5 py-0.5 align-baseline font-black not-italic',
                            athina ? 'bg-white text-[#FF1493]' : 'bg-white/30 text-white'
                          )}>
                            {seg.name}
                          </mark>
                        ) : <span key={i}>{seg.text}</span>
                      )}
                    </p>
                  )}

                  {holder && (
                    <div className="flex flex-col items-center gap-1 landscape:items-start">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/60">Holder bomba</p>
                      <span
                        className="rounded-full px-5 py-2 text-xl font-black text-white landscape:text-lg landscape:py-1.5"
                        style={{ backgroundColor: colorWithAlpha(accent, 0.35, 'rgba(255,255,255,0.2)') }}
                      >
                        {holder}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={pass}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-black shadow-lg transition-all hover:opacity-95 active:scale-[0.98] landscape:py-2.5 landscape:text-base',
                      athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
                    )}
                  >
                    Send videre 💣
                  </button>
                </div>
              </>
            ) : (
              /* Exploded */
              <>
                <div className="flex flex-col items-center gap-3 landscape:flex-row landscape:gap-5 landscape:w-full">
                  <div className="text-7xl landscape:text-6xl select-none">💥</div>
                  <div className="flex flex-col items-center gap-2 landscape:items-start landscape:flex-1">
                    <p className="text-center text-2xl font-black text-white landscape:text-left">BOOM!</p>
                    {holder && (
                      <>
                        <span className={cn(
                          'rounded-full px-6 py-2.5 text-2xl font-black landscape:text-xl landscape:py-1.5',
                          athina ? 'bg-white text-[#FF1493]' : 'bg-white text-forest'
                        )}>
                          {holder}
                        </span>
                        <p className="flex items-center gap-2 text-xl font-black text-white">
                          <Droplets className="h-5 w-5" />
                          {formatSips(sips)}
                        </p>
                      </>
                    )}
                    <button onClick={onNext} className={cn(primaryActionClass, 'landscape:w-auto landscape:px-6')}>
                      Neste kort →
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {!exploded && (
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold text-white/75 shadow-sm backdrop-blur-sm">
            <Droplets className="h-4 w-4 shrink-0" />
            {formatSips(sips)}
          </span>
        )}
      </div>
    </div>
  )
}
