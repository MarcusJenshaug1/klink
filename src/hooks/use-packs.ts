'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Pack } from '@/types/game'

export function usePacks() {
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchPacks() {
      const { data, error: err } = await supabase
        .from('spillpakker')
        .select('id, navn, beskrivelse, regler, farge, ikon, aktiv')
        .eq('aktiv', true)
        .order('opprettet_at', { ascending: true })

      if (err) {
        setError(err.message)
      } else {
        setPacks(data ?? [])
      }
      setLoading(false)
    }

    fetchPacks()
  }, [])

  return { packs, loading, error }
}
