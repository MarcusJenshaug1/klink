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

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('kort')
      .select('spillpakke_id, droyhet')
      .eq('aktiv', true)
      .limit(1000)
      .then(({ data }) => {
        setCardMeta(data ?? [])
      })
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

  return { counts }
}
