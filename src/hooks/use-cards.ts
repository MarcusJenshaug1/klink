'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Card, Korttype } from '@/types/game'

export function useCards() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCards = useCallback(async (packIds: string[]): Promise<Card[]> => {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('kort')
      .select('id, spillpakke_id, type, tittel, innhold, utfordring, timer_sekunder, timer_synlig, aktiv, droyhet, min_spillere, slurker_lett, slurker_medium, slurker_borst, kjonn, vekt')
      .in('spillpakke_id', packIds)
      .eq('aktiv', true)

    setLoading(false)

    if (err) {
      setError(err.message)
      return []
    }

    return data ?? []
  }, [])

  const fetchKorttyper = useCallback(async (): Promise<Korttype[]> => {
    const supabase = createClient()
    const { data } = await supabase
      .from('korttyper')
      .select('id, label, icon_name, farge, beskrivelse')
      .order('opprettet_at', { ascending: true })
    return (data as Korttype[]) ?? []
  }, [])

  return { fetchCards, fetchKorttyper, loading, error }
}
