'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
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
  standard_slurker?: number | null
  notater?: string | null
  kjonn?: Kjonn
  vekt?: Vekt
}

export default function CardManagementPage() {
  const params = useParams()
  const packId = params.id as string
  const [packName, setPackName] = useState('')
  const [packColor, setPackColor] = useState('#1A3A1A')
  const [cards, setCards] = useState<CardRow[]>([])
  const [korttyper, setKorttyper] = useState<Korttype[]>([])
  const [loading, setLoading] = useState(true)

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
        .select('id, type, tittel, innhold, utfordring, timer_sekunder, timer_synlig, aktiv, droyhet, min_spillere, standard_slurker, notater, kjonn, vekt')
        .eq('spillpakke_id', packId)
        .order('opprettet_at', { ascending: true }),
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
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
        <span className="text-forest/30 text-sm font-medium">({cards.length} kort)</span>
      </div>

      {/* Add new card */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-forest/40 uppercase tracking-wider mb-3 px-1">
          Legg til nytt kort
        </h2>
        <CardForm packId={packId} packColor={packColor} onSaved={loadCards} />
      </div>

      {/* Card list */}
      <div>
        <h2 className="text-xs font-bold text-forest/40 uppercase tracking-wider mb-3 px-1">
          Alle kort
        </h2>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : (
          <CardList packId={packId} packColor={packColor} cards={cards} korttyper={korttyper} onRefresh={loadCards} />
        )}
      </div>
    </div>
  )
}
