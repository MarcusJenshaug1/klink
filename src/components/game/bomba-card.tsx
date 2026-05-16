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

  const [holderIdx, setHolderIdx] = useState(startIdx)
  const [exploded, setExploded] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setHolderIdx(hasPlayers ? seedIndex(card.id, players.length) : 0)
    setExploded(false)
    // Hidden random countdown: 15–45 seconds
    const delay = Math.floor(Math.random() * 30_000) + 15_000
    timeoutRef.current = setTimeout(() => setExploded(true), delay)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [card.id, hasPlayers, players.length])

  const pass = () => {
    if (!hasPlayers || exploded) return
    setHolderIdx(i => (i + 1) % players.length)
  }

  const holder = hasPlayers ? players[holderIdx] : null
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

          <div className="relative z-10 flex flex-col items-center gap-5 md:gap-7 landscape:gap-4">

            {!exploded ? (
              <>
                {/* Bomb */}
                <div className={cn('text-7xl landscape:text-5xl select-none', !exploded && 'animate-pulse')}>
                  💣
                </div>

                {/* Card text (optional flavour) */}
                {card.innhold && (
                  <p className="break-words text-center text-lg font-semibold leading-snug text-white/90 [overflow-wrap:anywhere]">
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

                {/* Current holder */}
                {holder && (
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60">Holder bomba</p>
                    <span
                      className="rounded-full px-5 py-2 text-xl font-black text-white"
                      style={{ backgroundColor: colorWithAlpha(accent, 0.35, 'rgba(255,255,255,0.2)') }}
                    >
                      {holder}
                    </span>
                  </div>
                )}

                <button
                  onClick={pass}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-black shadow-lg transition-all hover:opacity-95 active:scale-[0.98] landscape:py-3',
                    athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
                  )}
                >
                  Send videre 💣
                </button>
              </>
            ) : (
              /* Exploded */
              <>
                <div className="text-7xl landscape:text-5xl select-none">💥</div>
                <p className="text-center text-2xl font-black text-white">BOOM!</p>

                {holder && (
                  <div className="flex flex-col items-center gap-2">
                    <span className={cn(
                      'rounded-full px-6 py-2.5 text-2xl font-black',
                      athina ? 'bg-white text-[#FF1493]' : 'bg-white text-forest'
                    )}>
                      {holder}
                    </span>
                    <p className="flex items-center gap-2 text-xl font-black text-white">
                      <Droplets className="h-5 w-5" />
                      {formatSips(sips)}
                    </p>
                  </div>
                )}

                <button onClick={onNext} className={primaryActionClass}>
                  Neste kort →
                </button>
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
