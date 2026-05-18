'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Droplets } from 'lucide-react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { interpolateToSegments } from '@/lib/game/interpolate'
import { getSips, formatSips, replaceSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface TrekkingCardProps {
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

const WHEEL_COLORS = [
  '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#9B5DE5',
  '#F15BB5', '#00BBF9', '#FB5607', '#3A86FF', '#8338EC',
  '#FB8500', '#06A77D',
]

const SPIN_DURATION_MS = 4200

export function TrekkingCard({ card, pack, players, intensitet, korttyper, onNext }: TrekkingCardProps) {
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

  const winnerIdx = players.length > 0 ? seedIndex(card.id, players.length) : 0
  const winner = players[winnerIdx] ?? null

  const [phase, setPhase] = useState<'ready' | 'spinning' | 'done'>('ready')
  const [rotation, setRotation] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setPhase('ready')
    setRotation(0)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [card.id])

  const startSpin = () => {
    if (phase !== 'ready' || players.length === 0) return
    const sliceAngle = 360 / players.length
    // Vi vil at vinnerens midtpunkt ender opp øverst (kl 12).
    // Hjulet roterer med klokken (positiv rotation).
    // Vinnerens bit starter på winnerIdx * sliceAngle og er sentrert på winnerIdx * sliceAngle + sliceAngle/2.
    // Etter rotasjon R skal sentrert vinkel ende på 0 (øverst).
    // R modulo 360 = -(winnerCenter) mod 360 = 360 - (winnerIdx * sliceAngle + sliceAngle/2)
    const winnerCenter = winnerIdx * sliceAngle + sliceAngle / 2
    const rounds = 5
    // Litt jitter så det ikke alltid lander akkurat på senter
    const jitter = (Math.random() - 0.5) * sliceAngle * 0.6
    const targetRotation = rounds * 360 + (360 - winnerCenter) + jitter
    setPhase('spinning')
    // Trigge transition
    requestAnimationFrame(() => setRotation(targetRotation))
    const duration = reducedMotion ? 200 : SPIN_DURATION_MS
    timeoutRef.current = setTimeout(() => setPhase('done'), duration)
  }

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

          {/* I landscape: hjul venstre, tekst+CTA høyre. Portrait: stacked. */}
          <div className="relative z-10 flex flex-col items-center gap-5 md:gap-7 landscape:flex-row landscape:items-center landscape:gap-5">

            {/* Venstre: hjul */}
            <div className="flex shrink-0 flex-col items-center gap-2 landscape:basis-1/2">
              <Wheel
                players={players}
                rotation={rotation}
                spinning={phase === 'spinning'}
                duration={SPIN_DURATION_MS}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Høyre: tekst + CTA */}
            <div className="flex w-full flex-col items-center gap-3 landscape:flex-1 landscape:items-stretch landscape:gap-2 landscape:min-w-0">
              {card.innhold && (
                <p className="break-words text-center text-lg font-semibold leading-snug text-white sm:text-xl landscape:text-base landscape:text-left [overflow-wrap:anywhere]">
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
              )}

              {phase === 'ready' && (
                <button
                  onClick={startSpin}
                  disabled={players.length === 0}
                  className={cn(primaryActionClass, 'disabled:opacity-50')}
                >
                  Spinn hjulet 🎡
                </button>
              )}

              {phase === 'spinning' && (
                <p className={cn(
                  'text-center text-sm font-bold uppercase tracking-widest text-white/75 landscape:text-left',
                )}>
                  Spinner…
                </p>
              )}

              {phase === 'done' && winner && (
                <div className="flex flex-col items-center gap-2 landscape:items-stretch landscape:gap-1.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60 landscape:text-left">Trukket</p>
                  <span className={cn(
                    'inline-block rounded-full px-5 py-2 text-2xl font-black text-center landscape:text-xl landscape:py-1.5',
                    athina ? 'bg-white text-[#FF1493]' : 'bg-white text-forest'
                  )}>
                    {winner}
                  </span>
                  <p className="flex items-center gap-2 text-xl font-black text-white landscape:text-lg landscape:justify-start">
                    <Droplets className="h-5 w-5" />
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

        {phase !== 'done' && (
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold text-white/75 shadow-sm backdrop-blur-sm">
            <Droplets className="h-4 w-4 shrink-0" />
            {formatSips(sips)}
          </span>
        )}
      </div>
    </div>
  )
}

interface WheelProps {
  players: string[]
  rotation: number
  spinning: boolean
  duration: number
  reducedMotion: boolean
}

function Wheel({ players, rotation, duration, reducedMotion }: WheelProps) {
  const size = 220
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 2
  const n = Math.max(1, players.length)
  const sliceAngle = 360 / n

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Pekedyr på toppen */}
      <div
        className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
        aria-hidden
      >
        <svg width="26" height="34" viewBox="0 0 26 34">
          <path
            d="M13 33 L2 12 A11 11 0 0 1 24 12 Z"
            fill="#1A3A1A"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Hjul */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: reducedMotion
            ? 'none'
            : `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.21, 0.99)`,
        }}
      >
        {/* Slices */}
        {players.length === 0 ? (
          <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="2" />
        ) : (
          players.map((player, i) => {
            const startAngle = i * sliceAngle - 90
            const endAngle = (i + 1) * sliceAngle - 90
            const start = polarToCartesian(cx, cy, r, startAngle)
            const end = polarToCartesian(cx, cy, r, endAngle)
            const largeArc = sliceAngle > 180 ? 1 : 0
            const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
            const labelAngle = startAngle + sliceAngle / 2
            const labelPos = polarToCartesian(cx, cy, r * 0.65, labelAngle)
            const color = WHEEL_COLORS[i % WHEEL_COLORS.length]
            return (
              <g key={i}>
                <path d={path} fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  fill="white"
                  fontSize="13"
                  fontWeight="900"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${labelAngle + 90}, ${labelPos.x}, ${labelPos.y})`}
                  style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.35)', strokeWidth: 2 }}
                >
                  {player.length > 8 ? `${player.slice(0, 7)}…` : player}
                </text>
              </g>
            )
          })
        )}
        {/* Senter-knott */}
        <circle cx={cx} cy={cy} r="14" fill="white" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="6" fill="#1A3A1A" />
      </svg>
    </div>
  )
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}
