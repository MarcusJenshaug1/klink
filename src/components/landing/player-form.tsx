'use client'

import { Plus, X } from 'lucide-react'

interface PlayerFormProps {
  players: string[]
  onUpdate: (players: string[]) => void
}

export function PlayerForm({ players, onUpdate }: PlayerFormProps) {
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
      <p className="text-xs font-bold text-forest/50 uppercase tracking-widest">
        Spillere
      </p>

      {/* Player list */}
      {players.length > 0 && (
        <div className="divide-y divide-forest/10">
          {players.map((name, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              {/* Nummer */}
              <span className="text-sm font-black text-forest/30 w-5 text-center shrink-0 tabular-nums">
                {i + 1}
              </span>

              {/* Input */}
              <input
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                placeholder={`Spiller ${i + 1}`}
                autoFocus={i === players.length - 1 && name === ''}
                className="flex-1 bg-transparent text-forest placeholder:text-forest/30 font-semibold text-base focus:outline-none min-w-0"
              />

              {/* Fjern */}
              <button
                onClick={() => removePlayer(i)}
                aria-label={`Fjern spiller ${i + 1}`}
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-forest/25 hover:text-forest/50 hover:bg-forest/8 transition-colors"
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
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-forest/20 flex items-center justify-center gap-1.5 text-forest/50 font-semibold text-sm transition-all hover:border-forest/35 hover:text-forest/70 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
      >
        <Plus className="w-4 h-4" />
        Legg til spiller
      </button>

      {validCount < 2 && (
        <p className="text-xs text-forest/35 text-center -mt-1">
          Minst 2 spillere kreves for å starte
        </p>
      )}
    </div>
  )
}
