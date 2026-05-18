'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Droplets, Pointer } from 'lucide-react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { interpolateToSegments } from '@/lib/game/interpolate'
import { getSips, formatSips, replaceSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface PekelekCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

type Phase = 'ready' | 'countdown-3' | 'countdown-2' | 'countdown-1' | 'pek' | 'result'

export function PekelekCard({ card, pack, players, intensitet, korttyper, onNext }: PekelekCardProps) {
  const { isActive: athina } = useAthina()
  const reducedMotion = useReducedMotion()
  const meta = getCardTypeMeta(card.type, korttyper)
  const [phase, setPhase] = useState<Phase>('ready')
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

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

  useEffect(() => {
    setPhase('ready')
    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [card.id])

  const startCountdown = () => {
    if (!reducedMotion) {
      try { if (navigator.vibrate) navigator.vibrate(20) } catch {}
    }
    setPhase('countdown-3')
    timeoutsRef.current.push(setTimeout(() => setPhase('countdown-2'), 800))
    timeoutsRef.current.push(setTimeout(() => setPhase('countdown-1'), 1600))
    timeoutsRef.current.push(setTimeout(() => {
      setPhase('pek')
      if (!reducedMotion) {
        try { if (navigator.vibrate) navigator.vibrate([60, 40, 60]) } catch {}
      }
    }, 2400))
    timeoutsRef.current.push(setTimeout(() => setPhase('result'), 3800))
  }

  const accent = athina ? '#FF1493' : meta.farge ?? pack.farge

  const primaryActionClass = cn(
    'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-base shadow-lg transition-all hover:opacity-95 active:scale-[0.98] landscape:py-2.5 landscape:text-sm',
    athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
  )

  const countdownNum =
    phase === 'countdown-3' ? '3' :
    phase === 'countdown-2' ? '2' :
    phase === 'countdown-1' ? '1' : null

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-[calc(env(safe-area-inset-top)_+_4.25rem)] pb-[calc(env(safe-area-inset-bottom)_+_6.75rem)] transition-colors duration-700 sm:px-5 landscape:px-10 landscape:pt-10 landscape:pb-14"
      style={{ backgroundColor: athina ? 'transparent' : pack.farge }}
    >
      {/* Fullskjerm-overlay i countdown og pek */}
      {(countdownNum !== null || phase === 'pek') && (
        <div
          className={cn(
            'fixed inset-0 z-40 flex flex-col items-center justify-center text-white',
            phase === 'pek' ? 'bg-red-600' : 'bg-black/60 backdrop-blur-sm'
          )}
        >
          {countdownNum !== null && (
            <p
              key={phase}
              className="font-display font-black tabular-nums animate-bounce-in"
              style={{ fontSize: '14rem', lineHeight: 1 }}
            >
              {countdownNum}
            </p>
          )}
          {phase === 'pek' && (
            <>
              <Pointer className="w-20 h-20 mb-4 animate-pulse" />
              <p className="text-5xl font-display font-black uppercase tracking-widest">Pek!</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-white/80">Alle peker samtidig</p>
            </>
          )}
        </div>
      )}

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

        {/* Hovedkort */}
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

          <div className="relative z-10 flex flex-col items-center gap-5 md:gap-7 landscape:gap-2">
            <p className="break-words text-center text-2xl font-semibold leading-snug text-white sm:text-3xl md:text-4xl landscape:text-base [overflow-wrap:anywhere]">
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

            <p className="text-center text-sm text-white/75 landscape:text-xs">
              Alle peker på den de tror passer. Flest pek drikker.
            </p>

            {phase === 'ready' && (
              <button onClick={startCountdown} className={cn(primaryActionClass, 'landscape:py-2 landscape:text-sm')}>
                <Pointer className="w-5 h-5 landscape:w-4 landscape:h-4" />
                Klar — start nedtelling
              </button>
            )}

            {phase === 'result' && (
              <div className="flex w-full flex-col items-center gap-2 landscape:gap-1.5">
                <p className="flex items-center gap-2 text-2xl font-black text-white landscape:text-lg">
                  <Droplets className="h-6 w-6 landscape:h-5 landscape:w-5" />
                  Flest pek drikker {formatSips(sips)}
                </p>
                <button onClick={onNext} className={cn(primaryActionClass, 'landscape:py-2 landscape:text-sm')}>
                  Neste kort →
                </button>
              </div>
            )}
          </div>
        </div>

        {phase === 'ready' && (
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold text-white/75 shadow-sm backdrop-blur-sm">
            <Droplets className="h-4 w-4 shrink-0" />
            {formatSips(sips)}
          </span>
        )}
      </div>
    </div>
  )
}
