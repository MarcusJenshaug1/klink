'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Droplets, Timer } from 'lucide-react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { interpolateToSegments } from '@/lib/game/interpolate'
import { getSips, formatSips, replaceSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface KategoriCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

const TURN_MS = 5000

function seedIndex(id: string, len: number): number {
  const hash = id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)
  return Math.abs(hash) % len
}

export function KategoriCard({ card, pack, players, intensitet, korttyper, onNext }: KategoriCardProps) {
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

  const [currentIdx, setCurrentIdx] = useState(startIdx)
  const [loser, setLoser] = useState<string | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [remaining, setRemaining] = useState(TURN_MS)
  const turnStartRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setTimerRunning(false)
  }

  const startTimerFor = (idx: number) => {
    stopTimer()
    if (!hasPlayers) return
    turnStartRef.current = Date.now()
    setRemaining(TURN_MS)
    setTimerRunning(true)
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - (turnStartRef.current ?? Date.now())
      const left = Math.max(0, TURN_MS - elapsed)
      setRemaining(left)
      if (left <= 0) {
        stopTimer()
        setLoser(players[idx])
      }
    }, 50)
  }

  useEffect(() => {
    setCurrentIdx(hasPlayers ? seedIndex(card.id, players.length) : 0)
    setLoser(null)
    setRemaining(TURN_MS)
    return () => stopTimer()
  }, [card.id, hasPlayers, players.length])

  const currentPlayer = hasPlayers ? players[currentIdx] : null
  const accent = athina ? '#FF1493' : meta.farge ?? pack.farge

  const handleStart = () => {
    startTimerFor(currentIdx)
  }

  const nextPlayer = () => {
    if (!hasPlayers) return
    const nextIdx = (currentIdx + 1) % players.length
    setCurrentIdx(nextIdx)
    startTimerFor(nextIdx)
  }

  const handleFail = () => {
    stopTimer()
    if (currentPlayer) setLoser(currentPlayer)
  }

  const primaryActionClass = cn(
    'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-base shadow-lg transition-all hover:opacity-95 active:scale-[0.98] landscape:py-2.5 landscape:text-sm',
    athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
  )

  const pctRemaining = (remaining / TURN_MS) * 100
  const remainingSec = Math.ceil(remaining / 1000)
  const lowTime = remaining <= 1500

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

          {/* I landscape: 2-kolonne (kategori venstre, interaksjon høyre). Portrait: stacked. */}
          <div className="relative z-10 flex flex-col gap-5 md:gap-7 landscape:flex-row landscape:items-center landscape:gap-5">

            {/* Venstre i landscape: kategori-tekst */}
            <p className="break-words text-center text-3xl font-semibold leading-snug text-white sm:text-4xl md:text-5xl landscape:text-xl landscape:text-left landscape:flex-1 [overflow-wrap:anywhere]">
              {segments.map((seg, i) =>
                seg.type === 'player' ? (
                  <mark key={i} className={cn(
                    'mx-0.5 inline-block rounded-full px-2.5 py-0.5 align-baseline font-black not-italic shadow-sm',
                    athina ? 'bg-white text-[#FF1493]' : 'bg-white/30 text-white'
                  )}>
                    {seg.name}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </p>

            {/* Høyre i landscape: spiller-info + timer + knapper */}
            <div className="flex flex-col gap-4 landscape:flex-1 landscape:gap-2 landscape:min-w-0">
              {loser === null ? (
                <>
                  {currentPlayer && (
                    <div className="flex flex-col items-center gap-1 landscape:gap-0.5">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/60">Din tur — 5 sek</p>
                      <span
                        className="rounded-full px-6 py-2.5 text-xl font-black text-white landscape:text-base landscape:py-1.5"
                        style={{ backgroundColor: colorWithAlpha(accent, 0.35, 'rgba(255,255,255,0.2)') }}
                      >
                        {currentPlayer}
                      </span>
                    </div>
                  )}

                  {timerRunning && (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-[width] ease-linear',
                            lowTime ? 'bg-red-500' : 'bg-white/80'
                          )}
                          style={{ width: `${pctRemaining}%`, transitionDuration: '60ms' }}
                        />
                      </div>
                      <p className={cn(
                        'flex items-center gap-1 text-sm font-black tabular-nums',
                        lowTime ? 'text-red-200 animate-pulse' : 'text-white/80'
                      )}>
                        <Timer className="w-3.5 h-3.5" />
                        {remainingSec}s
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    {!timerRunning ? (
                      <button onClick={handleStart} className={cn(primaryActionClass, 'landscape:py-2 landscape:text-sm')}>
                        <Timer className="w-5 h-5 landscape:w-4 landscape:h-4" />
                        Start 5-sek timer
                      </button>
                    ) : (
                      <>
                        {hasPlayers && players.length > 1 && (
                          <button onClick={nextPlayer} className={cn(primaryActionClass, 'landscape:py-2 landscape:text-sm')}>
                            Klarte det! →
                          </button>
                        )}
                        <button
                          onClick={handleFail}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/80 py-3.5 text-base font-black text-white shadow-lg transition-all hover:bg-red-500 active:scale-[0.98] landscape:py-2 landscape:text-sm"
                        >
                          Bommet! 🍺
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center landscape:gap-1.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60">Drikker</p>
                  <span className={cn(
                    'rounded-full px-6 py-2.5 text-2xl font-black landscape:text-lg landscape:py-1.5',
                    athina ? 'bg-white text-[#FF1493]' : 'bg-white text-forest'
                  )}>
                    {loser}
                  </span>
                  <p className="flex items-center gap-2 text-2xl font-black text-white landscape:text-lg">
                    <Droplets className="h-6 w-6 landscape:h-5 landscape:w-5" />
                    {formatSips(sips)}
                  </p>
                  <button onClick={onNext} className={cn(primaryActionClass, 'landscape:py-2 landscape:text-sm')}>
                    Neste kort →
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {loser === null && (
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold text-white/75 shadow-sm backdrop-blur-sm">
            <Droplets className="h-4 w-4 shrink-0" />
            {formatSips(sips)}
          </span>
        )}
      </div>
    </div>
  )
}
