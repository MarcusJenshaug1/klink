'use client'

import { useState } from 'react'
import { X, Plus, UserRound } from 'lucide-react'
import { useAthina } from '@/context/athina-context'

interface PlayerModalProps {
  open: boolean
  onClose: () => void
  players: string[]
  onAddPlayer: (name: string) => void
  onRemovePlayer: (index: number) => void
}

export function PlayerModal({ open, onClose, players, onAddPlayer, onRemovePlayer }: PlayerModalProps) {
  const [newName, setNewName] = useState('')
  const { isActive: athina } = useAthina()

  const handleAdd = () => {
    const name = newName.trim()
    if (name) {
      onAddPlayer(name)
      setNewName('')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      <div
        className="relative w-full max-w-lg rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-slide-up transition-colors duration-500"
        style={{ backgroundColor: athina ? '#FF69B4' : '#A8E63D' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-forest/20 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl font-black text-forest">Spillere</h2>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center text-forest hover:bg-forest/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player list */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden mb-4">
          {players.length === 0 ? (
            <p className="text-forest/40 text-sm text-center py-5 font-medium">
              Ingen spillere lagt til
            </p>
          ) : (
            <div className="divide-y divide-forest/10">
              {players.map((name, i) => {
                const hasCrown = /^athi|^atif/i.test(name.trim())
                return (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-500" style={{ backgroundColor: athina ? '#E91E8C' : '#A8E63D' }}>
                    {name.trim() ? (
                      <span className="text-xs font-black text-forest">{hasCrown ? '👑' : name[0].toUpperCase()}</span>
                    ) : (
                      <UserRound className="w-3.5 h-3.5 text-forest/50" />
                    )}
                  </div>
                  <span className="flex-1 font-semibold text-forest">{name}</span>
                  <button
                    onClick={() => onRemovePlayer(i)}
                    aria-label={`Fjern ${name}`}
                    disabled={players.length <= 2}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-forest/25 hover:text-forest/50 hover:bg-forest/10 transition-colors disabled:opacity-20 disabled:pointer-events-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Add player */}
        <div className="flex gap-2">
          <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl px-4 flex items-center">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Legg til spiller..."
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="w-full bg-transparent text-forest placeholder:text-forest/30 font-semibold text-base focus:outline-none py-3"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            aria-label="Legg til"
            className={`w-12 h-12 rounded-2xl flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all ${athina ? 'bg-[#E91E8C] text-white' : 'bg-forest text-lime'}`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
