'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { interpolateToSegments } from '@/lib/game/interpolate'
import { getSips, replaceSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface OppdragCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

type Phase = 'intro' | 'peek' | 'done'

function seedIndex(id: string, len: number): number {
  const hash = id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)
  return Math.abs(hash) % len
}

const PEEK_SECONDS = 8

function pickMission(innhold: string): string {
  try {
    const parsed = JSON.parse(innhold)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[Math.floor(Math.random() * parsed.length)]
    }
  } catch {}
  return innhold
}

export function OppdragCard({ card, pack, players, intensitet, korttyper, onNext }: OppdragCardProps) {
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

  const [selectedMission, setSelectedMission] = useState(() => pickMission(card.innhold))

  const segments = useMemo(() => {
    const raw = interpolateToSegments(selectedMission, players)
    return raw.map(seg =>
      seg.type === 'text' ? { ...seg, text: replaceSips(seg.text, sips) } : seg
    )
  }, [selectedMission, players, sips])

  const hasPlayers = players.length > 0
  const agentIdx = hasPlayers ? seedIndex(card.id, players.length) : 0
  const agent = hasPlayers ? players[agentIdx] : 'Spiller'

  const [phase, setPhase] = useState<Phase>('intro')
  const [peekCountdown, setPeekCountdown] = useState(PEEK_SECONDS)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setSelectedMission(pickMission(card.innhold))
    setPhase('intro')
    setPeekCountdown(PEEK_SECONDS)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [card.id, card.innhold])

  const startPeek = () => {
    setPhase('peek')
    setPeekCountdown(PEEK_SECONDS)
    intervalRef.current = setInterval(() => {
      setPeekCountdown(n => {
        if (n <= 1) {
          clearInterval(intervalRef.current!)
          setPhase('done')
          return 0
        }
        return n - 1
      })
    }, 1000)
  }

  const hideMission = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setPhase('done')
  }

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

            {phase === 'intro' && (
              <>
                <p className="text-5xl select-none landscape:text-4xl">🕵️</p>
                <p className="text-center text-xl font-black text-white landscape:text-lg">Hemmelig oppdrag!</p>
                <p className="text-center text-sm text-white/70">
                  Kun for <span className="font-black text-white">{agent}</span> sine øyne.
                  Alle andre — se vekk! 🙈
                </p>
                <button onClick={startPeek} className={primaryActionClass}>
                  {agent} — trykk for å se oppdraget
                </button>
              </>
            )}

            {phase === 'peek' && (
              <>
                <div className="flex w-full items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60">Ditt hemmelige oppdrag</p>
                  <span className={cn(
                    'tabular-nums text-sm font-black',
                    peekCountdown <= 3 ? 'text-red-300 animate-pulse' : 'text-white/50'
                  )}>{peekCountdown}s</span>
                </div>
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
                <button onClick={hideMission} className={primaryActionClass}>
                  Skjul oppdraget →
                </button>
              </>
            )}

            {phase === 'done' && (
              <>
                <p className="text-5xl select-none landscape:text-4xl">🤫</p>
                <p className="text-center text-xl font-black text-white landscape:text-lg">
                  <span className={cn(athina ? 'text-white' : 'text-white')}>{agent}</span> har et hemmelig oppdrag!
                </p>
                <p className="text-center text-sm text-white/60">
                  Oppdraget varer ut spillet. De andre prøver å avsløre deg!
                </p>
                <button onClick={onNext} className={primaryActionClass}>Neste kort →</button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
