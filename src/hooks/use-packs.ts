'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Pack } from '@/types/game'

const CACHE_KEY = 'klink-packs-cache'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

function loadCache(): Pack[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { at: number; packs: Pack[] }
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null
    return parsed.packs
  } catch { return null }
}

function saveCache(packs: Pack[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), packs }))
  } catch { /* ignore */ }
}

export function usePacks() {
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPacks = useCallback(async () => {
    const supabase = createClient()
    setError(null)
    const cached = typeof window !== 'undefined' ? loadCache() : null
    if (cached && cached.length > 0) {
      setPacks(cached)
      setLoading(false)
    } else {
      setLoading(true)
    }
    const { data, error: err } = await supabase
      .from('spillpakker')
      .select('id, navn, beskrivelse, regler, farge, ikon, aktiv, droyhet')
      .eq('aktiv', true)
      .order('opprettet_at', { ascending: true })

    if (err) {
      // Fall tilbake til cache hvis vi har den; ellers vis feil.
      if (cached && cached.length > 0) {
        setError(null)
      } else {
        setError(err.message)
        setPacks([])
      }
    } else {
      const next = data ?? []
      setPacks(next)
      if (typeof window !== 'undefined') saveCache(next)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPacks()
  }, [fetchPacks])

  return { packs, loading, error, refetch: fetchPacks }
}
