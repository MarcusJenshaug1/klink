'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { Wifi, WifiOff } from 'lucide-react'
import { useHostRoom } from '@/hooks/use-join-room'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'

interface QrScanPanelProps {
  existingPlayers: string[]
  onAddPlayer: (name: string) => void
}

export function QrScanPanel({ existingPlayers, onAddPlayer }: QrScanPanelProps) {
  const { code, players: joined, connected } = useHostRoom()
  const { isActive: athina } = useAthina()
  const [joinUrl, setJoinUrl] = useState('')
  const forwarded = useRef<Set<string>>(new Set())

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/join/${code}`)
  }, [code])

  useEffect(() => {
    for (const name of joined) {
      if (forwarded.current.has(name)) continue
      forwarded.current.add(name)
      if (!existingPlayers.includes(name)) onAddPlayer(name)
    }
  }, [joined, existingPlayers, onAddPlayer])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white rounded-2xl p-3 shadow-sm">
        {joinUrl ? (
          <QRCode value={joinUrl} size={140} />
        ) : (
          <div className="w-[140px] h-[140px] bg-forest/5 rounded-xl animate-pulse" />
        )}
      </div>

      <div className="w-full text-center space-y-0.5">
        <p className="font-black text-2xl tracking-[0.2em] text-forest">
          {code}
        </p>
        <p className="text-xs font-semibold break-all text-forest/50">
          {joinUrl || 'klinkn.no/join/…'}
        </p>
      </div>

      <div
        className={cn(
          'flex items-center gap-1.5 text-xs font-semibold',
          connected
            ? athina ? 'text-white/70' : 'text-forest/60'
            : 'text-red-500/70',
        )}
      >
        {connected ? (
          <>
            <Wifi className="w-3 h-3" /> Nye spillere dukker opp her
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" /> Kobler til…
          </>
        )}
      </div>
    </div>
  )
}
