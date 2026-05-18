'use client'

import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { Droplets, Trophy, Timer, Sparkles, PenLine } from 'lucide-react'
import JSConfetti from 'js-confetti'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { interpolateToSegments } from '@/lib/game/interpolate'
import { getSips, formatSips, replaceSips, isChugging } from '@/lib/game/sips'
import { playTimerDing } from '@/lib/game/timer-sound'
import { useAthina } from '@/context/athina-context'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import { FemFingreCard } from './fem-fingre-card'
import { SnusboksCard } from './snusboks-card'
import { BombaCard } from './bomba-card'
import { DuellCard } from './duell-card'
import { ReaksjonsCard } from './reaksjon-card'
import { TrekkingCard } from './trekning-card'
import { KategoriCard } from './kategori-card'
import { RouletteCard } from './roulette-card'
import { BussenCard } from './bussen-card'
import { OppdragCard } from './oppdrag-card'
import { PekelekCard } from './pekelek-card'
import { JegHarAldriCard } from './jeg-har-aldri-card'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

const GLITTERS = [
  { top: '8%',  left: '12%',  delay: 0 },
  { top: '12%', right: '10%', delay: 0.4 },
  { top: '45%', left: '4%',   delay: 0.8 },
  { top: '55%', right: '6%',  delay: 1.2 },
  { bottom: '25%', left: '20%', delay: 0.2 },
  { bottom: '12%', right: '15%', delay: 1.0 },
] as const

interface GameCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

type TimerPhase = 'idle' | 'delay' | 'running' | 'result'

function getCardTextClass(length: number) {
  if (length > 220) {
    return 'text-lg sm:text-xl md:text-2xl lg:text-3xl landscape:text-base lg:landscape:text-2xl leading-normal'
  }

  if (length > 140) {
    return 'text-xl sm:text-2xl md:text-3xl lg:text-4xl landscape:text-lg lg:landscape:text-3xl leading-snug'
  }

  return 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl landscape:text-lg lg:landscape:text-3xl leading-snug'
}

export function GameCard(props: GameCardProps) {
  if (props.card.type === 'femfingre') {
    return (
      <FemFingreCard
        card={props.card}
        pack={props.pack}
        korttyper={props.korttyper}
        onNext={props.onNext}
      />
    )
  }
  if (props.card.type === 'snusboks') {
    return <SnusboksCard {...props} />
  }
  if (props.card.type === 'kategori') {
    return <KategoriCard {...props} />
  }
  if (props.card.type === 'bomba') {
    return <BombaCard {...props} />
  }
  if (props.card.type === 'duell') {
    return <DuellCard {...props} />
  }
  if (props.card.type === 'reaksjon') {
    return <ReaksjonsCard {...props} />
  }
  if (props.card.type === 'trekning') {
    return <TrekkingCard {...props} />
  }
  if (props.card.type === 'roulette') {
    return <RouletteCard {...props} />
  }
  if (props.card.type === 'bussen') {
    return <BussenCard {...props} />
  }
  if (props.card.type === 'oppdrag') {
    return <OppdragCard {...props} />
  }
  if (props.card.type === 'pekelek') {
    return <PekelekCard {...props} />
  }
  if (props.card.type === 'alle_drikker') {
    return <JegHarAldriCard {...props} />
  }
  return <StandardGameCard {...props} />
}

function StandardGameCard({ card, pack, players, intensitet, korttyper, onNext }: GameCardProps) {
  const { isActive: athina } = useAthina()
  const reducedMotion = useReducedMotion()
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

  const utfordringSegments = useMemo(() => {
    if (!card.utfordring) return null
    const raw = interpolateToSegments(card.utfordring, players)
    return raw.map(seg =>
      seg.type === 'text' ? { ...seg, text: replaceSips(seg.text, sips) } : seg
    )
  }, [card.utfordring, players, sips])

  const hasTimer = !!card.timer_sekunder
  const timerSynlig = !!card.timer_synlig
  const timerAutoStart = !!card.timer_auto_start

  const startRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const delayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const jsConfettiRef = useRef<JSConfetti | null>(null)
  const [timerPhase, setTimerPhase] = useState<TimerPhase>('idle')
  const [diffSec, setDiffSec] = useState(0)
  const [resultSips, setResultSips] = useState(0)
  const [countdown, setCountdown] = useState(card.timer_sekunder ?? 0)
  const [delayCountdown, setDelayCountdown] = useState(0)

  useEffect(() => {
    jsConfettiRef.current = new JSConfetti()
    return () => { jsConfettiRef.current = null }
  }, [])

  const handleStart = useCallback(() => {
    startRef.current = Date.now()
    setTimerPhase('running')
    if (timerSynlig && card.timer_sekunder) {
      setCountdown(card.timer_sekunder)
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startRef.current!) / 1000
        const remaining = Math.max(0, card.timer_sekunder! - elapsed)
        setCountdown(remaining)
        if (remaining <= 0) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          setResultSips(sips)
          setTimerPhase('result')
          playTimerDing()
          if (!reducedMotion) jsConfettiRef.current?.addConfetti({ confettiNumber: 200 })
        }
      }, 100)
    }
  }, [card.timer_sekunder, timerSynlig, sips, reducedMotion])

  useEffect(() => {
    setTimerPhase('idle')
    setCountdown(card.timer_sekunder ?? 0)
    startRef.current = null
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (delayIntervalRef.current) {
      clearInterval(delayIntervalRef.current)
      delayIntervalRef.current = null
    }

    if (timerAutoStart && card.timer_sekunder && timerSynlig) {
      const delay = card.timer_forsinkelse ?? 0
      if (delay > 0) {
        setDelayCountdown(delay)
        setTimerPhase('delay')
        let remaining = delay
        delayIntervalRef.current = setInterval(() => {
          remaining -= 1
          setDelayCountdown(remaining)
          if (remaining <= 0) {
            clearInterval(delayIntervalRef.current!)
            delayIntervalRef.current = null
            handleStart()
          }
        }, 1000)
      } else {
        handleStart()
      }
    }
  }, [card.id, card.timer_sekunder]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (delayIntervalRef.current) clearInterval(delayIntervalRef.current)
    }
  }, [])

  const handleStop = () => {
    if (!startRef.current || !card.timer_sekunder) return
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    const elapsed = (Date.now() - startRef.current) / 1000
    const diff = Math.abs(elapsed - card.timer_sekunder)
    setDiffSec(Math.round(diff))
    setResultSips(Math.floor(diff / 5) * sips)
    setTimerPhase('result')
  }

  const countdownDisplay = (() => {
    const total = Math.ceil(countdown)
    const m = Math.floor(total / 60)
    const s = total % 60
    return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}`
  })()

  const accent = athina ? '#FF1493' : meta.farge ?? pack.farge
  const cardTextClass = getCardTextClass(card.innhold.length + (card.utfordring?.length ?? 0))
  const primaryActionClass = cn(
    'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-base shadow-lg transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 landscape:py-2.5 landscape:text-sm',
    athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
  )
  const secondaryActionClass = cn(
    'rounded-xl px-6 py-2 text-sm font-bold transition-all hover:opacity-95 active:scale-[0.98]',
    athina ? 'bg-white/25 text-white' : 'bg-white/20 text-white'
  )

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-[calc(env(safe-area-inset-top)_+_4.25rem)] pb-[calc(env(safe-area-inset-bottom)_+_6.75rem)] transition-colors duration-700 sm:px-5 landscape:px-20 landscape:pt-14 landscape:pb-20"
      style={{ backgroundColor: athina ? 'transparent' : pack.farge }}
    >

      {/* Glitter sparkles */}
      {athina && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {GLITTERS.map((g, i) => (
            <span
              key={i}
              className="absolute text-[#FFD700] text-xl select-none"
              style={{
                top: 'top' in g ? g.top : undefined,
                bottom: 'bottom' in g ? g.bottom : undefined,
                left: 'left' in g ? g.left : undefined,
                right: 'right' in g ? g.right : undefined,
                animation: `glitter 1.5s ease-in-out ${g.delay}s infinite`,
              }}
            >
              ✦
            </span>
          ))}
        </div>
      )}
      {/* The card */}
      <div className="flex min-h-0 w-full max-w-sm flex-col items-center gap-3 md:max-w-xl md:gap-5 lg:max-w-2xl xl:max-w-3xl landscape:max-w-2xl landscape:gap-2 lg:landscape:max-w-3xl">

        {/* Category badge — above card */}
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

          {/* Main card — frosted glass */}
          <div
            className={cn(
              'relative flex max-h-[calc(100dvh-13.5rem)] w-full flex-col gap-5 overflow-x-hidden overflow-y-auto rounded-3xl border p-6 shadow-2xl backdrop-blur-md transition-all duration-500 sm:p-7 md:gap-7 md:p-10 lg:p-12 landscape:max-h-[calc(100dvh-8.5rem)] landscape:gap-3 landscape:rounded-2xl landscape:p-5 lg:landscape:gap-6 lg:landscape:p-10',
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

            {/* Card text */}
            <div className="relative z-10 flex flex-col gap-5 md:gap-7 landscape:gap-3 lg:landscape:gap-6">
              <p className={cn('break-words text-center font-semibold text-white [overflow-wrap:anywhere]', cardTextClass)}>
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

              {/* Utfordring */}
              {utfordringSegments && (
                <div
                  className="flex items-start gap-3 rounded-2xl border px-4 py-3"
                  style={{
                    backgroundColor: athina ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.18)',
                    borderColor: colorWithAlpha(accent, 0.32, 'rgba(255,255,255,0.18)'),
                  }}
                >
                  <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                  <p className="flex-1 break-words text-sm font-semibold leading-snug text-white/90 [overflow-wrap:anywhere]">
                    {utfordringSegments.map((seg, i) =>
                      seg.type === 'player' ? (
                        <mark key={i} className={cn(
                          'mx-0.5 inline-block rounded-full px-2 py-0.5 align-baseline font-black not-italic',
                          athina ? 'bg-white text-[#FF1493]' : 'bg-white/20 text-white'
                        )}>
                          {seg.name}
                        </mark>
                      ) : (
                        <span key={i}>{seg.text}</span>
                      )
                    )}
                  </p>
                </div>
              )}

              {/* Custom card author */}
              {card.custom_author && (
                <div className="mt-1 flex justify-center">
                  <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white/75">
                    <PenLine className="h-3 w-3 shrink-0" />
                    <span className="truncate">Laget av {card.custom_author}</span>
                  </span>
                </div>
              )}

              {/* Timer */}
              {hasTimer && (
                <div className="flex flex-col items-center gap-3">

                  {timerPhase === 'idle' && !timerAutoStart && (
                    <button
                      onClick={handleStart}
                      className={primaryActionClass}
                    >
                      <Timer className="h-5 w-5" />
                      Start timer
                    </button>
                  )}

                  {timerPhase === 'delay' && (
                    <div className="flex w-full animate-pulse flex-col items-center gap-1 rounded-2xl bg-black/20 px-5 py-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/60">Gjør deg klar…</p>
                      <p className="font-black tabular-nums text-white/75" style={{ fontSize: '3rem', lineHeight: 1 }}>
                        {delayCountdown}
                      </p>
                    </div>
                  )}

                  {timerPhase === 'running' && (
                    <div className="flex w-full flex-col items-center gap-3">
                      {timerSynlig && (
                        <div className="flex flex-col items-center gap-1">
                          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Nedtelling</p>
                          <p className="text-center font-black tabular-nums text-white landscape:text-6xl" style={{ fontSize: '5rem', lineHeight: 1 }}>
                            {countdownDisplay}
                          </p>
                        </div>
                      )}
                      {!timerSynlig && (
                        <button
                          onClick={handleStop}
                          className="flex w-full animate-pulse items-center justify-center gap-2 rounded-2xl bg-red-500/80 py-3.5 text-base font-black text-white shadow-lg transition-all hover:bg-red-500 active:scale-[0.98] landscape:py-2.5"
                        >
                          <Timer className="h-5 w-5" />
                          Stopp!
                        </button>
                      )}
                    </div>
                  )}

                  {timerPhase === 'result' && timerSynlig && (
                    <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-black/25 px-5 py-4 text-center">
                      <p className="flex items-center gap-2 text-2xl font-black text-white">
                        Tid er ute! <Sparkles className="h-6 w-6 text-yellow-300" />
                      </p>
                      <button
                        onClick={onNext}
                        className={secondaryActionClass}
                      >
                        Neste kort →
                      </button>
                    </div>
                  )}

                  {timerPhase === 'result' && !timerSynlig && (
                    <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-black/25 px-5 py-4 text-center">
                      <p className="text-sm font-semibold text-white/75">
                        Du bommet med <span className="font-black text-white">{diffSec} sek</span>
                      </p>
                      <p className="flex items-center gap-2 text-2xl font-black text-white">
                        {isChugging(resultSips) ? '' : 'Drikk '}{formatSips(resultSips)}
                        <Droplets className="h-6 w-6" />
                      </p>
                      <button
                        onClick={onNext}
                        className={secondaryActionClass}
                      >
                        Neste kort →
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

          {/* Sip pill — centered below card */}
          {(timerPhase !== 'result' || timerSynlig) && (
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold text-white/75 shadow-sm backdrop-blur-sm">
              <Droplets className="h-4 w-4 shrink-0" />
              {formatSips(sips)}
            </span>
          )}
      </div>
    </div>
  )
}
