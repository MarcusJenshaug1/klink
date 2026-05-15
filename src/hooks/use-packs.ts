'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Pack } from '@/types/game'

export function usePacks() {
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPacks = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('spillpakker')
      .select('id, navn, beskrivelse, regler, farge, ikon, aktiv, droyhet')
      .eq('aktiv', true)
      .order('opprettet_at', { ascending: true })

    if (err) {
      setError(err.message)
      setPacks([])
    } else {
      setPacks(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPacks()
  }, [fetchPacks])

  return { packs, loading, error, refetch: fetchPacks }
}
