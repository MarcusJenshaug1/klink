'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getDroyhetCopies } from '@/lib/game/droyhet'
import type { Droyhet } from '@/types/game'

interface CardMeta {
  spillpakke_id: string
  droyhet: string | null
}

export function useCardCounts(selectedDroyhet: Droyhet) {
  const [cardMeta, setCardMeta] = useState<CardMeta[]>([])
  const [loaded, setLoaded] = useState(false)

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
          .select('spillpakke_id, droyhet')
          .eq('aktiv', true)
          .range(from, from + pageSize - 1)

        if (error || !data) break
        all.push(...data)
        if (data.length < pageSize) break
        from += pageSize
      }

      if (!cancelled) {
        setCardMeta(all)
        setLoaded(true)
      }
    }

    loadAll()
    return () => { cancelled = true }
  }, [])

  const counts = useMemo(() => {
    const result: Record<string, number> = {}
    for (const card of cardMeta) {
      const effective = (card.droyhet ?? 'normal') as Droyhet
      if (getDroyhetCopies(selectedDroyhet, effective) > 0) {
        result[card.spillpakke_id] = (result[card.spillpakke_id] ?? 0) + 1
      }
    }
    return result
  }, [cardMeta, selectedDroyhet])

  return { counts, loaded }
}
