'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CardForm } from '@/components/admin/card-form'
import { CardList } from '@/components/admin/card-list'
import type { KortType } from '@/types/game'

interface CardRow {
  id: string
  type: KortType
  tittel: string
  innhold: string
  utfordring?: string | null
  timer_sekunder?: number | null
  timer_synlig?: boolean
}

export default function CardManagementPage() {
  const params = useParams()
  const packId = params.id as string
  const [packName, setPackName] = useState('')
  const [cards, setCards] = useState<CardRow[]>([])
  const [loading, setLoading] = useState(true)

  const loadCards = useCallback(async () => {
    const supabase = createClient()

    const { data: pack } = await supabase
      .from('spillpakker')
      .select('navn')
      .eq('id', packId)
      .single()
    if (pack) setPackName(pack.navn)

    const { data } = await supabase
      .from('kort')
      .select('id, type, tittel, innhold, utfordring, timer_sekunder, timer_synlig')
      .eq('spillpakke_id', packId)
      .order('opprettet_at', { ascending: true })
    setCards(data ?? [])
    setLoading(false)
  }, [packId])

  useEffect(() => { loadCards() }, [loadCards])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin"
          className="text-gray-400 hover:text-gray-600"
          aria-label="Tilbake"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Kort: {packName}</h1>
        <span className="text-gray-400 text-sm">({cards.length} kort)</span>
      </div>

      {/* Add new card form */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Legg til nytt kort
        </h2>
        <CardForm packId={packId} onSaved={loadCards} />
      </div>

      {/* Card list */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Alle kort
        </h2>
        {loading ? (
          <p className="text-gray-500">Laster...</p>
        ) : (
          <CardList packId={packId} cards={cards} onRefresh={loadCards} />
        )}
      </div>
    </div>
  )
}
