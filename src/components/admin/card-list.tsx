'use client'

import { useState } from 'react'
import { Trash2, Trophy, Timer } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getCardTypeMeta } from '@/lib/game/card-types'
import { CardForm } from './card-form'
import { useConfirm } from './confirm-modal'
import type { KortType, Korttype } from '@/types/game'

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
  packColor?: string
  cards: CardItem[]
  korttyper?: Korttype[]
  onRefresh: () => void
}

export function CardList({ packId, packColor, cards, korttyper = [], onRefresh }: CardListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const { confirm, ConfirmDialog } = useConfirm()

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
    const ok = await confirm({ title: 'Slett kortet?', message: 'Dette kan ikke angres.', confirmLabel: 'Slett', danger: true })
    if (!ok) return
    const supabase = createClient()
    await supabase.from('kort').delete().eq('id', id)
    onRefresh()
  }

  const handleBulkDelete = async () => {
    const ok = await confirm({ title: `Slett ${selected.size} kort?`, message: 'Dette kan ikke angres.', confirmLabel: 'Slett alle', danger: true })
    if (!ok) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('kort').delete().in('id', [...selected])
    setSelected(new Set())
    setDeleting(false)
    onRefresh()
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 text-forest/30">
        <p className="font-semibold">Ingen kort i denne pakken enda.</p>
      </div>
    )
  }

  return (
    <div>
      {ConfirmDialog}
      {/* Bulk action bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <label className="flex items-center gap-2 text-sm text-forest/50 cursor-pointer select-none font-medium">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 rounded accent-forest"
          />
          {someSelected ? `${selected.size} valgt` : 'Velg alle'}
        </label>

        {someSelected && (
          <button
            onClick={handleBulkDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-700 disabled:opacity-50 px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {deleting ? 'Sletter...' : `Slett ${selected.size}`}
          </button>
        )}
      </div>

      {/* Card rows */}
      <div className="space-y-2">
        {cards.map((card) => (
          <div key={card.id} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={selected.has(card.id)}
              onChange={() => toggleOne(card.id)}
              className="w-4 h-4 rounded mt-5 shrink-0 cursor-pointer accent-forest"
            />

            <div className="flex-1 min-w-0">
              {editingId === card.id ? (
                <CardForm
                  packId={packId}
                  packColor={packColor}
                  editCard={card}
                  onSaved={() => { setEditingId(null); onRefresh() }}
                  onCancel={() => setEditingId(null)}
                  initialKorttyper={korttyper}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-cream-dark/40 p-4 flex items-start justify-between gap-4 hover:border-forest/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    {/* Type badge */}
                    {(() => {
                      const meta = getCardTypeMeta(card.type, korttyper)
                      const Icon = meta.icon
                      return (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-forest/8 text-forest/60 mb-2">
                          <Icon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      )
                    })()}

                    {card.tittel && (
                      <span className="inline-flex ml-1.5 text-xs font-semibold text-forest/40 mb-2">
                        — {card.tittel}
                      </span>
                    )}

                    <p className="text-sm text-forest leading-relaxed">{card.innhold}</p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {card.utfordring && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1 font-medium">
                          <Trophy className="w-3 h-3 shrink-0" />
                          {card.utfordring}
                        </span>
                      )}
                      {card.timer_sekunder != null && (
                        <span className="inline-flex items-center gap-1 text-xs text-violet-700 bg-violet-50 rounded-lg px-2 py-1 font-medium">
                          <Timer className="w-3 h-3" />
                          {card.timer_sekunder}s {card.timer_synlig ? '(synlig)' : '(skjult)'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0 mt-0.5">
                    <button
                      onClick={() => setEditingId(card.id)}
                      className="text-xs text-forest/40 hover:text-forest px-2.5 py-1.5 rounded-lg hover:bg-cream transition-colors font-medium"
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="text-xs text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
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
