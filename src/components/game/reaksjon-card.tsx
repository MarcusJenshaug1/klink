'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Check, Droplets } from 'lucide-react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { getSips, formatSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface ReaksjonsCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

type Phase = 'intro' | 'arming' | 'waiting' | 'go' | 'result'

function seedTwo(id: string, len: number): [number, number] {
  const h1 = id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)
  const h2 = (id + 'x').split('').reduce((acc, c) => (acc * 37 + c.charCodeAt(0)) | 0, 0)
  const i1 = Math.abs(h1) % len
  let i2 = Math.abs(h2) % len
  if (i2 === i1) i2 = (i1 + 1) % len
  return [i1, i2]
}

export function ReaksjonsCard({ card, pack, players, intensitet, korttyper, onNext }: ReaksjonsCardProps) {
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

  const [phase, setPhase] = useState<Phase>('intro')
  const [p1Ready, setP1Ready] = useState(false)
  const [p2Ready, setP2Ready] = useState(false)
  const [p1TapMs, setP1TapMs] = useState<number | null>(null)
  const [p2TapMs, setP2TapMs] = useState<number | null>(null)
  const goTimeRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setPhase('intro')
    setP1Ready(false)
    setP2Ready(false)
    setP1TapMs(null)
    setP2TapMs(null)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [card.id])

  // Når begge har trykket «Klar», start nedtellingen.
  useEffect(() => {
    if (phase === 'arming' && p1Ready && p2Ready) {
      setPhase('waiting')
      const delay = Math.floor(Math.random() * 3000) + 1500
      timeoutRef.current = setTimeout(() => {
        goTimeRef.current = Date.now()
        setPhase('go')
      }, delay)
    }
  }, [phase, p1Ready, p2Ready])

  // Bytt til resultat når begge har trykket etter «GO».
  useEffect(() => {
    if (p1TapMs !== null && p2TapMs !== null) {
      setPhase('result')
    }
  }, [p1TapMs, p2TapMs])

  const armUp = () => {
    setPhase('arming')
  }

  const handleTap = (side: 'p1' | 'p2') => {
    if (phase === 'arming') {
      if (side === 'p1') setP1Ready(true)
      if (side === 'p2') setP2Ready(true)
      return
    }
    if (phase === 'go') {
      const ms = Date.now() - goTimeRef.current
      if (side === 'p1' && p1TapMs === null) setP1TapMs(ms)
      if (side === 'p2' && p2TapMs === null) setP2TapMs(ms)
      return
    }
    // Tyvstart i waiting → automatisk tap (4 sek straffe).
    if (phase === 'waiting') {
      if (side === 'p1' && p1TapMs === null) setP1TapMs(99_999)
      if (side === 'p2' && p2TapMs === null) setP2TapMs(99_999)
    }
  }

  const winnerName = p1TapMs !== null && p2TapMs !== null
    ? (p1TapMs <= p2TapMs ? p1 : p2)
    : null
  const loserName = winnerName === p1 ? p2 : p1
  const winnerMs = winnerName === p1 ? p1TapMs : p2TapMs
  const loserMs = winnerName === p1 ? p2TapMs : p1TapMs

  const accent = athina ? '#FF1493' : meta.farge ?? pack.farge
  const primaryActionClass = cn(
    'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-base shadow-lg transition-all hover:opacity-95 active:scale-[0.98] landscape:py-2.5 landscape:text-sm',
    athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
  )

  // Split-screen vises i alle interaktive faser (arming + waiting + go).
  const showSplitScreen = phase === 'arming' || phase === 'waiting' || phase === 'go'

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-[calc(env(safe-area-inset-top)_+_4.25rem)] pb-[calc(env(safe-area-inset-bottom)_+_6.75rem)] transition-colors duration-700 sm:px-5 landscape:px-10 landscape:pt-10 landscape:pb-14"
      style={{ backgroundColor: athina ? 'transparent' : pack.farge }}
    >
      {showSplitScreen && (
        <div className="fixed inset-0 z-40 flex">
          {/* P1 venstre side */}
          <ReaksjonsSide
            phase={phase}
            name={p1}
            ready={p1Ready}
            tapMs={p1TapMs}
            onTap={() => handleTap('p1')}
          />
          <div className="w-1 bg-black/25" />
          {/* P2 høyre side */}
          <ReaksjonsSide
            phase={phase}
            name={p2}
            ready={p2Ready}
            tapMs={p2TapMs}
            onTap={() => handleTap('p2')}
          />
        </div>
      )}

      {(phase === 'intro' || phase === 'result') && (
        <div className="flex min-h-0 w-full max-w-sm flex-col items-center gap-3 md:max-w-xl md:gap-5 lg:max-w-2xl xl:max-w-3xl landscape:max-w-3xl landscape:gap-2 lg:landscape:max-w-4xl">

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

          <div
            className={cn(
              'relative flex max-h-[calc(100dvh-13.5rem)] w-full flex-col overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-md landscape:max-h-[calc(100dvh-6rem)] landscape:rounded-2xl',
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

            {phase === 'intro' && (
              <div className="relative z-10 flex flex-col items-center gap-5 p-6 sm:p-7 md:p-10 landscape:flex-row landscape:items-center landscape:gap-5 landscape:p-4">
                {/* Venstre i landscape: emoji + tittel + VS */}
                <div className="flex flex-col items-center gap-3 landscape:flex-1 landscape:gap-2">
                  <p className="text-center text-3xl landscape:text-2xl">⚡️</p>
                  <p className="text-center text-xl font-black text-white landscape:text-lg">Reaksjonstest!</p>
                  <div className="flex w-full items-center justify-center gap-3 landscape:gap-2">
                    <span className={cn(
                      'flex-1 truncate rounded-2xl px-3 py-2.5 text-center text-sm font-black text-white landscape:py-1.5 landscape:text-xs',
                      athina ? 'bg-white/20' : 'bg-white/15'
                    )}>
                      {p1}
                    </span>
                    <span className="text-sm font-black text-white/40">VS</span>
                    <span className={cn(
                      'flex-1 truncate rounded-2xl px-3 py-2.5 text-center text-sm font-black text-white landscape:py-1.5 landscape:text-xs',
                      athina ? 'bg-white/20' : 'bg-white/15'
                    )}>
                      {p2}
                    </span>
                  </div>
                </div>
                {/* Høyre i landscape: instruks + knapp */}
                <div className="flex w-full flex-col items-center gap-3 landscape:flex-1 landscape:gap-3 landscape:items-stretch">
                  <p className="text-center text-sm text-white/70 landscape:text-xs landscape:text-left">
                    Begge legger en finger på sin side. Trykk «Klar» når dere er klare — så starter nedtellingen.
                  </p>
                  <button onClick={armUp} className={cn(primaryActionClass, 'landscape:py-2.5 landscape:text-sm')}>
                    Gjør klar →
                  </button>
                </div>
              </div>
            )}

            {phase === 'result' && winnerName && (
              <div className="relative z-10 flex flex-col items-center gap-5 p-6 sm:p-7 md:p-10 landscape:p-5 text-center">
                <p className="text-3xl landscape:text-2xl">⚡️</p>
                <div className="flex w-full gap-3">
                  <div className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-green-400/40 bg-green-500/25 p-4">
                    <p className="text-2xl">🏆</p>
                    <p className="text-base font-black text-white">{winnerName}</p>
                    <p className="text-xs text-white/50">
                      {winnerMs && winnerMs < 99_999 ? `${(winnerMs / 1000).toFixed(3)}s` : 'Tyvstart!'}
                    </p>
                    <p className="text-xs font-black text-green-300">Raskest!</p>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/20 p-4">
                    <p className="text-2xl">🍺</p>
                    <p className="text-base font-black text-white">{loserName}</p>
                    <p className="text-xs text-white/50">
                      {loserMs && loserMs < 99_999 ? `${(loserMs / 1000).toFixed(3)}s` : 'Tyvstart!'}
                    </p>
                    <p className="flex items-center gap-1 text-xs font-black text-red-300">
                      <Droplets className="h-3.5 w-3.5" />{formatSips(sips)}
                    </p>
                  </div>
                </div>
                <button onClick={onNext} className={primaryActionClass}>Neste kort →</button>
              </div>
            )}
          </div>

          {phase === 'intro' && (
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold text-white/75 shadow-sm backdrop-blur-sm">
              <Droplets className="h-4 w-4 shrink-0" />
              {formatSips(sips)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

interface SideProps {
  phase: Phase
  name: string
  ready: boolean
  tapMs: number | null
  onTap: () => void
}

function ReaksjonsSide({ phase, name, ready, tapMs, onTap }: SideProps) {
  const disabled = phase === 'go' && tapMs !== null
  const bg =
    phase === 'arming'
      ? ready ? 'bg-emerald-700' : 'bg-amber-500'
      : phase === 'go'
        ? tapMs !== null ? 'bg-green-700' : 'bg-green-500'
        : 'bg-red-600'

  return (
    <button
      onClick={onTap}
      disabled={disabled}
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-4 select-none transition-colors duration-300 active:brightness-110',
        bg
      )}
    >
      <p className={cn(
        'text-6xl transition-all duration-200 landscape:text-5xl',
        tapMs !== null ? 'scale-110'
        : phase === 'go' ? 'animate-pulse'
        : phase === 'arming' && ready ? 'scale-110'
        : phase === 'waiting' ? 'opacity-60'
        : ''
      )}>
        {tapMs !== null ? (tapMs >= 99_999 ? '🍺' : '✓')
          : phase === 'go' ? '⚡'
          : phase === 'arming' ? (ready ? '✓' : '👆')
          : '🔴'}
      </p>
      <p className="text-2xl font-black text-white landscape:text-xl">{name}</p>
      <p className={cn(
        'text-base font-bold uppercase tracking-wider landscape:text-sm',
        tapMs !== null ? 'text-white/60'
        : phase === 'go' ? 'animate-pulse text-white'
        : phase === 'arming' && ready ? 'text-white/85'
        : 'text-white/85'
      )}>
        {tapMs !== null ? (tapMs >= 99_999 ? 'Tyvstart!' : 'Trykket!')
          : phase === 'arming' ? (ready ? 'Klar' : 'Trykk «Klar»')
          : phase === 'go' ? 'TRYKK!'
          : 'Vent…'}
      </p>
      {phase === 'arming' && ready && (
        <Check className="h-6 w-6 text-white/70" />
      )}
    </button>
  )
}
