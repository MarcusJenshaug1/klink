'use client'

import { useEffect, useRef, useState } from 'react'
import { getCardTypeMeta } from '@/lib/game/card-types'
import { useAthina } from '@/context/athina-context'
import type { Korttype } from '@/types/game'

interface CardTypeIntroProps {
  type: string | undefined
  korttyper: Korttype[]
}

/**
 * Viser en stor, tydelig overlay når kort-typen endrer seg mellom to kort
 * (f.eks. Pekeleken → Snusboksen) – slik at spillerne ser at det nå er en
 * annen type kort. Viser ingenting når kort med samme type vises etter
 * hverandre, og heller ikke ved første kort i spillet.
 */
export function CardTypeIntro({ type, korttyper }: CardTypeIntroProps) {
  const { isActive: athina } = useAthina()
  const prevTypeRef = useRef<string | undefined>(type)
  const [animKey, setAnimKey] = useState<number | null>(null)

  useEffect(() => {
    if (!type) return
    if (prevTypeRef.current === type) return
    const isFirst = prevTypeRef.current === undefined
    prevTypeRef.current = type
    if (isFirst) return
    setAnimKey(Date.now())
    try { if (navigator.vibrate) navigator.vibrate(25) } catch {}
    const t = setTimeout(() => setAnimKey(null), 1400)
    return () => clearTimeout(t)
  }, [type])

  if (animKey === null || !type) return null
  const meta = getCardTypeMeta(type, korttyper)
  const Icon = meta.icon

  return (
    <div
      key={animKey}
      className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center animate-type-intro"
      aria-hidden
    >
      <div
        className="flex items-center gap-3 px-7 py-4 rounded-full shadow-2xl text-white uppercase tracking-[0.15em] font-black text-xl sm:text-2xl"
        style={
          meta.farge && !athina
            ? { backgroundColor: meta.farge }
            : athina
              ? { backgroundColor: '#FF1493' }
              : { backgroundColor: 'rgba(26,58,26,0.92)', backdropFilter: 'blur(6px)' }
        }
      >
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        <span>{meta.label}</span>
      </div>
    </div>
  )
}
