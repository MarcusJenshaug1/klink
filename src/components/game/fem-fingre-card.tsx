'use client'

import { useEffect, useState } from 'react'
import { colorWithAlpha, getCardTypeMeta } from '@/lib/game/card-types'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'
import type { Card, Pack, Korttype } from '@/types/game'

interface FemFingreCardProps {
  card: Card
  pack: Pack
  korttyper: Korttype[]
  onNext: () => void
}

export function FemFingreCard({ card, pack, korttyper, onNext }: FemFingreCardProps) {
  const { isActive: athina } = useAthina()
  const meta = getCardTypeMeta(card.type, korttyper)
  const paastander = card.paastander ?? []
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    setRevealed(0)
  }, [card.id])

  const total = paastander.length
  const allRevealed = revealed >= total
  const canReveal = !allRevealed && total > 0
  const accent = athina ? '#FF1493' : meta.farge ?? pack.farge
  const primaryActionClass = cn(
    'relative flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-black shadow-lg transition-all hover:opacity-95 active:scale-[0.98] landscape:rounded-xl landscape:py-2 landscape:text-sm',
    athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'
  )

  const handleReveal = () => {
    if (canReveal) setRevealed((n) => Math.min(n + 1, total))
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-[calc(env(safe-area-inset-top)_+_4.25rem)] pb-[calc(env(safe-area-inset-bottom)_+_6.75rem)] transition-colors duration-700 sm:px-5 landscape:px-20 landscape:pt-12 landscape:pb-16"
      style={{ backgroundColor: athina ? 'transparent' : pack.farge }}
    >
      <div className="flex min-h-0 w-full max-w-sm flex-col items-center gap-3 md:max-w-xl md:gap-5 lg:max-w-2xl xl:max-w-3xl landscape:max-w-4xl landscape:gap-2 lg:landscape:max-w-5xl">

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

        {/* Main card — frosted glass; stop propagation while revealing to avoid accidental next-card */}
        <div
          className={cn(
            'relative flex max-h-[calc(100dvh-13.5rem)] w-full flex-col gap-5 overflow-x-hidden overflow-y-auto rounded-3xl border p-6 shadow-2xl backdrop-blur-md md:gap-7 md:p-10 lg:p-12 landscape:max-h-[calc(100dvh-8.5rem)] landscape:gap-3 landscape:rounded-2xl landscape:p-4 lg:landscape:gap-4 lg:landscape:p-6',
            athina ? 'border-white/30 bg-white/18' : 'border-white/25 bg-white/18'
          )}
          style={{
            boxShadow: athina
              ? '0 0 0 2px rgba(255,215,0,0.35), 0 24px 45px rgba(0,0,0,0.16)'
              : '0 24px 45px rgba(0,0,0,0.16)',
          }}
          onClick={canReveal ? (e) => e.stopPropagation() : undefined}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: accent }} />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28"
            style={{ background: `linear-gradient(180deg, ${colorWithAlpha(accent, 0.24, 'rgba(255,255,255,0.14)')}, transparent)` }}
          />
          {athina && <div className="pointer-events-none absolute inset-0 bg-[#FF1493]/30" />}

          {/* Landscape: 2-column (hand left, statements right). Portrait: stacked. */}
          <div className="relative z-10 flex flex-col gap-5 md:gap-7 landscape:flex-row landscape:items-center landscape:gap-6">

            {/* Hånd-visualisering: 5 fingre som bøyes ned etter hvert som påstander avsløres */}
            <div className="flex justify-center landscape:shrink-0 landscape:basis-2/5 landscape:justify-center">
              <FiveFingerHand count={revealed} total={total} />
            </div>

            {/* Right column in landscape: statements + action + dots */}
            <div className="flex flex-col gap-5 md:gap-7 landscape:gap-2 landscape:flex-1 landscape:min-w-0">

              {/* Påstand-stack */}
              <ol className="flex flex-col gap-2.5 landscape:gap-1.5">
                {paastander.map((text, i) => {
                  const isRevealed = i < revealed
                  return (
                    <li
                      key={i}
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition-all duration-500 landscape:gap-2 landscape:rounded-xl landscape:px-3 landscape:py-1.5 ${
                        isRevealed
                          ? 'translate-y-0 border-white/25 bg-white/25 opacity-100'
                          : 'translate-y-0.5 border-white/10 bg-black/15 opacity-70'
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-colors landscape:h-5 landscape:w-5 landscape:text-[10px] ${
                          isRevealed ? (athina ? 'bg-white text-[#FF1493]' : 'bg-white text-forest') : 'bg-white/15 text-white/40'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <p
                        className={`min-w-0 flex-1 break-words text-sm font-semibold leading-snug text-white transition-all [overflow-wrap:anywhere] md:text-base landscape:text-xs lg:landscape:text-sm ${
                          isRevealed ? '' : 'blur-[6px] select-none'
                        }`}
                      >
                        {isRevealed ? text : '••••••••••••••'}
                      </p>
                    </li>
                  )
                })}
              </ol>

              {/* Action — enten "Avslør neste" eller drikke-regel + neste kort */}
              {!allRevealed ? (
                <button
                  onClick={handleReveal}
                  className={primaryActionClass}
                >
                  Avslør påstand {revealed + 1}/{total}
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className={primaryActionClass}
                >
                  Neste kort →
                </button>
              )}

              {/* Progress-dots */}
              <div className="flex items-center justify-center gap-2 landscape:gap-1.5 pt-1 landscape:pt-0">
                {Array.from({ length: total }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 landscape:w-1.5 landscape:h-1.5 rounded-full transition-all ${
                      i < revealed ? 'bg-white' : 'bg-white/25'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FiveFingerHandProps {
  count: number
  total: number
}

// Natural hand heights in px: thumb, index, middle, ring, pinky
const FINGER_HEIGHTS = [38, 64, 80, 60, 46]

/** Stylized 5-finger hand. Fingers "fold down" as count increases. */
function FiveFingerHand({ count, total }: FiveFingerHandProps) {
  const fingerCount = Math.max(total, 5)

  return (
    <div className="flex items-end justify-center gap-2 md:gap-3 landscape:gap-3 lg:landscape:gap-4 landscape:scale-125 lg:landscape:scale-150 landscape:origin-bottom" style={{ height: 88 }}>
      {Array.from({ length: fingerCount }).map((_, i) => {
        const isDown = i < count
        const naturalH = FINGER_HEIGHTS[i] ?? 60
        return (
          <div
            key={i}
            className="origin-bottom transition-all duration-500 ease-out"
            style={{
              height: naturalH,
              transform: isDown ? 'scaleY(0.22)' : 'scaleY(1)',
              opacity: isDown ? 0.35 : 1,
            }}
          >
            <div
              className="w-6 md:w-7 rounded-t-full"
              style={{
                height: naturalH,
                backgroundColor: 'white',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
