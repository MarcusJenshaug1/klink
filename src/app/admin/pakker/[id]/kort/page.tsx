'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CardForm } from '@/components/admin/card-form'
import { CardList } from '@/components/admin/card-list'
import type { KortType, Korttype, Droyhet, Kjonn, Vekt } from '@/types/game'

interface CardRow {
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

export default function CardManagementPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const packId = params.id as string
  const kortId = searchParams.get('kortId') ?? undefined
  const [packName, setPackName] = useState('')
  const [packColor, setPackColor] = useState('#1A3A1A')
  const [cards, setCards] = useState<CardRow[]>([])
  const [korttyper, setKorttyper] = useState<Korttype[]>([])
  const [loading, setLoading] = useState(true)
  const [newCardOpen, setNewCardOpen] = useState(false)

  const loadCards = useCallback(async () => {
    const supabase = createClient()

    const { data: pack } = await supabase
      .from('spillpakker')
      .select('navn, farge')
      .eq('id', packId)
      .single()
    if (pack) {
      setPackName(pack.navn)
      setPackColor(pack.farge)
    }

    const [{ data }, { data: ktData }] = await Promise.all([
      supabase
        .from('kort')
        .select('id, type, tittel, innhold, utfordring, timer_sekunder, timer_synlig, aktiv, droyhet, min_spillere, slurker_lett, slurker_medium, slurker_borst, notater, kjonn, vekt, paastander')
        .eq('spillpakke_id', packId)
        .order('opprettet_at', { ascending: false }),
      supabase
        .from('korttyper')
        .select('id, label, icon_name, farge, beskrivelse')
        .order('opprettet_at', { ascending: true }),
    ])
    setCards(data ?? [])
    setKorttyper((ktData as Korttype[]) ?? [])
    setLoading(false)
  }, [packId])

  useEffect(() => { loadCards() }, [loadCards])

  // Close modal on ESC
  useEffect(() => {
    if (!newCardOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNewCardOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [newCardOpen])

  const aktivCount = cards.filter((c) => c.aktiv !== false).length

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Link href="/admin" className="text-forest/40 hover:text-forest transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div
          className="w-7 h-7 rounded-lg shrink-0"
          style={{ backgroundColor: packColor }}
        />
        <h1 className="font-display font-black text-3xl text-forest leading-none">
          {packName}
        </h1>
        <span className="text-forest/30 text-sm font-medium">
          {aktivCount} aktive · {cards.length - aktivCount} inaktive
        </span>
        <button
          onClick={() => setNewCardOpen(true)}
          className="ml-auto inline-flex items-center gap-2 bg-forest text-white px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-forest/80 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nytt kort
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-cream-dark/60 rounded-2xl">
          <p className="text-forest/40 font-semibold mb-3">Ingen kort i denne pakken enda.</p>
          <button
            onClick={() => setNewCardOpen(true)}
            className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-forest/80 transition-all"
          >
            <Plus className="w-4 h-4" />
            Legg til første kort
          </button>
        </div>
      ) : (
        <CardList packId={packId} packColor={packColor} cards={cards} korttyper={korttyper} onRefresh={loadCards} defaultEditId={kortId} />
      )}

      {/* New card modal */}
      {newCardOpen && (
        <div
          className="fixed inset-0 z-50 bg-forest/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setNewCardOpen(false)}
        >
          <div
            className="bg-cream rounded-3xl border border-cream-dark/40 w-full max-w-2xl my-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark/40 sticky top-0 bg-cream rounded-t-3xl">
              <h2 className="font-display font-black text-xl text-forest">Nytt kort</h2>
              <button
                onClick={() => setNewCardOpen(false)}
                className="p-2 rounded-xl text-forest/50 hover:text-forest hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <CardForm
                packId={packId}
                packColor={packColor}
                initialKorttyper={korttyper}
                compact
                onSaved={() => { loadCards(); setNewCardOpen(false) }}
                onCancel={() => setNewCardOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
