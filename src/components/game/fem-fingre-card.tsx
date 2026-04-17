'use client'

import { useEffect, useState } from 'react'
import { getCardTypeMeta } from '@/lib/game/card-types'
import type { Card, Pack, Korttype } from '@/types/game'

interface FemFingreCardProps {
  card: Card
  pack: Pack
  korttyper: Korttype[]
  onNext: () => void
}

export function FemFingreCard({ card, pack, korttyper, onNext }: FemFingreCardProps) {
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
      className="absolute inset-0 flex flex-col items-center justify-center px-5 landscape:px-20 pt-16 pb-24 transition-colors duration-700"
      style={{ backgroundColor: pack.farge }}
    >
      <div className="w-full max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-3xl landscape:max-w-2xl lg:landscape:max-w-3xl flex flex-col items-center gap-3 md:gap-5 landscape:gap-2">

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

        {/* Main card — frosted glass */}
        <div className="w-full bg-white/15 backdrop-blur-md rounded-3xl landscape:rounded-2xl p-6 md:p-10 lg:p-12 landscape:p-5 lg:landscape:p-10 flex flex-col gap-5 md:gap-7 landscape:gap-3 lg:landscape:gap-6 shadow-xl">

          {/* Hånd-visualisering: 5 fingre som bøyes ned etter hvert som påstander avsløres */}
          <FiveFingerHand count={revealed} total={total} />

          {/* Påstand-stack */}
          <ol className="flex flex-col gap-2.5">
            {paastander.map((text, i) => {
              const isRevealed = i < revealed
              return (
                <li
                  key={i}
                  className={`rounded-2xl px-4 py-3 flex items-start gap-3 transition-all duration-500 ${
                    isRevealed
                      ? 'bg-white/25 opacity-100 translate-y-0'
                      : 'bg-black/15 opacity-60 translate-y-0.5'
                  }`}
                >
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                      isRevealed ? 'bg-white text-forest' : 'bg-white/15 text-white/40'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <p
                    className={`text-white font-semibold leading-snug text-sm md:text-base flex-1 transition-all ${
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
              className="w-full flex items-center justify-center gap-2 bg-white/25 hover:bg-white/35 active:scale-95 text-white font-black text-base py-3.5 landscape:py-2.5 rounded-2xl transition-all"
            >
              Avslør påstand {revealed + 1}/{total}
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl bg-black/25 px-4 py-3.5 text-center">
                <p className="text-white font-black text-sm md:text-base leading-snug">
                  Drikk én slurk per finger nede — eller per finger oppe.
                </p>
                <p className="text-white/70 text-xs md:text-sm font-semibold mt-1">
                  Bestem selv før runden.
                </p>
              </div>
              <button
                onClick={onNext}
                className="w-full flex items-center justify-center gap-2 bg-white/25 hover:bg-white/35 active:scale-95 text-white font-black text-base py-3.5 landscape:py-2.5 rounded-2xl transition-all"
              >
                Neste kort →
              </button>
            </div>
          )}

          {/* Progress-dots */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i < revealed ? 'bg-white' : 'bg-white/25'
                }`}
              />
            ))}
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

/** Stylized 5-finger hand. Fingers "fold down" as count increases. */
function FiveFingerHand({ count, total }: FiveFingerHandProps) {
  const fingerCount = Math.max(total, 5)

  return (
    <div className="flex items-end justify-center gap-2 md:gap-3 h-20 md:h-24 landscape:h-14">
      {Array.from({ length: fingerCount }).map((_, i) => {
        const isDown = i < count
        return (
          <div
            key={i}
            className="origin-bottom transition-transform duration-500 ease-out"
            style={{ transform: isDown ? 'scaleY(0.28)' : 'scaleY(1)' }}
          >
            <div
              className={`w-5 md:w-6 h-16 md:h-20 landscape:h-12 rounded-t-full transition-colors duration-500 ${
                isDown ? 'bg-white/30' : 'bg-white'
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}
