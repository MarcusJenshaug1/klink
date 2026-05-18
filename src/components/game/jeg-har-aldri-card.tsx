'use client'

import { useMemo, useState } from 'react'
import { Beer, Droplets } from 'lucide-react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { interpolateToSegments } from '@/lib/game/interpolate'
import { getSips, formatSips, replaceSips } from '@/lib/game/sips'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import type { Card, Pack, Intensitet, Korttype } from '@/types/game'

interface JegHarAldriCardProps {
  card: Card
  pack: Pack
  players: string[]
  intensitet: Intensitet
  korttyper: Korttype[]
  onNext: () => void
}

export function JegHarAldriCard({ card, pack, players, intensitet, korttyper, onNext }: JegHarAldriCardProps) {
  const { isActive: athina } = useAthina()
  const meta = getCardTypeMeta(card.type, korttyper)
  const [tilted, setTilted] = useState(false)

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

          {/* I landscape: glass venstre, tekst+CTA høyre */}
          <div className="relative z-10 flex flex-col items-center gap-5 md:gap-7 landscape:flex-row landscape:items-center landscape:gap-5">

            {/* Venstre kolonne i landscape: stempel + glass */}
            <div className="flex flex-col items-center gap-3 landscape:shrink-0 landscape:basis-1/3 landscape:gap-2">
              <span
                className={cn(
                  'inline-block rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest',
                  athina ? 'bg-white text-[#FF1493]' : 'bg-white/85 text-forest'
                )}
              >
                Jeg har aldri
              </span>
              <button
                type="button"
                onClick={() => setTilted((t) => !t)}
                aria-label={tilted ? 'Sett glass ned' : 'Drikk!'}
                className="relative h-20 w-20 transition-transform duration-500 ease-out active:scale-95 landscape:h-14 landscape:w-14"
                style={{ transform: tilted ? 'rotate(-45deg)' : 'rotate(0deg)' }}
              >
                <Beer className="h-20 w-20 text-white landscape:h-14 landscape:w-14" />
              </button>
            </div>

            {/* Høyre kolonne i landscape: påstand + drikk-tekst + CTA */}
            <div className="flex w-full flex-col items-center gap-4 landscape:flex-1 landscape:items-stretch landscape:gap-2 landscape:min-w-0">
              <p className="break-words text-center text-2xl font-semibold leading-snug text-white sm:text-3xl md:text-4xl landscape:text-lg landscape:text-left [overflow-wrap:anywhere]">
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

              <p className="text-center text-sm text-white/85 landscape:text-xs landscape:text-left">
                Har du gjort det? <span className="font-black">Drikk {formatSips(sips)}</span>.
              </p>

              <button onClick={onNext} className={cn(primaryActionClass, 'landscape:py-2 landscape:text-sm')}>
                Neste kort →
              </button>
            </div>
          </div>
        </div>

        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold text-white/75 shadow-sm backdrop-blur-sm">
          <Droplets className="h-4 w-4 shrink-0" />
          {formatSips(sips)} — hvis det stemmer
        </span>
      </div>
    </div>
  )
}
