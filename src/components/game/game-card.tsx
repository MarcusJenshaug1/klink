'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import { Droplets, Trophy, Timer } from 'lucide-react'
import { getCardTypeMeta } from '@/lib/game/card-types'
import { interpolate } from '@/lib/game/interpolate'
import { getSips, formatSips, replaceSips, isChugging } from '@/lib/game/sips'
import { playTimerDing } from '@/lib/game/timer-sound'
import { useAthina } from '@/context/athina-context'
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

type TimerPhase = 'idle' | 'running' | 'result'

export function GameCard({ card, pack, players, intensitet, korttyper, onNext }: GameCardProps) {
  const { isActive: athina } = useAthina()
  const meta = getCardTypeMeta(card.type, korttyper)
  const sips = useMemo(() => {
    const override =
      intensitet === 'lett' ? card.slurker_lett
      : intensitet === 'medium' ? card.slurker_medium
      : card.slurker_borst
    if (override != null) return override
    return getSips(intensitet)
  }, [card.id, intensitet]) // eslint-disable-line react-hooks/exhaustive-deps

  const content = useMemo(() => {
    let text = interpolate(card.innhold, players)
    text = replaceSips(text, sips)
    return text
  }, [card.id, players, sips]) // eslint-disable-line react-hooks/exhaustive-deps

  const utfordring = useMemo(() => {
    if (!card.utfordring) return null
    return replaceSips(card.utfordring, sips)
  }, [card.utfordring, sips])

  const hasTimer = !!card.timer_sekunder
  const timerSynlig = !!card.timer_synlig

  const startRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [timerPhase, setTimerPhase] = useState<TimerPhase>('idle')
  const [diffSec, setDiffSec] = useState(0)
  const [resultSips, setResultSips] = useState(0)
  const [countdown, setCountdown] = useState(card.timer_sekunder ?? 0)

  useEffect(() => {
    setTimerPhase('idle')
    setCountdown(card.timer_sekunder ?? 0)
    startRef.current = null
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [card.id, card.timer_sekunder])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const handleStart = () => {
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
          const diff = Math.abs(elapsed - card.timer_sekunder!)
          setDiffSec(Math.round(diff))
          setResultSips(Math.floor(diff / 5) * sips)
          setTimerPhase('result')
          // Lyd-ding KUN på synlig timer (skjult timer skal spilleren gjette på)
          playTimerDing()
        }
      }, 100)
    }
  }

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

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-5 landscape:px-20 pt-16 pb-24 transition-colors duration-700"
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
      <div className="w-full max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-3xl landscape:max-w-2xl lg:landscape:max-w-3xl flex flex-col items-center gap-3 md:gap-5 landscape:gap-2">

          {/* Category badge — above card */}
          <div className="flex justify-center">
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest"
              style={meta.farge
                ? { backgroundColor: meta.farge }
                : { backgroundColor: 'rgba(0,0,0,0.20)', backdropFilter: 'blur(4px)', color: 'rgba(255,255,255,0.9)' }
              }
            >
              <meta.icon className="w-3.5 h-3.5" />
              {card.tittel || meta.label}
            </div>
          </div>

          {/* Main card — frosted glass */}
          <div
            className="w-full bg-white/15 backdrop-blur-md rounded-3xl landscape:rounded-2xl p-7 md:p-10 lg:p-12 landscape:p-5 lg:landscape:p-10 flex flex-col gap-5 md:gap-7 landscape:gap-3 lg:landscape:gap-6 shadow-xl transition-all duration-500"
            style={athina ? { boxShadow: '0 0 0 2px rgba(255,215,0,0.5), 0 20px 25px -5px rgba(0,0,0,0.1)' } : undefined}
          >

            {/* Card text */}
            <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl landscape:text-lg lg:landscape:text-3xl font-semibold leading-relaxed text-center">
              {content}
            </p>

            {/* Utfordring */}
            {utfordring && (
              <div className="rounded-2xl bg-black/20 px-4 py-3 flex items-start gap-3">
                <Trophy className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
                <p className="text-white/85 text-sm font-semibold leading-snug">
                  {utfordring}
                </p>
              </div>
            )}

            {/* Timer */}
            {hasTimer && (
              <div className="flex flex-col items-center gap-3">

                {timerPhase === 'idle' && (
                  <button
                    onClick={handleStart}
                    className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-black text-base py-3.5 landscape:py-2.5 rounded-2xl transition-all"
                  >
                    <Timer className="w-5 h-5" />
                    Start timer
                  </button>
                )}

                {timerPhase === 'running' && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    {timerSynlig && (
                      <p className="text-white font-black tabular-nums text-center landscape:text-6xl" style={{ fontSize: '5rem', lineHeight: 1 }}>
                        {countdownDisplay}
                      </p>
                    )}
                    {!timerSynlig && (
                      <button
                        onClick={handleStop}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/80 hover:bg-red-500 active:scale-95 text-white font-black text-base py-3.5 landscape:py-2.5 rounded-2xl animate-pulse transition-all"
                      >
                        <Timer className="w-5 h-5" />
                        Stopp!
                      </button>
                    )}
                  </div>
                )}

                {timerPhase === 'result' && (
                  <div className="w-full rounded-2xl bg-black/25 px-5 py-4 flex flex-col items-center gap-2 text-center">
                    {!timerSynlig && (
                      <p className="text-white/70 text-sm font-semibold">
                        Du bommet med <span className="text-white font-black">{diffSec} sek</span>
                      </p>
                    )}
                    {timerSynlig && (
                      <p className="text-white/70 text-sm font-semibold">Tiden er ute!</p>
                    )}
                    <p className="text-white text-2xl font-black flex items-center gap-2">
                      {isChugging(resultSips) ? '' : 'Drikk '}{formatSips(resultSips)}
                      <Droplets className="w-6 h-6" />
                    </p>
                    <button
                      onClick={onNext}
                      className="mt-1 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-sm px-6 py-2 rounded-xl transition-all"
                    >
                      Neste kort →
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

        {/* Sip pill — centered below card */}
        {timerPhase !== 'result' && (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-sm text-white/70 text-sm font-bold">
            <Droplets className="w-4 h-4" />
            {formatSips(sips)}
          </span>
        )}
      </div>
    </div>
  )
}
