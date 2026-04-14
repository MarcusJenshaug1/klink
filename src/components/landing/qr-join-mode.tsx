'use client'

import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { Users, Wifi, WifiOff, X } from 'lucide-react'
import { useHostRoom } from '@/hooks/use-join-room'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'

interface QrJoinModeProps {
  onPlayersReady: (players: string[]) => void
}

export function QrJoinMode({ onPlayersReady }: QrJoinModeProps) {
  const { code, players, connected, removePlayer } = useHostRoom()
  const { isActive: athina } = useAthina()
  const [joinUrl, setJoinUrl] = useState('')

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/join/${code}`)
  }, [code])

  const canStart = players.length >= 2

  return (
    <div className="space-y-4">
      <p className={cn(
        'text-xs font-bold uppercase tracking-widest',
        athina ? 'text-white/60' : 'text-forest/50'
      )}>
        Spillere
      </p>

      {/* QR code + URL */}
      <div className="flex flex-col items-center gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {joinUrl ? (
            <QRCode value={joinUrl} size={160} />
          ) : (
            <div className="w-40 h-40 bg-forest/5 rounded-xl animate-pulse" />
          )}
        </div>

        {/* Code + URL */}
        <div className="w-full text-center space-y-1">
          <p className={cn(
            'font-black text-3xl tracking-[0.2em]',
            athina ? 'text-white' : 'text-forest'
          )}>
            {code}
          </p>
          <p className={cn(
            'text-xs font-semibold break-all',
            athina ? 'text-white/50' : 'text-forest/40'
          )}>
            {joinUrl || 'klinkn.no/join/…'}
          </p>
        </div>

        {/* Connection status */}
        <div className={cn(
          'flex items-center gap-1.5 text-xs font-semibold',
          connected
            ? athina ? 'text-white/60' : 'text-forest/50'
            : 'text-red-500/70'
        )}>
          {connected
            ? <><Wifi className="w-3 h-3" /> Klar for spillere</>
            : <><WifiOff className="w-3 h-3" /> Kobler til…</>
          }
        </div>
      </div>

      {/* Player list */}
      {players.length > 0 ? (
        <div className={cn(
          'rounded-2xl divide-y',
          athina ? 'divide-white/10' : 'divide-forest/10'
        )}>
          {players.map((name, i) => (
            <div key={name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <span className={cn(
                'text-sm font-black w-5 text-center shrink-0 tabular-nums',
                athina ? 'text-white/30' : 'text-forest/30'
              )}>
                {i + 1}
              </span>
              <span className={cn(
                'flex-1 font-semibold text-base',
                athina ? 'text-white' : 'text-forest'
              )}>
                {name}
              </span>
              <button
                onClick={() => removePlayer(name)}
                aria-label={`Fjern ${name}`}
                className={cn(
                  'shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                  athina
                    ? 'text-white/25 hover:text-white/60 hover:bg-white/10'
                    : 'text-forest/25 hover:text-forest/50 hover:bg-forest/8'
                )}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={cn(
          'flex flex-col items-center gap-2 py-6 text-center',
          athina ? 'text-white/40' : 'text-forest/40'
        )}>
          <Users className="w-8 h-8 opacity-40" />
          <p className="text-sm font-semibold">Spillere som skanner QR-koden dukker opp her</p>
        </div>
      )}

      {!canStart && players.length > 0 && (
        <p className={cn(
          'text-xs text-center font-semibold',
          athina ? 'text-white/35' : 'text-forest/35'
        )}>
          Minst 2 spillere kreves for å starte
        </p>
      )}

      {/* Start button — only shown when enough players */}
      {canStart && (
        <button
          onClick={() => onPlayersReady(players)}
          className={cn(
            'w-full min-h-[52px] rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95',
            athina
              ? 'bg-white/30 text-white shadow-lg hover:bg-white/40 backdrop-blur-sm'
              : 'bg-forest text-lime shadow-lg hover:bg-forest-light'
          )}
        >
          Alle er med — neste →
        </button>
      )}
    </div>
  )
}
