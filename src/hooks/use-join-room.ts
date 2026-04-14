'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

function generateCode(): string {
  // Unambiguous uppercase letters + digits (no 0/O, 1/I)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function useHostRoom() {
  const [code] = useState<string>(() => generateCode())
  const [players, setPlayers] = useState<string[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const channel: RealtimeChannel = supabase
      .channel(`klink-${code}`)
      .on('broadcast', { event: 'join' }, ({ payload }: { payload: { name?: string } }) => {
        const name = payload?.name?.trim()
        if (!name) return
        setPlayers((prev) => (prev.includes(name) ? prev : [...prev, name]))
      })
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED')
      })

    return () => { supabase.removeChannel(channel) }
  }, [code])

  const removePlayer = useCallback((name: string) => {
    setPlayers((prev) => prev.filter((p) => p !== name))
  }, [])

  return { code, players, connected, removePlayer }
}

export function usePlayerJoin(code: string) {
  const [connected, setConnected] = useState(false)
  const [sent, setSent] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!code) return
    const supabase = createClient()
    const channel: RealtimeChannel = supabase
      .channel(`klink-${code}`)
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED')
      })
    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [code])

  const sendJoin = useCallback(async (name: string): Promise<boolean> => {
    const ch = channelRef.current
    if (!ch) return false
    const result = await ch.send({
      type: 'broadcast',
      event: 'join',
      payload: { name },
    })
    if (result === 'ok') setSent(true)
    return result === 'ok'
  }, [])

  return { connected, sent, sendJoin }
}
