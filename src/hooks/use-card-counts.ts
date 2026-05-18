'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getDroyhetCopies } from '@/lib/game/droyhet'
import type { Droyhet } from '@/types/game'

interface CardMeta {
  spillpakke_id: string
  droyhet: string | null
  min_spillere: number | null
  innhold: string | null
  utfordring: string | null
}

function maxNumberedSlot(text: string | null): number {
  if (!text) return 0
  let max = 0
  const re = /\{spiller(\d+)\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const n = parseInt(m[1])
    if (n > max) max = n
  }
  return max
}

export function useCardCounts(selectedDroyhet: Droyhet, playerCount?: number) {
  const [cardMeta, setCardMeta] = useState<CardMeta[]>([])

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function loadAll() {
      const pageSize = 1000
      let from = 0
      const all: CardMeta[] = []

      while (!cancelled) {
        const { data, error } = await supabase
          .from('kort')
          .select('spillpakke_id, droyhet, min_spillere, innhold, utfordring')
          .eq('aktiv', true)
          .range(from, from + pageSize - 1)

        if (error || !data) break
        all.push(...data)
        if (data.length < pageSize) break
        from += pageSize
      }

      if (!cancelled) setCardMeta(all)
    }

    loadAll()
    return () => { cancelled = true }
  }, [])

  const counts = useMemo(() => {
    const result: Record<string, number> = {}
    for (const card of cardMeta) {
      const effective = (card.droyhet ?? 'normal') as Droyhet
      if (getDroyhetCopies(selectedDroyhet, effective) <= 0) continue
      if (playerCount !== undefined) {
        const minReq = card.min_spillere ?? 2
        if (minReq > playerCount) continue
        const slotMax = Math.max(
          maxNumberedSlot(card.innhold),
          maxNumberedSlot(card.utfordring)
        )
        if (slotMax > playerCount) continue
      }
      result[card.spillpakke_id] = (result[card.spillpakke_id] ?? 0) + 1
    }
    return result
  }, [cardMeta, selectedDroyhet, playerCount])

  return { counts }
}
