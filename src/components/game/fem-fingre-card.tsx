'use client'

import { useEffect, useState } from 'react'
import { getCardTypeMeta } from '@/lib/game/card-types'
import { useAthina } from '@/context/athina-context'
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

  const handleReveal = () => {
    if (canReveal) setRevealed((n) => Math.min(n + 1, total))
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-5 landscape:px-20 pt-16 pb-24 landscape:pt-12 landscape:pb-16 transition-colors duration-700"
      style={{ backgroundColor: athina ? 'transparent' : pack.farge }}
    >
      <div className="w-full max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-3xl landscape:max-w-4xl lg:landscape:max-w-5xl flex flex-col items-center gap-3 md:gap-5 landscape:gap-2">

        {/* Category badge */}
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

        {/* Main card — frosted glass; stop propagation while revealing to avoid accidental next-card */}
        <div
          className={`relative overflow-hidden w-full ${athina ? 'bg-white/18' : 'bg-white/15'} backdrop-blur-md rounded-3xl landscape:rounded-2xl p-6 md:p-10 lg:p-12 landscape:p-4 lg:landscape:p-6 flex flex-col gap-5 md:gap-7 landscape:gap-3 lg:landscape:gap-4 shadow-xl`}
          onClick={canReveal ? (e) => e.stopPropagation() : undefined}
        >
          {athina && (
            <div className="absolute inset-0 rounded-3xl landscape:rounded-2xl bg-[#FF1493]/30 pointer-events-none" />
          )}

          {/* Landscape: 2-column (hand left, statements right). Portrait: stacked. */}
          <div className="flex flex-col landscape:flex-row landscape:items-center gap-5 md:gap-7 landscape:gap-6">

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
                      className={`rounded-2xl landscape:rounded-xl px-4 py-3 landscape:px-3 landscape:py-1.5 flex items-start gap-3 landscape:gap-2 transition-all duration-500 ${
                        isRevealed
                          ? 'bg-white/25 opacity-100 translate-y-0'
                          : 'bg-black/15 opacity-60 translate-y-0.5'
                      }`}
                    >
                      <span
                        className={`shrink-0 w-7 h-7 landscape:w-5 landscape:h-5 rounded-full flex items-center justify-center text-xs landscape:text-[10px] font-black transition-colors ${
                          isRevealed ? (athina ? 'bg-white text-[#FF1493]' : 'bg-white text-forest') : 'bg-white/15 text-white/40'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <p
                        className={`text-white font-semibold leading-snug text-sm md:text-base landscape:text-xs lg:landscape:text-sm flex-1 transition-all ${
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
                  className="relative w-full flex items-center justify-center gap-2 active:scale-95 font-black text-base landscape:text-sm py-3.5 landscape:py-2 rounded-2xl landscape:rounded-xl transition-all hover:opacity-90"
                  style={{ backgroundColor: 'white', color: athina ? '#FF1493' : pack.farge }}
                >
                  Avslør påstand {revealed + 1}/{total}
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="w-full flex items-center justify-center gap-2 bg-white/25 hover:bg-white/35 active:scale-95 text-white font-black text-base landscape:text-sm py-3.5 landscape:py-2 rounded-2xl landscape:rounded-xl transition-all"
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
