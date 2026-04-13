'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Card } from '@/types/game'

export function useCards() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCards = useCallback(async (packIds: string[]): Promise<Card[]> => {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('kort')
      .select('id, spillpakke_id, type, tittel, innhold, utfordring, timer_sekunder, timer_synlig')
      .in('spillpakke_id', packIds)

    setLoading(false)

    if (err) {
      setError(err.message)
      return []
    }

    return data ?? []
  }, [])

  return { fetchCards, loading, error }
}
