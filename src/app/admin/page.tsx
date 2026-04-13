'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PackSummary {
  id: string
  navn: string
  farge: string
  aktiv: boolean
  card_count: number
}

export default function AdminDashboard() {
  const [packs, setPacks] = useState<PackSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: packData } = await supabase
        .from('spillpakker')
        .select('id, navn, farge, aktiv')
        .order('opprettet_at', { ascending: true })

      if (packData) {
        const summaries: PackSummary[] = await Promise.all(
          packData.map(async (p) => {
            const { count } = await supabase
              .from('kort')
              .select('*', { count: 'exact', head: true })
              .eq('spillpakke_id', p.id)
            return { ...p, card_count: count ?? 0 }
          })
        )
        setPacks(summaries)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-black text-3xl text-forest">Dashboard</h1>
        <Link
          href="/admin/pakker/ny"
          className="inline-flex items-center gap-2 bg-forest text-white px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-forest/80 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Ny pakke
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : packs.length === 0 ? (
        <div className="text-center py-16 text-forest/40">
          <p className="text-lg font-semibold">Ingen spillpakker enda</p>
          <Link href="/admin/pakker/ny" className="text-forest underline mt-2 inline-block text-sm">
            Opprett din første pakke
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <Link
              key={pack.id}
              href={`/admin/pakker/${pack.id}/kort`}
              className="group bg-white rounded-2xl p-5 shadow-sm border border-cream-dark/40 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl shrink-0"
                  style={{ backgroundColor: pack.farge }}
                />
                {!pack.aktiv && (
                  <span className="text-xs bg-forest/10 text-forest/50 px-2 py-0.5 rounded-full font-semibold">
                    Inaktiv
                  </span>
                )}
              </div>
              <h3 className="font-display font-black text-lg text-forest leading-tight">
                {pack.navn}
              </h3>
              <p className="text-sm text-forest/40 mt-1 font-medium">{pack.card_count} kort</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
