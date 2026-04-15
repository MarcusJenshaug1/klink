'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Segment } from '@/lib/game/interpolate'

export interface TvCardPayload {
  segments: Segment[]
  utfordringSegments: Segment[] | null
  type: string
  tittel: string
  custom_author?: string
  hasTimer: boolean
  timerSekunder?: number | null
  packFarge: string
  packNavn: string
  players: string[]
  sips: number
  cardIndex: number
  total: number
}

/** Host-siden: abonnerer på klink-tv-${castCode} og sender card-change broadcasts. */
export function useTvBroadcast(castCode: string | undefined) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!castCode) return
    const supabase = createClient()
    const ch = supabase.channel(`klink-tv-${castCode}`).subscribe()
    channelRef.current = ch
    return () => {
      supabase.removeChannel(ch)
      channelRef.current = null
    }
  }, [castCode])

  const broadcast = useCallback((payload: TvCardPayload) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'card-change',
      payload,
    })
  }, [])

  return { broadcast }
}

/** TV-siden: abonnerer og mottar siste card-change payload. */
export function useTvReceive(code: string) {
  const [payload, setPayload] = useState<TvCardPayload | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!code) return
    const supabase = createClient()
    const ch = supabase
      .channel(`klink-tv-${code}`)
      .on('broadcast', { event: 'card-change' }, ({ payload: p }) => {
        setPayload(p as TvCardPayload)
      })
      .subscribe((status) => setConnected(status === 'SUBSCRIBED'))
    return () => { supabase.removeChannel(ch) }
  }, [code])

  return { payload, connected }
}
