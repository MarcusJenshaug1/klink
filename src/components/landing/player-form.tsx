'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, Undo2, X } from 'lucide-react'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'

interface PlayerFormProps {
  players: string[]
  onUpdate: (players: string[]) => void
}

const MAX_LEN = 24
const COUNTER_THRESHOLD = 18

interface RemovedSnapshot {
  name: string
  index: number
  expiresAt: number
}

export function PlayerForm({ players, onUpdate }: PlayerFormProps) {
  const { isActive: athina } = useAthina()
  const validCount = players.filter((n) => n.trim() !== '').length
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [removed, setRemoved] = useState<RemovedSnapshot | null>(null)

  // Klokk ut undo-snapshot etter 4 sek.
  useEffect(() => {
    if (!removed) return
    const t = setTimeout(() => setRemoved(null), 4000)
    return () => clearTimeout(t)
  }, [removed])

  const focusFirstBlank = () => {
    const blankIdx = players.findIndex((n) => n.trim() === '')
    if (blankIdx !== -1) {
      inputRefs.current[blankIdx]?.focus()
    }
  }

  const addPlayer = () => {
    // Hvis det finnes en blank rad, fokuser den i stedet for å legge til en ny.
    if (players.some((n) => n.trim() === '')) {
      focusFirstBlank()
      return
    }
    onUpdate([...players, ''])
  }

  const removePlayer = (i: number) => {
    const name = players[i]
    const next = players.filter((_, idx) => idx !== i)
    // Snapshot kun hvis det var et reelt navn (ikke en blank rad).
    if (name.trim() !== '') {
      setRemoved({ name, index: i, expiresAt: Date.now() + 4000 })
    }
    onUpdate(next)
  }

  const undoRemove = () => {
    if (!removed) return
    const next = [...players]
    const idx = Math.min(removed.index, next.length)
    next.splice(idx, 0, removed.name)
    onUpdate(next)
    setRemoved(null)
  }

  const updateName = (i: number, name: string) => {
    const updated = [...players]
    updated[i] = name
    onUpdate(updated)
  }

  return (
    <div className="space-y-4">
      <p className={cn('text-xs font-bold uppercase tracking-widest', athina ? 'text-white/60' : 'text-forest/50')}>
        Spillere
      </p>

      {/* Player list */}
      {players.length > 0 && (
        <div className={cn('divide-y', athina ? 'divide-white/10' : 'divide-forest/10')}>
          {players.map((name, i) => {
            const showCounter = name.length >= COUNTER_THRESHOLD
            return (
              <div key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                {/* Nummer */}
                <span className={cn('text-sm font-black w-5 text-center shrink-0 tabular-nums', athina ? 'text-white/30' : 'text-forest/30')}>
                  {i + 1}
                </span>

                {/* Input */}
                <input
                  ref={(el) => { inputRefs.current[i] = el }}
                  value={name}
                  onChange={(e) => updateName(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (name.trim()) addPlayer()
                    }
                  }}
                  placeholder={`Spiller ${i + 1}`}
                  autoFocus={i === players.length - 1 && name === ''}
                  aria-label={`Navn på spiller ${i + 1}`}
                  maxLength={MAX_LEN}
                  className={cn(
                    'flex-1 bg-transparent font-semibold text-base focus:outline-none min-w-0',
                    athina ? 'text-white placeholder:text-white/35' : 'text-forest placeholder:text-forest/30'
                  )}
                />

                {/* Tegn-teller (vises kun nær grensen) */}
                {showCounter && (
                  <span
                    aria-hidden
                    className={cn(
                      'shrink-0 text-[10px] font-bold tabular-nums tracking-wider',
                      name.length >= MAX_LEN
                        ? 'text-red-500'
                        : athina ? 'text-white/50' : 'text-forest/40'
                    )}
                  >
                    {name.length}/{MAX_LEN}
                  </span>
                )}

                {/* Fjern */}
                <button
                  onClick={() => removePlayer(i)}
                  aria-label={`Fjern spiller ${i + 1}`}
                  className={cn(
                    'shrink-0 w-11 h-11 -my-2 rounded-full flex items-center justify-center transition-colors',
                    athina ? 'text-white/35 hover:text-white/70 hover:bg-white/10' : 'text-forest/25 hover:text-forest/50 hover:bg-forest/8'
                  )}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Legg til (alltid aktiv — fokuserer blank rad om den finnes) */}
      <button
        onClick={addPlayer}
        className={cn(
          'w-full min-h-[44px] py-2.5 rounded-xl border-2 border-dashed flex items-center justify-center gap-1.5 font-semibold text-sm transition-all active:scale-95',
          athina ? 'border-white/20 text-white/55 hover:border-white/35 hover:text-white/80' : 'border-forest/20 text-forest/50 hover:border-forest/35 hover:text-forest/70'
        )}
      >
        <Plus className="w-4 h-4" />
        Legg til spiller
      </button>

      {validCount < 2 && (
        <p className={cn('text-xs text-center -mt-1', athina ? 'text-white/35' : 'text-forest/35')}>
          Minst 2 spillere kreves for å starte
        </p>
      )}

      {/* Undo-toast */}
      {removed && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 animate-fade-in',
            athina ? 'bg-white/20 text-white' : 'bg-forest text-lime'
          )}
          role="status"
          aria-live="polite"
        >
          <span className="text-sm font-semibold truncate">
            Fjernet <span className="font-black">{removed.name}</span>
          </span>
          <button
            onClick={undoRemove}
            className={cn(
              'inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black active:scale-95 transition',
              athina ? 'bg-white text-[#FF1493]' : 'bg-lime text-forest'
            )}
          >
            <Undo2 className="w-3 h-3" />
            Angre
          </button>
        </div>
      )}
    </div>
  )
}
