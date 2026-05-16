'use client'

import { useState, useEffect, useMemo } from 'react'
import { Droplets } from 'lucide-react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { getSips, formatSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface BussenCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

type Suit = '♠' | '♣' | '♥' | '♦'
type CardVal = { value: number; suit: Suit }

const RED_SUITS: Suit[] = ['♥', '♦']
const ALL_SUITS: Suit[] = ['♠', '♣', '♥', '♦']

function valueLabel(v: number): string {
  if (v === 1) return 'A'
  if (v === 11) return 'J'
  if (v === 12) return 'Q'
  if (v === 13) return 'K'
  return String(v)
}

function isRed(suit: Suit) { return RED_SUITS.includes(suit) }

function dealCards(count: number): CardVal[] {
  return Array.from({ length: count }, () => ({
    value: Math.floor(Math.random() * 13) + 1,
    suit: ALL_SUITS[Math.floor(Math.random() * 4)],
  }))
}

const STEP_LABELS = ['Rød eller sort?', 'Høyere eller lavere?', 'Innenfor eller utenfor?', 'Hvilken farge?']

function PlayingCard({ card: c, faceDown = false, small = false }: { card: CardVal; faceDown?: boolean; small?: boolean }) {
  const red = isRed(c.suit)
  if (faceDown) {
    return (
      <div className={cn(
        'flex items-center justify-center rounded-xl border-2 border-white/20 bg-forest/80 shadow-lg select-none',
        small ? 'h-16 w-11' : 'h-28 w-20 landscape:h-20 landscape:w-14'
      )}>
        <span className="text-2xl opacity-30">🂠</span>
      </div>
    )
  }
  return (
    <div className={cn(
      'flex flex-col rounded-xl border-2 border-white/20 bg-white shadow-lg select-none',
      small ? 'h-16 w-11 p-1' : 'h-28 w-20 p-2 landscape:h-20 landscape:w-14',
      red ? 'text-red-600' : 'text-slate-900'
    )}>
      <span className={cn('font-black leading-none self-start', small ? 'text-sm' : 'text-lg landscape:text-base')}>
        {valueLabel(c.value)}
      </span>
      <span className={cn('flex-1 flex items-center justify-center', small ? 'text-2xl' : 'text-3xl landscape:text-2xl')}>
        {c.suit}
      </span>
    </div>
  )
}

function seedPlayerIdx(id: string, len: number): number {
  const h = id.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0)
  return Math.abs(h) % len
}

export function BussenCard({ card, pack, players, intensitet, korttyper, onNext }: BussenCardProps) {
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

  const [draws, setDraws] = useState<CardVal[]>(() => dealCards(4))

  const hasPlayers = players.length > 0
  const playerIdx = hasPlayers ? seedPlayerIdx(card.id, players.length) : 0
  const passenger = hasPlayers ? players[playerIdx] : null

  const [step, setStep] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const [wrong, setWrong] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDraws(dealCards(4))
    setStep(0); setRevealed(false); setLastCorrect(null); setWrong(0); setDone(false)
  }, [card.id])

  const currentDraw = draws[step]

  const checkAnswer = (correct: boolean) => {
    if (!correct) setWrong(w => w + sips)
    setLastCorrect(correct)
    setRevealed(true)
  }

  const advance = () => {
    if (step >= 3) { setDone(true) } else { setStep(s => s + 1); setRevealed(false); setLastCorrect(null) }
  }

  const answerStep0 = (choice: 'rød' | 'sort') => {
    checkAnswer(isRed(currentDraw.suit) ? choice === 'rød' : choice === 'sort')
  }
  const answerStep1 = (choice: 'høyere' | 'lavere') => {
    const prev = draws[0].value
    checkAnswer(choice === 'høyere' ? currentDraw.value > prev : currentDraw.value < prev)
  }
  const answerStep2 = (choice: 'innenfor' | 'utenfor') => {
    const [lo, hi] = [draws[0].value, draws[1].value].sort((a, b) => a - b)
    const inRange = currentDraw.value > lo && currentDraw.value < hi
    checkAnswer(choice === 'innenfor' ? inRange : !inRange)
  }
  const answerStep3 = (suit: Suit) => {
    checkAnswer(suit === currentDraw.suit)
  }

  const accent = athina ? '#FF1493' : meta.farge ?? pack.farge
  const primaryActionClass = cn(
    'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-base shadow-lg transition-all hover:opacity-95 active:scale-[0.98] landscape:py-2.5 landscape:text-sm',
    athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
  )
  const choiceClass = cn(
    'flex-1 rounded-2xl py-3.5 text-sm font-black text-white transition-all hover:opacity-90 active:scale-95 landscape:py-2.5',
    athina ? 'bg-white/20 hover:bg-white/30' : 'bg-white/20 hover:bg-white/30'
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
            'relative flex max-h-[calc(100dvh-13.5rem)] w-full flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-3xl border p-6 shadow-2xl backdrop-blur-md sm:p-7 md:p-8 landscape:max-h-[calc(100dvh-8.5rem)] landscape:gap-3 landscape:rounded-2xl landscape:p-5',
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

          <div className="relative z-10 flex flex-col items-center gap-4 landscape:gap-3">

            {/* Passenger */}
            {passenger && (
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Passasjer</p>
                <span className="rounded-full px-5 py-2 text-base font-black text-white"
                  style={{ backgroundColor: colorWithAlpha(accent, 0.35, 'rgba(255,255,255,0.2)') }}>
                  {passenger}
                </span>
              </div>
            )}

            {!done ? (
              <>
                {/* Step dots */}
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={cn(
                      'h-2 rounded-full transition-all duration-300 landscape:h-1.5',
                      i < step ? 'w-4 bg-white/50 landscape:w-3'
                      : i === step ? 'w-8 bg-white landscape:w-6'
                      : 'w-4 bg-white/20 landscape:w-3'
                    )} />
                  ))}
                </div>

                {/* Question */}
                <p className="text-center text-xl font-black text-white landscape:text-base">
                  {STEP_LABELS[step]}
                </p>

                {/* Previous cards */}
                {step >= 1 && (
                  <div className="flex justify-center gap-2">
                    {draws.slice(0, step).map((c, i) => (
                      <PlayingCard key={i} card={c} small />
                    ))}
                  </div>
                )}

                {/* Current draw */}
                <div className="flex justify-center">
                  <PlayingCard card={currentDraw} faceDown={!revealed} />
                </div>

                {!revealed ? (
                  <div className="flex w-full gap-2">
                    {step === 0 && (
                      <>
                        <button onClick={() => answerStep0('rød')} className={cn(choiceClass, 'text-rose-300')}>🔴 Rød</button>
                        <button onClick={() => answerStep0('sort')} className={cn(choiceClass, 'text-slate-300')}>⚫ Sort</button>
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <button onClick={() => answerStep1('høyere')} className={choiceClass}>↑ Høyere</button>
                        <button onClick={() => answerStep1('lavere')} className={choiceClass}>↓ Lavere</button>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <button onClick={() => answerStep2('innenfor')} className={choiceClass}>↔ Innenfor</button>
                        <button onClick={() => answerStep2('utenfor')} className={choiceClass}>↕ Utenfor</button>
                      </>
                    )}
                    {step === 3 && (
                      <div className="grid w-full grid-cols-4 gap-2">
                        {ALL_SUITS.map(s => (
                          <button key={s} onClick={() => answerStep3(s)}
                            className={cn(choiceClass, isRed(s) ? 'text-rose-300' : 'text-slate-200')}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-center gap-3">
                    {/* Feedback */}
                    <div className={cn(
                      'w-full rounded-2xl px-4 py-3 text-center text-sm font-black',
                      lastCorrect
                        ? 'bg-green-500/25 text-green-300'
                        : 'bg-red-500/25 text-red-300'
                    )}>
                      {lastCorrect ? '✓ Riktig!' : `✗ Feil! +${formatSips(sips)}`}
                      {!lastCorrect && wrong > sips && (
                        <span className="ml-2 font-normal opacity-70">({wrong} slurker totalt)</span>
                      )}
                    </div>
                    <button onClick={advance} className={primaryActionClass}>
                      {step < 3 ? 'Neste →' : 'Se resultat →'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Final result */
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex justify-center gap-2">
                  {draws.map((c, i) => <PlayingCard key={i} card={c} small />)}
                </div>
                {wrong === 0 ? (
                  <>
                    <p className="text-2xl">🎉</p>
                    <p className="text-xl font-black text-white">Perfekt runde!</p>
                    <p className="text-sm text-white/60">Ingen slurker å drikke</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                      {passenger ?? 'Passasjer'} drikker totalt
                    </p>
                    <p className="flex items-center gap-2 text-4xl font-black text-white">
                      <Droplets className="h-8 w-8" />{wrong}
                    </p>
                    <p className="text-sm text-white/60">slurker</p>
                  </>
                )}
                <button onClick={onNext} className={primaryActionClass}>Neste kort →</button>
              </div>
            )}
          </div>
        </div>

        {!done && (
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold text-white/75 shadow-sm backdrop-blur-sm">
            <Droplets className="h-4 w-4 shrink-0" />
            {formatSips(sips)} per feil
          </span>
        )}
      </div>
    </div>
  )
}
