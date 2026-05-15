'use client'

import { Plus, X } from 'lucide-react'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'

interface PlayerFormProps {
  players: string[]
  onUpdate: (players: string[]) => void
}

export function PlayerForm({ players, onUpdate }: PlayerFormProps) {
  const { isActive: athina } = useAthina()
  const validCount = players.filter((n) => n.trim() !== '').length

  const hasBlank = players.some((n) => n.trim() === '')
  const addPlayer = () => {
    if (hasBlank) return
    onUpdate([...players, ''])
  }
  const removePlayer = (i: number) => onUpdate(players.filter((_, idx) => idx !== i))
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
          {players.map((name, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              {/* Nummer */}
              <span className={cn('text-sm font-black w-5 text-center shrink-0 tabular-nums', athina ? 'text-white/30' : 'text-forest/30')}>
                {i + 1}
              </span>

              {/* Input */}
              <input
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
                maxLength={24}
                className={cn(
                  'flex-1 bg-transparent font-semibold text-base focus:outline-none min-w-0',
                  athina ? 'text-white placeholder:text-white/35' : 'text-forest placeholder:text-forest/30'
                )}
              />

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
          ))}
        </div>
      )}

      {/* Legg til */}
      <button
        onClick={addPlayer}
        disabled={hasBlank}
        className={cn(
          'w-full min-h-[44px] py-2.5 rounded-xl border-2 border-dashed flex items-center justify-center gap-1.5 font-semibold text-sm transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none',
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
    </div>
  )
}
