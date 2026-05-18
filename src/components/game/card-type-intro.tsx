'use client'

import { useEffect, useRef, useState } from 'react'
import { getCardTypeMeta } from '@/lib/game/card-types'
import { useAthina } from '@/context/athina-context'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { Korttype } from '@/types/game'

interface CardTypeIntroProps {
  type: string | undefined
  korttyper: Korttype[]
}

const SEEN_KEY = 'klink-seen-card-types'
const FIRST_TIME_MS = 2400
const REPEAT_MS = 1400

function loadSeen(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SEEN_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch { return new Set() }
}
function saveSeen(set: Set<string>) {
  try { sessionStorage.setItem(SEEN_KEY, JSON.stringify([...set])) } catch { /* ignore */ }
}

/**
 * Stor overlay når kort-typen endrer seg. Første gang en type dukker opp
 * vises også beskrivelsen, slik at brukerne lærer mekanikken.
 */
export function CardTypeIntro({ type, korttyper }: CardTypeIntroProps) {
  const { isActive: athina } = useAthina()
  const reducedMotion = useReducedMotion()
  const prevTypeRef = useRef<string | undefined>(type)
  const seenRef = useRef<Set<string>>(typeof window === 'undefined' ? new Set() : loadSeen())
  const [animKey, setAnimKey] = useState<number | null>(null)
  const [isFirstTime, setIsFirstTime] = useState(false)

  useEffect(() => {
    if (!type) return
    if (prevTypeRef.current === type) return
    const isFirstCard = prevTypeRef.current === undefined
    prevTypeRef.current = type
    if (isFirstCard) {
      // Marker første kort som sett uten å vise overlay (HUD viser typen allerede).
      seenRef.current.add(type)
      saveSeen(seenRef.current)
      return
    }
    const firstTime = !seenRef.current.has(type)
    seenRef.current.add(type)
    saveSeen(seenRef.current)
    setIsFirstTime(firstTime)
    setAnimKey(Date.now())
    if (!reducedMotion) {
      try { if (navigator.vibrate) navigator.vibrate(25) } catch {}
    }
    const t = setTimeout(() => setAnimKey(null), firstTime ? FIRST_TIME_MS : REPEAT_MS)
    return () => clearTimeout(t)
  }, [type, reducedMotion])

  if (animKey === null || !type) return null
  const meta = getCardTypeMeta(type, korttyper)
  const Icon = meta.icon

  return (
    <div
      key={animKey}
      className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center px-6 animate-type-intro"
      aria-hidden
    >
      <div
        className="flex max-w-md flex-col items-center gap-3 rounded-3xl border border-white/20 px-6 py-5 text-white shadow-2xl backdrop-blur-sm"
        style={
          meta.farge && !athina
            ? { backgroundColor: meta.farge }
            : athina
              ? { backgroundColor: '#FF1493' }
              : { backgroundColor: 'rgba(26,58,26,0.92)', backdropFilter: 'blur(6px)' }
        }
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-7 w-7 sm:h-8 sm:w-8 shrink-0" />
          <span className="text-base font-black uppercase tracking-widest sm:text-xl">{meta.label}</span>
        </div>
        {isFirstTime && meta.beskrivelse && (
          <p className="text-center text-sm font-medium leading-snug text-white/90">
            {meta.beskrivelse}
          </p>
        )}
      </div>
    </div>
  )
}
