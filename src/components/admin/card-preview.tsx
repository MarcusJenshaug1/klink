'use client'

import { Trophy, Timer, Droplets } from 'lucide-react'
import { getCardTypeMeta } from '@/lib/game/card-types'
import type { KortType, Korttype } from '@/types/game'

interface CardPreviewProps {
  type: KortType
  tittel: string
  innhold: string
  utfordring?: string
  timerSekunder?: number | null
  timerSynlig?: boolean
  packColor?: string
  korttyper?: Korttype[]
}

export function CardPreview({
  type,
  tittel,
  innhold,
  utfordring,
  timerSekunder,
  timerSynlig,
  packColor = '#1A3A1A',
  korttyper = [],
}: CardPreviewProps) {
  const meta = getCardTypeMeta(type, korttyper)
  const Icon = meta.icon

  return (
    <div
      className="rounded-3xl p-6 flex flex-col items-center gap-4 w-full"
      style={{ backgroundColor: packColor }}
    >
      {/* Category badge */}
      <span
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest"
        style={meta.farge
          ? { backgroundColor: meta.farge }
          : { backgroundColor: 'rgba(0,0,0,0.20)' }
        }
      >
        <Icon className="w-3.5 h-3.5" />
        {tittel || meta.label}
      </span>

      {/* Main card */}
      <div className="w-full bg-white/15 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-4">
        <p className="text-white text-base font-semibold leading-relaxed text-center min-h-[3rem]">
          {innhold || (
            <span className="text-white/30 italic">Innhold vises her...</span>
          )}
        </p>

        {utfordring && (
          <div className="rounded-xl bg-black/20 px-4 py-3 flex items-start gap-2">
            <Trophy className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
            <p className="text-white/85 text-sm font-semibold leading-snug">{utfordring}</p>
          </div>
        )}

        {timerSekunder && (
          <div className="flex items-center justify-center gap-2 bg-white/20 text-white font-black py-3 rounded-xl text-sm">
            <Timer className="w-4 h-4" />
            {timerSynlig ? `${timerSekunder}s nedtelling` : 'Hot Seat — skjult timer'}
          </div>
        )}
      </div>

      {/* Sip pill */}
      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/20 text-white/60 text-xs font-bold">
        <Droplets className="w-3.5 h-3.5" />
        Slurker (intensitet)
      </span>
    </div>
  )
}
