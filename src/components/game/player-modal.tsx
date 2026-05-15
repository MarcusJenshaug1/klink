'use client'

import { useId, useState } from 'react'
import { X, Plus, UserRound, UserPlus, QrCode } from 'lucide-react'
import { useAthina } from '@/context/athina-context'
import { useDialogA11y } from '@/hooks/use-dialog-a11y'
import { cn } from '@/lib/utils'
import { QrScanPanel } from './qr-scan-panel'

interface PlayerModalProps {
  open: boolean
  onClose: () => void
  players: string[]
  onAddPlayer: (name: string) => void
  onRemovePlayer: (index: number) => void
}

type Mode = 'manual' | 'qr'

export function PlayerModal({ open, onClose, players, onAddPlayer, onRemovePlayer }: PlayerModalProps) {
  const [newName, setNewName] = useState('')
  const [mode, setMode] = useState<Mode>('manual')
  const { isActive: athina } = useAthina()
  const titleId = useId()
  const dialogRef = useDialogA11y(open, onClose)

  const handleAdd = () => {
    const name = newName.trim()
    if (name) {
      onAddPlayer(name)
      setNewName('')
    }
  }

  if (!open) return null

  const tabBase = 'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-black transition-all'
  const tabActive = athina ? 'bg-white/30 text-white shadow-sm' : 'bg-forest text-lime shadow-sm'
  const tabInactive = athina ? 'text-white/60 hover:text-white/80' : 'text-forest/50 hover:text-forest/80'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-slide-up transition-colors duration-500"
        style={{ backgroundColor: athina ? '#FF69B4' : '#A8E63D' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className={cn('w-10 h-1 rounded-full mx-auto mb-6', athina ? 'bg-white/25' : 'bg-forest/20')} />

        <div className="flex items-center justify-between mb-4">
          <h2 id={titleId} className={cn('font-display text-3xl font-black', athina ? 'text-white' : 'text-forest')}>Spillere</h2>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className={cn(
              'w-11 h-11 rounded-full flex items-center justify-center transition-colors',
              athina ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-forest/10 text-forest hover:bg-forest/20'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player list */}
        <div className={cn('backdrop-blur-sm rounded-2xl overflow-hidden mb-4', athina ? 'bg-white/18' : 'bg-white/60')}>
          {players.length === 0 ? (
            <p className={cn('text-sm text-center py-5 font-medium', athina ? 'text-white/50' : 'text-forest/40')}>
              Ingen spillere lagt til
            </p>
          ) : (
            <div className={cn('divide-y', athina ? 'divide-white/10' : 'divide-forest/10')}>
              {players.map((name, i) => {
                const hasCrown = /^athi|^atif/i.test(name.trim())
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-500" style={{ backgroundColor: athina ? '#E91E8C' : '#A8E63D' }}>
                      {name.trim() ? (
                        <span className={cn('text-xs font-black', athina ? 'text-white' : 'text-forest')}>{hasCrown ? '👑' : name[0].toUpperCase()}</span>
                      ) : (
                        <UserRound className={cn('w-3.5 h-3.5', athina ? 'text-white/50' : 'text-forest/50')} />
                      )}
                    </div>
                    <span className={cn('flex-1 font-semibold', athina ? 'text-white' : 'text-forest')}>{name}</span>
                    <button
                      onClick={() => onRemovePlayer(i)}
                      aria-label={`Fjern ${name}`}
                      disabled={players.length <= 2}
                      className={cn(
                        'w-11 h-11 rounded-full flex items-center justify-center text-white active:scale-90 transition-all disabled:invisible disabled:pointer-events-none',
                        athina ? 'bg-white/15 hover:bg-white/25' : 'bg-forest/40 hover:bg-forest/60'
                      )}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Mode toggle */}
        <div className={cn('flex gap-1 p-1 rounded-2xl mb-4', athina ? 'bg-white/15' : 'bg-forest/10')}>
          <button
            type="button"
            onClick={() => setMode('manual')}
            aria-pressed={mode === 'manual'}
            className={cn(tabBase, mode === 'manual' ? tabActive : tabInactive)}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Legg til selv
          </button>
          <button
            type="button"
            onClick={() => setMode('qr')}
            aria-pressed={mode === 'qr'}
            className={cn(tabBase, mode === 'qr' ? tabActive : tabInactive)}
          >
            <QrCode className="w-3.5 h-3.5" />
            Skann inn
          </button>
        </div>

        {mode === 'manual' ? (
          <div className="flex gap-2">
            <div className={cn('flex-1 backdrop-blur-sm rounded-2xl px-4 flex items-center', athina ? 'bg-white/18' : 'bg-white/60')}>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Legg til spiller..."
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                aria-label="Navn på ny spiller"
                className={cn(
                  'w-full bg-transparent font-semibold text-base focus:outline-none py-3',
                  athina ? 'text-white placeholder:text-white/40' : 'text-forest placeholder:text-forest/30'
                )}
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
        ) : (
          <QrScanPanel existingPlayers={players} onAddPlayer={onAddPlayer} />
        )}
      </div>
    </div>
  )
}
