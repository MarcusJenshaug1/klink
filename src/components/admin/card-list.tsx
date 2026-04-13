'use client'

import { useState } from 'react'
import { Trash2, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CARD_TYPE_META } from '@/lib/game/card-types'
import { CardForm } from './card-form'
import type { KortType } from '@/types/game'

interface CardItem {
  id: string
  type: KortType
  tittel: string
  innhold: string
  utfordring?: string | null
  timer_sekunder?: number | null
  timer_synlig?: boolean
}

interface CardListProps {
  packId: string
  cards: CardItem[]
  onRefresh: () => void
}

export function CardList({ packId, cards, onRefresh }: CardListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  const allSelected = cards.length > 0 && selected.size === cards.length
  const someSelected = selected.size > 0

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(cards.map(c => c.id)))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Slett dette kortet?')) return
    const supabase = createClient()
    await supabase.from('kort').delete().eq('id', id)
    onRefresh()
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Slett ${selected.size} kort? Dette kan ikke angres.`)) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('kort').delete().in('id', [...selected])
    setSelected(new Set())
    setDeleting(false)
    onRefresh()
  }

  if (cards.length === 0) {
    return <p className="text-gray-500 text-center py-8">Ingen kort i denne pakken enda.</p>
  }

  return (
    <div>
      {/* Bulk action bar */}
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 rounded"
          />
          {someSelected ? `${selected.size} valgt` : 'Velg alle'}
        </label>

        {someSelected && (
          <button
            onClick={handleBulkDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Sletter...' : `Slett ${selected.size} kort`}
          </button>
        )}
      </div>

      {/* Card rows */}
      <div className="space-y-2">
        {cards.map((card) => (
          <div key={card.id} className="flex items-start gap-3">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selected.has(card.id)}
              onChange={() => toggleOne(card.id)}
              className="w-4 h-4 rounded mt-4 shrink-0 cursor-pointer"
            />

            <div className="flex-1 min-w-0">
              {editingId === card.id ? (
                <CardForm
                  packId={packId}
                  editCard={card}
                  onSaved={() => { setEditingId(null); onRefresh() }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {(() => {
                        const meta = CARD_TYPE_META[card.type]
                        const Icon = meta?.icon
                        return (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {Icon && <Icon className="w-3 h-3" />}
                            {meta?.label}
                          </span>
                        )
                      })()}
                    </div>
                    <p className="text-sm text-gray-800">{card.innhold}</p>
                    {card.utfordring && (
                      <p className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1 mt-1.5">
                        <Trophy className="w-3 h-3 shrink-0" />
                        {card.utfordring}
                      </p>
                    )}
                    {card.timer_sekunder != null && (
                      <span className="inline-flex items-center gap-1 text-xs text-violet-700 bg-violet-50 rounded-lg px-2 py-1 mt-1.5 ml-1">
                        ⏱ {card.timer_sekunder}s {card.timer_synlig ? '(synlig)' : '(skjult)'}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setEditingId(card.id)}
                      className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1"
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="text-xs text-red-400 hover:text-red-600 px-2 py-1"
                    >
                      Slett
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
