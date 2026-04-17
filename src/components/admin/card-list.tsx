'use client'

import { useMemo, useState } from 'react'
import { Trash2, Trophy, Timer, Eye, EyeOff, Pencil, Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getCardTypeMeta } from '@/lib/game/card-types'
import { CardForm } from './card-form'
import { useConfirm } from './confirm-modal'
import type { KortType, Korttype, Droyhet, Kjonn, Vekt } from '@/types/game'

interface CardItem {
  id: string
  type: KortType
  tittel: string
  innhold: string
  utfordring?: string | null
  timer_sekunder?: number | null
  timer_synlig?: boolean
  aktiv?: boolean
  droyhet?: Droyhet
  min_spillere?: number
  slurker_lett?: number | null
  slurker_medium?: number | null
  slurker_borst?: number | null
  notater?: string | null
  kjonn?: Kjonn
  vekt?: Vekt
  paastander?: string[] | null
}

interface CardListProps {
  packId: string
  packColor?: string
  cards: CardItem[]
  korttyper?: Korttype[]
  onRefresh: () => void
}

type FilterKey = 'alle' | 'aktive' | 'inaktive' | 'mild' | 'normal' | 'droy' | 'timer' | 'utfordring'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'aktive', label: 'Aktive' },
  { key: 'inaktive', label: 'Inaktive' },
  { key: 'mild', label: 'Mild' },
  { key: 'normal', label: 'Normal' },
  { key: 'droy', label: 'Drøy' },
  { key: 'timer', label: 'Med timer' },
  { key: 'utfordring', label: 'Med utfordring' },
]

const DROYHET_BADGE: Record<Droyhet, { label: string; cls: string }> = {
  mild: { label: 'Mild', cls: 'bg-green-50 text-green-700' },
  normal: { label: 'Normal', cls: 'bg-blue-50 text-blue-700' },
  droy: { label: 'Drøy', cls: 'bg-red-50 text-red-700' },
}

export function CardList({ packId, packColor, cards, korttyper = [], onRefresh }: CardListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<FilterKey>('alle')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const { confirm, ConfirmDialog } = useConfirm()

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return cards.filter((c) => {
      if (filter === 'aktive' && c.aktiv === false) return false
      if (filter === 'inaktive' && c.aktiv !== false) return false
      if (filter === 'mild' && c.droyhet !== 'mild') return false
      if (filter === 'normal' && (c.droyhet ?? 'normal') !== 'normal') return false
      if (filter === 'droy' && c.droyhet !== 'droy') return false
      if (filter === 'timer' && c.timer_sekunder == null) return false
      if (filter === 'utfordring' && !c.utfordring) return false
      if (q) {
        const hay = [
          c.innhold,
          c.tittel ?? '',
          ...(c.paastander ?? []),
        ].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [cards, filter, search])

  const counts = useMemo(() => ({
    alle: cards.length,
    aktive: cards.filter((c) => c.aktiv !== false).length,
    inaktive: cards.filter((c) => c.aktiv === false).length,
    mild: cards.filter((c) => c.droyhet === 'mild').length,
    normal: cards.filter((c) => (c.droyhet ?? 'normal') === 'normal').length,
    droy: cards.filter((c) => c.droyhet === 'droy').length,
    timer: cards.filter((c) => c.timer_sekunder != null).length,
    utfordring: cards.filter((c) => !!c.utfordring).length,
  }), [cards])

  const allVisibleSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id))

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      const next = new Set(selected)
      for (const c of filtered) next.delete(c.id)
      setSelected(next)
    } else {
      const next = new Set(selected)
      for (const c of filtered) next.add(c.id)
      setSelected(next)
    }
  }

  const clearSelection = () => setSelected(new Set())

  const toggleAktiv = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('kort').update({ aktiv: !current }).eq('id', id)
    onRefresh()
  }

  const handleDelete = async (id: string) => {
    const ok = await confirm({ title: 'Slett kortet?', message: 'Dette kan ikke angres.', confirmLabel: 'Slett', danger: true })
    if (!ok) return
    const supabase = createClient()
    await supabase.from('kort').delete().eq('id', id)
    onRefresh()
  }

  const bulkDelete = async () => {
    const ok = await confirm({ title: `Slett ${selected.size} kort?`, message: 'Dette kan ikke angres.', confirmLabel: 'Slett alle', danger: true })
    if (!ok) return
    setBusy(true)
    const supabase = createClient()
    await supabase.from('kort').delete().in('id', [...selected])
    clearSelection()
    setBusy(false)
    onRefresh()
  }

  const bulkAktiv = async (aktiv: boolean) => {
    setBusy(true)
    const supabase = createClient()
    await supabase.from('kort').update({ aktiv }).in('id', [...selected])
    clearSelection()
    setBusy(false)
    onRefresh()
  }

  const bulkDroyhet = async (droyhet: Droyhet) => {
    setBusy(true)
    const supabase = createClient()
    await supabase.from('kort').update({ droyhet }).in('id', [...selected])
    clearSelection()
    setBusy(false)
    onRefresh()
  }

  const bulkMinSpillere = async (n: number) => {
    setBusy(true)
    const supabase = createClient()
    await supabase.from('kort').update({ min_spillere: n }).in('id', [...selected])
    clearSelection()
    setBusy(false)
    onRefresh()
  }

  return (
    <div>
      {ConfirmDialog}

      {/* Search + filters */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søk i kort ..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-cream-dark/60 rounded-xl text-sm text-forest focus:outline-none focus:border-forest/40"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const selected = filter === f.key
            const n = counts[f.key]
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  selected ? 'bg-forest text-white' : 'bg-white text-forest/60 hover:bg-cream border border-cream-dark/40'
                }`}
              >
                {f.label}
                <span className={`text-[10px] font-semibold ${selected ? 'text-white/70' : 'text-forest/30'}`}>{n}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="sticky top-0 z-10 mb-3 bg-forest text-white rounded-2xl px-4 py-2.5 flex items-center gap-3 flex-wrap shadow-md">
          <span className="text-sm font-bold">{selected.size} valgt</span>
          <div className="h-4 w-px bg-white/30" />
          <button onClick={() => bulkAktiv(true)} disabled={busy} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-50">
            Aktiver
          </button>
          <button onClick={() => bulkAktiv(false)} disabled={busy} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-50">
            Deaktiver
          </button>
          <div className="h-4 w-px bg-white/30" />
          <button onClick={() => bulkDroyhet('mild')} disabled={busy} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-50">
            → Mild
          </button>
          <button onClick={() => bulkDroyhet('normal')} disabled={busy} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-50">
            → Normal
          </button>
          <button onClick={() => bulkDroyhet('droy')} disabled={busy} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-50">
            → Drøy
          </button>
          <div className="h-4 w-px bg-white/30" />
          <span className="text-xs text-white/60 font-bold">Min. spillere:</span>
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => bulkMinSpillere(n)}
              disabled={busy}
              className="text-xs font-bold w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-50 flex items-center justify-center"
            >
              {n}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button onClick={bulkDelete} disabled={busy} className="text-xs font-bold px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 inline-flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Slett
            </button>
            <button onClick={clearSelection} className="text-xs text-white/70 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Select-all + count */}
      <div className="flex items-center justify-between mb-3 px-1">
        <label className="flex items-center gap-2 text-sm text-forest/50 cursor-pointer select-none font-medium">
          <input
            type="checkbox"
            checked={allVisibleSelected}
            onChange={toggleAllVisible}
            className="w-4 h-4 rounded accent-forest"
          />
          Velg alle synlige
        </label>
        <span className="text-xs text-forest/40">
          Viser {filtered.length} av {cards.length}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-forest/30">
          <p className="font-semibold">Ingen kort matcher filteret.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((card) => {
            const isSelected = selected.has(card.id)
            const isExpanded = expandedId === card.id
            const isEditing = editingId === card.id
            const isInactive = card.aktiv === false

            if (isEditing) {
              return (
                <div key={card.id} className="bg-white rounded-2xl border-2 border-forest/30 p-5">
                  <CardForm
                    packId={packId}
                    packColor={packColor}
                    editCard={card}
                    onSaved={() => { setEditingId(null); onRefresh() }}
                    onCancel={() => setEditingId(null)}
                    initialKorttyper={korttyper}
                  />
                </div>
              )
            }

            return (
              <div
                key={card.id}
                className={`bg-white rounded-xl border border-cream-dark/40 hover:border-forest/20 transition-colors ${isInactive ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-2 p-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOne(card.id)}
                    className="w-4 h-4 rounded mt-1 shrink-0 cursor-pointer accent-forest"
                  />

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : card.id)}
                  >
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {(() => {
                        const meta = getCardTypeMeta(card.type, korttyper)
                        const Icon = meta.icon
                        return (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest/8 text-forest/70">
                            <Icon className="w-3 h-3" />
                            {meta.label}
                          </span>
                        )
                      })()}
                      {card.droyhet && card.droyhet !== 'normal' && (
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${DROYHET_BADGE[card.droyhet].cls}`}>
                          {DROYHET_BADGE[card.droyhet].label}
                        </span>
                      )}
                      {isInactive && (
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest/15 text-forest/70">
                          Inaktiv
                        </span>
                      )}
                      {card.min_spillere != null && card.min_spillere > 2 && (
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest/8 text-forest/60">
                          {card.min_spillere}+ spillere
                        </span>
                      )}
                      {card.vekt === 'sjelden' && (
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Sjelden</span>
                      )}
                      {card.vekt === 'ofte' && (
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Ofte</span>
                      )}
                      {card.tittel && <span className="text-[11px] text-forest/40 font-medium">— {card.tittel}</span>}
                    </div>

                    {card.type === 'femfingre' && card.paastander?.length ? (
                      <ol className={`text-sm text-forest leading-snug list-decimal pl-5 space-y-0.5 ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {card.paastander.map((p, i) => <li key={i}>{p}</li>)}
                      </ol>
                    ) : (
                      <p className={`text-sm text-forest leading-snug ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {card.innhold}
                      </p>
                    )}

                    {isExpanded && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
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
                        {(card.slurker_lett != null || card.slurker_medium != null || card.slurker_borst != null) && (
                          <span className="inline-flex items-center text-xs text-sky-700 bg-sky-50 rounded-lg px-2 py-1 font-medium">
                            Fast slurker: L{card.slurker_lett ?? '—'} / M{card.slurker_medium ?? '—'} / B{card.slurker_borst ?? '—'}
                          </span>
                        )}
                        {card.notater && (
                          <span className="inline-flex items-center text-xs text-forest/60 bg-cream rounded-lg px-2 py-1 italic">
                            📝 {card.notater}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleAktiv(card.id, card.aktiv !== false) }}
                      title={isInactive ? 'Aktiver' : 'Deaktiver'}
                      className="p-2 rounded-lg text-forest/40 hover:text-forest hover:bg-cream transition-colors"
                    >
                      {isInactive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingId(card.id) }}
                      title="Rediger"
                      className="p-2 rounded-lg text-forest/40 hover:text-forest hover:bg-cream transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(card.id) }}
                      title="Slett"
                      className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
